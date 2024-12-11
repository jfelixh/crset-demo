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
import { useCallbackPolling } from "@/hooks/useCallbackPolling";
import useIsMobileDevice from "@/hooks/useIsMobileDevice";
import { QRCodeCanvas } from "qrcode.react";
import { useFormContext } from "react-hook-form";

const EmployeeCredentialInfoStep = () => {
  const { challenge, walletUrl, isLoading, error } = useGenerateWalletURL();
  const { isMobile } = useIsMobileDevice();
  const { toast } = useToast();
  const form = useFormContext();

  useCallbackPolling({
    walletUrl,
    challenge,
    onSuccess: () => {
      void form.setValue("employeeCredentialConfirmed", true);
      toast({
        title: "Confirmed.",
        description:
          'You have successfully presented your employee credential and confirmed your employment status. Click on the "Next" to proceed.',
      });
    },
    isEmployeeCredential: true,
  });

  return (
    <div className="max-w-xl md:max-w-3xl lg:max-w-4xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Confirm Your Employment Status</CardTitle>
          <CardDescription>
            Scan the QR code with your wallet to confirm your employment status
            and presenting your employee credential.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full flex justify-center">
            {!isMobile && isLoading && (
              <Skeleton className="w-[25rem] h-[25rem]" />
            )}
            {!isMobile && !isLoading && !error ? (
              <QRCodeCanvas value={walletUrl} size={400} />
            ) : (
              <Button>
                <a href={walletUrl}>Confirm Employment Status</a>
              </Button>
            )}
          </div>
          {error && <p>Error: {error.message}</p>}
          <pre className="max-w-full text-wrap overflow-auto bg-secondary p-2">
            {JSON.stringify(walletUrl, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeCredentialInfoStep;
