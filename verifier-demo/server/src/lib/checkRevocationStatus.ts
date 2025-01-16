//TODO: actually use library instead of relative path
import * as bsc from "../../../../../bfc-status-check/src/index";
import { EventEmitter } from "events";

export const checkRevocationStatus = async (VC: any, emitter:EventEmitter) => {
  try {
    const status = await bsc.isRevoked(
      VC,
      new URL("https://bfc-status-check.example.com"),
      emitter
    );
    return status;
  } catch (error: any) {
    console.error(error);
    return true;
  }
};
