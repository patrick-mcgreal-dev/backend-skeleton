import { Socket, Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import Redis from "ioredis";

export function setupSocketServer(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  const redisSubscriber = new Redis({ host: "redis", port: 6379 });

  redisSubscriber.subscribe("status-updates", (err, count) => {
    if (err) {
      console.error("Redis subscription failed:", err);
    } else {
      console.log(`Subscribed to ${count} Redis channel(s).`);
    }
  });

  redisSubscriber.on("message", (channel, message) => {
    if (channel === "status-updates") {
      try {
        const parsed = JSON.parse(message);
        io.emit("status-update", parsed);
        console.log("Emitted status update to WebSocket clients:", parsed);
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}
