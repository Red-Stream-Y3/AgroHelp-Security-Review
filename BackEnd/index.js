import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import colors from 'colors';
import findConfig from 'find-config';
import rateLimit from 'express-rate-limit';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import {
  visitMiddleware,
  incrementCountMiddleware,
} from './middleware/visitMiddleware.js';
import visitRoutes from './routes/visitRoutes.js';
import userRoutes from './routes/userRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';

import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import User from './models/userModel.js';
import './passport-setup.js';
import https from 'https';
import fs from 'fs';
import logger from './controllers/logger.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: findConfig('.env.dev') });
}

connectDB();
const __dirname = path.resolve();

const app = express();

// Use Helmet to secure HTTP headers
app.use(helmet());

// Disable X-Powered-By header
app.disable('x-powered-by');

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Parse cookies to use with CSRF tokens
app.use(cookieParser());

// Parse incoming request bodies
app.use(bodyParser.json());

// Enable CSRF protection for state-changing routes (POST, PUT, DELETE)
const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // Prevents JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Only set the secure flag in production
  },
});

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'sessions',
});

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    saveUninitialized: false,
    resave: false,
    store: store,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  async (req, res) => {
    const { googleId, username, email, firstName, lastName, profilePic } =
      req.user;

    let existingUser = await User.findOne({ googleId: googleId });

    if (!existingUser) {
      existingUser = new User({
        username: username,
        googleId: googleId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        profilePic: profilePic || User.schema.path('profilePic').defaultValue,
      });
      await existingUser.save();
    }

    const googleAccessToken = req.user.accessToken;

    res.cookie('token', googleAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      maxAge: 3600000, // 1 hour expiration
      sameSite: 'Lax',
    });

    res.redirect(`${process.env.FRONTEND_URL}/home`);
  }
);

// Use middleware to increment visitor count
app.use(visitMiddleware);
app.use(incrementCountMiddleware);

app.use('/api/visits', visitRoutes);
// app.use('/api/users', csrfProtection, userRoutes); // Apply CSRF protection to user routes when in production
app.use('/api/users', userRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/diseases', diseaseRoutes);

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter); // Apply the rate limiter middleware globally

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/FrontEnd/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'FrontEnd', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Use error handlers
app.use(notFound);
app.use(errorHandler);

let PORT = process.env.PORT || 5000;
let HTTPS_PORT = process.env.HTTPS_PORT || 5001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`HTTP Server is Listening on port: ${PORT}`.yellow.bold);
  });

  https
    .createServer(
      {
        key:
          process.env.SSL_PRIVATE_KEY ||
          fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
        cert:
          process.env.SSL_CERTIFICATE ||
          fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert')),
      },
      app
    )
    .listen(HTTPS_PORT, () => {
      logger.info(`AGROHELP SERVER STARTED!`.yellow.bold);
      logger.info(
        `HTTPS Server is listening on port: ${HTTPS_PORT}`.yellow.bold
      );
    });
}

export default app;
