// 🦕 1. INITIALIZE STABLE KV CONNECTORS
const kv = await Deno.openKv();

// 🕒 2. TOP-LEVEL TEST CRON ENGINE (Runs every minute)
Deno.cron("Weekly Friday System Core Thank You Post", "* * * * *", async () => {
  try {
    const result = await kv.get(["realmfall_boards"]);
    let currentThreads = result.value || [];

    const fridayPost = {
      id: Date.now(),
      author: "System_Core",
      title: "🎉 Happy Friday! Quick Message From System_Core",
      body: "Hey everyone! It is officially Friday and the weekend is here. I hope you all enjoyed the website this week! Thank you so much for still hanging out on the website, playing the games, and posting on the forums.",
      replies: [],
      time: "03:00 PM"
    };

    currentThreads.unshift(fridayPost);
    await kv.set(["realmfall_boards"], currentThreads);
    console.log("🚀 SUCCESS: Friday post successfully added to the database!");
  } catch (err) {
    console.error("Cron failed:", err.message);
  }
});

// 🌐 3. STANDARD WEB SERVER REQUEST HANDLING
Deno.serve(async (req) => {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  const url = new URL(req.url);

  if (url.pathname === "/threads") {
    const result = await kv.get(["realmfall_boards"]);
    return new Response(JSON.stringify(result.value || []), { status: 200, headers });
  }

  return new Response(JSON.stringify({ status: "ONLINE", message: "Core Active" }), { status: 200, headers });
});
