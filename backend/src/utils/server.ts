import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "config";
import routes from "../routes";
import { deserializeUser } from "../middleware";

export function createServer() {
  const app = express();
  app.use(
    cors({
      // TODO: Probably better - IS_LOCAL ? 'http://localhost:3000 : config.get("origin'),
      origin: process.env.ORIGIN ? process.env.ORIGIN : config.get("origin"),
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(deserializeUser);
  routes(app);
  return app;
}
