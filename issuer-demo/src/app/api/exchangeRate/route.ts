export const GET = async () => {
  console.log("Fetching exchange rate...");
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    );
    const data = await response.json();
    console.log("Received data:", data);
    return new Response(JSON.stringify({ price: data.ethereum?.usd }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(
      "Error fetching exchange rate (falling back to default):",
      error,
    );
    return new Response(JSON.stringify({ price: 3265.74 }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
