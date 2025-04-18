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
    resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw',
  })
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };