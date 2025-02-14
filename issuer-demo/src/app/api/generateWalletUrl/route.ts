import * as DIDKit from "@spruceid/didkit-wasm";
import crypto from "crypto";

export async function GET(req: Request) {
  if (req.method !== "GET") {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405,
      headers: { Allow: "GET" },
    });
  }
  const jwkString = JSON.stringify({
    kty: "OKP",
    crv: "Ed25519",
    x: "cwa3dufHNLg8aQb2eEUqTyoM1cKQW3XnOkMkj_AAl5M",
    d: "me03qhLByT-NKrfXDeji-lpADSpVOKWoaMUzv5EyzKY",
  });

  try {
    // console.log("generateWalletURL in backend");
    //  console.log("DID Key JWK: " + process.env.PORT);
    console.log(
      "Generate a challenge and send it together with URL that the wallet can use to receive metadata",
    );
    let loginChallenge;
    try {
      loginChallenge = crypto.randomUUID();
      console.log("Login challenge: " + loginChallenge);
    } catch (error) {
      console.error("Error generating login challenge: ", error);
      return new Response(
        JSON.stringify({ error: "Error generating login challenge" }),
        { status: 500 },
      );
    }
    //console.log("externalUrl: " + DIDKit.keyToDID("key", process.env.DID_KEY_JWK!));
    const externalUrl = process.env.NEXT_PUBLIC_URL!;
    //console.log(process.env.NEXT_PUBLIC_URL)
    const walletUrl =
      "openid-vc://?client_id=" +
      DIDKit.keyToDID("key", process.env.DID_KEY_JWK!) +
      "&request_uri=" +
      encodeURIComponent(
        externalUrl + "/api/presentCredential?login_id=" + loginChallenge,
      );
    return new Response(
      JSON.stringify({
        message: "Wallet URL generated successfully",
        walletUrl: walletUrl,
        login_id: loginChallenge,
      }),
    );

    //   console.log("Wallet URL: " + walletUrl);
    //   console.log("Login ID: " + loginChallenge);
    // return new Response(JSON.stringify({
    //   message: "Wallet URL generated successfully",
    //   walletUrl: walletUrl,
    //   login_id: loginChallenge,
    // }));
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
  // return new Response(JSON.stringify({
  //   message: "Wallet URL generated successfully",
  //   walletUrl: "https://wallet.spruceid.com/login/presentCredential?login_id=e9e7a5b0-f9f8-4b9a-a4e8-d0b2c3d4e5f6",
  //   login_id: "e9e7a5b0-f9f8-4b9a-a4e8-d0b2c3d4e5f6",
  // }));
}
