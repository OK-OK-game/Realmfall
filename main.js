// 🦕 1. CONNECT TO YOUR DATA CORE STORAGE
const kv = await Deno.openKv();

// 🕒 2. BUILT-IN SELF-EXECUTING ENGINE (Runs entirely inside Deno Deploy)
// This expression triggers automatically every Friday afternoon at 3:00 PM (15:00)
Deno.cron("Weekly Friday System Core Thank You Post", "0 15 * * 5", async () => {
  try {
    console.log("Internal cron woke up! Injecting Friday message...");
    
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

    // Push the greeting straight to the top of your discussion index feed
    currentThreads.unshift(fridayPost);
    await kv.set(["realmfall_boards"], currentThreads);
    
    console.log("Success! Automated thread posted safely.");
  } catch (err) {
    console.error("Internal automation ran into a problem:", err.message);
  }
});

// 🌐 3. STANDARD DATA PIPELINE FOR YOUR WEBSITE INTERFACE
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

  return new Response(JSON.stringify({ status: "ONLINE" }), { status: 200, headers });
});
