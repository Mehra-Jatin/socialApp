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
        default:"https://res.cloudinary.com/dmofi4ph7/image/upload/v1750597812/avatar_inbkej.png"
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