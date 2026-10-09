/**
 * migrate.js — run once to upgrade existing property documents
 * Usage: node backend/migrate.js
 */
require("dotenv").config({ path: "./backend/.env" });
const mongoose = require("mongoose");
const Property = require("./backend/models/Property");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // 1. Backfill defaults on all properties
  await Property.updateMany(
    { views:     { $exists: false } },
    { $set: { views: 0 } }
  );
  await Property.updateMany(
    { amenities: { $exists: false } },
    { $set: { amenities: [] } }
  );
  await Property.updateMany(
    { isFeatured:{ $exists: false } },
    { $set: { isFeatured: false } }
  );
  console.log("✓ Defaults backfilled");

  // 2. Build GeoJSON location from existing latitude/longitude
  const props = await Property.find({
    latitude:  { $ne: null },
    longitude: { $ne: null },
    location:  { $exists: false },
  });

  let geoUpdated = 0;
  for (const p of props) {
    const lat = Number(p.latitude);
    const lng = Number(p.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      await Property.findByIdAndUpdate(p._id, {
        $set: { location: { type: "Point", coordinates: [lng, lat] } },
      });
      geoUpdated++;
    }
  }
  console.log(`✓ GeoJSON location set on ${geoUpdated} properties`);

  await mongoose.disconnect();
  console.log("Migration complete.");
};

run().catch(err => { console.error(err); process.exit(1); });
