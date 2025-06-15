import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js'; 
import messageRoute from './routes/messageRoute.js';

dotenv.config();  // Load environment variables from .env file
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use('/api/auth', authRoute);
app.use('/api/user',userRoute); 
app.use('/api/message',messageRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


export default app; // Export the app for testing or further configuration