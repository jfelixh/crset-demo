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

  const jsonVc = JSON.parse(vc);

  const data = {
    credential_issuer:
      process.env.NEXT_PUBLIC_URL + "/vci/" + resolvedParams.vcid,
    credential_endpoint:
      process.env.NEXT_PUBLIC_URL +
      "/vci/" +
      resolvedParams.vcid +
      "/credential",
    credential_configurations_supported: {
      ProofOfEmploymentCredential: {
        format: "ldp_vc",
        credential_definition: {
          "@context": jsonVc["@context"],
          type: jsonVc["type"],
        },
      },
    },
  };

  return Response.json(data);
}
