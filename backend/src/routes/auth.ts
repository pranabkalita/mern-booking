import express from "express";
import { check } from "express-validator";

import { login } from "../controllers/userController";

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isString(),
  ],
  login
);

export default router;
