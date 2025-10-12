import express from "express";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get("/", (req, res) =>
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "API FETCHED SUCCESSFULLY",
    timestamp: Date.now(),
  })
);

export default router;
