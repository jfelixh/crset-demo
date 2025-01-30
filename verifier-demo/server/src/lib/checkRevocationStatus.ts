import { EventEmitter } from "events";
import { isRevoked } from "bfc-status-check";
import { config } from "@/config/base";

const { INFURA_API_KEY, MORALIS_API_KEY, ALCHEMY_API_KEY, BLOBSCAN_URL } =
  config;

export const checkRevocationStatus = async (
  VC: any,
  emitter: EventEmitter,
  clientId: string
) => {
  try {
    const apiConfig = {
      infuraApiKey: INFURA_API_KEY,
      moralisApiKey: MORALIS_API_KEY,
      alchemyApiKey: ALCHEMY_API_KEY,
      blobScanUrl: BLOBSCAN_URL,
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
