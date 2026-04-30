import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";
import * as LucideIcons from "lucide-react";

export function TrainingRoutine() {
  return (
    <section id="training" className="py-24 md:py-32 bg-secondary/20">
      <div className="container px-4 md:px-6">
        <SectionTitle title={playerData.training.title} className="text-center flex flex-col items-center" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {playerData.training.items.map((item, i) => {
            const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Activity;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card/50 border border-white/5 p-8 rounded-none group hover:border-primary/50 transition-colors"
              >
                <div className="mb-6 inline-flex p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-display font-bold uppercase text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
