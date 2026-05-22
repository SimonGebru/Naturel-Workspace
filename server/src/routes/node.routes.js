import express from "express";
import {
  createNode,
  deleteNode,
  getNodeById,
  getNodes,
  updateNode,
} from "../controllers/node.controller.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, getNodes);
router.post("/", requireAuth, createNode);
router.get("/:id", requireAuth, getNodeById);
router.put("/:id", requireAuth, updateNode);
router.delete("/:id", requireAuth, deleteNode);

export default router;