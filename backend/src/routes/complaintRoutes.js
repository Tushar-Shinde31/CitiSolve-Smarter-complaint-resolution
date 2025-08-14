import express from "express";
import {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} from "../controllers/complaintController.js";
import { protect, requireRole } from "../middleware/auth.js";


const router = express.Router();

router.post("/", createComplaint);
router.get("/", getComplaints);
router.patch("/:id", protect, requireRole("admin"), updateComplaintStatus);

export default router;
