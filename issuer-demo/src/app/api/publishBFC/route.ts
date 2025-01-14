export const POST = async () => {
    try {
        console.log("Posting to publish BFC...");
        const response = await fetch('http://localhost:5050/api/status/publishBFC', {
            method: 'POST',
        });
        console.log("Published BFC successfully")
        return new Response("Published BFC successfully", {status: 200, headers: {'Content-Type': 'application/json'}});

    } catch (error) {
        console.error('Error publishing BFC', error);
        // Return an error response
        return new Response(
            JSON.stringify({error: 'Publishing BFC failed'}),
            {status: 500, headers: {'Content-Type': 'application/json'}}
        );
    }
};
