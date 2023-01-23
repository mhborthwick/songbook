import { object, string, TypeOf, ZodIssueCode } from "zod";

const payload = {
  body: object({
    url: string(),
  }).superRefine((data, ctx) => {
    const regex = new RegExp(
      /^https:\/\/open.spotify.com\/track\/[0-9a-zA-Z]{22}([?].*)?$/
    );
    const isValid = regex.test(data.url);
    if (!isValid) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        // TODO: Add better error msg
        message: `Invalid URL`,
        path: ["url"],
      });
    }
  }),
};

const params = {
  params: object({
    songId: string({
      required_error: "SongId is required",
    }),
  }),
};

export const createSongSchema = object({
  ...payload,
});

export const updateSongSchema = object({
  ...payload,
  ...params,
});

export const getSongSchema = object({
  ...params,
});

export const deleteSongSchema = object({
  ...params,
});

export type CreateSongInput = TypeOf<typeof createSongSchema>;
export type UpdateSongInput = TypeOf<typeof updateSongSchema>;
export type GetSongInput = TypeOf<typeof getSongSchema>;
export type deleteSongInput = TypeOf<typeof deleteSongSchema>;
