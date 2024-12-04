import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import useGenerateWalletURL from "@/hooks/api/useGenerateWalletURL";
import useIsMobileDevice from "@/hooks/useIsMobileDevice";
import { createFileRoute } from "@tanstack/react-router";
import { QRCodeCanvas } from "qrcode.react";

function Index() {
  const { walletUrl, isLoading, error } = useGenerateWalletURL();
  const { isMobile } = useIsMobileDevice();

  return (
    <div className="container justify-center">
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <>
            <Card>
              <CardTitle>Login using your wallet</CardTitle>
              <CardDescription>
                Scan the QR code with your wallet to sign in.
              </CardDescription>

              <CardContent className="!max-w-screen-md">
                {!isMobile ? (
                  <div className="w-full flex justify-center">
                    <QRCodeCanvas value={walletUrl} size={400} />
                  </div>
                ) : (
                  <Button>
                    <a href={walletUrl}>Authenticate</a>
                  </Button>
                )}
                <pre className="w-auto overflow-auto">
                  {JSON.stringify(walletUrl, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  component: Index,
});
