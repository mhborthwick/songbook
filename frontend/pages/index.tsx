import axios from "axios";
import useSwr from "swr";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps, NextPage } from "next";
import { object, string, TypeOf, ZodIssueCode } from "zod";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Embed from "../components/Embed";
import Footer from "../components/Footer";
import { Count, Song, User } from "../interfaces";
import fetcher from "../utils/fetcher";
import styles from "../styles/Home.module.css";
import embedStyles from "../styles/Embed.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";

const endpoint = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;
const pageSize = 10;

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

// Might be okay not using swr in this component
function Page({
  skip,
  limit,
  songs,
}: {
  skip: number;
  limit: number;
  songs: Song[];
}) {
  const {
    data: songData,
    error: songError,
    mutate,
    isLoading,
    isValidating,
  } = useSwr<Song[] | null>(
    `
    ${endpoint}/api/songs?skip=${skip}&limit=${limit}
    `,
    fetcher,
    { fallbackData: songs }
  );

  // TODO: handle loading and error states
  if (!songData || isLoading) {
    return <></>;
  }

  const songsList = songData.map((s, i) => (
    <li key={i} className={embedStyles.li}>
      <Embed spotifyUrl={s.url} />
      <div className={embedStyles.sharedBy}>
        Shared by {s.name} at {new Date(s.updatedAt).toLocaleString()}
      </div>
    </li>
  ));

  return <>{songsList}</>;
}

const Home: NextPage<{
  fallbackData: { user: User; songs: Song[]; count: Count };
}> = ({ fallbackData }) => {
  const { user, songs, count } = fallbackData;
  const [index, setIndex] = useState({ skip: 0, limit: pageSize });

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

  const {
    data: songData,
    error: songError,
    mutate,
    isLoading: isSongLoading,
    isValidating: isSongValidating,
  } = useSwr<Song[] | null>(
    `
    ${endpoint}/api/songs?skip=${index.skip}&limit=${index.limit}
    `,
    fetcher,
    { fallbackData: songs }
  );

  const {
    data: countData,
    error: countError,
    mutate: countMutate,
  } = useSwr<Count | null>(
    `
    ${endpoint}/api/songs-count
    `,
    fetcher,
    { fallbackData: count }
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
      await axios.post(
        `${endpoint}/api/songs?skip=${0}&limit=${pageSize}`,
        values,
        {
          withCredentials: true,
        }
      );
      await mutate(); //refresh SWR https://benborgers.com/posts/swr-refres
      await countMutate(); //refresh count swr
      // on submit redirect to first page
      setIndex({ skip: 0, limit: pageSize });
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

  if (!songData || !countData || isSongLoading) {
    return <div>Loading...</div>;
  }

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
              Check out the songs below or sign up to share a song for a future
              visitor.
            </p>
            <Link href="auth/register" className={styles.joinButton}>
              Sign up
            </Link>
          </>
        )}
        {songData ? (
          <div>
            <main>
              <ul className={embedStyles.ul}>
                <Page skip={index.skip} limit={index.limit} songs={songData} />
                <div style={{ display: "none" }}>
                  <Page
                    skip={index.skip + pageSize}
                    limit={index.limit + 0}
                    songs={songData}
                  />
                </div>
              </ul>
            </main>

            {countData.count > pageSize ? (
              <div className={styles.loadMoreContainer}>
                <button
                  onClick={() =>
                    setIndex({
                      skip: index.skip === 0 ? 0 : index.skip - pageSize,
                      limit: index.limit + 0,
                    })
                  }
                  className={`${styles.loadMorePrev} ${
                    index.skip === 0 ? null : styles.buttonActive
                  }`}
                  disabled={index.skip === 0 ? true : false}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setIndex({
                      skip: index.skip + pageSize,
                      limit: index.limit + 0,
                    })
                  }
                  className={`${styles.loadMoreNext} ${
                    countData.count === 0 ||
                    countData.count - index.skip <= pageSize
                      ? null
                      : styles.buttonActive
                  }`}
                  disabled={
                    countData.count === 0 ||
                    countData.count - index.skip <= pageSize
                      ? true
                      : false
                  }
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const songs = await fetcher<Song[]>(
    `${endpoint}/api/songs?skip=${0}&limit=${pageSize}`
  );
  const count = await fetcher<Count>(`${endpoint}/api/songs-count`);
  const user = await fetcher<User>(`${endpoint}/api/me`, context.req.headers);
  return {
    props: {
      fallbackData: {
        user,
        songs,
        count,
      },
    },
  };
};

export default Home;
