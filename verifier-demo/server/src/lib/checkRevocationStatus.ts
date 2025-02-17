import { EventEmitter } from "events";

export const checkRevocationStatus = async (
  VC: any,
  emitter: EventEmitter,
  clientId: string,
) => {
  try {
    const apiConfig = {
      infuraApiKey: process.env.INFURA_API_KEY!,
      moralisApiKey: process.env.MORALIS_API_KEY!,
      blobScanUrl: process.env.BLOBSCAN_API_URL!,
    };

    emitter.emit("vcid", { vcid: VC.id, clientId });

    // importing here dynamically to avoid commonJS module issues
    const { isRevoked } = await import("crset-check");

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
