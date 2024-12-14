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
import { EmployeeCredential } from "@/models/employee";
import { QRCodeCanvas } from "qrcode.react";
import { RefObject } from "react";
import { useFormContext } from "react-hook-form";

type EmployeeCredentialInfoStepProps = {
  nextButtonRef: RefObject<HTMLButtonElement>;
};

const EmployeeCredentialInfoStep = ({
  nextButtonRef,
}: EmployeeCredentialInfoStepProps) => {
  const form = useFormContext();
  const confirmed = form.watch("employeeCredentialConfirmed");
  const {
    challenge,
    walletUrl,
    isLoading,
    error,
    isError,
    refetch,
    isFetching,
  } = useGenerateWalletURL();
  const { isMobile } = useIsMobileDevice();
  const { toast } = useToast();

  const { isPending } = useCallbackPolling({
    walletUrl,
    challenge,
    onSuccess: ({ success, credential }) => {
      const parsedCredential = JSON.parse(credential.replace(/\\/g, ""));
      void form.setValue("employeeCredentialSubject", {
        ...parsedCredential,
      } as EmployeeCredential);
      void form.setValue("employeeCredentialConfirmed", success);

      toast({
        title: "Confirmed.",
        description:
          'You have successfully presented your employee credential and confirmed your employment status. Click on the "Next" to proceed.',
      });
      nextButtonRef.current?.click();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Please provide a valid employee credential.",
        variant: "destructive",
      });
      console.error("Error:", error);
    },
    isEmployeeCredential: true,
    enabled: !confirmed,
  });

  return (
    <div className="flex justify-center items-center py-6">
      <Card className="w-[60rem]">
        <CardHeader>
          <CardTitle>Confirm Your Employment Status</CardTitle>
          <CardDescription>
            Scan the QR code with your wallet to confirm your employment status
            and presenting your employee credential.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {confirmed && (
            <>
              <p className="text-primary font-medium">
                You have successfully presented your employee credential and
                confirmed your employment status.
              </p>
            </>
          )}
          <div className="w-full flex justify-center">
            {!confirmed &&
              !isMobile &&
              (isLoading || isFetching ? (
                <Skeleton className="w-[25rem] h-[25rem]" />
              ) : (
                !isError && <QRCodeCanvas value={walletUrl} size={400} />
              ))}
            {!confirmed && isMobile ? (
              <Button>
                <a href={walletUrl}>Confirm Employment Status</a>
              </Button>
            ) : (
              <></>
            )}
            {isPending && <p>Waiting for confirmation...</p>}
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
};

export default EmployeeCredentialInfoStep;
