// 🦕 INITIALIZE DATABASE STORAGE CONNECTORS
const kv = await Deno.openKv();

Deno.serve(async (req) => {
  // Universal permissions so your main gaming website can read this data payload safely
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  const url = new URL(req.url);

  // 🌐 FORUM & SUPPORT COMBINED DELIVERY DATA PIPELINE
  if (url.pathname === "/threads" || url.pathname === "/") {
    const result = await kv.get(["realmfall_boards"]);
    let currentThreads = result.value || [];

    // Formulate a structured master category mapping packet
    const forumDataPacket = {
      status: "ONLINE",
      // This gives your frontend interface direct drop-down menu parameters to filter by
      categories: [
        { id: "general", label: "💬 General Discussion" },
        { id: "bugs", label: "🐛 Report a Bug" },
        { id: "support", label: "🎫 Contact Support & Help" }, // 👈 Your new Support drop-down addition!
        { id: "updates", label: "📢 Game Updates" }
      ],
      threads: currentThreads
    };

    return new Response(JSON.stringify(forumDataPacket), { status: 200, headers });
  }

  // Fallback path handler to process standard client forum posts
  if (req.method === "POST") {
    try {
      const dataPacket = await req.json();
      if (dataPacket.threads) await kv.set(["realmfall_boards"], dataPacket.threads);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ status: "ONLINE" }), { status: 200, headers });
});
