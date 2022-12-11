import { GetServerSideProps, NextPage } from "next";
import useSwr from "swr";
import styles from "../styles/Home.module.css";
import fetcher from "../utils/fetcher";

interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  session: string;
  iat: number;
  exp: number;
}

const Home: NextPage<{ fallbackData: User }> = ({ fallbackData }) => {
  const { data, error } = useSwr<User | null>(
    `
    ${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me
  `,
    fetcher,
    { fallbackData }
  );
  if (data) {
    return <div>Welcome {data.name}</div>;
  }
  return <div className={styles.container}>Please Login</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetcher(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    context.req.headers
  );
  return {
    props: {
      fallbackData: data,
    },
  };
};

export default Home;
