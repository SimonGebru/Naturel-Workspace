import Workspace from "../models/Workspace.model.js";
import Node from "../models/Node.model.js";
import Connection from "../models/Connection.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({ workspaces });
});

export const createWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Workspace name is required");
  }

  const workspace = await Workspace.create({
    user: req.user._id,
    name,
    description: description || "",
  });

  res.status(201).json({ workspace });
});

export const getWorkspaceById = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  res.status(200).json({ workspace });
});

export const updateWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const workspace = await Workspace.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    {
      name,
      description,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  res.status(200).json({ workspace });
});

export const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  await Node.deleteMany({
    user: req.user._id,
    workspace: workspace._id,
  });

  await Connection.deleteMany({
    user: req.user._id,
    workspace: workspace._id,
  });

  res.status(200).json({
    message: "Workspace deleted successfully",
    deletedWorkspaceId: workspace._id,
  });
});