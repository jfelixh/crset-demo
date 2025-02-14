import { redisGet } from "@/app/config/redis";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const login_id = url.searchParams.get("login_id");

    if (!login_id) {
      return new Response(JSON.stringify({ error: "Missing login_id" }), {
        status: 400,
      });
    }

    let idToken;
    try {
      idToken = await redisGet(`login_id:${login_id}`);
    } catch (error) {
      console.error("Error fetching session token from Redis:", error);
      return new Response(
        JSON.stringify({ error: "Error fetching session token from Redis" }),
        { status: 404 },
      );
    }

    if (!idToken) {
      return new Response(
        JSON.stringify({ error: "Session token not found" }),
        { status: 202 },
      );
    }

    return new Response(JSON.stringify({ success: true, token: idToken }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `token=${idToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
