"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = connectToDb;
var csv = require("csv-parser");
var fs = require("node:fs");
var sqlite = require("sqlite3");
var db;
function connectToDb(databaseLocation) {
    console.log("Connecting to SQLite database...");
    if (!db) {
        db = new sqlite.Database(databaseLocation, function (err) {
            if (err) {
                console.error("Error connecting to SQLite:", err.message);
                return;
            }
            console.log("Connected to SQLite database.");
        });
    }
    return db;
}
function createTable(db) {
    db.run("CREATE TABLE IF NOT EXISTS credentialStatus(\n        id TEXT PRIMARY KEY, \n        status TEXT NOT NULL\n        ) STRICT", function (err) {
        if (err) {
            console.error("Error creating table:", err.message);
            return;
        }
        console.log("Credential Status table is ready.");
    });
}
function populateDb(db, filePath) {
    var insertStmt = db.prepare("INSERT INTO credentialStatus (id, status) VALUES (?, ?)");
    fs.createReadStream(filePath)
        .pipe(csv({
    // separator: ";"
    }))
        .on("data", function (row) {
        insertStmt.run([row.id, row.status], function (err) {
            if (err) {
                console.error("Error inserting row ".concat(JSON.stringify(row), ":"), err.message);
            }
        });
    })
        .on("end", function () {
        console.log("CSV file successfully processed.");
        insertStmt.finalize();
    })
        .on("error", function (err) {
        console.error("Error reading CSV file:", err.message);
    });
}
// export function initDB() {
//   connectToDb("./src/db/bfc.db");
//   createTable(db);
//   populateDb(db, "/Users/evanchristopher/Downloads/idSet.csv");
// }
