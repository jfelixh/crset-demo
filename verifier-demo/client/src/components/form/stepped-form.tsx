import { Button } from "@/components/ui/button";
import { usePostLoan } from "@/hooks/api/usePostLoan";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { LoanRequest } from "@/models/loan";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigLeftIcon, ArrowBigRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./schemas";
import Stepper from "./stepper";
import EmployeeCredentialInfoStep from "./steps/employee-credential-info";
import LoanInfoStep from "./steps/loan-info";
import PreviewStep from "./steps/overview";
import PersonalInfoStep from "./steps/personal-info";
import LoanApplicationConfirmation from "./steps/submit-confirmation";
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
  const { token } = useAuth();
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (token) {
      const { credentialSubject } = token;
      form.setValue("id", credentialSubject?.id || "");
      form.setValue(
        "name",
        credentialSubject?.givenName + " " + credentialSubject?.familyName
      );
      form.setValue("birthDate", new Date(credentialSubject?.birthDate || ""));
      form.setValue("address", credentialSubject?.address || "");

      toast({
        title: "Form pre-filled",
        description: "Your information has been pre-filled from your ID",
      });
    }
  }, [form, toast, token]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
          Loan Application
        </h1>

        <Stepper steps={steps} currentStep={step} />

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}
          <div
            className={cn(
              "flex justify-end mt-6",
              (step > 1 && step < steps.length) || step === steps.length
                ? "justify-between"
                : ""
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
              <Button type="button" onClick={handleNext} ref={nextButtonRef}>
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
