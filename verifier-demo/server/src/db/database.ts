import { Database } from "sqlite3";
import { config } from "@/config/base";

// Connect to the loans table SQLite database
export const connectDB = async () => {
  return new Promise<Database>((resolve, reject) => {
    const db = new Database(config.DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(db);
    });
  });
};
