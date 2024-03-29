import mongoose from "mongoose";
import config from "config";
import { log } from "./logger";

export async function connect() {
  const dbUri = process.env.MONGO_URL
    ? process.env.MONGO_URL
    : config.get<string>("dbUri");
  try {
    await mongoose.connect(dbUri);
    log.info("Connected to DB");
  } catch (err) {
    log.error("Failed connecting to DB");
    log.info(err);
    process.exit(1);
  }
}
