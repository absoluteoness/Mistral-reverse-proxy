export default {
  async fetch(request, env, ctx) {
    const mistralURL = "https://api.mistral.ai/v1/chat/completions";
    const apiKey = "Bearer u1xsZstqIFONoPMigChEU0pRr8heiygi";

    let payload = null;

    if (request.method === "POST") {
      payload = await request.text();
    } else if (request.method === "GET") {
      const { searchParams } = new URL(request.url);
      const prompt = searchParams.get("prompt");

      if (!prompt)
        return new Response("Missing prompt", { status: 400 });

      payload = JSON.stringify({
        model: "mistral-tiny",
        messages: [{ role: "user", content: prompt }]
      });
    } else {
      return new Response("Only GET and POST allowed", { status: 405 });
    }

    const mistralReq = new Request(mistralURL, {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: payload
    });

    const res = await fetch(mistralReq);
    const data = await res.text();

    return new Response(data, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
