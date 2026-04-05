import { Router } from "express";
import {
  getOfficers,
  getOfficerById,
  createOfficer,
  updateOfficer,
  deleteOfficer,
  checkClearance,
  transferOfficer,
  getOfficerProfile,
} from "../controllers/officer.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", authenticate, getOfficers);
router.get("/profile", authenticate, getOfficerProfile);
router.get("/:id/clearance-check", authenticate, checkClearance);
router.patch("/:id/transfer", authenticate, transferOfficer);
router.post("/", authenticate, upload.single("photo"), createOfficer);
router.get("/:id", authenticate, getOfficerById);
router.patch("/:id", authenticate, upload.single("photo"), updateOfficer);
router.delete("/:id", authenticate, deleteOfficer);

export default router;
