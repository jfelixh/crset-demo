import {
  verifyCredential,
  verifyPresentation,
} from "@spruceid/didkit-wasm-node";

export const verifyAuthenticationPresentation = async (VP: any) => {
  try {
    if (!VP?.verifiableCredential) {
      console.log("Unable to find VCs in VP");
      return false;
    }

    if (!(await verifyJustPresentation(VP))) {
      return false;
    }

    const creds = Array.isArray(VP.verifiableCredential)
      ? VP.verifiableCredential
      : [VP.verifiableCredential];

    for (const cred of creds) {
      if (!(await verifyJustCredential(cred))) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.log(error, "Failed during VP verification");
    return false;
  }
};

const verifyJustPresentation = async (VP: any): Promise<boolean> => {
  const res = JSON.parse(await verifyPresentation(JSON.stringify(VP), "{}"));
  // If verification is successful
  if (res.errors.length === 0) {
    return true;
  } else {
    console.log({ errors: res.errors }, "Unable to verify VP");
    return false;
  }
};

const verifyJustCredential = async (VC: any): Promise<boolean> => {
  // Verify the signature on the VC
  const res = JSON.parse(await verifyCredential(JSON.stringify(VC), "{}"));
  // If verification is successful
  if (res?.errors?.length === 0) {
    return true;
  } else {
    console.log({ errors: res.errors }, "Unable to verify VC");
    return false;
  }
};
