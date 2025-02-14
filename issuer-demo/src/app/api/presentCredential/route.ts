import { getConfiguredLoginPolicy } from "@/app/config/loginPolicy";
import { generatePresentationDefinition } from "@/lib/generatePresentationDefinition";
import { keyToDID, keyToVerificationMethod } from "@spruceid/didkit-wasm";
import * as jose from "jose";
import configuredPolicy from "../../policies/acceptAnything.json"; //TODO change policy
import { verifyAuthenticationPresentation } from "@/lib/verifyPresentation";
import { redisGet, redisSet } from "../../config/redis";

export const GET = async (req: Request) => {
  try {
    //  console.log("presentCredentialGet");
    console.log(
      "Get the presentation definition to know the format of the VC that the wallet can present and the endpoint where the VP can be submitted",
    );
    const url = new URL(req.url);
    const login_id = url.searchParams.get("login_id");
    //   console.log("login_id", login_id);
    //  console.log("Policy: " + JSON.stringify(configuredPolicy, null, 2));

    const presentation_definition = generatePresentationDefinition(
      /* getConfiguredLoginPolicy()!, */
      configuredPolicy!,
    );
    // console.log("Presentation Definition: " + JSON.stringify(presentation_definition, null, 2));
    const did = keyToDID("key", process.env.DID_KEY_JWK!);
    const verificationMethod = await keyToVerificationMethod(
      "key",
      process.env.DID_KEY_JWK!,
    );

    //   const { login_id } = req.query;
    //   console.log("Query: " + login_id);
    const challenge = login_id as string;
    const payload = {
      client_id: did,
      client_id_scheme: "did",
      client_metadata_uri: process.env.NEXT_PUBLIC_URL + "/api/clientMetadata",
      nonce: challenge,
      presentation_definition,
      response_mode: "direct_post",
      response_type: "vp_token",
      response_uri: process.env.NEXT_PUBLIC_URL + "/api/presentCredential",
      state: challenge,
    };
    const privateKey = await jose.importJWK(
      JSON.parse(process.env.DID_KEY_JWK!),
      "EdDSA",
    );
    // console.log("Payload: " + JSON.stringify(payload, null, 2));
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
        // res.status(500).end();
        return new Response(
          JSON.stringify({
            error: "Failed signing presentation definition token",
          }),
          { status: 500 },
        );
      });
    // res.status(200).json({
    //   token,
    // });

    return new Response(JSON.stringify({ token: token }), { status: 200 });
  } catch (error: any) {
    // res.status(500).json({
    //   error: error.message,
    // });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const POST = async (req: Request) => {
  console.log(
    "Post the VP with a corresponding proof and let the verifier do the actual verification",
  );
  //  console.log("presentCredentialPost");
  //  console.log(req.body);
  try {
    const bodyText = await req.text();
    //console.log("Raw Body Text:", bodyText);

    // Parse the URL-encoded form data
    const params = new URLSearchParams(bodyText);
    const presentationString = params.get("vp_token");

    // Parse the JSON string into a JavaScript object

    //step 18
    // Verify the presentation and the status of the credential
    if (presentationString) {
      console.log("presenting");
      const presentation = JSON.parse(presentationString);
      if (!(await verifyAuthenticationPresentation(presentation))) {
        // Evaluate if the VP should be trusted
        console.log("Verifiable Presentation invalid");
        return new Response(JSON.stringify("Internal Server Error"), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
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
      // console.log("VC: ", vc);

      const credSubject = vc[0]["credentialSubject"];

      // create a session by signing the user claims in to an ID token
      const privateKey = await jose.importJWK(
        JSON.parse(process.env.DID_KEY_JWK!),
        "EdDSA",
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
      } catch (err: any) {
        console.error(err, "Failed signing session token");
        return new Response(
          JSON.stringify({ error: err.message || "Internal Server Error" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      //  console.log("ID token: ", idToken);

      // Store the session token in Redis

      redisSet(`login_id:${login_id}`, idToken, 3600); // Session (and JWT) last for 1 hour

      //  console.log("User claims: ", credSubject);
      return new Response(null, { status: 200 });
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
