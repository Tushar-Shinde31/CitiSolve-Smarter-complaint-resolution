import Complaint from "../models/Complaint.js";

// @desc Create new complaint
export const createComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.create(req.body);
    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

// @desc Get all complaints
export const getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc Update complaint status (and optional resolution note)
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, resolutionNote } = req.body;

    // Basic validation for status field
    const allowedStatuses = ["Open", "In Progress", "Resolved"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // If status is Resolved, make resolutionNote mandatory
    if (status === "Resolved" && !resolutionNote) {
      return res
        .status(400)
        .json({ message: "Resolution note is required when status is Resolved" });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, resolutionNote },
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(updatedComplaint);
  } catch (error) {
    next(error);
  }
};
