import { Server } from "socket.io";

const connectedClients = 0;

/**
 *
 * @param {Server} io
 */

export default function SocketHandler(io) {
  io.on("connection", (socket) => {
    connectedClients++;
    console.log("Total connected clients:", connectedClients);
    socket.on("disconnect", () => {
      connectedClients--;
      console.log("Total connected clients:", connectedClients);
    });
  });
}
