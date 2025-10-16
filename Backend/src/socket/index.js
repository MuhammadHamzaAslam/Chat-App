import { Server } from "socket.io";

let connectedClients = 0;

/**
 *
 * @param {Server} io
 */

export default function SocketHandler(io) {
  io.on("connection", (socket) => {
    connectedClients++;
    console.log("Total connected clients:", connectedClients);

    // join/leave conversation rooms
    socket.on("conversation:join", (conversationId) => {
      if (!conversationId) return;
      socket.join(String(conversationId));
    });

    socket.on("conversation:leave", (conversationId) => {
      if (!conversationId) return;
      socket.leave(String(conversationId));
    });

    // relay typing indicators
    socket.on("typing:start", (conversationId, user) => {
      if (!conversationId) return;
      socket.to(String(conversationId)).emit("typing:start", user);
    });
    socket.on("typing:stop", (conversationId, user) => {
      if (!conversationId) return;
      socket.to(String(conversationId)).emit("typing:stop", user);
    });
    socket.on("disconnect", () => {
      connectedClients--;
      console.log("Total connected clients:", connectedClients);
    });
  });
}
