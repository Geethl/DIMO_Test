const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');
const connectDB = require('./src/config/db');

dotenv.config();

const mockProducts = [
  // TATA Genuine Parts
  {
    name: 'TATA Ace Clutch Plate Assembly',
    partNumber: 'TA-CP-2024',
    sku: 'SKU-TATA-001',
    description: 'High-durability OEM clutch plate for TATA Ace models.',
    price: 45.0,
    category: 'TATA Genuine Parts',
    brand: 'TATA Motors',
    stock: 120,
    specifications: { 'Weight': '2.5kg', 'Compatibility': 'TATA Ace HT/EX', 'Material': 'Alloy Steel' }
  },
  {
    name: 'TATA Xenon Brake Pads (Front)',
    partNumber: 'TX-BPF-001',
    sku: 'SKU-TATA-002',
    description: 'Ceramic brake pads offering superior stopping power.',
    price: 32.5,
    category: 'TATA Genuine Parts',
    brand: 'TATA Motors',
    stock: 80,
    specifications: { 'Position': 'Front', 'Material': 'Ceramic', 'Life': '40,000 km' }
  },
  {
    name: 'TATA Indigo Fuel Injector',
    partNumber: 'TI-FI-444',
    sku: 'SKU-TATA-003',
    description: 'Direct fuel injector for TATA Indigo diesel variants.',
    price: 150.0,
    category: 'TATA Genuine Parts',
    brand: 'TATA Motors',
    stock: 25,
    specifications: { 'Type': 'Diesel', 'Pressure': 'Max 300 Bar' }
  },
  {
    name: 'TATA LPT Truck Water Pump',
    partNumber: 'LPT-WP-88',
    sku: 'SKU-TATA-004',
    description: 'Heavy duty coolant pump for commercial LPT trucks.',
    price: 85.0,
    category: 'TATA Genuine Parts',
    brand: 'TATA Motors',
    stock: 40,
    specifications: { 'Flow Rate': '60 L/min', 'Material': 'Cast Iron' }
  },
  {
    name: 'TATA Safari Alternator 12V',
    partNumber: 'TS-ALT-12V',
    sku: 'SKU-TATA-005',
    description: '12V 90Amp Alternator assembly for Safari Dicor.',
    price: 210.0,
    category: 'TATA Genuine Parts',
    brand: 'TATA Motors',
    stock: 15,
    specifications: { 'Voltage': '12V', 'Amperage': '90A' }
  },
  
  // Agriculture Machinery
  {
    name: 'Mahindra Tractor Rotary Tiller',
    partNumber: 'AG-ROT-001',
    sku: 'SKU-AGRI-001',
    description: '6-foot heavy-duty rotary tiller for loose soil preparation.',
    price: 850.0,
    category: 'Agriculture Machinery',
    brand: 'Mahindra',
    stock: 8,
    specifications: { 'Working Width': '180 cm', 'Blades': '42 L-Type', 'Tractor HP': '40-50 HP' }
  },
  {
    name: 'Diesel Water Pump Set 5HP',
    partNumber: 'AG-WP-5HP',
    sku: 'SKU-AGRI-002',
    description: 'Portable agricultural water pump for irrigation.',
    price: 320.0,
    category: 'Agriculture Machinery',
    brand: 'Kirloskar',
    stock: 30,
    specifications: { 'Power': '5 HP', 'Discharge': '800 Liters/min', 'Fuel': 'Diesel' }
  },
  {
    name: 'CLAAS Combine Harvester Blade',
    partNumber: 'CL-HB-99',
    sku: 'SKU-AGRI-003',
    description: 'Replacement cutter bar blade for CLAAS Crop Tiger.',
    price: 45.0,
    category: 'Agriculture Machinery',
    brand: 'CLAAS',
    stock: 200,
    specifications: { 'Length': '10 cm', 'Material': 'High Carbon Steel' }
  },
  {
    name: 'STIHL Earth Auger',
    partNumber: 'ST-EA-BT131',
    sku: 'SKU-AGRI-004',
    description: 'One-man earth auger for planting and fencing.',
    price: 410.0,
    category: 'Agriculture Machinery',
    brand: 'STIHL',
    stock: 12,
    specifications: { 'Displacement': '36.3 cc', 'Weight': '10 kg', 'Max Drill Depth': '1 meter' }
  },
  {
    name: 'Knapsack Manual Sprayer 16L',
    partNumber: 'AG-SPR-16L',
    sku: 'SKU-AGRI-005',
    description: 'Backpack chemical and fertilizer sprayer.',
    price: 25.0,
    category: 'Agriculture Machinery',
    brand: 'FarmPro',
    stock: 150,
    specifications: { 'Capacity': '16 Liters', 'Pump': 'Piston type', 'Nozzle': 'Brass' }
  },

  // Home Appliances
  {
    name: 'Siemens Front Load Washing Machine',
    partNumber: 'HA-WM-S10',
    sku: 'SKU-HOME-001',
    description: '8kg automatic front load with eco-bubble tech.',
    price: 550.0,
    category: 'Home Appliances',
    brand: 'Siemens',
    stock: 15,
    specifications: { 'Capacity': '8 kg', 'Spin Speed': '1400 RPM', 'Energy Rating': 'A+++' }
  },
  {
    name: 'Bosch Inverter Refrigerator 450L',
    partNumber: 'HA-REF-B450',
    sku: 'SKU-HOME-002',
    description: 'Double door frost-free refrigerator with VarioInverter.',
    price: 780.0,
    category: 'Home Appliances',
    brand: 'Bosch',
    stock: 10,
    specifications: { 'Capacity': '450 L', 'Compressor': 'Inverter', 'Defrosting': 'Frost Free' }
  },
  {
    name: 'Samsung 4K Smart OLED TV 65"',
    partNumber: 'HA-TV-S65',
    sku: 'SKU-HOME-003',
    description: 'Ultra-thin bezel smart TV with quantum HDR.',
    price: 1200.0,
    category: 'Home Appliances',
    brand: 'Samsung',
    stock: 22,
    specifications: { 'Resolution': '4K UHD', 'Refresh Rate': '120Hz', 'Smart OS': 'Tizen' }
  },
  {
    name: 'Panasonic Split Inverter AC 1.5 Ton',
    partNumber: 'HA-AC-P15',
    sku: 'SKU-HOME-004',
    description: 'High ambient cooling twin rotary inverter AC.',
    price: 490.0,
    category: 'Home Appliances',
    brand: 'Panasonic',
    stock: 45,
    specifications: { 'Tonnage': '1.5 Ton', 'Coil': '100% Copper', 'Filter': 'PM 0.1' }
  },
  {
    name: 'LG Microwave Oven 32L',
    partNumber: 'HA-MW-L32',
    sku: 'SKU-HOME-005',
    description: 'Convection microwave with charcoal lighting heater.',
    price: 195.0,
    category: 'Home Appliances',
    brand: 'LG',
    stock: 60,
    specifications: { 'Capacity': '32 L', 'Type': 'Convection', 'Power': '900W' }
  },

  // Power Tools
  {
    name: 'BOSCH Impact Drill 13mm',
    partNumber: 'PT-ID-13RE',
    sku: 'SKU-TOOL-001',
    description: 'Professional impact drill mechanism for masonry and steel.',
    price: 65.0,
    category: 'Power Tools',
    brand: 'Bosch',
    stock: 50,
    specifications: { 'Chuck Size': '13 mm', 'Power Input': '600 W', 'No Load Speed': '0-2800 rpm' }
  },
  {
    name: 'Makita Angle Grinder 115mm',
    partNumber: 'PT-AG-9556',
    sku: 'SKU-TOOL-002',
    description: 'Compact angle grinder with labyrinth construction seals.',
    price: 55.0,
    category: 'Power Tools',
    brand: 'Makita',
    stock: 75,
    specifications: { 'Disc Diameter': '115 mm', 'Power': '840 W', 'Weight': '2.0 kg' }
  },
  {
    name: 'DeWalt Cordless Hammer Drill 20V MAX',
    partNumber: 'PT-DCD796',
    sku: 'SKU-TOOL-003',
    description: 'Brushless compact cordless hammer drill kit with Li-Ion batteries.',
    price: 185.0,
    category: 'Power Tools',
    brand: 'DeWalt',
    stock: 35,
    specifications: { 'Voltage': '20V', 'Motor': 'Brushless', 'Battery': '2x 2.0Ah' }
  },
  {
    name: 'Hitachi Circular Saw 7-1/4"',
    partNumber: 'PT-CS-C7',
    sku: 'SKU-TOOL-004',
    description: 'Heavy duty circular wood cutting saw.',
    price: 110.0,
    category: 'Power Tools',
    brand: 'Hitachi',
    stock: 25,
    specifications: { 'Blade Size': '185 mm', 'Max Cut Depth': '62 mm', 'Power': '1050 W' }
  },
  {
    name: 'Milwaukee M18 Impact Wrench',
    partNumber: 'PT-MW-2767',
    sku: 'SKU-TOOL-005',
    description: 'High torque impact wrench with friction ring.',
    price: 290.0,
    category: 'Power Tools',
    brand: 'Milwaukee',
    stock: 18,
    specifications: { 'Torque': '1400 ft-lbs', 'Anvil': '1/2 inch', 'Voltage': '18V' }
  }
];

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany(); // Clear existing
    await Product.insertMany(mockProducts);
    console.log('Successfully seeded 20 mock products for DIMO Lanka!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
