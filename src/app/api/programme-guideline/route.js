export async function POST(req) {
    try {
      const { question } = await req.json();
      const response = `Programme Guidelines: Here's some info about "${question}"`;
  
      return new Response(JSON.stringify({ answer: response }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }
  