"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }) // Custom error message
    .regex(/^[^\d]*$/, { message: "Name cannot contain numbers" }), // Custom error message for regex
  lastName: z
    .string()
    .min(2, { message: "Last Name must be at least 2 characters long" })
    .regex(/^[^\d]*$/, { message: "Last Name cannot contain numbers" }), // Custom error message
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }), // Custom error message for email format
  jobTitle: z
    .string()
    .min(2, { message: "Job Title must be at least 2 characters long" })
    .regex(/^[^\d]*$/, { message: "Job Title cannot contain numbers" }), // Custom error message
  manager: z
    .string()
    .min(2, { message: "Manager name must be at least 2 characters long" })
    .regex(/^[^\d]*$/, { message: "Manager name cannot contain numbers" }), // Custom error message
  employmentType: z.string().min(1),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      jobTitle: "",
      manager: "",
      employmentType: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/generateVC", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          jobTitle: data.jobTitle,
        }),
      });
      const responseData = await response.json();
      if (responseData?.uuid && data.email) {
        //window.location.href = `/vci/${responseData.uuid}`;
        if (!data.email || !responseData.uuid) {
          alert("Please enter an email and ensure VCID is loaded.");
          return;
        }

        try {
          const response = await fetch("/api/sendEmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              vcid: responseData.uuid,
              email: 'chan9908181@gmail.com',
              //data.email,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            alert("Email sent successfully!");
          } else {
            alert(`Error: ${result.error}`);
          }
        } catch (error) {
          console.log(error);
          alert("Failed to send email.");
        }
      } else {
        console.error("Missing UUID in the response");
      }
    } catch (error) {
      console.error("Form submission error", error);
    }
  };

  return (
    <div className="page-container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  {form.formState.errors.name && (
                    <FormMessage>
                      {form.formState.errors.name.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  {form.formState.errors.lastName && (
                    <FormMessage>
                      {form.formState.errors.lastName.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                {form.formState.errors.email && (
                  <FormMessage>
                    {form.formState.errors.email.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            name="jobTitle"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                {form.formState.errors.jobTitle && (
                  <FormMessage>
                    {form.formState.errors.jobTitle.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <FormField
              name="manager"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Manager</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  {form.formState.errors.manager && (
                    <FormMessage>
                      {form.formState.errors.manager.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              name="employmentType"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Employment Type</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        {...field}
                        className="input py-2 pl-3 text-gray-900 border border-gray-300 rounded-md w-full"
                      >
                        <option value="" disabled>
                          Choose an Employment Type
                        </option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Generate Verifiable Credential</Button>
        </form>
      </Form>
    </div>
  );
}
