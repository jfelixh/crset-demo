import express from "express";
import {
  generateWalletURL,
  getClientMetadata,
  presentCallback,
  presentCredentialGet,
  presentCredentialPost,
} from "@/controllers/PresentController";

const router = express.Router();

router.get("/generateWalletURL", generateWalletURL);
router.get("/presentCredential", presentCredentialGet);
router.get("/clientMetadata", getClientMetadata);
router.post("/presentCredential", presentCredentialPost);
router.get("/callback", presentCallback);

export default router;
