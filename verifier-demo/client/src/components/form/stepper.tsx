import { Progress } from "@/components/ui/progress"; // Import Progress component
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="flex flex-col w-full items-center justify-center py-6 space-y-4">
      {/* Step Indicators */}
      <div className="flex w-full max-w-3xl items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10 w-8">
            {/* Step Circle */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                index + 1 <= currentStep
                  ? "bg-primary text-white scale-110"
                  : "bg-gray-300 text-gray-600",
                index + 1 === currentStep &&
                  " outline outline-offset-2 outline-2 outline-primary transition-opacity",
              )}
            >
              {index + 1 < currentStep ? <CheckIcon /> : index + 1}
            </div>
            {/* Step Label */}
            <span
              className={cn(
                "text-xs mt-2 transition-colors duration-300 text-center w-fit",
                index + 1 <= currentStep
                  ? "text-primary font-medium"
                  : "text-gray-600",
              )}
            >
              {step}
            </span>
          </div>
        ))}
        {/* Progress Bar */}
        <div className="absolute top-[22.5%] left-0 right-0 -translate-y-1/2 w-full px-4">
          <Progress value={progress} className="h-1.5 bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default Stepper;
