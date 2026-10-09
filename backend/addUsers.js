/**
 * addUsers.js — Creates or updates the 3 role accounts with password "Test@123"
 * Usage: 
 *   Local DB:  node addUsers.js
 *   Cloud DB:  node addUsers.js "your_mongodb_atlas_connection_string"
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const run = async () => {
  const uri = process.argv[2] || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shree_real_estate";
  console.log("Connecting to:", uri.replace(/:([^:@]+)@/, ":****@"));
  
  await mongoose.connect(uri);
  console.log("✓ Connected to MongoDB");

  const hashedPassword = await bcrypt.hash("Test@123", 10);

  const usersToUpsert = [
    {
      email: "admin@example.com",
      role: "admin",
      name: "Admin User",
      phone: "+91 9876543210",
      isVerified: true,
    },
    {
      email: "broker@example.com",
      role: "broker",
      name: "Rajesh Sharma",
      phone: "+91 9820012345",
      isVerified: true,
      companyName: "Shree Realty Partners",
      experience: 8,
      specialization: ["Luxury Apartments", "Villas", "Commercial"],
      serviceAreas: ["Mumbai", "Bandra", "Juhu", "Thane"],
      languages: ["English", "Hindi", "Gujarati"],
      reraId: "A51900012345",
      bio: "Premier real estate consultant in Mumbai with 8+ years of experience helping families find dream homes.",
      officeAddress: "402, Platinum Heights, Linking Road, Bandra West, Mumbai",
      location: "Mumbai",
      rating: 4.9,
      totalReviews: 24,
      totalListings: 12,
      propertiesSold: 45,
    },
    {
      email: "buyer@example.com",
      role: "buyer",
      name: "Pooja Patel",
      phone: "+91 9811122233",
      isVerified: true,
    },
  ];

  for (const u of usersToUpsert) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      existing.password = hashedPassword;
      existing.role = u.role;
      existing.isVerified = true;
      if (u.companyName) existing.companyName = u.companyName;
      if (u.specialization) existing.specialization = u.specialization;
      await existing.save();
      console.log(`✓ Updated existing user [${u.role}]: ${u.email} -> password: Test@123`);
    } else {
      await User.create({
        ...u,
        password: hashedPassword,
      });
      console.log(`✓ Created new user [${u.role}]: ${u.email} -> password: Test@123`);
    }
  }

  console.log("\n==================================================");
  console.log("3 ROLES READY WITH PASSWORD: Test@123");
  console.log("--------------------------------------------------");
  console.log("1. Admin  -> Email: admin@example.com  | Password: Test@123");
  console.log("2. Broker -> Email: broker@example.com | Password: Test@123");
  console.log("3. Buyer  -> Email: buyer@example.com  | Password: Test@123");
  console.log("==================================================\n");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Error adding users:", err);
  process.exit(1);
});
