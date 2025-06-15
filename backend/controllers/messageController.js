import cloudinary from "../lib/cloudinary";
import Message from "../models/messageModel";

export const getMessages = async (req, res) => {
  const { id: receiverId } = req.params; // Extract receiverId from request parameters
  const senderId = req.user; // Get senderId from authenticated user

  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by creation time in ascending order

    res.status(200).json(messages); // Return the messages as JSON response
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  const { id: receiverId } = req.params; // Extract receiverId from request parameters
  const senderId = req.user; // Get senderId from authenticated user
  const { text, image } = req.body; // Get message content from request body

  let imageUrl;
  if (image) {
    const upload = await cloudinary.uploader.upload(image);
    imageUrl = upload.secure_url; // Get the secure URL of the uploaded image
    if (!imageUrl) {
      return res.status(400).json({ message: "Image upload failed" });
    }
  }

  try {
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    res.status(201).json(newMessage); // Return the newly created message as JSON response
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


