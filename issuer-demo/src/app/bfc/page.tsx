"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProcessTimeline } from "@/components/progressTimeLine";
import { Button } from "@/components/ui/button";

interface Step {
  id: number
  name: string
  status: 'not_started' | 'started' | 'completed' | 'failed'
  timeElapsed?: number
  additionalMetrics?: {
    [key: string]: string | number
  }
}


const ws = new WebSocket("ws://localhost:8091");
ws.onerror = (error) => {
  console.error('WebSocket Error:', error);
};
ws.onclose = () => {
  console.log('WebSocket connection closed');
};
let lastTime = new Date().getTime();

const BFCPage = () => {
  const publishtoBFC = async () => {
    try {
      const response = await fetch("/api/publishBFC", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Response is not ok! status: ${response.status}`);
      } 
    } catch (error) {
      console.error("Error publishing to BFC:", error);
    }

  };

  const [steps, setSteps] = useState<Step[]>([{
    id: 0,
    name: 'Query database',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  },
  {
    id: 1,
    name: 'Construct bloom filter cascade',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  },
  {
    id: 2,
    name: 'Serialize bloom filter cascade',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  },
  {
    id: 3,
    name: 'Construct blobs',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  },
  {
    id: 4,
    name: 'Construct transaction',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  },
  {
    id: 5,
    name: 'Send transaction & wait for chain-inclusion',
    status: 'not_started',
    timeElapsed: 0,
    additionalMetrics: {}
  }
  ]);
  ws.onmessage = (event) => {
    const currentTime = new Date().getTime();
    const eventData = JSON.parse(event.data.toString());
    const timePassed = currentTime - lastTime;
    console.log("------------"+event.data.toString()+" "+timePassed);
    let stepId = 0;
    switch (eventData.step) {
      case "queryDB": 
      stepId = 0; 
      break;
      case "constructBFC":
        stepId = 1;
        break;
        case "serializeBFC":
          stepId = 2;
          break;
          case "constructBlobs":
            stepId = 3;
            break;
            case "constructTx":
              stepId = 4;
              break;
              case "sendTx":
                stepId = 5;
                break;
              }
              // update step status
              setSteps((prev) => {
                prev[stepId].status = eventData.status;
                return [...prev];
              });
              // update time elapsed for completed steps
              if (eventData.status === "completed") {
                setSteps((prev) => {
                  prev[stepId].timeElapsed = timePassed;
                  return [...prev];
                });
              }
              // update additional metrics
              if (Object.keys(eventData).length > 2) {
                setSteps((prev) => {
                  prev[stepId].additionalMetrics = eventData.additionalMetrics;
                  return [...prev];
                });
              }
              lastTime = currentTime;
  };

  return (
    <div className="page-container flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center font-serif">
        Click the button below to publich the status list to the blockchain.
      </h1> 
      <Button onClick={publishtoBFC} className="mb-4 mt-4">Confirm Publication</Button>

      <h2 className="text-2xl font-medium text-center italic tracking-wide">
        It could take a moment depending on network congestion.
      </h2>
      <ProcessTimeline steps={steps}/>
    </div>
  );
};

export default BFCPage;
