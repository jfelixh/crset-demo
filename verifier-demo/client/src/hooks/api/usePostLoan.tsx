import { LoanRequest } from "@/models/loan";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "./base";

export const usePostLoan = () => {
  const createLoanRequest = async (loan: LoanRequest) => {
    console.log(loan);
    return fetch(`${baseUrl}/loans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loan),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error posting loan", error);
      });
  };

  return useMutation({
    mutationFn: createLoanRequest,
  });
};
