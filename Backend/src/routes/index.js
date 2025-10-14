import express from "express";
import { StatusCodes } from "http-status-codes";
import authRouter from "./auth/auth.route.js";

const router = express.Router();

router.use("/auth", authRouter);

router.get("/", (req, res) =>
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "CHAT APP BACKEND IS WORKING...",
    timestamp: Date.now(),
  })
);

export default router;
