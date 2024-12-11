import { Button } from "@/components/ui/button";
import { usePostLoan } from "@/hooks/api/usePostLoan";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { LoanRequest } from "@/models/loan";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigLeftIcon, ArrowBigRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./schemas";
import Stepper from "./stepper";
import EmployeeCredentialInfoStep from "./steps/employee-credential-info";
import LoanInfoStep from "./steps/loan-info";
import PreviewStep from "./steps/overview";
import PersonalInfoStep from "./steps/personal-info";

type FormData = z.infer<typeof formSchema>;

const steps = [
  "Personal Info",
  "Loan Details",
  "Confirm Employment",
  "Submit Application",
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
    },
    mode: "onChange",
  });

  const { handleSubmit, trigger } = form;
  const { toast } = useToast();
  const { token } = useAuth();

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
      // toast to notify user that the form has been pre-filled
      toast({
        title: "Form pre-filled",
        description: "Your information has been pre-filled from your ID",
      });
    }
  }, [form, toast, token]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const { id, loanAmount } = values;
    const payload = {
      amount: loanAmount,
      applicant: id,
      application_dump: JSON.stringify(values),
    } as LoanRequest;

    try {
      const response = await postLoan(payload);
      console.log(response);
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
        return <EmployeeCredentialInfoStep />;
      case 4:
        return <PreviewStep />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...form}>
      <h1 className="text-3xl font-bold text-center mb-6">Loan Application</h1>

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
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowBigLeftIcon />
              Back
            </Button>
          )}
          {step < steps.length && (
            <Button type="button" onClick={handleNext}>
              Next
              <ArrowBigRightIcon />
            </Button>
          )}
          {step === steps.length && <Button type="submit">Submit</Button>}
        </div>
      </form>
    </FormProvider>
  );
};

export default SteppedForm;
