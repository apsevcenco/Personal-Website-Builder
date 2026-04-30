import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { playerData } from "@/data/playerData";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const links = [
    { label: "Profile", href: "#profile" },
    { label: "Story", href: "#about" },
    { label: "Training", href: "#training" },
    { label: "Gallery", href: "#gallery" },
    { label: "Vision", href: "#vision" },
    { label: "Partners", href: "#partners" },
    { label: "Contact", href: "#contact" }
  ];

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Broadcast Ticker */}
      <div className="bg-primary text-black py-1 overflow-hidden">
        <div className="whitespace-nowrap flex">
          <div className="animate-marquee inline-block font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
            {playerData.ticker.join("  ·  ")}  ·  {playerData.ticker.join("  ·  ")}  ·  {playerData.ticker.join("  ·  ")}  ·  {playerData.ticker.join("  ·  ")}
          </div>
        </div>
      </div>

      <div 
        className={`transition-all duration-500 ${
          isScrolled ? "bg-background/90 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-8 flex items-center justify-between">
          <a 
            href="#top" 
            onClick={(e) => scrollTo(e, "#top")}
            className="text-lg md:text-xl font-display font-extrabold tracking-tight text-white uppercase"
          >
            {playerData.name}
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="text-xs font-mono text-white/50 hover:text-white transition-colors uppercase tracking-widest relative group"
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white p-2 relative z-[60]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center gap-8"
        >
          {links.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className="text-2xl font-display font-bold text-white uppercase tracking-widest"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </header>
  );
}
