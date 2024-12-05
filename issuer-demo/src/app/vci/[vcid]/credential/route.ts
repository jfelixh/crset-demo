import { Redis } from "ioredis";

let redis: Redis;
try {
  redis = new Redis();
} catch (error) {
  console.error("Failed to connect to Redis:", error);
}

export async function POST(
  _request: Request,
  { params }:  { params: Promise<{ vcid: string } > }
) {
  const resolvedParams = await params;
  console.log("Post request", JSON.stringify(_request))
  console.log("Post params", JSON.stringify(_request))
  const vc = await redis.get("vc-" + resolvedParams.vcid);

  console.log("VC in credential folder", JSON.stringify(vc))
  const data = {
    credential: vc,
  };

  return Response.json(data);
}
