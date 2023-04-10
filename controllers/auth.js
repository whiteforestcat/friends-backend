import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // need to include User.js

// Register User
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // encrypting password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
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

// LOG IN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); // lookgin for exsisting req.body.email
    if (!user) {
      return res.status(400).json({ message: "User does not exsit" });
    }
    // checking password
    const isMatch = await bcrypt.compare(password, user.password); // comparing req.body.password and user password in DB
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // first argument is payload
    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
