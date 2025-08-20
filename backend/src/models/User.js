import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Mongoose schema and model for users
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["citizen", "admin"], default: "citizen" },
  },
  { timestamps: true }
);

// hash password if modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare method
UserSchema.methods.matchPassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Export User model
export default mongoose.model("User", UserSchema);
