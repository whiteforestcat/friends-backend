import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js"; // need to include auth.js
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/seed.js";

// MIDDLEWARE CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url); // to enable grabbing file URL
const __dirname = path.dirname(__filename); // to enable file directory
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // stores images in this directory

// FILE STORAGE
const storage = multer.diskStorage({
  // when someone uploads file onto website, it will be stored at "public/assets"
  // need these 2 keys ie destination and filename to work
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ROUTES With Files
app.post("/auth/register", upload.single("picture"), register);
// upload.single("picture") is a middleware like auth in GA, refer to upload variable
// register is a controller
// this route is in index.js cos we need the upload function
app.post("/posts", verifyToken, upload.single("picture"), createPost); // access the picture key in the object passed from frontend

// ROTUES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 5050;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // seeding data upon server launch
    // run only once
    // User.insertMany(users)
    // Post.insertMany(posts)
  })
  .catch((error) => console.log(`${error} did not connect`));
