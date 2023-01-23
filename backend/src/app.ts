import * as dotenv from "dotenv";
dotenv.config();
import config from "config";
import { connect, createServer, log } from "./utils";

const port = config.get<number>("port");

const app = createServer();

app.listen(port, async () => {
  log.info(`Listening on - http://localhost:${port}`);
  await connect();
});
