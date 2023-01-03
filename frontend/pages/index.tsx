import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { object, string, TypeOf, ZodIssueCode } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios from "axios";
import useSwr from "swr";
import Header from "../components/Header";
import Embed from "../components/Embed";
import styles from "../styles/Home.module.css";
import embedStyles from "../styles/Embed.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import fetcher from "../utils/fetcher";
import Footer from "../components/Footer";

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

console.log(endpoint);

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

const Home: NextPage<{ fallbackData: { user: User; songs: Song[] } }> = ({
  fallbackData,
}) => {
  const { user, songs } = fallbackData;
  const {
    data: userData,
    error: userError,
    mutate: userMutate,
  } = useSwr<User | null>(
    `
    ${endpoint}/api/me
    `,
    fetcher,
    { fallbackData: user }
  );
  console.log(userData);
  const {
    data: songData,
    error: songError,
    mutate,
  } = useSwr<Song[] | null>(
    `
    ${endpoint}/api/songs
    `,
    fetcher,
    { fallbackData: songs }
  );

  const [songUrlError, addSongUrlError] = useState<string | null>(null);

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
  }, [isSubmitSuccessful, formState, reset]);

  async function onSubmit(values: AddSongUrlInput) {
    try {
      await axios.post(`${endpoint}/api/songs`, values, {
        withCredentials: true,
      });
      await mutate(); //refresh SWR https://benborgers.com/posts/swr-refres
    } catch (err: any) {
      const hasReachedLimitMsg = err.response.data.message;
      if (hasReachedLimitMsg === "Reached max limit") {
        addSongUrlError(
          "You have hit your limit for adding songs. Update or remove an existing song."
        );
      } else {
        addSongUrlError(err.message);
      }
    }
  }

  async function onLogOut() {
    try {
      await axios.delete(`${endpoint}/api/sessions`, { withCredentials: true });
      await userMutate();
    } catch (err: any) {
      // TODO: improve error message
      console.log(err);
    }
  }

  // const welcomeMsg = userData ? <h1>Welcome, {userData.name}</h1> : null;
  const loginBtn = !userData ? (
    <Link href="/auth/login" className={styles.login}>
      Log In
    </Link>
  ) : null;
  const logoutBtn = userData ? (
    <button className={styles.logout} onClick={onLogOut}>
      Log Out
    </button>
  ) : null;
  const songsList = songData ? (
    <main>
      <ul className={embedStyles.ul}>
        {songData.map((s, i) => (
          <li key={i} className={embedStyles.li}>
            <Embed spotifyUrl={s.url} />
            <div className={embedStyles.sharedBy}>
              Shared by {s.name} at {new Date(s.updatedAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </main>
  ) : null;
  return (
    <>
      <div className={styles.container}>
        <Header loginBtn={loginBtn} logoutBtn={logoutBtn} />
        {userData ? (
          //TODO: clean style imports
          <>
            <h2>Add a song</h2>
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
          </>
        ) : (
          <>
            <h2>Welcome!</h2>
            <p>
              Check out the songs below or{" "}
              <Link
                style={{ textDecoration: "underline" }}
                href="auth/register"
              >
                join
              </Link>{" "}
              to share a song for a future visitor.
            </p>
          </>
        )}
        {songsList}
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const songs = await fetcher(`${endpoint}/api/songs`);
  const user = await fetcher(`${endpoint}/api/me`, context.req.headers);
  return {
    props: {
      fallbackData: {
        user,
        songs,
      },
    },
  };
};

export default Home;
