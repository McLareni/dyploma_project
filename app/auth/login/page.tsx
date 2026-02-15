'use client';

import { login } from "@/app/actions/auth";
import { useActionState } from "react";
import Link from "next/link";
import CustomInput from "@/components/UI/CustomInput";

export default function Login() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4 sm:px-6">
      <form
        action={action}
        className="
          w-full max-w-[420px]
          bg-white
          border-2 border-blue-500
          rounded-xl
          shadow-lg
          p-6
          flex flex-col gap-4
          sm:min-h-screen sm:max-w-full sm:rounded-none sm:shadow-none sm:border-none sm:justify-start
        "
      >
        <h1 className="text-3xl font-semibold text-blue-600 mb-2 text-center sm:text-left sm:mt-12">
          Log in
        </h1>

        <CustomInput
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          defaultValue={state?.values?.email ?? ""}
          error={state?.errors?.email?.[0]}
        />

        <CustomInput
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          defaultValue={state?.values?.password ?? ""}
          error={state?.errors?.password?.[0]}
        />

        {state?.message && (
          <p className="text-red-600 text-sm text-center sm:text-left">
            {state.message}
          </p>
        )}

        <button
          disabled={pending}
          type="submit"
          className="
            mt-2
            bg-blue-500
            text-white
            py-2.5
            rounded-md
            text-base
            font-medium
            hover:bg-blue-600
            transition
            disabled:opacity-50
          "
        >
          Log in
        </button>

        <p className="text-sm text-gray-600 text-center sm:text-left mt-4">
          Don’t have an account?{" "}
          <Link
            href="/auth/registration"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Create a new account
          </Link>
        </p>
      </form>
    </div>
  );
}
