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
import { useEffect, useState } from "react";
import { toast } from "@/lib/use-toast";
import jwt from "jsonwebtoken";
import { useAuth } from "./contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [walletUrl, setWalletUrl] = useState("");
  const [login_id, setLogInID] = useState("");
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  let interval;

  // Function to generate Wallet URL
  const generateWalletURL = async () => {
    const result = await fetch("/api/generateWalletUrl");
    console.log("Result from api/generateWalletUrl", result);
    const { walletUrl, login_id } = await result.json();
    return { walletUrl, login_id };
  };

  // Toggle dialog visibility
  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  // Check authorization
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
      console.log("Response from api/authorizationCheck: ", response);
      const { success } = await response.json();
      if (success) {
        login(idToCheck);
      }
      return success;
    }
    return null;
  };

  // Fetch wallet URL and login ID on initial render
  useEffect(() => {
    const getWalletUrl = async () => {
      try {
        const { walletUrl, login_id } = await generateWalletURL();
        setWalletUrl(walletUrl);
        setLogInID(login_id);
        console.log("Wallet URL:", walletUrl);
        console.log("Login ID:", login_id);
      } catch (error) {
        console.error("Error generating wallet URL:", error);
      }
    };
    getWalletUrl();
  }, []);

  // Use Effect to handle API callback and interval
  useEffect(() => {
    if (!walletUrl || !login_id) return; // Only run if walletUrl and login_id are set

    // Set the interval to check for authentication
    interval = setInterval(async () => {
      try {
        const response = await fetch(
            encodeURI(`http://localhost:3000/api/callback?login_id=${login_id}`),
            { credentials: "include" }
        );
        console.log("Response from api/callback: ", response);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success === true) {
          clearInterval(interval); // Clear the interval once authentication is successful

          // Decode the JWT token
          const decodedToken = jwt.decode(result["token"]);
          if (
              decodedToken &&
              typeof decodedToken !== "string" &&
              "credentialSubject" in decodedToken
          ) {
            const credentialSubjectId = decodedToken["credentialSubject"]["id"];
            const credentialCheck = decodedToken["credentialSubject"]["jobTitle"];
            if(credentialCheck==="Admin"){
              login(credentialSubjectId);
            }
            //await authorizationCheck(credentialSubjectId);
          } else {
            throw new Error("Invalid token structure");
          }
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

    // Cleanup interval on component unmount or walletUrl changes
    return () => {
      console.log("Cleaning up interval");
      clearInterval(interval);
    };
  }, [walletUrl, login_id]); // Only trigger effect if walletUrl or login_id changes

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
                    onClick={toggleDialog}
                    disabled={isAuthenticated}
                >
                  Authenticate
                </Button>

                {isDialogOpen && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dialog-title"
                    >
                      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <div className="flex justify-between items-center">
                          <h2 id="dialog-title" className="text-xl font-semibold">
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

                        <div className="mt-4 flex flex-row items-center justify-center gap-2">
                          <div className="w-4 h-4 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                          <p className="text-sm font-medium text-gray-600">
                            Authenticating...
                          </p>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <Button onClick={toggleDialog}>Close</Button>
                        </div>
                      </div>
                    </div>
                )}
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
