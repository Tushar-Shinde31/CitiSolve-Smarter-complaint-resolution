import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

const ComplaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      default: () => nanoid(),
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    ward: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    photoUrl: { type: String },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    resolutionNote: { type: String },
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

export default mongoose.model("Complaint", ComplaintSchema);
