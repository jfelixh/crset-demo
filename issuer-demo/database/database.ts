import * as sqlite from "sqlite3";
import * as fs from "node:fs";
import * as csv from 'csv-parser';
import * as path from 'path';


let db: sqlite.Database;


export function connectToDb(databaseLocation: string): Promise<sqlite.Database> {
    return new Promise((resolve, reject) => {
        if (!db) {
            const dbPath = path.resolve(process.cwd(), databaseLocation);
            console.log('Connecting to SQLite database:', dbPath);
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

function populateDbCompany(db: sqlite.Database, filePath: string) {
    const insertStmt = db.prepare('INSERT INTO companyDataBase (name,email,jobTitle,VC) VALUES ( ?,?,?,?)');
    fs.createReadStream(filePath)
        .pipe(
            csv({
                // separator: ";"
            })
        )
        .on("data", (row) => {
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
            const jobTitle = ["Software Engineer", "Accountant", "HR", "Manager", "Director", "Intern"]
            const vc = JSON.stringify({
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    {
                        "EmailPass": {
                            "@context": {
                                "@protected": true,
                                "@version": 1.1,
                                "email": "schema:email",
                                "id": "@id",
                                "issuedBy": {
                                    "@context": {
                                        "@protected": true,
                                        "@version": 1.1,
                                        "logo": {
                                            "@id": "schema:image",
                                            "@type": "@id"
                                        },
                                        "name": "schema:name"
                                    },
                                    "@id": "schema:issuedBy"
                                },
                                "schema": "https://schema.org/",
                                "type": "@type"
                            },
                            "@id": "https://github.com/TalaoDAO/context#emailpass"
                        }
                    }
                ],
                "id": "urn:uuid:c2ceaca0-8e9b-11ee-9aa4-0a5bad1dad00",
                "type": ["VerifiableCredential", "EmailPass"],
                "credentialSubject": {
                    "id": "did:key:z6MkkdC46uhBGjMYS2ZDLUwCrTWdaqZdTD3596sN4397oRNd",
                    "email": "felix.hoops@tum.de",
                    "type": "EmailPass",
                    "issuedBy": {
                        "name": "Altme"
                    }
                },
                "issuer": "did:web:app.altme.io:issuer",
                "issuanceDate": "2023-11-29T09:43:33Z",
                "proof": {
                    "type": "Ed25519Signature2018",
                    "proofPurpose": "assertionMethod",
                    "verificationMethod": "did:web:app.altme.io:issuer#key-1",
                    "created": "2023-11-29T09:43:33.482Z",
                    "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..wl9s4OXCG5vV_sDvxn0E8DmHqQ482e2BlKy-sRsIN9WSwO0ZTU3O75wnEl0PtAcwIFPz_3VIlpz9hjJcRUqABA"
                },
                "expirationDate": "2024-11-28T09:43:33.446349Z",
                "credentialStatus": [
                    {
                        "id": row.id,
                        "type": "BFCStatusEntry",
                        "statusPurpose": "revocation",
                        "statusPublisher": "<some sort of URL (CAIP-10)>"
                    }
                ]
            });
            insertStmt.run([name, email_address, jobTitle[Math.floor(Math.random() * 6)],vc], (err) => {
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
            insertStmt.run([row.id, row.status], (err) => {
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
            let email_address="";
            for (let i = 0; i < 10; i++) {
                email_address += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            email_address += "@bmw.de";
    
            insertStmt.run([name, email_address, row.id,row.status], (err) => {
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

export async function initDB() {
    // export function initDB() {
    console.log("creating Table")
    connectToDb("./bfc.db");
    //createTableCompany(db);
    //createTable(db)
  populateDb(db, "/Users/Natalia M/Desktop/Project/idSet.csv");
   //populateDbCompany(db, "/Users/Natalia M/Desktop/Project/idSet.csv");
// }
}

//initDB();


