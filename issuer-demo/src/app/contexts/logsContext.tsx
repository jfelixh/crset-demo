import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type LogData = {
  validIdsSize: number;
  invalidIdsSize: number;
  serializedDataSize: number;
  constructionTimeInSec: number;
  publicationTimeInSec: number;
  numberOfBlobs: number;
  transactionHash: string;
  blobVersionedHash: string[];
  publicationTimestamp: string;
  transactionCost: number;
  calldataTotalCost: number;
  numberOfBfcLayers: number;
  rHat: number;
};

interface LogContextType {
  logs: LogData[];
  fetchLogs: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogData[]>([]);

  const fetchLogs = async () => {
    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_ISSUER_BACKEND_HOST}:${process.env.NEXT_PUBLIC_ISSUER_BACKEND_PORT}/api/bfcLogs/logs`,
      );
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Failed to fetch logs in the frontend");
      }
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error(JSON.stringify(process.env));
      console.error("Error fetching logs in the frontend:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <LogContext.Provider value={{ logs, fetchLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error("useLogs must be used within a LogProvider");
  }
  return context;
};
