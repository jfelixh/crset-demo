import * as database from "../../../../database/database";
import * as sqlite from "sqlite3";

let db: sqlite.Database;
export async function POST(req: Request) {
    if (req.method !== "POST") {
        return new Response(
            `Method ${req.method} Not Allowed`,
            { status: 405, headers: { "Allow": "POST" } }
        );
    }

    async function revokeVC(userID) {
        console.log("user revoking:",userID)
        fetch(`http://localhost:5050/api/status/revokeCredential?id=${userID}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => console.log("Revocation results:", data))
            .catch((error) => console.error("Error:", error));
    }

    try {
        const rawPayload = await req.json()
        await revokeVC(rawPayload.user)
        console.log("Payload", rawPayload)
    }catch (error) {
        console.error("Error revoking VC:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate Verifiable Credential" }),
            { status: 500 }
        );
    }
    return new Response("VC has been revoked", {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });

}