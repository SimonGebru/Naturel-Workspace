import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["project", "idea", "note", "task", "goal", "tech", "code"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      default: "",
    },
    position: {
      x: {
        type: Number,
        default: 0,
      },
      y: {
        type: Number,
        default: 0,
      },
    },
    metadata: {
      status: {
        type: String,
        default: "",
      },
      priority: {
        type: String,
        default: "",
      },
      dueDate: {
        type: Date,
        default: null,
      },
      url: {
        type: String,
        default: "",
      },
      codeLanguage: {
        type: String,
        default: "",
      },
      codeSnippet: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

const Node = mongoose.model("Node", nodeSchema);

export default Node;