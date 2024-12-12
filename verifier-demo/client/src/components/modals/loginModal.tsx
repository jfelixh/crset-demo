import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGenerateWalletURL from "@/hooks/api/useGenerateWalletURL";
import { useToast } from "@/hooks/use-toast";
import { useCallbackPolling } from "@/hooks/useCallbackPolling";
import useIsMobileDevice from "@/hooks/useIsMobileDevice";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";

export const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { challenge, walletUrl, isLoading, error } =
    useGenerateWalletURL(isOpen);
  const { isMobile } = useIsMobileDevice();
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  useCallbackPolling({
    walletUrl,
    challenge,
    onSuccess: () => {
      setIsOpen(false);
      toast({
        title: "Authentication successful",
        description: "You are now logged in.",
      });
    },
    enabled: isOpen,
  });

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
              <a href={walletUrl}>Log in</a>
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
