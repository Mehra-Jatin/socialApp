import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://i.sstatic.net/l60Hf.png', // Default profile picture URL
    },
    bio: {
        type: String,
        default: 'Hello, I am using this app!', // Default bio
    },
    }, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    });

const User = mongoose.model('User', userSchema);
export default User;