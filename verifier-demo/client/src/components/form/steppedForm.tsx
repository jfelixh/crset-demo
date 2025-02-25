import { Button } from "@/components/ui/button";
import { usePostLoan } from "@/hooks/api/usePostLoan";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { LoanRequest } from "@/models/loan";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigLeftIcon, ArrowBigRightIcon } from "lucide-react";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./schemas";
import Stepper from "./stepper";
import EmployeeCredentialInfoStep from "./steps/employeeCredentialInfo";
import LoanInfoStep from "./steps/loanInfo";
import PreviewStep from "./steps/overview";
import PersonalInfoStep from "./steps/personalInfo";
import LoanApplicationConfirmation from "./steps/submitConfirmation";
import { EmployeeCredential } from "@/models/employee";

type FormData = z.infer<typeof formSchema>;

const steps = [
  "Personal Info",
  "Loan Details",
  "Confirm Employment",
  "Submit Application",
  "Successful Submission",
];

const SteppedForm = () => {
  const [step, setStep] = useState(1);
  const { mutateAsync: postLoan } = usePostLoan();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      email: "",
      birthDate: undefined,
      address: "",
      loanAmount: undefined,
      annualIncome: undefined,
      purpose: "",
      employeeCredentialConfirmed: false,
      employeeCredentialSubject: {},
    },
    mode: "onChange",
  });

  const { handleSubmit, trigger } = form;
  const { toast } = useToast();
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { id, loanAmount, employeeCredentialSubject } = values;
    const payload = {
      amount: loanAmount,
      applicant: id,
      application_dump: JSON.stringify(values),
      employed_by: (employeeCredentialSubject as EmployeeCredential)
        .companyName,
    } as LoanRequest;

    try {
      const response = await postLoan(payload);
      console.log(response);
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      });
      setStep(steps.length);
    } catch (error) {
      console.error(error);
    }
  }

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof FormData> = [];
    if (step === 1) {
      fieldsToValidate = ["name", "address", "birthDate", "email"];
    } else if (step === 2) {
      fieldsToValidate = ["loanAmount", "annualIncome", "purpose"];
    } else if (step === 3) {
      fieldsToValidate = ["employeeCredentialConfirmed"];
    } else if (step === 4) {
      return;
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) {
      console.log("Validation errors:", form.formState.errors);
      toast({
        title: "Form incomplete/incorrect",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <LoanInfoStep />;
      case 3:
        return <EmployeeCredentialInfoStep nextButtonRef={nextButtonRef} />;
      case 4:
        return <PreviewStep />;
      case 5:
        return <LoanApplicationConfirmation />;
      default:
        return <></>;
    }
  };

  return (
    <div>
      <FormProvider {...form}>
        <h1 className="text-3xl font-bold text-center mb-6">
          Fast Loan Application
        </h1>

        <Stepper steps={steps} currentStep={step} />

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}
          <div
            className={cn(
              "flex justify-end mt-6",
              (step > 1 && step < steps.length) || step === steps.length
                ? "justify-between"
                : "",
            )}
          >
            {step > 1 && step !== steps.length && (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ArrowBigLeftIcon />
                Back
              </Button>
            )}
            {step === steps.length ||
              (step === steps.length - 1 && (
                <Button
                  type="submit"
                  className="bg-gradient-to-tr from-primary via-blue-500 to-blue-200 hover:from-primary hover:scale-105 transition-all"
                >
                  Submit
                </Button>
              ))}

            {step < steps.length && step !== steps.length - 1 && (
              <Button
                type="button"
                onClick={handleNext}
                ref={nextButtonRef}
                disabled={
                  form.getValues("employeeCredentialConfirmed") === false &&
                  step === 3 // User should not be able to proceed before successfully presenting a valid employee VC
                }
              >
                Next
                <ArrowBigRightIcon />
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default SteppedForm;
