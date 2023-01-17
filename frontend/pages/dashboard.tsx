import useSwr from "swr";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import fetcher from "../utils/fetcher";
import Embed from "../components/Embed";
import embedStyles from "../styles/Embed.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import RemoveBtn from "../components/RemoveBtn";
import UpdateSongForm from "../components/UpdateSongForm";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * Dashboard
 * This is where you manage your songs
 *
 * Add a song DONE
 * Delete a song DONE
 * Update a song DONE
 * View my songs DONE
 * Refresh Add song form after submit DONE
 * Add alert when someone deletes a song DONE
 * Only allow 3 songs per account DONE
 * Add a footer DONE
 * Sort order of my songs desc DONE
 * Sort order of all songs by updatedAt DONE
 * Add Google oAuth MAYBE LATER
 * Clean up login page DONE
 * Clean up register page DONE
 * Add ability to log out TODO
 * Remove welcome message TODO
 * Create reset password functionality TODO
 * Add pagination [Probably] TODO
 * If on dashboard, redirect to home if no userData TODO [At the end]
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

const Dashboard: NextPage<{
  fallbackData: { user: User; mySongs: Song[] };
}> = ({ fallbackData }) => {
  // console.log(fallbackData);
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
