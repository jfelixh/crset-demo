import {redisGet} from "@/app/config/redis";


import { promisify } from "util";

export const GET = async (req: Request,res:Response) => {
    try {

        const url = new URL(req.url);
        const login_id = url.searchParams.get('login_id');

        //console.log("Query: " + login_id);
        if (!login_id) {
            return new Response(JSON.stringify({ error: "Missing login_id" }), { status: 400 });
        }

        let idToken;
        try {
            idToken = await redisGet(`login_id:${login_id}`);
        } catch (error) {
            console.error("Error fetching session token from Redis:", error);
            return new Response(JSON.stringify({ error: "Error fetching session token from Redis" }), { status: 404 });
        }

        // Req accepted, but still pending for a token to be stored in Redis after presenting the credential
        if (!idToken) {
         //   console.log("Session token not found");
            return new Response(JSON.stringify({ error: "Session token not found" }), { status: 202 });
            }

        //req.session.token = idToken;
        //await promisify(req.session.save.bind(req.session))();
       // console.log("Session token set");
        // if an ID token is found, create a session

        return new Response(JSON.stringify({ success: true, token: idToken }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `token=${idToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
            },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};