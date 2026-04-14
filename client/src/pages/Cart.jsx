import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../features/cart/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.cartItems);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const checkoutHandler = () => {
    navigate('/login?redirect=/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
        <ShoppingBag size={100} className="text-gray-300 dark:text-gray-600 mb-6" />
        <h2 className="text-3xl font-black text-dimo-dark dark:text-white mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">
          Looks like you haven't added any premium components to your cart yet.
        </p>
        <Link to="/products" className="bg-dimo-blue hover:bg-blue-800 text-white font-bold py-4 px-10 rounded-xl transition-colors shadow-lg shadow-blue-900/20">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-dimo-dark dark:text-white mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="text-gray-400" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <Link to={`/product/${item._id}`} className="font-bold text-lg text-dimo-dark dark:text-white hover:text-dimo-blue dark:hover:text-blue-400 transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">Part #{item.partNumber}</p>
                </div>

                <div className="font-black text-dimo-red text-xl">
                  Rs {item.price.toLocaleString()}
                </div>

                <div className="flex items-center space-x-4">
                  <select 
                    value={item.qty} 
                    onChange={(e) => dispatch(updateQuantity({ id: item._id, qty: Number(e.target.value) }))}
                    className="w-20 pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-dimo-blue font-bold appearance-none cursor-pointer"
                  >
                    {[...Array(Math.min(item.stock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>

                  <button 
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24">
              <h2 className="text-2xl font-bold text-dimo-dark dark:text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8 text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items)</span>
                  <span className="font-bold">Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimation</span>
                  <span className="font-bold">Calculated at Checkout</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-6 flex justify-between items-center">
                  <span className="font-bold text-xl text-dimo-dark dark:text-white">Total</span>
                  <span className="font-black text-2xl text-dimo-blue dark:text-blue-400">Rs {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={checkoutHandler}
                className="w-full bg-gradient-to-r from-dimo-green to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black py-4 rounded-xl flex justify-center items-center space-x-2 transition-transform transform active:scale-95 shadow-lg shadow-green-500/25 border-b-4 border-emerald-600"
              >
                <span>Proceed Secure Checkout</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
