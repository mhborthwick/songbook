import * as React from "react";
import styles from "../styles/Header.module.css";

type Props = {
  welcomeMsg?: React.ReactNode;
};

const Header = ({ welcomeMsg }: Props) => {
  const title = "SongBook";
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <nav>
        <ul className={styles.ul}>
          <li className={styles.li}>About</li>
          <li className={styles.li}>{welcomeMsg}</li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
