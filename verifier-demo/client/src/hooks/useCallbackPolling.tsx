import { useEffect } from "react";
import { baseUrl } from "./api/base";

interface CallbackPollingProps {
  walletUrl: string | null;
  challenge: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (result: { success: boolean; [key: string]: any }) => void;
  intervalMs?: number;
  modalOpen?: boolean;
  isEmployeeCredential?: boolean;
}

export const useCallbackPolling = ({
  walletUrl,
  challenge,
  onSuccess,
  intervalMs = 5000,
  modalOpen,
  isEmployeeCredential = false,
}: CallbackPollingProps) => {
  useEffect(() => {
    if (!walletUrl || modalOpen === false) return;

    const fetchCallback = async () => {
      const params = new URLSearchParams({ challenge });
      if (isEmployeeCredential) {
        params.append("isEmployeeCredential", "true");
      }

      try {
        const response = await fetch(
          `${baseUrl}/present/callback?${params.toString()}`,
          { credentials: "include" }
        );

        if (response.status === 202) return;

        const result = await response.json();
        if (result.success) {
          clearInterval(intervalId);
          onSuccess(result);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    const intervalId = setInterval(fetchCallback, intervalMs);

    return () => clearInterval(intervalId);
  }, [
    walletUrl,
    challenge,
    onSuccess,
    intervalMs,
    modalOpen,
    isEmployeeCredential,
  ]);
};
