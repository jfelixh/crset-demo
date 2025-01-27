export async function POST() {

  console.log("Post request with the corresponding access token")
  const data = {
    access_token: "secureToken",
    token_type: "bearer",
    expires_in: 3600,
  };
  return Response.json(data);
}
