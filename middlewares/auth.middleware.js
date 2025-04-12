import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authorizeAdmin = async (req, res, next) => {
  try {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // This basically reverses our jwt.sign that we did on sign up. The token is used to get the users ID.
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify if user is admin
    const isAdmin = decoded.isAdmin;

    if (!isAdmin) {
      return res.status(401).json({ message : 'Unauthorized '});
    }

    next();

  }

  catch (error) {
    res.status(401).json({
      message: 'Unauthorized',
      error: error.message
    })
  }
}

const authorize = async (req, res, next) => {
  try {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // This basically reverses our jwt.sign that we did on sign up. The token is used to get the users ID.
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({
      message: 'Unauthorized',
      error: error.message
    })
  }
}

export { authorize, authorizeAdmin };