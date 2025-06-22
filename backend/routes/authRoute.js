import express from 'express';
import { login, register ,logout, checkAuth } from '../controllers/authController.js';
const router = express.Router();


router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/check',checkAuth);

export default router;