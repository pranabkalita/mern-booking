import express from "express";
import { check } from "express-validator";
import multer from "multer";

import { create } from "../controllers/hotelController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  verifyToken, // Token verification middleware
  upload.array("imageFiles", 6), // Multer to handle form-data (uploads first)
  [
    // Validation checks for form-data fields
    check("name").notEmpty().withMessage("Name is required"),
    check("city").notEmpty().withMessage("City is required"),
    check("country").notEmpty().withMessage("Country is required"),
    check("description").notEmpty().withMessage("Description is required"),
    check("type").notEmpty().withMessage("Type is required"),
    check("pricePerNight").notEmpty().isNumeric().withMessage("Price per night is required and must be a number"),
    check("facilities").notEmpty().isArray().withMessage("Facilities are required"),
  ],
  create // Your create controller function
);

export default router;
