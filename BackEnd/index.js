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
import cookieSession from "cookie-session";
import "./passport-setup.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: findConfig(".env.dev") });
}

connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    keys: [process.env.COOKIE_KEY],
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
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const { id, emails, name, picture } = req.user;

    let existingUser = await User.findOne({ googleId: id });

    if (!existingUser) {
      existingUser = new User({
        googleId: id,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        profilePic: picture || User.schema.path("profilePic").defaultValue,
      });
      await existingUser.save();
    }

    req.login(existingUser, (err) => {
      if (err) return res.status(500).send(err);
      return res.redirect("/home");
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
