import jwt from 'jsonwebtoken';

export const authMiddleware =async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Unauthorized, invalid token" });
        }
        req.user = decoded.userId; // Attach user ID to the request object for later use
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Unauthorized, invalid token" });
    }
}

