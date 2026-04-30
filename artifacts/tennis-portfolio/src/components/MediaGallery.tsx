import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";

export function MediaGallery() {
  return (
    <section id="gallery" className="py-24 md:py-32 bg-background relative">
      <div className="container px-6 md:px-8">
        <SectionTitle number="N° 06 — VISUALS" title="On Court" />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[300px] md:auto-rows-[400px]">
          {playerData.gallery.map((item, i) => {
            // Asymmetric layout logic
            let colSpan = "md:col-span-6";
            let rowSpan = "row-span-1";
            
            if (i === 0) {
              colSpan = "md:col-span-8";
              rowSpan = "md:row-span-2";
            } else if (i === 1) {
              colSpan = "md:col-span-4";
            } else if (i === 2) {
              colSpan = "md:col-span-4";
            } else if (i === 3) {
              colSpan = "md:col-span-12";
            }

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`relative group overflow-hidden ${colSpan} ${rowSpan} bg-secondary/20`}
              >
                <motion.div 
                  initial={{ scaleX: 1 }}
                  whileInView={{ scaleX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                  className="absolute inset-0 bg-background z-20 origin-right"
                />
                
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 z-10" />
                
                <img 
                  src={item.image} 
                  alt={item.alt}
                  className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="h-px bg-primary w-8" />
                    <p className="text-white font-mono uppercase tracking-widest text-xs">{item.alt}</p>
                  </div>
                </div>
                
                {/* Accent Hairline */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary z-30 transition-all duration-700 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
