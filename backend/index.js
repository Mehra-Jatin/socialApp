import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import cors from 'cors';

import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js'; 
import messageRoute from './routes/messageRoute.js';

import { server,app } from './lib/socket.js'; 

dotenv.config();  // Load environment variables from .env file

const PORT = process.env.PORT || 5000;

app.use(express.json({limit:'10mb'})); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors(
  {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow requests from the client URL
    credentials: true, // Allow cookies to be sent with requests
  }
))

app.use('/api/auth', authRoute);
app.use('/api/user',userRoute); 
app.use('/api/message',messageRoute);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


export default app; // Export the app for testing or further configuration