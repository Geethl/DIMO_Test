import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    // Fetch mock sales data
    api.get('/admin/sales')
      .then(res => setSalesData(res.data))
      .catch(err => console.error("Could not fetch admin sales metrics", err));
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (uploadedFile) => {
    if (uploadedFile.type === "text/csv") {
      setFile(uploadedFile);
      setUploadStatus(null);
    } else {
      setUploadStatus({ type: 'error', msg: 'Please upload a valid CSV file.' });
    }
  };

  const submitCsv = async () => {
    if (!file) return;
    setUploadStatus({ type: 'loading', msg: 'Uploading...' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/admin/inventory/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus({ type: 'success', msg: response.data.message });
      setFile(null);
    } catch (error) {
      setUploadStatus({ type: 'error', msg: error.response?.data?.message || 'Upload failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="mb-10">
          <h1 className="text-3xl font-black text-dimo-dark">Executive Dashboard</h1>
          <p className="text-gray-500">Track analytics and manage bulk inventory across all branches.</p>
        </header>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-bold text-dimo-dark mb-6">Monthly Revenue ($)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0033A0" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0033A0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#0033A0" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Equipment vs Parts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-bold text-dimo-dark mb-6">Equipment vs Parts Sales</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip cursor={{fill: '#f9fafb'}} />
                  <Legend />
                  <Bar dataKey="equipment" fill="#0033A0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="parts" fill="#E31837" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* CSV Inventory Upload */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
           className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-dimo-dark">Bulk Inventory Update</h3>
              <p className="text-sm text-gray-500">Upload a CSV file to seamlessly update prices and stock arrays.</p>
            </div>
            <a href="#" className="text-sm text-dimo-blue font-medium hover:underline mt-2 md:mt-0">Download Template</a>
          </div>

          <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
             <div 
               className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${dragActive ? 'border-dimo-blue bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
               onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
             >
                <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={handleChange} />
                <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center justify-center">
                  <UploadCloud size={48} className={`mb-4 ${file ? 'text-dimo-blue' : 'text-gray-400'}`} />
                  <p className="text-dimo-dark font-medium text-lg">
                    {file ? file.name : "Drag & drop your CSV file here"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{file ? 'Ready to process' : 'or click to browse'}</p>
                </label>
             </div>

             {uploadStatus && (
                <div className={`mt-4 p-4 rounded-lg flex items-center space-x-2 ${
                  uploadStatus.type === 'error' ? 'bg-red-50 text-red-700' :
                  uploadStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                }`}>
                  {uploadStatus.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                  <span className="font-medium">{uploadStatus.msg}</span>
                </div>
             )}

             <div className="mt-6 flex justify-end">
               <button 
                 onClick={submitCsv}
                 disabled={!file || uploadStatus?.type === 'loading'}
                 className="bg-dimo-red hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md shadow-red-900/20"
               >
                 {uploadStatus?.type === 'loading' ? 'Processing...' : 'Upload & Sync Database'}
               </button>
             </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminDashboard;
