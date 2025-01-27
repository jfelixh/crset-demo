import { open } from "sqlite";
import { Database } from "sqlite3";

// Connect to the loans table SQLite database
export const connectDB = async () => {
  const db = await open({
    filename: "./src/db/loans.db",
    driver: Database,
  });

  return db;
};
