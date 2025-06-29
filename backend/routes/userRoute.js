import express from 'express';

import { getAllUsers, getUserProfile ,updateImage } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/all', authMiddleware, getAllUsers);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/update-image', authMiddleware, updateImage);
export default router;
