

export const GET = async (req, res) => {
    try {
        console.log("Posting to publish BFC...");
        const response = await fetch('http://localhost:5050/api/status/publishBFC', {
            method: 'POST',
        });
        const data = await response.json();

        // Return a successful response
        return Response.json({ success: true, data });
    } catch (error) {
        console.error('Error publishing BFC', error);
        // Return an error response
        return new Response(
            JSON.stringify({error: 'Failed to fetch users'}),
            {status: 500, headers: {'Content-Type': 'application/json'}}
        );
    }
};
