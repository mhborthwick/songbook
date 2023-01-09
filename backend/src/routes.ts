import { Express, Request, Response } from "express";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "./controller/session.controller";
import {
  createSongHandler,
  deleteSongHandler,
  getAllSongsHandler,
  getSongHandler,
  getUserSongsHandler,
  updateSongHandler,
} from "./controller/song.controller";
import {
  createPasswordResetEmailHandler,
  createUserHandler,
  getCurrentUser,
  updateUserPasswordHandler,
} from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import restrictNumberOfSongs from "./middleware/restrictNumberOfSongs";
import validateResource from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import {
  createSongSchema,
  deleteSongSchema,
  getSongSchema,
  updateSongSchema,
} from "./schema/song.schema";
import {
  createUserSchema,
  getUserSchema,
  updateUserPasswordSchema,
} from "./schema/user.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  app.post(
    "/api/password-reset",
    validateResource(getUserSchema),
    createPasswordResetEmailHandler
  );

  app.put(
    "/api/password-reset/:token",
    [requireUser, validateResource(updateUserPasswordSchema)],
    updateUserPasswordHandler
  );

  app.get("/api/me", requireUser, getCurrentUser);

  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  app.post(
    "/api/songs",
    [requireUser, validateResource(createSongSchema), restrictNumberOfSongs],
    createSongHandler
  );

  app.get("/api/songs", getAllSongsHandler);

  app.get("/api/my-songs", requireUser, getUserSongsHandler);

  app.put(
    "/api/songs/:songId",
    [requireUser, validateResource(updateSongSchema)],
    updateSongHandler
  );

  app.get(
    "/api/songs/:songId",
    validateResource(getSongSchema),
    getSongHandler
  );

  app.delete(
    "/api/songs/:songId",
    [requireUser, validateResource(deleteSongSchema)],
    deleteSongHandler
  );
}
export default routes;
