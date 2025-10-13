import bcrypt from "bcrypt";
import env from "../constant/env.js";
import jwt from "jsonwebtoken";

// Function to convert plain text password to hashed password
export const covertPasswordToHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

// Generate Random OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Function to compare plain text password with hashed password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: expiresIn });
};

export const createAuthToken = (user, expiresIn = "7d") => {
  return generateToken(
    {
      id: user._id,
      email: user.email,
      user_name: user.user_name,
      password: user.password,
    },
    expiresIn
  );
};
