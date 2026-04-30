import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { useContent } from "@/hooks/useContent";
import * as LucideIcons from "lucide-react";

export function TrainingRoutine() {
  const playerData = useContent();
  return (
    <section id="training" className="py-24 md:py-32 bg-secondary/10 relative">
      <div className="container px-6 md:px-8">
        <SectionTitle number="N° 05 — THE GRIND" title={playerData.training.title} className="max-w-3xl" />
        
        <div className="mt-16 flex flex-col gap-12 md:gap-16">
          {playerData.training.items.map((item, i) => {
            const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Activity;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start border-t border-white/5 pt-8 first:border-t-0 first:pt-0"
              >
                <div className="md:col-span-2 text-primary">
                  <span className="text-4xl md:text-6xl font-bebas text-white/20 tracking-tighter block leading-none">
                    0{i + 1}
                  </span>
                </div>
                
                <div className="md:col-span-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                  <div className="lg:col-span-1 flex items-center gap-4">
                    <div className="text-white/30 hidden lg:block">
                      <Icon size={24} strokeWidth={1} />
                    </div>
                    <h3 className="text-2xl font-display font-bold uppercase text-white tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <div className="lg:col-span-2">
                    <p className="text-white/60 font-sans text-lg leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
