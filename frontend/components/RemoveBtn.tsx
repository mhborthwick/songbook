import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { KeyedMutator } from "swr";
import removeBtnStyles from "../styles/Dashboard.module.css";

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

type Props = {
  songId: string;
  refresh: KeyedMutator<Song[] | null>;
};

const RemoveBtn = ({ songId, refresh }: Props) => {
  const [removeSongError, handleRemoveSongError] = useState<string | null>(
    null
  );

  async function handleRemoveBtnClick(songId: string) {
    try {
      const results = confirm("Are you sure you want to remove this song?");
      if (results === false) {
        throw Error("Remove song request aborted");
      }
      await axios.delete(`${endpoint}/api/songs/${songId}`, {
        withCredentials: true,
      });
      await refresh(); //refresh SWR https://benborgers.com/posts/swr-refresh
    } catch (err: any) {
      if (err.message !== "Remove song request aborted") {
        handleRemoveSongError("Something went wrong. Try again.");
      }
    }
  }

  return (
    <>
      <button
        className={removeBtnStyles.remove}
        onClick={async () => await handleRemoveBtnClick(songId)}
      >
        Remove
      </button>
      {removeSongError && (
        <i className={removeBtnStyles.error}>{removeSongError}</i>
      )}
    </>
  );
};

export default RemoveBtn;
