import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { signToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    passwordHash,
    name: name || "",
  });

  const token = signToken(user);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user);

  res.status(200).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    },
  });
});