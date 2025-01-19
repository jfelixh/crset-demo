//TODO: actually use library instead of relative path
import * as bsc from "../../../../../bfc-status-check/src/index";
import { EventEmitter } from "events";

export const checkRevocationStatus = async (VC: any, emitter:EventEmitter, clientId: string) => {
  try {
    const status = await bsc.isRevoked(
      VC,
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
