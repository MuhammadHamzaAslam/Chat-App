import express from "express";
import { StatusCodes } from "http-status-codes";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";

const usersRouter = express.Router();

// GET /api/v1/users?query=abc - list or search users
usersRouter.get("/", auth, async (req, res) => {
  const { query } = req.query;
  try {
    const filter = query
      ? {
          $or: [
            { user_name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    // Exclude requesting user from results optionally
    if (req.user?.id) {
      filter._id = { $ne: req.user.id };
    }

    const users = await User.find(filter)
      .select("_id user_name email avatar bio isOnline lastActive")
      .limit(50);

    return res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: true,
      message: "Failed to fetch users",
    });
  }
});

export default usersRouter;


