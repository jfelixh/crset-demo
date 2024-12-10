import { getMetadata } from "@/lib/getMetadata";
export async function GET (req: Request) {
  console.log("getClientMetadata");
  try {
    const { method } = req;
    // step 12
    if (method === "GET") {
      const metadata = getMetadata([
        //TODO: Add the correct URL (do we even need this?)
        process.env.PUBLIC_INTERNET_URL + "/api/dynamic/presentCredential",
      ]);
      // step 13
      console.log(JSON.stringify(metadata));
      //res.status(200).json(metadata);
      return new Response(JSON.stringify(metadata), {status: 200});
    } else {
      //res.status(500).end();
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 500 });
    }
  } catch (e: Error) {
    //res.status(500).end();
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};