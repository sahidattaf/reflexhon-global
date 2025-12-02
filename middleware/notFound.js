import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

export const notFound = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: {
      message: MESSAGES.NOT_FOUND,
      path: req.originalUrl
    }
  });
};
