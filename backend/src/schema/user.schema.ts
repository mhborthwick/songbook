import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;

export const getUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
  }),
});

export type GetUserInput = TypeOf<typeof getUserSchema>;

const payload = {
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
};

export const updateUserPasswordSchema = object({
  ...payload,
});

export type UpdateUserPasswordInput = TypeOf<typeof updateUserPasswordSchema>;
