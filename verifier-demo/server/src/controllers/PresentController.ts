import { keyToDID, keyToVerificationMethod } from "@spruceid/didkit-wasm-node";
import e, { Request, Response } from "express";
import * as jose from "jose";
import { getConfiguredLoginPolicy } from "src/config/loginPolicy";
import { redisGet, redisSet } from "src/config/redis";
import { checkRevocationStatus } from "src/lib/checkRevocationStatus";
import { generatePresentationDefinition } from "src/lib/generatePresentationDefinition";
import { getMetadata } from "src/lib/getMetadata";
import { verifyAuthenticationPresentation } from "src/lib/verifyPresentation";
import { EventEmitter } from "events";
import { WebSocketServer, WebSocket } from 'ws';

const emitter = new EventEmitter();
const wss = new WebSocketServer({ port: 8090 });
wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  // Forward events from the EventEmitter to the WebSocket client
  const handleEvent = (eventData: any) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(eventData));
    }
};

// Attach listener to the EventEmitter
emitter.on('progress', handleEvent);

// Handle client disconnection
ws.on('close', () => {
    console.log('Client disconnected');
    emitter.removeListener('progress', handleEvent);
});
});

export const generateWalletURL = async (req: Request, res: any) => {
  try {
    const challenge = crypto.randomUUID();
    const externalUrl = process.env.EXTERNAL_URL!;
    const walletUrl =
      "openid-vc://?client_id=" +
      keyToDID("key", process.env.DID_KEY_JWK!) +
      "&request_uri=" +
      encodeURIComponent(
        externalUrl + "/present/presentCredential?challenge=" + challenge
      );

    return res.status(200).json({
      message: "Wallet URL generated successfully",
      walletUrl: walletUrl,
      challenge,
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
      configuredPolicy!
    );
    console.log("Presentation Definition: " + presentation_definition);
    const did = keyToDID("key", process.env.DID_KEY_JWK!);
    const verificationMethod = await keyToVerificationMethod(
      "key",
      process.env.DID_KEY_JWK!
    );

    const { challenge } = req.query;
    console.log("Query: " + challenge);
    const stateChallenge = challenge as string;
    const payload = {
      client_id: did,
      client_id_scheme: "did",
      client_metadata_uri: process.env.EXTERNAL_URL + "/present/clientMetadata",
      nonce: challenge,
      presentation_definition,
      response_mode: "direct_post",
      response_type: "vp_token",
      response_uri: process.env.EXTERNAL_URL + "/present/presentCredential",
      state: stateChallenge,
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
    const challenge = presentation["proof"]["challenge"];

    // For now manually extract from ONLY the first VP
    const vc = Array.isArray(presentation.verifiableCredential)
      ? presentation.verifiableCredential
      : [presentation.verifiableCredential];
    console.log("VC: ", vc);

    const credSubject = vc[0]["credentialSubject"];
    console.log("Cred Subject: ", credSubject);

    // if employee cred, check revocation status
    // else cred is used for login so continue with the current flow
    if (vc[0]["type"].includes("EmploymentCredential")) {
      console.log("Checking Employee credential revocation status…");

      const isRevoked = await checkRevocationStatus(vc[0], emitter);
      if (isRevoked) {
        console.log("Employee credential is revoked");
        redisSet(`challenge:${challenge}`, "false", 3600);
        res.status(401).end();
        return;
      }

      console.log("Employee credential is valid");
      redisSet(`challenge:${challenge}`, JSON.stringify(credSubject), 3600); // Credential subject stored in Redis
      res.status(200).end();
      return;
    }
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
    redisSet(`challenge:${challenge}`, idToken, 3600); // Session (and JWT) last for 1 hour

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

export const presentCallback = async (req: Request, res: Response) => {
  console.log("presentCallback");
  try {
    const { challenge, isEmployeeCredential } = req.query;

    console.log("Query: " + challenge);
    if (!challenge) {
      res.status(400).end();
      return;
    }

    // If the request is for an employee credential, check in the cache if the credential was revoked
    if (isEmployeeCredential) {
      let isRevoked;
      try {
        isRevoked = await redisGet(`challenge:${challenge}`);
      } catch (error) {
        console.error("Error fetching revocation status from Redis:", error);
        res.status(404).json({
          error: "Session not found",
        });
        return;
      }

      // Req accepted, but still pending for a token to be stored in Redis after presenting the credential
      if (!isRevoked) {
        console.log("Session token not found");
        res.status(202).end();
        return;
      }

      if (isRevoked === "false") {
        console.log("Employee credential is revoked");
        res.status(401).end();
        return;
      }

      console.log("Employee credential is valid");
      res.status(200).json({ success: true, credential: isRevoked }); // Return the presented credential to the client
      return;
    }

    // Alternative login flow
    let idToken;
    try {
      idToken = await redisGet(`challenge:${challenge}`);
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

    // if an ID token is found, create a session
    req.session.token = idToken;
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
