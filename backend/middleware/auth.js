import { auth } from 'express-oauth2-jwt-bearer';

const checkAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

export default checkAuth;
