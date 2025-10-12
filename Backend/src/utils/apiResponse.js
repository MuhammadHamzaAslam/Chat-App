const { StatusCodes } = require("http-status-codes");

function success(res, data, message = "OK", statusCode = StatusCodes.OK) {
  return res.status(statusCode).json({ success: true, message, data });
}

function fail(
  res,
  message = "Bad Request",
  statusCode = StatusCodes.BAD_REQUEST,
  errors
) {
  return res.status(statusCode).json({ success: false, message, errors });
}

module.exports = { success, fail };
