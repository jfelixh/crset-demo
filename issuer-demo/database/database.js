"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = connectToDb;
exports.initDB = initDB;
var sqlite = require("sqlite3");
var fs = require("node:fs");
var csv = require("csv-parser");
var path = require("path");
var db;
function connectToDb(databaseLocation) {
    return new Promise(function (resolve, reject) {
        console.log("Test connection to db");
        if (!db) {
            var dbPath = path.resolve(process.cwd(), databaseLocation);
            console.log('Connecting to SQLite database:', dbPath);
            db = new sqlite.Database(dbPath, function (err) {
                if (err) {
                    console.error('Error connecting to SQLite:', err.message);
                    reject(err);
                }
                else {
                    console.log('Connected to SQLite database.');
                    resolve(db);
                }
            });
        }
        else {
            resolve(db);
        }
    });
}
function createTable(db) {
    db.run("CREATE TABLE IF NOT EXISTS credentialStatus\n         (\n             id     TEXT PRIMARY KEY,\n             status TEXT NOT NULL\n         ) STRICT", function (err) {
        if (err) {
            console.error("Error creating table:", err.message);
            return;
        }
        console.log("Credential Status table is ready.");
    });
}
function createTableCompany(db) {
    console.log("Creating companyDataBase table...");
    db.run("CREATE TABLE IF NOT EXISTS companyDataBase\n         (\n             name     TEXT NOT NULL,\n             email    TEXT PRIMARY KEY,\n             jobTitle TEXT NOT NULL,\n             VC       TEXT NOT NULL\n         ) STRICT", function (err) {
        if (err) {
            console.error("Error creating table:", err.message);
            return;
        }
        console.log("companyDataBase table is ready.");
    });
}
function populateDbCompany(db, filePath) {
    var insertStmt = db.prepare('INSERT INTO companyDataBase (name,email,jobTitle,VC) VALUES ( ?,?,?,?)');
    fs.createReadStream(filePath)
        .pipe(csv({
    // separator: ";"
    }))
        .on("data", function (row) {
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var name = "";
        for (var i = 0; i < 10; i++) {
            name += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        var email_address = "";
        for (var i = 0; i < 10; i++) {
            email_address += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        email_address += "@bmw.de";
        var jobTitle = ["Software Engineer", "Accountant", "HR", "Manager", "Director", "Intern"];
        var vc = JSON.stringify({
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
        insertStmt.run([name, email_address, jobTitle[Math.floor(Math.random() * 6)], vc], function (err) {
            if (err) {
                console.error("Error inserting rowsss ".concat(JSON.stringify(row), ":"), err.message);
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
function populateDb(db, filePath) {
    var insertStmt = db.prepare('INSERT INTO credentialStatus (id,status) VALUES ( ?,?)');
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
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', function (row) {
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var name = "";
        for (var i = 0; i < 10; i++) {
            name += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        var email_address = "";
        for (var i = 0; i < 10; i++) {
            email_address += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        email_address += "@bmw.de";
        insertStmt.run([name, email_address, row.id, row.status], function (err) {
            if (err) {
                console.error("Error inserting row ".concat(JSON.stringify(row), ":"), err.message);
            }
        });
    })
        .on('end', function () {
        console.log('CSV file successfully processed.');
        insertStmt.finalize();
    })
        .on('error', function (err) {
        console.error('Error reading CSV file:', err.message);
    });
}
function initDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // export function initDB() {
            console.log("creating Table");
            console.log("Initializing database...");
            connectToDb("./bfc.db");
            return [2 /*return*/];
        });
    });
}
//initDB();
