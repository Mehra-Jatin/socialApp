import cloudinary from "../lib/cloudinary.js";
import { getReciverSocketId ,io } from "../lib/socket.js";
import Message from "../models/messageModel.js";

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
  const { id: receiverId } = req.params;
  const senderId = req.user;
  const { text, image } = req.body;

  let imageUrl;
  if (image) {
    const upload = await cloudinary.uploader.upload(image);
    imageUrl = upload.secure_url;
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
      status: "sent", // 👈 Set status
    });

    const receiverSocketId = getReciverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  const { messageIds } = req.body;
  const userId = req.user;

  try {
    // Update messages
    await Message.updateMany(
      { _id: { $in: messageIds }, receiverId: userId },
      { $set: { status: "read" } }
    );

    // Notify the sender(s) in real time
    const updatedMessages = await Message.find({ _id: { $in: messageIds } });

    updatedMessages.forEach((msg) => {
      const senderSocketId = getReciverSocketId(msg.senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageRead", {
          messageIds: [msg._id],
          status: "read",
        });
      }
    });

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

