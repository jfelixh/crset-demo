import { EventEmitter } from "events";
import { isRevoked } from "bfc-status-check";
import dotenv from "dotenv";

dotenv.config();

export const checkRevocationStatus = async (
  VC: any,
  emitter: EventEmitter,
  clientId: string
) => {
  try {
    const status = await isRevoked(
      VC,
      {
        infuraApiKey: process.env.INFURA_API_KEY!,
        moralisApiKey: process.env.MORALIS_API_KEY!,
        blobScanUrl: process.env.BLOB_SCAN_URL!,
        alchemyApiKey: "",
      },
      {
        emitter,
        clientId,
      }
    );
    return status;
  } catch (error: any) {
    console.error(error);
    return true;
  }
};
