import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {

  console.log(await req);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists!");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });
    const token = jwt.sign({ userId : newUsers[0]._id}, JWT_SECRET, { expiresIn : JWT_EXPIRES_IN })

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: newUsers[0]
      }
    })

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }

}

export const signIn = async (req, res, next) => {
  try {
    // Get email and password
    // Try see if email exists in database, if doesnt, throw an error
    // If exists, hash password and make sure both match
    // If matches, authenticate

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("User does not exist!");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid Password!");
      error.statusCode = 401;
      throw error;      
    }

    const token = jwt.sign({ userId : existingUser._id }, JWT_SECRET, { expiresIn : JWT_EXPIRES_IN});
    
    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user: existingUser
      }
    })

  } catch (error) {
    next(error); 
  }
}

export const signOut = async (req, res, next) => {

}