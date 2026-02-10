const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create subdirectory based on date
    const date = new Date();
    const subDir = path.join(uploadDir, `${date.getFullYear()}`, `${date.getMonth() + 1}`);
    
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }
    
    cb(null, subDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter - allowed file types
const allowedTypes = [
  // Excel
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // CSV
  'text/csv',
  'application/csv',
  // SPSS
  'application/x-spss-sav',
  'application/octet-stream',
  // Stata
  'application/x-stata-dta',
  // R files
  'text/x-r',
  'application/x-r-data',
  // Text
  'text/plain',
  // ZIP
  'application/zip',
  'application/x-zip-compressed',
  // PDF
  'application/pdf',
  // Word
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const allowedExtensions = [
  '.xls', '.xlsx', '.csv', '.sav', '.dta', '.r', '.rdata', 
  '.txt', '.zip', '.pdf', '.doc', '.docx', '.opju', '.json'
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB default
    files: 10 // Maximum 10 files per request
  }
});

module.exports = upload;
