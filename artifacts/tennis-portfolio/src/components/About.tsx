import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container px-6 md:px-8">
        <SectionTitle number="N° 02 — THE STORY" title={playerData.about.story} />
        
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-l-2 border-primary pl-8 md:pl-12"
          >
            <p className="text-2xl md:text-4xl font-display font-bold text-white uppercase tracking-tight leading-tight max-w-4xl">
              "{playerData.about.quote}"
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-white/70 font-sans leading-relaxed text-lg md:text-xl">
                {playerData.about.description}
              </p>
            </div>
          </motion.div>

          <div className="lg:col-span-7 flex flex-col gap-12 border-t border-white/10 pt-12 lg:border-t-0 lg:pt-0">
            {playerData.about.cards.map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative pb-12 border-b border-white/10 last:border-b-0 last:pb-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                  <div className="md:col-span-4">
                    <h3 className="text-xl font-display font-bold uppercase tracking-wide text-white group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <div className="md:col-span-8">
                    <p className="text-white/60 leading-relaxed font-sans text-lg">
                      {card.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
