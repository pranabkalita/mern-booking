import express from "express";
import { check } from "express-validator";

import { login, logout, validateToken } from "../controllers/userController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isString(),
  ],
  login
);

router.get("/validate-token", verifyToken, validateToken);
router.get("/logout", verifyToken, logout);

export default router;
