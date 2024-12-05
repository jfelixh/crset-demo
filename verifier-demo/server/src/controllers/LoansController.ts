import { Loan } from "@/types/model";
import { Database } from "sqlite3";

export const getLoans = async (db: Database) => {
  const loans = await new Promise<Loan[]>((resolve, reject) => {
    db.all("SELECT * FROM loans", [], (err: { message: any }, rows: Loan[]) => {
      if (err) {
        console.error("Error getting loans", err.message);
        reject(err);
        return;
      }

      resolve(rows);
    });
  });
  return loans;
};

export const postLoan = async (db: Database, loan: Loan) => {
  const { amount, applicant } = loan;
  await new Promise<void>((resolve, reject) => {
    db.run(
      "INSERT INTO loans (amount, applicant, timestamp) VALUES (?, ?, ?, ?)",
      [amount, applicant, new Date().toISOString()],
      (err: { message: any }) => {
        if (err) {
          console.error("Error putting loan", err.message);
          reject(err);
          return;
        }

        resolve();
      }
    );
  });
};
