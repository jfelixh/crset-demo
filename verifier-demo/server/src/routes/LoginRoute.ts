import express from "express";
import {
  generateWalletURL,
  getClientMetadata,
  loginCallback,
  presentCredentialGet,
  presentCredentialPost,
} from "src/controllers/LoginController";

const router = express.Router();

router.get("/generateWalletURL", generateWalletURL);
router.get("/presentCredential", presentCredentialGet);
router.get("/clientMetadata", getClientMetadata);
router.post("/presentCredential", presentCredentialPost);
router.get("/callback", loginCallback);

export default router;
