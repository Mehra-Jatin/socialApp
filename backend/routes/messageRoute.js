import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMessages, markMessagesAsRead, sendMessage } from "../controllers/messageController.js";

const router = express.Router();


router.get("/:id", authMiddleware, getMessages);  // the id there is receiver id
router.post("/send/:id", authMiddleware, sendMessage);  // the id there is receiver id
router.put("/mark-read", authMiddleware, markMessagesAsRead);
// The above routes are for getting messages with a specific user and sending messages to a specific user

export default router;