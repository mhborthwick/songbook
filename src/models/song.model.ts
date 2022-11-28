import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface SongInput {
  user: UserDocument["_id"];
  url: string;
}

export interface SongDocument extends SongInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const songSchema = new mongoose.Schema(
  {
    songId: {
      type: String,
      required: true,
      unique: true,
      default: () => `song_${nanoid()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model<SongDocument>("Song", songSchema);

export default Song;
