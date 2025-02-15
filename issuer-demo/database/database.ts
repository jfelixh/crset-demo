import * as path from "path";
import { Database } from "sqlite3";

const DB_PATH = "data/bfc.db";
let db: Database;

export function connectToDb(): Promise<Database> {
  return new Promise((resolve, reject) => {
    if (!db) {
      const dbPath = path.resolve(process.cwd(), DB_PATH);
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

export function updatePublishById(
  email: string,
  isPublished: number,
): Promise<void> {
  console.log("Updating publish status for VC with email:", email);
  return new Promise(async (resolve, reject) => {
    db.run(
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

export function getVC(id: number): Promise<string> {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT VC FROM companyDataBase WHERE id=?",
      [id],
      (err, rows: { VC: string }[]) => {
        if (err) {
          reject(err);
        } else if (!rows || rows.length === 0) {
          reject(new Error("VC not found"));
        } else {
          resolve(rows[0].VC);
        }
      },
    );
  });
}

export function setAllPublished() {
  db.run(`UPDATE companyDataBase SET isPublished = 1`, (err: any) => {
    if (err) {
      console.error("Error updating entries:", err.message);
      return;
    }
    console.log("All entries have been set to published.");
  });
}