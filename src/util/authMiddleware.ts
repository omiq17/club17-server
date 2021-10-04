import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IJwtPayload {
  userId: string;
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "No token found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY) as IJwtPayload;
    req.userId = decoded.userId;
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
  return next();
};

export default verifyToken;