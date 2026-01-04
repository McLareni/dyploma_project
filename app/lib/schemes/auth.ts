import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty({ message: "Email is required" })
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: "Please enter a valid email." }
    ),

  password: z
    .string()
    .trim()
    .nonempty({ message: "Password is required" })
    .refine(
      (val) =>
        !val ||
        (val.length >= 8 &&
          /[a-zA-Z]/.test(val) &&
          /[0-9]/.test(val) &&
          /[^a-zA-Z0-9]/.test(val)),
      { message: "Invalid password" }
    ),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      values?: {
        email?: string;
        password?: string;
      };
      message?: string;
    }
  | undefined;

export const RegistationFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  username: z
    .string()
    .min(3, { error: "Be at least 3 characters long" })
    .max(20, { error: "Be at most 20 characters long" })
    .trim(),
  password: z
    .string()
    .min(8, { error: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    })
    .trim(),
  repassword: z.string().trim(),
});

export type RegistationFormState =
  | {
      errors?: {
        email?: string[];
        username?: string[];
        password?: string[];
        repassword?: string[];
      };
      values?: {
        email?: string;
        username?: string;
        password?: string;
        repassword?: string;
      };
      message?: string;
    }
  | undefined;
