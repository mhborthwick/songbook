import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import loginStyles from "../../styles/Login.module.css";
import Header from "../../components/Header";
import Link from "next/link";
import Footer from "../../components/Footer";
import { GetServerSideProps } from "next";

// TODO
// require password confirmation

const updatePasswordSchema = object({
  password: string()
    .min(1, "Password is required")
    .min(6, "Password is too short"),
  passwordConfirmation: string().min(1, "Password Confirmation is required"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

type UpdatePasswordInput = TypeOf<typeof updatePasswordSchema>;

const endpoint = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

function ResetPassword({ query }: { query: { token: string } }) {
  const [resetPasswordError, setResetPasswordError] = useState(null);
  const [resetPasswordStatus, setResetPasswordStatus] = useState(false);

  // const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  });

  async function onSubmit(values: UpdatePasswordInput) {
    try {
      const { token } = query;
      const headers = { authorization: `Bearer ${token}` };
      await axios.put(`${endpoint}/api/password-reset/${token}`, values, {
        headers,
      });
      setResetPasswordStatus(true);
    } catch (err: any) {
      // TODO: Improve error message
      setResetPasswordError(err.message);
    }
  }

  const returnHomeLink = <Link href="/">Home</Link>;

  return (
    <>
      <div className={loginStyles.outerContainer}>
        <Header returnHomeLink={returnHomeLink} />
        <div className={loginStyles.container}>
          {resetPasswordStatus ? (
            <>
              <h2>Password reset</h2>
              <p>
                Your password has successfully been reset! Click below to log
                in.
              </p>
              <Link href="/auth/login">
                <button className={loginStyles.submitReset}>Log In</button>
              </Link>
            </>
          ) : (
            <>
              <h2>Set new password</h2>
              <p style={{ marginTop: 0 }}>
                Almost there! Enter a new password for your account.
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={loginStyles.fields}>
                  <div className={loginStyles.formElement}>
                    <label className={loginStyles.label} htmlFor="password">
                      Password:
                    </label>
                    <input
                      className={loginStyles.input}
                      id="password"
                      type="password"
                      placeholder="******"
                      {...register("password")}
                    />
                    <p className={loginStyles.error}>
                      {errors.password?.message as string}
                    </p>
                  </div>
                  <div className={loginStyles.formElement}>
                    <label
                      className={loginStyles.label}
                      htmlFor="passwordConfirmation"
                    >
                      Confirm Password:
                    </label>
                    <input
                      className={loginStyles.input}
                      id="passwordConfirmation"
                      type="password"
                      placeholder="******"
                      {...register("passwordConfirmation")}
                    />
                    <p className={loginStyles.error}>
                      {errors.passwordConfirmation?.message as string}
                    </p>
                  </div>
                  <button className={loginStyles.submit} type="submit">
                    Reset Password
                  </button>
                  <p style={{ textAlign: "center" }}>
                    <Link
                      href="/auth/login"
                      style={{ textDecoration: "underline" }}
                    >
                      Back to Log In
                    </Link>
                  </p>
                  <p className={loginStyles.requestError}>
                    {resetPasswordError}
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  return {
    props: {
      query,
    },
  };
};

export default ResetPassword;
