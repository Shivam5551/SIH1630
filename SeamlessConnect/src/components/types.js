import { z } from "zod";

const Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  emailID: z.string().email("Invalid email address"),
  phoneNO: z.string().min(1, "Phone number is required"),
  hashedPassword: z.string().min(1, "Password is required"),
});

export { Schema };
