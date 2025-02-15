"use client";
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
              <div className="text-[12rem] mb-8">🪪</div>
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

      <div className="w-1/2 relative flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <h1 className="text-4xl font-bold text-center font-serif text-white">
          ACME Inc.
          <br />
          Staff Management System
        </h1>
        <br />
        <h2 className="text-2xl font-medium text-center italic tracking-wide text-white/80">
          Issue employee credentials <br />
          and revoke them when necessary.
        </h2>
      </div>
    </div>
  );
}
