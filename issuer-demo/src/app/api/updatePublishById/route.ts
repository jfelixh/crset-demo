import updatePublishById, {connectToDb} from "../../../../database/database";

export async function POST(req: Request) {
    if (req.method !== "POST") {
        return new Response(
            `Method ${req.method} Not Allowed`,
            { status: 405, headers: { "Allow": "POST" } }
        );
    }

    async function updatePublishStatusById(user,number) {
        console.log("Updating publish status for VC with ID:", user.email_address);
        const db = connectToDb("./database/bfc.db");
        await updatePublishById(await db, user.email_address, number)
    }


    try {
        const rawPayload = await req.json()
        if(rawPayload.action==="singleUpdate"){
        await updatePublishStatusById(rawPayload.user,0)}
        else if(rawPayload.action==="bulkUpdate"){
            rawPayload.users.forEach(user=> {
                updatePublishStatusById(user, 1)
            })

        }
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