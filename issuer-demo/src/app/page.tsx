"use client";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { QRCodeCanvas } from "qrcode.react";
import { useQuery } from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {toast} from "@/lib/use-toast";

export default function LoginPage() {

    let result;
    const [walletUrl, setWalletUrl] = useState("");
    const [login_id, setLogInID] = useState("");
    const generateWalletURL = async () => {
        result = await fetch("/api/generateWalletUrl");

        // console.log("walletUrl", walletUrl);
        // console.log("login_id", login_id);
        console.log("Result is ", result);
        const { walletUrl, login_id } = await result.json();
        return { walletUrl, login_id };
    };
    useEffect(() => {
        const getWalletUrl = async () => {
            try {
                console.log("getWalletUrl");
                const { walletUrl,login_id } = await generateWalletURL();
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

                const result = await response.json();

                if (result.success === true) {
                    clearInterval(interval);
                    console.log("Auth successful");
                    toast({
                        title: "Authentication successful",
                        description: "You are now logged in.",
                    });
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
            <div className="w-1/2 bg-white-100 flex flex-col justify-center px-36">
                <div className="container justify-center">
                    <div>

                                <Card>
                                    <CardTitle>Login using your wallet</CardTitle>
                                    <CardDescription>
                                        Scan the QR code with your wallet to sign in.
                                    </CardDescription>

                                    <CardContent className="!max-w-screen-md">
                                            <div className="w-full flex justify-center">
                                                <QRCodeCanvas value={walletUrl} size={400} />
                                            </div>
                                            {/*<Button>
                                                <a href={walletUrl}>Authenticate</a> //TODO: add this button and mobile
                                            </Button>*/}
                                        <pre className="w-auto overflow-auto">
                  {JSON.stringify(walletUrl, null, 2)}
                </pre>
                                    </CardContent>
                                </Card>
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
                    <br/>
                    Enterprise Management System
                </h1>
                <br/>
                <h2 className="relative z-10 text-2xl font-medium text-center italic tracking-wide">
                    Get started issuing verifiable credentials <br/>
                    and having an overview of <br/>
                    your employees
                </h2>
            </div>
        </div>
    );
}
