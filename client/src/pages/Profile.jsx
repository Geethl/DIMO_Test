import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, User as UserIcon, Calendar, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userInfo) {
      const fetchOrders = async () => {
        try {
          const { data } = await api.get(`/orders/myorders?userId=${userInfo._id}`);
          setOrders(data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [userInfo]);

  if (!userInfo) {
    return <div className="text-center p-20 dark:text-white">Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-6">
          <div className="w-24 h-24 bg-dimo-blue text-white rounded-full flex items-center justify-center text-4xl font-black">
            {userInfo.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-dimo-dark dark:text-white">{userInfo.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{userInfo.email}</p>
            <p className="mt-2 inline-flex items-center space-x-1 text-xs font-bold text-dimo-red bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full uppercase">
              <UserIcon size={14} />
              <span>{userInfo.role} Account</span>
            </p>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-8">
            <Package className="text-dimo-blue dark:text-blue-400" size={28} />
            <h2 className="text-2xl font-black text-dimo-dark dark:text-white">Order History</h2>
          </div>

          {loading ? (
             <div className="animate-pulse space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700 rounded-xl" />)}
             </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <Package size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  key={order._id} 
                  className="border border-gray-100 dark:border-gray-700 rounded-2xl p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-mono">ORDER #{order._id}</p>
                      <div className="flex items-center space-x-2 mt-1 text-dimo-dark dark:text-gray-300">
                        <Calendar size={16} />
                        <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-2xl font-black text-dimo-blue dark:text-blue-400">Rs {order.totalPrice.toLocaleString()}</p>
                      {order.isPaid && (
                        <p className="flex items-center justify-end space-x-1 text-sm font-bold text-green-500 mt-1">
                          <CheckCircle size={16} />
                          <span>Paid</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-3 text-dimo-dark dark:text-gray-300">
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 rounded-md font-bold text-xs">{item.qty}x</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400">Rs {item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
