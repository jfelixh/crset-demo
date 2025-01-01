//TODO: actually use library instead of relative path
import * as bsc from "../../../../bfc-status-check/src/index";

export const checkRevocationStatus = async (VC: any) => {
  try {
    const status = await bsc.isRevoked(
      VC,
      new URL("https://bfc-status-check.example.com")
    );
    return status;
  } catch (error: any) {
    console.error(error);
    return true;
  }
};
