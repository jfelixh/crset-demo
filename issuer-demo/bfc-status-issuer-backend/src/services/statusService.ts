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
import * as bfc from "../../../../../padded-bloom-filter-cascade/src";
dotenv.config({ path: "../../.env" });

interface StatusEntry {
  id: string; // CAIP-10 Account ID
  type: "BFCStatusEntry";
  statusPurpose: "revocation";
}

// Creates a new revocation status entry to be added to a VC before it is signed by the issuer.
export async function createStatusEntry(): Promise<StatusEntry | null> {
  try {
    const db = connectToDb(process.env.DB_LOCATION!);
    // Generates a unique ID for a new status entry
    const statusPublisher = new AccountId({
      chainId: "eip155:1",
      address: process.env.ADDRESS!,
    }).toString();
    const id = statusPublisher + ":" + randomString();
    const insertedID = await insertStatusEntry(db, id, "valid");

    if (insertedID) {
      return {
        id,
        type: "BFCStatusEntry",
        statusPurpose: "revocation",
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
    const db = connectToDb(process.env.DB_LOCATION!);
    console.log("Revoking credential with ID:", id);
    const currentStatus = await getStatusById(db, id);
    if (currentStatus === "valid") {
      await updateStatusById(db, id, "invalid");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error querying the database:", error);
  }
  return false;
}
export async function getStatusByIDForUsers(id: string): Promise<boolean> {
  try {
    const db = connectToDb(process.env.DB_LOCATION!);
    const currentStatus = await getStatusById(db, id);
    return currentStatus === "valid";
  } catch (error) {
    console.error("Error occurred:", error);
  }
  return false;
}

// Publish BFC
export async function publishBFC() {
  try {
    console.log("Publishing BFC...");
    const db = connectToDb(process.env.DB_LOCATION!);
    const validSet = await getIdsByStatus(db, "valid");
    const invalidSet = await getIdsByStatus(db, "invalid");

    // Calculate optimal rHat: rHat >= validSet.size AND rHat >= invalidSet.size / 2 (see pseudo code)
    const rHat =
      validSet.size > invalidSet.size / 2 ? validSet.size : invalidSet.size / 2;

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
