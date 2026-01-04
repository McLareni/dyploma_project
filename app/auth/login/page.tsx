"use client";

import { login } from "@/app/actions/auth";
import { useActionState } from "react";
import Link from "next/link";

export default function LogInForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen bg-gray-200 flex items-start justify-center pt-20">
      <form
        action={action}
        className="
          w-[420px]
          bg-white
          border-2 border-blue-500
          rounded-xl
          shadow-lg
          p-6
          flex flex-col gap-3
        "
      >
        <h1 className="text-3xl font-semibold text-blue-600 mb-4">
          Log in
        </h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            defaultValue={state?.values?.email ?? ""}
            className="
              px-3 py-2
              border border-gray-300
              rounded-md
              text-base
              outline-none
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-200
            "
          />
          {state?.errors?.email && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            defaultValue={state?.values?.password ?? ""}
            className="
              px-3 py-2
              border border-gray-300
              rounded-md
              text-base
              outline-none
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-200
            "
          />
          {state?.errors?.password && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {state?.message && (
          <p className="text-red-600 text-sm mt-2">
            {state.message}
          </p>
        )}

        <button
          disabled={pending}
          type="submit"
          className="
            mt-4
            bg-blue-500
            text-white
            py-2
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

        <p className="text-sm text-gray-600 mt-2">
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
