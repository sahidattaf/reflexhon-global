import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

export const successResponse = (res, data, message = MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message = MESSAGES.ERROR, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
  return res.status(statusCode).json({
    success: false,
    error: { message }
  });
};
