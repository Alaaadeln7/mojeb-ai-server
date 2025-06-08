import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific configuration
const env = process.env.NODE_ENV || 'development';
const envFile = path.resolve(__dirname, `../.env.${env}`);

// Load default .env first
dotenv.config();

// Then load environment-specific .env file
if (env !== 'production') {
  dotenv.config({ path: envFile });
}

// Environment configuration
export const config = {
  env,
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME || 'mojeb_ai',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    sessionSecret: process.env.SECRET_KEY_SESSION || 'your-session-secret',
    passwordSaltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS) || 10,
  },
  googleCloud: {
    key: process.env.GOOGLE_CLOUD_KEY,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  },
  session: {
    cookie: {
      secure: env === 'production',
      httpOnly: true,
      maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000,
      sameSite: env === 'production' ? 'none' : 'lax',
    },
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'SECRET_KEY_SESSION',
  'GOOGLE_CLOUD_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default config;
