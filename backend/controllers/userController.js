import User from '../models/userModel.js';
import cloudinary from '../lib/cloudinary.js'; // Assuming you have a cloudinary config file
import Message from '../models/messageModel.js';
export const updateImage = async (req, res) => {
    const userId = req.user; // Get user ID from the request object set by authMiddleware
    const { profilePicture } = req.body; // Assuming the new image URL is sent in the request body

    try {
        // Validate input
        if (!profilePicture) {
            return res.status(400).json({ message: "Profile picture URL is required" });
        }

        const uploadedImageUrl = await cloudinary.uploader.upload(profilePicture);


        // Update user profile picture in the database
        const updatedUser = await User.findByIdAndUpdate(
             userId,
            { profilePicture: uploadedImageUrl.secure_url }, // Update profile picture with the new URL
            { new: true } // Return the updated document
        ).select('-password'); // Exclude password from the response

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateBio = async (req, res) => {
    // Handle updating user bio
}


export const getUserProfile = async (req, res) => {
     const userId = req.user; // Get user ID from the request object set by authMiddleware
    try {
        // Fetch user profile from the database
        const user = await User.findById(userId).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user;

    // Step 1: Get all other users
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    // Step 2: Attach latest message to each user
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
        })
          .sort({ createdAt: -1 })
          .lean();

        return {
          ...user.toObject(),
          lastMessage: lastMessage?.text || null,
          lastMessageTime: lastMessage?.createdAt || null,
        };
      })
    );

    // Step 3: Sort users by lastMessageTime (descending)
    usersWithLastMessage.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.error("Error fetching users with last message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



