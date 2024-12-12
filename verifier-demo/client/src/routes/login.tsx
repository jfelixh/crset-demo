import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useGenerateWalletURL from "@/hooks/api/useGenerateWalletURL";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCallbackPolling } from "@/hooks/useCallbackPolling";
import useIsMobileDevice from "@/hooks/useIsMobileDevice";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { QRCodeCanvas } from "qrcode.react";

function Index() {
  const { isAuthenticated } = useAuth();
  const {
    challenge,
    walletUrl,
    isLoading,
    error,
    isError,
    isFetching,
    refetch,
  } = useGenerateWalletURL(!isAuthenticated);
  const { isMobile } = useIsMobileDevice();
  const { toast } = useToast();
  const navigate = useNavigate();

  useCallbackPolling({
    walletUrl,
    challenge,
    onSuccess: () => {
      toast({
        title: "Authentication successful",
        description: "You are now logged in.",
      });
      navigate({ to: "/dashboard" });
    },
    enabled: !isAuthenticated,
  });

  return (
    <div className="flex justify-center items-center py-6">
      <Card className="w-[60rem]">
        <CardHeader>
          <CardTitle className="text-3xl">Login using your wallet</CardTitle>
          <CardDescription>
            Scan the QR code with your wallet to log in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full flex justify-center">
            {!isAuthenticated &&
              !isMobile &&
              (isLoading || isFetching ? (
                <Skeleton className="w-[25rem] h-[25rem]" />
              ) : (
                !isError && <QRCodeCanvas value={walletUrl} size={400} />
              ))}
            {!isAuthenticated && isMobile ? (
              <Button>
                <a href={walletUrl}>Log in</a>
              </Button>
            ) : (
              <></>
            )}
          </div>
          {isError ||
            (error && (
              <div>
                <p>Error: {error.message}</p>
                <Button variant="destructive" onClick={() => refetch}>
                  Retry
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  component: Index,
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});
