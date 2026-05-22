import Workspace from "../models/Workspace.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getMyWorkspace = asyncHandler(async (req, res) => {
  let workspace = await Workspace.findOne({ user: req.user._id });

  if (!workspace) {
    workspace = await Workspace.create({
      user: req.user._id,
      name: "My Neural Workspace",
      description: "Your personal graph-based workspace.",
    });
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