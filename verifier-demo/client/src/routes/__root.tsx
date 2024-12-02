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
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QRCodeCanvas } from "qrcode.react";

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
  <h1 className="font-bold text-2xl">
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
          <Logo />
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

const LoginModal = () => {
  const { data: walletUrl, isLoading, error } = useGenerateWalletURL();
  const { isMobile } = useIsMobileDevice();

  return (
    <Dialog>
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
        <pre className="w-auto overflow-auto">
          {JSON.stringify(walletUrl, null, 2)}
        </pre>
      </DialogContent>
    </Dialog>
  );
};
