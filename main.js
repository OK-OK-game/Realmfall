// 🦕 INITIALIZE DATABASE STORAGE CONNECTORS
const kv = await Deno.openKv();

Deno.serve(async (req) => {
  // Universal cors setup so your frontend games can talk to this backend
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  const url = new URL(req.url);

  // 🕒 1. THE FRIDAY AUTOMATION TRIGGER ROUTE
  if (url.pathname === "/trigger-friday-post") {
    try {
      const result = await kv.get(["realmfall_boards"]);
      let currentThreads = result.value || [];

      const fridayPost = {
        id: Date.now(),
        author: "System_Core",
        title: "🎉 Happy Friday! Quick Message From System_Core",
        body: "Hey everyone! It is officially Friday and the weekend is here. I hope you all enjoyed the website this week! Thank you so much for still hanging out on the website, playing the games, and posting on the forums. Stay tuned for more game updates!",
        replies: [],
        time: "03:00 PM"
      };

      currentThreads.unshift(fridayPost);
      await kv.set(["realmfall_boards"], currentThreads);
      
      return new Response(JSON.stringify({ success: true, message: "Friday post injected!" }), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  // 🌐 2. FORUM THREAD DELIVERY ROUTE
  if (url.pathname === "/threads") {
    const result = await kv.get(["realmfall_boards"]);
    return new Response(JSON.stringify(result.value || []), { status: 200, headers });
  }

  // 🏠 3. BASE HOME LINK
  return new Response("<h1>🚀 API Engine Online</h1>", {
    status: 200,
    headers: { "Content-Type": "text/html" }
  });
});
