import { Request, Response } from "express";
import {
  CreateUserInput,
  GetUserInput,
  UpdateUserPasswordInput,
} from "../schema";
import { createUser, getUser, updateUserPassword } from "../service";
import { signJwt, log, createMsg, sendMail } from "../utils";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  return res.send(res.locals.user);
}

export async function createPasswordResetEmailHandler(
  req: Request<{}, {}, GetUserInput["body"]>,
  res: Response
) {
  const user = await getUser(req.body);
  if (!user) {
    return res.status(403).send("User by that email does not exist");
  }
  const accessToken = signJwt(
    { ...user },
    { expiresIn: "15m" } //keep this set to 15 min
  );
  const message = createMsg(user.email, accessToken);
  try {
    await sendMail(message);
    return res.status(200).send({ accessToken });
  } catch (err: any) {
    return res.status(400).send(err.message);
  }
}

export async function updateUserPasswordHandler(
  req: Request<{}, {}, UpdateUserPasswordInput["body"]>,
  res: Response
) {
  const { password } = req.body;
  // TODO: Maybe switch to use "_id"
  const email = res.locals.user.email;
  try {
    await updateUserPassword({ email }, password);
    return res.sendStatus(200);
  } catch (err: any) {
    return res.status(403).send(err.message);
  }
}
