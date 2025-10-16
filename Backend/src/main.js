import express from "express";
import cors from "cors";
import helmet from "helmet";
import env from "./constant/env.js";
import { connectDB } from "./lib/dbConnect.js";
import router from "./routes/index.js";
import { Server } from "socket.io";
import { createServer } from "http";
import SocketHandler from "./socket/index.js";

const app = express();
const PORT = env.PORT;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Set security-related headers
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/v1", router);

SocketHandler(io);

server.listen(PORT, () => {
  connectDB();
});
