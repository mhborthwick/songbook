import jwt from "jsonwebtoken";
import config from "config";

const privateKey = <string>process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");
const publicKey = config.get<string>("public_key");

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    // console.log(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
