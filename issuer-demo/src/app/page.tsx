"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    let result;
    const generateWalletURL = async () => {
      result = await fetch("/api/generateWalletUrl");

      //const { walletUrl, login_id } = await result.json();
      console.log("Result inside async function", await result.json());
      // console.log("walletUrl", walletUrl);
      // console.log("login_id", login_id);
    };
    generateWalletURL();
    console.log("Result", result);
  }, []);
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-white-100 flex flex-col justify-center px-36">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-md">
            QR Code
          </div>
          <Button className="mt-4 w-full">Sign In as Admin</Button>
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
          CMW
          <br />
          Enterprise Management System
        </h1>
        <br />
        <h2 className="relative z-10 text-2xl font-medium text-center italic tracking-wide">
          Get started issuing verifiable credentials <br />
          and having an overview of <br />
          your employees
        </h2>
      </div>
    </div>
  );
}
