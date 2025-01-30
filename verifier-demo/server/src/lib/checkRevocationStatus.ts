import { EventEmitter } from "events";
import { isRevoked } from "bfc-status-check";
import dotenv from "dotenv";

dotenv.config({ path: "../../../.env" });

export const checkRevocationStatus = async (
  VC: any,
  emitter: EventEmitter,
  clientId: string
) => {
  try {
    const apiConfig = {
      infuraApiKey: process.env.INFURA_API_KEY!,
      moralisApiKey: process.env.MORALIS_API_KEY!,
      alchemyApiKey: process.env.ALCHEMY_API_KEY!,
      blobScanUrl: process.env.BLOBSCAN_URL!,
    };
    emitter.emit("vcid", { vcid: VC.id, clientId });
    const status = await isRevoked(VC, apiConfig, {
      emitter,
      clientId,
    });
    return status;
  } catch (error: any) {
    console.error(error);
    return true;
  }
};
