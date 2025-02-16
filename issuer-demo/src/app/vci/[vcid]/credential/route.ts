import { getVC } from "../../../../../database/database";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ vcid: number }> },
) {
  const resolvedParams = await params;
  console.log("Resolved params for credential:", resolvedParams);

  try {
    const vc = await getVC(resolvedParams.vcid);
    return Response.json({ credential: vc });
  } catch (err) {
    console.error("Failed to retrieve credential " + err);
    return Response.json(
      { error: "Failed to retrieve credential" },
      { status: 404 },
    );
  }
}
