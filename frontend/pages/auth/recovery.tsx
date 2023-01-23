import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import loginStyles from "../../styles/Login.module.css";

const getUserSchema = object({
  email: string().min(1, "Email is required"),
});

type GetUserInput = TypeOf<typeof getUserSchema>;

const endpoint = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

function Recovery() {
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoveryEmailInfo, setRecoveryEmailInfo] = useState({
    sent: false,
    email: "",
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<GetUserInput>({
    resolver: zodResolver(getUserSchema),
  });

  async function onSubmit(values: GetUserInput) {
    try {
      await axios.post(`${endpoint}/api/password-reset`, values);
      setRecoveryEmailInfo({ sent: true, email: values.email });
    } catch (err: any) {
      //TODO: Improve error message
      const emailDoesNotExist = err.response.data;
      if (emailDoesNotExist === "User by that email does not exist") {
        setRecoveryError("Account by that email does not exist.");
      } else {
        setRecoveryError(err.message);
      }
    }
  }

  const returnHomeLink = <Link href="/">Home</Link>;

  return (
    <>
      <div className={loginStyles.outerContainer}>
        <Header returnHomeLink={returnHomeLink} />
        <div className={loginStyles.container}>
          {recoveryEmailInfo.sent ? (
            <>
              <h2>Check your email</h2>
              <p style={{ marginTop: 0 }}>
                We sent a password reset link to {recoveryEmailInfo.email}.
              </p>
              <p style={{ textAlign: "center" }}>
                <Link
                  href="/auth/login"
                  style={{ textDecoration: "underline" }}
                >
                  Back to Log In
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2>Forgot Password</h2>
              <p style={{ marginTop: 0 }}>
                No worries! Enter your account's email address and we'll send
                you reset instructions.
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={loginStyles.fields}>
                  <div className={loginStyles.formElement}>
                    <label className={loginStyles.label} htmlFor="email">
                      Email:
                    </label>
                    <input
                      className={loginStyles.input}
                      id="email"
                      type="email"
                      placeholder="jane.doe@example.com"
                      {...register("email")}
                    />
                    <p className={loginStyles.error}>
                      {errors.email?.message as string}
                    </p>
                  </div>
                  <button className={loginStyles.submit} type="submit">
                    Send Email
                  </button>
                  <p style={{ textAlign: "center" }}>
                    <Link
                      href="/auth/login"
                      style={{ textDecoration: "underline" }}
                    >
                      Back to Log In
                    </Link>
                  </p>
                  <p className={loginStyles.requestError}>{recoveryError}</p>
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

export default Recovery;
