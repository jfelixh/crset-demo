export async function POST() {

  const data = {
    access_token: "",
    token_type: "",
    expires_in: 3600,
  };

  return Response.json(data);
}
