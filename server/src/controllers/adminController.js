const Product = require('../models/Product');
const csv = require('csv-parser');
const stream = require('stream');

// @desc    Get sales data mockup for admin chart
// @route   GET /api/admin/sales
// @access  Private/Admin
const getSalesData = async (req, res) => {
  try {
    // Generate mock sales data for the Recharts visualization
    const data = [
      { name: 'Jan', revenue: 4000, equipment: 2400, parts: 2400 },
      { name: 'Feb', revenue: 3000, equipment: 1398, parts: 2210 },
      { name: 'Mar', revenue: 2000, equipment: 9800, parts: 2290 },
      { name: 'Apr', revenue: 2780, equipment: 3908, parts: 2000 },
      { name: 'May', revenue: 1890, equipment: 4800, parts: 2181 },
      { name: 'Jun', revenue: 2390, equipment: 3800, parts: 2500 },
      { name: 'Jul', revenue: 3490, equipment: 4300, parts: 2100 },
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
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Bulk write logic based on the partNumber or exact name
        const bulkOps = results.map((item) => ({
          updateOne: {
            filter: { partNumber: item.partNumber || item.name },
            update: { 
              $set: { 
                name: item.name,
                price: Number(item.price),
                stock: Number(item.stock),
                category: item.category || 'Other',
                description: item.description || 'Uploaded via CSV',
                brand: item.brand || 'DIMO Default'
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
          count: results.length
        });
      });

  } catch (error) {
    res.status(500).json({ message: 'CSV Processing Failed', error: error.message });
  }
};

module.exports = { getSalesData, uploadInventoryCsv };
