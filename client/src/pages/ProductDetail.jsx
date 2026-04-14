import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart, ArrowLeft, CheckCircle, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart } from '../features/cart/cartSlice';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin text-dimo-blue w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <Link to="/products" className="inline-flex items-center space-x-2 text-dimo-blue hover:text-blue-800 dark:text-blue-400 font-bold mb-8 transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Catalog</span>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-700">
          
          {/* Image Placeholder */}
          <div className="md:w-1/2 p-8 bg-gray-100 dark:bg-gray-700 flex items-center justify-center min-h-[400px]">
            <Package size={120} className="text-gray-300 dark:text-gray-500" />
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-10 flex flex-col">
            <div className="mb-2">
              <span className="bg-blue-100 text-dimo-blue dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {product.brand}
              </span>
            </div>
            
            <h1 className="text-4xl font-black text-dimo-dark dark:text-white mt-4 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 font-mono">Part #{product.partNumber}</p>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="mt-auto border-t border-gray-100 dark:border-gray-700 pt-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Price</p>
                  <p className="text-5xl font-black text-dimo-red">Rs {product.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  {product.stock > 0 ? (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 font-bold">
                      <CheckCircle size={20} />
                      <span>{product.stock} In Stock</span>
                    </div>
                  ) : (
                    <span className="text-red-500 font-bold">Out of Stock</span>
                  )}
                </div>
              </div>

              {product.stock > 0 && (
                <div className="flex space-x-4">
                  <select 
                    value={qty} 
                    onChange={e => setQty(Number(e.target.value))}
                    className="w-24 pl-4 pr-10 py-4 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-dimo-blue font-bold text-lg appearance-none cursor-pointer"
                  >
                    {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>

                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-dimo-blue hover:bg-blue-800 text-white font-bold text-lg py-4 rounded-xl flex justify-center items-center space-x-2 transition-transform transform active:scale-95 shadow-lg shadow-blue-900/20"
                  >
                    <ShoppingCart size={24} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
