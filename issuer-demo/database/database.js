"use strict";
//TODO Delete this
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
exports.default = updatePublishById;
exports.initDB = initDB;
var csv = require("csv-parser");
var fs = require("node:fs");
var path = require("path");
var sqlite3_1 = require("sqlite3");
var unique_names_generator_1 = require("unique-names-generator");
var config = {
    dictionaries: [unique_names_generator_1.names],
};
var db;
function connectToDb(databaseLocation) {
    return new Promise(function (resolve, reject) {
        if (!db) {
            var dbPath = path.resolve(process.cwd(), databaseLocation);
            db = new sqlite3_1.Database(dbPath, function (err) {
                if (err) {
                    console.error("Error connecting to SQLite:", err.message);
                    reject(err);
                }
                else {
                    console.log("Connected to SQLite database.");
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
    db.run("CREATE TABLE IF NOT EXISTS credentialStatus\n         (\n             id     TEXT PRIMARY KEY,\n             status INTEGER NOT NULL\n         ) STRICT", function (err) {
        if (err) {
            console.error("Error creating table:", err.message);
            return;
        }
        console.log("Credential Status table is ready.");
    });
}
function createTableCompany(db) {
    console.log("Creating companyDataBase table...");
    db.run("CREATE TABLE IF NOT EXISTS companyDataBase\n         (\n             name     TEXT NOT NULL,\n             email    TEXT PRIMARY KEY,\n             jobTitle TEXT NOT NULL,\n             VC       TEXT NOT NULL,\n             manager  TEXT NOT NULL,\n             employmentType TEXT NOT NULL,\n             isPublished INTEGER NOT NULL\n         ) STRICT", function (err) {
        if (err) {
            console.error("Error creating table:", err.message);
            return;
        }
        console.log("companyDataBase table is ready.");
    });
}
function clearTableCompany(db) {
    console.log("Clearing content of companyDataBase table...");
    db.run("DELETE FROM companyDataBase", function (err) {
        if (err) {
            console.error("Error clearing table content:", err.message);
            return;
        }
        console.log("companyDataBase table is now empty.");
    });
}
function clearCredentialStatusTable(db) {
    console.log("Clearing content of credentialStatus table...");
    db.run("DELETE FROM credentialStatus", function (err) {
        if (err) {
            console.error("Error clearing table content:", err.message);
            return;
        }
        console.log("credentialStatus table is now empty.");
    });
}
function populateDbCompany(db, filePath) {
    var _this = this;
    var insertStmt = db.prepare("INSERT INTO companyDataBase (name,email,jobTitle,VC,manager, employmentType, isPublished) VALUES ( ?,?,?,?,?,?,?)");
    fs.createReadStream(filePath)
        .pipe(csv({
    // separator: ";"
    }))
        .on("data", function (row) { return __awaiter(_this, void 0, void 0, function () {
        var firstName, lastName, name, email_address, jobTitle, manager, employmentType, vc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, unique_names_generator_1.uniqueNamesGenerator)(config)];
                case 1:
                    firstName = _a.sent();
                    return [4 /*yield*/, (0, unique_names_generator_1.uniqueNamesGenerator)(config)];
                case 2:
                    lastName = _a.sent();
                    name = firstName + " " + lastName;
                    email_address = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@cmw.de";
                    jobTitle = [
                        "Software Engineer",
                        "Accountant",
                        "HR",
                        "Manager",
                        "Director",
                        "Intern",
                    ];
                    manager = "Sarah Smith";
                    employmentType = ["Full Time", "Part Time", "Intern"];
                    vc = JSON.stringify({
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
                            email: "".concat(email_address),
                            name: "".concat(firstName),
                            familyName: "".concat(lastName),
                            jobTitle: "".concat(jobTitle),
                            companyName: "CMW Group",
                            comment: "I am just a test employment credential.",
                            type: "EmploymentCredential",
                        },
                        credentialStatus: {
                            id: "urn:eip155:1:0x32328bfaea51ce120db44f7755a1170e9cc43653:" + row.id,
                            type: "BFCStatusEntry",
                            statusPurpose: "revocation",
                        },
                        issuanceDate: "2024-12-12T16:27:32Z",
                        proof: {
                            type: "Ed25519Signature2020",
                            created: "2024-12-12T16:27:32Z",
                            verificationMethod: "did:key:z6Mkii9oRJhUyQNBS3LXbCHSCv2vXkzD8NUbmL1KrSQ8t6YM#z6Mkii9oRJhUyQNBS3LXbCHSCv2vXkzD8NUbmL1KrSQ8t6YM",
                            proofPurpose: "assertionMethod",
                            proofValue: "z2U2LHtQYhY7s6T9UHvpQs2aPdQsxk2UcPdWm1AF3pFfEUmhFDEvBkiqBnGcKiiPzBoof2j5acVpqSy3eoy9opSBD",
                        },
                    });
                    insertStmt.run([
                        name,
                        email_address,
                        jobTitle[Math.floor(Math.random() * 6)],
                        vc,
                        manager,
                        employmentType[Math.floor(Math.random() * 3)],
                        0,
                    ], function (err) {
                        if (err) {
                            console.error("Error inserting rowsss ".concat(JSON.stringify(row), ":"), err.message);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); })
        .on("end", function () {
        console.log("CSV file successfully processed.");
        insertStmt.finalize();
    })
        .on("error", function (err) {
        console.error("Error reading CSV file:", err.message);
    });
}
function populateDb(db, filePath) {
    var insertStmt = db.prepare("INSERT INTO credentialStatus (id,status) VALUES ( ?,?)");
    fs.createReadStream(filePath)
        .pipe(csv({
    // separator: ";"
    }))
        .on("data", function (row) {
        var credentialStatusId = "urn:eip155:1:0x32328bfaea51ce120db44f7755a1170e9cc43653:" + row.id;
        insertStmt.run([credentialStatusId, row.status], function (err) {
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
function deleteUserByEmail(db, email) {
    db.get("SELECT email FROM companyDataBase WHERE email = ?", [email], function (err, row) {
        if (err) {
            console.error("Error checking email existence:", err.message);
            return;
        }
        if (!row) {
            console.log("No user found with email: ".concat(email));
        }
        else {
            // Delete the user if the email exists
            var deleteStmt = db.prepare("DELETE FROM companyDataBase WHERE email = ?");
            deleteStmt.run([email], function (err) {
                if (err) {
                    console.error("Error deleting user: ".concat(err.message));
                }
                else {
                    console.log("User with email ".concat(email, " successfully deleted."));
                }
            });
            deleteStmt.finalize();
        }
    });
}
function createBfcLogsTable(db) {
    db.run("CREATE TABLE IF NOT EXISTS bfcLogs (\n            validIdsSize INTEGER NOT NULL,\n            invalidIdsSize INTEGER NOT NULL,\n            serializedDataSize INTEGER NOT NULL,\n            constructionTimeInSec REAL NOT NULL,\n            publicationTimeInSec REAL NOT NULL,\n            numberOfBlobs INTEGER NOT NULL,\n            transactionHash TEXT PRIMARY KEY NOT NULL,\n            blobVersionedHash TEXT NOT NULL,\n            publicationTimestamp TEXT NOT NULL,\n            transactionCost REAL NOT NULL,\n            calldataTotalCost REAL NOT NULL,\n            numberOfBfcLayers INTEGER NOT NULL,\n            rHat REAL NOT NULL\n        ) STRICT", function (err) {
        if (err) {
            console.error("Error creating bfcLogs table:", err.message);
            return;
        }
        console.log("bfcLogs table is ready.");
    });
}
function clearLogsTable(db) {
    console.log("Clearing content of bfcLogs table...");
    db.run("DELETE FROM bfcLogs", function (err) {
        if (err) {
            console.error("Error clearing table content:", err.message);
            return;
        }
        console.log("bfcLogs table is now empty.");
    });
}
function deleteBFCLogsTable(db) {
    console.log("Clearing content of bfcLogs table...");
    db.run("DROP TABLE IF EXISTS bfcLogs", function (err) {
        if (err) {
            console.error("Error deleting table content:", err.message);
            return;
        }
        console.log("bfcLogs table is deleted.");
    });
}
function deleteCompanyTable(db) {
    console.log("Clearing content of companyDataBase table...");
    db.run("DROP TABLE IF EXISTS companyDataBase", function (err) {
        if (err) {
            console.error("Error deleting table content:", err.message);
            return;
        }
        console.log("companyDataBase table is deleted.");
    });
}
function updatePublishById(db, email, isPublished) {
    var _this = this;
    console.log("Updating publish status for VC with email:", email);
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.run("UPDATE companyDataBase SET isPublished = ? WHERE email = ?", [isPublished, email], function (err) {
                        if (err) {
                            console.error("Error updating status:", err.message);
                            reject(err);
                            return;
                        }
                        resolve();
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
function initDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // export function initDB() {
            console.log("creating Table");
            console.log("Initializing database...");
            connectToDb("../data/bfc.db");
            //createBfcLogsTable(db)
            // deleteBFCLogsTable(db)
            //createTable(db);
            //createTableCompany(db);
            populateDb(db, "./test_data_540000.csv");
            return [2 /*return*/];
        });
    });
}
//initDB()
