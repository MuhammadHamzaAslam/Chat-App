import express from "express";
import { StatusCodes } from "http-status-codes";
import authRouter from "./auth/auth.route.js";

const router = express.Router();

router.use("/auth", authRouter);

router.get("/", (req, res) =>
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "API FETCHED SUCCESSFULLY",
    timestamp: Date.now(),
  })
);

export default router;
