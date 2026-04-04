import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Dynamically set upload folder based on field name or query
    let uploadPath = 'uploads/';
    if (file.fieldname === 'image' || file.fieldname === 'assetImage') {
      uploadPath += 'assets/';
    } else if (file.fieldname === 'returnImage') {
      uploadPath += 'assignments/';
    } else if (file.fieldname === 'photo') {
      uploadPath += 'officers/';
    }
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: timestamp + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter for images only
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});
