import * as React from "react";

type Props = {
  spotifyUrl: string;
};

export const Embed = ({ spotifyUrl }: Props) => {
  const indexStart = 31;
  const indexEnd = 53;
  const songId = spotifyUrl.slice(indexStart, indexEnd);
  const songSrc = `https://open.spotify.com/embed/track/${songId}?utm_source=generator&theme=0`;
  return (
    <>
      <iframe
        src={songSrc}
        width="100%"
        height="352"
        // TODO: fix https://stackoverflow.com/questions/26274082/the-frameborder-attribute-on-the-iframe-element-is-obsolete-use-css-instead
        frameBorder="0"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </>
  );
};
