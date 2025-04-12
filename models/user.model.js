import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name : { 
    type : String, 
    required : [true, 'Name is required!'],
    trim: true,
    minLength: 1,
    maxLength: 50, 
  },

  email : {
    type: String,
    required: [true, 'Email is required!'],
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 5,
    maxLength: 255,
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
  },

  password : {
    type: String,
    required: [true, 'Password is required!'],
    minLength: 6,
    maxLength: 255,
  },

  isAdmin : {
    type: Boolean,
    enum : [true, false],
    required : [true],
    default : false
  }

}, { timestamps : true });

const User = mongoose.model('User', userSchema);

export default User;

// { name: 'John Doe', email : 'email@email.com', password : 'password' }