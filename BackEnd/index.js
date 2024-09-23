import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import colors from "colors";
import findConfig from "find-config";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import {
  visitMiddleware,
  incrementCountMiddleware,
} from "./middleware/visitMiddleware.js";
import visitRoutes from "./routes/visitRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";

import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import User from "./models/userModel.js";
import "./passport-setup.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: findConfig(".env.dev") });
}

connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());

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

app.use(visitMiddleware);
app.use(incrementCountMiddleware);

app.use("/api/visits", visitRoutes);
app.use("/api/users", userRoutes);
app.use("/api/forums", forumRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/diseases", diseaseRoutes);

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

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/FrontEnd/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "FrontEnd", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`.yellow.bold);
  });
}

export default app;
