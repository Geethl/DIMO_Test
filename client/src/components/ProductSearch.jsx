import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() === '') {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await api.get(`/products/search?q=${searchTerm}&category=${category}`);
        setResults(response.data);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowDropdown(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 relative"
    >
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dimo-blue"></div>
            ) : (
              <Search className="text-gray-400" size={20} />
            )}
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-gray-200 bg-gray-50 text-dimo-dark focus:ring-2 focus:ring-dimo-blue focus:border-dimo-blue transition-all"
            placeholder="Search by part number, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => { if(results.length > 0) setShowDropdown(true); }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // delay to allow clicks
          />
          
          {/* Instant Dropdown Results */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 max-h-96 overflow-y-auto"
              >
                {results.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {results.map((product) => (
                      <li key={product._id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <Package size={24} />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-bold text-dimo-dark">{product.name}</h4>
                          <div className="flex gap-2 text-xs text-gray-500 mt-1">
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-dimo-blue">{product.partNumber || 'N/A'}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                          </div>
                        </div>
                        <div className="text-dimo-red font-bold">
                          ${product.price?.toFixed(2)}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No matching parts found for "{searchTerm}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
            <option value="TATA Genuine Parts">TATA Genuine Parts</option>
            <option value="Agriculture Machinery">Agriculture Machinery</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Power Tools">Power Tools</option>
            <option value="Engine Parts">Engine Parts</option>
            <option value="Vehicle Accessories">Vehicle Accessories</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-dimo-blue hover:bg-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2 shadow-md shadow-blue-900/20"
        >
          <span>Search</span>
        </button>
      </form>

      {/* Advanced Filters Toggle */}
      <div className="mt-4 flex justify-end">
        <button className="text-gray-500 hover:text-dimo-red flex items-center space-x-1 text-sm font-medium transition-colors">
          <SlidersHorizontal size={16} />
          <span>Advanced Specifications</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProductSearch;
