import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import useSwr from "swr";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf, ZodIssueCode } from "zod";
import { GetServerSideProps, NextPage } from "next";
import fetcher from "../utils/fetcher";
import Embed from "../components/Embed";
import embedStyles from "../styles/Embed.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import RemoveBtn from "../components/RemoveBtn";
import UpdateSongForm from "../components/UpdateSongForm";
import Header from "../components/Header";
import Link from "next/link";

/**
 * Dashboard
 * This is where you manage your songs
 *
 * Add a song DONE
 * Delete a song DONE
 * Update a song DONE
 * View my songs DONE
 *
 * Also redirect to home if no userData TODO
 * Sort order of my songs desc TODO
 * Refresh Add song form after submit TODO
 * Add alert when someone deletes a song TODO
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
      message: `Invalid track link. Fix your link and try again.`,
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
  const {
    data: mySongsData,
    error: songError,
    mutate,
  } = useSwr<Song[] | null>(
    `
    ${endpoint}/api/my-songs
    `,
    fetcher,
    { fallbackData: mySongs }
  );

  const [songUrlError, addSongUrlError] = useState(null);

  const router = useRouter();

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
    formState,
  } = useForm<AddSongUrlInput>({
    resolver: zodResolver(songUrlSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ url: "" });
    }
  }, [formState, reset]);

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

  async function handleRemoveBtnClick(songId: string) {
    try {
      await axios.delete(`${endpoint}/api/songs/${songId}`, {
        withCredentials: true,
      });
      await mutate(); //refresh SWR https://benborgers.com/posts/swr-refresh
    } catch (err: any) {
      // TODO: add better error handler
      console.log(err);
    }
  }

  const songsList = mySongsData ? (
    <main>
      <ul className={embedStyles.ul}>
        {mySongsData.map((s, i) => (
          <li
            key={i}
            className={`${embedStyles.li} ${dashboardStyles.listBorder}`}
          >
            <div className={dashboardStyles.removeBtnContainer}>
              <RemoveBtn
                songId={s.songId}
                handleRemoveBtnClick={handleRemoveBtnClick}
              />
            </div>
            <Embed spotifyUrl={s.url} />
            <div className={dashboardStyles.sharedBy}>
              <p>Shared by You at {new Date(s.updatedAt).toLocaleString()}</p>
            </div>
            <UpdateSongForm songId={s.songId} refresh={mutate} />
          </li>
        ))}
      </ul>
    </main>
  ) : null;

  const returnHomeLink = <Link href="/">Home</Link>;

  return (
    <div className={dashboardStyles.container}>
      <Header returnHomeLink={returnHomeLink} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={dashboardStyles.fields}>
          <label className={dashboardStyles.label} htmlFor="url">
            Spotify Track Link:
          </label>
          <div className={dashboardStyles.wrapper}>
            <input
              className={dashboardStyles.input}
              id="url"
              type="url"
              placeholder="e.g. https://open.spotify.com/track/11deqEO4Yczb4IQHkkvVwU?si=1e4f65df02074489"
              {...register("url")}
            />
            <button className={dashboardStyles.submit} type="submit">
              Add
            </button>
          </div>
          <i className={dashboardStyles.error}>
            {errors.url?.message as string}
          </i>
          <i className={dashboardStyles.error}>{songUrlError}</i>
        </div>
      </form>
      <div>{songsList}</div>
    </div>
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
