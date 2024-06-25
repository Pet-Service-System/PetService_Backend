const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Product_Avatar',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp', 'jfif', 'ico'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
