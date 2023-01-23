import bcrypt from "bcryptjs";
import config from "config";
import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import { User } from "../models";
import { UserInput, UserDocument } from "../interfaces";

export async function createUser(input: UserInput) {
  try {
    const user = await User.create(input);
    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

interface GetUserInput {
  email: string;
}

export async function getUser(input: GetUserInput) {
  try {
    const user = await User.findOne(input);
    if (!user) {
      return false;
    }
    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function updateUserPassword(
  query: FilterQuery<UserDocument>,
  password: string
) {
  //TODO: maybe put into util function
  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
  const hash = bcrypt.hashSync(password, salt);
  return User.findOneAndUpdate(query, { password: hash }).lean();
}

type Credentials = {
  email: string;
  password: string;
};

export async function validatePassword({ email, password }: Credentials) {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return false;
  }
  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return User.findOne(query).lean();
}
