import { config } from 'dotenv';
export { APIS, getApiBase } from './api-config';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local`, quiet: true });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const SWAGGER_ENABLED = process.env.SWAGGER_ENABLED === 'true';
// Session store: memory (default, local dev) | file (./data/sessions) | redis (OpenShift / multi-pod)
export const SESSION_STORE = process.env.SESSION_STORE || 'memory';
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
// Namespaces every Redis key this application owns. Override via REDIS_KEY_PREFIX only when
// several applications share one Redis instance.
export const REDIS_KEY_PREFIX = process.env.REDIS_KEY_PREFIX || 'student-account-admin';

export const {
  NODE_ENV,
  PORT,
  API_BASE_URL,
  MUNICIPALITY_ID,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  SECRET_KEY,
  CLIENT_KEY,
  CLIENT_SECRET,
  BASE_URL_PREFIX,
  SAML_CALLBACK_URL,
  SAML_LOGOUT_CALLBACK_URL,
  SAML_SUCCESS_REDIRECT,
  SAML_FAILURE_REDIRECT,
  SAML_LOGOUT_REDIRECT,
  SAML_ENTRY_SSO,
  SAML_ISSUER,
  SAML_IDP_PUBLIC_CERT,
  SAML_PRIVATE_KEY,
  SAML_PUBLIC_KEY,
} = process.env;
