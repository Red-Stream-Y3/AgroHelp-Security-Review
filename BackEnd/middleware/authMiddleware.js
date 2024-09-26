import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token; // Token from cookies
  console.log(token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
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
