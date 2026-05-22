import Node from "../models/Node.model.js";
import Workspace from "../models/Workspace.model.js";
import Connection from "../models/Connection.model.js";
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

export const getNodes = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const nodes = await Node.find({
    user: req.user._id,
    workspace: workspace._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({ nodes });
});

export const createNode = asyncHandler(async (req, res) => {
  const {
    title,
    type,
    description,
    tags,
    color,
    position,
    metadata,
  } = req.body;

  if (!title || !type) {
    throw new ApiError(400, "Title and type are required");
  }

  const workspace = await getOrCreateWorkspace(req.user._id);

  const node = await Node.create({
    user: req.user._id,
    workspace: workspace._id,
    title,
    type,
    description,
    tags,
    color,
    position,
    metadata,
  });

  res.status(201).json({ node });
});

export const getNodeById = asyncHandler(async (req, res) => {
  const node = await Node.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!node) {
    throw new ApiError(404, "Node not found");
  }

  res.status(200).json({ node });
});

export const updateNode = asyncHandler(async (req, res) => {
  const node = await Node.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!node) {
    throw new ApiError(404, "Node not found");
  }

  res.status(200).json({ node });
});

export const deleteNode = asyncHandler(async (req, res) => {
  const node = await Node.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!node) {
    throw new ApiError(404, "Node not found");
  }

  await Connection.deleteMany({
    user: req.user._id,
    $or: [{ sourceNode: node._id }, { targetNode: node._id }],
  });

  res.status(200).json({
    message: "Node deleted successfully",
    deletedNodeId: node._id,
  });
});