import * as React from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";

type Props = {
  loginBtn?: React.ReactNode;
  welcomeMsg?: React.ReactNode;
};

const Header = ({ loginBtn, welcomeMsg }: Props) => {
  const title = "SongBook";
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <nav>
        <ul className={styles.ul}>
          <li className={`${styles.li} ${styles.link}`}>
            <Link href="#">About</Link>
          </li>
          {loginBtn && <li className={styles.li}>{loginBtn}</li>}
          {welcomeMsg && (
            <>
              <li className={`${styles.li} ${styles.link}`}>
                <Link href="/dashboard">Manage Songs</Link>
              </li>
              <li className={styles.li}>
                <i>{welcomeMsg}</i>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
