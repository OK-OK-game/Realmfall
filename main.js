// 🦖 DENO CLOUD DB & REAL-TIME MULTIPLAYER SERVER
// This file executes live on the Deno Deploy Edge network

// 1. Initialize the built-in, unblocked Deno Cloud Key-Value database vault
const kv = await Deno.openKv();

Deno.serve(async (req) => {
  // CORS Header configurations so your school iPad and Vercel sites can talk to this server smoothly
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  });

  // Handle standard preflight browser security checks
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  const url = new URL(req.url);

  // 📥 API ENDPOINT 1: GET /threads - Downloads all saved topics from the cloud vault
  if (req.method === "GET" && url.pathname === "/threads") {
    try {
      const result = await kv.get(["realmfall_boards"]);
      const threads = result.value || [];
      return new Response(JSON.stringify(threads), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  // 📤 API ENDPOINT 2: POST /threads - Catches and saves a new thread array packet
  if (req.method === "POST" && url.pathname === "/threads") {
    try {
      const dataPacket = await req.json();
      
      if (!dataPacket.threads) {
        return new Response(JSON.stringify({ error: "Missing thread array block" }), { status: 400, headers });
      }

      // Overwrite the master database matrix with the newly updated array structure
      await kv.set(["realmfall_boards"], dataPacket.threads);
      
      return new Response(JSON.stringify({ success: true, message: "Cloud vault synchronized!" }), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  // Fallback response if someone hits your link directly in a browser
  return new Response(JSON.stringify({ 
    status: "ONLINE", 
    message: "Realmfall Edge Database Server Active", 
    year: new Date().getFullYear() 
  }), { status: 200, headers });
});
