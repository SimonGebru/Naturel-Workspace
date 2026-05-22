import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    sourceNode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
      required: true,
    },
    targetNode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
      required: true,
    },
    label: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: [
        "related_to",
        "depends_on",
        "part_of",
        "inspired_by",
        "blocks",
        "supports",
      ],
      required: true,
      default: "related_to",
    },
    strength: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
  },
  { timestamps: true }
);

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;