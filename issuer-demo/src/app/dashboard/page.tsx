"use client";
import React, { useEffect, useState } from "react";
import LastTransactionsCard from "@/components/lastTransactionsCard";
import BarChart from "@/components/barChart";
import LineChart from "@/components/lineChart";
import ChartCard from "@/components/chartCard";
import { LogData } from "../contexts/logsContext";
import SmallCard from "@/components/smallCard";
import {
  optionsLineChartFilterCascade,
  optionsLineChartEntries,
} from "@/lib/constants";
import { timeAgo } from "@/lib/constants";
import LoadingComponent from "@/components/loadingComponent";

interface ChartDataset {
  label: string;
  data: number[] | null;
  backgroundColor?: string;
  borderColor?: string;
  fill?: boolean;
  type?: string;
  yAxisID?: string;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

const Dashboard = () => {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [latestLog, setLatestLog] = useState<LogData>({} as LogData);
  const [last5Logs, setLast5Logs] = useState<LogData[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [numberOfUnpublishedEntries, setNumberOfUnpublishedEntries] =
    useState<number>(0);
  const isLoading = !logs || logs.length === 0;

  const [formattedData, setFormattedData] = useState<{
    entriesData: ChartData;
    filterCascadeData: ChartData;
    stackedBarChartData: ChartData;
    transactionCostData: ChartData;
  }>({
    entriesData: { labels: [], datasets: [] },
    filterCascadeData: { labels: [], datasets: [] },
    stackedBarChartData: { labels: [], datasets: [] },
    transactionCostData: { labels: [], datasets: [] },
  });

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
      console.error("Error fetching logs in the frontend:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("/api/exchangeRate");
        const data = await response.json();
        if (data.price) {
          setExchangeRate(data.price);
        }
      } catch {
        console.log("Exchange rate could not be fetched");
      }
    };
    fetchExchangeRate();

    const numberOfUnpublishedEntries = async () => {
      try {
        const response = await fetch("/api/getUnpublishedEntries");
        const data = await response.json();
        setNumberOfUnpublishedEntries(data.length);
      } catch (error) {
        console.error("Error fetching number of unpublished entries:", error);
      }
    };
    numberOfUnpublishedEntries();

    if (logs && logs.length > 0) {
      const dates = logs.map((log) =>
        new Date(log.publicationTimestamp).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
        }),
      );
      const validEntriesData = logs.map((log) => log.validIdsSize);
      const invalidEntriesData = logs.map((log) => log.invalidIdsSize);
      const transactionCost = logs.map((log) => log.transactionCost);
      setLatestLog(logs[logs.length - 1]);
      setLast5Logs(logs.slice(logs.length - 5, logs.length).reverse()); // Reverse to show the newest logs first

      const entriesData = {
        labels: dates.slice(-20), // Only show the last 20 dates
        datasets: [
          {
            label: "Valid Entries",
            data: validEntriesData,
            borderColor: "rgba(75, 192, 192, 0.6)",
            yAxisID: "y-axis-1",
          },
          {
            label: "Invalid Entries",
            data: invalidEntriesData,
            borderColor: "rgba(255, 99, 132, 0.6)",
            yAxisID: "y-axis-1",
          },
          {
            label: "Number of Layers",
            data: logs.map((log) => log.numberOfBfcLayers),
            borderColor: "rgba(9, 98, 5, 0.6)",
            yAxisID: "y-axis-2",
          },
          {
            label: `Capacity: ${logs[0]?.rHat}`,
            data: null,
            yAxisID: "y-axis-1",
          },
        ],
      };

      const filterCascadeData = {
        labels: dates,
        datasets: [
          {
            label: "Bloom Filter Cascade Size (bytes)",
            data: logs.map((log) => log.serializedDataSize),
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            type: "bar",
            fill: true,
            yAxisID: "y-axis-1",
          },
          {
            label: "Number of Blobs",
            data: logs.map((log) => log.numberOfBlobs),
            borderColor: "rgba(255, 99, 132, 1)",
            fill: false,
            type: "line",
            yAxisID: "y-axis-2",
          },
        ],
      };

      const stackedBarChartData = {
        labels: dates.slice(-6), // Only show the last 6 data points
        datasets: [
          {
            label: "Construction Time",
            data: logs.map((log) => log.constructionTimeInSec),
            backgroundColor: "rgba(18, 5, 5, 1)",
          },
          {
            label: "Publishing Time",
            data: logs.map((log) => log.publicationTimeInSec),
            backgroundColor: "rgba(255, 159, 64, 0.6)",
          },
        ],
      };

      const transactionCostData = {
        labels: dates,
        datasets: [
          {
            label: "Transaction Costs in Ether",
            data: transactionCost,
            borderColor: "rgba(153, 102, 255, 1)",
          },
        ],
      };

      setFormattedData({
        entriesData,
        filterCascadeData,
        stackedBarChartData,
        transactionCostData,
      });
    }
  }, [logs]);

  return (
    <div className="p-6 grid gap-6">
      {/* First Row */}
      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Valid and Invalid Entries Over Time">
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <LineChart
              data={formattedData.entriesData}
              options={optionsLineChartEntries}
            />
          )}
        </ChartCard>

        <LastTransactionsCard logs={last5Logs} isLoading={isLoading} />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-4 gap-6">
        <SmallCard
          title="Entries Changed and not Published"
          isLoading={isLoading}
          content={numberOfUnpublishedEntries?.toString() ?? "0"}
        />

        <SmallCard
          title="Time Since Last Publish"
          isLoading={isLoading}
          content={timeAgo(latestLog.publicationTimestamp)}
        />

        <SmallCard
          title="Costs of Last Transaction"
          isLoading={isLoading}
          content={`$ ${(latestLog.transactionCost * exchangeRate).toFixed(
            2,
          )} or ${(latestLog.transactionCost || 0).toFixed(6)} ETH`}
        />

        <SmallCard
          title="Data Size"
          isLoading={isLoading}
          content={`${(latestLog.serializedDataSize / 1000.0).toFixed(2)} KB`}
        />
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Construction and Publishing Times in Seconds">
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <BarChart
              data={formattedData.stackedBarChartData}
              options={{
                responsive: true,
                scales: { x: { stacked: true }, y: { stacked: true } },
              }}
            />
          )}
        </ChartCard>

        <ChartCard title="Transaction Costs Over Time">
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <LineChart
              data={formattedData.transactionCostData}
              options={{
                responsive: true,
                scales: { y: { beginAtZero: true } },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem: { raw: number }) => {
                        return tooltipItem.raw.toFixed(6);
                      },
                    },
                  },
                },
              }}
            />
          )}
        </ChartCard>
      </div>

      {/* 4rth Row */}
      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Bloom Filter Cascade Size">
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <LineChart
              data={formattedData.filterCascadeData}
              options={optionsLineChartFilterCascade}
            />
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
