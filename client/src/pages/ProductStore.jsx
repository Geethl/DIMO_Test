import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import api from '../services/api';

const ProductStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const categories = ['All', 'Engine Parts', 'Power Tools', 'Vehicle Accessories', 'TATA Genuine Parts', 'Agriculture Machinery', 'Home Appliances', 'Other'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (debouncedSearch) queryParams.append('keyword', debouncedSearch);
        if (category && category !== 'All') queryParams.append('category', category);
        
        const { data } = await api.get(`/products?${queryParams.toString()}`);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [debouncedSearch, category]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-dimo-dark dark:text-white mb-4">Product Catalog</h1>
          <p className="text-gray-500 dark:text-gray-400">Discover premium parts and accessories.</p>
        </header>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search by part name or number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-dimo-blue transition-all"
            />
          </div>
          
          <div className="relative min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="text-gray-400" size={20} />
            </div>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-dimo-blue cursor-pointer appearance-none"
            >
              <option value="" disabled>Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-dimo-blue" size={48} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-400">No products found.</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                key={product._id} 
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col"
              >
                <Link to={`/product/${product._id}`} className="flex-grow">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center p-4">
                     <span className="text-gray-400 font-bold tracking-widest opacity-50">DIMO IMAGE</span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-dimo-red font-bold uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="font-bold text-lg text-dimo-dark dark:text-white mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-2xl font-black text-dimo-blue dark:text-blue-400">Rs {product.price.toLocaleString()}</p>
                  </div>
                </Link>
                <div className="p-5 pt-0 mt-auto">
                  <Link to={`/product/${product._id}`} className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-dimo-blue hover:text-white dark:hover:bg-dimo-blue text-dimo-dark dark:text-gray-200 font-bold rounded-xl flex justify-center items-center space-x-2 transition-colors">
                    <ShoppingCart size={18} />
                    <span>View Details</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductStore;
