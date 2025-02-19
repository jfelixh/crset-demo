import { redisGet, redisSet } from "@/config/redis";
import { checkRevocationStatus } from "@/lib/checkRevocationStatus";
import { getMetadata } from "@/lib/getMetadata";
import { verifyAuthenticationPresentation } from "@/lib/verifyPresentation";
import { keyToDID, keyToVerificationMethod } from "@spruceid/didkit-wasm-node";
import { EventEmitter } from "events";
import { Request, Response } from "express";
import * as jose from "jose";
import { WebSocket, WebSocketServer } from "ws";
import crypto from "crypto";

const emitter = new EventEmitter();
const wss = new WebSocketServer({ port: 8090 });
wss.on("listening", () => {
  console.log("WebSocket server started:", wss.address());
});
// Use client id to send events to the correct client
let clientId = "";
wss.on("connection", (ws: WebSocket, req) => {
  // Client identifier passed through the WebSocket protocol
  const protocols = req.headers["sec-websocket-protocol"];
  clientId = protocols ? protocols : "";
  console.log("Client connected: " + clientId);
  (ws as any).clientId = clientId;

  // Forward events from the EventEmitter to the correct WebSocket client
  const handleEvent = (eventData: any) => {
    wss.clients.forEach((client) => {
      if ((client as any).clientId === eventData.clientId) {
        ws.send(JSON.stringify(eventData));
      }
    });
  };

  // Attach listener to the EventEmitter
  emitter.on("progress", handleEvent);
  emitter.on("vcid", handleEvent);

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
    emitter.removeListener("progress", handleEvent);
    emitter.removeListener("vcid", handleEvent);
  });
});

export const generateWalletURL = async (req: Request, res: any) => {
  try {
    const challenge = crypto.randomUUID();
    const externalUrl = process.env.EXPRESS_PUBLIC_URL!;
    const walletUrl =
      "openid-vc://?client_id=" +
      keyToDID("key", process.env.DID_KEY_JWK!) +
      "&request_uri=" +
      encodeURIComponent(
        externalUrl + "/present/presentCredential?challenge=" + challenge,
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
    const presentation_definition = {
      format: {
        ldp_vc: {
          proof_type: [
            "JsonWebSignature2020",
            "Ed25519Signature2018",
            "EcdsaSecp256k1Signature2019",
            "RsaSignature2018",
          ],
        },
        ldp_vp: {
          proof_type: [
            "JsonWebSignature2020",
            "Ed25519Signature2018",
            "EcdsaSecp256k1Signature2019",
            "RsaSignature2018",
          ],
        },
      },
      id: crypto.randomUUID(),
      name: "M26 Demo Service",
      purpose: "Sign-in",
      input_descriptors: [
        {
          id: "anything_1",
          name: "Input descriptor for credential 1",
          purpose: "Sign-in",
          constraints: {
            fields: [
              {
                path: ["$.type"],
                filter: {
                  type: "string",
                  pattern: "EmploymentCredential",
                },
              },
            ],
          },
        },
      ],
    };

    const did = keyToDID("key", process.env.DID_KEY_JWK!);
    const verificationMethod = await keyToVerificationMethod(
      "key",
      process.env.DID_KEY_JWK!,
    );

    const { challenge } = req.query;
    console.log("Query: " + challenge);
    const stateChallenge = challenge as string;
    const payload = {
      client_id: did,
      client_id_scheme: "did",
      client_metadata_uri: process.env.EXPRESS_PUBLIC_URL + "/present/clientMetadata",
      nonce: challenge,
      presentation_definition,
      response_mode: "direct_post",
      response_type: "vp_token",
      response_uri: process.env.EXPRESS_PUBLIC_URL + "/present/presentCredential",
      state: stateChallenge,
    };
    const privateKey = await jose.importJWK(
      JSON.parse(process.env.DID_KEY_JWK!),
      "EdDSA",
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
        process.env.EXPRESS_PUBLIC_URL + "/present/presentCredential",
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

    const isRevoked = await checkRevocationStatus(vc[0], emitter, clientId);
    if (isRevoked) {
      console.log("VC is revoked");
      redisSet(`challenge:${challenge}`, "revoked", 3600);
      res.status(401).end();
      return;
    }

    console.log("VC is valid");
    redisSet(`challenge:${challenge}`, "valid:"+JSON.stringify(credSubject), 3600);
    res.status(200).end();
    return;
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const presentCallback = async (req: Request, res: Response) => {
  console.log("presentCallback");
  try {
    const { challenge } = req.query;

    console.log("Query: " + challenge);
    if (!challenge) {
      res.status(400).end();
      return;
    }

    // check in the cache if the credential was revoked
    let isRevoked;
    try {
      isRevoked = await redisGet(`challenge:${challenge}`);
    } catch (error) {
      console.error("Error fetching revocation status from Redis:", error);
      res.status(404).json({
        error: "Challenge not found",
      });
      return;
    }

    // Req accepted, but still pending for a token to be stored in Redis
    if (!isRevoked) {
      console.log("Challenge token not found");
      res.status(202).end();
      return;
    }

    if (isRevoked === "revoked") {
      console.log("VC is revoked");
      res.status(401).end();
      return;
    }

    console.log("VC is valid");
    res.status(200).json({ success: true, credential: isRevoked.substring(6) });
    return;
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};
