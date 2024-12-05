export type Loan = {
  id: string; // UUID for unique identification
  amount: number; // Loan amount as a floating-point number
  timestamp: string; // Timestamp with a default value
  applicant: string; // Decentralized Identifier (DID) of the loan applicant
};
