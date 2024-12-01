import express from "express";
import { get } from "http";
import { generateWalletURL, getClientMetadata, presentCredentialGet, presentCredentialPost } from "src/controllers/LoginController";

const router = express.Router();

router.get("/generateWalletURL", generateWalletURL);
router.get("/presentCredential", presentCredentialGet);
router.get("/clientMetadata", getClientMetadata);
router.post("/presentCredential", presentCredentialPost);

export default router;