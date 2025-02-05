import { Ed25519VerificationKey2020 } from "@digitalcredentials/ed25519-verification-key-2020";
import { Ed25519Signature2020 } from
  '@digitalcredentials/ed25519-signature-2020';
import { issue } from "@digitalcredentials/vc";
import documentLoader from "@/lib/documentLoader";
import {redisSet} from "@/app/config/redis";
import * as sqlite from "sqlite3";
import * as database from "../../../../database/database";

let db: sqlite.Database;

async function createStatusEntry() {
  try {
    const response = await fetch(`http://bfc-issuer-backend:5050/api/status/createStatusEntry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Response is not ok! status: ${response.status}`);
    }
    const data = await response.json();
  //  console.log("Revocation results:", data); // Logs the data for debugging
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

  try {

    // Needed for creating cryptographically secure proofs on the credential
    const keyPair = await Ed25519VerificationKey2020.generate();
    const suite = new Ed25519Signature2020({ key: keyPair });
  
    suite.verificationMethod = "did:key:" + keyPair.publicKeyMultibase + "#" + keyPair.publicKeyMultibase;
    const rawPayload = await req.json();
 
    const credentialPayload = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
          BFCStatusEntry: {
            "@context": {
              "@protected": true,
              id: "@id",
              type: "@type",
              statusPurpose: "schema:Text",
              schema: "https://schema.org/",
            },
            "@id": "urn:bfcstatusentry",
          },
          EmploymentCredential: {
            "@context": {
              "@protected": true,
              "@version": 1.1,
              email: "schema:email",
              name: "schema:name",
              familyName: "schema:givenName",
              jobTitle: "schema:jobTitle",
              companyName: "schema:legalName",
              comment: "schema:Text",
              id: "@id",
              schema: "https://schema.org/",
              type: "@type",
            },
            "@id": "urn:employmentcredential",
          },
        },
      ],
      id: "urn:uuid:" + crypto.randomUUID(),
      type: ["VerifiableCredential", "EmploymentCredential",],
      issuer: `did:key:${keyPair.publicKeyMultibase}`,
      credentialSubject: {
        id: `did:example:${Math.random().toString(36).substr(2)}`, //crypto.randomUUID(),
        email: rawPayload.email,
        name: rawPayload.name,
        familyName: rawPayload.lastName,
        jobTitle: rawPayload.jobTitle,
        companyName: "CMW Group",
        comment: "I am just a test employment credential.",
        type: "EmploymentCredential",
      },
    };

   const result = await createStatusEntry();
   const credential = {...credentialPayload, credentialStatus: 
    {
      id: result.id,
      type: result.type,
      statusPurpose: result.statusPurpose,
    }
  }

    const name = rawPayload.name + " " + rawPayload.lastName;
   
    const signedCredential = await issue({
      credential: credential,
      suite,
      documentLoader,
    });

   // console.log("Start inserting into database")
  //  db = await database.connectToDb("database/bfc.db");
    await insertEmployee(name, rawPayload.email, rawPayload.jobTitle, JSON.stringify(signedCredential), rawPayload.manager, rawPayload.employmentType, 0);
  //  console.log("Finished inserting into database")

    const uuid = crypto.randomUUID();
    const MAX_AGE = 300; // 300 seconds = 5min
    const EXPIRY_MS = "EX"; // seconds
    redisSet(
      "vc-" + uuid,
      JSON.stringify(signedCredential),
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


export async function insertEmployee(
  name: string,
  email: string,
  jobTitle: string,
  VC: string,
  manager: string,
  employmentType: string,
  isPublished: number,
): Promise<string> {
 // console.log("Start inserting employee into companyDataBase");
  db = await database.connectToDb("data/bfc.db");
  //await logDatabaseTables(db); 
 // console.log("Connected to SQLite database in companyDataBase", { db });
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO companyDataBase (name,email,jobTitle,VC, manager, employmentType, isPublished) VALUES (?,?,?,?,?,?,?)",
      [name, email, jobTitle, VC, manager, employmentType, isPublished],
      (err) => {
        if (err) {
          console.error("Error inserting employee:", err.message);
          reject(err);
          return "";
        }
       // console.log("Employee inserted successfully with email_address:", email);
        db.all("SELECT * FROM companyDataBase", [], (err, rows) => {
          if (err) {
            console.error("Error fetching data:", err.message);
          } else {
            console.log("Current table content:", rows);
          }
        });
        resolve(email);
      }
    );
  });
}

export async function logDatabaseTables(db: sqlite.Database): Promise<void> {
  try {
   // console.log("Fetching tables from the database...");
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
      if (err) {
        console.error("Error fetching tables:", err.message);
        return;
      }
      if (rows.length === 0) {
        console.log("No tables found in the database.");
      } else {
        console.log("Tables in the database:");
        rows.forEach((row) => console.log(row.name));
      }
    });
  } catch (error) {
    console.error("Error logging database tables:", error.message);
  }
}


