import * as csv from 'csv-parser';
import * as fs from "node:fs";
import * as sqlite from "sqlite3";

let db: sqlite.Database;

export function connectToDb(databaseLocation: string) {
  console.log("Connecting to SQLite database...");
  if (!db) {
    db = new sqlite.Database(databaseLocation, (err) => {
      if (err) {
        console.error("Error connecting to SQLite:", err.message);
        return;
      }
      console.log("Connected to SQLite database.");
    });
  }
  return db;
}

function createTable(db: sqlite.Database) {
  db.run(
    `CREATE TABLE IF NOT EXISTS credentialStatus(
        id TEXT PRIMARY KEY, 
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

function populateDb(db: sqlite.Database, filePath: string) {
  const insertStmt = db.prepare(
    "INSERT INTO credentialStatus (id, status) VALUES (?, ?)"
  );

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
}

// export function initDB() {
//   connectToDb("./src/db/bfc.db");
//   createTable(db);
//   populateDb(db, "/Users/evanchristopher/Downloads/idSet.csv");
// }
