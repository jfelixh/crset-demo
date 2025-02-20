import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname + "./../../../../.env") });

export const config = {
  PORT: process.env.PORT || 8080,
  REDIS_PORT: process.env.REDIS_PORT || 6380,
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  INFURA_API_KEY: process.env.INFURA_API_KEY || "",
  MORALIS_API_KEY: process.env.MORALIS_API_KEY || "",
  BLOBSCAN_URL:
    process.env.BLOBSCAN_URL || "https://api.sepolia.blobscan.com/blobs",
};
