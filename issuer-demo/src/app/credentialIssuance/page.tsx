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
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import QRCode from "qrcode";
import Image from "next/image";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

type IssuedVC = {
  id: string;
  type: string;
  issuer: {
    id: string;
    name: string;
    url: string;
  };
  subject: {
    id: string;
    name: string;
    dateOfBirth: string;
    credentialType: string;
  };
  credentialStatus: {
    id: string;
    status: string;
  };
  issuedAt: string;
  expirationDate: string;
  metadata: {
    schema: string;
    signature: string;
  };
};

const formSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  email: z.string(),
});

export default function Home() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [issuedVC, setIssuedVC] = useState<IssuedVC | null>(null);
  const [qrCode, setQrCode] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const generateQrCode = async () => {
      if (issuedVC) {
        const qr = await QRCode.toDataURL(JSON.stringify(issuedVC));
        setQrCode(qr);
      }
    };

    generateQrCode();
  }, [issuedVC]);

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
          status: true,
        }),
      });
      const data = await response.json();
      console.log("VC", JSON.stringify(data));
      setIssuedVC(data);
    } catch (error) {
      console.error("Form submission error", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Form {...form}>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
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
          <Button type="submit">Generate Verifiable Credential</Button>
        </form>
      </Form>
      {qrCode && (
        <>
          <h3>As a holder, you can scan the VC:</h3>
          <Image src={qrCode} alt="QR Code" width={200} height={200} />
        </>
      )}
      {/* <Dialog open={!!vc} onOpenChange={() => setVC(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifiable Credential</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {vc && <QRCode value={vc} />}
          </div>
          <Button onClick={() => setVC(null)} className="mt-4">
            Close
          </Button>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
