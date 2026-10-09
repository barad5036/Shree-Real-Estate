/**
 * seed.js — Seeds the database with demo users and properties
 * Usage: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Property = require("./models/Property");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shree_real_estate";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB:", mongoUri);

    const existingUsers = await User.countDocuments();
    if (existingUsers > 0 && !process.argv.includes("--force")) {
      console.log(`Database already has ${existingUsers} users. Pass --force to re-seed.`);
      await mongoose.disconnect();
      return;
    }

    if (process.argv.includes("--force")) {
      console.log("Clearing existing data...");
      await User.deleteMany({});
      await Property.deleteMany({});
    }

    console.log("Creating seed users...");

    // Password hashing is handled by pre-save hook in User model
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "Test@123",
      role: "admin",
      phone: "+91 9876543210",
      isVerified: true,
    });

    const brokerUser = await User.create({
      name: "Rajesh Sharma",
      email: "broker@example.com",
      password: "Test@123",
      role: "broker",
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
    });

    const buyerUser = await User.create({
      name: "Pooja Patel",
      email: "buyer@example.com",
      password: "Test@123",
      role: "buyer",
      phone: "+91 9811122233",
      isVerified: true,
    });

    console.log("✓ Created 3 users:");
    console.log("  - Admin:  admin@example.com / Test@123");
    console.log("  - Broker: broker@example.com / Test@123");
    console.log("  - Buyer:  buyer@example.com / Test@123");

    console.log("Creating sample properties...");

    const properties = [
      {
        title: "Sea-Facing Luxury 3 BHK Penthouse in Bandra West",
        description: "Experience ultra-luxury living with panoramic Arabian sea views, Italian marble flooring, smart home automation, private elevator access, and clubhouse amenities.",
        price: 85000000,
        propertyType: "Apartment",
        listingType: "sale",
        bedrooms: 3,
        bathrooms: 4,
        area: 2450,
        city: "Mumbai",
        address: "Carter Road, Bandra West, Mumbai, Maharashtra 400050",
        contactPhone: "+91 9820012345",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 19.0667,
        longitude: 72.8258,
        location: { type: "Point", coordinates: [72.8258, 19.0667] },
        owner: brokerUser._id,
        status: "approved",
        isFeatured: true,
        views: 312,
        amenities: ["Swimming Pool", "Gym", "Sea View", "Covered Parking", "24/7 Security", "Clubhouse", "Balcony"]
      },
      {
        title: "Modern 2 BHK Fully Furnished High-Rise Apartment",
        description: "Spacious and modern 2-bedroom apartment with designer interiors, modular kitchen, piped gas, and quick connectivity to Western Express Highway and Metro.",
        price: 65000,
        propertyType: "Apartment",
        listingType: "rent",
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        city: "Mumbai",
        address: "Off WEH, Andheri East, Mumbai, Maharashtra 400069",
        contactPhone: "+91 9820012345",
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 19.1136,
        longitude: 72.8697,
        location: { type: "Point", coordinates: [72.8697, 19.1136] },
        owner: brokerUser._id,
        status: "approved",
        isFeatured: true,
        views: 184,
        amenities: ["Furnished", "Elevator", "Power Backup", "Gym", "Gated Security", "Intercom"]
      },
      {
        title: "Royal Colonial Bungalow for Film & TV Shooting",
        description: "Magnificent colonial-era villa with grand staircase, sprawling 2-acre lawn, vintage architecture, ample generator parking, and production vanity rooms.",
        price: 120000,
        dailyPrice: 120000,
        indoorOutdoor: "Both",
        parkingAvailable: true,
        propertyType: "Shooting Location",
        listingType: "rent",
        bedrooms: 5,
        bathrooms: 6,
        area: 8500,
        city: "Mumbai",
        address: "Near Film City, Goregaon East, Mumbai, Maharashtra 400065",
        contactPhone: "+91 9820012345",
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 19.1628,
        longitude: 72.8878,
        location: { type: "Point", coordinates: [72.8878, 19.1628] },
        owner: brokerUser._id,
        status: "approved",
        isFeatured: true,
        views: 520,
        amenities: ["Generator Backup", "Makeup Rooms", "Catering Space", "Security", "Sprawling Lawn"]
      },
      {
        title: "Prime Commercial Grade-A Corporate Office",
        description: "Ready-to-move plug-and-play corporate office space with 40 workstations, 3 executive cabins, conference hall with video conference setup, and cafeteria.",
        price: 32000000,
        propertyType: "Shop / Commercial",
        listingType: "sale",
        bedrooms: 0,
        bathrooms: 2,
        area: 2100,
        city: "Thane",
        address: "Ghodbunder Road, Thane West, Maharashtra 400607",
        contactPhone: "+91 9820012345",
        images: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 19.2684,
        longitude: 72.9698,
        location: { type: "Point", coordinates: [72.9698, 19.2684] },
        owner: brokerUser._id,
        status: "approved",
        isFeatured: false,
        views: 95,
        amenities: ["Air Conditioning", "Cafeteria", "High Speed Elevators", "Fire Safety", "CCTV", "Conference Room"]
      },
      {
        title: "Spacious 4 BHK Independent Villa with Private Garden",
        description: "Quiet green neighborhood with private swimming pool, terrace garden, 2 covered car parks, and close proximity to international schools.",
        price: 45000000,
        propertyType: "House",
        listingType: "sale",
        bedrooms: 4,
        bathrooms: 5,
        area: 3600,
        city: "Navi Mumbai",
        address: "Sector 8, Nerul, Navi Mumbai, Maharashtra 400706",
        contactPhone: "+91 9820012345",
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 19.0330,
        longitude: 73.0163,
        location: { type: "Point", coordinates: [73.0163, 19.0330] },
        owner: brokerUser._id,
        status: "approved",
        isFeatured: true,
        views: 240,
        amenities: ["Private Pool", "Garden", "Covered Parking", "Solar Powered", "24/7 Water"]
      }
    ];

    await Property.insertMany(properties);
    console.log(`✓ Inserted ${properties.length} sample properties`);

    console.log("\nSeeding completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
