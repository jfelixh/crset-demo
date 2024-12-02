import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGenerateWalletURL from "@/hooks/api/useGenerateWalletURL";
import useIsMobileDevice from "@/hooks/useIsMobileDevice";
import { createFileRoute } from "@tanstack/react-router";
import { QRCodeCanvas } from "qrcode.react";

function Index() {
  const { data: walletUrl, isLoading, error } = useGenerateWalletURL();
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
            <Dialog>
              <DialogTrigger asChild>
                <Button>Sign-In</Button>
              </DialogTrigger>
              <DialogContent className="!max-w-screen-md">
                <DialogHeader>
                  <DialogTitle>Login using your wallet</DialogTitle>
                  <DialogDescription>
                    Scan the QR code with your wallet to sign in.
                  </DialogDescription>
                </DialogHeader>
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
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  component: Index,
});
