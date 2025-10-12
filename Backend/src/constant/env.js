import "dotenv/config";

export default {
  DATABASE_URI: process.env.DATABASE_URI,
  PORT: process.env.PORT || 9000,
};
