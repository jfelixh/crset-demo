import AuthLoader from "@/components/loading-auth";
import { ProcessTimeline } from "@/components/progressTimeLine";
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
import { EmployeeCredential } from "@/models/employee";
import { CheckCircleIcon } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { RefObject, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

type EmployeeCredentialInfoStepProps = {
  nextButtonRef: RefObject<HTMLButtonElement>;
};

interface Step {
  id: number
  name: string
  status: 'not_started' | 'started' | 'completed' | 'failed'
  timeElapsed?: number
  additionalMetrics?: {
    [key: string]: string | number
  }
}

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

  const { id } = useAuth();
  const protocol = id?.split(":")[id.split(":").length - 1];
  // Use Ref to store the WebSocket connection: prevents reconnection on re-render
  const wsRef = useRef<WebSocket | null>(null);
  const [vcId, setVcId] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([{
    id: 0,
    name: 'Extract Publisher Address',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  },
  {
    id: 1,
    name: 'Retrieve Transactions',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  },
  {
    id: 2,
    name: 'Identify blob transaction & get blob hash',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  },
  {
    id: 3,
    name: 'Retrieve & concatenate blob data',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  },
  {
    id: 4,
    name: 'Reconstruct blob data',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  },
  {
    id: 5,
    name: 'Reconstruct bloom filter cascade',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  },
  {
    id: 6,
    name: 'Check revocation status',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  }
  ]);
  useEffect(() => {
    if (!wsRef.current) {
      // Use websocket protocol to pass client identifier
      wsRef.current = new WebSocket("ws://localhost:8090", protocol);

      wsRef.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
      };

      let lastTime = new Date().getTime();
      wsRef.current.onmessage = (event) => {
        const eventData = JSON.parse(event.data);

        if (eventData.step) {        
          const currentTime = new Date().getTime();
          const timePassed = currentTime - lastTime;
          console.log("------------" + event.data + " " + timePassed);
          let stepId = 0;
          switch (eventData.step) {
            case "extractPublisherAddress":
              stepId = 0;
              break;
            case "getAssetTransfers":
              stepId = 1;
              break;
            case "getBlobVersionedHashes":
              stepId = 2;
              break;
            case "fetchAndConcatBlobData":
              stepId = 3;
              break;
            case "reconstructBlobData":
              stepId = 4;
              break;
            case "reconstructBFC":
              stepId = 5;
              break;
            case "checkRevocation":
              stepId = 6;
              break;
          }
          // update step status
          setSteps((prev) => {
            prev[stepId].status = eventData.status;
            return [...prev];
          });
          // update time elapsed for completed steps
          if (eventData.status === "completed") {
            if (eventData.step === "checkRevocation" && eventData.additionalMetrics.isRevoked) {
              setSteps((prev) => {
                prev[stepId].status = "failed";
                return [...prev];
              });
            }

            setSteps((prev) => {
              prev[stepId].timeElapsed = timePassed;
              return [...prev];
            });
          }
          // update additional metrics
          if (Object.keys(eventData).length > 2) {
            setSteps((prev) => {
              prev[stepId].additionalMetrics = eventData.additionalMetrics;
              return [...prev];
            });
          }
          lastTime = currentTime;
        } else if (eventData.vcid) {
          // update VC-ID
          setVcId(eventData.vcid);
        }      
      };
    }
  }, []);


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
      console.error("Error:", error);
    },
    isEmployeeCredential: true,
    enabled: !confirmed,
  });

  return (
    <div className="flex justify-center items-center py-6">
      <Card className="w-[85rem]">
        <CardHeader>
          <CardTitle>Confirm Your Employment Status</CardTitle>
          <CardDescription>
            Scan the QR code with your wallet to confirm your employment status
            and presenting your employee credential.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-center space-x-4">
            {confirmed && (
              <div className="flex items-center text-center">
                <div className="flex flex-col text-primary font-medium items-center">
                  <CheckCircleIcon size={60} className="mr-2 mb-4" />
                  You have successfully presented your employee credential and confirmed your employment status.
                </div>
              </div>
            )}
            {!confirmed && (
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
            )}
            {isError ||
              (error && (
                <div>
                  <p>Error: {error.message}</p>
                  <Button variant="destructive" onClick={() => refetch}>
                    Retry
                  </Button>
                </div>
              ))}
            <ProcessTimeline steps={steps} vcid={vcId}/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeCredentialInfoStep;
