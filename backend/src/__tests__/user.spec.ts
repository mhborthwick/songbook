const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", "..", ".env") });

import * as UserService from "../service/user.service";
import * as SessionService from "../service/session.service";
import mongoose from "mongoose";
import supertest from "supertest";
import createServer from "../utils/server";
import { createUserSessionHandler } from "../controller/session.controller";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

const userInput = {
  email: "jane.doe@example.com",
  name: "Jane Doe",
  password: "password123",
  passwordConfirmation: "password123",
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.29.0",
  createdAt: new Date("2022-11-27T09:10:14.933Z"),
  updatedAt: new Date("2022-11-27T09:10:14.933Z"),
  __v: 0,
};

describe("user", () => {
  describe("user registration", () => {
    describe("given username and password are valid", () => {
      it("should return user payload", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);
        const { body, statusCode } = await supertest(app)
          .post("/api/users")
          .send(userInput);
        expect(statusCode).toBe(200);
        expect(body).toEqual(userPayload);
        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    describe("given passwords do not match", () => {
      it("should return 400", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);
        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send({ ...userInput, passwordConfirmation: "does not match" });
        expect(statusCode).toBe(400);
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe("given user service throws", () => {
      it("should return 409", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          // @ts-ignore
          .mockRejectedValueOnce("Oops, something went wrong!");
        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send(userInput);
        expect(statusCode).toBe(409);
        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });

  describe("create user session", () => {
    describe("given username and password are valid", () => {
      it("should return signed access token and refresh token", async () => {
        jest
          .spyOn(UserService, "validatePassword")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);
        jest
          .spyOn(SessionService, "createSession")
          // @ts-ignore
          .mockReturnValueOnce(sessionPayload);
        const req = {
          get: () => {
            return "user agent";
          },
          body: {
            email: "jane.doe@example.com",
            password: "password123",
          },
        };
        const send = jest.fn();
        const res = {
          send,
        };
        // @ts-ignore
        await createUserSessionHandler(req, res);
        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
});
