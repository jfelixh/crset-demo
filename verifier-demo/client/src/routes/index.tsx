import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useTest from "@/hooks/api/useTest";
import useIsMobileDevice from "@/hooks/useIsMobileDevice";
import { createFileRoute } from "@tanstack/react-router";
import { QRCodeCanvas } from "qrcode.react";

function Index() {
  const { data, isLoading, error } = useTest();
  const { isMobile } = useIsMobileDevice();

  const loginChallenge = crypto.randomUUID();
  const externalUrl = import.meta.env.EXTERNAL_URL!;
  const walletUrl =
    "openid-vc://?client_id=" +
    data +
    "&request_uri=" +
    encodeURIComponent(
      externalUrl + "/api/presentCredential?login_id=" + loginChallenge
    );

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
                <pre className="max-w-24">{JSON.stringify(data, null, 2)}</pre>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
