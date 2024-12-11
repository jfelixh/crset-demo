import express from "express";
import {
  generateWalletURL,
  getClientMetadata,
  loginCallback,
  presentCredentialGet,
  presentCredentialPost,
} from "@/controllers/PresentController";

const router = express.Router();

router.get("/generateWalletURL", generateWalletURL);
router.get("/presentCredential", presentCredentialGet);
router.get("/clientMetadata", getClientMetadata);
router.post("/presentCredential", presentCredentialPost);
router.get("/callback", loginCallback);

export default router;
