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

const createUserSchema = object({
  name: string().min(1, "Name is required"),
  password: string()
    .min(1, "Password is required")
    .min(6, "Password is too short"),
  passwordConfirmation: string().min(1, "Password Confirmation is required"),
  email: string().min(1, "Email is required").email("Not a valid email"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

const endpoint = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

function Register() {
  const [registerError, setRegisterError] = useState(null);
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(values: CreateUserInput) {
    try {
      await axios.post(`${endpoint}/api/users`, values);
      await axios.post(
        `${endpoint}/api/sessions`,
        { email: values.email, password: values.password },
        { withCredentials: true }
      );
      router.push("/");
    } catch (err: any) {
      // TODO: Improve error message
      setRegisterError(err.message);
    }
  }

  const returnHomeLink = <Link href="/">Home</Link>;

  return (
    <>
      <div className={loginStyles.outerContainer}>
        <Header returnHomeLink={returnHomeLink} />
        <div className={loginStyles.container}>
          <h2>Sign up</h2>
          <p style={{ marginTop: 0 }}>
            Create your account! Please enter your details.
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
                <label className={loginStyles.label} htmlFor="name">
                  Name:
                </label>
                <input
                  className={loginStyles.input}
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  {...register("name")}
                />
                <p className={loginStyles.error}>
                  {errors.name?.message as string}
                </p>
              </div>
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
                Submit
              </button>
              <p style={{ textAlign: "center" }}>
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  style={{ textDecoration: "underline" }}
                >
                  Log in
                </Link>
              </p>
              <p className={loginStyles.requestError}>{registerError}</p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
