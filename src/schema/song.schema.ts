import { object, string, TypeOf } from "zod";

// TODO: Refine url

const payload = {
  body: object({
    url: string({
      required_error: "Url is required",
    }),
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
