import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { UserCircle, ShoppingCart, LogOut } from 'lucide-react';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    // In a real app, call logout API here as well
    dispatch(logout());
  };

  return (
    <nav className="bg-dimo-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-wider hover:text-dimo-red transition-colors duration-300">
              DIMO<span className="text-dimo-red">.</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="hover:text-dimo-red transition-colors duration-300 relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-dimo-red text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {userInfo ? (
              <div className="flex items-center space-x-4">
                <span className="font-medium hidden sm:inline-block">Hi, {userInfo.name}</span>
                <button 
                  onClick={handleLogout}
                  className="p-1 hover:text-dimo-red transition-colors duration-300 rounded-full"
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
