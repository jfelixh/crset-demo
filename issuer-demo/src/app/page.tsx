"use client";
import Image from "next/legacy/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-white-100 flex flex-col justify-center items-center px-36">
        <div className="container flex justify-center">
          <div>
            <div className="flex flex-col items-center">
              <Image
                src="/images/teamwork-vector-illustration-style_717774-90944-removebg-preview.png"
                alt="Teamwork Vector Illustration Style"
                width={500}
                height={500}
              />
              <Button
                className="w-full bg-blue-800"
                onClick={() => router.push("/credentialIssuance")}
              >
                Start Issuing
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 relative flex flex-col justify-center items-center">
        <Image
          src="/images/loginBackGroundImage.png"
          alt="LogIn Image"
          layout="fill"
          objectFit="cover"
          className="absolute z-0"
        />
        <h1 className="relative z-10 text-4xl font-bold text-center font-serif">
          ACME Inc.
          <br />
          Staff Management System
        </h1>
        <br />
        <h2 className="relative z-10 text-2xl font-medium text-center italic tracking-wide">
          Issue employee credentials <br />
          and revoke them when necessary.
        </h2>
      </div>
    </div>
  );
}
