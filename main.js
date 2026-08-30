// 🦕 1. CONNECT TO YOUR STORAGE
const kv = await Deno.openKv();

// 🕒 2. 1-MINUTE TEST CLOCK LOOP (Runs entirely inside your server)
async function startInternalClock() {
  console.log("⏰ 1-Minute Test Clock initialized successfully!");
  
  while (true) {
    try {
      console.log("🎉 Clock loop triggered! Injecting test Friday message...");
      
      const result = await kv.get(["realmfall_boards"]);
      let currentThreads = result.value || [];

      const fridayPost = {
        id: Date.now(), // Unique identifier block
        author: "System_Core",
        title: "🎉 Happy Friday! Quick Message From System_Core",
        body: "Hey everyone! It is officially Friday and the weekend is here. I hope you all enjoyed the website this week! Thank you so much for still hanging out on the website, playing the games, and posting on the forums. Stay tuned for more game updates!",
        replies: [],
        time: new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', timeZone: "America/Chicago" })
      };

      // Unshift drops the post straight to the very top of your forum discussion feed layout
      currentThreads.unshift(fridayPost);
      await kv.set(["realmfall_boards"], currentThreads);
      console.log("🚀 SUCCESS: Test post injected into database! Check your forum feed.");
      
    } catch (err) {
      console.error("Background clock loop error:", err.message);
    }

    // Wait exactly 60 seconds (60000 milliseconds) before looping again
    await new Promise(resolve => setTimeout(resolve, 60000));
  }
}

// Fire up the 1-minute background loop immediately on server boot
startInternalClock();

// 🌐 3. STANDARD WEB SERVER PIPELINE FOR YOUR WEBSITE INTERFACE
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

  return new Response(JSON.stringify({ status: "ONLINE", test_clock: "RUNNING" }), { status: 200, headers });
});
