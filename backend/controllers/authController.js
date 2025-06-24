import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const login = async (req, res) => {
    // Handle user login
    const { email, password } = req.body;
    try {
        // Validate input
        if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
        }
    
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
        }
    
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
        }
    
        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
        });
    
         res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite : 'None',
      maxAge: 3600000, // 1 hour
    });
    
        res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

export const register = async (req, res) => {
  // Handle user registration
  const { fullName, email, password } = req.body;
  try {
    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }
    // Save the user to the database
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite : 'None',
      maxAge: 3600000, // 1 hour
    });

    res
      .status(201)
      .json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        bio: newUser.bio,
      });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};


export const checkAuth = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}