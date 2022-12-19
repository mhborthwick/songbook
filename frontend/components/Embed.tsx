import * as React from "react";
import styles from "../styles/Embed.module.css";

type Props = {
  spotifyUrl: string;
  name: string;
  createdAt: string;
};

const Embed = ({ spotifyUrl, name, createdAt }: Props) => {
  const indexStart = 31;
  const indexEnd = 53;
  const songId = spotifyUrl.slice(indexStart, indexEnd);
  const songSrc = `https://open.spotify.com/embed/track/${songId}?utm_source=generator&theme=0`;
  return (
    <>
      <iframe
        style={{ borderRadius: "12px" }}
        src={songSrc}
        width="100%"
        height="352"
        frameBorder="0"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      <div className={styles.sharedBy}>
        Shared by {name} at {new Date(createdAt).toLocaleString()}
      </div>
    </>
  );
};

export default Embed;
