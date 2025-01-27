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
  const { amount, applicant, application_dump } = loan;
  await new Promise<void>((resolve, reject) => {
    db.run(
      "INSERT INTO loans (amount, applicant, application_dump, timestamp) VALUES (?, ?, ?, ?)",
      [amount, applicant, application_dump, new Date().toISOString()],
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
