import { Express, Request, Response } from "express";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
  createSongHandler,
  deleteSongHandler,
  getAllSongsHandler,
  getSongHandler,
  getSongsCountHandler,
  getUserSongsHandler,
  updateSongHandler,
  createPasswordResetEmailHandler,
  createUserHandler,
  getCurrentUser,
  updateUserPasswordHandler,
} from "./controller";
import {
  requireUser,
  restrictNumberOfSongs,
  validateResource,
} from "./middleware";
import {
  createSessionSchema,
  createSongSchema,
  deleteSongSchema,
  getSongSchema,
  updateSongSchema,
  createUserSchema,
  getUserSchema,
  updateUserPasswordSchema,
} from "./schema";

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

  app.get("/api/songs-count", getSongsCountHandler);

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
