import sgMail from "@sendgrid/mail";
import config from "config";
import { emailHtml } from "./email";

sgMail.setApiKey(<string>process.env.SEND_GRID_API_KEY);

interface Message {
  to: string;
  from: {
    name: string;
    email: string;
  };
  subject: string;
  html: string;
}

export function createMsg(email: string, accessToken: string) {
  const domain = config.get<string>("origin");
  const link = `${domain}/auth/resetPassword?token=${accessToken}`;

  return {
    to: email,
    from: {
      name: "Mike from Songbook",
      email: <string>process.env.FROM_EMAIL,
    },
    subject: "Reset your password",
    html: emailHtml(link),
  };
}

export async function sendMail(msg: Message) {
  try {
    await sgMail.send(msg);
  } catch (err: any) {
    throw Error(err);
  }
}
