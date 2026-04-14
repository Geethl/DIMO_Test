import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, Wrench } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B1121] transition-colors duration-300">
      
      {/* Premium Glassmorphic Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Animated Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-dimo-blue/30 dark:bg-dimo-blue/40 mix-blend-multiply filter blur-[100px] animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-dimo-green/20 dark:bg-dimo-green/30 mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-400/20 dark:bg-blue-900/40 mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md"
          >
            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-dimo-blue to-dimo-green">
              New: DIMO Online Storefront Live
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-dimo-dark dark:text-white"
          >
            Industrial Solutions <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dimo-blue to-dimo-green">
              Engineered for Excellence
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto font-medium"
          >
            From Genuine Engine Parts to Premium Power Tools, discover digital inventory tailored for your high-performance needs.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/products" className="w-full sm:w-auto bg-gradient-to-r from-dimo-blue to-blue-700 hover:from-dimo-green hover:to-emerald-500 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-green-500/30 hover:scale-105">
              Explore Showroom
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
           {[
             { icon: ShieldCheck, title: "100% Genuine", label: "Certified Parts" },
             { icon: Truck, title: "Fast Delivery", label: "Island-wide Shipping" },
             { icon: Wrench, title: "Expert Support", label: "DIMO Professionals" },
             { icon: Clock, title: "24/7 Access", label: "Digital Storefront" },
           ].map((badge, i) => (
             <div key={i} className="flex flex-col items-center">
               <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-3 text-dimo-blue dark:text-blue-400">
                 <badge.icon size={28} />
               </div>
               <h4 className="font-bold text-dimo-dark dark:text-white">{badge.title}</h4>
               <p className="text-sm text-gray-500 dark:text-gray-400">{badge.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Floating 3D Category Cards */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-dimo-dark dark:text-white mb-4">Premium Categories</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-dimo-blue to-dimo-green mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {['Engine Parts', 'Power Tools', 'Vehicle Accessories'].map((cat, i) => (
              <motion.div 
                key={cat}
                whileHover={{ y: -15, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dimo-blue to-dimo-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-2xl mb-8 flex items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:border-dimo-green/30 transition-colors">
                  <span className="text-gray-400 dark:text-gray-600 font-black tracking-widest uppercase opacity-30 select-none">DIMO {cat}</span>
                </div>
                
                <h3 className="text-2xl font-black text-dimo-dark dark:text-white mb-3">{cat}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">Authentic {cat.toLowerCase()} built to endure the harshest industrial environments.</p>
                
                <Link to="/products" className="inline-flex items-center text-dimo-blue dark:text-blue-400 font-bold group-hover:text-dimo-green transition-colors">
                  Shop Now <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
