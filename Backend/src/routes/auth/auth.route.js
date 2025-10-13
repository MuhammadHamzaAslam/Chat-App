import express from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import User from "../../models/User.js";

const authRouter = express.Router();

const SignupSchema = z.object({
  user_name: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

authRouter.post("/signup", async (req, res) => {
  const { data, success, error } = SignupSchema.safeParse(req.body);
  console.log("data ==>", data);

  if (!success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: true,
      message: "All Fields are required",
      details: error.errors,
    });
  }
  try {
    const checkExistingUser = await User.findOne({ email: data.email });

    if (checkExistingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        error: true,
        message: "User with this email already exists",
      });
    }
    const newUser = new User({
      user_name: data.user_name,
      email: data.email,
      password: data.password,
    });
    await newUser.save();
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("error ===>", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: true,
      message: "Something went wrong",
    });
  }
});
authRouter.post("/login", (req, res) => {});

export default authRouter;
