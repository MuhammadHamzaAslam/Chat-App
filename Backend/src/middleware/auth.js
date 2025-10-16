import jwt from "jsonwebtoken";
import env from "../constant/env.js";
import { StatusCodes } from "http-status-codes";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      error: true,
      message: "Authorization token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      error: true,
      message: "Invalid or expired token",
    });
  }
}


