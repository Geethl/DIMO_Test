const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Save to the root 'uploads/' folder inside the server repository
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload single image
// @route   POST /api/upload
// @access  Public (for demo simplicity)
router.post('/', upload.single('image'), (req, res) => {
  // Return the path so the frontend knows where the file is located permanently
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = router;
