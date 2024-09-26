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

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: findConfig('.env.dev') });
}

connectDB();

const app = express();

// Use Helmet to secure HTTP headers
app.use(helmet());

// Disable X-Powered-By header
app.disable('x-powered-by');

// Enable CORS
app.use(cors());

// Parse incoming request bodies
app.use(bodyParser.json());

// Parse cookies to use with CSRF tokens
app.use(cookieParser());

// Enable CSRF protection for state-changing routes (POST, PUT, DELETE)
const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // Prevents JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Only set the secure flag in production
  },
});

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: "sessions",
});

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    saveUninitialized: false,
    resave: false,
    store: store,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  async (req, res) => {
    const { googleId, username, email, firstName, lastName, profilePic } =
      req.user;
    console.log("user", req.user);

    let existingUser = await User.findOne({ googleId: googleId });
    console.log("existingUser", existingUser);

    if (!existingUser) {
      existingUser = new User({
        username: username,
        googleId: googleId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        profilePic: profilePic || User.schema.path("profilePic").defaultValue,
      });
      await existingUser.save();
    }

    const googleAccessToken = req.user.accessToken;

    req.login(existingUser, (err) => {
      if (err) return res.status(500).send(err);

      res.redirect(
        `${process.env.FRONTEND_URL}/login?googleAuthSuccess` +
          `&username=${username}&email=${email}&firstName=${firstName}` +
          `&lastName=${lastName}&profilePic=${profilePic}` +
          `&role=${existingUser.role}&request=${existingUser.request}` +
          `&token=${googleAccessToken}`
      );
    });
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

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`.yellow.bold);
  });
}

export default app;
