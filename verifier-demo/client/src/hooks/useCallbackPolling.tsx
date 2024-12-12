import { useEffect } from "react";
import { baseUrl } from "./api/base";

interface CallbackPollingProps {
  walletUrl: string | null;
  challenge: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (result: { success: boolean; [key: string]: any }) => void;
  onError?: (error: Error) => void;
  intervalMs?: number;
  enabled?: boolean;
  isEmployeeCredential?: boolean;
}

export const useCallbackPolling = ({
  walletUrl,
  challenge,
  onSuccess,
  onError,
  intervalMs = 5000,
  enabled,
  isEmployeeCredential = false,
}: CallbackPollingProps) => {
  useEffect(() => {
    if (!walletUrl || enabled === false) return;

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

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            onSuccess(result);
          }
          return;
        } else if (response.status === 401) {
          onError?.(new Error("Employee credential is revoked or invalid"));
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error("Error:", err);
        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(fetchCallback, intervalMs);

    return () => clearInterval(intervalId);
  }, [
    walletUrl,
    challenge,
    onSuccess,
    onError,
    intervalMs,
    enabled,
    isEmployeeCredential,
  ]);
};
