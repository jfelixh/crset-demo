import { updatePublishById } from "../../../../database/database";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  async function updatePublishStatusById(user: any, number: number) {
    console.log("Updating publish status for VC with ID:", user.email);
    await updatePublishById(user.email, number);
  }

  try {
    const rawPayload = await req.json();
    console.log("singleUpdate rawPayload", rawPayload);
    if (rawPayload.action === "singleUpdate") {
      await updatePublishStatusById(rawPayload.user, 0);
    } else if (rawPayload.action === "bulkUpdate") {
      console.log("bulk update", rawPayload.users);
      rawPayload.users.forEach((user: any) => {
        updatePublishStatusById(user, 1);
      });
    }
  } catch (error) {
    console.error("Error revoking VC:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate Verifiable Credential" }),
      { status: 500 },
    );
  }
  return new Response("VC has been updated", {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
