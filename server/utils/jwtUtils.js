import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (user) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
