import * as sqlite from "sqlite3";

let db: sqlite.Database;


export async function POST(req: Request) {
    if (req.method !== "POST") {
        return new Response(
            `Method ${req.method} Not Allowed`,
            { status: 405, headers: { "Allow": "POST" } }
        );
    }
    function getStatusUser(user) {
        const vc = JSON.parse(user.VC);
        return vc.credentialStatus[0].id;
    }
    try{
        const user = await req.json()
        const credentialStatusID=getStatusUser(user.user);
        const response = await fetch(`http://localhost:5050/api/status/getStatus?id=${credentialStatusID}`, {
            method: 'POST',
        });
        const data = await response.json();
        return Response.json({ success: true, data });
    }catch (error) {
        console.error("Error revoking VC:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate Verifiable Credential" }),
            { status: 500 }
        );
    }
}