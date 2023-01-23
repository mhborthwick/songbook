import mongoose from "mongoose";
import { UserDocument } from "./user";

export interface SongInput {
  user: UserDocument["_id"];
  name: UserDocument["name"];
  url: string;
}

export interface SongDocument extends SongInput, mongoose.Document {
  songId: string;
  createdAt: Date;
  updatedAt: Date;
}
