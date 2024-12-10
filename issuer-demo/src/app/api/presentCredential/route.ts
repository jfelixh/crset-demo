import { getConfiguredLoginPolicy } from "@/app/config/loginPolicy";
import { generatePresentationDefinition } from "@/lib/generatePresentationDefinition";
import { keyToDID, keyToVerificationMethod } from "@spruceid/didkit-wasm-node";
import jose from "jose"

export async function GET(req: Request) {
  console.log("presentCredentialGet");
  const url = new URL(req.url);
  const login_id = url.searchParams.get("login_id");
  console.log("login_id", login_id);
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

  //   const { login_id } = req.query;
  //   console.log("Query: " + login_id);
     const challenge = login_id as string;
    const payload = {
      client_id: did,
      client_id_scheme: "did",
      client_metadata_uri: process.env.NEXT_PUBLIC_URL + "/clientMetadata",
      nonce: challenge,
      presentation_definition,
      response_mode: "direct_post",
      response_type: "vp_token",
      response_uri: process.env.NEXT_PUBLIC_URL + "/presentCredential",
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
       // res.status(500).end();
       return new Response(JSON.stringify({ error: "Failed signing presentation definition token" }), { status: 500 });
      });
    // res.status(200).json({
    //   token,
    // });
    return new Response(JSON.stringify({token: token}), { status: 200 });
  } catch (error: any) {
    // res.status(500).json({
    //   error: error.message,
    // });
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};