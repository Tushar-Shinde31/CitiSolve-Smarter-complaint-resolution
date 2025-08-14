import Complaint from "../models/Complaint.js";

// @desc Create new complaint
export const createComplaint = async (req, res, next) => {
  try {
    const complaintData = { ...req.body, user: req.user.id };
    const complaint = await Complaint.create(complaintData);
    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

// @desc Get all complaints
// GET /api/complaints
export const getComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.role === "admin") {
      // Admin sees all complaints
      complaints = await Complaint.find()
        .populate({ path: "user", select: "name email" });
    } else {
      // Citizen sees only their complaints
      complaints = await Complaint.find({ user: req.user.id })
        .populate({ path: "user", select: "name email" });
    }

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints", error });
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
