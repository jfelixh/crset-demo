import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "../components/ui/card";
import Link from "next/link";
import { FileText } from "lucide-react";
import { LogData } from "@/app/contexts/BfcLogsContext";
import { timeAgo } from "@/lib/constants";

const LastTransactionsCard = ({ logs }: { logs: LogData[] }) => {
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const getAddress = async () => {
      try {
        const response = await fetch(
          "http://localhost:5050/api/bfcLogs/address"
        );
        const responseData = await response.json();
        setAddress(responseData);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    getAddress();
  }, [address]);

  return (
    <Card>
      <CardHeader>
        <h2>Last 5 Transactions</h2>
      </CardHeader>
      <div
        className="flex-1 overflow-y-auto p-2 space-y-5 "
        style={{ maxHeight: "300px" }}
      >
        <ul>
          {logs.map((log) => (
            <li
              key={log.transactionHash}
              className="flex items-center space-x-3 px-auto mb-4"
            >
              <FileText className="w-5 h-5 text-blue-500" />
              <div className="flex flex-col">
                <Link
                  href={`https://sepolia.etherscan.io/tx/${log.transactionHash}`}
                  passHref
                  target="_blank"
                >
                  <span className="block text-blue-500 hover:text-blue-700 truncate max-w-[600px]">
                    <strong>TxHash:</strong>
                    {log.transactionHash}
                  </span>
                </Link>

                <span>
                  {Array.isArray(log.blobVersionedHash) &&
                  log.blobVersionedHash.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {log.blobVersionedHash.map((hash, index) => (
                        <Link
                          key={index}
                          href={`https://sepolia.blobscan.com/blob/${hash}`}
                          passHref
                          target="_blank"
                        >
                          <li className="text-blue-500 hover:text-blue-700 truncate max-w-[600px] ">
                            <strong>BlobHash:</strong>
                            {hash}
                          </li>
                        </Link>
                      ))}
                    </ul>
                  ) : (
                    <span>No Blob Hashes Available</span>
                  )}
                </span>

                <span className="text-sm text-gray-500">
                  {timeAgo(log.publicationTimeStemp)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4">
        <Link
          href={`https://sepolia.etherscan.io/address/${address}`}
          passHref
          target="_blank"
        >
          <span className="text-blue-500 hover:text-blue-700 text-center block mt-4">
            See more transactions
          </span>
        </Link>
      </div>
    </Card>
  );
};

export default LastTransactionsCard;
