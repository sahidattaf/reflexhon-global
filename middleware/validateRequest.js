import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          message: MESSAGES.VALIDATION_ERROR,
          details: error.details.map(d => d.message)
        }
      });
    }

    next();
  };
};
