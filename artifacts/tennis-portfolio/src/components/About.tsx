import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";
import { Shield, Target, Flame } from "lucide-react";

export function About() {
  const icons = [Shield, Target, Flame];

  return (
    <section id="about" className="py-24 md:py-32 bg-background relative">
      <div className="container px-4 md:px-6">
        <SectionTitle title={playerData.about.story} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              {playerData.about.description}
            </p>
          </motion.div>

          <div className="grid gap-6">
            {playerData.about.cards.map((card, i) => {
              const Icon = icons[i];
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-panel p-8 rounded-none border-l-2 border-l-primary relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex gap-6">
                    <div className="shrink-0 text-primary">
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold uppercase tracking-wider text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
