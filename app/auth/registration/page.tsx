"use client";

import { registration } from "@/app/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function SignupForm() {
  const [state, action, pending] = useActionState(registration, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 py-8">
      <form
        action={action}
        className="
          w-full max-w-[420px]
          bg-white
          border-2 border-blue-500
          rounded-xl
          shadow-lg
          p-6
          pt-4
          flex flex-col gap-3
        "
      >
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-1">
          Registration
        </h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            placeholder="Username"
            defaultValue={state?.values?.username ?? ""}
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
        </div>
        {state?.errors?.username && (
          <p className="text-red-500 text-sm -mt-2">
            {state.errors.username[0]}
          </p>
        )}

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
        </div>
        {state?.errors?.email && (
          <p className="text-red-500 text-sm -mt-2">
            {state.errors.email[0]}
          </p>
        )}

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
        </div>
        {state?.errors?.password && (
          <ul className="text-red-500 text-sm -mt-2 list-disc pl-5">
            {state.errors.password.map((e: string) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="repassword" className="text-sm font-medium text-gray-700">
            Repeat password
          </label>
          <input
            id="repassword"
            name="repassword"
            type="password"
            placeholder="Repeat password"
            defaultValue={state?.values?.repassword ?? ""}
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
        </div>
        {state?.errors?.repassword && (
          <p className="text-red-500 text-sm -mt-2">
            {state.errors.repassword[0]}
          </p>
        )}

        {state?.message && (
          <p className="text-red-600 text-sm text-center">
            {state.message}
          </p>
        )}

        <button
          disabled={pending}
          type="submit"
          className="
            mt-3
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
          Sign Up
        </button>
        
        <p className="text-sm text-gray-600 mt-2 text-center">
          Already have an account? {" "}
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
