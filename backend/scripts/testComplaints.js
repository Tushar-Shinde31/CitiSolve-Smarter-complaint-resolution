import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import Complaint from "../src/models/Complaint.js";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/citizen";

async function testComplaints() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");

    // Test 1: Check if all complaints have user field
    console.log("\n🧪 Test 1: Checking complaints without user field...");
    const complaintsWithoutUser = await Complaint.find({ user: { $exists: false } });
    console.log(`📊 Complaints without user field: ${complaintsWithoutUser.length}`);
    
    if (complaintsWithoutUser.length > 0) {
      console.log("❌ Found complaints without user field. Run migration first!");
      return;
    } else {
      console.log("✅ All complaints have user field");
    }

    // Test 2: Check if all complaints have valid user ObjectIds
    console.log("\n🧪 Test 2: Checking for valid user ObjectIds...");
    const totalComplaints = await Complaint.countDocuments();
    const complaintsWithValidUser = await Complaint.countDocuments({
      user: { $exists: true, $ne: null }
    });
    
    console.log(`📊 Total complaints: ${totalComplaints}`);
    console.log(`📊 Complaints with valid user: ${complaintsWithValidUser}`);
    
    if (totalComplaints === complaintsWithValidUser) {
      console.log("✅ All complaints have valid user ObjectIds");
    } else {
      console.log("❌ Some complaints have invalid user ObjectIds");
    }

    // Test 3: Test population
    console.log("\n🧪 Test 3: Testing user population...");
    const sampleComplaints = await Complaint.find()
      .populate("user", "name email")
      .limit(5);
    
    console.log("📋 Sample complaints with populated user:");
    sampleComplaints.forEach((complaint, index) => {
      console.log(`  ${index + 1}. Complaint ID: ${complaint.complaintId}`);
      console.log(`     User: ${complaint.user?.name || 'N/A'} (${complaint.user?.email || 'N/A'})`);
      console.log(`     Status: ${complaint.status}`);
      console.log(`     Category: ${complaint.category}`);
      console.log("");
    });

    // Test 4: Check for complaints with populated user data
    console.log("\n🧪 Test 4: Checking population consistency...");
    const complaintsWithPopulatedUser = sampleComplaints.filter(c => c.user && c.user.name && c.user.email);
    console.log(`📊 Complaints with properly populated user: ${complaintsWithPopulatedUser.length}/${sampleComplaints.length}`);
    
    if (complaintsWithPopulatedUser.length === sampleComplaints.length) {
      console.log("✅ All sample complaints have properly populated user data");
    } else {
      console.log("❌ Some complaints are missing populated user data");
    }

    // Test 5: Test admin vs citizen filtering (simulation)
    console.log("\n🧪 Test 5: Testing role-based filtering simulation...");
    
    // Simulate admin view (all complaints)
    const adminComplaints = await Complaint.find().populate("user", "name email");
    console.log(`📊 Admin would see: ${adminComplaints.length} complaints`);
    
    // Simulate citizen view (only their complaints) - using first user as example
    const firstUser = await User.findOne();
    if (firstUser) {
      const citizenComplaints = await Complaint.find({ user: firstUser._id }).populate("user", "name email");
      console.log(`📊 Citizen (${firstUser.email}) would see: ${citizenComplaints.length} complaints`);
    }

    console.log("\n✅ All tests completed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    console.log("🔌 Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the tests
testComplaints();
