import { Request, Response, NextFunction } from "express";
import { findUserSongs } from "../service/song.service";

const restrictNumberOfSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user._id;
  const userSongs = await findUserSongs({ user });

  if (userSongs.length >= 15) {
    return res.status(403).send({
      message: "Reached max limit",
    });
  }

  return next();
};

export default restrictNumberOfSongs;
