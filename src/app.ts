import * as dotenv from "dotenv";
dotenv.config();
import config from "config";
import connect from "./utils/connect";
import log from "./utils/logger";
import createServer from "./utils/server";

const port = config.get<number>("port");

const app = createServer();

app.listen(port, async () => {
  log.info(`Listening on - http://localhost:${port}`);
  await connect();
});
