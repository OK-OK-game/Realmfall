// 🦕 1. CONNECT TO YOUR KEY-VALUE DATABASE DATA CORE
const kv = await Deno.openKv();

// 🕒 2. FREE AUTOMATIC INTERNAL CLOCK LOOP (Runs every 60 seconds)
async function startInternalClock() {
  console.log("⏰ Test loop initialized!");
  while (true) {
    try {
      console.log("Injecting test Friday message...");
      
      const result = await kv.get(["realmfall_boards"]);
      let currentThreads = result.value || [];

      // Create the clean Friday message layout block
      const fridayPost = {
        id: Date.now(), // Uses a unique timestamp sequence to prevent overwrites
        author: "System_Core",
        title: "🎉 Happy Friday! Quick Message From System_Core",
        body: "Hey everyone! It is officially Friday and the weekend is here. I hope you all enjoyed the website this week! Thank you so much for still hanging out on the website, playing the games, and posting on the forums. Stay tuned for more game updates!",
        replies: [],
        time: new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', timeZone: "America/Chicago" })
      };

      // Unshift drops the post straight to the very top slot of your discussion forum feed
      currentThreads.unshift(fridayPost);
      await kv.set(["realmfall_boards"], currentThreads);
      console.log("Post injected successfully!");

    } catch (err) {
      console.error("Loop error:", err.message);
    }

    // Wait exactly 60 seconds (1 minute) before looping again
    await new Promise(resolve => setTimeout(resolve, 60000));
  }
}

// Launch the automatic loop background engine immediately on server boot
startInternalClock();

// 🌐 3. UNIVERSAL HOME PAGE REQUEST ROUTER (Bypasses the "Not Found" error completely)
Deno.serve(async (req) => {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });

  // This catches all incoming requests on your homepage and responds with your database data
  const result = await kv.get(["realmfall_boards"]);
  const threadsList = result.value || [];
  return new Response(JSON.stringify(threadsList), { status: 200, headers });
});
