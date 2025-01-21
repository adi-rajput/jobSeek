import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Restrict guest users from certain actions
        if (req.user && req.user.id) {
            if (req.user.id) {
                return res.status(403).json({ message: "Guests cannot perform this action." });
            }
        }

        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

export default authMiddleware;
