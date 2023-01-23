import mongoose from "mongoose";
import { SessionDocument } from "../interfaces";

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Session = mongoose.model<SessionDocument>(
  "Session",
  sessionSchema
);
