//TODO: actually use library instead of relative path
import { isRevoked } from "../../../../../bfc-status-check/src";
import { EventEmitter } from "events";

export const checkRevocationStatus = async (VC: any, emitter:EventEmitter, clientId: string) => {
  try {
    const apiConfig = {
      infuraApiKey: "",
      moralisApiKey: "",
      alchemyApiKey: "",
      blobScanUrl: "https://api.sepolia.blobscan.com/blobs/",
    }
    emitter.emit("vcid", {vcid: VC.id, clientId});
    const status = await isRevoked(
      VC,
      apiConfig,
      {
        emitter,
        clientId
      }
    );
    return status;
  } catch (error: any) {
    console.error(error);
    return true;
  }
};
