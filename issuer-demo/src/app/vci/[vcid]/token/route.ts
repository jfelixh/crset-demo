export async function POST() {
  // since this is a testing and development tool, we ignore the auth code
  const data = {
    access_token: "",
    token_type: "",
    expires_in: 3600,
  };

  //TODO: clarify what the token is for and expires_in
  return Response.json(data);
}
