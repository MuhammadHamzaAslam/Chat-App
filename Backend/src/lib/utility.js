import bcrypt from "bcrypt";

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
