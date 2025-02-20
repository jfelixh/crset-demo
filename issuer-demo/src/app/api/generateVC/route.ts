import { Ed25519VerificationKey2020 } from "@digitalcredentials/ed25519-verification-key-2020";
import { Ed25519Signature2020 } from "@digitalcredentials/ed25519-signature-2020";
import { issue } from "@digitalcredentials/vc";
import documentLoader from "@/lib/documentLoader";
import * as database from "../../../../database/database";

async function createStatusEntry() {
  try {
    const response = await fetch(
      `http://${process.env.ISSUER_BACKEND_HOST}:${process.env.ISSUER_BACKEND_PORT}/api/status/createStatusEntry`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Response is not ok! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching status entry:", error);
    throw error; // Re-throws the error to be handled by the caller
  }
}

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  try {
    // for simplicity, we generate a new issuer key pair for each request
    // in a real scenario, the issuer would have a fixed key pair
    const keyPair = await Ed25519VerificationKey2020.generate();
    const suite = new Ed25519Signature2020({ key: keyPair });

    suite.verificationMethod =
      "did:key:" +
      keyPair.publicKeyMultibase +
      "#" +
      keyPair.publicKeyMultibase;
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
      type: ["VerifiableCredential", "EmploymentCredential"],
      issuer: `did:key:${keyPair.publicKeyMultibase}`,
      credentialSubject: {
        // in a real scenario, the id would be the employee's DID
        // for simplicity, we generate a dummy id here
        id: `did:example:${Math.random().toString(36).slice(2)}`,
        email: rawPayload.email,
        name: rawPayload.name,
        familyName: rawPayload.lastName,
        jobTitle: rawPayload.jobTitle,
        companyName: "ACME Inc.",
        comment: "I am just a test employment credential.",
        type: "EmploymentCredential",
      },
    };

    const result = await createStatusEntry();
    const credential = {
      ...credentialPayload,
      credentialStatus: {
        id: result.id,
        type: result.type,
        statusPurpose: result.statusPurpose,
      },
    };

    const name = rawPayload.name + " " + rawPayload.lastName;

    const signedCredential = await issue({
      credential: credential,
      suite,
      documentLoader,
    });

    const idx = await insertEmployee(
      name,
      rawPayload.email,
      rawPayload.jobTitle,
      JSON.stringify(signedCredential),
      rawPayload.manager,
      rawPayload.employmentType,
      0,
    ).catch((err) => {
      throw err;
    });

    const credentialOffer = {
      credential_issuer: process.env.NEXT_PUBLIC_URL + "/vci/" + idx,
      credential_configuration_ids: ["ProofOfEmploymentCredential"],
      grants: {
        "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
          "pre-authorized_code": "oaKazRN8I0IbtZ0C7JuMn5",
        },
      },
    };

    const qrData = `openid-credential-offer://?credential_offer=${encodeURIComponent(
      JSON.stringify(credentialOffer),
    )}`;

    return new Response(JSON.stringify({ credentialOffer: qrData }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error generating VC:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate Verifiable Credential" }),
      { status: 500 },
    );
  }
}

async function insertEmployee(
  name: string,
  email: string,
  jobTitle: string,
  VC: string,
  manager: string,
  employmentType: string,
  isPublished: number,
): Promise<string> {
  const db = await database.connectToDb();
  return new Promise((resolve, reject) => {
    db.exec("BEGIN;");
    db.run(
      "INSERT INTO companyDataBase (name,email,jobTitle,VC, manager, employmentType, isPublished) VALUES (?,?,?,?,?,?,?);",
      [name, email, jobTitle, VC, manager, employmentType, isPublished],
      (err: any) => {
        if (err) {
          console.error("Error inserting employee:", err.message);
          db.exec("ROLLBACK;");
          reject(err);
        } else {
          db.all(
            "SELECT MAX(rowid) AS id FROM companyDataBase;",
            [],
            (err: any, rows: any) => {
              if (err) {
                console.error("Error inserting employee:", err.message);
                db.exec("ROLLBACK;");
                reject(err);
              } else {
                db.exec("COMMIT;");
                resolve(rows[0].id);
              }
            },
          );
        }
      },
    );
  });
}
