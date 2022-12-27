import * as React from "react";

type Props = {
  songId: string;
  handleRemoveBtnClick: (songId: string) => Promise<void>;
};

const RemoveBtn = ({ songId, handleRemoveBtnClick }: Props) => {
  return (
    <button onClick={async () => await handleRemoveBtnClick(songId)}>
      Remove
    </button>
  );
};

export default RemoveBtn;
