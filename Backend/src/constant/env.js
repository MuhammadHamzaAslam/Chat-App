import "dotenv/config";

export default {
  DATABASE_URI: process.env.DATABASE_URI,
  PORT: process.env.PORT || 9000,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
};
