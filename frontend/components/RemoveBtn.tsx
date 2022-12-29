import * as React from "react";
import removeBtnStyles from "../styles/Dashboard.module.css";

type Props = {
  songId: string;
  handleRemoveBtnClick: (songId: string) => Promise<void>;
};

const RemoveBtn = ({ songId, handleRemoveBtnClick }: Props) => {
  return (
    <button
      className={removeBtnStyles.remove}
      onClick={async () => await handleRemoveBtnClick(songId)}
    >
      Remove
    </button>
  );
};

export default RemoveBtn;
