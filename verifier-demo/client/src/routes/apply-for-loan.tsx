import { createFileRoute } from "@tanstack/react-router";
import { set, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { SeparatorHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {usePostLoan} from "@/hooks/api/usePostLoan";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  birthDate: z.date().max(new Date()),
  loanAmount: z.coerce.number().min(1000).max(1000000),
  annualIncome: z.coerce.number().min(1000).max(1000000),
  address: z.string().min(2).max(100),
  purpose: z.string().min(2).max(1000),
});

type passportType = {
  id: String,
  type: "PassportCredential",
  birthDate: Date,
  givenName: String,
  address: String,
  dateIssued: Date,
  familyName: String,
  expiresOn: Date,
  gender: String,
};

function RouteComponent() {
  
  // Form default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      loanAmount: 0,
      annualIncome: 0,
      birthDate: undefined,
      purpose: "",
    },
  });
  
  // Autofill some fields with user data
  const [userInfo, setUserInfo] = useState<passportType | null>(null);
  const userToken = useContext(AuthContext)?.appState.token;
  useEffect(() => {
    if (userToken) {
      setUserInfo(userToken?.credentialSubject);
      form.setValue("name", userInfo?.givenName + " " + userInfo?.familyName);
      form.setValue("birthDate", new Date(userInfo?.birthDate!));
      form.setValue("address", userInfo?.address);
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Store to db
    console.log(values);
  
    const payload = {amount: values.loanAmount, applicant: userInfo?.id, application_dump: JSON.stringify(values)};
    try {
      const response = usePostLoan(payload);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="grid grid-cols-[1fr_10fr_1fr] w-full py-10">
      <div className="col-start-2 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-y-6">
              <h2 className="text-2xl font-bold">Loan information</h2>
              <div className="flex flex-row gap-x-10">
                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Specify the amount of money you want to loan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Income</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="number" {...field} />
                      </FormControl>
                      <FormDescription>Your annual income</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What do you plan to do with it?" {...field} />
                    </FormControl>
                    {<FormDescription>Intended usage for this loan</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator orientation="horizontal" />
            <div className="flex flex-col gap-y-6">
              <h2 className="text-2xl font-bold">Personal information</h2>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Max Mustermann" {...field} />
                    </FormControl>
                    <FormDescription>First Name and Last Name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="your home address" {...field} />
                    </FormControl>
                    <FormDescription>Address at which you currently reside</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl>
                      <Input placeholder="YYYY-MM-DD" {...field} />
                    </FormControl>
                    <FormDescription>In American format</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormDescription>max.mustermann@example.com</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <Button type="submit">Next: Confirm your employment status</Button>
            </form>
          </Form>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/apply-for-loan")({
  component: RouteComponent,
});
