import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";
import config from "config";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
  const refreshToken =
    get(req, "cookies.refreshToken") ||
    (get(req, "headers.x-refresh") as string);

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      res.cookie("accessToken", newAccessToken, {
        maxAge: 900000, //15 min
        httpOnly: true,
        domain: process.env.LOCAL_DOMAIN
          ? process.env.LOCAL_DOMAIN
          : config.get("domain"),
        path: "/",
        sameSite: "strict",
        secure: false, //TODO: set prod flag
      });
    }
    const result = verifyJwt(<string>newAccessToken);
    res.locals.user = result.decoded;
    return next();
  }

  return next();
};

export default deserializeUser;
