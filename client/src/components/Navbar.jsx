import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { UserCircle, ShoppingCart, LogOut, Sun, Moon } from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Dark mode logic
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-dimo-blue dark:bg-gray-900 text-white shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-wider hover:text-dimo-red dark:hover:text-red-400 transition-colors duration-300">
              DIMO<span className="text-dimo-red">.</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={toggleTheme} className="p-1 hover:text-dimo-red dark:hover:text-red-400 transition-colors rounded-full focus:outline-none">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/products" className="text-sm font-medium hover:text-dimo-red dark:hover:text-red-400 transition-colors duration-300">
              Shop
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-dimo-red dark:hover:text-red-400 transition-colors duration-300">
              About Us
            </Link>
            <Link to="/admin" className="text-sm font-medium hover:text-dimo-red dark:hover:text-red-400 transition-colors duration-300">
              Admin Portal
            </Link>
            <Link to="/cart" className="hover:text-dimo-red dark:hover:text-red-400 transition-colors duration-300 relative group">
              <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-dimo-red text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="font-medium hidden sm:inline-block hover:text-dimo-red dark:hover:text-red-400 transition-colors">
                  Hi, {userInfo.name}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-1 hover:text-dimo-red dark:hover:text-red-400 transition-colors duration-300 rounded-full"
                  title="Logout"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 hover:text-dimo-red transition-colors duration-300">
                <UserCircle size={24} />
                <span className="font-medium">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
