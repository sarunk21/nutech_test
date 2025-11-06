const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
// __dirname is src/middlewares, so we need to go up 2 levels to reach project root
const uploadDir = path.join(__dirname, '../../public/uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created upload directory: ${uploadDir}`);
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: profile-userId-timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `profile-${req.user.id}-${uniqueSuffix}${ext}`;
    console.log(`Uploading file: ${filename} to ${uploadDir}`);
    cb(null, filename);
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  console.log(`File filter check - MIME type: ${file.mimetype}`);

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format gambar tidak sesuai. Hanya JPEG, JPG, atau PNG yang diperbolehkan'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max file size
  }
});

/**
 * Middleware to handle single image upload
 */
const uploadProfileImage = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Ukuran file terlalu besar. Maksimal 2MB',
            data: null
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
          data: null
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
          data: null
        });
      }
    }
    
    // Log upload success
    if (req.file) {
      console.log(`File uploaded successfully: ${req.file.filename}`);
      console.log(`File saved to: ${req.file.path}`);
      console.log(`File size: ${req.file.size} bytes`);
    } else {
      console.log('No file received in request');
    }
    
    next();
  });
};

/**
 * Error handling middleware for multer errors (deprecated - now handled in uploadProfileImage)
 */
const handleUploadError = (error, req, res, next) => {
  next();
};

module.exports = {
  uploadProfileImage,
  handleUploadError
};
