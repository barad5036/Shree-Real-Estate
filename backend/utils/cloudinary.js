const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "hvbjsvwk").trim().replace(/['"]/g, "");
const apiKey    = (process.env.CLOUDINARY_API_KEY || "937532152271964").trim().replace(/['"]/g, "");
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "uj3NsOzUA6Y6Z46I-_-Dymdj10s").trim().replace(/['"]/g, "");

cloudinary.config({
  cloud_name: cloudName,
  api_key:    apiKey,
  api_secret: apiSecret,
});

// Use memory storage — files arrive as buffers, we stream them to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Upload a single buffer to Cloudinary and return the secure URL
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "shree-real-estate",
        transformation: [
          { width: 1200, height: 800, crop: "limit", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Upload all files from req.files and return array of URLs
const uploadFiles = async (files = []) => {
  const urls = await Promise.all(files.map((f) => uploadBufferToCloudinary(f.buffer)));
  return urls;
};

// Delete an image by its public_id
const deleteFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { upload, uploadFiles, deleteFromCloudinary };
