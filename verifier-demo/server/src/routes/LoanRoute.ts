import { getAllLoans, postLoanToDB } from "@/services/LoanService";
import { Loan } from "@/types/model";
import express from "express";

const router = express.Router();

// Get all loans
router.get("/", async (req, res) => {
  try {
    const loans = await getAllLoans();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Post a loan
router.post("/", async (req, res) => {
  try {
    const loan = req.body as Loan;
    await postLoanToDB(loan);
    res.json({ message: "Loan added successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
