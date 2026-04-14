import React from 'react';
import { Mail, Phone, MapPin, Send, Building, Users, Globe } from 'lucide-react';

const AboutContact = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-dimo-blue text-white py-24 mb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
            Driving Innovation, <span className="text-dimo-red">Empowering Lives</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-200">
            Discover who we are, what we stand for, and how we can help you achieve your goals. Connect with us today.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dimo-dark mb-4">About <span className="text-dimo-blue">DIMO</span></h2>
            <div className="w-24 h-1 bg-dimo-red mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
              <p>
                Since our inception, DIMO has been at the forefront of providing class-leading solutions and 
                services across diverse sectors. With a relentless focus on excellence, we partner with world-renowned 
                brands to deliver innovative, sustainable, and reliable products.
              </p>
              <p>
                Our commitment transcends mere business transactions; we believe in building enduring relationships 
                founded on trust, integrity, and mutual respect. At DIMO, we are driven by a passion to fuel growth 
                and enhance the quality of life for the communities we serve.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-dimo-blue">
                  <Building size={28} />
                </div>
                <h3 className="text-xl font-bold text-dimo-dark mb-2">Our Legacy</h3>
                <p className="text-gray-600">Decades of unparalleled expertise and industry leadership.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="bg-red-50 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-dimo-red">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-bold text-dimo-dark mb-2">Our People</h3>
                <p className="text-gray-600">A dedicated team of professionals driving our vision forward.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 sm:col-span-2">
                <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-dimo-blue">
                  <Globe size={28} />
                </div>
                <h3 className="text-xl font-bold text-dimo-dark mb-2">Global Reach</h3>
                <p className="text-gray-600">Connecting local markets with world-class international brands and standards.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dimo-dark mb-4">Get In <span className="text-dimo-red">Touch</span></h2>
            <div className="w-24 h-1 bg-dimo-blue mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
              Have questions or need assistance? Our team is continually ready to support you. Reach out to us via the form or contact details below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Details */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start space-x-4 group cursor-pointer hover:border-dimo-blue transition-colors duration-300">
                <div className="bg-blue-50 p-3 rounded-full text-dimo-blue group-hover:bg-dimo-blue group-hover:text-white transition-colors duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-dimo-dark mb-1">Head Office</h4>
                  <p className="text-gray-600">65 Ward Place,<br />Colombo 07, Sri Lanka</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start space-x-4 group cursor-pointer hover:border-dimo-blue transition-colors duration-300">
                <div className="bg-blue-50 p-3 rounded-full text-dimo-blue group-hover:bg-dimo-blue group-hover:text-white transition-colors duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-dimo-dark mb-1">Phone</h4>
                  <p className="text-gray-600">+94 11 244 9797<br />+94 11 244 9798</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start space-x-4 group cursor-pointer hover:border-dimo-red transition-colors duration-300">
                <div className="bg-red-50 p-3 rounded-full text-dimo-red group-hover:bg-dimo-red group-hover:text-white transition-colors duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-dimo-dark mb-1">Email</h4>
                  <p className="text-gray-600">dimo@dimolanka.com<br />support@dimolanka.com</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dimo-blue focus:border-dimo-blue transition-colors outline-none" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dimo-blue focus:border-dimo-blue transition-colors outline-none" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dimo-blue focus:border-dimo-blue transition-colors outline-none" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dimo-blue focus:border-dimo-blue transition-colors outline-none" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea rows="5" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-dimo-blue focus:border-dimo-blue transition-colors outline-none resize-none" placeholder="Your message here..."></textarea>
                  </div>
                  <button type="button" className="w-full sm:w-auto px-8 py-4 bg-dimo-blue hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5">
                    <span>Send Message</span>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutContact;
