"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { QRCodeCanvas } from "qrcode.react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "@/lib/use-toast";
import jwt from "jsonwebtoken";
import { JWTPayload } from "jose";
import { useAuth } from "./contexts/AuthContext";
import { redirect } from "next/dist/server/api-utils";
import { UsersRound } from "lucide-react";
import { homePageImage } from "../../public/images/teamwork-vector-illustration-style_717774-90944-removebg-preview.png";

export default function LoginPage() {
  let result;
  const [walletUrl, setWalletUrl] = useState("");
  const [login_id, setLogInID] = useState("");
  const { login, isAuthenticated } = useAuth();
  const generateWalletURL = async () => {
    result = await fetch("/api/generateWalletUrl");

    // console.log("walletUrl", walletUrl);
    // console.log("login_id", login_id);
    console.log("Result is ", result);
    const { walletUrl, login_id } = await result.json();
    return { walletUrl, login_id };
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const authorizationCheck = async (idToCheck: string) => {
    if (idToCheck) {
      const response = await fetch("/api/authorizationCheck", {
        method: "POST",
        body: JSON.stringify({ idToCheck: idToCheck }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Response is not ok! status: ${response.status}`);
      }
      console.log("Response from authorizationCheck: ", response);
      const { success } = await response.json();

      console.log("Is authorized: ", success);
      if (success) {
        console.log("Set authorization to true and set token");
        login(idToCheck);
      }
      return success;
    }
    return null;
  };

  useEffect(() => {
    const getWalletUrl = async () => {
      try {
        console.log("getWalletUrl");
        const { walletUrl, login_id } = await generateWalletURL();
        setWalletUrl(walletUrl);
        console.log("Wallet URL:", walletUrl);
        setLogInID(login_id);
        console.log("Login ID:", login_id);
      } catch (error) {
        console.error("Error generating wallet URL:", error);
      }
    };
    getWalletUrl();
  }, []);

  useEffect(() => {
    if (!walletUrl) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          encodeURI(`http://localhost:3000/api/callback?login_id=${login_id}`),
          {
            credentials: "include",
          }
        );
        console.log("Response from callback: ", response);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log("Result should be sucessful:");
        if (result.success === true) {
          console.log("Auth successful");
          clearInterval(interval);

          console.log("Verifiable Credential that tries to login:", result);
          const credentialSubjectId = jwt.decode(result["token"])[
            "credentialSubject"
          ]["id"];
          // throw new Error("Credential Subject ID: " + credentialSubjectId);
          await authorizationCheck(credentialSubjectId);
          //   toast({
          //     title: "Authentication successful",
          //     description: "You are now logged in.",
          //   });
          // if (isAuthenticated) {
          //   window.location.href = "/credentialIssuance";
          // }
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
        toast({
          title: "Authentication failed",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    }, 5000);
  });

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-white-100 flex flex-col justify-center items-center px-36">
        <div className="container flex justify-center ">
          <div>
            {
              <div className="flex flex-col items-center">
                <Image
                  src="/images/teamwork-vector-illustration-style_717774-90944-removebg-preview.png"
                  alt="Teamwork Vector Illustration Style"
                  width={500}
                  height={500}
                />
                <Button
                  className="w-full"
                  onClick={toggleDialog}
                  disabled={isAuthenticated}
                >
                  Authenticate
                </Button>
                <>
                  {isDialogOpen && (
                    <div
                      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="dialog-title"
                    >
                      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <div className="flex justify-between items-center">
                          <h2
                            id="dialog-title"
                            className="text-xl font-semibold"
                          >
                            Login using your wallet
                          </h2>
                          <button
                            className="text-gray-500 hover:text-gray-800 text-3xl"
                            onClick={toggleDialog}
                          >
                            &times;
                          </button>
                        </div>
                        <p className="text-gray-700 mt-2">
                          Scan the QR code with your wallet to sign in.
                        </p>

                        <div className="mt-4 flex justify-center">
                          <QRCodeCanvas value={walletUrl} size={200} />
                        </div>

                        <pre className="mt-4 bg-gray-100 p-2 rounded text-sm break-words whitespace-pre-wrap">
                          {JSON.stringify(walletUrl, null, 2)}
                        </pre>

                        <div className="mt-6 flex justify-end">
                          <Button onClick={toggleDialog}>Close</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              </div>
            }
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
