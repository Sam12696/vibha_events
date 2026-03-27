/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  ArrowRight, 
  Globe, 
  Share2, 
  User, 
  Quote, 
  Check,
  ChevronRight,
  Phone,
  Mail,
  X
} from "lucide-react";
import React, { useState, useEffect, FormEvent, Component, ErrorInfo, ReactNode } from "react";
import { Toaster, toast } from "sonner";
import { Routes, Route, useLocation } from "react-router-dom";
import { PortfolioGallery } from "./components/PortfolioGallery";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<any, any> {
  public state: any = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: any): any {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsedError = JSON.parse(this.state.error.message);
        if (parsedError.error) {
          errorMessage = `${parsedError.error} (Op: ${parsedError.operationType})`;
        }
      } catch (e) {
        errorMessage = this.state.error.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Application Error</h2>
            <p className="text-stone-400 mb-8">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="gold-gradient text-on-primary px-8 py-3 font-bold uppercase tracking-widest rounded-lg"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

const ConsultationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', description: '' });
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  if (!isOpen) return null;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { fullName?: string; email?: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    toast.success("Consultation request received. Our concierge will contact you shortly.");
    setFormData({ fullName: '', email: '', description: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-surface-container-low border border-outline-variant/20 p-8 md:p-12 rounded-2xl max-w-lg w-full shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-3xl font-headline font-bold text-[#f9f9f9] mb-2 uppercase tracking-tight">Initialize Consultation</h3>
        <p className="text-on-surface-variant text-sm mb-8">Enter your details for a bespoke architectural briefing.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 border-b border-outline-variant/30 group">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant group-focus-within:text-primary">Full Name *</label>
            <input 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-transparent border-none py-3 text-on-surface placeholder:text-outline-variant focus:ring-0 outline-none" 
              placeholder="ALEXANDER STERLING" 
              type="text"
            />
            {errors.fullName && <p className="text-red-400 text-[10px] mt-1">{errors.fullName}</p>}
          </div>
          <div className="space-y-2 border-b border-outline-variant/30 group">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant group-focus-within:text-primary">Email Address *</label>
            <input 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-transparent border-none py-3 text-on-surface placeholder:text-outline-variant focus:ring-0 outline-none" 
              placeholder="ALEX@VIBHAEVENTS.COM" 
              type="email"
            />
            {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
          </div>
          <div className="space-y-2 border-b border-outline-variant/30 group">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant group-focus-within:text-primary">Brief Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-transparent border-none py-3 text-on-surface placeholder:text-outline-variant focus:ring-0 outline-none resize-none h-24" 
              placeholder="TELL US ABOUT YOUR VISION..."
            ></textarea>
          </div>
          <button type="submit" className="w-full gold-gradient text-on-primary py-4 font-bold uppercase tracking-widest transition-transform duration-300 hover:scale-[1.02]">
            Submit Request
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Navbar = ({ onOpenConsultation }: { onOpenConsultation: () => void }) => (
  <nav className="fixed top-0 w-full z-50 bg-surface-bright/60 backdrop-blur-xl flex justify-between items-center px-6 md:px-12 py-6">
    <div className="flex items-center gap-8">
      <div className="text-lg md:text-xl font-bold tracking-[0.2em] text-[#f9f9f9] uppercase">
        Vibha Events
      </div>
      <div className="hidden lg:flex items-center gap-6 text-[10px] text-on-surface-variant tracking-widest uppercase border-l border-outline-variant/30 pl-8">
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3 text-primary" />
          <span>+91 98765 43210</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-3 h-3 text-primary" />
          <span>contact@vibhaevents.com</span>
        </div>
      </div>
    </div>
    <div className="hidden md:flex gap-10 font-headline tracking-tight text-sm uppercase font-semibold">
      <a className="text-on-surface-variant hover:text-[#f9f9f9] transition-all duration-500" href="/#experience">Experience</a>
      <a className="text-on-surface-variant hover:text-[#f9f9f9] transition-all duration-500" href="/#services">Services</a>
      <a className="text-on-surface-variant hover:text-[#f9f9f9] transition-all duration-500" href="/#portfolio">Portfolio</a>
    </div>
    <button 
      onClick={onOpenConsultation}
      className="gold-gradient text-on-primary px-4 md:px-6 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-transform duration-300 hover:scale-105"
    >
      Book a Consultation
    </button>
  </nav>
);

const SubtleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    <motion.div 
      animate={{ 
        x: [0, 100, 0], 
        y: [0, 50, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      className="absolute -top-1/4 -left-1/4 w-full h-full bg-primary/10 rounded-full blur-[120px]"
    />
    <motion.div 
      animate={{ 
        x: [0, -80, 0], 
        y: [0, 120, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 25, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-primary-container/10 rounded-full blur-[120px]"
    />
  </div>
);

const Hero = ({ onOpenConsultation }: { onOpenConsultation: () => void }) => (
  <section id="experience" className="relative h-screen flex items-center px-6 md:px-12 overflow-hidden">
    <SubtleBackground />
    <div className="absolute inset-0 z-0">
      <motion.img 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-full h-full object-cover opacity-60" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDylnf94tS6sbOmWzpczRdZYLoK5SlHe_pmNAkKLI1SetJkgfn7aqoeQBWZE0O8qYBuyfTWIx1nxkU-g09TDKOmD3y6HkPpbb2Hkagk4VmKPPKJ5K9rhRAJKY_FFWEj4vBXkWAjkaoRMDjrGO0yduhDqxo5VQKcE1SJetgcXXF2wlns6nWMx-_nNyu5iYVe72vY_ZXDDj2SyEw0TSm-a1fsXxdHnTGjT4mAwfTF7NE3wTCoa_ZU1qK5CdH8Dt0Uh2ULuGxy4XFG1R8"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
    </div>
    <div className="relative z-10 max-w-4xl">
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-primary font-headline uppercase tracking-[0.4em] text-xs md:text-sm mb-6"
      >
        The Art of Architecture
      </motion.p>
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="text-6xl md:text-9xl font-headline font-extrabold text-[#f9f9f9] leading-[0.9] tracking-tighter mb-12"
      >
        Crafting <br/>Unforgettable <br/><span className="text-primary-dim">Experiences.</span>
      </motion.h1>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex flex-wrap gap-6"
      >
        <button 
          onClick={onOpenConsultation}
          className="gold-gradient text-on-primary px-8 md:px-10 py-4 md:py-5 font-bold uppercase tracking-widest transition-all duration-500 hover:brightness-110"
        >
          Book a Consultation
        </button>
        <button 
          onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          className="border border-outline/30 text-on-surface-variant px-8 md:px-10 py-4 md:py-5 font-bold uppercase tracking-widest hover:bg-surface-bright/20 transition-all duration-500"
        >
          Explore Services
        </button>
      </motion.div>
    </div>
  </section>
);

const Services = () => {
  const services = [
    {
      title: "Event Planning",
      desc: "Master blueprinting and strategic timeline management.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2y8eXIjXqDs-3N2Pvnga0-9t13TVwuiBRzMpAN0Aqt7Y0ad1FZotEtmJUn5TToqfG38l8Og_WarSqinUYvjRmN98wm6DtGkqinz2l2n6a53eInSf9rGADG_I6bfovPxuC7UcqJOwsaBFR2cr733gn8bVUwl2AP8oL4sNi5och1mBxRXdzIFPPfPp8MruYOwhPMjaB7G0DopcWtDOQMNKaO-Pa8eU1mkeVb_As4dmMdmcxtobhrGaAtXxMReIie2UkxCJXPTwqpe4",
      fullDesc: "Vibha Events provides comprehensive event planning services, from initial concept to final execution. Our team of experts handles everything from venue selection and vendor management to budget tracking and timeline coordination. We ensure every detail is meticulously planned and executed to perfection."
    },
    {
      title: "Decoration",
      desc: "Floral architecture and bespoke interior installations.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuADk4pQbbhOTk3ALnKVqOYbrnrrWimPDDOcm6pH1IJB0cRvWKX3jOg6lSdUpB_Z0dx-5c4cFK-Te0bcI7-CHSB8z2PsQals4eXAZK1CdH3CYBNzd6lhGDr5O5z-R9VdbiHpacafyGLzbgVvtUvWJH7bWPLfm-XIUnR_LUWg6eEwfWya2hBhTfFCRRjpgOETB6yXN4AoYjiKYa2_3U9Mttv7ywVhtBnmHXBKqEX8V2JKiKFOWSXBQxZXBIh7G_wQlOzKN4EvtJXqHzs",
      fullDesc: "Our decoration services are designed to transform any space into a breathtaking environment. We specialize in floral architecture, bespoke interior installations, and thematic decor that reflects your unique style and vision. From elegant weddings to high-profile corporate events, our decorations create an unforgettable ambiance."
    },
    {
      title: "Catering",
      desc: "Michelin-star culinary journeys and sommelier services.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAKHfFp-eTSdkVe-AwXhTMXTovnLdr0aJU_S1QWh9ge5m21fnbG5ZXQ1MTOftiZM7BVfg3sQJzxjN0LkmHr1XF682LP84Rmc7Wj-ex8U_6mj36UtD8rtrdjT8j2Ar1bBU0qfNC_rII2hYnmDtV0texo2m_Ub1-Oj_pqRTg6qWN_3udPpMMFP4JoIMW2qm5ARVdPYb339Mxw_NsjPoCYwD5oL-vGBqGm2mZ-8-p29BW60uk5u3IcTMBS8nxWbcWEXY6YfPSgloI3TA",
      fullDesc: "Experience a Michelin-star culinary journey with Vibha Events. Our catering services offer a wide range of gourmet menus tailored to your preferences. From exquisite hors d'oeuvres to multi-course dinners, our chefs use only the finest ingredients to create dishes that are as beautiful as they are delicious. We also provide professional sommelier services to complement your meal."
    },
    {
      title: "Entertainment",
      desc: "Curated global talent and immersive stage productions.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsUD_cO4KMxfJvK1EcfwRVAKVWzRs_MzeTSdC9RcMV05KSsroukRmS_BXKBrhzM4TTUAiaqFeCp12S5wYphIWchs1l2K8sigXL3YQTH7ifMDaLkeZa5eQLoCaPTFavvAKfokQC45BPbA2Gt2S6xkPVMODDLyO6hEK8W_0PqIDFyCbyMkpmqdeaZWiJL3HAGmPUD4p5Pgx2qqi4D0rrDBiSW0_KARNc7oYElYnUb0trCBJNrADl_hTA1IXmd1wYhPuUPfCvUnSfggw",
      fullDesc: "Vibha Events brings world-class entertainment to your event. We curate a diverse range of global talent, from live bands and DJs to specialty performers and immersive stage productions. Our team handles all aspects of entertainment management, ensuring a seamless and engaging experience for your guests."
    }
  ];

  const openServiceDetails = (service: typeof services[0]) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${service.title} - Vibha Events</title>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background-color: #0e0e0e;
            color: #e7e5e4;
            margin: 0;
            padding: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
          }
          .container {
            max-width: 800px;
            width: 100%;
            background-color: #191a1a;
            padding: 40px;
            border-radius: 16px;
            border: 1px solid #484848;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          h1 {
            font-family: 'Manrope', sans-serif;
            color: #e9c176;
            font-size: 3rem;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: -0.02em;
          }
          img {
            width: 100%;
            height: 400px;
            object-cover: cover;
            border-radius: 12px;
            margin-bottom: 30px;
          }
          p {
            font-size: 1.125rem;
            line-height: 1.8;
            color: #acabaa;
          }
          .back-btn {
            margin-top: 40px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #e9c176 0%, #5d4201 100%);
            color: #553c00;
            text-decoration: none;
            font-weight: bold;
            border-radius: 8px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${service.title}</h1>
          <img src="${service.img}" alt="${service.title}">
          <p>${service.fullDesc}</p>
          <a href="#" onclick="window.close(); return false;" class="back-btn">Close Details</a>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <section id="services" className="py-32 bg-surface">
      <div className="px-6 md:px-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter uppercase max-w-xl leading-none">
          Core <br/>Ecosystem of Luxury
        </h2>
        <p className="text-on-surface-variant max-w-md font-light leading-relaxed">
          From initial blueprint to the final orchestration, we provide a seamless vertical integration of services designed for the ultra-discerning.
        </p>
      </div>
      <div className="flex overflow-x-auto pb-12 px-6 md:px-12 gap-6 no-scrollbar snap-x">
        {services.map((service, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            onClick={() => openServiceDetails(service)}
            className="flex-shrink-0 w-[300px] md:w-[400px] aspect-[3/4] group relative overflow-hidden rounded-xl snap-center cursor-pointer"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src={service.img} 
              alt={service.title}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 p-8 w-full">
              <h3 className="text-2xl font-headline font-bold text-white mb-2">{service.title}</h3>
              <p className="text-on-surface-variant text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {service.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Masterpieces = () => {
  const categories = ["All", "Corporate", "Wedding", "Private Party"];
  const [active, setActive] = useState("All");

  const items = [
    {
      cat: "Corporate Mastery",
      title: "The Zenith Launch",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT93Oq54BIY8Vaie576IPOfOXY_U2FPzmFNbog0pxgkIrreuIuyJ8gXCWr5FKoH2ZDuNXyOUV773QkZsEjLc8RpFpDjusQ0HH4yH7rcpkv58HxXuvtj7wNHNLDUud7Xu71qke07XHiZ4v-SMoKLl8iwiPDW9gXaeVLGBMfljI3aIImP4G7hM6jWO8kBH2GoQVc9loOltuIo5F5sM3p6ExTU8V_utPky18-HbDDWdxi8mVX6HqnOjSghRaaQ4qPTYZVgDcHWE5FHbU",
      span: "md:col-span-8",
      height: "h-[400px] md:h-[600px]"
    },
    {
      cat: "Vow Renewal",
      title: "Skyline Union",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdEoo9XensDm8whVFOatysoe_7TnWr7tvG_evxvDPKcIlZXS5zy6W6GAjv5TyeX7zsQE8ciK21cD-EN57e1eNEqyn9KTQixjXPVePh3xVKIvEc5YiyTwRosHvoJ9ipI4Q9ofYjiJR2XnKCXCoD2P3Ye8GXsvgPDde2oITu2-QUobayEikuPGlyZBbJ0YPw_rVLefw8sErppYprBRy45XWJYjsW45LRwrFADDMoU4XTR2NmUT4V_orQfH8cJmByURk0k72n-yFHz6k",
      span: "md:col-span-4",
      height: "h-[400px] md:h-[600px]"
    },
    {
      cat: "Private Affair",
      title: "Secret Garden Gala",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdFRyhlp99_-E9aKKWUvJClNjjZlAI-98tdnihdYGYsp_G4p8oA8R-WI96IPVo3DYMmR8_o1S_SB6Jmvs_sAzyvdUYY6gTmWjwUqw9VOQWmBZFru8ByxdcUxeiTEZwddCz0m4Hq82QztGGjCk6V68pDZ9S7l-fYUFZVw1PecuIica1caA4H4t7wCQfXMBXnOuZuKGADYxnlCY2Vcwy9HnJn3c9SujdbbxBxIIONZqjzHP9HkFaq5Ws1Aw_a53ybCYgyWyJOc0ljVk",
      span: "md:col-span-4",
      height: "h-[400px]"
    },
    {
      cat: "Tech Forum",
      title: "Global Innovation Summit",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFsaGm4PWu2fWXSezezN0Rq0Oa-BDZhd9fzits5wsAdKvbayOemXXGt63uDMNim4vmtrklFWSRoWxXjbaddElvqfYqM8Jq3-b1oVqZkhfuPs5uJLtVACKWdH0iWPsum2RB0Df5Af_cJNENWqmA7rmvjezJ5K8N7rfpgXCiGPC3WMdS4V2O8V9tTAIWDCKBpiTmz6wpgRvb1rxtVd_M84_b1NRI_eHkhTL5GbkaPvxHiP04IvIFLkWi26mNJhzPJtTIr3DnVYbsFok",
      span: "md:col-span-8",
      height: "h-[400px]"
    }
  ];

  return (
    <section id="masterpieces" className="relative py-32 bg-surface-container-low px-6 md:px-12 overflow-hidden">
      <SubtleBackground />
      <div className="relative z-10 mb-24 text-center">
        <h2 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tighter uppercase mb-8">The Masterpieces</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActive(cat)}
              className={`transition-colors duration-300 pb-2 border-b ${active === cat ? "text-primary border-primary" : "border-transparent hover:text-on-surface"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {items.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`${item.span} group relative overflow-hidden rounded-xl ${item.height}`}
          >
            <img 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110" 
              src={item.img} 
              alt={item.title}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8 md:p-12">
              <div className="flex flex-col gap-1">
                <p className="text-primary uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                  {item.cat}
                </p>
                <h4 className="text-2xl md:text-4xl font-headline text-white leading-tight transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                  {item.title}
                </h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const EngineRoom = ({ onOpenConsultation }: { onOpenConsultation: () => void }) => {
  const [eventType, setEventType] = useState("Wedding");
  const [targetDate, setTargetDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [errors, setErrors] = useState<{ targetDate?: string; guestCount?: string }>({});

  const formatDateToDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setGuestCount(value);
      if (value) {
        setErrors({...errors, guestCount: undefined});
      }
    }
  };

  const handleDateBlur = () => {
    if (targetDate && !targetDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setErrors({...errors, targetDate: "Invalid date"});
    } else if (targetDate) {
      setErrors({...errors, targetDate: undefined});
    }
  };
  
  return (
    <section className="py-32 bg-surface">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter uppercase mb-4 text-primary">The Engine Room</h2>
          <p className="text-on-surface-variant font-light text-lg md:text-xl">Configure your event architectural blueprint.</p>
        </div>
        
        <div className="bg-surface-container rounded-xl p-8 md:p-12 border border-outline-variant/10">
          <div className="relative w-full h-[1px] bg-outline-variant mb-16">
            <div className="absolute top-0 left-0 h-full w-1/3 gold-gradient shadow-[0_0_8px_#e9c176]"></div>
            <div className="absolute -top-3 left-[33%] w-6 h-6 rounded-full bg-surface border border-primary flex items-center justify-center text-[10px] text-primary font-bold">1</div>
          </div>
          
          <div className="space-y-12">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-8">01. Select Event Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Corporate", "Wedding", "Private", "Other"].map(type => (
                  <button 
                    key={type}
                    onClick={() => setEventType(type)}
                    className={`py-6 border transition-all duration-300 text-sm uppercase tracking-widest ${eventType === type ? "border-primary text-primary bg-primary-container/10" : "border-outline-variant/30 text-on-surface-variant hover:border-primary bg-surface-container-low"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-8">02. Required Architecture</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
                {[
                  "Catering & Spirits", "Floral & Decor", "Media & Production",
                  "VIP Transportation", "Global Logistics", "Guest Management"
                ].map((service, i) => (
                  <label key={i} className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        className="peer appearance-none w-5 h-5 border border-outline bg-transparent checked:bg-primary checked:border-primary transition-all cursor-pointer" 
                        type="checkbox" 
                        defaultChecked={i === 1 || i === 5}
                      />
                      <Check className="absolute w-3 h-3 text-on-primary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-on-surface group-hover:text-primary transition-colors uppercase text-xs font-semibold tracking-wide">
                      {service}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
              <div className="space-y-2 border-b border-outline-variant/30 group">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant group-focus-within:text-primary">Target Date</label>
                <input 
                  type="date" 
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  onBlur={handleDateBlur}
                  className="w-full bg-transparent border-none py-4 text-on-surface placeholder:text-outline-variant focus:ring-0 outline-none cursor-pointer" 
                  placeholder="Select date"
                />
                {targetDate && <p className="text-on-surface-variant text-[10px] mt-1">Selected: {formatDateToDisplay(targetDate)}</p>}
                {errors.targetDate && <p className="text-red-400 text-[10px] mt-1">{errors.targetDate}</p>}
              </div>
              <div className="space-y-2 border-b border-outline-variant/30 group">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant group-focus-within:text-primary">Guest Count</label>
                <input 
                  type="text"
                  value={guestCount}
                  onChange={handleGuestCountChange}
                  className="w-full bg-transparent border-none py-4 text-on-surface placeholder:text-outline-variant focus:ring-0 outline-none" 
                  placeholder="e.g. 500"
                  maxLength="6"
                />
                {guestCount && <p className="text-on-surface-variant text-[10px] mt-1">Guests: {guestCount}</p>}
                {errors.guestCount && <p className="text-red-400 text-[10px] mt-1">{errors.guestCount}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-12">
              <button 
                onClick={() => {
                  const newErrors: { targetDate?: string; guestCount?: string } = {};
                  if (!targetDate) {
                    newErrors.targetDate = "Target date is required";
                  }
                  if (!guestCount) {
                    newErrors.guestCount = "Guest count is required";
                  } else if (!/^\d+$/.test(guestCount)) {
                    newErrors.guestCount = "Must be a valid number";
                  }
                  
                  if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    return;
                  }
                  
                  setErrors({});
                  onOpenConsultation();
                }}
                className="gold-gradient text-on-primary px-12 md:px-16 py-5 md:py-6 font-bold uppercase tracking-[0.2em] transition-transform duration-300 hover:scale-[1.02]"
              >
                Initialize Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => (
  <section className="py-32 bg-surface-container-lowest">
    <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
      <div>
        <Quote className="text-primary w-16 h-16 mb-8 fill-primary" />
        <h3 className="text-3xl md:text-4xl font-headline font-light italic text-on-surface leading-relaxed mb-12">
          "Vibha Events doesn't just manage logistics; they curate moments of profound significance. Their architectural approach to event design is unparalleled."
        </h3>
        <div className="flex items-center gap-6">
          <div className="w-16 h-[1px] bg-primary"></div>
          <div>
            <p className="font-bold uppercase tracking-widest text-sm">Marcus Sterling</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Global Director, Aura Automotive</p>
          </div>
        </div>
      </div>

    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-surface-container-lowest w-full py-24 px-6 md:px-12 border-t border-outline-variant/15">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
      <div className="col-span-1">
        <div className="text-lg font-black text-[#f9f9f9] mb-4 uppercase tracking-widest">Vibha Events</div>
        <p className="text-on-surface-variant text-sm font-light leading-loose mb-8 max-w-xs">
          Architecting high-fidelity experiences for those who define the future.
        </p>
        <div className="flex gap-4">
          <Globe className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
          <Share2 className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
          <User className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
        </div>
      </div>
      
      <div>
        <h5 className="text-primary font-headline text-xs font-bold uppercase tracking-[0.2em] mb-8">Navigation</h5>
        <ul className="space-y-4 text-[10px] tracking-widest uppercase">
          {[
            { name: "Experience", id: "/#experience" },
            { name: "Services", id: "/#services" },
            { name: "Portfolio", id: "/#portfolio" }
          ].map(item => (
            <li key={item.name}>
              <a className="text-on-surface-variant hover:text-primary transition-colors duration-300" href={item.id}>{item.name}</a>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h5 className="text-primary font-headline text-xs font-bold uppercase tracking-[0.2em] mb-8">Contact</h5>
        <ul className="space-y-4 text-[10px] tracking-widest uppercase text-on-surface-variant">
          <li className="flex items-center gap-3">
            <Phone className="w-3 h-3 text-primary" />
            <span>+91 98765 43210</span>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="w-3 h-3 text-primary" />
            <span>contact@vibhaevents.com</span>
          </li>
          <li>Mumbai Office</li>
          <li>London Atelier</li>
          <li>New York Studio</li>
        </ul>
      </div>
      
      <div>
        <h5 className="text-primary font-headline text-xs font-bold uppercase tracking-[0.2em] mb-8">The Ledger</h5>
        <p className="text-on-surface-variant text-[10px] mb-6 tracking-widest leading-relaxed">
          Subscribe for exclusive insights into elite event orchestration.
        </p>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Subscribed to The Ledger.");
          }}
          className="border-b border-outline-variant/30 flex items-center py-2"
        >
          <input 
            required
            className="bg-transparent border-none text-[10px] tracking-widest w-full focus:ring-0 placeholder:text-outline/40 outline-none" 
            placeholder="EMAIL ADDRESS" 
            type="email"
          />
          <button type="submit" className="text-primary">
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] tracking-widest uppercase text-on-surface-variant">
      <p>© 2024 Vibha Event Architecture. All Rights Reserved.</p>
      <div className="flex flex-wrap justify-center gap-6 md:gap-12">
        <a className="hover:text-[#f9f9f9] transition-colors" href="#">Privacy Policy</a>
        <a className="hover:text-[#f9f9f9] transition-colors" href="#">Terms of Service</a>
        <a className="hover:text-[#f9f9f9] transition-colors" href="#">Press Kit</a>
        <a className="hover:text-[#f9f9f9] transition-colors" href="#">Global Offices</a>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Toaster position="top-center" expand={false} richColors />
        <Routes>
          <Route path="/" element={
            <>
              <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />
              <main>
                <Hero onOpenConsultation={() => setIsConsultationOpen(true)} />
                <Services />
                <section id="portfolio" className="bg-surface-container-low">
                  <PortfolioGallery />
                </section>
                <EngineRoom onOpenConsultation={() => setIsConsultationOpen(true)} />
                <Testimonials />
              </main>
              <Footer />
            </>
          } />
        </Routes>
        <ConsultationModal 
          isOpen={isConsultationOpen} 
          onClose={() => setIsConsultationOpen(false)} 
        />
      </div>
    </ErrorBoundary>
  );
}
