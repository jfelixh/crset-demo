import AuthLoader from "@/components/loading-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useGenerateWalletURL from "@/hooks/api/useGenerateWalletURL";
import { useToast } from "@/hooks/use-toast";
import { useCallbackPolling } from "@/hooks/useCallbackPolling";
import useIsMobileDevice from "@/hooks/useIsMobileDevice";
import { EmployeeCredential } from "@/models/employee";
import { QRCodeCanvas } from "qrcode.react";
import { RefObject, useState } from "react";
import { useFormContext } from "react-hook-form";

type EmployeeCredentialInfoStepProps = {
  nextButtonRef: RefObject<HTMLButtonElement>;
};

const ws = new WebSocket("ws://localhost:8090");
// Handle connection errors
ws.onerror = (error) => {
  console.error('WebSocket Error:', error);
};

// Handle connection close
ws.onclose = () => {
  console.log('WebSocket connection closed');
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

  const [verificationStatusList, setVerificationStatusList] = useState<string[]>([]);
  let lastTime = new Date().getTime();
  // Handle incoming messages
  ws.onmessage = (event) => {
    const currentTime = new Date().getTime();
    const eventData = event.data;
    const verificationStatus = eventData+" "+(currentTime-lastTime);
    console.log("------------"+eventData+" "+(currentTime-lastTime));
    // setVerificationStatusList([...verificationStatusList, verificationStatus]);
    setVerificationStatusList((prev) => [...prev, verificationStatus]);
    lastTime = currentTime;
  };

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
          'You have successfully presented your employee credential and confirmed your employment status. Click on "Next" to proceed.',
      });
      nextButtonRef.current?.click();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          "Please rescan the QR code and provide a valid employee credential.",
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
          <div className="flex flex-col justify-center">
            {confirmed && (
              <>
                <p className="text-primary font-medium">
                  You have successfully presented your employee credential and
                  confirmed your employment status.
                </p>
              </>
            )}
            <div className="w-full flex flex-col justify-center items-center mx-auto space-y-4">
              {!confirmed &&
                !isMobile &&
                (isLoading || isFetching ? (
                  <Skeleton className="w-[25rem] h-[25rem]" />
                ) : (
                  !isError && (
                    <>
                      <QRCodeCanvas value={walletUrl} size={400} />
                      {isPending && <AuthLoader />}
                    </>
                  )
                ))}
              {!confirmed && isMobile ? (
                <Button>
                  <a href={walletUrl}>Confirm Employment Status</a>
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
              <div className=" pt-6">
                <Separator />
                <h3 className="text-lg font-medium">Verification Status</h3>
                <div className="h-52 overflow-y-auto">
                  {verificationStatusList.map((status, index) => (
                    <p key={index}>{status}</p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeCredentialInfoStep;
