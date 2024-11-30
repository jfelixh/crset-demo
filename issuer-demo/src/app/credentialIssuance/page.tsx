"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  email: z.string(),
});

export default function Home() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/generateVC", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          lastName: lastName,
          email: email,
          companyName: companyName,
          jobTitle: jobTitle,
        }),
      });
      const data = await response.json();
      if (data?.uuid) {
        window.location.href = `/vci/${data.uuid}`;
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
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
          <FormField
            name="name"
            render={() => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="lastName"
            render={() => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="email"
            render={() => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="companyName"
            render={() => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="jobTitle"
            render={() => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Generate Verifiable Credential</Button>
        </form>
      </Form>
    </div>
  );
}
