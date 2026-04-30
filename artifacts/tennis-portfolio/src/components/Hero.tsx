import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { playerData } from "@/data/playerData";
import { Button } from "@/components/ui/button";

export function Hero() {
  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="top" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={playerData.images.hero} 
          alt="Victor Crosetto Hero" 
          className="w-full h-full object-cover object-center scale-105"
        />
      </div>

      <div className="container relative z-20 px-4 md:px-6 pt-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-6"
          >
            {playerData.stats.map((stat, i) => (
              <span key={i} className="px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white border border-white/20 glass-panel rounded-full">
                {stat.value}
              </span>
            ))}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tighter text-white uppercase leading-none mb-6"
          >
            {playerData.name.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 font-sans max-w-2xl mb-10"
          >
            {playerData.taglines[0]} <span className="text-primary">—</span> {playerData.taglines[1]}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Button 
              size="lg" 
              className="rounded-none bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest h-14 px-8"
              onClick={() => scrollTo("#profile")}
            >
              View Profile
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-none border-white/20 text-white hover:bg-white/10 glass-panel font-bold uppercase tracking-widest h-14 px-8"
              onClick={() => scrollTo("#vision")}
            >
              Follow the Journey
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => scrollTo("#about")}
      >
        <span className="text-xs uppercase tracking-widest text-white/50">Scroll</span>
        <ChevronDown className="text-white/50 animate-bounce" size={20} />
      </motion.div>
    </section>
  );
}
