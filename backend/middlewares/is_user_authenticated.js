import { decode } from 'punycode';
import jwt from 'jsonwebtoken';

export const isUserAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(400).json({errorMessage: "Unauthorized"});
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.status(400).json({errorMessage: "Unauthorized"});
        req.id=verified.id;
        next();
    } catch (error) {
        console.error(error);
    }
};