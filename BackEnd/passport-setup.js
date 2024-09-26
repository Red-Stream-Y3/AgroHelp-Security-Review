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
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          existingUser.accessToken = accessToken;
          done(null, existingUser);
        } else {
          const newUser = new User({
            username: profile.name.givenName + profile.name.familyName,
            googleId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePic: profile._json.picture,
          });

          newUser.save().then((user) => {
            user.accessToken = accessToken;
            done(null, user);
          });
        }
      });
    }
  )
);
