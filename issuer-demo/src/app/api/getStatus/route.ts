export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405,
      headers: { Allow: "POST" },
    });
  }
  try {
    const { user } = await req.json();
    const idParts = JSON.parse(user.VC).credentialStatus.id.split(":");
    const credentialStatusID = idParts[idParts.length - 1];
    console.log("credentialStatusID:", credentialStatusID);
    const response = await fetch(
      `http://${process.env.BE_ISSUER_BACKEND_HOST}:${process.env.BE_ISSUER_BACKEND_PORT}/api/status/getStatus?id=${credentialStatusID}`,
      {
        method: "POST",
      },
    );
    const data = await response.json();
    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Error getting status:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate Verifiable Credential" }),
      { status: 500 },
    );
  }
}
