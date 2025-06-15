import express from 'express';

import { getAllUsers, getUserProfile ,updateImage } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/all', getAllUsers);
router.get('/profile', authMiddleware,getUserProfile);
router.post('/update-image', authMiddleware, updateImage);
export default router;
