import express from "express";
import multer from "multer";
import path from "path";
import {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} from "../controllers/complaintController.js";
import { protect, requireRole } from "../middleware/auth.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const router = express.Router();

router.post("/", protect, requireRole("citizen"), upload.single('photo'), createComplaint);
router.get("/", protect, getComplaints);
router.patch("/:id/status", protect, requireRole("admin"), updateComplaintStatus);

export default router;
