export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  async function revokeVC(user: any) {
    const idParts = JSON.parse(user.VC).credentialStatus.id.split(":");
    const credentialStatusID = idParts[idParts.length - 1];
    console.log("Revoking VC with ID:", credentialStatusID);
    fetch(
      `http://${process.env.BE_ISSUER_BACKEND_HOST}:${process.env.BE_ISSUER_BACKEND_PORT}/api/status/revokeCredential?id=${credentialStatusID}`,
      {
        method: "POST",
      },
    )
      .then((res) => res.json())
      .then((data) => console.log("Revocation results:", data))
      .catch((error) => console.error("Error:", error));
  }

  try {
    const rawPayload = await req.json();
    await revokeVC(rawPayload.user);
  } catch (error) {
    console.error("Error revoking VC:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate Verifiable Credential" }),
      { status: 500 },
    );
  }
  return new Response("VC has been revoked", {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
