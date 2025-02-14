//TODO Delete this

import * as csv from "csv-parser";
import * as fs from "node:fs";
import * as path from "path";
import { Database } from "sqlite3";
import { Config, names, uniqueNamesGenerator } from "unique-names-generator";

const config: Config = {
  dictionaries: [names],
};

let db: Database;

export function connectToDb(databaseLocation: string): Promise<Database> {
  return new Promise((resolve, reject) => {
    if (!db) {
      const dbPath = path.resolve(process.cwd(), databaseLocation);
      db = new Database(dbPath, (err) => {
        if (err) {
          console.error("Error connecting to SQLite:", err.message);
          reject(err);
        } else {
          console.log("Connected to SQLite database.");
          resolve(db);
        }
      });
    } else {
      resolve(db);
    }
  });
}

function createTable(db: Database) {
  db.run(
    `CREATE TABLE IF NOT EXISTS credentialStatus
         (
             id     TEXT PRIMARY KEY,
             status INTEGER NOT NULL
         ) STRICT`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
        return;
      }
      console.log("Credential Status table is ready.");
    },
  );
}

function createTableCompany(db: Database) {
  console.log("Creating companyDataBase table...");
  db.run(
    `CREATE TABLE IF NOT EXISTS companyDataBase
         (
             name     TEXT NOT NULL,
             email    TEXT PRIMARY KEY,
             jobTitle TEXT NOT NULL,
             VC       TEXT NOT NULL,
             manager  TEXT NOT NULL,
             employmentType TEXT NOT NULL,
             isPublished INTEGER NOT NULL
         ) STRICT`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
        return;
      }
      console.log("companyDataBase table is ready.");
    },
  );
}

function clearTableCompany(db: Database) {
  console.log("Clearing content of companyDataBase table...");
  db.run(`DELETE FROM companyDataBase`, (err) => {
    if (err) {
      console.error("Error clearing table content:", err.message);
      return;
    }
    console.log("companyDataBase table is now empty.");
  });
}

function clearCredentialStatusTable(db: Database) {
  console.log("Clearing content of credentialStatus table...");
  db.run(`DELETE FROM credentialStatus`, (err) => {
    if (err) {
      console.error("Error clearing table content:", err.message);
      return;
    }
    console.log("credentialStatus table is now empty.");
  });
}

function populateDbCompany(db: Database, filePath: string) {
  const insertStmt = db.prepare(
    "INSERT INTO companyDataBase (name,email,jobTitle,VC,manager, employmentType, isPublished) VALUES ( ?,?,?,?,?,?,?)",
  );
  fs.createReadStream(filePath)
    .pipe(
      csv({
        // separator: ";"
      }),
    )
    .on("data", async (row) => {
      const firstName = await uniqueNamesGenerator(config);
      const lastName = await uniqueNamesGenerator(config);
      const name = firstName + " " + lastName;
      const email_address =
        firstName.toLowerCase() + "." + lastName.toLowerCase() + "@cmw.de";
      const jobTitle = [
        "Software Engineer",
        "Accountant",
        "HR",
        "Manager",
        "Director",
        "Intern",
      ];
      const manager = "Sarah Smith";
      const employmentType = ["Full Time", "Part Time", "Intern"];
      const vc = JSON.stringify({
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
          "https://w3id.org/security/suites/ed25519-2020/v1",
        ],
        id: "urn:uuid:0579c3ec-143a-44f8-9d15-b2d396fe4e07",
        type: ["VerifiableCredential", "EmploymentCredential"],
        issuer: "did:key:z6Mkii9oRJhUyQNBS3LXbCHSCv2vXkzD8NUbmL1KrSQ8t6YM",
        credentialSubject: {
          id: row.id,
          email: `${email_address}`,
          name: `${firstName}`,
          familyName: `${lastName}`,
          jobTitle: `${jobTitle}`,
          companyName: "CMW Group",
          comment: "I am just a test employment credential.",
          type: "EmploymentCredential",
        },
        credentialStatus: {
          id:
            "urn:eip155:1:0x32328bfaea51ce120db44f7755a1170e9cc43653:" + row.id,
          type: "BFCStatusEntry",
          statusPurpose: "revocation",
        },
        issuanceDate: "2024-12-12T16:27:32Z",
        proof: {
          type: "Ed25519Signature2020",
          created: "2024-12-12T16:27:32Z",
          verificationMethod:
            "did:key:z6Mkii9oRJhUyQNBS3LXbCHSCv2vXkzD8NUbmL1KrSQ8t6YM#z6Mkii9oRJhUyQNBS3LXbCHSCv2vXkzD8NUbmL1KrSQ8t6YM",
          proofPurpose: "assertionMethod",
          proofValue:
            "z2U2LHtQYhY7s6T9UHvpQs2aPdQsxk2UcPdWm1AF3pFfEUmhFDEvBkiqBnGcKiiPzBoof2j5acVpqSy3eoy9opSBD",
        },
      });
      insertStmt.run(
        [
          name,
          email_address,
          jobTitle[Math.floor(Math.random() * 6)],
          vc,
          manager,
          employmentType[Math.floor(Math.random() * 3)],
          0,
        ],
        (err) => {
          if (err) {
            console.error(
              `Error inserting rowsss ${JSON.stringify(row)}:`,
              err.message,
            );
          }
        },
      );
    })
    .on("end", () => {
      console.log("CSV file successfully processed.");
      insertStmt.finalize();
    })
    .on("error", (err: any) => {
      console.error("Error reading CSV file:", err.message);
    });
}

function populateDb(db: Database, filePath: string) {
  const insertStmt = db.prepare(
    "INSERT INTO credentialStatus (id,status) VALUES ( ?,?)",
  );
  fs.createReadStream(filePath)
    .pipe(
      csv({
        // separator: ";"
      }),
    )
    .on("data", (row) => {
      const credentialStatusId =
        "urn:eip155:1:0x32328bfaea51ce120db44f7755a1170e9cc43653:" + row.id;
      insertStmt.run([credentialStatusId, row.status], (err) => {
        if (err) {
          console.error(
            `Error inserting row ${JSON.stringify(row)}:`,
            err.message,
          );
        }
      });
    })
    .on("end", () => {
      console.log("CSV file successfully processed.");
      insertStmt.finalize();
    })
    .on("error", (err) => {
      console.error("Error reading CSV file:", err.message);
    });
}

function deleteUserByEmail(db: Database, email: string) {
  db.get(
    "SELECT email FROM companyDataBase WHERE email = ?",
    [email],
    (err, row) => {
      if (err) {
        console.error("Error checking email existence:", err.message);
        return;
      }

      if (!row) {
        console.log(`No user found with email: ${email}`);
      } else {
        // Delete the user if the email exists
        const deleteStmt = db.prepare(
          "DELETE FROM companyDataBase WHERE email = ?",
        );
        deleteStmt.run([email], (err) => {
          if (err) {
            console.error(`Error deleting user: ${err.message}`);
          } else {
            console.log(`User with email ${email} successfully deleted.`);
          }
        });
        deleteStmt.finalize();
      }
    },
  );
}

function createBfcLogsTable(db: Database) {
  db.run(
    `CREATE TABLE IF NOT EXISTS bfcLogs (
            validIdsSize INTEGER NOT NULL,
            invalidIdsSize INTEGER NOT NULL,
            serializedDataSize INTEGER NOT NULL,
            constructionTimeInSec REAL NOT NULL,
            publicationTimeInSec REAL NOT NULL,
            numberOfBlobs INTEGER NOT NULL,
            transactionHash TEXT PRIMARY KEY NOT NULL,
            blobVersionedHash TEXT NOT NULL,
            publicationTimestamp TEXT NOT NULL,
            transactionCost REAL NOT NULL,
            calldataTotalCost REAL NOT NULL,
            numberOfBfcLayers INTEGER NOT NULL,
            rHat REAL NOT NULL
        ) STRICT`,
    (err) => {
      if (err) {
        console.error("Error creating bfcLogs table:", err.message);
        return;
      }
      console.log("bfcLogs table is ready.");
    },
  );
}

function clearLogsTable(db: Database) {
  console.log("Clearing content of bfcLogs table...");
  db.run(`DELETE FROM bfcLogs`, (err) => {
    if (err) {
      console.error("Error clearing table content:", err.message);
      return;
    }
    console.log("bfcLogs table is now empty.");
  });
}

function deleteBFCLogsTable(db: Database) {
  console.log("Clearing content of bfcLogs table...");
  db.run(`DROP TABLE IF EXISTS bfcLogs`, (err) => {
    if (err) {
      console.error("Error deleting table content:", err.message);
      return;
    }
    console.log("bfcLogs table is deleted.");
  });
}

function deleteCompanyTable(db: Database) {
  console.log("Clearing content of companyDataBase table...");
  db.run(`DROP TABLE IF EXISTS companyDataBase`, (err) => {
    if (err) {
      console.error("Error deleting table content:", err.message);
      return;
    }
    console.log("companyDataBase table is deleted.");
  });
}
export default function updatePublishById(
  db: Database,
  email: string,
  isPublished: number,
): Promise<void> {
  console.log("Updating publish status for VC with email:", email);
  return new Promise(async (resolve, reject) => {
    await db.run(
      "UPDATE companyDataBase SET isPublished = ? WHERE email = ?",
      [isPublished, email],
      (err) => {
        if (err) {
          console.error("Error updating status:", err.message);
          reject(err);
          return;
        }
        resolve();
      },
    );
  });
}

export async function initDB() {
  // export function initDB() {
  console.log("creating Table");
  console.log("Initializing database...");
  connectToDb("../data/bfc.db");
  //createBfcLogsTable(db)
  // deleteBFCLogsTable(db)
  //createTable(db);
  //createTableCompany(db);
  populateDb(db, "./test_data_540000.csv");
  //populateDbCompany(db, "./test_data_540000.csv");
  // }
}

//initDB()
