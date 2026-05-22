import express from "express";
import {
  getMyWorkspace,
  updateWorkspace,
} from "../controllers/workspace.controller.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/me", requireAuth, getMyWorkspace);
router.put("/:id", requireAuth, updateWorkspace);

export default router;