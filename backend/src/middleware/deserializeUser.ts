import config from "config";
import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils";
import { reIssueAccessToken } from "../service";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "") ||
    get(req, "cookies.accessToken");
  const refreshToken =
    get(req, "cookies.refreshToken") ||
    (get(req, "headers.x-refresh") as string);

  if (!accessToken) {
    return next();
  }

  const { decoded, expired, valid } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  const isResetPasswordRoute = req.path === "/api/password-reset";

  if (isResetPasswordRoute && (!valid || expired)) {
    return next();
  }

  if (refreshToken && (!valid || expired)) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      res.cookie("accessToken", newAccessToken, {
        maxAge: 1800000, //30 min
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
