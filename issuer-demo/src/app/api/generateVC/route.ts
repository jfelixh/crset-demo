import { Ed25519VerificationKey2020 } from "@digitalcredentials/ed25519-verification-key-2020";
import { Ed25519Signature2020 } from
  '@digitalcredentials/ed25519-signature-2020';
import { issue } from "@digitalcredentials/vc";
import documentLoader from "@/lib/documentLoader";
import Redis from "ioredis";
import * as sqlite from "sqlite3";
import * as database from "../../../../database/database";

let db: sqlite.Database;

async function createStatusEntry() {
  try {
    const response = await fetch(`http://localhost:5050/api/status/createStatusEntry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Response is not ok! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Revocation results:", data); // Logs the data for debugging
    return data; // Returns the actual data
  } catch (error) {
    console.error("Error fetching status entry:", error);
    throw error; // Re-throws the error to be handled by the caller
  }
}


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

   const result = await createStatusEntry();
   const credential = {...credentialPayload, "credentialStatus": [
    {
      id: result.id,
      type: result.type,
      statusPurpose: result.statusPurpose,
      statusPublisher: result.statusPublisher,
    },
  ],}
   console.log("credential",credential)

   await insertStatusEntry(rawPayload.name, rawPayload.email, result.id, "valid");

    const signedCredential = await issue({
      credential: credential,
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


export async function insertStatusEntry(
  name: string,
  email_address: string,
  id: string,
  status: string
): Promise<string> {
  console.log("Start inserting status entry");
  db = await database.connectToDb("database/bfc.db");
  console.log("Connected to SQLite database in insertStatusEntry", {db});
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO credentialStatus (name,email_address,id, status) VALUES (?,?,?, ?)",
      [name, email_address, id, status],
      (err) => {
        if (err) {
          console.error("Error inserting status entry:", err.message);
          console.error("Error inserting status entry:", err.message);
          reject(err);
          return "";
        }
        resolve(id);
      }
    );
  });
}

