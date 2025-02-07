import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <Card>
      <CardHeader>
        <h3>{title}</h3>
      </CardHeader>
      <CardContent
        className={
          title === "Valid and Invalid Entries Over Time"
            ? "flex justify-center items-center h-96"
            : "inherit"
        }
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
