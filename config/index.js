import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: '/api'
  }
};
