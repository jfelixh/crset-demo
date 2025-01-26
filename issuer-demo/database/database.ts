import * as path from "path";
import { Database } from "sqlite3";

let db: Database;

export function connectToDb(databaseLocation: string): Promise<Database> {
  return new Promise((resolve, reject) => {
    if (!db) {
      const dbPath = path.resolve(process.cwd(), databaseLocation);
      console.log("Connecting to SQLite database with path:", dbPath);
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
