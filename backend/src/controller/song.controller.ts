import { Request, Response } from "express";
import {
  CreateSongInput,
  deleteSongInput,
  GetSongInput,
  UpdateSongInput,
} from "../schema/song.schema";
import {
  createSong,
  findAndUpdateSong,
  findSong,
  deleteSong,
  findAllSongs,
  findUserSongs,
  getSongsCount,
} from "../service/song.service";

export async function createSongHandler(
  req: Request<{}, {}, CreateSongInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const name = res.locals.user.name;
  const body = req.body;

  // TODO: Wrap in try / catch
  const song = await createSong({ ...body, name, user: userId });
  return res.send(song);
}

export async function getSongsCountHandler(req: Request, res: Response) {
  const count = await getSongsCount();
  return res.send({ count });
}

// TODO: remove skip
export async function getAllSongsHandler(req: Request, res: Response) {
  const { skip, limit } = req.query;
  const songs = await findAllSongs(
    parseInt(<string>skip),
    parseInt(<string>limit)
  );
  if (!songs) {
    return res.sendStatus(404);
  }
  return res.send(songs);
}

export async function getUserSongsHandler(req: Request, res: Response) {
  const user = res.locals.user._id;
  const userSongs = await findUserSongs({ user });
  if (!userSongs) {
    return res.sendStatus(404);
  }
  res.send(userSongs);
}

export async function getSongHandler(
  req: Request<GetSongInput["params"]>,
  res: Response
) {
  const songId = req.params.songId;
  const song = await findSong({ songId });
  if (!song) {
    return res.sendStatus(404);
  }
  res.send(song);
}

export async function updateSongHandler(
  req: Request<UpdateSongInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const songId = req.params.songId;
  const update = req.body;
  const song = await findSong({ songId });
  if (!song) {
    return res.sendStatus(404);
  }
  if (String(song.user) !== userId) {
    return res.sendStatus(403);
  }
  const updatedSong = await findAndUpdateSong({ songId }, update, {
    new: true,
  });
  return res.send(updatedSong);
}

export async function deleteSongHandler(
  req: Request<deleteSongInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const songId = req.params.songId;
  const song = await findSong({ songId });
  if (!song) {
    return res.sendStatus(404);
  }
  if (String(song.user) !== userId) {
    return res.sendStatus(403);
  }
  await deleteSong({ songId });
  return res.send(200);
}
