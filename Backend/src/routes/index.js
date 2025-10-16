import express from "express";
import { StatusCodes } from "http-status-codes";
import authRouter from "./auth/auth.route.js";
import usersRouter from "./user/users.route.js";
import conversationRouter from "./conversation/conversation.route.js";
import messageRouter from "./message/message.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/conversations", conversationRouter);
router.use("/messages", messageRouter);

router.get("/", (req, res) =>
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "CHAT APP BACKEND IS WORKING...",
    timestamp: Date.now(),
  })
);

export default router;
