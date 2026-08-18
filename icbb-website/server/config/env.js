/**
 * Central place for secrets that must never fall back to a default.
 *
 * A hardcoded fallback secret is worse than a crash: the app appears to work
 * while every token it issues can be forged by anyone who has read the source.
 */

const isProduction = process.env.NODE_ENV === 'production';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (isProduction) {
    throw new Error(
      'JWT_SECRET is not set. Refusing to start in production without it. ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"'
    );
  }
  console.warn(
    '\n  WARNING: JWT_SECRET is not set. Using a random per-process secret for ' +
    'local development.\n  Tokens will be invalidated on every restart. Set ' +
    'JWT_SECRET in .env to avoid this.\n'
  );
}

// In development, fall back to a value that is random per process rather than a
// known constant, so a dev machine can never accidentally accept forged tokens.
const resolvedJwtSecret =
  JWT_SECRET || require('crypto').randomBytes(48).toString('hex');

const corsOrigins = (process.env.CORS_ORIGINS ||
  'http://localhost:3000,https://icbb-gh.com,https://www.icbb-gh.com')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = {
  isProduction,
  jwtSecret: resolvedJwtSecret,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  corsOrigins
};
