import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import { Header, Footer } from "../../components";
import loginStyles from "../../styles/Login.module.css";

const createSessionSchema = object({
  email: string().min(1, "Email is required"),
  password: string().min(1, "Password is required"),
});

type CreateSessionInput = TypeOf<typeof createSessionSchema>;

const endpoint = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

function Login() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
  });

  async function onSubmit(values: CreateSessionInput) {
    try {
      await axios.post(`${endpoint}/api/sessions`, values, {
        withCredentials: true,
      });
      router.push("/");
    } catch (err: any) {
      //TODO: Improve error message
      const invalidEmailOrPasswordMsg = err.response.data;
      if (invalidEmailOrPasswordMsg === "Invalid email or password") {
        setLoginError("Invalid email or password.");
      } else {
        setLoginError(err.message);
      }
    }
  }

  const returnHomeLink = <Link href="/">Home</Link>;

  return (
    <>
      <div className={loginStyles.outerContainer}>
        <Header returnHomeLink={returnHomeLink} />
        <div className={loginStyles.container}>
          <h2>Welcome back</h2>
          <p style={{ marginTop: 0 }}>
            Welcome back! Please enter your details.
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
              <div className={loginStyles.formElement}>
                <div className={loginStyles.forgotPasswordLink}>
                  <label className={loginStyles.label} htmlFor="password">
                    Password:
                  </label>
                  <Link href="/auth/recovery">Forgot password?</Link>
                </div>
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
              <button className={loginStyles.submit} type="submit">
                Log In
              </button>
              <p style={{ textAlign: "center" }}>
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  style={{ textDecoration: "underline" }}
                >
                  Sign up
                </Link>
              </p>
              <p className={loginStyles.requestError}>{loginError}</p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
