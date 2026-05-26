import express from "express";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaceById,
  getWorkspaces,
  updateWorkspace,
} from "../controllers/workspace.controller.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, getWorkspaces);
router.post("/", requireAuth, createWorkspace);
router.get("/:id", requireAuth, getWorkspaceById);
router.put("/:id", requireAuth, updateWorkspace);
router.delete("/:id", requireAuth, deleteWorkspace);

export default router;