import User from "../models/User.js";

// Read data
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user); // sending user data to frontend
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id)) // look at userSchema where User.friends is an array
    );
    const formatFriends = friends.map(
      // try removing this... any diff?
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        };
      }
    );
    console.log(friends);
    console.log(formatFriends);
    res.status(200).json(formatFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update, add/ remove friends
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    // Both these 2 lines are searching for users
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      // checks if friendId is in friends array of user
      user.friends = user.friends.filter((id) => id !== friendId);
      // note that user.friends array is an array of { _id, firstName, lastName, occupation, location, picturePath }
      // why no need to be friend._id?
      // altering friends array to only return friendIds other than input id
      // basically removing friend
      friend.friends = friend.friends.filter((id) => id !== id);
      // here id (left) is id of friend since filtering friends.friends and id(right) is user id (from destructuring)
      // removing user id from user's friends array
    } else {
      // if not currrently friends, will then add each other as friends
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    // formatting friends
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id)) // look at userSchema where User.friends is an array
    );
    const formatFriends = friends.map(
      // try removing this... any diff?
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        };
      }
    );

    res.status(200).json(formatFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
