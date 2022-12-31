import * as React from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";

type Props = {
  loginBtn?: React.ReactNode;
  logoutBtn?: React.ReactNode;
  returnHomeLink?: React.ReactNode;
};

const Header = ({ loginBtn, logoutBtn, returnHomeLink }: Props) => {
  const title = "SongBook";
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <nav>
        <ul className={styles.ul}>
          {returnHomeLink && (
            <li className={`${styles.li} ${styles.link}`}>{returnHomeLink}</li>
          )}
          <li className={`${styles.li} ${styles.link}`}>
            <Link href="#">About</Link>
          </li>
          {loginBtn && <li className={styles.li}>{loginBtn}</li>}
          {logoutBtn && (
            <li className={`${styles.li} ${styles.link}`}>
              <Link href="/dashboard">Manage Songs</Link>
            </li>
          )}
          {logoutBtn && <li className={styles.li}>{logoutBtn}</li>}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
