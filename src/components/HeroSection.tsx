import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightCircle, 
  Zap, 
  Menu, 
  X
} from 'lucide-react';

export default function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!deferredPrompt) {
      alert("PassVault Pro is either already installed, or your browser doesn't support PWA installation. You can usually install it from your browser's share or settings menu!");
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
  };

  const navLinks = [
    { name: 'Vault', href: '/app.html' },
    { name: 'Features', href: '/features.html' },
    { name: 'Install', href: '#install' },
    { name: 'Help', href: '/help.html' },
    { name: 'FAQ', href: '/faq.html' }
  ];

  // Staggered fadeUp animations for Hero contents
  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  // Mobile menu sheet sliding variants
  const sheetVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: {
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        duration: 0.45,
      }
    },
    exit: { 
      x: '100%',
      transition: {
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        duration: 0.45,
      }
    }
  };

  // Mobile menu staggered link entry variants
  const linkVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.18 + i * 0.07,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }
    })
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F2F2EE] font-body text-[#192837] flex flex-col justify-between">
      
      {/* Background Video */}
      <div className="fixed inset-0 overflow-hidden select-none pointer-events-none z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#F2F2EE]/45 via-[#F2F2EE]/15 to-[#F2F2EE]/70 z-0 pointer-events-none" />

      {/* Navbar Container */}
      <nav className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3 select-none">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 flex-shrink-0 drop-shadow-md">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7342E2" />
                <stop offset="50%" stopColor="#A583ED" />
                <stop offset="100%" stopColor="#E9D5FF" />
              </linearGradient>
            </defs>
            <path d="M32 4 L56 12 V32 C56 46 32 60 32 60 C32 60 8 46 8 32 V12 L32 4 Z" stroke="url(#logoGrad)" strokeWidth="5" strokeLinejoin="round" />
            <circle cx="32" cy="26" r="10" stroke="url(#logoGrad)" strokeWidth="4" />
            <path d="M30 36 V53 H36 V49 H32 V45 H36 V41 H32 V36 Z" fill="url(#logoGrad)" />
            <path d="M28 26 C28 24 30 22 32 22 C34 22 36 24 36 26" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M26 26 C26 22.5 28.5 20 32 20 C35.5 20 38 22.5 38 26" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-heading text-xl font-bold tracking-tight text-[#192837] relative top-[1px]">
            PassVault Pro
          </span>
        </div>

        {/* Center Links (Desktop only) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={link.name === 'Install' ? handleInstallClick : undefined}
              className="text-sm font-medium text-[#192837]/80 hover:text-[#192837] transition-all hover:opacity-80 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7342E2] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Right CTA Buttons (Desktop only) */}
        <div className="hidden md:flex items-center gap-4">
          <motion.a 
            href="/app.html"
            whileHover={{ scale: 1.03, filter: 'brightness(1.05)' }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#7342E2] text-white text-sm font-semibold rounded-full px-5 py-2.5 shadow-md shadow-[#7342E2]/20 transition-all duration-200"
          >
            Start For Free
          </motion.a>
        </div>

        {/* Hamburger Icon (Mobile only) */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-[#192837] hover:bg-[#192837]/10 rounded-full transition-colors"
            aria-label="Open Menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Menu Sheet */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-[#192837]/35 backdrop-blur-[4px]"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-in Sheet */}
            <motion.div 
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 z-50 h-[100dvh] w-[min(88vw,360px)] bg-[#CFC8C5] shadow-[-12px_0_48px_rgba(25,40,55,0.18)] flex flex-col justify-between"
            >
              <div>
                {/* Header inside Sheet */}
                <div className="flex items-center justify-between px-6 py-5 select-none">
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 flex-shrink-0 drop-shadow-md">
                      <defs>
                        <linearGradient id="logoGrad2" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#7342E2" />
                          <stop offset="50%" stopColor="#A583ED" />
                          <stop offset="100%" stopColor="#E9D5FF" />
                        </linearGradient>
                      </defs>
                      <path d="M32 4 L56 12 V32 C56 46 32 60 32 60 C32 60 8 46 8 32 V12 L32 4 Z" stroke="url(#logoGrad2)" strokeWidth="5" strokeLinejoin="round" />
                      <circle cx="32" cy="26" r="10" stroke="url(#logoGrad2)" strokeWidth="4" />
                      <path d="M30 36 V53 H36 V49 H32 V45 H36 V41 H32 V36 Z" fill="url(#logoGrad2)" />
                      <path d="M28 26 C28 24 30 22 32 22 C34 22 36 24 36 26" stroke="url(#logoGrad2)" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M26 26 C26 22.5 28.5 20 32 20 C35.5 20 38 22.5 38 26" stroke="url(#logoGrad2)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="font-heading text-lg font-bold tracking-tight text-[#192837] relative top-[1px]">
                      PassVault Pro
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 text-[#192837] hover:bg-[#192837]/15 rounded-full transition-colors"
                    aria-label="Close Menu"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* 1px Divider */}
                <div className="h-[1px] w-full bg-[#192837]/10" />

                {/* Staggered Nav Links */}
                <div className="flex flex-col gap-5 px-6 py-8">
                  {navLinks.map((link, i) => (
                    <motion.a 
                      key={link.name} 
                      custom={i}
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                      href={link.href}
                      onClick={(e) => {
                        if (link.name === 'Install') handleInstallClick(e as any);
                        setIsMenuOpen(false);
                      }}
                      className="text-base font-semibold text-[#192837]/95 hover:text-[#7342E2] transition-colors"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Bottom CTAs matching desktop styling */}
              <div className="px-6 py-8 flex flex-col gap-3">
                <motion.a 
                  href="/app.html"
                  onClick={() => setIsMenuOpen(false)}
                  whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-center bg-[#7342E2] text-white text-sm font-semibold rounded-full py-3 shadow-md shadow-[#7342E2]/20"
                >
                  Start For Free
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Content Section */}
      <main className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 flex-grow flex items-center">
        <div 
          className="w-full text-left"
          style={{ 
            paddingTop: 'clamp(40px, 8vw, 72px)',
            paddingBottom: 'clamp(40px, 8vw, 72px)'
          }}
        >
          <div className="max-w-[560px] flex flex-col items-start">
            
            {/* Hero Heading */}
            <motion.h1 
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-heading text-[#192837] mb-6 tracking-[-0.01em] leading-[1.05]"
              style={{ fontSize: 'clamp(1.65rem, 5vw, 3rem)' }}
            >
              <Zap 
                size={32} 
                className="inline-block mr-3 text-[#7342E2] align-middle relative -top-[4px]" 
              />
              Lock Down Your Passwords With Ironclad Security
            </motion.h1>

            {/* Hero Subtext */}
            <motion.p 
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-body text-[#192837] opacity-80 leading-[1.65] mb-8"
              style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}
            >
              Zero stress, total control. PassVault Pro keeps you covered with unbreakable storage, one-tap access, and pro-grade tools for your non-stop world.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <motion.a 
                href="/app.html"
                whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center justify-between min-w-[210px] gap-8 bg-[#7342E2] text-white rounded-[50px] px-6 py-[17px] font-semibold shadow-[0_4px_24px_rgba(115,66,226,0.28)] cursor-pointer select-none transition-all duration-300"
                style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
              >
                <span>Get It Free</span>
                <ArrowRightCircle size={20} className="text-white" />
              </motion.a>
            </motion.div>

          </div>
        </div>
      </main>


      {/* Subtle Footer indicator / Decorative indicator */}
      <footer className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#192837]/50 select-none border-t border-[#192837]/5">
        <span>© {new Date().getFullYear()} PassVault Pro. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="/privacy.html" className="hover:underline">Privacy Policy</a>
          <a href="/terms.html" className="hover:underline">Terms of Service</a>
        </div>
      </footer>

    </div>
  );
}
