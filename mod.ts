import { serve, Server } from "https://deno.land/std/http/server.ts";
import {
  acceptable,
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  WebSocket,
} from "https://deno.land/std/ws/mod.ts";
import { blue, green, red, yellow } from "https://deno.land/std/fmt/colors.ts";

import { eTokenSocketHandler } from "./src/eToken.ts";

function errorHandler(req: any) {
  return async function(err: any) {
    console.error(`WebSocket: Failed to accept websocket: ${err}`);
    await req.respond({ status: 400 });
  }
}

function shutdownServer(server: Server) {
  return function() {
    server.close()
    Deno.exit(0);
  }
}

if (import.meta.main) {
  const port = Deno.args[0] || "44331";
  const server = serve(`:${port}`);
  const ws_path = '/token'

  console.log(yellow(`ws server is running on ws://localhost:${port}${ws_path}`));

  const sigint = Deno.signals.interrupt()
  const sigterm = Deno.signals.terminate();

  sigint.then(shutdownServer(server));
  sigterm.then(shutdownServer(server));

  for await (const req of server) {
    if (req.url === ws_path) {
      if (acceptable(req)) {
        const { conn, r: bufReader, w: bufWriter, headers } = req;

        const socket = acceptWebSocket({
          conn,
          bufReader,
          bufWriter,
          headers,
        });

        socket.then(eTokenSocketHandler)
        socket.catch(errorHandler(req))
      }
    }
  }
}
