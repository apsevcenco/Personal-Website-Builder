import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { useContent } from "@/hooks/useContent";
import { ArrowRight } from "lucide-react";

export function Partners() {
  const playerData = useContent();
  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="partners" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div className="md:w-2/3">
            <SectionTitle number="N° 08 — SUPPORT" title={playerData.partners.title} subtitle={playerData.partners.description} className="mb-0" />
          </div>
          <div className="w-full md:w-1/3 flex justify-start md:justify-end pb-2">
            <button 
              onClick={() => scrollTo("#contact")}
              className="group flex items-center justify-between md:justify-center gap-4 w-full md:w-auto bg-white text-black px-8 py-5 text-sm font-mono uppercase tracking-widest font-bold hover:bg-white/90 transition-colors"
            >
              Discuss Partnership
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 mt-16">
          {playerData.partners.cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background p-8 md:p-12 relative group"
            >
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-full" />
              
              <div className="mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-white/50">
                  {card.category}
                </span>
              </div>
              <h3 className="text-2xl font-display font-bold uppercase text-white mb-4 tracking-tight">
                {card.title}
              </h3>
              <p className="text-white/60 font-sans text-lg leading-relaxed max-w-md">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
