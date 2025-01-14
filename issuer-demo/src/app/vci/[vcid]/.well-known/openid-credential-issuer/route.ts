import { Redis } from "ioredis";

var redis: Redis;
try {
  redis = new Redis();
} catch (error) {
  console.error("Failed to connect to Redis:", error);
}

export async function GET(
  _request: Request,
  { params }:  { params: Promise<{ vcid: string } > }
) {
  const resolvedParams = await params;
  //console.log("Resolved params:", resolvedParams);
  const vc = await redis.get("vc-" + resolvedParams.vcid);

  if (!vc || vc === undefined) {
    return Response.json({ error: "No prepared VC found" }, { status: 404 });
  }

  const jsonVc = JSON.parse(vc);

  const data = {
    credential_issuer: process.env.NEXT_PUBLIC_URL + "/vci/" + resolvedParams.vcid,
    credential_endpoint:
      process.env.NEXT_PUBLIC_URL + "/vci/" + resolvedParams.vcid + "/credential",
    credential_configurations_supported: {
      ProofOfEmploymentCredential: {
        format: "ldp_vc",
        credential_definition: {
          // just mentioning the standard type for simplicity
          // might need to be dynamically loaded from redis in the future
          // but seems to work for now
          "@context": jsonVc["@context"],
          type: jsonVc["type"],
        },
      },
    },
  };

  console.log("Send metadata to the wallet to know what kind of credential to request")

  return Response.json(data);
}
