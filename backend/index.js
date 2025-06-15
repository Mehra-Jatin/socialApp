import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import { connectDB } from './lib/db.js';

dotenv.config(); 
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


export default app; // Export the app for testing or further configuration