import { Router } from "express";
import {
  getBranches,
  createBranch,
  updateBranch,
  getBranchAssets,
} from "../controllers/branch.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getBranches);
router.post("/", authenticate, createBranch);
router.patch("/:id", authenticate, updateBranch);
router.get("/:id/assets", authenticate, getBranchAssets);

export default router;
