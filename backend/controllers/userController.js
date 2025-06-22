import User from '../models/userModel.js';
import cloudinary from '../lib/cloudinary.js'; // Assuming you have a cloudinary config file

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
        const loggedInUserId = req.user; // Get logged-in user ID from the request object set by authMiddleware
        const users = await User.find({_id: {$ne: loggedInUserId}}).select('-password'); // Exclude password from the response
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



