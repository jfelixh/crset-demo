import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname + "./../../../../.env") });

export const config = {
  PORT: process.env.PORT || 8080,
  SECRET: process.env.SECRET || "secret",
  DB_PATH: "./src/db/loans.db",
  REDIS_PORT: process.env.REDIS_PORT || 6380,
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
};
