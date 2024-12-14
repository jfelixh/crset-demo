export type Loan = {
  id: string;
  amount: number;
  timestamp: string;
  applicant: string;
  employed_by: string;
  application_dump: string;
};

export type LoanRequest = Pick<
  Loan,
  "amount" | "applicant" | "application_dump" | "employed_by"
>;
