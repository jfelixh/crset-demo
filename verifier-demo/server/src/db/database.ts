import { open } from "sqlite";
import { Database } from "sqlite3";
import { config } from "@/config/base";

// Connect to the loans table SQLite database
export const connectDB = async () => {
  const db = await open({
    filename: config.DB_PATH,
    driver: Database,
  });

  return db;
};
