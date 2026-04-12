import React from 'react';
import { motion } from 'framer-motion';
import ProductSearch from '../components/ProductSearch';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-dimo-dark text-white overflow-hidden py-24"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-dimo-blue/80 to-dimo-red/60 mix-blend-multiply z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
          >
            Industrial Solutions <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Engineered for Excellence</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto"
          >
            From Engine Parts to Power Tools, discover the premium quality equipment tailored for your specific needs.
          </motion.p>
        </div>
      </motion.section>

      {/* Advanced Search & Filtering Prototype */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-16 relative z-20">
         <ProductSearch />
      </section>
      
      {/* Categories Mockup */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-dimo-dark mb-10 text-center">Equipment Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Engine Parts', 'Power Tools', 'Vehicles'].map((cat, i) => (
              <motion.div 
                key={cat}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-dimo-red cursor-pointer transition-all duration-300"
              >
                <div className="h-40 bg-gray-100 rounded-xl mb-6 flex items-center justify-center text-gray-400">
                  {cat} Image Placeholder
                </div>
                <h3 className="text-xl font-bold text-dimo-blue mb-2">{cat}</h3>
                <p className="text-gray-600">Browse our extensive collection of high-quality {cat.toLowerCase()}.</p>
                <button className="mt-4 text-dimo-red font-semibold hover:underline">Explore →</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
