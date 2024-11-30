import { AccountId } from "caip";
import dotenv from "dotenv";
import {
  getIdsByStatus,
  getStatusById,
  insertStatusEntry,
  updateStatusById,
} from "src/controllers/controller";
import { connectToDb } from "src/db/database";
import { sendBlobTransaction } from "src/utils/blob";
import { randomString } from "src/utils/random-string";
import * as bfc from "../../..//../../padded-bloom-filter-cascade/src";
dotenv.config({ path: "../../.env" });

interface StatusEntry {
  id: string;
  type: "BFCStatusEntry";
  statusPurpose: "revocation";
  statusPublisher: string; // CAIP-10 Account ID
}

// Creates a new revocation status entry to be added to a VC before it is signed by the issuer.
export async function createStatusEntry(): Promise<StatusEntry | null> {
  try {
    const db = connectToDb(process.env.DB_LOCATION!);
    // Generates a unique ID for a new status entry
    const id = randomString();
    const insertedID = await insertStatusEntry(db, id, "Valid");

    if (insertedID) {
      return {
        id,
        type: "BFCStatusEntry",
        statusPurpose: "revocation",
        statusPublisher: new AccountId({
          chainId: "eip155:1",
          address: process.env.ADDRESS!,
        }).toString(),
      };
    }
  } catch (error) {
    console.error("Error creating status entry:", error);
  }
  return null;
}

// Revoke an existing credential by revocation ID
export async function revokeCredential(id: string): Promise<boolean> {
  try {
    const db = connectToDb("../database/bfc.db");
    const currentStatus = await getStatusById(db, id);
    if (currentStatus === "Valid") {
      await updateStatusById(db, id, "Invalid");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error querying the database:", error);
  }
  return false;
}

// Publish BFC
export async function publishBFC() {
  try {
    const db = connectToDb(process.env.DB_LOCATION!);
    const validSet = await getIdsByStatus(db, "Valid");
    const invalidSet = await getIdsByStatus(db, "Invalid");

    // Calculate optimal rHat: rHat >= validSet.size AND rHat >= invalidSet.size / 2 (see pseudo code)
    const rHat = validSet.size > invalidSet.size / 2 ? validSet.size : invalidSet.size / 2;

    const temp = bfc.constructBFC(validSet, invalidSet, rHat);
    const serializedData = bfc.toDataHexString(temp);

    sendBlobTransaction(
      process.env.INFURA_API_KEY!,
      process.env.PRIVATE_KEY!,
      process.env.ADDRESS!,
      serializedData
    )
      .then(() => {
        return { success: true, filter: temp[0] };
      })
      .catch((error: Error) => {
        console.error("Error publishing BFC:", error);
        return { success: false, filter: temp[0] };
      });
  } catch (error) {
    console.error("Error querying the database:", error);
  }
}

// Test function to check if data stored in the blob is being fetched correctly
export async function testSend() {
  return sendBlobTransaction(
    process.env.INFURA_API_KEY!,
    process.env.PRIVATE_KEY!,
    process.env.ADDRESS!,
    "Hello World!"
  );
}
