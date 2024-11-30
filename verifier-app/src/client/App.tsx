import "./App.css";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetWalletUrl } from "@/hooks/useGetWalletUrl";

import useIsMobileDevice from "@/hooks/useIsMobileDevice";
import { Button } from "@/components/ui/button";
import { useQRCode } from "next-qrcode";

function App() {
  const { Canvas } = useQRCode();
  const { isMobile } = useIsMobileDevice();
  const { walletUrl } = useGetWalletUrl();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Sign-In</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login using your wallet</DialogTitle>
            <DialogDescription>
              Scan the QR code with your wallet to sign in.
            </DialogDescription>
          </DialogHeader>
          {!isMobile ? (
            <div className="2xl:scale-150 scale-100">
              <Canvas
                text={walletUrl}
                options={{
                  errorCorrectionLevel: "M",
                  margin: 3,
                  color: {
                    dark: "#000000FF",
                    light: "#FFFFFFFF",
                  },
                }}
              />
              ˝
            </div>
          ) : (
            <Button>
              <a href={"walletUrl"}>Authenticate</a>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;
