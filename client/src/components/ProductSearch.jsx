import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const handleSearch = (e) => {
    e.preventDefault();
    // In real app, dispatch to Redux or call API
    console.log('Searching for:', searchTerm, 'in', category);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
    >
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-gray-200 bg-gray-50 text-dimo-dark focus:ring-2 focus:ring-dimo-blue focus:border-dimo-blue transition-all"
            placeholder="Search by part number, name, or specification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Filter className="text-gray-400" size={20} />
          </div>
          <select
            className="block w-full pl-12 pr-8 py-4 rounded-xl border-gray-200 bg-gray-50 text-dimo-dark focus:ring-2 focus:ring-dimo-blue focus:border-dimo-blue appearance-none transition-all cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Engine Parts">Engine Parts</option>
            <option value="Power Tools">Power Tools</option>
            <option value="Accessories">Vehicle Accessories</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-dimo-blue hover:bg-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2 shadow-md shadow-blue-900/20"
        >
          <span>Search Inventory</span>
        </button>
      </form>

      {/* Advanced Filters Toggle */}
      <div className="mt-4 flex justify-end">
        <button className="text-gray-500 hover:text-dimo-red flex items-center space-x-1 text-sm font-medium transition-colors">
          <SlidersHorizontal size={16} />
          <span>Advanced Specifications Filter</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProductSearch;
