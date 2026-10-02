import 'reflect-metadata';
import { existsSync, mkdirSync } from 'fs';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import createFileStore from 'session-file-store';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy, VerifiedCallback } from '@node-saml/passport-saml';
import bodyParser from 'body-parser';
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import {
  NODE_ENV,
  PORT,
  SWAGGER_ENABLED,
  LOG_FORMAT,
  ORIGIN,
  CREDENTIALS,
  SECRET_KEY,
  SAML_CALLBACK_URL,
  SAML_LOGOUT_CALLBACK_URL,
  SAML_FAILURE_REDIRECT,
  SAML_ENTRY_SSO,
  SAML_ISSUER,
  SAML_IDP_PUBLIC_CERT,
  SAML_PRIVATE_KEY,
  SAML_PUBLIC_KEY,
  BASE_URL_PREFIX,
  SESSION_MEMORY,
  SAML_SUCCESS_REDIRECT,
} from '@config';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { Profile } from './interfaces/profile.interface';
import { join } from 'path';
import { getPermissions, getRole } from './services/authorization.service';
import { isValidUrl } from './utils/util';

const SessionStoreCreate = SESSION_MEMORY ? createMemoryStore(session) : createFileStore(session);
const sessionTTL = 4 * 24 * 60 * 60;
// NOTE: memory uses ms while file uses seconds
const sessionStore = new SessionStoreCreate(
  SESSION_MEMORY ? { checkPeriod: sessionTTL * 1000 } : { sessionTTL, path: './data/sessions' },
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user: Express.User, done) {
  done(null, user);
});

const samlStrategy = new Strategy(
  {
    disableRequestedAuthnContext: true,
    identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
    callbackUrl: SAML_CALLBACK_URL,
    entryPoint: SAML_ENTRY_SSO,
    //decryptionPvk: SAML_PRIVATE_KEY,
    privateKey: SAML_PRIVATE_KEY,
    // Identity Provider's public key
    idpCert: SAML_IDP_PUBLIC_CERT,
    issuer: SAML_ISSUER,
    wantAssertionsSigned: false,
    // signatureAlgorithm: 'sha256',
    // digestAlgorithm: 'sha256',
    // maxAssertionAgeMs: 2592000000,
    // authnRequestBinding: 'HTTP-POST',
    logoutCallbackUrl: SAML_LOGOUT_CALLBACK_URL,
    acceptedClockSkewMs: -1,
    wantAuthnResponseSigned: false,
    audience: false,
  },
  async function (profile: Profile, done: VerifiedCallback) {
    if (!profile) {
      return done({
        name: 'SAML_MISSING_PROFILE',
        message: 'Missing SAML profile',
      });
    }

    // Depending on using Onegate or ADFS for federation the profile data looks a bit different
    // Here we use the null coalescing operator (??) to handle both cases.
    // (A switch from Onegate to ADFS was done on august 6 2023 due to problems in MobilityGuard.)
    //
    // const { givenName, sn, email, groups } = profile;
    const givenName =
      profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] ?? profile['givenname'];
    const surname = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] ?? profile['surname'];
    const groups = profile['http://schemas.xmlsoap.org/claims/Group']?.join(',') ?? profile['groups'];
    const username = profile['uid'];

    if (!givenName || !surname || !groups || !username) {
      logger.error(
        'Could not extract necessary profile data fields from the IDP profile. Does the Profile interface match the IDP profile response? The profile response may differ, for example Onegate vs ADFS.',
      );
      return done(null, null, {
        name: 'SAML_MISSING_ATTRIBUTES',
        message: 'Missing profile attributes',
      });
    }

    const groupList: string[] = groups?.split(',')?.map(x => x.toLowerCase()) ?? [];

    const appGroups: string[] = groupList.length > 0 ? groupList : [];

    try {
      const findUser = {
        name: `${givenName} ${surname}`,
        givenName: givenName,
        surname: surname,
        username: username,
        groups: appGroups,
        role: getRole(appGroups),
        permissions: getPermissions(appGroups),
      };

      done(null, findUser);
    } catch (err) {
      done(err);
    }
  },
  async function (profile: Profile, done: VerifiedCallback) {
    return done(null, {});
  },
);

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public swaggerEnabled: boolean;

  constructor(Controllers: NewableFunction[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.swaggerEnabled = SWAGGER_ENABLED || false;

    this.initializeDataFolders();

    this.initializeMiddlewares();
    this.initializeRoutes(Controllers);
    if (this.swaggerEnabled) {
      this.initializeSwagger(Controllers);
    }
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // Throttle the SAML endpoints (they trigger outbound IdP traffic and session writes).
    // `trust proxy` makes the limiter key on the real client IP behind the reverse proxy.
    const samlLimiter = rateLimit({
      windowMs: 60 * 1000,
      limit: 100,
    });
    this.app.set('trust proxy', 1);

    this.app.use(
      session({
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
      }),
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    passport.use('saml', samlStrategy);

    // Express 5 exposes `req.query` as a read-only getter, so the RelayState can no longer be
    // injected by mutating the query. It is passed to passport-saml through `additionalParams`.
    this.app.get(`${BASE_URL_PREFIX}/saml/login`, samlLimiter, (req, res, next) => {
      const successRedirect =
        (req.session.returnTo as string | undefined) || (req.query.successRedirect as string | undefined);
      const failureRedirect = req.query.failureRedirect as string | undefined;
      const relayState = [successRedirect, failureRedirect].filter(Boolean).join(',');

      passport.authenticate('saml', {
        failureRedirect: SAML_FAILURE_REDIRECT,
        ...(relayState ? { additionalParams: { RelayState: relayState } } : {}),
      })(req, res, next);
    });

    this.app.get(`${BASE_URL_PREFIX}/saml/metadata`, (req, res) => {
      res.type('application/xml');
      const metadata = samlStrategy.generateServiceProviderMetadata(SAML_PUBLIC_KEY, SAML_PUBLIC_KEY);
      res.status(200).send(metadata);
    });

    this.app.get(`${BASE_URL_PREFIX}/saml/logout`, samlLimiter, (req, res, next) => {
      const successRedirect =
        (req.session.returnTo as string | undefined) || (req.query.successRedirect as string | undefined);
      const redirectTo = isValidUrl(successRedirect) ? successRedirect : SAML_SUCCESS_REDIRECT;
      samlStrategy.logout(req as unknown as Parameters<typeof samlStrategy.logout>[0], () => {
        req.logout(err => {
          if (err) {
            return next(err);
          }
          res.redirect(redirectTo);
        });
      });
    });

    this.app.get(
      `${BASE_URL_PREFIX}/saml/logout/callback`,
      samlLimiter,
      bodyParser.urlencoded({ extended: false }),
      (req, res, next) => {
        req.logout(err => {
          if (err) {
            return next(err);
          }

          const relayState = (req.query?.RelayState ?? req.body?.RelayState) as string | undefined;
          const [successUrl, failureUrl] = String(relayState ?? '').split(',');
          const successRedirect = isValidUrl(successUrl) ? successUrl : SAML_SUCCESS_REDIRECT;
          const failMessage = req.session?.messages?.[0];

          if (failMessage) {
            const failureRedirect = new URL(isValidUrl(failureUrl) ? failureUrl : successRedirect);
            failureRedirect.searchParams.set('failMessage', failMessage);
            return res.redirect(failureRedirect.toString());
          }
          res.redirect(successRedirect);
        });
      },
    );

    this.app.post(
      `${BASE_URL_PREFIX}/saml/login/callback`,
      samlLimiter,
      bodyParser.urlencoded({ extended: false }),
      (req, res, next) => {
        const [successUrl, failureUrl] = String(req.body?.RelayState ?? '').split(',');
        const successRedirect = isValidUrl(successUrl) ? successUrl : SAML_SUCCESS_REDIRECT;
        const failureRedirect = new URL(isValidUrl(failureUrl) ? failureUrl : successRedirect);

        const redirectToFailure = (failMessage: string) => {
          failureRedirect.searchParams.set('failMessage', failMessage);
          res.redirect(failureRedirect.toString());
        };

        passport.authenticate(
          'saml',
          (err: Error | null, user: Express.User | false | null, info?: { name?: string; message?: string }) => {
            if (err) {
              logger.error(`SAML callback error :: name=${err?.name} :: message=${err?.message}`);
              return redirectToFailure(err?.name || 'SAML_UNKNOWN_ERROR');
            }

            if (!user) {
              logger.error(`SAML callback failed :: name=${info?.name} :: message=${info?.message}`);
              return redirectToFailure(info?.name || 'NO_USER');
            }

            req.login(user, loginErr => {
              if (loginErr) {
                logger.error(`SAML req.login error :: ${loginErr?.message ?? loginErr}`);
                return redirectToFailure('SAML_UNKNOWN_ERROR');
              }
              return res.redirect(successRedirect);
            });
          },
        )(req, res, next);
      },
    );
  }

  private initializeRoutes(controllers: NewableFunction[]) {
    useExpressServer(this.app, {
      routePrefix: BASE_URL_PREFIX,
      cors: {
        origin: ORIGIN,
        credentials: CREDENTIALS,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      },
      controllers: controllers,
      defaultErrorHandler: false,
    });
  }

  private initializeSwagger(controllers: NewableFunction[]) {
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    });

    const routingControllersOptions = {
      controllers: controllers,
    };

    type OpenApiComponents = NonNullable<Parameters<typeof routingControllersToSpec>[2]>['components'];
    type SchemasMap = NonNullable<NonNullable<OpenApiComponents>['schemas']>;

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas: schemas as unknown as SchemasMap,
        securitySchemes: {
          basicAuth: {
            scheme: 'basic',
            type: 'http',
          },
        },
      },
      info: {
        description: 'Kontohantering',
        title: 'API',
        version: '1.0.0',
      },
    });

    this.app.use(`${BASE_URL_PREFIX}/api-docs`, swaggerUi.serve, swaggerUi.setup(spec));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeDataFolders() {
    const databaseDir: string = join(__dirname, '../data/database');
    if (!existsSync(databaseDir)) {
      mkdirSync(databaseDir, { recursive: true });
    }
    const logsDir: string = join(__dirname, '../data/logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }
    const sessionsDir: string = join(__dirname, '../data/sessions');
    if (!existsSync(sessionsDir)) {
      mkdirSync(sessionsDir, { recursive: true });
    }
  }
}

export default App;
