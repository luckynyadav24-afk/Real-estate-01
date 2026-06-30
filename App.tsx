import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView, useSpring } from 'framer-motion';
import { ChevronRight, Menu, X, ArrowUpRight, Layers, Compass, PenTool, Sparkles } from 'lucide-react';
import { cn } from './utils/cn';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
      isScrolled ? "bg-black/80 backdrop-blur-md py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-serif tracking-tighter"
        >
          POLIDORI<span className="text-accent">.</span>
        </motion.div>

        <div className="hidden md:flex items-center space-x-12">
          {['Estates', 'Our Craft', 'Philosophy', 'Inquire'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm font-medium tracking-widest uppercase hover:text-accent transition-colors"
            >
              {item}
            </motion.a>
          ))}
        </div>

        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-t border-white/10 mt-4 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {['Estates', 'Our Craft', 'Philosophy', 'Inquire'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-lg font-serif"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const maskY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-100%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* The Building Reveal */}
        <motion.div style={{ scale }} className="absolute inset-0 w-full h-full">
          <img 
            src="/images/hero-mega-structure.jpg" 
            alt="Luxury Landmark" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </motion.div>

        {/* The Shutter Mask */}
        <motion.div 
          style={{ y: maskY }}
          className="absolute inset-0 z-20 bg-[#0a0a0a] flex items-center justify-center"
        >
          <div className="text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <h2 className="text-accent uppercase tracking-[0.3em] text-sm mb-4">Architecture of Eternity</h2>
              <h1 className="text-5xl md:text-8xl font-serif mb-8 max-w-4xl mx-auto leading-tight">
                We don't build houses.<br />
                <span className="italic">We unveil landmarks.</span>
              </h1>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-px h-12 bg-accent/50" />
                <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll to Unveil</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Overlay Content after reveal */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.4, 0.6], [0, 1]) }}
          className="absolute bottom-20 left-10 z-30 pointer-events-none"
        >
          <div className="text-white">
            <p className="text-sm uppercase tracking-widest mb-2 text-accent">Current Landmark</p>
            <h3 className="text-3xl font-serif italic text-glow">The Azure Obsidian</h3>
            <p className="text-white/60 text-sm max-w-xs mt-2 font-sans">A symbiotic masterpiece carved into the Amalfi coastline.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AnimatedNumber = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const end = value;
      const duration = 2000;
      let startTime: number | null = null;

      const step = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setDisplayValue(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-serif">
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const Stats = () => {
  const stats = [
    { label: "Estates Delivered", value: 106, suffix: "" },
    { label: "Sq. Ft. Built", value: 1.4, suffix: "M" },
    { label: "Years of Grandeur", value: 12, suffix: "" },
  ];

  return (
    <section className="py-32 bg-[#0a0a0a] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-6xl md:text-7xl mb-4 text-white group-hover:text-accent transition-colors duration-500">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs uppercase tracking-[0.4em] text-white/40 font-sans">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessCard = ({ title, desc, icon: Icon, image, index }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-[450px] overflow-hidden bg-zinc-900 border border-white/5"
    >
      <div className="absolute inset-0 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
        <img src={image} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="mb-6 w-12 h-12 border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all duration-500">
          <Icon size={20} />
        </div>
        <h3 className="text-2xl font-serif mb-3 group-hover:text-accent transition-colors">{title}</h3>
        <p className="text-sm text-white/50 leading-relaxed font-sans max-w-xs transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          {desc}
        </p>
      </div>

      <div className="absolute top-4 right-4 text-[60px] font-serif opacity-5 group-hover:opacity-10 transition-opacity text-white leading-none">
        0{index + 1}
      </div>
    </motion.div>
  );
};

const ProcessGrid = () => {
  const processes = [
    { title: "The Ground", desc: "Selecting only the most prestigious and challenging terrains where others see obstacles, we see foundations.", icon: Compass, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80" },
    { title: "The Frame", desc: "Engineering that defies gravity. Our skeletons are built with structural integrity that outlasts generations.", icon: Layers, image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80" },
    { title: "The Craft", desc: "Meticulous attention to every millimetre. We employ the world's most elite artisans for finishes that breathe.", icon: PenTool, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80" },
    { title: "The Reveal", desc: "The transformation from blueprint to masterpiece. A legacy handed over to its rightful custodian.", icon: Sparkles, image: "/images/mansion-1.jpg" },
  ];

  return (
    <section id="our-craft" className="py-32 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-accent uppercase tracking-widest text-sm mb-4">Our Methodology</h2>
          <h3 className="text-4xl md:text-5xl font-serif">The Genesis of Grandeur</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {processes.map((p, i) => (
            <ProcessCard key={i} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PropertyGallery = () => {
  const properties = [
    { name: "The Zenith Villa", location: "Swiss Alps", image: "/images/mansion-2.jpg", price: "$42M" },
    { name: "Glass Horizon", location: "Malibu, CA", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80", price: "$35M" },
    { name: "Amber Sanctuary", location: "Dubai", image: "https://images.unsplash.com/photo-1600607687940-c52fb0478996?auto=format&fit=crop&q=80", price: "$89M" },
    { name: "Elysium Estate", location: "Bora Bora", image: "/images/hero-mega-structure.jpg", price: "$120M" },
  ];

  return (
    <section id="estates" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-accent uppercase tracking-widest text-sm mb-4">Active Portfolio</h2>
            <h3 className="text-4xl md:text-5xl font-serif">The Collections</h3>
          </div>
          <button className="flex items-center gap-4 group">
            <span className="uppercase tracking-[0.3em] text-xs">View All Assets</span>
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <ChevronRight size={16} />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {properties.map((prop, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-[16/10] overflow-hidden"
            >
              <img 
                src={prop.image} 
                alt={prop.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-accent text-xs uppercase tracking-widest mb-1">{prop.location}</p>
                    <h4 className="text-3xl font-serif">{prop.name}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Starting From</p>
                    <p className="text-xl font-serif">{prop.price}</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-8 right-8 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer">
                <ArrowUpRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="inquire" className="bg-black pt-32 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          <div>
            <h2 className="text-6xl md:text-8xl font-serif mb-12">Begin Your<br /><span className="text-accent italic">Legacy.</span></h2>
            <form className="space-y-8 max-w-md">
              <div className="relative group">
                <input type="text" placeholder="Your Name" className="w-full bg-transparent border-b border-white/20 py-4 focus:border-accent outline-none transition-colors" />
                <div className="absolute bottom-0 left-0 w-0 h-px bg-accent group-focus-within:w-full transition-all duration-500" />
              </div>
              <div className="relative group">
                <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-white/20 py-4 focus:border-accent outline-none transition-colors" />
                <div className="absolute bottom-0 left-0 w-0 h-px bg-accent group-focus-within:w-full transition-all duration-500" />
              </div>
              <button className="flex items-center gap-6 group py-4">
                <span className="uppercase tracking-[0.4em] text-sm">Send Inquiry</span>
                <div className="w-16 h-16 rounded-full border border-accent flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                  <ArrowUpRight size={24} />
                </div>
              </button>
            </form>
          </div>
          <div className="flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/30 mb-6">Offices</h4>
                <ul className="space-y-4 text-sm">
                  <li>Milan, Italy</li>
                  <li>Dubai, UAE</li>
                  <li>London, UK</li>
                  <li>New York, US</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/30 mb-6">Social</h4>
                <ul className="space-y-4 text-sm">
                  <li className="hover:text-accent transition-colors cursor-pointer">Instagram</li>
                  <li className="hover:text-accent transition-colors cursor-pointer">LinkedIn</li>
                  <li className="hover:text-accent transition-colors cursor-pointer">Vimeo</li>
                </ul>
              </div>
            </div>
            <div className="mt-20">
              <div className="text-9xl font-serif text-white/5 select-none leading-none tracking-tighter">
                POLIDORI
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-[10px] uppercase tracking-[0.2em] text-white/30 font-sans">
          <div>© 2024 Polidori Development Group. All Rights Reserved.</div>
          <div className="flex gap-8">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Legal Credits</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate asset loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-[#0a0a0a] min-h-screen text-white selection:bg-accent selection:text-black">
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              className="h-px bg-accent mb-4"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-serif italic text-xl tracking-widest"
            >
              POLIDORI
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left"
        style={{ scaleX: useSpring(useScroll().scrollYProgress, { stiffness: 100, damping: 30 }) }}
      />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <ProcessGrid />
        <PropertyGallery />
      </main>
      <Footer />

      {/* Custom Cursor / Noise / etc can be added here */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[99]" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
    </div>
  );
}
