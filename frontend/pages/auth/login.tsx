import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";

const createSessionSchema = object({
  email: string().min(1, "Email is required"),
  password: string().min(1, "Password is required"),
});

type CreateSessionInput = TypeOf<typeof createSessionSchema>;

function Login() {
  const [loginError, setLoginError] = useState(null);
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
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
        values,
        { withCredentials: true }
      );
      router.push("/");
    } catch (err: any) {
      setLoginError(err.message);
    }
  }

  return (
    <>
      <p>{loginError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="jane.doe@example.com"
            {...register("email")}
          />
          <p>{errors.email?.message as string}</p>
        </div>
        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="******"
            {...register("password")}
          />
          <p>{errors.password?.message as string}</p>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Login;
