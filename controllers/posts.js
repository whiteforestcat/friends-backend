import Post from "../models/Post.js";
import User from "../models/User.js";

// Create
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find(); // find all posts by user? not use the second one?
    // const post = await Post.find({ userId }); // find all posts by user

    res.status(201).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Read
export const getFeedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }); // find all posts by user
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId); // checks if userId is in Map meaning if user likes the post
    // remember that post.likes is a Map data type in schema
    // xxx.get is one of Map functions

    if (isLiked) {
      // when clicking the button, if like exist will remove the like
      post.likes.delete(userId); // removes the userId in likes Map data type
    } else {
      // when button is clicked, if user is not liking the post, he will like it
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes }, // updated likes list
      { new: true } // creates  new object, why need this?
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
