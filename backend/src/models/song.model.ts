import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { SongDocument } from "../interfaces";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

const songSchema = new mongoose.Schema(
  {
    songId: {
      type: String,
      required: true,
      unique: true,
      default: () => `song_${nanoid()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, ref: "User" },
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Song = mongoose.model<SongDocument>("Song", songSchema);
