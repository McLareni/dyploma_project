'use client';

import { registration } from "@/app/actions/auth";
import Link from "next/link";
import { useActionState } from "react";
import CustomInput from "@/components/UI/CustomInput";

export default function SignupForm() {
  const [state, action, pending] = useActionState(registration, undefined);

  return (
    <div className="h-dvh  flex items-center justify-center lg:bg-gray-200 lg:px-4 bg-white">
      <form
        action={action}
        className="
          w-full lg:max-w-3xl
          bg-white
          lg:border-2 border-0 border-blue-500
          lg:rounded-xl
          lg:shadow-lg
          p-6
          grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-3
        "
      >
        <h1 className="text-3xl font-semibold text-center text-blue-600 md:col-span-2">
          Registration
        </h1>

        <CustomInput
          id="username"
          label="Username"
          placeholder="Enter username"
          defaultValue={state?.values?.username ?? ""}
          error={state?.errors?.username?.[0]}
        />

        <CustomInput
          id="email"
          type="email"
          label="Email"
          placeholder="Enter email"
          defaultValue={state?.values?.email ?? ""}
          error={state?.errors?.email?.[0]}
        />

        <CustomInput
          id="password"
          type="password"
          label="Password"
          placeholder="Enter password"
          defaultValue={state?.values?.password ?? ""}
          error={state?.errors?.password}
        />

        <CustomInput
          id="repassword"
          type="password"
          label="Repeat password"
          placeholder="Repeat password"
          defaultValue={state?.values?.repassword ?? ""}
          error={state?.errors?.repassword?.[0]}
        />

        {state?.message && (
          <p className="text-red-600 text-sm text-center md:col-span-2 sm:text-left">
            {state.message}
          </p>
        )}

        <button
          disabled={pending}
          type="submit"
          className="
            md:col-span-2
            justify-self-center
            min-w-[280px]
            mt-2
            bg-blue-500
            text-white
            py-3
            px-8
            rounded-lg
            text-base
            font-semibold
            hover:bg-blue-600
            transition
            disabled:opacity-50
          "
        >
          Sign Up
        </button>

        <p className="text-sm text-gray-600 text-center md:col-span-2">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
