import { GetServerSideProps, NextPage } from "next";
import Header from "../components/Header";
import Embed from "../components/Embed";
import useSwr from "swr";
import styles from "../styles/Home.module.css";
import embedStyles from "../styles/Embed.module.css";
import fetcher from "../utils/fetcher";

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
}

const endpoint = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

const Home: NextPage<{ fallbackData: { user: User; songs: Song[] } }> = ({
  fallbackData,
}) => {
  const { user, songs } = fallbackData;
  const { data: userData, error: userError } = useSwr<User | null>(
    `
    ${endpoint}/api/me
    `,
    fetcher,
    { fallbackData: user }
  );
  const { data: songData, error: songError } = useSwr<Song[] | null>(
    `
    ${endpoint}/api/songs
    `,
    fetcher,
    { fallbackData: songs }
  );
  const welcomeMsg = userData ? (
    <div>Welcome {userData.name}</div>
  ) : (
    <div>Login to share songs</div>
  );
  const songsList = songData ? (
    <main>
      <ul className={embedStyles.ul}>
        {songData.map((s, i) => (
          <li key={i} className={embedStyles.li}>
            <Embed spotifyUrl={s.url} />
          </li>
        ))}
      </ul>
    </main>
  ) : null;
  return (
    <div className={styles.container}>
      <Header welcomeMsg={welcomeMsg} />
      {songsList}
    </div>
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
