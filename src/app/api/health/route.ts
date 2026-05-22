import { NextResponse } from "next/server";

const SERVERS = [
  { id: "vidsrc", url: "https://vidsrc.icu" },
  { id: "multiembed", url: "https://multiembed.mov" },
  { id: "videasy", url: "https://player.videasy.net" },
  { id: "autoembed", url: "https://player.autoembed.cc" },
  { id: "2embed", url: "https://www.2embed.cc" },
  { id: "vidrock", url: "https://vidrock.net" },
  { id: "superflix", url: "https://superflixapi.buzz" }
];

export async function GET(request: Request) {
  // Simple health check load balancer logic
  // Tests servers in parallel and returns the fastest one that responds with 200 OK
  
  const promises = SERVERS.map(async (server) => {
    try {
      const start = Date.now();
      // We do a HEAD request to check if the server is up
      const res = await fetch(server.url, { method: "HEAD", signal: AbortSignal.timeout(3000) });
      const ping = Date.now() - start;
      
      if (res.ok) {
        return { ...server, status: "up", ping };
      }
      return { ...server, status: "down", ping: Infinity };
    } catch (err) {
      return { ...server, status: "down", ping: Infinity };
    }
  });

  const results = await Promise.all(promises);
  
  // Sort by ping to find the fastest healthy server
  const workingServers = results.filter(s => s.status === "up").sort((a, b) => a.ping - b.ping);
  
  if (workingServers.length > 0) {
    return NextResponse.json({
      success: true,
      fastest: workingServers[0],
      servers: results
    });
  }

  return NextResponse.json({
    success: false,
    message: "No working API server available",
    servers: results
  }, { status: 500 });
}
