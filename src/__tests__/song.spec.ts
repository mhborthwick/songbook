import supertest from "supertest";
import createServer from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createSong } from "../service/song.service";

const app = createServer();
const user = new mongoose.Types.ObjectId().toString();
const songPayload = {
  user,
  url: "https://open.spotify.com/track/33yAEqzKXexYM3WlOYtTfQ",
};

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

    describe("given song does exist", () => {
      it("should return 200 and song", async () => {
        const song = await createSong(songPayload);
        const { body, statusCode } = await supertest(app).get(
          `/api/songs/${song.songId}`
        );
        expect(statusCode).toEqual(200);
        expect(body.songId).toBe(song.songId);
      });
    });
  });
});
