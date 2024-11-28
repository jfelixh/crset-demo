import { useState, useEffect } from "react";
import { UAParser } from "ua-parser-js";

const useIsMobileDevice = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const uaparser = new UAParser();
    const agent = uaparser.getDevice();
    const agentIsMobile = agent.type === "mobile" || agent.type === "tablet";
    setIsMobile(agentIsMobile);
  }, []);

  return { isMobile };
};

export default useIsMobileDevice;
