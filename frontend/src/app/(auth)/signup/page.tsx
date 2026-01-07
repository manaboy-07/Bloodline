"use client";

import Input from "@/components/shared/Input";
// import { useSignUp } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isPending = true;
  //   const { mutateAsync, isPending } = useSignUp();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // await mutateAsync(
    //   { email, password, name },
    //   {
    //     onSuccess: () => router.push("/login"),
    //   }
    // );
  };
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="font-bold text-3xl">Sign Up</h2>
      <small className="italic">Let's start with some facts about you</small>
      <form onSubmit={handleSubmit} action="" className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <div className="">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          disabled={isPending}
          className="btn w-full bg-orange-400 font-bold text-base-100"
        >
          {isPending ? "Processing..." : "Sign Up"}
        </button>
        <small className="opacity-50">
          Already have an account ?{" "}
          <Link
            className="font-bold hover:text-orange-400 transition"
            href={"/login"}
          >
            Login
          </Link>
        </small>
      </form>
    </section>
  );
}

export default SignUp;
