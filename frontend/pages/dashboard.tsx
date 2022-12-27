import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf, ZodIssueCode } from "zod";

/**
 * Dashboard
 * This is where you manage your songs
 *
 * Add a song DONE
 * Delete a song TODO
 * Update a song TODO
 * View my songs TODO
 *
 * Also redirect to home if no userData
 */

const songUrlSchema = object({
  url: string(),
}).superRefine((data, ctx) => {
  const regex = new RegExp(
    /^https:\/\/open.spotify.com\/track\/[0-9a-zA-Z]{22}([?].*)?$/
  );
  const isValid = regex.test(data.url);
  if (!isValid) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      // TODO: add better error msg
      message: `Invalid URL`,
      path: ["url"],
    });
  }
});

type AddSongUrlInput = TypeOf<typeof songUrlSchema>;

function Dashboard() {
  const [songUrlError, addSongUrlError] = useState(null);
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AddSongUrlInput>({
    resolver: zodResolver(songUrlSchema),
  });

  async function onSubmit(values: AddSongUrlInput) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/songs`,
        values,
        { withCredentials: true }
      );
      router.push("/");
    } catch (err: any) {
      addSongUrlError(err.message);
    }
  }

  return (
    <>
      <p>{songUrlError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="url">Song URL</label>
          <input
            id="url"
            type="url"
            placeholder="https://open.spotify.com/track/11deqEO4Yczb4IQHkkvVwU?si=1e4f65df02074489"
            {...register("url")}
          />
          <p>{errors.url?.message as string}</p>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Dashboard;
