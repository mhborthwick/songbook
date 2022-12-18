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
  updateSongHandler,
} from "./controller/song.controller";
import {
  createUserHandler,
  getCurrentUser,
} from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import {
  createSongSchema,
  deleteSongSchema,
  getSongSchema,
  updateSongSchema,
} from "./schema/song.schema";
import { createUserSchema } from "./schema/user.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

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
    [requireUser, validateResource(createSongSchema)],
    createSongHandler
  );

  app.get("/api/songs", getAllSongsHandler);

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
