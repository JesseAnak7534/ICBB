const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const os = require('os');

/**
 * File uploads.
 *
 * Two storage backends, chosen at runtime:
 *
 *  - Local disk (default). Fine for a normal long-running server.
 *  - Vercel Blob, used when BLOB_READ_WRITE_TOKEN is set. Serverless hosts give
 *    each invocation a fresh, read-only-ish filesystem, so anything written to
 *    disk disappears as soon as the request ends. Writing to blob storage is
 *    the only way uploads survive there.
 *
 * Both paths hand the routes the same shape (`originalname`, `filename`,
 * `path`, `size`, `mimetype`), so route code does not care which is active.
 */

const useBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// Serverless hosts mount the deployment read-only; only the OS temp directory
// is writable. Detecting that here matters because creating the upload
// directory anywhere else throws, and a throw in this module takes the entire
// API down with it rather than just breaking uploads.
const isServerless = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
);

const uploadDir =
  process.env.UPLOAD_PATH ||
  (isServerless ? path.join(os.tmpdir(), 'icbb-uploads') : './uploads');

/**
 * Create the directory on first use rather than at import.
 *
 * Doing this at module load is what broke production: the module is imported
 * by every request, so a read-only filesystem turned an upload problem into a
 * total API outage.
 */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const date = new Date();
    const subDir = path.join(uploadDir, `${date.getFullYear()}`, `${date.getMonth() + 1}`);

    try {
      ensureDir(subDir);
    } catch (error) {
      // Surface it as an upload failure, not a crash.
      return cb(error);
    }

    cb(null, subDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

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

const multerInstance = multer({
  storage: useBlobStorage ? multer.memoryStorage() : diskStorage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 50 * 1024 * 1024,
    files: 10
  }
});

/**
 * Push in-memory files to Vercel Blob and rewrite req.files to look like the
 * disk-storage result.
 */
const persistToBlob = async (req) => {
  const files = req.files || (req.file ? [req.file] : []);

  if (files.length === 0) {
    return;
  }

  // Required lazily so the package is only needed on hosts that use it.
  const { put } = require('@vercel/blob');

  const stored = await Promise.all(
    files.map(async (file) => {
      const ext = path.extname(file.originalname);
      const key = `uploads/${new Date().getFullYear()}/${uuidv4()}${ext}`;

      const blob = await put(key, file.buffer, {
        access: 'private',
        contentType: file.mimetype,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      return {
        originalname: file.originalname,
        filename: path.basename(key),
        path: blob.url,
        size: file.size,
        mimetype: file.mimetype
      };
    })
  );

  if (req.files) {
    req.files = stored;
  } else {
    req.file = stored[0];
  }
};

/**
 * Wrap a multer middleware so the blob step runs after parsing, keeping the
 * `upload.array('files', 10)` call sites unchanged.
 */
const withBlob = (middleware) => (req, res, next) => {
  middleware(req, res, (err) => {
    if (err) return next(err);
    if (!useBlobStorage) return next();

    persistToBlob(req).then(() => next()).catch(next);
  });
};

module.exports = {
  single: (field) => withBlob(multerInstance.single(field)),
  array: (field, maxCount) => withBlob(multerInstance.array(field, maxCount)),
  fields: (spec) => withBlob(multerInstance.fields(spec)),
  none: () => withBlob(multerInstance.none()),
  usesBlobStorage: useBlobStorage
};
