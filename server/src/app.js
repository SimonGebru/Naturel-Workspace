import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import nodeRoutes from "./routes/node.routes.js";
import connectionRoutes from "./routes/connection.routes.js";

import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/nodes", nodeRoutes);
app.use("/api/connections", connectionRoutes);



app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Neural Workspace API is running",
  });
});
app.use(errorHandler);

export default app;