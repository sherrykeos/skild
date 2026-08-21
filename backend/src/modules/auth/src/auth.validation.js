import { z } from "zod";

const emailSchema = z
  .email("Invalid email address")
  .transform((email) => email.toLowerCase());

const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
    "Password must contain uppercase, lowercase, number, and special character.",
  );

const registerSchema = z.object({
  username: z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username cannot exceed 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers and underscores",
  ),

  email: emailSchema,

  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

const resendVerificationSchema = z.object({
  email: emailSchema,
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),

  password: passwordSchema,
});


const changePasswordSchema = z.object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
  })
  .refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message: "New password must be different from the current password.",
      path: ["newPassword"],
    },
  );


export {
  registerSchema,
  loginSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
