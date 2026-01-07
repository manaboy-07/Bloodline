"use client";

import Input from "@/components/shared/Input";
// import { useLogin } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Login() {
  //   const { mutateAsync, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isPending = true;

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // await mutateAsync(
    //   { email, password },
    //   {
    //     onSuccess: () => router.push("/profile"),
    //   }
    // );
  };
  return (
    <section className="flex flex-col items-center justify-center min-h-screen  ">
      <h2 className="font-bold text-3xl my-2">Login</h2>
      <small className="italic">Glad to have you back</small>
      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <div className="w-full">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn w-full bg-orange-400 font-bold text-base-100"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
        <small className="opacity-50">
          Don't have an account ?{" "}
          <Link
            className="font-bold hover:text-orange-400 transition"
            href={"/signup"}
          >
            Sign Up
          </Link>
        </small>
      </form>
    </section>
  );
}

export default Login;
