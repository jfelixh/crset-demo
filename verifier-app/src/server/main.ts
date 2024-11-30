import express from "express";
import ViteExpress from "vite-express";
import { keyToDID } from "@spruceid/didkit-wasm-node";

const app = express();

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

app.get("/generateWalletURL", (req, res) => {
  const clientId = keyToDID("key", 
    JSON.stringify({"kty":"OKP","crv":"Ed25519","x":"cwa3dufHNLg8aQb2eEUqTyoM1cKQW3XnOkMkj_AAl5M","d":"me03qhLByT-NKrfXDeji-lpADSpVOKWoaMUzv5EyzKY"})
  )
  res.send(clientId);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
