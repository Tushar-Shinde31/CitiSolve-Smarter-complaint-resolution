import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import Complaint from "../src/models/Complaint.js";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/citizen";

async function migrateComplaints() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");

    // Find complaints missing user field
    console.log("🔍 Finding complaints without user field...");
    const complaintsWithoutUser = await Complaint.find({ user: { $exists: false } });
    console.log(`📊 Found ${complaintsWithoutUser.length} complaints without user field`);

    if (complaintsWithoutUser.length === 0) {
      console.log("✅ All complaints already have user field. No migration needed.");
      return;
    }

    // Find an admin user to assign complaints to
    console.log("👤 Looking for admin user...");
    let adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      console.log("⚠️  No admin user found. Creating a default admin user...");
      adminUser = await User.create({
        name: "Default Admin",
        email: "admin@citizen.com",
        password: "admin123456",
        role: "admin"
      });
      console.log("✅ Created default admin user:", adminUser.email);
    } else {
      console.log("✅ Found admin user:", adminUser.email);
    }

    // Update complaints to assign them to the admin user
    console.log("🔄 Updating complaints...");
    const updateResult = await Complaint.updateMany(
      { user: { $exists: false } },
      { user: adminUser._id }
    );

    console.log(`✅ Successfully updated ${updateResult.modifiedCount} complaints`);

    // Verify the migration
    console.log("🔍 Verifying migration...");
    const remainingComplaintsWithoutUser = await Complaint.find({ user: { $exists: false } });
    
    if (remainingComplaintsWithoutUser.length === 0) {
      console.log("✅ Migration completed successfully! All complaints now have user field.");
    } else {
      console.log(`⚠️  Warning: ${remainingComplaintsWithoutUser.length} complaints still missing user field`);
    }

    // Test population
    console.log("🧪 Testing population...");
    const testComplaints = await Complaint.find().populate("user", "name email").limit(3);
    console.log("📋 Sample complaints with populated user:");
    testComplaints.forEach((complaint, index) => {
      console.log(`  ${index + 1}. Complaint ID: ${complaint.complaintId}`);
      console.log(`     User: ${complaint.user?.name} (${complaint.user?.email})`);
      console.log(`     Status: ${complaint.status}`);
      console.log("");
    });

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    console.log("🔌 Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the migration
migrateComplaints();
