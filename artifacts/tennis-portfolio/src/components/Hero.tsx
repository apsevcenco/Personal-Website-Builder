import { motion } from "framer-motion";
import { useContent } from "@/hooks/useContent";
import { Button } from "@/components/ui/button";
import { defaultHeroImage, resolveImageSrc } from "@/data/defaultContent";

export function Hero() {
  const playerData = useContent();
  const heroSrc = resolveImageSrc(playerData.images.hero, defaultHeroImage);
  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="top" className="relative min-h-[100dvh] flex flex-col justify-end pb-24 md:pb-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        {/* Mobile: full-bleed image with focus on subject */}
        <img
          src={heroSrc}
          alt={playerData.name}
          className="md:hidden absolute inset-0 w-full h-full object-cover animate-ken-burns origin-center"
          style={{ objectPosition: "50% 25%" }}
        />
        {/* Desktop: image anchored to the right half so portrait photos aren't cropped */}
        <img
          src={heroSrc}
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute top-0 right-0 h-full w-[55%] lg:w-[50%] object-cover animate-ken-burns origin-center"
          style={{ objectPosition: "50% 30%" }}
        />
        {/* Mobile overlays */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background z-10" />
        <div className="md:hidden absolute inset-0 bg-black/30 z-10" />
        {/* Desktop overlays: smooth fade from left dark side into the photo, plus bottom fade */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-background via-background/85 via-40% to-transparent z-10" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
        <div className="hidden md:block absolute inset-0 bg-black/15 z-10" />
      </div>

      <div className="container relative z-20 px-6 md:px-8 pt-32">
        <div className="w-full">
          {/* Chapter Mark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-between items-end border-b border-white/20 pb-4 mb-6"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-white/50">
              N° 01 — PLAYER PROFILE
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-white/50">
              EDITION 2026
            </span>
          </motion.div>

          {/* Huge Name Reveal */}
          <h1 className="font-display font-extrabold uppercase leading-[0.85] tracking-tighter text-white mb-6 md:mb-8" style={{ fontSize: "clamp(4rem, 14vw, 12rem)" }}>
            {playerData.name.split(' ').map((word, i) => (
              <span key={i} className="block overflow-hidden pb-2 md:pb-4 -mb-2 md:-mb-4">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-7 lg:col-span-6 space-y-4">
              {/* Tagline Stack */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-white/60 mb-2">
                  JUNIOR · CLASS OF 2028
                </div>
                <p className="text-2xl md:text-3xl text-white font-sans font-medium tracking-tight">
                  {playerData.taglines[1]}
                </p>
              </motion.div>
            </div>

            <div className="md:col-span-5 lg:col-span-6 flex flex-col md:items-end justify-end">
              {/* Stat Row */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex items-end gap-8 md:gap-12"
              >
                {playerData.heroStats.map((stat, i) => (
                  <div key={i} className="flex flex-col relative">
                    {i !== 0 && (
                      <div className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-px h-8 bg-white/20" />
                    )}
                    <span className="font-bebas text-4xl md:text-5xl lg:text-6xl leading-none tracking-normal text-white">
                      {stat.value}
                    </span>
                    <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/50 mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-0 right-6 md:right-12 z-20 flex flex-col items-center gap-4 cursor-pointer pb-8"
        onClick={() => scrollTo("#profile")}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40" style={{ writingMode: 'vertical-rl' }}>
          SCROLL
        </span>
        <div className="w-px h-16 bg-white/20 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1/2 bg-white"
            animate={{ top: ["-50%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
