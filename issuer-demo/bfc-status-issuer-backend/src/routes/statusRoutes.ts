import { Request, Response, Router } from "express";
import {
  createStatusEntry, getStatusByIDForUsers,
  publishBFC,
  revokeCredential,
} from "../services/statusService";
import {getStatusById} from "../controllers/controller";

const router = Router();

// creates a new revocation ID that does not collide with any existing ID
// returns the entire corresponding statusEntry for the credentialStatus array
router.post("/createStatusEntry", async (req: Request, res: Response) => {
  const statusEntry = await createStatusEntry();
  res.status(201).json(statusEntry);
});

// revokes the credential
router.post("/revokeCredential", async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ error: "Revocation ID is required" });
  }

  const revoked = await revokeCredential(id as string);
  if (revoked) {
    res.status(200).json({ message: "Credential revoked" });
  } else {
    res.status(404).json({
      error: "Revocation ID not found / Credential was already revoked",
    });
  }
});

// constructs and publishes a new blob transaction with the filter
router.post("/publishBFC", async (req: Request, res: Response) => {
  // const filter = req.body;
  const result = await publishBFC();
  res.status(200).json(result);
});

router.post("/getStatus", async (req: Request, res: Response) => {
  const { id } = req.query;
  const result = await getStatusByIDForUsers(id as string);
  res.status(200).json({ success: true, status: result });
});

export default router;
