import { keyToDID, keyToVerificationMethod } from "@spruceid/didkit-wasm-node";
import { Request, Response } from "express";
import * as jose from "jose";
import { getConfiguredLoginPolicy } from "src/config/loginPolicy";
import { checkRevocationStatus } from "src/lib/checkRevocationStatus";
import { isTrustedPresentation } from "src/lib/extractClaims";
import { generatePresentationDefinition } from "src/lib/generatePresentationDefinition";
import { getMetadata } from "src/lib/getMetadata";
import { verifyAuthenticationPresentation } from "src/lib/verifyPresentation";
// import { isRevoked } from "../../../../../bfc-status-check/src";
import { redisGet, redisSet } from "src/config/redis";

export const generateWalletURL = async (req: Request, res: any) => {
  try {
    const loginChallenge = crypto.randomUUID();
    const externalUrl = process.env.EXTERNAL_URL!;
    const walletUrl =
      "openid-vc://?client_id=" +
      keyToDID("key", process.env.DID_KEY_JWK!) +
      "&request_uri=" +
      encodeURIComponent(
        externalUrl + "/login/presentCredential?login_id=" + loginChallenge
      );

    return res.status(200).json({
      message: "Wallet URL generated successfully",
      walletUrl: walletUrl,
      login_id: loginChallenge,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const presentCredentialGet = async (req: Request, res: Response) => {
  console.log("presentCredentialGet");
  try {
    const configuredPolicy = getConfiguredLoginPolicy();
    console.log("Policy: " + configuredPolicy);

    const presentation_definition = generatePresentationDefinition(
      /* getConfiguredLoginPolicy()!, */
      configuredPolicy!
    );
    console.log("Presentation Definition: " + presentation_definition);
    const did = keyToDID("key", process.env.DID_KEY_JWK!);
    const verificationMethod = await keyToVerificationMethod(
      "key",
      process.env.DID_KEY_JWK!
    );

    const { login_id } = req.query;
    console.log("Query: " + login_id);
    const challenge = login_id as string;
    const payload = {
      client_id: did,
      client_id_scheme: "did",
      client_metadata_uri: process.env.EXTERNAL_URL + "/login/clientMetadata",
      nonce: challenge,
      presentation_definition,
      response_mode: "direct_post",
      response_type: "vp_token",
      response_uri: process.env.EXTERNAL_URL + "/login/presentCredential",
      state: challenge,
    };
    const privateKey = await jose.importJWK(
      JSON.parse(process.env.DID_KEY_JWK!),
      "EdDSA"
    );
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: "EdDSA",
        kid: verificationMethod,
        typ: "oauth-authz-req+jwt",
      })
      .setIssuedAt()
      .setIssuer(did)
      .setAudience("https://self-issued.me/v2") // by definition
      .setExpirationTime("1 hour")
      .sign(privateKey)
      .catch((err) => {
        console.log(err, "Failed signing presentation definition token");
        res.status(500).end();
      });
    res.status(200).json({
      token,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getClientMetadata = async (req: Request, res: Response) => {
  console.log("getClientMetadata");
  try {
    const { method } = req;
    // step 12
    if (method === "GET") {
      const metadata = getMetadata([
        //TODO: Add the correct URL (do we even need this?)
        process.env.PUBLIC_INTERNET_URL + "/api/dynamic/presentCredential",
      ]);
      // step 13
      console.log(JSON.stringify(metadata));
      res.status(200).json(metadata);
    } else {
      res.status(500).end();
    }
  } catch (e) {
    res.status(500).end();
  }
};

export const presentCredentialPost = async (req: Request, res: Response) => {
  console.log("presentCredentialPost");
  console.log(req.body);
  try {
    // Parse the JSON string into a JavaScript object
    const presentation = JSON.parse(req.body.vp_token);
    console.log(req.body.vp_token, "Verifiable Presentation was sent");

    //step 18
    // Verify the presentation and the status of the credential
    if (!(await verifyAuthenticationPresentation(presentation))) {
      // Evaluate if the VP should be trusted
      console.log("Verifiable Presentation invalid");
      res.status(500).end();
      return;
    }

    // step 19
    // Get the user claims
    // TODO: figure out why extract claims isn't working
    const login_id = presentation["proof"]["challenge"];
    // const userClaims = extractClaims(presentation);
    // const subject = presentation["holder"];

    // For now manually extract from ONLY the first VP
    const vc = Array.isArray(presentation.verifiableCredential)
      ? presentation.verifiableCredential
      : [presentation.verifiableCredential];
    console.log("VC: ", vc);

    // TODO: check here for the type of the VC
    // if employment cred, check revocation status
    // else cred is used for login so continue with the current flow
    const credSubject = vc[0]["credentialSubject"];

    // create a session by signing the user claims in to an ID token
    const privateKey = await jose.importJWK(
      JSON.parse(process.env.DID_KEY_JWK!),
      "EdDSA"
    );

    let idToken: string | void;
    try {
      idToken = await new jose.SignJWT({
        credentialSubject: credSubject,
      })
        .setProtectedHeader({
          alg: "EdDSA",
          typ: "JWT",
        })
        .setSubject(credSubject.id)
        .setIssuer("https://example.com")
        .setAudience("https://example.com")
        .setExpirationTime("1h")
        .sign(privateKey);
    } catch (err) {
      console.error(err, "Failed signing session token");
      res.status(500).end();
      return;
    }
    console.log("ID token: ", idToken);

    // Store the session token in Redis
    redisSet(`login_id:${login_id}`, idToken, 3600); // Session (and JWT) last for 1 hour

    console.log("User claims: ", credSubject);
    res.status(200).end();
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Extend the express session data to include a token
declare module "express-session" {
  interface SessionData {
    token: string;
    test: string;
  }
}

export const loginCallback = async (req: Request, res: Response) => {
  console.log("loginCallback");
  try {
    const { login_id } = req.query;

    console.log("Query: " + login_id);
    if (!login_id) {
      res.status(400).end();
      return;
    }

    let idToken;
    try {
      idToken = await redisGet(`login_id:${login_id}`);
      console.log("ID token: " + idToken);
    } catch (error) {
      console.error("Error fetching session token from Redis:", error);
      res.status(404).json({
        error: "Session not found",
      });
      return;
    }

    // Req accepted, but still pending for a token to be stored in Redis after presenting the credential
    if (!idToken) {
      console.log("Session token not found");
      res.status(202).end();
      return;
    }
    req.session.token = idToken;
    // if an ID token is found, create a session
    res.cookie("token", idToken, {
      httpOnly: false, // https://stackoverflow.com/questions/17508027/cant-access-cookies-from-document-cookie-in-js-but-browser-shows-cookies-exist
      secure: false,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ success: true, token: idToken });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};
