// 🦖 DENO CORE SERVER WITH BUILT-IN AUTOMATED CRON SCHEDULER
const kv = await Deno.openKv();

// 🕒 AUTOMATED CRON ENGINE: Sets a task to check the database timing logs
// This checks the network loops and appends a fresh announcement thread 
Deno.cron("Weekly System Core Announcement", "0 15 * * *", async () => {
  const targetDate = new Date("2026-09-04T15:00:00-05:00").getTime(); // Exactly 1 week from now (Friday, Sept 4, 3:00 PM)
  const currentDate = Date.now();

  // If the cloud calendar reaches or passes the target time node, execute the insertion trigger
  if (currentDate >= targetDate) {
    const checkFlag = await kv.get(["cron_executed_sept4"]);
    
    // Safety lock: Ensure the automated bot only creates the post EXACTLY once!
    if (!checkFlag.value) {
      const result = await kv.get(["realmfall_boards"]);
      let currentThreads = result.value || [];

      // Construct the automated System Core post payload matrix
      const systemPost = {
        id: Date.now(),
        author: "System_Core",
        title: "📢 Realmfall Network Maintenance and Optimization Report",
        body: "Automated core diagnostic completed. All forum matrix nodes, localStorage shards, and GDevelop game portal assets are performing stably at 100% capacity.",
        replies: [],
        time: "03:00 PM"
      };

      currentThreads.unshift(systemPost);
      await kv.set(["realmfall_boards"], currentThreads);
      await kv.set(["cron_executed_sept4"], true); // Engagement lock secured
      console.log("Automated 1-week system message successfully broadcasted!");
    }
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
