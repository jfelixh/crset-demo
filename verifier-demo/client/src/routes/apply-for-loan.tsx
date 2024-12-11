import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { usePostLoan } from "@/hooks/api/usePostLoan";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { LoanRequest } from "@/models/loan";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  birthDate: z.date().max(new Date()),
  loanAmount: z.coerce.number().min(1000).max(1000000),
  annualIncome: z.coerce.number().min(1000).max(1000000),
  address: z.string().min(2).max(100),
  purpose: z.string().min(2).max(1000),
});

function RouteComponent() {
  const { token } = useAuth();
  const { mutateAsync: postLoan } = usePostLoan();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      email: "",
      loanAmount: 0,
      annualIncome: 0,
      birthDate: undefined,
      purpose: "",
    },
  });

  useEffect(() => {
    if (token) {
      const { credentialSubject } = token;
      form.setValue("id", credentialSubject?.id || "");
      form.setValue(
        "name",
        credentialSubject?.givenName + " " + credentialSubject?.familyName
      );
      form.setValue("birthDate", new Date(credentialSubject?.birthDate || ""));
      form.setValue("address", credentialSubject?.address || "");
      // toast to notify user that the form has been pre-filled
      toast({
        title: "Form pre-filled",
        description: "Your information has been pre-filled from your ID",
      });
    }
  }, [token]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const { id, loanAmount } = values;
    const payload = {
      amount: loanAmount,
      applicant: id,
      application_dump: JSON.stringify(values),
    } as LoanRequest;

    try {
      const response = await postLoan(payload);
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
                      <Textarea
                        placeholder="What do you plan to do with it?"
                        {...field}
                      />
                    </FormControl>
                    {
                      <FormDescription>
                        Intended usage for this loan
                      </FormDescription>
                    }
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
                    <FormDescription>
                      Address at which you currently reside
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Date of birth as per your ID
                    </FormDescription>
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
                    <FormDescription>
                      max.mustermann@example.com
                    </FormDescription>
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
