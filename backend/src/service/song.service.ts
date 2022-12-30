import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Song, { SongInput, SongDocument } from "../models/song.model";

export async function createSong(input: SongInput) {
  return Song.create(input);
}

export async function findUserSongs(
  query: FilterQuery<SongDocument>,
  options: QueryOptions = { lean: true, sort: { createdAt: -1 } }
) {
  return Song.find(query, {}, options);
}

export async function findSong(
  query: FilterQuery<SongDocument>,
  options: QueryOptions = { lean: true }
) {
  return Song.findOne(query, {}, options);
}

export async function findAllSongs() {
  return Song.find({}, {}, { limit: 50, lean: true, sort: { updatedAt: -1 } });
}

export async function findAndUpdateSong(
  query: FilterQuery<SongDocument>,
  update: UpdateQuery<SongDocument>,
  options: QueryOptions
) {
  return Song.findOneAndUpdate(query, update, options);
}

export async function deleteSong(query: FilterQuery<SongDocument>) {
  return Song.deleteOne(query);
}
