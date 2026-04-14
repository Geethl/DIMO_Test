import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, User as UserIcon, Calendar, CheckCircle, Heart, Settings, MapPin, Upload, Camera, FileText } from 'lucide-react';
import { setCredentials } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Link } from 'react-router-dom';

const InvoiceModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-dimo-dark dark:text-white mb-1">Official Invoice</h2>
            <p className="text-gray-500 font-mono text-sm">Order #{order._id}</p>
          </div>
          <p className="font-bold text-dimo-blue dark:text-blue-400 text-xl border-2 border-dimo-blue rounded-lg px-4 py-1 inline-block uppercase tracking-wider bg-white dark:bg-gray-800">
            {order.trackingStatus}
          </p>
        </div>
        <div className="p-8">
           <div className="grid grid-cols-2 gap-8 mb-8">
             <div>
               <h3 className="text-gray-400 font-bold tracking-wider text-xs mb-2 uppercase">Billed To</h3>
               <p className="text-dimo-dark dark:text-white font-medium">{order.userId || 'DIMO Customer'}</p>
             </div>
             <div>
               <h3 className="text-gray-400 font-bold tracking-wider text-xs mb-2 uppercase">Shipped To</h3>
               <p className="text-dimo-dark dark:text-white font-medium">{order.shippingAddress?.street || 'No Address Provided'}</p>
               <p className="text-dimo-dark dark:text-white font-medium">{order.shippingAddress?.city} {order.shippingAddress?.postalCode}</p>
               <p className="text-dimo-dark dark:text-white font-medium">{order.shippingAddress?.country}</p>
             </div>
           </div>
           
           <div className="space-y-4 border-t border-b border-gray-100 dark:border-gray-700 py-6 mb-6">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="bg-gray-100 dark:bg-gray-700 font-black text-xs px-2 py-1 rounded text-gray-500">{item.qty}x</span>
                    <span className="font-bold text-dimo-dark dark:text-gray-200">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Rs {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
           </div>
           
           <div className="flex justify-between items-end">
             <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Payment ID: <span className="font-mono">{order.paymentId || 'N/A'}</span></p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
             </div>
             <div className="text-right">
               <p className="text-gray-400 font-bold text-xs uppercase mb-1">Grand Total</p>
               <p className="text-4xl font-black text-dimo-red dark:text-red-400">Rs {order.totalPrice.toLocaleString()}</p>
             </div>
           </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold rounded-lg transition-colors">Close</button>
          <button onClick={() => window.print()} className="px-6 py-2 bg-gradient-to-r from-dimo-blue to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all flex items-center space-x-2">
            <FileText size={18} /> <span>Print PDF</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('settings');
  const [orders, setOrders] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [address, setAddress] = useState(userInfo?.address || { street: '', city: '', postalCode: '', country: '' });
  const [avatar, setAvatar] = useState(userInfo?.avatar || '');
  const [uploading, setUploading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          const { data } = await api.get(`/orders/myorders?userId=${userInfo._id}`);
          setOrders(data);
        } catch (error) { toast.error("Failed to fetch orders"); }
        finally { setLoadingOrders(false); }
      };
      fetchOrders();
    }
  }, [activeTab, userInfo]);

  useEffect(() => {
    if (activeTab === 'wishlist' && userInfo?.wishlist?.length > 0) {
      const fetchWishlist = async () => {
        try {
           const promises = userInfo.wishlist.map(id => api.get(`/products/${id}`));
           const results = await Promise.all(promises);
           setWishlistProducts(results.map(r => r.data));
        } catch (error) { console.error('Failed to load wishlist products'); }
      };
      fetchWishlist();
    } else if (activeTab === 'wishlist') {
      setWishlistProducts([]);
    }
  }, [activeTab, userInfo?.wishlist]);

  const submitProfileUpdate = async (payload, successMsg = 'Profile updated securely!') => {
    try {
      const { data } = await api.post('/auth/profile', { userId: userInfo._id, ...payload });
      dispatch(setCredentials(data));
      toast.success(successMsg, { icon: '🔒' });
      setOldPassword('');
      setNewPassword('');
      return true;
    } catch (error) { 
      toast.error(error.response?.data?.message || 'Failed to update profile'); 
      return false;
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    await submitProfileUpdate({ name, email, address, avatar }, 'Personal info & Address saved!');
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return toast.error('Both old and new passwords required');
    await submitProfileUpdate({ oldPassword, newPassword }, 'Password updated successfully!');
  };

  const handleMasterSave = async () => {
    const payload = { name, email, address, avatar };
    if (oldPassword && newPassword) {
      payload.oldPassword = oldPassword;
      payload.newPassword = newPassword;
    }
    const success = await submitProfileUpdate(payload, 'All changes saved successfully!');
    if (success) setIsEditing(false);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setAvatar(data);
      toast.success('Image uploaded! Click Save Profile to apply.');
    } catch (error) { toast.error('Image upload failed'); }
    finally { setUploading(false); }
  };

  if (!userInfo) return <div className="text-center p-20 dark:text-white">Please log in.</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B1121] p-4 sm:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex flex-col items-center mb-6">
            <div className="relative mb-4 group">
              {avatar ? (
                 <img src={`http://localhost:5000${avatar}`} alt={name} className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-xl" />
              ) : (
                 <div className="w-32 h-32 bg-gradient-to-tr from-dimo-blue to-dimo-green text-white rounded-full flex items-center justify-center text-5xl font-black shadow-xl">
                   {userInfo.name.charAt(0)}
                 </div>
              )}
              <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Camera size={18} className="text-dimo-dark dark:text-white" />
                <input type="file" onChange={uploadFileHandler} className="hidden" />
              </label>
            </div>
            <h1 className="text-2xl font-black text-dimo-dark dark:text-white text-center">{userInfo.name}</h1>
            <p className="text-sm text-gray-500 font-mono mb-4">{userInfo.role.toUpperCase()}</p>
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl flex flex-col overflow-hidden shadow-sm border border-gray-200/50 dark:border-gray-700/50">
             <button onClick={() => setActiveTab('settings')} className={`p-4 text-left font-bold flex items-center space-x-3 transition-colors ${activeTab === 'settings' ? 'bg-dimo-green/10 text-dimo-green border-l-4 border-dimo-green' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
               <Settings size={20} /> <span>Account Settings</span>
             </button>
             <button onClick={() => setActiveTab('orders')} className={`p-4 text-left font-bold flex items-center space-x-3 transition-colors ${activeTab === 'orders' ? 'bg-dimo-green/10 text-dimo-green border-l-4 border-dimo-green' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
               <Package size={20} /> <span>Order History</span>
             </button>
             <button onClick={() => setActiveTab('wishlist')} className={`p-4 text-left font-bold flex items-center space-x-3 transition-colors ${activeTab === 'wishlist' ? 'bg-dimo-green/10 text-dimo-green border-l-4 border-dimo-green' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
               <Heart size={20} /> <span>My Wishlist</span>
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-3/4">
          <AnimatePresence mode="wait">
            
            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <h2 className="text-2xl font-black text-dimo-dark dark:text-white">Account Configuration</h2>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="bg-dimo-blue hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors">
                      Update Details
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  // READ-ONLY MODE
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-gray-400 font-bold tracking-wider text-xs mb-3 uppercase">Identity</h3>
                      <p className="text-lg text-dimo-dark dark:text-white font-medium mb-1">{userInfo.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">{userInfo.email}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400 font-bold tracking-wider text-xs mb-3 uppercase flex items-center space-x-2"><MapPin size={14}/> <span>Saved Address Book</span></h3>
                      {userInfo.address?.street ? (
                        <>
                          <p className="text-lg text-dimo-dark dark:text-white font-medium mb-1">{userInfo.address.street}</p>
                          <p className="text-gray-600 dark:text-gray-400">{userInfo.address.city}, {userInfo.address.postalCode}</p>
                          <p className="text-gray-600 dark:text-gray-400">{userInfo.address.country}</p>
                        </>
                      ) : (
                        <p className="text-gray-500 italic">No delivery address saved yet.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  // EDIT MODE
                  <div className="space-y-10">
                    
                    {/* BLOCK 1: Info & Address */}
                    <form onSubmit={handleSaveInfo} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-black text-dimo-dark dark:text-white mb-6">Personal & Address Book</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
                          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-dimo-green outline-none dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-dimo-green outline-none dark:text-white" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="md:col-span-3">
                           <label className="block text-xs font-bold text-gray-500 mb-1">Street Address</label>
                           <input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="No 65, Ward Place" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-dimo-green outline-none dark:text-white" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">City</label>
                           <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-dimo-green outline-none dark:text-white" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Postal Code</label>
                           <input type="text" value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-dimo-green outline-none dark:text-white" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Country</label>
                           <input type="text" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-dimo-green outline-none dark:text-white" />
                        </div>
                      </div>
                      <div className="text-right">
                        <button type="submit" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-dimo-dark dark:text-white font-bold py-2 px-6 rounded-lg transition-colors text-sm">
                          Save Info & Address
                        </button>
                      </div>
                    </form>

                    {/* BLOCK 2: Security */}
                    <form onSubmit={handleSavePassword} className="bg-red-50/50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
                      <h3 className="text-lg font-black text-dimo-dark dark:text-white mb-6">Change Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Current Password *</label>
                          <input type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Required to change password" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-dimo-red outline-none dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">New Password</label>
                          <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Must be at least 6 characters" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-dimo-red outline-none dark:text-white" />
                        </div>
                      </div>
                      <div className="text-right">
                        <button type="submit" className="bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-bold py-2 px-6 rounded-lg transition-colors text-sm border border-red-200 dark:border-red-800">
                          Update Password
                        </button>
                      </div>
                    </form>

                    {/* MASTER ACTIONS */}
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-dimo-dark dark:hover:text-white font-bold transition-colors">
                        Cancel Editing
                      </button>
                      <button onClick={handleMasterSave} disabled={uploading} className="w-full sm:w-auto bg-gradient-to-r from-dimo-green to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black py-4 px-10 rounded-xl shadow-lg shadow-green-500/25 transition-transform active:scale-95 border-b-4 border-emerald-600">
                        {uploading ? 'Processing...' : 'Save All Changes & Close'}
                      </button>
                    </div>

                  </div>
                )}
              </motion.div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                 {loadingOrders ? <p className="text-center text-gray-400">Loading Orders...</p> : orders.length === 0 ? (
                   <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl p-16 text-center border border-gray-200/50 dark:border-gray-700/50">
                     <Package size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                     <h3 className="text-2xl font-bold text-dimo-dark dark:text-white mb-2">No Past Orders</h3>
                     <p className="text-gray-500">Your purchase history will appear here.</p>
                   </div>
                 ) : (
                   orders.map(order => (
                     <div key={order._id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex flex-col md:flex-row justify-between items-center group hover:border-dimo-blue/30 transition-colors">
                        <div className="mb-4 md:mb-0">
                          <p className="text-xs text-dimo-blue dark:text-blue-400 font-bold tracking-wider mb-1">ORDER #{order._id.substring(18).toUpperCase()}</p>
                          <p className="text-dimo-dark dark:text-white font-medium mb-1">{order.orderItems.length} Items Purchased</p>
                          <p className="text-gray-500 text-sm flex items-center"><Calendar size={14} className="mr-1"/> {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-6">
                           <div className="text-right">
                             <p className="text-2xl font-black text-dimo-red dark:text-red-400">Rs {order.totalPrice.toLocaleString()}</p>
                             <span className="text-xs font-bold text-green-500 uppercase">{order.trackingStatus}</span>
                           </div>
                           <button onClick={() => setSelectedOrder(order)} className="bg-gray-100 hover:bg-dimo-blue hover:text-white dark:bg-gray-700 dark:hover:bg-dimo-blue text-dimo-dark dark:text-white px-4 py-2 rounded-lg font-bold transition-colors">
                             View Invoice
                           </button>
                        </div>
                     </div>
                   ))
                 )}
              </motion.div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <motion.div key="wishlist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {wishlistProducts.length === 0 ? (
                  <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl p-16 text-center border border-gray-200/50 dark:border-gray-700/50">
                     <Heart size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                     <h3 className="text-2xl font-bold text-dimo-dark dark:text-white mb-2">Wishlist is Empty</h3>
                     <p className="text-gray-500 mb-6">Hit the Heart icon on products you love to save them here.</p>
                     <Link to="/products" className="bg-dimo-blue text-white px-8 py-3 rounded-full font-bold">Go to Storefront</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {wishlistProducts.map(product => (
                       <div key={product._id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex flex-col">
                          <Link to={`/product/${product._id}`} className="flex-grow">
                            <div className="h-32 bg-gray-100 dark:bg-gray-900 rounded-xl mb-4 flex items-center justify-center font-bold text-gray-300">DIMO</div>
                            <h4 className="font-bold text-dimo-dark dark:text-white line-clamp-1 mb-1">{product.name}</h4>
                            <p className="text-dimo-blue dark:text-blue-400 font-black">Rs {product.price.toLocaleString()}</p>
                          </Link>
                       </div>
                     ))}
                  </div>
                )}
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>
      {selectedOrder && <InvoiceModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
};

export default Profile;
