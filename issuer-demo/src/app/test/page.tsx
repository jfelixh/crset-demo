"use client";

import { useEffect, useState } from "react";
import * as DIDKit from "@spruceid/didkit-wasm"; // Import the entire module
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [did, setDID] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initAndGenerateDID = async () => {
            try {
                // Initialize DIDKit WASM module

                // Input JWK as an object
                const jwk = {
                    kty: "OKP",
                    crv: "Ed25519",
                    x: "cwa3dufHNLg8aQb2eEUqTyoM1cKQW3XnOkMkj_AAl5M",
                    d: "me03qhLByT-NKrfXDeji-lpADSpVOKWoaMUzv5EyzKY",
                };

                // Convert the JWK object to a JSON string
                const jwkString = JSON.stringify(jwk);

                // Generate the DID using the stringified JWK
                const result = DIDKit.keyToDID("key", jwkString);
                setDID(result); // Store the DID in state
            } catch (err) {
                setError(err.message || "An unexpected error occurred.");
                console.error("Error initializing DIDKit or generating DID:", err);
            }
        };

        initAndGenerateDID();
    }, []); // Runs once on component mount

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
                {error ? (
                    <h1 className="text-red-500">Error: {error}</h1>
                ) : did ? (
                    <h1 className="text-green-500">{did}</h1>
                ) : (
                    <h1>Loading...</h1>
                )}
                <h2 className="relative z-10 text-2xl font-semibold text-center">
                    Get started issuing verifiable credentials <br />
                    and having an overview of <br />
                    your employees
                </h2>
            </div>
        </div>
    );
}
