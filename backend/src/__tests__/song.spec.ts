const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", "..", ".env") });

import supertest from "supertest";
import createServer from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createSong } from "../service/song.service";
import { signJwt } from "../utils/jwt.utils";

const app = createServer();
const user = new mongoose.Types.ObjectId().toString();

const songPayload = {
  user,
  url: "https://open.spotify.com/track/33yAEqzKXexYM3WlOYtTfQ",
};

const invalidSongPayload = {
  user,
  url: "invalid data",
};

const userPayload = {
  _id: user,
  email: "jane.doe@example.com",
  name: "Jane Doe",
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
        expect(statusCode).toBe(200);
        expect(body.songId).toBe(song.songId);
      });
    });
  });

  describe("create song route", () => {
    describe("given user is not logged in", () => {
      it("should return 403", async () => {
        const { statusCode } = await supertest(app).post("/api/songs");
        expect(statusCode).toBe(403);
      });
    });

    describe("given user is logged in and sends valid data", () => {
      it("should return 200 and create song", async () => {
        const jwt = signJwt(userPayload);
        const { body, statusCode } = await supertest(app)
          .post("/api/songs")
          .set("Authorization", `Bearer ${jwt}`)
          .send(songPayload);
        expect(statusCode).toBe(200);
        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          songId: expect.any(String),
          updatedAt: expect.any(String),
          url: "https://open.spotify.com/track/33yAEqzKXexYM3WlOYtTfQ",
          user: expect.any(String),
        });
      });
    });

    describe("given user is logged in and sends invalid data", () => {
      it("should return 400", async () => {
        const jwt = signJwt(userPayload);
        const { statusCode } = await supertest(app)
          .post("/api/songs")
          .set("Authorization", `Bearer ${jwt}`)
          .send(invalidSongPayload);
        expect(statusCode).toBe(400);
      });
    });
  });
});
