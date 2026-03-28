import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

const ENV_FILE = path.resolve(process.cwd(), ".env");

/**
 * POST /api/auth/login
 * Validates admin password and returns a signed JWT.
 */
export async function login(req: Request, res: Response) {
  const { password } = req.body;

  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password is required" });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.JWT_SECRET;

  if (!hash || !secret) {
    console.error("ADMIN_PASSWORD_HASH or JWT_SECRET is not set in environment");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return res.status(401).json({ success: false, error: "Invalid password" });
  }

  const token = jwt.sign({ role: "admin" }, secret, { expiresIn: "7d" });
  return res.json({ success: true, token });
}

/**
 * GET /api/auth/verify
 * Confirms the caller's token is valid (auth middleware runs first).
 */
export function verify(_req: Request, res: Response) {
  res.json({ valid: true });
}

/**
 * POST /api/auth/change-password  (admin only)
 * Verifies current password, hashes the new one, updates .env.
 */
export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "currentPassword and newPassword are required" });
  }

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const valid = await bcrypt.compare(currentPassword, hash);
  if (!valid) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  const newHash = await bcrypt.hash(newPassword, 12);

  // Update .env file on disk
  try {
    const content = await fs.readFile(ENV_FILE, "utf-8");
    const updated = content.replace(
      /^ADMIN_PASSWORD_HASH=.*/m,
      `ADMIN_PASSWORD_HASH="${newHash}"`
    );
    await fs.writeFile(ENV_FILE, updated, "utf-8");
  } catch {
    return res.status(500).json({ error: "Failed to update .env file" });
  }

  // Update in-memory env so it takes effect without restart
  process.env.ADMIN_PASSWORD_HASH = newHash;

  return res.json({ success: true, message: "Password updated successfully" });
}
