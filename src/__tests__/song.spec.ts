import supertest from "supertest";
import createServer from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const app = createServer();

describe("song", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get song route", () => {
    describe("given song does not exist", () => {
      it("should return 404", async () => {
        const songId = "song-123";
        await supertest(app).get(`/api/songs/${songId}`).expect(404);
      });
    });
  });
});
