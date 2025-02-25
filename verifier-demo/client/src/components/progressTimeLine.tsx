"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, AlertCircle, X } from "lucide-react";
import { Separator } from "./ui/separator";

interface Step {
  id: number;
  name: string;
  status: "not_started" | "started" | "completed" | "failed";
  timeElapsed?: number;
  additionalMetrics?: {
    [key: string]: string | number;
  };
}

interface ProcessTimelineProps {
  steps: Step[];
  vcid: string | null;
}

export function ProcessTimeline({ steps, vcid }: ProcessTimelineProps) {
  const getProgress = () => {
    const completedSteps = steps.filter(
      (step) => step.status === "completed",
    ).length;
    return (completedSteps / steps.length) * 100;
  };

  const getStatusIcon = (status: Step["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="text-green-500" />;
      case "started":
        return <Clock className="text-yellow-500 animate-pulse" />;
      case "failed":
        return <X className="text-red-500" />;
      default:
        return <AlertCircle className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: Step["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-300";
      case "started":
        return "bg-yellow-300";
      case "failed":
        return "bg-red-300";
      default:
        return "bg-gray-300";
    }
  };

  const getExplorerLink = (key: string, value: string | number) => {
    switch (key) {
      case "address":
        return `https://sepolia.etherscan.io/address/${value}`;
      case "txHash":
        return `https://sepolia.etherscan.io/tx/${value}`;
      case "firstBlobVersionedHash":
        return `https://sepolia.blobscan.com/blob/${value}`;
      default:
        return value.toString();
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Verification Progress</CardTitle>
        <Progress value={getProgress()} className="w-full mt-2" />
        <CardDescription>
          {vcid ? (
            <div>VCID: {vcid}</div>
          ) : (
            <div>Scan the QR code to present your employment credential!</div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[65vh] overflow-auto">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}
                >
                  {getStatusIcon(step.status)}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                )}
              </div>
              <div className="w-full">
                <h3 className="text-sm font-semibold">{step.name}</h3>
                <p className="text-xs text-gray-500">
                  <a className="font-bold">Status: </a>
                  {step.status.replace("_", " ")}
                </p>
                {step.timeElapsed !== undefined &&
                  step.status !== "not_started" && (
                    <p className="text-xs text-gray-500">
                      <a className="font-bold">Time elapsed: </a>
                      {step.timeElapsed > 0 ? step.timeElapsed : "< 1"} ms
                    </p>
                  )}
                {step.additionalMetrics && (
                  <div className="mt-1 truncate max-w-96">
                    <Separator />
                    <div className="space-y-1">
                      {Object.entries(step.additionalMetrics).map(
                        ([key, value]) => (
                          <p
                            key={key}
                            className="text-xs text-gray-500 truncate"
                            title={`${key}: ${value}`}
                          >
                            <a className="font-bold">{key}: </a>
                            {getExplorerLink(key, value).startsWith("http") ? (
                              <a
                                href={getExplorerLink(key, value)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500"
                              >
                                {value.toString()}
                              </a>
                            ) : (
                              value.toString()
                            )}
                          </p>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
