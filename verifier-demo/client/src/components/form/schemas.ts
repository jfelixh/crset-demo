import * as z from "zod";

export const personalInfoSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  birthDate: z.date().max(new Date()),
  address: z.string().min(2).max(100),
});

export const loanInfoSchema = z.object({
  loanAmount: z.coerce.number().min(1000).max(1000000),
  annualIncome: z.coerce.number().min(1000).max(1000000),
  purpose: z.string().min(2).max(1000),
});

export const formSchema = personalInfoSchema.merge(loanInfoSchema).merge(
  z.object({
    id: z.string(),
    employeeCredentialConfirmed: z.boolean(),
    employeeCredentialSubject: z.object({}),
  }),
);

export type FormData = z.infer<typeof formSchema>;
