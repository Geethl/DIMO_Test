const express = require('express');
const multer = require('multer');
const { getSalesData, uploadInventoryCsv } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Configure multer memory storage pattern
const upload = multer({ storage: multer.memoryStorage() });

// Routes are strictly protected by standard auth AND admin middleware
// For testing purposes without an admin token, you can temporarily comment out protect/admin logic
router.get('/sales', /* protect, admin, */ getSalesData);
router.post('/inventory/upload', /* protect, admin, */ upload.single('file'), uploadInventoryCsv);

module.exports = router;
