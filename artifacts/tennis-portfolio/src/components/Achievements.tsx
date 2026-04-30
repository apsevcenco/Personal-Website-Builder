import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";

export function Achievements() {
  return (
    <section id="achievements" className="py-24 md:py-32 bg-secondary/30 relative">
      <div className="container px-6 md:px-8">
        <SectionTitle number="N° 03 — PROGRESS" title="Achievements" />
        
        <div className="mt-16 space-y-8 md:space-y-12">
          {playerData.achievements.map((achievement, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group flex flex-col md:flex-row gap-6 md:gap-16 items-start md:items-center py-8 border-b border-white/5 last:border-b-0 transition-all hover:bg-white/[0.02] hover:-translate-y-1 rounded-sm px-4"
            >
              <div className="md:w-1/4 shrink-0 border-b-2 border-transparent group-hover:border-primary transition-colors pb-2">
                <span className="text-5xl md:text-7xl font-bebas text-white/20 group-hover:text-white transition-colors">
                  {achievement.year}
                </span>
              </div>
              <div className="md:w-3/4 flex flex-col gap-2">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight">
                  {achievement.title}
                </h3>
                <p className="text-white/60 font-sans text-lg">
                  {achievement.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
