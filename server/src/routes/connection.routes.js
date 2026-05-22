import express from "express";
import {
  createConnection,
  deleteConnection,
  getConnections,
  updateConnection,
} from "../controllers/connection.controller.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, getConnections);
router.post("/", requireAuth, createConnection);
router.put("/:id", requireAuth, updateConnection);
router.delete("/:id", requireAuth, deleteConnection);

export default router;