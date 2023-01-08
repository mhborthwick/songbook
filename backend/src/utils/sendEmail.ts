import sgMail from "@sendgrid/mail";

sgMail.setApiKey(<string>process.env.SEND_GRID_API_KEY);

interface Message {
  to: string;
  from: {
    name: string;
    email: string;
  };
  subject: string;
  text: string;
  html: string;
}

export function createMsg(email: string, accessToken: string) {
  const link = `https://songbookfrontend-production.up.railway.app/auth/resetPassword/${accessToken}`;
  return {
    to: email,
    from: {
      name: "Mike from Songbook",
      email: process.env.FROM_EMAIL,
    },
    subject: "Reset your password",
    text: link, // TODO: update later
    html: `<a href=${link} target="_blank">${link}</a>`, // TODO: update later
  };
}

export async function sendMail(msg: Message) {
  try {
    await sgMail.send(msg);
  } catch (err: any) {
    throw Error(err);
  }
}
