import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "./models/userModel.js";
import dotenv from "dotenv";
import findConfig from "find-config";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: findConfig(".env.dev") });
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (profile, done) => {
      User.findOne({ googleId: profile.googleId }).then((existingUser) => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          new User({ googleId: profile.googleId }).save().then((newUser) => {
            done(null, newUser);
          });
        }
      });
    }
  )
);
