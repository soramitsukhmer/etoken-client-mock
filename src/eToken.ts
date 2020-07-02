import { createHash } from "https://deno.land/std/hash/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

import {
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  WebSocket,
} from "https://deno.land/std/ws/mod.ts";

export async function createSignData(data: string) {
  const hash = createHash('sha256')
  hash.update(data)

  const certchain = await bcrypt.hash(data)
  const signature = hash.toString()

  return {
    certchain: certchain,
    signature: signature,
    signeddata: data,
  };
}

export async function eTokenSocketHandler(sock: WebSocket) {
  console.log("ws connected!");

  try {
    for await (const ev of sock) {
      if (typeof ev === "string") {
        const payload = await createSignData(ev);
        await sock.send(JSON.stringify(payload));
      } else if (isWebSocketPingEvent(ev)) {
        const [, body] = ev;
        console.log("ws:ping", body);
      } else if (isWebSocketCloseEvent(ev)) {
        const { code, reason } = ev;
        console.log("ws:close", code, reason);
      }
    }

    return sock;
  } catch (err) {
    console.error(`WebSocket: Failed to receive frame: ${err}`);

    if (!sock.isClosed) {
      await sock.close(1000).catch(console.error);
    }
  }
}
