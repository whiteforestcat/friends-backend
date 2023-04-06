import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // need to include User.js

// Register User
export const register = async (req, res) => {
  try {
    const {
      firtstName,
      lastName,
      email,
      password,
      picturePath,
      freinds,
      location,
      occupation,
    } = req.body;

    // encrypting password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firtstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      freinds,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000), // dummy value
      impressions: Math.floor(Math.random() * 1000), // dummy value
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // sending data to frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
