import useSwr from "swr";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Embed from "../components/Embed";
import RemoveBtn from "../components/RemoveBtn";
import UpdateSongForm from "../components/UpdateSongForm";
import Header from "../components/Header";
import Footer from "../components/Footer";
import fetcher from "../utils/fetcher";
import { Song, User } from "../interfaces";
import embedStyles from "../styles/Embed.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";

const endpoint = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

const Dashboard: NextPage<{
  fallbackData: { user: User; mySongs: Song[] };
}> = ({ fallbackData }) => {
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

  const songsList = mySongsData ? (
    <main>
      <ul className={dashboardStyles.ul}>
        {mySongsData.map((s, i) => (
          <li
            key={i}
            className={`${embedStyles.li} ${dashboardStyles.listBorder}`}
          >
            <div className={dashboardStyles.removeBtnContainer}>
              <RemoveBtn songId={s.songId} refresh={mutate} />
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
    <>
      <div className={dashboardStyles.container}>
        <Header returnHomeLink={returnHomeLink} />
        <h2 style={{ marginBottom: 0 }}>Update or Remove songs</h2>
        <div>{songsList}</div>
      </div>
      <Footer />
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
