import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { FormData } from "../schemas";
import { EmployeeCredential } from "@/models/employee";
import { EmployeeCard } from "../employee-card";

const PreviewStep = () => {
  const form = useFormContext<FormData>();
  const values = form.getValues();
  const employeeCredential =
    values.employeeCredentialSubject as EmployeeCredential;

  return (
    <div className="flex flex-col gap-6 xl:grid lg:grid-cols-[1.5fr_1fr] py-6">
      <div className="space-y-6">
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
            <FormLabel>Loan Amount (€)</FormLabel>
            <Input value={values.loanAmount} disabled />
          </div>
          <div>
            <FormLabel>Annual Income (€)</FormLabel>
            <Input value={values.annualIncome} disabled />
          </div>
          <div>
            <FormLabel>Purpose</FormLabel>
            <Textarea value={values.purpose} disabled />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Employment Status</h2>
        <div className="max-w-[28rem]">
          <EmployeeCard employee={employeeCredential} />
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
