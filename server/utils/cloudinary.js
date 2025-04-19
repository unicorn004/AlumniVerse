const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'alumniverse',  
    public_id: `${file.fieldname}-${Date.now()}`, 
    resource_type: file.mimetype.startsWith('image/') 
      ? 'image'  : 'auto', 
  })
});

const upload = multer({ storage });

/**
 * Utility function for direct Cloudinary upload (not using multer)
 * @param {string} filePath - Local path of the file
 * @param {Object} options - Optional: folder, publicId, resourceType
 * @returns {Promise<string>} - Returns secure URL of the uploaded file
 */
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "alumniverse",
      public_id: options.publicId || undefined,
      resource_type: options.resourceType || "image",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};


module.exports = { cloudinary, upload, uploadToCloudinary };