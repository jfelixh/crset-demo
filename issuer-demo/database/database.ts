import sqlite from "sqlite3";
import fs from "node:fs";
import csv from 'csv-parser';
import * as path from 'path';
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';

const config: Config = {
    dictionaries: [names]
}

let db: sqlite.Database;


export function connectToDb(databaseLocation: string): Promise<sqlite.Database> {
    return new Promise((resolve, reject) => {
        if (!db) {
            const dbPath = path.resolve(process.cwd(), databaseLocation);
            console.log('Connecting to SQLite database with path:', dbPath);
            db = new sqlite.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error connecting to SQLite:', err.message);
                    reject(err);
                } else {
                    console.log('Connected to SQLite database.');
                    resolve(db);
                }
            });
        } else {
            resolve(db);
        }
    });
}

function createTable(db: sqlite.Database) {
    db.run(
        `CREATE TABLE IF NOT EXISTS credentialStatus
         (
             id     TEXT PRIMARY KEY,
             status TEXT NOT NULL
         ) STRICT`,
        (err) => {
            if (err) {
                console.error("Error creating table:", err.message);
                return;
            }
            console.log("Credential Status table is ready.");
        }
    );
}

function createTableCompany(db: sqlite.Database) {
    console.log("Creating companyDataBase table...");
    db.run(
        `CREATE TABLE IF NOT EXISTS companyDataBase
         (
             name     TEXT NOT NULL,
             email    TEXT PRIMARY KEY,
             jobTitle TEXT NOT NULL,
             VC       TEXT NOT NULL
         ) STRICT`,
        (err) => {
            if (err) {
                console.error("Error creating table:", err.message);
                return;
            }
            console.log("companyDataBase table is ready.");
        }
    );
}

function clearTableCompany(db: sqlite.Database) {
    console.log("Clearing content of companyDataBase table...");
    db.run(`DELETE FROM companyDataBase`, (err) => {
        if (err) {
            console.error("Error clearing table content:", err.message);
            return;
        }
        console.log("companyDataBase table is now empty.");
    });
}

function clearCredentialStatusTable(db: sqlite.Database) {
    console.log("Clearing content of credentialStatus table...");
    db.run(`DELETE FROM credentialStatus`, (err) => {
        if (err) {
            console.error("Error clearing table content:", err.message);
            return;
        }
        console.log("credentialStatus table is now empty.");
    });
}

function populateDbCompany(db: sqlite.Database, filePath: string) {
    const insertStmt = db.prepare('INSERT INTO companyDataBase (name,email,jobTitle,VC) VALUES ( ?,?,?,?)');
    fs.createReadStream(filePath)
        .pipe(
            csv({
                // separator: ";"
            })
        )
        .on("data", async (row) => {
            const firstName = await uniqueNamesGenerator(config);
            const lastName = await uniqueNamesGenerator(config);
            const name = firstName + " " + lastName;
            const email_address = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@cmw.de";
            const jobTitle = ["Software Engineer", "Accountant", "HR", "Manager", "Director", "Intern"]
            const vc = JSON.stringify({ "@context": ["https://www.w3.org/2018/credentials/v1", { "BFCStatusEntry": { "@context": { "@protected": true, "id": "@id", "type": "@type", "statusPurpose": "schema:Text", "schema": "https://schema.org/" }, "@id": "urn:bfcstatusentry" }, "EmploymentCredential": { "@context": { "@protected": true, "@version": 1.1, "email": "schema:email", "name": "schema:name", "familyName": "schema:givenName", "jobTitle": "schema:jobTitle", "companyName": "schema:legalName", "comment": "schema:Text", "id": "@id", "schema": "https://schema.org/", "type": "@type" }, "@id": "urn:employmentcredential" } }, "https://w3id.org/security/suites/ed25519-2020/v1"], "id": "urn:uuid:0579c3ec-143a-44f8-9d15-b2d396fe4e07", "type": ["VerifiableCredential", "EmploymentCredential"], "issuer": "did:key:z6Mkii9oRJhUyQNBS3LXbCHSCv2vXkzD8NUbmL1KrSQ8t6YM", "credentialSubject": { "id": row.id, "email": `${email_address}`, "name": `${firstName}`, "familyName": `${lastName}`, "jobTitle": `${jobTitle}`, "companyName": "CMW Group", "comment": "I am just a test employment credential.", "type": "EmploymentCredential" }, "credentialStatus": { "id": "urn:eip155:1:0x32328bfaea51ce120db44f7755a1170e9cc43653:" + row.id, "type": "BFCStatusEntry", "statusPurpose": "revocation" }, "issuanceDate": "2024-12-12T16:27:32Z", "proof": { "type": "Ed25519Signature2020", "created": "2024-12-12T16:27:32Z", "verificationMethod": "did:key:z6Mkii9oRJhUyQNBS3LXbCHSCv2vXkzD8NUbmL1KrSQ8t6YM#z6Mkii9oRJhUyQNBS3LXbCHSCv2vXkzD8NUbmL1KrSQ8t6YM", "proofPurpose": "assertionMethod", "proofValue": "z2U2LHtQYhY7s6T9UHvpQs2aPdQsxk2UcPdWm1AF3pFfEUmhFDEvBkiqBnGcKiiPzBoof2j5acVpqSy3eoy9opSBD" } });
            insertStmt.run([name, email_address, jobTitle[Math.floor(Math.random() * 6)], vc], (err) => {
                if (err) {
                    console.error(
                        `Error inserting rowsss ${JSON.stringify(row)}:`,
                        err.message
                    );
                }
            });
        })
        .on("end", () => {
            console.log("CSV file successfully processed.");
            insertStmt.finalize();
        })
        .on("error", (err: any) => {
            console.error("Error reading CSV file:", err.message);
        });
}

function populateDb(db: sqlite.Database, filePath: string) {
    const insertStmt = db.prepare('INSERT INTO credentialStatus (id,status) VALUES ( ?,?)');
    fs.createReadStream(filePath)
        .pipe(
            csv({
                // separator: ";"
            })
        )
        .on("data", (row) => {
            const credentialStatusId = "urn:eip155:1:0x32328bfaea51ce120db44f7755a1170e9cc43653:" + row.id;
            insertStmt.run([credentialStatusId, row.status], (err) => {
                if (err) {
                    console.error(
                        `Error inserting row ${JSON.stringify(row)}:`,
                        err.message
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
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            let name = "";
            for (let i = 0; i < 10; i++) {
                name += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            let email_address = "";
            for (let i = 0; i < 10; i++) {
                email_address += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            email_address += "@bmw.de";

            insertStmt.run([name, email_address, row.id, row.status], (err) => {
                if (err) {
                    console.error(`Error inserting row ${JSON.stringify(row)}:`, err.message);
                }
            });
        })
        .on('end', () => {
            console.log('CSV file successfully processed.');
            insertStmt.finalize();
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err.message);
        });
}

//create VC using the /credential Issuance
// scan the vc and insert it here
//use the same credential you have in your wallet to login
// after creating an admin delete the user you created in the companyDatabase when issuing the VC

function createAdmin(db: sqlite.Database) {
    const insertStmt = db.prepare('INSERT INTO companyDataBase (name,email,jobTitle,VC) VALUES ( ?,?,?,?)');
    const insertStmt2 = db.prepare('INSERT INTO credentialStatus (id,status) VALUES ( ?,?)');

    const name = "Natalia"
    const familyName = "Milanova"
    const email_address = "natalia.m@cmw.de"
    const jobTitle = "admin"
    const credentialSubjectId = "did:example:ohjfleskel"
    const status = "Valid"
    const vc = JSON.stringify({ "@context": ["https://www.w3.org/2018/credentials/v1", { "BFCStatusEntry": { "@context": { "@protected": true, "id": "@id", "type": "@type", "statusPurpose": "schema:Text", "schema": "https://schema.org/" }, "@id": "urn:bfcstatusentry" }, "EmploymentCredential": { "@context": { "@protected": true, "@version": 1.1, "email": "schema:email", "name": "schema:name", "familyName": "schema:givenName", "jobTitle": "schema:jobTitle", "companyName": "schema:legalName", "comment": "schema:Text", "id": "@id", "schema": "https://schema.org/", "type": "@type" }, "@id": "urn:employmentcredential" } }, "https://w3id.org/security/suites/ed25519-2020/v1"], "id": "urn:uuid:90d5d148-84b0-4edf-815f-efc24cb549da", "type": ["VerifiableCredential", "EmploymentCredential"], "issuer": "did:key:z6MkjtA4jt4wzUnxYw3fbYkY94PxHZBe8CxTpGKWk2VkH81g", "credentialSubject": { "id": `${credentialSubjectId}`, "email": `${email_address}`, "name": `${name}`, "familyName": `${familyName}`, "jobTitle": `${jobTitle}`, "companyName": "CMW Group", "comment": "I am just a test employment credential.", "type": "EmploymentCredential" }, "credentialStatus": { "id": "urn:eip155:1:0x32328bfaea51ce120db44f7755a1170e9cc43653:55ce299cfb7348e85d4dca2fd0158520f93c310a1fa6c30eba98095dfcf5e1c55ad059b13718ba5c12fe14668f214101036e99975e24ccc487fc2c7b99eedd34", "type": "BFCStatusEntry", "statusPurpose": "revocation" }, "issuanceDate": "2024-12-13T17:04:27Z", "proof": { "type": "Ed25519Signature2020", "created": "2024-12-13T17:04:27Z", "verificationMethod": "did:key:z6MkjtA4jt4wzUnxYw3fbYkY94PxHZBe8CxTpGKWk2VkH81g#z6MkjtA4jt4wzUnxYw3fbYkY94PxHZBe8CxTpGKWk2VkH81g", "proofPurpose": "assertionMethod", "proofValue": "z3dvtZsdeTZafy7DXB6UwvJm8Z8ypEu7DvGTKf3S8XSnK9Sxi444T2prEU9q3C8GLtpXXU739U9jcjF5CrbVa9ys4" } });
    insertStmt.run([name, email_address, jobTitle, vc], (err) => {
        if (err) {
            console.error(`Error inserting admin into companyDataBase: ${err.message}`);
        } else {
            console.log("Admin inserted into companyDataBase successfully.");
        }
    });

    insertStmt2.run([credentialSubjectId, status], (err) => {
        if (err) {
            console.error(`Error inserting admin into credentialStatus table: ${err.message}`);
        } else {
            console.log("Admin inserted into credentialStatus table successfully.");
        }
    });
}

function deleteUserByEmail(db: sqlite.Database, email: string) {
    db.get('SELECT email FROM companyDataBase WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error("Error checking email existence:", err.message);
            return;
        }

        if (!row) {
            console.log(`No user found with email: ${email}`);
        } else {
            // Delete the user if the email exists
            const deleteStmt = db.prepare('DELETE FROM companyDataBase WHERE email = ?');
            deleteStmt.run([email], (err) => {
                if (err) {
                    console.error(`Error deleting user: ${err.message}`);
                } else {
                    console.log(`User with email ${email} successfully deleted.`);
                }
            });
            deleteStmt.finalize();
        }
    });
}


export async function initDB() {
    // export function initDB() {
    console.log("creating Table")
    console.log("Initializing database...");
    connectToDb("./bfc.db");
    //clearCredentialStatusTable(db)
    // deleteUserByEmail(db, "natalia.m@gmail.com");
    //createAdmin(db)
    // clearTableCompany(db)
    // createTableCompany(db);
    // createTable(db)
    //clearCredentialStatusTable(db)
    // populateDb(db, "/Users/Natalia M/Desktop/Project/idSet.csv");
    // populateDbCompany(db, "/Users/Natalia M/Desktop/Project/idSet.csv");
    // }
}

//initDB();


