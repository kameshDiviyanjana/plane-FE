import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isTokenValid } from "../api/tokenUtils";

interface Slide {
  id: number;
  image: string;
  category: string;
  title: string;
  highlight: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=1920&q=80",
    category: "AI DIAGNOSIS",
    title: "Instant Plant Disease",
    highlight: "Detection",
    description: "Scan your crop leaves using our advanced deep learning algorithms. Identify crop diseases and get organic and chemical treatment advice in seconds.",
    ctaText: "Identify Disease Now",
    ctaLink: "/finddisease",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=1920&q=80",
    category: "SMART AGRI-TECH",
    title: "Maximize & Protect Your",
    highlight: "Crop Yield",
    description: "Keep track of all diagnostics, analyze historical outbreaks on your farm, and get proactive notifications of nearby crop disease warnings.",
    ctaText: "Explore Dashboard",
    ctaLink: "/dashboard",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1920&q=80",
    category: "FARMER ASSISTANT",
    title: "30+ Plant Species &",
    highlight: "100+ Outbreaks",
    description: "Comprehensive agricultural intelligence supporting wheat, potatoes, tomatoes, apples, rice, and more. Backed by organic remedies and pesticide guides.",
    ctaText: "View Disease Directory",
    ctaLink: "/diseases",
  },
];

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Tomato Farmer",
    location: "Punjab, India",
    quote: "This tool saved my entire tomato harvest! I detected Early Blight two weeks before it spread. The treatment guide was extremely easy to follow.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: 2,
    name: "Elena Rostova",
    role: "Agronomist & Researcher",
    location: "Krasnodar, Russia",
    quote: "We use this application during field surveys. The neural network accuracy is incredible, matching expert laboratory diagnoses in over 98% of tests.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: 3,
    name: "John Mwangi",
    role: "Cooperative Manager",
    location: "Nakuru, Kenya",
    quote: "By training our smallholder farmers on this system, we've reduced pesticide costs by 40% and improved average maize output levels significantly.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  },
];

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How accurate is the AI prediction?",
    answer: "Our deep learning models are trained on over 150,000 high-resolution crop images and achieve an overall validation accuracy of 98.4%. For best results, ensure the leaf is well-lit, centered, and placed flat against a simple background.",
  },
  {
    id: 2,
    question: "What plant species and diseases are supported?",
    answer: "We support over 30 crop species including Tomato, Potato, Apple, Corn, Wheat, Grapes, Peach, Pepper, Strawberry, and Rice. In total, our model can classify 100+ unique diseases, leaf spots, mildews, and nutrient deficiencies.",
  },
  {
    id: 3,
    question: "Do you offer organic treatment recommendations?",
    answer: "Yes! Every diagnosis page contains detailed treatments consisting of organic control methods (like neem oil, biological antagonists, or copper spray), prevention guidelines (crop rotation, spacing), and chemical control methods (specific fungicides or pesticides).",
  },
  {
    id: 4,
    question: "Can I add new diseases to the catalog?",
    answer: "Yes! Agricultural extension officers and administrators can add new plant disease data, upload reference images, and update symptoms/remedies through the 'Add Disease' portal, ensuring our collaborative database is always expanding.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "cereals" | "vegetables" | "fruits">("all");

  const slideProgressRef = useRef<number>(0);
  const [progressWidth, setProgressWidth] = useState(0);

  // Minimum touch distance for swiping
  const minSwipeDistance = 50;

  useEffect(() => {
    setIsLoggedIn(isTokenValid());

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Slider Autoplay & Progress logic
  useEffect(() => {
    // Reset progress
    setProgressWidth(0);
    slideProgressRef.current = 0;

    const interval = 50; // Update progress every 50ms
    const totalDuration = 6000; // 6 seconds per slide
    const increment = (interval / totalDuration) * 100;

    const progressTimer = setInterval(() => {
      slideProgressRef.current += increment;
      if (slideProgressRef.current >= 100) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        slideProgressRef.current = 0;
      }
      setProgressWidth(slideProgressRef.current);
    }, interval);

    return () => {
      clearInterval(progressTimer);
    };
  }, [currentSlide]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // Swiping handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
  };

  // Drag handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (touchStart !== null && touchEnd !== null) {
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        handleNextSlide();
      } else if (isRightSwipe) {
        handlePrevSlide();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleCTAClick = (path: string) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const toggleFaq = (id: number) => {
    setFaqOpen((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased overflow-x-hidden">
      
      {/* Sticky Header / Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md py-4 shadow-md border-b border-gray-100"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-green-500/20 transform group-hover:scale-110 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className={`text-xl font-black tracking-tight ${isScrolled ? "text-gray-900" : "text-white"} transition duration-300`}>
                PLANT<span className="text-green-505 text-emerald-500">CARE</span>
              </span>
              <p className="text-[9px] -mt-1 tracking-widest text-emerald-500 font-bold">DIAGNOSTIC SYSTEM</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className={`font-semibold text-sm transition duration-300 hover:text-green-550 ${
                isScrolled ? "text-gray-600 hover:text-green-600" : "text-white/90 hover:text-white"
              }`}
            >
              Features
            </a>
            <a
              href="#process"
              className={`font-semibold text-sm transition duration-300 hover:text-green-550 ${
                isScrolled ? "text-gray-600 hover:text-green-600" : "text-white/90 hover:text-white"
              }`}
            >
              How It Works
            </a>
            <a
              href="#impact"
              className={`font-semibold text-sm transition duration-300 hover:text-green-550 ${
                isScrolled ? "text-gray-600 hover:text-green-600" : "text-white/90 hover:text-white"
              }`}
            >
              Impact
            </a>
            <a
              href="#faq"
              className={`font-semibold text-sm transition duration-300 hover:text-green-550 ${
                isScrolled ? "text-gray-600 hover:text-green-600" : "text-white/90 hover:text-white"
              }`}
            >
              FAQ
            </a>
          </nav>

          {/* Action Button */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition duration-300 shadow-md shadow-green-600/10 hover:shadow-lg hover:shadow-green-600/20 active:scale-95"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm transition duration-350 shadow-sm ${
                  isScrolled
                    ? "bg-green-600 text-white hover:bg-green-750"
                    : "bg-white text-green-600 hover:bg-green-50"
                }`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isScrolled ? "text-gray-800" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-6 space-y-4">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-gray-700 hover:text-green-600 py-2 border-b border-gray-50"
            >
              Features
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-gray-700 hover:text-green-600 py-2 border-b border-gray-50"
            >
              How It Works
            </a>
            <a
              href="#impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-gray-700 hover:text-green-600 py-2 border-b border-gray-50"
            >
              Impact
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-gray-700 hover:text-green-600 py-2 border-b border-gray-50"
            >
              FAQ
            </a>
            <div className="pt-2">
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center inline-block px-5 py-3 rounded-xl bg-green-600 text-white font-bold text-sm shadow-md"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center inline-block px-5 py-3 rounded-xl bg-green-50 text-green-700 border border-green-100 font-bold text-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section: HeroSwipe (Slider) */}
      <section 
        className="relative h-screen min-h-[600px] w-full bg-slate-900 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Slides Track */}
        <div 
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id}
              className="relative min-w-full h-full flex-shrink-0 flex items-center"
            >
              {/* Background Image with Dark Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

              {/* Slide Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 text-left space-y-6">
                  {/* Category Pill */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider text-green-400 bg-green-950/60 border border-green-800/40 uppercase font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                    {slide.category}
                  </span>

                  {/* Heading */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-3xl">
                    {slide.title} <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      {slide.highlight}
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-base sm:text-lg md:text-xl text-slate-350 max-w-2xl font-light text-slate-300 leading-relaxed">
                    {slide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="pt-4 flex flex-wrap gap-4">
                    <button
                      onClick={() => handleCTAClick(slide.ctaLink)}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-base hover:from-green-600 hover:to-emerald-700 transition duration-300 shadow-lg shadow-green-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      {isLoggedIn ? "Access System" : "Diagnose Now"}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <a
                      href="#features"
                      className="px-8 py-4 rounded-xl bg-slate-800/80 text-white hover:bg-slate-800 border border-slate-700 font-semibold text-base transition duration-300 active:scale-95"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Swipe Hint Indicator */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 opacity-60 animate-bounce pointer-events-none">
          <span className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">SWIPE TO EXPLORE</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
          </svg>
        </div>

        {/* Controls: Left/Right Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/40 border border-slate-700 text-white flex items-center justify-center hover:bg-green-600 hover:border-green-500 transition duration-300 group shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:-translate-x-0.5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/40 border border-slate-700 text-white flex items-center justify-center hover:bg-green-600 hover:border-green-500 transition duration-300 group shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:translate-x-0.5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Bottom Bar: Indicators & Timer Progress */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-slate-950/90 to-transparent py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Dots navigation */}
            <div className="flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`relative h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlide ? "w-10 bg-green-500" : "w-2 bg-slate-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Micro-Autoplay Progress Bar (Visual Polish) */}
            <div className="w-full max-w-[200px] h-[3px] bg-slate-850 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-green-500 transition-all duration-50"
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            {/* Dynamic Status Counter */}
            <div className="text-slate-400 font-mono text-sm tracking-widest uppercase">
              <span className="text-green-400 font-bold">{String(currentSlide + 1).padStart(2, "0")}</span>
              <span className="mx-2">/</span>
              <span>{String(slides.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        {/* Subtle background graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-60 -z-10" />

        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-green-600 font-extrabold text-sm tracking-widest uppercase mb-3 block">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Designed to Keep Your Harvest <span className="text-green-600">Thriving</span>
            </h2>
            <p className="text-lg text-gray-600">
              Our smart web system leverages advanced plant pathology datasets combined with artificial intelligence to protect crops and ensure food security.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature Card 1 */}
            <div className="group rounded-2xl bg-white border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-green-200 hover:-translate-y-1.5 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Deep Learning</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Upload a single crop leaf image. Our neural network scans for shape, pixel coloration, and texture deformities.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group rounded-2xl bg-white border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-green-200 hover:-translate-y-1.5 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Remedy Database</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Receive customized, actionable cure solutions. We display organic recipes as well as recommended fungicide/pesticide sprays.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group rounded-2xl bg-white border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-green-200 hover:-translate-y-1.5 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Farm Analytics</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Store details of all scanned plants. Track the growth of outbreaks on your dashboard and evaluate seasonal trends.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="group rounded-2xl bg-white border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-green-200 hover:-translate-y-1.5 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Outbreak Warnings</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Get notified when specific high-contagion leaf spots or rust are registered by neighboring farms in your coordinates.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="process" className="py-24 bg-gray-150 bg-gray-100 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-green-600 font-extrabold text-sm tracking-widest uppercase mb-3 block">
              Easy Operation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Get Your Diagnosis in 3 Simple Steps
            </h2>
            <p className="text-lg text-gray-600">
              No expensive laboratory equipment needed. Just use your smartphone, tablet, or webcam to run instant diagnostics in the field.
            </p>
          </div>

          {/* Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            
            {/* Connecting line (Desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-green-300 via-green-400 to-green-300 -z-0" />

            {/* Step 1 */}
            <div className="relative text-center flex flex-col items-center z-10 group">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-green-500 text-green-600 font-black text-2xl flex items-center justify-center shadow-lg group-hover:bg-green-600 group-hover:text-white transition duration-300 mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Snap a Photo</h3>
              <p className="text-gray-600 max-w-xs leading-relaxed text-sm">
                Capture a clear close-up picture of the affected leaf. Ensure there is plenty of natural daylight and good focus.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center flex flex-col items-center z-10 group">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-green-500 text-green-600 font-black text-2xl flex items-center justify-center shadow-lg group-hover:bg-green-600 group-hover:text-white transition duration-300 mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Upload & Predict</h3>
              <p className="text-gray-600 max-w-xs leading-relaxed text-sm">
                Upload the file to the <strong>Find Disease</strong> dashboard page. Our AI analyzes the leaf patterns in less than 2 seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center flex flex-col items-center z-10 group">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-green-500 text-green-600 font-black text-2xl flex items-center justify-center shadow-lg group-hover:bg-green-600 group-hover:text-white transition duration-300 mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Remedy Advice</h3>
              <p className="text-gray-600 max-w-xs leading-relaxed text-sm">
                View your detailed results with confidence ratios, pathology symptoms, chemical recommendations, and organic controls.
              </p>
            </div>

          </div>

          {/* CTA under steps */}
          <div className="text-center mt-16">
            <button
              onClick={() => handleCTAClick("/finddisease")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-green-600 text-white font-bold text-base hover:bg-green-700 transition duration-300 shadow-lg shadow-green-600/20 active:scale-95 cursor-pointer"
            >
              Start First Scan Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

        </div>
      </section>

      {/* Interactive Crop Showcase Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-green-600 font-extrabold text-sm tracking-widest uppercase mb-3 block font-mono">
              Supported Crops
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Intelligence Across Multiple Varieties
            </h2>
            <p className="text-lg text-gray-600">
              We cover key global food sources, offering detailed diagnosis categories. Click tabs below to filter crops.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap text-center">
            {(["all", "cereals", "vegetables", "fruits"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition duration-300 cursor-pointer ${
                  activeTab === tab
                    ? "bg-green-600 text-white shadow-md shadow-green-650"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab === "all" ? "All Species" : tab}
              </button>
            ))}
          </div>

          {/* Crops Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            
            {/* Tomato */}
            {(activeTab === "all" || activeTab === "vegetables") && (
              <div className="rounded-2xl border border-gray-250 border-gray-200 bg-gray-50/50 p-6 text-center hover:shadow-lg transition duration-300">
                <div className="text-4xl mb-3">🍅</div>
                <h4 className="font-bold text-gray-900 text-base">Tomato</h4>
                <p className="text-xs text-gray-550 text-gray-500 mt-1">Early Blight, Late Blight, Leaf Mold</p>
              </div>
            )}

            {/* Potato */}
            {(activeTab === "all" || activeTab === "vegetables") && (
              <div className="rounded-2xl border border-gray-250 border-gray-200 bg-gray-50/50 p-6 text-center hover:shadow-lg transition duration-300">
                <div className="text-4xl mb-3">🥔</div>
                <h4 className="font-bold text-gray-900 text-base">Potato</h4>
                <p className="text-xs text-gray-550 text-gray-500 mt-1">Late Blight, Early Blight, Common Scab</p>
              </div>
            )}

            {/* Apple */}
            {(activeTab === "all" || activeTab === "fruits") && (
              <div className="rounded-2xl border border-gray-250 border-gray-200 bg-gray-50/50 p-6 text-center hover:shadow-lg transition duration-300">
                <div className="text-4xl mb-3">🍎</div>
                <h4 className="font-bold text-gray-900 text-base">Apple</h4>
                <p className="text-xs text-gray-550 text-gray-500 mt-1">Apple Scab, Black Rot, Cedar Rust</p>
              </div>
            )}

            {/* Grapes */}
            {(activeTab === "all" || activeTab === "fruits") && (
              <div className="rounded-2xl border border-gray-250 border-gray-200 bg-gray-50/50 p-6 text-center hover:shadow-lg transition duration-300">
                <div className="text-4xl mb-3">🍇</div>
                <h4 className="font-bold text-gray-900 text-base">Grapes</h4>
                <p className="text-xs text-gray-550 text-gray-500 mt-1">Black Measles, Leaf Blight, Rot</p>
              </div>
            )}

            {/* Corn / Maize */}
            {(activeTab === "all" || activeTab === "cereals") && (
              <div className="rounded-2xl border border-gray-250 border-gray-200 bg-gray-50/50 p-6 text-center hover:shadow-lg transition duration-300">
                <div className="text-4xl mb-3">🌽</div>
                <h4 className="font-bold text-gray-900 text-base">Corn</h4>
                <p className="text-xs text-gray-550 text-gray-500 mt-1">Common Rust, Gray Spot, Blight</p>
              </div>
            )}

            {/* Rice */}
            {(activeTab === "all" || activeTab === "cereals") && (
              <div className="rounded-2xl border border-gray-250 border-gray-200 bg-gray-50/50 p-6 text-center hover:shadow-lg transition duration-300">
                <div className="text-4xl mb-3">🌾</div>
                <h4 className="font-bold text-gray-900 text-base">Rice</h4>
                <p className="text-xs text-gray-550 text-gray-500 mt-1">Brown Spot, Blast, Sheath Rot</p>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section id="impact" className="py-20 bg-green-950 text-white relative overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            
            {/* Stat 1 */}
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-green-450 text-green-400">98.4%</div>
              <div className="text-sm font-semibold tracking-wider text-green-200 uppercase font-mono">ML Model Accuracy</div>
            </div>

            {/* Stat 2 */}
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-green-450 text-green-400">12,500+</div>
              <div className="text-sm font-semibold tracking-wider text-green-200 uppercase font-mono">Diagnoses Made</div>
            </div>

            {/* Stat 3 */}
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-green-450 text-green-400">4,200+</div>
              <div className="text-sm font-semibold tracking-wider text-green-200 uppercase font-mono">Active Farmers</div>
            </div>

            {/* Stat 4 */}
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-green-450 text-green-400">30+</div>
              <div className="text-sm font-semibold tracking-wider text-green-200 uppercase font-mono">Crop Varieties</div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-green-600 font-extrabold text-sm tracking-widest uppercase mb-3 block">
              Farmer Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Loved by Farmers & Experts Globally
            </h2>
            <p className="text-lg text-gray-600">
              Read how our application has helped reduce pest damage, control leaf spot spreading, and optimize local agronomy operations.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div key={test.id} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
                <div className="space-y-4 font-light">
                  {/* Quotes Icon */}
                  <span className="text-5xl text-green-205 text-green-200 font-serif leading-none block -mb-4">“</span>
                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    {test.quote}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{test.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{test.role} • {test.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-green-600 font-extrabold text-sm tracking-widest uppercase mb-3 block">
              Any Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to commonly asked questions about diagnosis parameters, machine learning accuracy, and treatment guides.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = faqOpen === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-gray-250 border-gray-200 overflow-hidden bg-gray-55/50 bg-gray-50/50 hover:bg-gray-50 transition duration-305"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-gray-950 text-base focus:outline-none cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="ml-4 flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 group-hover:text-green-600 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transform transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-green-600" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[300px] border-t border-gray-200" : "max-h-0"
                    } overflow-hidden`}
                  >
                    <div className="px-6 py-5 text-gray-600 leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-tr from-green-950 to-slate-900 text-white p-8 md:p-16 shadow-2xl relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Ready to Secure Your Yield?
              </h2>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                Join thousands of farmers, crop managers, and agricultural specialists using our deep learning engine to identify and treat plant outbreaks immediately.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4 justify-center">
                {isLoggedIn ? (
                  <Link
                    to="/finddisease"
                    className="px-8 py-4 rounded-xl bg-green-500 text-white font-bold text-base hover:bg-green-600 transition duration-300 shadow-lg shadow-green-500/20 active:scale-95"
                  >
                    Scan a Plant Now
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="px-8 py-4 rounded-xl bg-green-500 text-white font-bold text-base hover:bg-green-600 transition duration-300 shadow-lg shadow-green-500/20 active:scale-95"
                  >
                    Create Free Account / Login
                  </Link>
                )}
                <a
                  href="#faq"
                  className="px-8 py-4 rounded-xl bg-slate-800 text-white hover:bg-slate-750 font-semibold text-base transition duration-300"
                >
                  Consult FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            {/* Logo and Info */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-550 bg-green-500 flex items-center justify-center text-white font-bold">
                  🌱
                </div>
                <span className="text-lg font-black text-white tracking-tight">
                  PLANT<span className="text-green-500">CARE</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Smart agronomy solution powered by deep learning to detect crop symptoms, list organic treatments, and keep your harvests thriving.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-mono">Navigations</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-green-400 transition">Features</a></li>
                <li><a href="#process" className="hover:text-green-400 transition">How It Works</a></li>
                <li><a href="#impact" className="hover:text-green-400 transition">Impact Stats</a></li>
                <li><a href="#faq" className="hover:text-green-400 transition">FAQs</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-mono">Core Actions</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => handleCTAClick("/finddisease")} className="hover:text-green-400 text-left transition bg-transparent border-0 p-0 cursor-pointer">
                    🔍 Find Disease
                  </button>
                </li>
                <li>
                  <button onClick={() => handleCTAClick("/adddisease")} className="hover:text-green-400 text-left transition bg-transparent border-0 p-0 cursor-pointer">
                    ➕ Add Disease
                  </button>
                </li>
                <li>
                  <button onClick={() => handleCTAClick("/diseases")} className="hover:text-green-400 text-left transition bg-transparent border-0 p-0 cursor-pointer">
                    📋 Disease Catalog
                  </button>
                </li>
                <li>
                  <Link to="/login" className="hover:text-green-400 transition font-sans">
                    🔑 Account Access
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-2 text-xs">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-mono">Contact Info</h4>
              <p>Email: contact@plantcare-diagnostics.com</p>
              <p>Phone: +1 (555) 482-9381</p>
              <p className="text-[10px] text-slate-650 mt-2 font-mono">© 2026 PlantCare Diagnostics. All rights reserved.</p>
            </div>

          </div>

          <div className="border-t border-slate-900 pt-8 text-center text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>Designed and built for modern digital agriculture.</div>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-slate-400 transition">Privacy Policy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-slate-400 transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
