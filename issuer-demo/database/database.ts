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
    db.run(`CREATE TABLE IF NOT EXISTS credentialStatus(
        name TEXT NOT NULL,
        email_address TEXT NOT NULL,
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL
        ) STRICT`
        , (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
                return;
            }
            console.log('Credential Status table is ready.');
        }
    );
}

function populateDb(db: sqlite.Database, filePath: string) {
    const insertStmt = db.prepare('INSERT INTO credentialStatus (name,email_address,id,status) VALUES (?, ?, ?,?)');

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

//export async function initDB() {
    // export function initDB() {
 //  connectToDb("./bfc.db");
  //createTable(db);
 //  populateDb(db, "/Users/ichan-yeong/Downloads/idSet.csv");
// }
//}


//console.log("Calling initDB...");
//initDB().then(r => console.log("initDB done."));
