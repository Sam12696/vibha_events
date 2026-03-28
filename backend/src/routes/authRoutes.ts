import { Router } from "express";
import { login, verify, changePassword } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

/** POST /api/auth/login — validate password, receive JWT */
router.post("/login", login);

/** GET /api/auth/verify — check if current token is still valid */
router.get("/verify", requireAdmin, verify);

/** POST /api/auth/change-password — update admin password (requires current password + valid token) */
router.post("/change-password", requireAdmin, changePassword);

export default router;
