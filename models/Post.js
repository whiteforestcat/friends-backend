import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: { type: String },
    description: { type: String },
    picturePath: { type: String },
    userPicturePath: { type: String },
    likes: { type: Map, of: Boolean }, // it is better to use Map than array to store likes, "of" is referring to the data type of elements
    comments: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema); // storing in Post collection

export default Post;
