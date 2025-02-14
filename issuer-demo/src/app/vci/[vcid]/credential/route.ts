import { redisGet } from "@/app/config/redis";
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ vcid: string }> },
) {
  const resolvedParams = await params;
  console.log("Resolved params for credential:", resolvedParams);
  const vc = await redisGet("vc-" + resolvedParams.vcid);
  const data = {
    credential: vc,
  };

  console.log("Post request to the wallet to receive the credential");

  return Response.json(data);
}
