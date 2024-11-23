import { Ed25519VerificationKey2020 } from "@digitalcredentials/ed25519-verification-key-2020";
import { Ed25519Signature2020 } from
  '@digitalcredentials/ed25519-signature-2020';
import { issue } from "@digitalcredentials/vc";
import documentLoader from "@/lib/documentLoader";
import { createJWT } from 'did-jwt'


export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      `Method ${req.method} Not Allowed`, 
      { status: 405, headers: { "Allow": "POST" } }
    );
  }

  try {
    const rawPayload = await req.json()
    const keyPair = await Ed25519VerificationKey2020.generate();
    const suite = new Ed25519Signature2020({ key: keyPair });
  
    suite.verificationMethod = "did:key:" + keyPair.publicKeyMultibase + "#" + keyPair.publicKeyMultibase;
    console.log("suite", JSON.stringify(suite))

    const credentialPayload = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential", "ProofOfEmploymentCredential"],
      credentialSubject: {
        //Does the user/issuer in the frontend needs to provide the did or it something that it is generated in the backend?
        id: `did:example:${rawPayload.id || Math.random().toString(36).substr(2)}`,
        name: rawPayload.name,
        lastName: rawPayload.lastName,
        email: rawPayload.email,
      },
      issuanceDate: new Date().toISOString(), 
      issuer: `did:key:${keyPair.publicKeyMultibase}`, 
    };
    console.log("Payload", credentialPayload)
  
     //Already put inside the credential Payload
    // credentialPayload.issuer = "did:key:" + keyPair.publicKeyMultibase;
   
    console.log("Signature Suite", JSON.stringify(suite));
    console.log("Document Loader:", documentLoader);
    console.log("Credential Payload:", JSON.stringify(credentialPayload));
    const signedCredential = await issue({
      credential: credentialPayload,
      suite,
      documentLoader,
    });

    // Store the signedCredential

    console.log("signedCredential", JSON.stringify(signedCredential))
  
    //USing JWT instead
    // const rawPayload = await req.json();

    // // Generate a key pair for signing
    // const keyPair = await Ed25519VerificationKey2020.generate();
    // const privateKey = keyPair.privateKeyMultibase;
    // const publicKey = keyPair.publicKeyMultibase;

    // // Prepare the JWT Header
    // const header = {
    //   alg: "EdDSA", // Algorithm
    //   typ: "JWT", // Token type
    // };

    // // Prepare the JWT Payload (VC Claims)
    // const payload = {
    //   sub: rawPayload.did || `did:example:${Math.random().toString(36).substr(2)}`, // Subject
    //   iss: `did:key:${publicKey}`, // Issuer
    //   iat: Math.floor(Date.now() / 1000), // Issued at (timestamp)
    //   nbf: Math.floor(Date.now() / 1000), // Not before (timestamp)
    //   vc: {
    //     "@context": ["https://www.w3.org/2018/credentials/v1"],
    //     type: ["VerifiableCredential", "ProofOfEmploymentCredential"],
    //     credentialSubject: {
    //       name: rawPayload.name,
    //       lastName: rawPayload.lastName,
    //       email: rawPayload.email,
    //     },
    //   },
    // };

    // // Sign the JWT with the private key
    // const signedJwt = await createJWT(payload, { key: keyPair.privateKey, header });

    // console.log("Signed JWT VC:", signedJwt);

    // // Return the signed JWT
    // return new Response(
    //   JSON.stringify({ jwt: signedJwt }, null, 2),
    //   {
    //     status: 200,
    //   }
    // );

    return new Response(JSON.stringify({ vc: signedCredential }), { status: 200 });
  } catch (error) {
    console.error("Error generating VC:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate Verifiable Credential" }), 
      { status: 500 }
    );
  }
}
