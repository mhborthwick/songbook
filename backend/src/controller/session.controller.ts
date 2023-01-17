import { Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";

export async function createUserSessionHandler(req: Request, res: Response) {
  const user = await validatePassword(req.body);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  const session = await createSession(user._id, req.get("user-agent") || "");
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("accessTokenTtl") } //30 min
  );
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("refreshTokenTtl") } //1 year
  );
  res.cookie("accessToken", accessToken, {
    maxAge: 1800000, //30 min
    httpOnly: true,
    domain: process.env.LOCAL_DOMAIN
      ? process.env.LOCAL_DOMAIN
      : config.get("domain"),
    path: "/",
    sameSite: "strict",
    secure: false, //TODO: set prod flag
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 3.154e10, //1 yr
    httpOnly: true,
    domain: process.env.LOCAL_DOMAIN
      ? process.env.LOCAL_DOMAIN
      : config.get("domain"),
    path: "/",
    sameSite: "strict",
    secure: false, //TODO: set prod flag
  });
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  const accessToken = req.cookies.accessToken;
  await updateSession({ _id: sessionId }, { valid: false });
  return res
    .cookie("accessToken", accessToken, {
      maxAge: 0,
      httpOnly: true,
      domain: process.env.LOCAL_DOMAIN
        ? process.env.LOCAL_DOMAIN
        : config.get("domain"),
      path: "/",
      sameSite: "strict",
      secure: false, //TODO: set prod flag
    })
    .send({
      accessToken: null,
      refreshToken: null,
    });
}
