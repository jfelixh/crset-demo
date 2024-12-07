import { Loan } from "../../../../server/src/types/model";
import { baseUrl } from "./base";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usePostLoan = async (loan) => {
  console.log("loan", loan);
  const response = await fetch(`${baseUrl}/loans/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loan),
  });
  return response;
};

