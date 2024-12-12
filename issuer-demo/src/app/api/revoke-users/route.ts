export async function POST(req: Request) {
    if (req.method !== "POST") {
        return new Response(
            `Method ${req.method} Not Allowed`,
            { status: 405, headers: { "Allow": "POST" } }
        );
    }

    async function revokeVC(user) {
        const credentialStatusID=getStatusIDFromVC(user)
        fetch(`http://localhost:5050/api/status/revokeCredential?id=${credentialStatusID}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => console.log("Revocation results:", data))
            .catch((error) => console.error("Error:", error));
    }
    function getStatusIDFromVC(user) {
        const vc = JSON.parse(user.VC);
        // TODO: remove array check after reinitializing database with vcs that have single credentialStatus
        if (Array.isArray(vc.credentialStatus)) {
            return vc.credentialStatus[0].id;
        }else {
            return vc.credentialStatus.id;
        }

    }
    try {
        const rawPayload = await req.json()
        await revokeVC(rawPayload.user)
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