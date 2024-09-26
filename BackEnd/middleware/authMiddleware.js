import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import axios from 'axios';

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token; // Token from cookies

  if (token) {
    try {
      let decoded;

      if (token.startsWith('ya29.')) {
        // Token from Google OAuth, validate using Google Token Info endpoint
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
        );

        if (response.data.audience !== process.env.GOOGLE_CLIENT_ID) {
          throw new Error('Invalid token audience');
        }

        // Find user by Google ID (sub)
        req.user = await User.findOne({ googleId: response.data.user_id }).select('-password');
      } else {
        // JWT Token, verify with your JWT secret
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});


const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

const adminMod = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'admin' || req.user.role === 'moderator')
  ) {
    next();
  } else {
    res.status(401);
    throw new Error(`Not authorized as an admin or moderator`);
  }
};

const adminContributor = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'admin' ||
      req.user.role === 'contributor')
  ) {
    next();
  } else {
    res.status(401);
    throw new Error(`Not authorized as an admin or contributor`);
  }
};


export { protect, admin, adminMod, adminContributor };
