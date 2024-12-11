import { baseUrl } from "@/hooks/api/base";
import useGenerateWalletURL from "@/hooks/api/useGenerateWalletURL";
import { useToast } from "@/hooks/use-toast";
import useIsMobileDevice from "@/hooks/useIsMobileDevice";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";

export const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { login_id, walletUrl, isLoading, error } =
    useGenerateWalletURL(isOpen);
  const { isMobile } = useIsMobileDevice();
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  useEffect(() => {
    if (!walletUrl) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          encodeURI(`${baseUrl}/login/callback?login_id=${login_id}`),
          {
            credentials: "include",
          }
        );

        const result = await response.json();

        if (result.success === true) {
          clearInterval(interval);
          setIsOpen(false);
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

    return () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      if (token && !isOpen) {
        return clearInterval(interval);
      }
    };
  }, [isOpen, login_id, toast, walletUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Log in</Button>
      </DialogTrigger>
      <DialogContent className="!max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Login using your wallet</DialogTitle>
          <DialogDescription>
            Scan the QR code with your wallet to sign in.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex justify-center">
          {!isMobile && isLoading && (
            <Skeleton className="w-[25rem] h-[25rem]" />
          )}
          {!isMobile && !isLoading && !error ? (
            <QRCodeCanvas value={walletUrl} size={400} />
          ) : (
            <Button>
              <a href={walletUrl}>Authenticate</a>
            </Button>
          )}
        </div>
        {error && <p>Error: {error.message}</p>}
        <pre className="max-w-full text-wrap overflow-auto bg-secondary p-2">
          {JSON.stringify(walletUrl, null, 2)}
        </pre>
      </DialogContent>
    </Dialog>
  );
};
