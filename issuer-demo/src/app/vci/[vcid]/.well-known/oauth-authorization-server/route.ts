import { getVC } from "../../../../../../database/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ vcid: number }> },
) {
  const resolvedParams = await params;
  const vc = await getVC(resolvedParams.vcid);
  if (!vc || vc === undefined) {
    return Response.json({ error: "No prepared VC found" }, { status: 404 });
  }

  const data = {
    issuer: process.env.NEXT_PUBLIC_URL + "/vci/" + resolvedParams.vcid,
    token_endpoint:
      process.env.NEXT_PUBLIC_URL + "/vci/" + resolvedParams.vcid + "/token",
    response_types_supported: ["vp_token", "id_token"],
    grant_types_supported: [
      "urn:ietf:params:oauth:grant-type:pre-authorized_code",
    ],
  };

  return Response.json(data);
}
