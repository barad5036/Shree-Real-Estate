/**
 * seed.js — Comprehensive Realistic Data Seeder for Shree Real Estate
 * Usage: node seed.js --force
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Property = require("./models/Property");
const Lead = require("./models/Lead");
const Review = require("./models/Review");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shree_real_estate";
    console.log("Connecting to MongoDB:", mongoUri.replace(/:([^:@]+)@/, ":****@"));
    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB");

    console.log("Clearing existing collections...");
    await User.deleteMany({});
    await Property.deleteMany({});
    await Lead.deleteMany({});
    await Review.deleteMany({});

    console.log("\n1. Creating Users (Password: Test@123)...");

    // ─── ADMIN ─────────────────────────────────────────────────────────────
    const admin = await User.create({
      name: "Deepak Mehta",
      email: "admin@example.com",
      password: "Test@123",
      role: "admin",
      phone: "+91 98200 99999",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      isVerified: true,
      location: "Mumbai, Maharashtra",
    });

    // ─── BROKERS ───────────────────────────────────────────────────────────
    const brokerRajesh = await User.create({
      name: "Rajesh Sharma",
      email: "broker@example.com",
      password: "Test@123",
      role: "broker",
      phone: "+91 98200 12345",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      isVerified: true,
      companyName: "Shree Realty Partners",
      experience: 12,
      specialization: ["Luxury Penthouses", "Sea-Facing Apartments", "Alibaug Villas"],
      serviceAreas: ["Mumbai", "Bandra", "Worli", "Juhu", "Alibaug"],
      languages: ["English", "Hindi", "Gujarati", "Marathi"],
      reraId: "A51900012345",
      bio: "Top 1% luxury real estate advisor with 12+ years of expertise handling high-value residential assets in South Mumbai and coastal weekend villas.",
      officeAddress: "402, Platinum Heights, Linking Road, Bandra West, Mumbai",
      location: "Mumbai",
      rating: 4.9,
      totalReviews: 38,
      totalListings: 18,
      propertiesSold: 84,
    });

    const brokerPriya = await User.create({
      name: "Priya Iyer",
      email: "broker.priya@example.com",
      password: "Test@123",
      role: "broker",
      phone: "+91 98450 67890",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      isVerified: true,
      companyName: "Horizon Tech Realty",
      experience: 9,
      specialization: ["Smart Homes", "Gated Communities", "Tech Corridor Rentals"],
      serviceAreas: ["Bangalore", "Whitefield", "Indiranagar", "Sarjapur"],
      languages: ["English", "Hindi", "Kannada", "Tamil"],
      reraId: "PRM/KA/RERA/1251/446/AG/200812",
      bio: "Specializing in premier residential investments and premium rental relocations for IT executives and expats across Bangalore's tech hubs.",
      officeAddress: "8th Floor, Indiqube Gamma, Outer Ring Road, Bangalore",
      location: "Bangalore",
      rating: 4.8,
      totalReviews: 29,
      totalListings: 14,
      propertiesSold: 56,
    });

    const brokerVikram = await User.create({
      name: "Vikram Oberoi",
      email: "broker.vikram@example.com",
      password: "Test@123",
      role: "broker",
      phone: "+91 98199 44332",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      isVerified: true,
      companyName: "CineLocations & Estates",
      experience: 15,
      specialization: ["Shooting Locations", "Heritage Bungalows", "Studio Spaces", "Luxury Retreats"],
      serviceAreas: ["Mumbai", "Film City", "Goregaon", "Lonavala", "Goa"],
      languages: ["English", "Hindi", "Punjabi"],
      reraId: "A51800098765",
      bio: "Pioneer in location scouting, production leases, and commercial sets for Bollywood feature films, OTT series, and high-fashion editorial shoots.",
      officeAddress: "Studio Hub 3, Film Center Complex, Tardeo, Mumbai",
      location: "Mumbai",
      rating: 5.0,
      totalReviews: 45,
      totalListings: 12,
      propertiesSold: 62,
    });

    const brokerSunil = await User.create({
      name: "Sunil Agarwal",
      email: "broker.sunil@example.com",
      password: "Test@123",
      role: "broker",
      phone: "+91 98111 88776",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      isVerified: true,
      companyName: "Apex Commercial & Logistics",
      experience: 14,
      specialization: ["Tech Parks", "Retail Showrooms", "Logistics Warehouses"],
      serviceAreas: ["Delhi NCR", "Connaught Place", "Gurugram", "Bhiwandi", "Pune"],
      languages: ["English", "Hindi"],
      reraId: "DLRERA2019A0045",
      bio: "Corporate leasing specialist with proven track record placing multinational tech firms, national retail brands, and FMCG warehousing.",
      officeAddress: "Level 11, Barakhamba Road, Connaught Place, New Delhi",
      location: "New Delhi",
      rating: 4.7,
      totalReviews: 22,
      totalListings: 16,
      propertiesSold: 41,
    });

    // ─── BUYERS ────────────────────────────────────────────────────────────
    const buyerPooja = await User.create({
      name: "Pooja Patel",
      email: "buyer@example.com",
      password: "Test@123",
      role: "buyer",
      phone: "+91 98212 34567",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      isVerified: true,
      location: "Mumbai",
    });

    const buyerAmit = await User.create({
      name: "Amit Roy",
      email: "buyer.amit@example.com",
      password: "Test@123",
      role: "buyer",
      phone: "+91 98300 11223",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      isVerified: true,
      location: "Bangalore",
    });

    const buyerSneha = await User.create({
      name: "Sneha Kulkarni",
      email: "buyer.sneha@example.com",
      password: "Test@123",
      role: "buyer",
      phone: "+91 98220 99887",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      isVerified: true,
      location: "Pune",
    });

    const buyerRohan = await User.create({
      name: "Rohan Deshmukh",
      email: "buyer.rohan@example.com",
      password: "Test@123",
      role: "buyer",
      phone: "+91 98205 55443",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
      isVerified: true,
      location: "Mumbai",
    });

    console.log("✓ Created 9 users across Admin, Broker, and Buyer roles.");

    console.log("\n2. Creating 12 Realistic Properties Across All Categories...");

    const properties = [
      // 1. Ultra Luxury Penthouse (Apartment, Sale)
      {
        title: "Sea-Facing Ultra Luxury 4 BHK Penthouse in Worli Sea Face",
        description: "An extraordinary sky residence offering uninterrupted 270-degree Arabian sea views. Features 12-foot ceilings, imported Italian statuario marble, floor-to-ceiling soundproof double-glazed acoustic glass, Bulthaup custom kitchen, master suite with walk-in wardrobe, and smart automated mood lighting. 4 covered automated parking slots included.",
        price: 185000000,
        propertyType: "Apartment",
        listingType: "sale",
        bedrooms: 4,
        bathrooms: 5,
        area: 4200,
        city: "Mumbai",
        address: "Worli Sea Face, Worli, Mumbai, Maharashtra 400018",
        contactPhone: "+91 98200 12345",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 19.0144,
        longitude: 72.8155,
        location: { type: "Point", coordinates: [72.8155, 19.0144] },
        owner: brokerRajesh._id,
        status: "approved",
        isFeatured: true,
        views: 890,
        amenities: ["Sea View", "Private Elevator", "Infinity Swimming Pool", "Gym", "Concierge Service", "Clubhouse", "4 Car Parking", "24/7 Security"]
      },

      // 2. Tech Corridor High-Rise (Apartment, Rent)
      {
        title: "Designer Furnished 3 BHK with Panoramic Deck in Whitefield",
        description: "Modern, sun-drenched 3-bedroom residence situated inside a premier gated development in the heart of Whitefield IT hub. Fully furnished with BoConcept designer furniture, Bosch appliances, high-speed fiber connectivity, wooden deck balcony overlooking central landscaped gardens, and EV vehicle charging point.",
        price: 85000,
        propertyType: "Apartment",
        listingType: "rent",
        bedrooms: 3,
        bathrooms: 3,
        area: 1950,
        city: "Bangalore",
        address: "ITPB Main Road, Whitefield, Bangalore, Karnataka 560066",
        contactPhone: "+91 98450 67890",
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 12.9698,
        longitude: 77.7499,
        location: { type: "Point", coordinates: [77.7499, 12.9698] },
        owner: brokerPriya._id,
        status: "approved",
        isFeatured: true,
        views: 470,
        amenities: ["Fully Furnished", "Balcony Deck", "Tennis Court", "Clubhouse", "Power Backup", "Piped Gas", "EV Charging", "Pet Friendly"]
      },

      // 3. Film & Web Series Heritage Location (Shooting Location, Rent)
      {
        title: "Grand Colonial Heritage Estate for Film, OTT & Commercial Shoots",
        description: "An iconic 3-acre private colonial heritage estate frequently featured in top Bollywood features and OTT productions. Boasts a 60-foot double-height foyer, vintage grand wooden staircase, sprawling British-era lawns, antique chandeliers, dedicated air-conditioned green rooms, catering production courtyard, and 125 KVA silent generator connection.",
        price: 150000,
        dailyPrice: 150000,
        indoorOutdoor: "Both",
        parkingAvailable: true,
        propertyType: "Shooting Location",
        listingType: "rent",
        bedrooms: 6,
        bathrooms: 7,
        area: 12000,
        city: "Mumbai",
        address: "Film City Road, Goregaon East, Mumbai, Maharashtra 400065",
        contactPhone: "+91 98199 44332",
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 19.1628,
        longitude: 72.8878,
        location: { type: "Point", coordinates: [72.8878, 19.1628] },
        owner: brokerVikram._id,
        status: "approved",
        isFeatured: true,
        views: 1420,
        amenities: ["Production Vanity Rooms", "3-Acre Lawn", "125 KVA Generator", "Vanity Van Parking", "Catering Kitchen", "24/7 Security", "Indoor & Outdoor Sets"]
      },

      // 4. Luxury Coastal Villa (House, Sale)
      {
        title: "Contemporary 5 BHK Tropical Luxury Villa with Infinity Pool in Alibaug",
        description: "Designed by renowned architectural studio, this Bali-inspired 5-bedroom villa is a secluded sanctuary just 12 minutes from Mandwa Jetty. Highlights include a 50-foot private infinity lap pool, landscaped zen gardens with tropical palms, outdoor dining pavilion, organic farm corner, and staff quarters.",
        price: 95000000,
        propertyType: "House",
        listingType: "sale",
        bedrooms: 5,
        bathrooms: 6,
        area: 5800,
        city: "Alibaug",
        address: "Awas Beach Road, Mandwa, Alibaug, Maharashtra 402201",
        contactPhone: "+91 98200 12345",
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 18.7844,
        longitude: 72.8797,
        location: { type: "Point", coordinates: [72.8797, 18.7844] },
        owner: brokerRajesh._id,
        status: "approved",
        isFeatured: true,
        views: 630,
        amenities: ["Private Pool", "Private Garden", "Servant Quarters", "Gazebo", "Solar Panels", "Borewell Water", "Covered Car Park"]
      },

      // 5. Commercial Tech Office (Shop / Commercial, Rent)
      {
        title: "Grade-A Plug & Play Corporate Office Space in BKC",
        description: "Fully-furnished corporate headquarters in Mumbai's most prestigious financial district, Bandra Kurla Complex. Features 65 acoustic workstations, 4 executive director cabins, 2 large boardrooms with Cisco video-conferencing, breakout cafeteria, server room, and LEED Gold green certified building.",
        price: 650000,
        propertyType: "Shop / Commercial",
        listingType: "rent",
        bedrooms: 0,
        bathrooms: 4,
        area: 4500,
        city: "Mumbai",
        address: "G Block, Bandra Kurla Complex, Bandra East, Mumbai 400051",
        contactPhone: "+91 98111 88776",
        images: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 19.0657,
        longitude: 72.8687,
        location: { type: "Point", coordinates: [72.8687, 19.0657] },
        owner: brokerSunil._id,
        status: "approved",
        isFeatured: true,
        views: 510,
        amenities: ["Plug & Play", "High-Speed Elevators", "Centrally Air Conditioned", "Cafeteria", "24/7 Security", "Fire Sprinklers", "Reserved Parking"]
      },

      // 6. Lakeview High-Rise Flat (Apartment, Sale)
      {
        title: "Elegant 3 BHK with Balcony Overlooking Lake in Hiranandani Estate",
        description: "Premium classical architecture residence in Thane's most established planned township. Features marble flooring, wide balcony with unobstructed lake and hill views, semi-furnished modular kitchen, piped gas, and access to international school, hospital, and retail arcade within 2 minutes walk.",
        price: 24500000,
        propertyType: "Apartment",
        listingType: "sale",
        bedrooms: 3,
        bathrooms: 3,
        area: 1680,
        city: "Thane",
        address: "Hiranandani Estate, Ghodbunder Road, Thane West 400607",
        contactPhone: "+91 98200 12345",
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 19.2684,
        longitude: 72.9698,
        location: { type: "Point", coordinates: [72.9698, 19.2684] },
        owner: brokerRajesh._id,
        status: "approved",
        isFeatured: false,
        views: 320,
        amenities: ["Lake View", "Clubhouse", "Swimming Pool", "Children's Play Area", "Gated Security", "Visitor Parking", "Jogging Track"]
      },

      // 7. Prime Retail Showroom (Shop / Commercial, Sale)
      {
        title: "High-Footfall Corner Commercial Retail Showroom in Connaught Place",
        description: "Exceptional corner commercial retail property located on the Inner Circle of Connaught Place, New Delhi. Unrivalled brand visibility with 45-foot glass frontage, mezzanine floor, three-phase commercial electric load, and massive daily footfall from central business district and metro interchange.",
        price: 145000000,
        propertyType: "Shop / Commercial",
        listingType: "sale",
        bedrooms: 0,
        bathrooms: 2,
        area: 2800,
        city: "New Delhi",
        address: "Inner Circle, Connaught Place, New Delhi 110001",
        contactPhone: "+91 98111 88776",
        images: [
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 28.6315,
        longitude: 77.2167,
        location: { type: "Point", coordinates: [77.2167, 28.6315] },
        owner: brokerSunil._id,
        status: "approved",
        isFeatured: false,
        views: 290,
        amenities: ["Corner Property", "Heavy Footfall", "Glass Facade", "Power Backup", "Metro Connectivity", "Commercial Approved"]
      },

      // 8. Logistics Industrial Warehouse (Warehouse, Rent)
      {
        title: "Grade-A 32,000 sqft Modern Industrial Warehouse in Bhiwandi Logistics Corridor",
        description: "State-of-the-art PEB structure warehouse with 12-meter clear height, FM2 industrial flooring with 6-ton point load capacity, 8 hydraulic dock levelers, fire hydrant system with roof monitors, and dedicated container truck staging bay on Mumbai-Nashik national highway.",
        price: 680000,
        propertyType: "Warehouse",
        listingType: "rent",
        bedrooms: 0,
        bathrooms: 4,
        area: 32000,
        city: "Thane",
        address: "Mankoli-Anjur Road, Bhiwandi Logistics Park, Thane 421302",
        contactPhone: "+91 98111 88776",
        images: [
          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 19.2967,
        longitude: 73.0631,
        location: { type: "Point", coordinates: [73.0631, 19.2967] },
        owner: brokerSunil._id,
        status: "approved",
        isFeatured: false,
        views: 180,
        amenities: ["8 Hydraulic Docks", "12m Clear Height", "FM2 Flooring", "Fire Sprinklers", "Truck Staging Bay", "CCTV Surveillance", "Weighbridge Facility"]
      },

      // 9. Glasshouse Scenic Shoot Villa (Shooting Location, Rent)
      {
        title: "Panoramic Glasshouse & Deck Villa for Ad Campaigns & Celebrity Shoots",
        description: "Stunning cantilevered glass villa perched on a private hill cliff in Lonavala overlooking Pawna Lake. Offers 360-degree mountain backdrops, open sun deck, wooden infinity plunge pool, full indoor sound isolation, and catering staging for 40-member crews. Preferred by top automotive and fashion brands.",
        price: 95000,
        dailyPrice: 95000,
        indoorOutdoor: "Both",
        parkingAvailable: true,
        propertyType: "Shooting Location",
        listingType: "rent",
        bedrooms: 4,
        bathrooms: 4,
        area: 6500,
        city: "Lonavala",
        address: "Tungarli Lake Road, Lonavala, Maharashtra 410401",
        contactPhone: "+91 98199 44332",
        images: [
          "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 18.7557,
        longitude: 73.4091,
        location: { type: "Point", coordinates: [73.4091, 18.7557] },
        owner: brokerVikram._id,
        status: "approved",
        isFeatured: true,
        views: 740,
        amenities: ["Lake View", "Mountain Deck", "Plunge Pool", "Silent Generator", "Dedicated Crew Quarters", "High-Speed WiFi", "Vanity Rooms"]
      },

      // 10. Gated Township Residential Plot (Land / Plot, Sale)
      {
        title: "Ready-to-Build 3,600 sqft Vastu-Compliant Villa Plot in Gated Golf Community",
        description: "Clear title, RERA-approved NA residential villa plot in prestigious gated township. Ready for immediate villa construction with underground electricity, piped water connection, paved 40-foot tree-lined roads, perimeter security, and clubhouse membership included.",
        price: 18000000,
        propertyType: "Land / Plot",
        listingType: "sale",
        bedrooms: 0,
        bathrooms: 0,
        area: 3600,
        city: "Pune",
        address: "Phase 3, Hinjawadi Gated Enclave, Pune, Maharashtra 411057",
        contactPhone: "+91 98200 12345",
        images: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 18.5913,
        longitude: 73.7389,
        location: { type: "Point", coordinates: [73.7389, 18.5913] },
        owner: brokerRajesh._id,
        status: "approved",
        isFeatured: false,
        views: 240,
        amenities: ["Clear Title", "RERA Approved", "Gated Security", "Underground Electricity", "Water Supply", "Clubhouse Access"]
      },

      // 11. Minimalist Designer Condo (Apartment, Rent)
      {
        title: "Scandinavian Minimalist 2 BHK in Koregaon Park with Private Garden Balcony",
        description: "Impeccably designed 2-bedroom home in Pune's most cosmopolitan neighborhood. Features natural oak finishes, Italian open kitchen with breakfast island, floor-to-ceiling windows, rain showers, and immediate walking distance to popular cafes, art galleries, and botanical gardens.",
        price: 48000,
        propertyType: "Apartment",
        listingType: "rent",
        bedrooms: 2,
        bathrooms: 2,
        area: 1250,
        city: "Pune",
        address: "Lane 7, Koregaon Park, Pune, Maharashtra 411001",
        contactPhone: "+91 98450 67890",
        images: [
          "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 18.5362,
        longitude: 73.8940,
        location: { type: "Point", coordinates: [73.8940, 18.5362] },
        owner: brokerPriya._id,
        status: "approved",
        isFeatured: false,
        views: 410,
        amenities: ["Furnished", "Balcony Garden", "Piped Gas", "Covered Parking", "Lift", "Gated Security", "Intercom"]
      },

      // 12. Modern Duplex Townhouse (House, Sale)
      {
        title: "Architectural 3 BHK Independent Duplex Townhouse in Indiranagar",
        description: "Charming independent modern townhouse featuring exposed brick facade, double-height living room, private courtyard with frangipani tree, terrace barbecue deck, home study, and servant quarter. Centrally located on quiet tree-canopied residential lane.",
        price: 52000000,
        propertyType: "House",
        listingType: "sale",
        bedrooms: 3,
        bathrooms: 4,
        area: 3100,
        city: "Bangalore",
        address: "12th Main Road, HAL 2nd Stage, Indiranagar, Bangalore 560038",
        contactPhone: "+91 98450 67890",
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ],
        latitude: 12.9719,
        longitude: 77.6412,
        location: { type: "Point", coordinates: [77.6412, 12.9719] },
        owner: brokerPriya._id,
        status: "approved",
        isFeatured: true,
        views: 590,
        amenities: ["Private Courtyard", "Terrace BBQ Deck", "Solar Water Heating", "Covered Garage", "Rainwater Harvesting", "Study Room"]
      }
    ];

    const createdProperties = await Property.insertMany(properties);
    console.log(`✓ Inserted ${createdProperties.length} realistic properties across 6 categories!`);

    console.log("\n3. Creating Realistic Broker Reviews...");
    const reviews = [
      {
        broker: brokerRajesh._id,
        user: buyerPooja._id,
        rating: 5,
        comment: "Rajesh helped us purchase our dream sea-facing apartment in Worli. His legal documentation checks and developer negotiation were top tier!",
      },
      {
        broker: brokerRajesh._id,
        user: buyerRohan._id,
        rating: 5,
        comment: "Flawless experience buying an Alibaug weekend villa. Complete transparency and guided us on local revenue permissions.",
      },
      {
        broker: brokerPriya._id,
        user: buyerAmit._id,
        rating: 5,
        comment: "Relocating to Bangalore was seamless thanks to Priya. Found us a modern, smart-home apartment in Whitefield within 48 hours.",
      },
      {
        broker: brokerVikram._id,
        user: buyerRohan._id,
        rating: 5,
        comment: "Booked the Goregaon heritage estate for a 3-day commercial shoot. Everything was arranged smoothly with power generators and vanity rooms ready.",
      },
      {
        broker: brokerSunil._id,
        user: buyerSneha._id,
        rating: 4,
        comment: "Professional commercial leasing experience for our company's new branch office. Highly recommended for corporate real estate.",
      }
    ];

    await Review.insertMany(reviews);
    console.log(`✓ Inserted ${reviews.length} authentic broker reviews.`);

    console.log("\n4. Creating Realistic Buyer Leads / Inquiries...");
    const leads = [
      {
        property: createdProperties[0]._id, // Worli Penthouse
        broker: brokerRajesh._id,
        buyer: buyerPooja._id,
        senderName: "Pooja Patel",
        senderPhone: "+91 98212 34567",
        senderEmail: "buyer@example.com",
        message: "Hi Rajesh, I am interested in scheduling a private site visit for the Worli Sea Face penthouse this Saturday morning.",
        status: "contacted",
      },
      {
        property: createdProperties[1]._id, // Whitefield Flat
        broker: brokerPriya._id,
        buyer: buyerAmit._id,
        senderName: "Amit Roy",
        senderPhone: "+91 98300 11223",
        senderEmail: "buyer.amit@example.com",
        message: "Hello Priya, is the Whitefield 3 BHK ready for immediate move-in? Please share the maintenance and deposit breakdown.",
        status: "new",
      },
      {
        property: createdProperties[2]._id, // Goregaon Film Location
        broker: brokerVikram._id,
        buyer: buyerRohan._id,
        senderName: "Rohan Deshmukh",
        senderPhone: "+91 98205 55443",
        senderEmail: "buyer.rohan@example.com",
        message: "We are looking to book this colonial estate for a music video shoot next month for 2 days. Are dates in the second week open?",
        status: "contacted",
      },
      {
        property: createdProperties[4]._id, // BKC Office
        broker: brokerSunil._id,
        buyer: buyerSneha._id,
        senderName: "Sneha Kulkarni",
        senderPhone: "+91 98220 99887",
        senderEmail: "buyer.sneha@example.com",
        message: "Interested in the 4,500 sqft office in BKC. We have a team of 45 people. Can we view the floor plan and lease tenure?",
        status: "closed",
      }
    ];

    await Lead.insertMany(leads);
    console.log(`✓ Inserted ${leads.length} customer inquiry leads.`);

    console.log("\n========================================================");
    console.log("DATABASE SEEDING SUCCESSFUL! (Password: Test@123)");
    console.log("========================================================");
    console.log("• Admin:        admin@example.com         | Test@123");
    console.log("• Broker (1):   broker@example.com        | Test@123  (Rajesh Sharma - Mumbai)");
    console.log("• Broker (2):   broker.priya@example.com  | Test@123  (Priya Iyer - Bangalore)");
    console.log("• Broker (3):   broker.vikram@example.com | Test@123  (Vikram Oberoi - Shoot Sets)");
    console.log("• Broker (4):   broker.sunil@example.com  | Test@123  (Sunil Agarwal - Commercial)");
    console.log("• Buyer (1):    buyer@example.com         | Test@123  (Pooja Patel)");
    console.log("• Buyer (2):    buyer.amit@example.com    | Test@123  (Amit Roy)");
    console.log("• Buyer (3):    buyer.sneha@example.com   | Test@123  (Sneha Kulkarni)");
    console.log("• Buyer (4):    buyer.rohan@example.com   | Test@123  (Rohan Deshmukh)");
    console.log("--------------------------------------------------------");
    console.log("Total: 9 Users, 12 Properties, 5 Reviews, 4 Leads");
    console.log("========================================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed with error:", err);
    process.exit(1);
  }
};

seedData();
