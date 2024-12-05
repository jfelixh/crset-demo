import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Connect to the loans table SQLite database
export const connectDB = async () => {
  const db = await open({
    filename: "./src/db/loans.db",
    driver: sqlite3.Database,
  });

  return db;
};
