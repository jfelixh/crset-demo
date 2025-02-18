import { getLoans, postLoan } from "@/controllers/LoansController";
import { connectDB } from "@/db/database";
import { Loan } from "@/types/model";

export const getAllLoans = async () => {
  try {
    const db = await connectDB();
    const loans = await getLoans(db);
    return loans;
  } catch (error) {
    console.error("Error getting loans", error);
    return [];
  }
};

export const postLoanToDB = async (loan: Loan) => {
  try {
    const db = await connectDB();
    await postLoan(db, loan);
  } catch (error) {
    console.error("Error putting loan", error);
  }
};
