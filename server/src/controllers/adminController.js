const Product = require('../models/Product');
const csv = require('csv-parser');
const stream = require('stream');

// @desc    Get sales data mockup for admin chart
// @route   GET /api/admin/sales
// @access  Private/Admin
const getSalesData = async (req, res) => {
  try {
    // Generate randomized mock sales data to simulate database updates
    const randomShift = () => Math.floor(Math.random() * 2000 - 1000);
    const data = [
      { name: 'Jan', revenue: 4000 + randomShift(), equipment: Math.max(0, 2400 + randomShift()), parts: Math.max(0, 2400 + randomShift()) },
      { name: 'Feb', revenue: 3000 + randomShift(), equipment: Math.max(0, 1398 + randomShift()), parts: Math.max(0, 2210 + randomShift()) },
      { name: 'Mar', revenue: 2000 + randomShift(), equipment: Math.max(0, 9800 + randomShift()), parts: Math.max(0, 2290 + randomShift()) },
      { name: 'Apr', revenue: 2780 + randomShift(), equipment: Math.max(0, 3908 + randomShift()), parts: Math.max(0, 2000 + randomShift()) },
      { name: 'May', revenue: 1890 + randomShift(), equipment: Math.max(0, 4800 + randomShift()), parts: Math.max(0, 2181 + randomShift()) },
      { name: 'Jun', revenue: 2390 + randomShift(), equipment: Math.max(0, 3800 + randomShift()), parts: Math.max(0, 2500 + randomShift()) },
      { name: 'Jul', revenue: 3490 + randomShift(), equipment: Math.max(0, 4300 + randomShift()), parts: Math.max(0, 2100 + randomShift()) },
    ];
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales data' });
  }
};

// @desc    Bulk process inventory via CSV stream
// @route   POST /api/admin/inventory/upload
// @access  Private/Admin
const uploadInventoryCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ''), // Strip BOM and trim
        mapValues: ({ value }) => value.trim()
      }))
      .on('data', (data) => {
        // Skip completely empty validation rows
        if (data.name || data.partNumber) {
           results.push(data);
        }
      })
      .on('end', async () => {
        try {
          // Bulk write logic based on the partNumber or exact name
          const bulkOps = results.map((item) => ({
            updateOne: {
              filter: { partNumber: item.partNumber || item.name },
              update: { 
                $set: { 
                  name: item.name || 'Unnamed Product',
                  price: Number(item.price) || 0,
                  stock: Number(item.stock) || 0,
                  category: ['Engine Parts', 'Power Tools', 'Vehicle Accessories', 'TATA Genuine Parts', 'Agriculture Machinery', 'Home Appliances', 'Other'].includes(item.category) ? item.category : 'Other',
                  description: item.description || 'Uploaded via Dashboard',
                  brand: item.brand || 'DIMO'
                } 
              },
              upsert: true
            }
          }));

          if (bulkOps.length > 0) {
            await Product.bulkWrite(bulkOps);
          }

          res.status(200).json({ 
            message: 'Inventory processed successfully!',
            count: bulkOps.length
          });
        } catch (dbError) {
          console.error("Bulk upload crashed:", dbError);
          // Return the actual database issue to the frontend
          res.status(500).json({ message: dbError.message || 'Database validation failed on CSV data.' });
        }
      })
      .on('error', (err) => {
         res.status(500).json({ message: 'Error parsing CSV stream', error: err.message });
      });

  } catch (error) {
    res.status(500).json({ message: 'CSV Processing Failed', error: error.message });
  }
};

module.exports = { getSalesData, uploadInventoryCsv };
