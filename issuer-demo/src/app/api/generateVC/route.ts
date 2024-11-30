import { Ed25519VerificationKey2020 } from "@digitalcredentials/ed25519-verification-key-2020";
import { Ed25519Signature2020 } from
  '@digitalcredentials/ed25519-signature-2020';
import { issue } from "@digitalcredentials/vc";
import documentLoader from "@/lib/documentLoader";
import Redis from "ioredis";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      `Method ${req.method} Not Allowed`, 
      { status: 405, headers: { "Allow": "POST" } }
    );
  }

  let redis: Redis | undefined;

  try {
    redis = new Redis();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    return new Response(
      JSON.stringify({ error: "Redis connection failed" }),
      { status: 500 }
    );
  }
  
  try {

    // Needed for creating cryptographically secure proofs on the credential
    const keyPair = await Ed25519VerificationKey2020.generate();
    const suite = new Ed25519Signature2020({ key: keyPair });
  
    suite.verificationMethod = "did:key:" + keyPair.publicKeyMultibase + "#" + keyPair.publicKeyMultibase;
    const rawPayload = await req.json();
    const credentialPayload = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1",
        {
          EmploymentCredential: {
            "@context": {
              "@protected": true,
              "@version": 1.1,
              email: "schema:email",
              name: "schema:name",
              familyName: "schema:familyName",
              jobTitle: "schema:jobTitle",
              companyName: "schema:hiringOrganization",
            comment: "schema:Text",
            id: "@id",
            schema: "https://schema.org/",
            type: "@type",
            },
            "@id": "urn:employmentcredential",
          },
        },
      ],
      id: "urn:uuid:3978344f-344d-46a2-8556-1e67196186c6",
      type: ["VerifiableCredential", "EmploymentCredential"],
      issuer: `did:key:${keyPair.publicKeyMultibase}`,
      credentialSubject: {
        id: `did:example:${rawPayload.id || Math.random().toString(36).substr(2)}`,
        email: rawPayload.email,
        name: rawPayload.name,
        familyName: rawPayload.lastName,
        jobTitle: rawPayload.jobTitle,
        companyName: rawPayload.companyName,
        comment: "I am just a test credential.",
        type: "EmploymentCredential",
      },
    };
    
    const signedCredential = await issue({
      credential: credentialPayload,
      suite,
      documentLoader,
    });

    const uuid = crypto.randomUUID();
    const MAX_AGE = 300; // 300 seconds = 5min
    const EXPIRY_MS = "EX"; // seconds
    redis.set(
      "vc-" + uuid,
      JSON.stringify(signedCredential),
      EXPIRY_MS,
      MAX_AGE
    );

    return new Response(JSON.stringify({ vc: signedCredential, uuid: uuid }), { status: 200 });
  } catch (error) {
    console.error("Error generating VC:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate Verifiable Credential" }), 
      { status: 500 }
    );
  }
}
