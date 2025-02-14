//TODO Delete this

import csv from "csv-parser";
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

function populateDb(db: Database, filePath: string) {
  const insertStmt = db.prepare(
    "INSERT INTO credentialStatus (id,status) VALUES ( ?,?)",
  );
  fs.createReadStream(filePath)
    .pipe(csv())
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
