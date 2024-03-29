import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createSong } from "../service";
import { createServer, signJwt } from "../utils";

const app = createServer();
const user = new mongoose.Types.ObjectId().toString();

const songPayload = {
  user,
  name: "Jane Doe",
  // D.A.N.C.E. by Justice 🕺
  url: "https://open.spotify.com/track/33yAEqzKXexYM3WlOYtTfQ",
};

const songPayload2 = {
  user,
  name: "Jane Doe",
  // Someday by The Strokes 🎸
  url: "https://open.spotify.com/track/7hm4HTk9encxT0LYC0J6oI?si=6d7f7c0743034392",
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

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const c of collections) {
      await c.deleteMany({});
    }
  });

  describe("update songs route", () => {
    describe("given user is not logged in", () => {
      it("should return 403", async () => {
        const songId = "song-123";
        const { statusCode } = await supertest(app)
          .put(`/api/songs/${songId}`)
          .send(songPayload);
        expect(statusCode).toBe(403);
      });
    });

    describe("given user is logged in and updates song", () => {
      it("should return 200 and updated song", async () => {
        const { songId } = await createSong(songPayload);
        const jwt = signJwt(userPayload);
        const { body, statusCode } = await supertest(app)
          .put(`/api/songs/${songId}`)
          .set("Authorization", `Bearer ${jwt}`)
          .send(songPayload2);
        expect(statusCode).toBe(200);
        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          name: expect.any(String),
          songId: expect.any(String),
          updatedAt: expect.any(String),
          url: "https://open.spotify.com/track/7hm4HTk9encxT0LYC0J6oI?si=6d7f7c0743034392",
          user: expect.any(String),
        });
      });
    });
  });

  describe("get my songs route", () => {
    describe("given user is not logged in", () => {
      it("should return 403", async () => {
        const { statusCode } = await supertest(app).get("/api/my-songs");
        expect(statusCode).toBe(403);
      });
    });

    describe("given user is logged in and has added a song", () => {
      it("should return 200 and array containing their song", async () => {
        await createSong(songPayload);
        const jwt = signJwt(userPayload);
        const { body, statusCode } = await supertest(app)
          .get("/api/my-songs")
          .set("Authorization", `Bearer ${jwt}`);
        expect(statusCode).toBe(200);
        expect(body).toHaveLength(1);
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              __v: 0,
              _id: expect.any(String),
              createdAt: expect.any(String),
              name: "Jane Doe",
              songId: expect.any(String),
              updatedAt: expect.any(String),
              url: "https://open.spotify.com/track/33yAEqzKXexYM3WlOYtTfQ",
              user,
            }),
          ])
        );
      });
    });
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
          name: expect.any(String),
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
