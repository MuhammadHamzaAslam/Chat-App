import express from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import User from "../../models/User.js";
import {
  comparePassword,
  covertPasswordToHash,
  createAuthToken,
  generateOTP,
} from "../../lib/utility.js";
import dayjs from "dayjs";
import { sendEmailOTP } from "../../constant/email.js";

const authRouter = express.Router();

const SignupSchema = z.object({
  user_name: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

authRouter.post("/signup", async (req, res) => {
  const { data, success, error } = SignupSchema.safeParse(req.body);
  if (!success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: true,
      message: "All Fields are required",
      details: error.errors,
    });
  }
  try {
    const [checkExistingUser, isUniqueUserName] = await Promise.all([
      User.findOne({ email: data.email }),
      User.findOne({ user_name: data.user_name }),
    ]);

    if (checkExistingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        error: true,
        message: "User with this email already exists",
      });
    }

    if (isUniqueUserName) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        error: true,
        message: "User with this username already exists",
      });
    }

    const hashedPassword = await covertPasswordToHash(data.password);
    const OTP = generateOTP();
    const otpExpiesAt = dayjs().add(3, "minute").toDate();

    const newUser = new User({
      user_name: data.user_name,
      email: data.email,
      password: hashedPassword,
      otp: OTP,
      otpExpiesAt: otpExpiesAt,
    });

    await newUser.save();
    sendEmailOTP(data.email, OTP);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully and OTP sent to email",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: true,
      message: "Something went wrong",
    });
  }
});
authRouter.post("/login", async (req, res) => {
  const { data, success, error } = LoginSchema.safeParse(req.body);
  if (!success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: true,
      message: "All Fields are required",
      details: error.errors,
    });
  }
  try {
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: true,
        message: "User not found with this email",
      });
    }

    // if (!user.isEmailVerified) {
    //   return res.status(StatusCodes.UNAUTHORIZED).json({
    //     success: false,
    //     error: true,
    //     message: "Email is not verified. Please verify your email.",
    //   });
    // }

    const isPasswordCorrect = comparePassword(data.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: true,
        message: "Invalid Password! Kindly enter correct password.",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      message: "User Login Successfully.",
      data: {
        user,
        token: createAuthToken(user),
      },
    });
  } catch (error) {
    console.log("error ==>", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: true,
      message: "Error in logging in. Please try again.",
    });
  }
});

export default authRouter;
