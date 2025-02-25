"use client";
import { useQRCode } from "next-qrcode";
import { useEffect, useState } from "react";

export default function Issuance({
  params,
}: {
  params: Promise<{ vcid: string }>;
}) {
  const { Canvas } = useQRCode();
  const [vcid, setVcid] = useState<string | null>(null);

  // needed because params is async in app router nextjs
  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      console.log("resolvedParams", resolvedParams);
      setVcid(resolvedParams.vcid);
    }
    fetchParams();
  }, [params]);

  const getWalletUrl = () => {
    const credentialOffer = {
      credential_issuer: process.env.NEXT_PUBLIC_URL + "/vci/" + vcid,
      credential_configuration_ids: ["ProofOfEmploymentCredential"],
      grants: {
        "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
          "pre-authorized_code": "oaKazRN8I0IbtZ0C7JuMn5",
        },
      },
    };

    console.log(
      "Generate QR code for the credential offer so that the wallet can receive the credential offer",
    );
    return (
      "openid-credential-offer://?credential_offer=" +
      encodeURIComponent(JSON.stringify(credentialOffer))
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 font-mono">
      <div>
        <div className="text-center">
          <h1 className="text-6xl">Verifiable Credential</h1>
          <p className="text-black">
            Let your employee scan the code to download the credential.
          </p>
        </div>
        <div className="w-full flex align-center justify-center pt-10">
          <Canvas
            text={getWalletUrl()}
            options={{
              errorCorrectionLevel: "M",
              margin: 3,
              scale: 4,
              width: 300,
              color: {
                dark: "#000000FF",
                light: "#FFFFFFFF",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
