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
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 text-dimo-dark dark:text-white shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-black tracking-tighter hover:opacity-80 transition-opacity">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-dimo-blue to-dimo-green">DIMO</span>
              <span className="text-dimo-green text-4xl leading-none">.</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <button onClick={toggleTheme} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-dimo-green dark:hover:text-dimo-green transition-all rounded-full focus:outline-none shadow-inner">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/products" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-dimo-green dark:hover:text-dimo-green transition-colors duration-300">
              Showroom
            </Link>
            <Link to="/about" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-dimo-green dark:hover:text-dimo-green transition-colors duration-300">
              Our Vision
            </Link>
            <Link to="/admin" className="text-sm font-medium hover:text-dimo-red dark:hover:text-red-400 transition-colors duration-300">
              Admin Portal
            </Link>
            <Link to="/cart" className="hover:text-dimo-green dark:hover:text-dimo-green transition-colors relative group p-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow-inner">
              <ShoppingCart size={20} className="text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-dimo-green to-emerald-400 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-green-500/30">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                <Link to="/profile" className="font-bold text-sm text-dimo-dark dark:text-white hidden sm:inline-block hover:text-dimo-green dark:hover:text-dimo-green transition-colors">
                  {userInfo.name.split(' ')[0]}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 rounded-xl"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 bg-gradient-to-r from-dimo-blue to-blue-600 hover:from-dimo-green hover:to-emerald-500 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-blue-500/25 hover:shadow-green-500/30">
                <UserCircle size={18} />
                <span>Portal Access</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
