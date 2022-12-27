import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import useSwr from "swr";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf, ZodIssueCode } from "zod";
import { GetServerSideProps, NextPage } from "next";
import fetcher from "../utils/fetcher";

/**
 * Dashboard
 * This is where you manage your songs
 *
 * Add a song DONE
 * Delete a song TODO
 * Update a song TODO
 * View my songs PROGRESS
 *
 * Also redirect to home if no userData
 */

interface User {
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

interface Song {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  songId: string;
  url: string;
  user: string;
  name: string;
}

const endpoint = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

const songUrlSchema = object({
  url: string(),
}).superRefine((data, ctx) => {
  const regex = new RegExp(
    /^https:\/\/open.spotify.com\/track\/[0-9a-zA-Z]{22}([?].*)?$/
  );
  const isValid = regex.test(data.url);
  if (!isValid) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      // TODO: add better error msg
      message: `Invalid URL`,
      path: ["url"],
    });
  }
});

type AddSongUrlInput = TypeOf<typeof songUrlSchema>;

const Dashboard: NextPage<{
  fallbackData: { user: User; mySongs: Song[] };
}> = ({ fallbackData }) => {
  console.log(fallbackData);
  const { user, mySongs } = fallbackData;
  const { data: userData, error: userError } = useSwr<User | null>(
    `
    ${endpoint}/api/me
    `,
    fetcher,
    { fallbackData: user }
  );
  const { data: mySongsData, error: songError } = useSwr<Song[] | null>(
    `
    ${endpoint}/api/songs
    `,
    fetcher,
    { fallbackData: mySongs }
  );

  const [songUrlError, addSongUrlError] = useState(null);
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AddSongUrlInput>({
    resolver: zodResolver(songUrlSchema),
  });

  async function onSubmit(values: AddSongUrlInput) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/songs`,
        values,
        { withCredentials: true }
      );
      router.push("/");
    } catch (err: any) {
      addSongUrlError(err.message);
    }
  }

  return (
    <>
      <p>{songUrlError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="url">Song URL</label>
          <input
            id="url"
            type="url"
            placeholder="https://open.spotify.com/track/11deqEO4Yczb4IQHkkvVwU?si=1e4f65df02074489"
            {...register("url")}
          />
          <p>{errors.url?.message as string}</p>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await fetcher(`${endpoint}/api/me`, context.req.headers);
  const mySongs = await fetcher(
    `${endpoint}/api/my-songs`,
    context.req.headers
  );
  return {
    props: {
      fallbackData: {
        user,
        mySongs,
      },
    },
  };
};

export default Dashboard;
