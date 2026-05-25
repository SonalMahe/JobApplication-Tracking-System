import { auth } from 'express-oauth2-jwt-bearer';

const checkAuth = (req, res, next) => {
  return auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  })(req, res, next);
};

export default checkAuth;
