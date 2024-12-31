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
  const vc = await redis.get("vc-" + resolvedParams.vcid);
  const data = {
    credential: vc,
  };

  console.log("Post request to the wallet to receive the credential")

  return Response.json(data);
}
