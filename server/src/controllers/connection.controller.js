import Connection from "../models/Connection.model.js";
import Node from "../models/Node.model.js";
import Workspace from "../models/Workspace.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getOrCreateWorkspace = async (userId) => {
  let workspace = await Workspace.findOne({ user: userId });

  if (!workspace) {
    workspace = await Workspace.create({
      user: userId,
      name: "My Neural Workspace",
      description: "Your personal graph-based workspace.",
    });
  }

  return workspace;
};

const validateUserNodes = async (userId, sourceNodeId, targetNodeId) => {
  const nodes = await Node.find({
    _id: { $in: [sourceNodeId, targetNodeId] },
    user: userId,
  });

  return nodes.length === 2;
};

export const getConnections = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const connections = await Connection.find({
    user: req.user._id,
    workspace: workspace._id,
  })
    .populate("sourceNode", "title type")
    .populate("targetNode", "title type")
    .sort({ createdAt: -1 });

  res.status(200).json({ connections });
});

export const createConnection = asyncHandler(async (req, res) => {
  const { sourceNode, targetNode, label, type, strength } = req.body;

  if (!sourceNode || !targetNode) {
    throw new ApiError(400, "sourceNode and targetNode are required");
  }

  if (sourceNode === targetNode) {
    throw new ApiError(400, "A node cannot connect to itself");
  }

  const nodesAreValid = await validateUserNodes(
    req.user._id,
    sourceNode,
    targetNode
  );

  if (!nodesAreValid) {
    throw new ApiError(
      400,
      "Both nodes must exist and belong to the logged in user"
    );
  }

  const workspace = await getOrCreateWorkspace(req.user._id);

  const existingConnection = await Connection.findOne({
    user: req.user._id,
    sourceNode,
    targetNode,
    type,
  });

  if (existingConnection) {
    throw new ApiError(409, "Connection already exists");
  }

  const connection = await Connection.create({
    user: req.user._id,
    workspace: workspace._id,
    sourceNode,
    targetNode,
    label,
    type,
    strength,
  });

  res.status(201).json({ connection });
});

export const updateConnection = asyncHandler(async (req, res) => {
  const { label, type, strength } = req.body;

  const connection = await Connection.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    {
      label,
      type,
      strength,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!connection) {
    throw new ApiError(404, "Connection not found");
  }

  res.status(200).json({ connection });
});

export const deleteConnection = asyncHandler(async (req, res) => {
  const connection = await Connection.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!connection) {
    throw new ApiError(404, "Connection not found");
  }

  res.status(200).json({
    message: "Connection deleted successfully",
    deletedConnectionId: connection._id,
  });
});