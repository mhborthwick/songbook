import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import config from "config";
import connect from "./utils/connect";
import log from "./utils/logger";
import routes from "./routes";

const port = config.get<number>("port");

const app = express();

app.use(express.json());

app.listen(port, async () => {
  log.info(`Listening on - http://localhost:${port}`);
  await connect();
  routes(app);
});
