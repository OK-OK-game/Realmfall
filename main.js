// 🦕 1. INITIALIZE DATABASE STORAGE CONNECTORS
const kv = await Deno.openKv();

// 🕒 2. ABSOLUTE TOP-LEVEL CRON REGISTER ENGINE (Must be initialized first)
// This uses the 1-minute interval template "* * * * *" so we can test live visibility!
Deno.cron("Weekly Friday System Core Thank You Post", "* * * * *", async () => {
  try {
    console.log("Cron worker triggered! Fetching forum database packet...");
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
    console.log("Database entry injected! Check your forum feed.");
  } catch (err) {
    console.error("Internal cron worker block errored out:", err.message);
  }
});

// 🌐 3. STANDARD WEB SERVER REQUEST ROUTING FRAMEWORK
Deno.serve(async (req) => {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/threads") {
    const result = await kv.get(["realmfall_boards"]);
    return new Response(JSON.stringify(result.value || []), { status: 200, headers });
  }

  if (req.method === "POST" && url.pathname === "/threads") {
    try {
      const dataPacket = await req.json();
      if (dataPacket.threads) await kv.set(["realmfall_boards"], dataPacket.threads);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ status: "ONLINE", message: "Core Active" }), { status: 200, headers });
});
