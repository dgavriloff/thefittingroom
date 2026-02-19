import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Camera,
  ArrowRight,
  Menu,
  X,
  Plus,
  Check,
  Scan,
  MoreHorizontal
} from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import Privacy from './Privacy';
import Terms from './Terms';
import Demo from './Demo';

const APP_STORE_URL = 'https://apps.apple.com/us/app/the-fitting-room/id6755918606';

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative w-10 h-10">
      <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
    </div>
    <span className="text-xl font-bold tracking-tight text-black">the fitting room</span>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-offwhite/90 backdrop-blur-xl border-b border-gray-200 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Logo />

        <div className="hidden md:flex items-center space-x-10 text-sm font-medium text-gray-500">
          <NavLink href="#how-it-works">how it works</NavLink>
          <NavLink href="#features">features</NavLink>

        </div>

        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Download The Fitting Room app from Apple App Store" className="hidden md:flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-900 transition-all transform hover:scale-[1.02]">
          <span>get the app</span>
        </a>

        <button className="md:hidden text-black" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-offwhite border-b border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col space-y-6">
              <NavLink href="#how-it-works" onClick={() => setIsOpen(false)}>how it works</NavLink>
              <NavLink href="#features" onClick={() => setIsOpen(false)}>features</NavLink>

              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Download The Fitting Room app from Apple App Store" className="w-full bg-black text-white py-4 rounded-xl font-bold block text-center">get the app</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="hover:text-black transition-colors"
  >
    {children}
  </a>
);

const PhoneFrame = ({ children }) => (
  <div className="relative w-[320px] h-[640px] bg-black rounded-[50px] p-3 shadow-2xl border-4 border-gray-200">
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>
    <div className="w-full h-full bg-white rounded-[38px] overflow-hidden relative selection:bg-none">
      {children}
    </div>
  </div>
);

const Hero = () => {
  return (
    <section className="min-h-screen pt-32 pb-20 relative flex items-center bg-brand-offwhite">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-bold text-gray-500 tracking-wider mb-4 block uppercase">Virtual Fitting Room</span>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-black mb-8 leading-[0.9]">
            try before <br />
            you buy.
          </h1>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-md">
            upload a photo. pick a fit. see it on you instantly. no more returns.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Download The Fitting Room app from Apple App Store" className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-900 transition-all hover:-translate-y-1">
              <Smartphone size={20} />
              download app
            </a>
            <Link to="/demo" className="flex items-center justify-center gap-3 bg-white text-black border border-gray-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-all">
              <Scan size={20} />
              view demo
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center lg:justify-end relative"
        >
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-200 to-blue-200 rounded-full blur-3xl opacity-30 -z-10 animate-pulse"></div>

          {/* iPhone Mockup reflecting the screenshot functionality */}
          <PhoneFrame>
            {/* Header */}
            <div className="p-6 flex justify-between items-center">
              <span className="font-bold text-xl">my clothes</span>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer">
                  <MoreHorizontal size={16} />
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="px-4 grid grid-cols-2 gap-3 pb-20">
              {/* Add New Card */}
              <div className="aspect-[3/4] rounded-3xl border-2 border-dashed border-black flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <Plus size={32} strokeWidth={1.5} />
                <span className="font-bold text-sm">add new</span>
              </div>

              {/* Clothes Cards */}
              {[
                { src: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=300", alt: "Model wearing loose pink pants, hands in pocket" },
                { src: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=300", alt: "Model holding a brown zip-up jacket on a hanger" },
                { src: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=300", alt: "White t-shirt with blue graphic and blue text that says ORIGINAL" }
              ].map((item, i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl bg-gray-50 overflow-hidden relative group">
                  <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Check size={12} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Button */}
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-white via-white to-transparent">
              <button className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-xl">
                try it on!
              </button>
            </div>
          </PhoneFrame>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-[40px] hover:shadow-xl transition-shadow duration-300 border border-gray-100">
    <div className="w-14 h-14 bg-brand-offwhite rounded-2xl flex items-center justify-center mb-6 text-black">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const Features = () => {
  return (
    <section id="features" className="py-32 bg-white rounded-t-[60px] -mt-20 z-10 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-20">
          <h2 className="text-5xl font-black text-black mb-6 tracking-tight">how it works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Camera size={28} />}
            title="scan body"
            desc="take a quick photo or enter your measurements. our ai builds your digital twin in seconds."
          />
          <FeatureCard
            icon={<Plus size={28} />}
            title="add clothes"
            desc="upload photos of clothes you want to try, or pick from our partner brands."
          />
          <FeatureCard
            icon={<Check size={28} />}
            title="perfect fit"
            desc="visualize exactly how it looks. check tightness, length and drape before you buy."
          />
        </div>
      </div>
    </section>
  );
};



const Footer = () => {
  return (
    <footer className="bg-white py-20 border-t border-gray-100">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
        <div>
          <Logo />
          <p className="mt-6 text-gray-500 max-w-xs">
            redefining the changing room experience for the digital age.
          </p>
        </div>
        <div className="flex gap-16 text-sm font-bold text-black">
          <div className="flex flex-col gap-4">
            <Link to="/privacy" className="hover:text-gray-500">privacy</Link>
            <Link to="/terms" className="hover:text-gray-500">terms</Link>
            <a href="mailto:denis.gavriloff@gmail.com" className="hover:text-gray-500">contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Home = () => {
  useEffect(() => {
    const images = [
      "/demo-1.png",
      "/demo-2.png",
      "/demo-3.png"
    ];

    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Features />

      <section className="bg-black text-white py-32 text-center rounded-t-[60px] -mt-10 relative z-20">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">ready to fit?</h2>
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Download The Fitting Room app from Apple App Store" className="inline-block bg-white text-black px-12 py-5 rounded-full text-xl font-bold hover:bg-gray-200 transition-width duration-300 transform hover:scale-105">
            download on app store
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
};

function App() {
  return (
    <div className="min-h-screen font-sans bg-brand-offwhite selection:bg-black selection:text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </div>
  );
}

export default App;
