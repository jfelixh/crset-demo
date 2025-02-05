export async function POST(req: Request) {
    if (req.method !== "POST") {
        return new Response(
            `Method ${req.method} Not Allowed`,
            { status: 405, headers: { "Allow": "POST" } }
        );
    }
    function getStatusUser(user) {
        const vc = JSON.parse(user.VC);
        // TODO: remove array check after reinitializing database with vcs that have single credentialStatus
        // It is not needed to remove the array check
        if (Array.isArray(vc.credentialStatus)) {
            return vc.credentialStatus[0].id;
        }else {
            return vc.credentialStatus.id;
        }
    }
    try{
        const user = await req.json()
       // console.log("user", user)
        const credentialStatusID=getStatusUser(user.user);
       console.log("credentialStatusID:",credentialStatusID)
        const response = await fetch(`http://bfc-issuer-backend:5050/api/status/getStatus?id=${credentialStatusID}`, {
            method: 'POST',
        });
        const data = await response.json();
        return Response.json({ success: true, data });
    }catch (error) {
        console.error("Error getting status:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate Verifiable Credential" }),
            { status: 500 }
        );
    }
}