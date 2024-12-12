import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

const PreviewStep = () => {
  const form = useFormContext();
  const values = form.getValues();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Personal information</h2>
        <div>
          <FormLabel>Name</FormLabel>
          <Input value={values.name} disabled />
        </div>

        <div>
          <FormLabel>Date of birth</FormLabel>
          <Input
            value={new Date(values.birthDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            disabled
          />
        </div>

        <div>
          <FormLabel>Email</FormLabel>
          <Input value={values.email} disabled />
        </div>

        <div>
          <FormLabel>Address</FormLabel>
          <Input value={values.address} disabled />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Loan information</h2>
        <div>
          <FormLabel>Loan Amount</FormLabel>
          <Input value={values.loanAmount} disabled />
        </div>
        <div>
          <FormLabel>Annual Income</FormLabel>
          <Input value={values.annualIncome} disabled />
        </div>
        <div>
          <FormLabel>Loan Amount</FormLabel>
          <Textarea value={values.purpose} disabled />
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
