import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { object, string, TypeOf, ZodIssueCode } from "zod";
import axios from "axios";
import { KeyedMutator } from "swr";
import dashboardStyles from "../styles/Dashboard.module.css";

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

type Props = {
  songId: string;
  refresh: KeyedMutator<Song[] | null>;
};

const endpoint = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

export const UpdateSongForm = ({ songId, refresh }: Props) => {
  const [songError, updateSongError] = useState(null);

  const updateSongSchema = object({
    url: string(),
    songId: string(),
  }).superRefine((data, ctx) => {
    const regex = new RegExp(
      /^https:\/\/open.spotify.com\/track\/[0-9a-zA-Z]{22}([?].*)?$/
    );
    const isValid = regex.test(data.url);
    if (!isValid) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `Invalid track link. Fix your link and try again.`,
        path: ["url"],
      });
    }
  });

  type UpdateSongInput = TypeOf<typeof updateSongSchema>;

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
    formState,
  } = useForm<UpdateSongInput>({
    resolver: zodResolver(updateSongSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ url: "" });
    }
  }, [isSubmitSuccessful, formState, reset]);

  async function updateSongOnSubmit(values: UpdateSongInput) {
    try {
      const { songId, url } = values;
      // console.log(songId, url); //TODO: remove
      await axios.put(
        `${endpoint}/api/songs/${songId}`,
        { url },
        { withCredentials: true }
      );
      await refresh(); //refresh SWR https://benborgers.com/posts/swr-refresh
    } catch (err: any) {
      updateSongError(err.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(updateSongOnSubmit)}>
        <div className={dashboardStyles.fields}>
          <input type="hidden" value={songId} {...register("songId")} />
          <label className={dashboardStyles.label} htmlFor="url">
            Spotify Track Link:
          </label>
          <div className={dashboardStyles.wrapper}>
            <input
              className={dashboardStyles.input}
              id="url"
              type="url"
              placeholder="e.g. https://open.spotify.com/track/11deqEO4Yczb4IQHkkvVwU?si=1e4f65df02074489"
              {...register("url")}
            />
            <button className={dashboardStyles.submit} type="submit">
              Update
            </button>
          </div>
          <i className={dashboardStyles.error}>
            {errors.url?.message as string}
          </i>
          <i className={dashboardStyles.error}>{songError}</i>
        </div>
      </form>
    </div>
  );
};
