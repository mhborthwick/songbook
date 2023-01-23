export interface User {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  email: string;
  name: string;
  session: string;
  iat: number;
  exp: number;
}

export interface Song {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  songId: string;
  url: string;
  user: string;
  name: string;
}

export interface Count {
  count: number;
}

export interface QAndA {
  question: string;
  answer: JSX.Element;
}
