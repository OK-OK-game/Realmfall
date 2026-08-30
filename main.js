// 🦖 DENO CORE SERVER WITH BUILT-IN AUTOMATED CRON SCHEDULER
const kv = await Deno.openKv();

// 🕒 RECURRING FRIDAY CRON ENGINE: Triggers at exactly 3:00 PM (15:00) every Friday afternoon
Deno.cron("Weekly Friday System Core Thank You Post", "* * * * *", async () => {

  try {
    const result = await kv.get(["realmfall_boards"]);
    let currentThreads = result.value || [];

    // Construct the friendly Friday message payload
    const fridayPost = {
      id: Date.now(), // Creates a unique timestamp block
      author: "System_Core",
      title: "🎉 Happy Friday! Quick Message From System_Core",
      body: "Hey everyone! It is officially Friday and the weekend is here. I hope you all enjoyed the website this week! Thank you so much for still hanging out on the website, playing the games, and posting on the forums. Stay tuned for more game updates!",
      replies: [],
      time: "03:00 PM"
    };

    // Unshift adds the post straight to the very top of your forum feed index layout
    currentThreads.unshift(fridayPost);
    await kv.set(["realmfall_boards"], currentThreads);
    
    console.log("Weekly Friday thank-you message successfully broadcasted!");
  } catch (err) {
    console.error("Cron failed to inject Friday post:", err.message);
  }
});

// Standard API request routing framework
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
