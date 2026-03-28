import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Middleware that protects routes requiring admin authentication.
 * Expects: Authorization: Bearer <token>
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: missing token" });
  }

  const token = auth.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not set in environment");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized: invalid or expired token" });
  }
}
