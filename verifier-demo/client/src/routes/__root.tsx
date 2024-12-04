import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { baseUrl } from "@/hooks/api/base";
import useGenerateWalletURL from "@/hooks/api/useGenerateWalletURL";
import { useToast } from "@/hooks/use-toast";
import useIsMobileDevice from "@/hooks/useIsMobileDevice";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

// Layout for the root route
export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen">
        <div className="col-start-2">
          <div>
            <NavBar />
          </div>
          <Outlet />
        </div>
        <TanStackRouterDevtools />
      </div>
    </>
  ),
});

const Logo = () => (
  <h1 className="font-medium text-2xl hover:scale-105 duration-300 transition-all">
    <span className="underline">
      <span className="overline">M</span>
    </span>
    26
  </h1>
);

const NavBar = () => (
  <nav className="flex justify-between py-4 border-b-[0.5px]">
    <div className="grid grid-cols-[1fr_10fr_1fr] w-full">
      <div className="col-start-2 flex justify-between">
        {/* Navigation bar */}
        <div className="flex space-x-4">
          <Link to="/">
            <Logo />
          </Link>
          <div>
            <Button asChild variant="ghost">
              <Link to="/" className="[&.active]:font-bold">
                Home
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/about" className="[&.active]:font-bold">
                About
              </Link>
            </Button>
          </div>
        </div>
        <div className="space-x-4">
          {/* TODO: replace with QR code in modal */}
          <LoginModal />
          <Button>Apply for a loan now!</Button>
        </div>
      </div>
    </div>
  </nav>
);

// TODO: extract to separate file
const LoginModal = () => {
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
          // Close the modal or perform any other action on successful authentication
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
      if (!token && isOpen) {
        clearInterval(interval);
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
        {!isMobile && !isLoading && !error ? (
          <div className="w-full flex justify-center">
            <QRCodeCanvas value={walletUrl} size={400} />
          </div>
        ) : (
          <Button>
            <a href={walletUrl}>Authenticate</a>
          </Button>
        )}
        {error && <p>Error: {error.message}</p>}
        <pre className="max-w-full text-wrap overflow-auto bg-secondary p-2">
          {JSON.stringify(walletUrl, null, 2)}
        </pre>
      </DialogContent>
    </Dialog>
  );
};
