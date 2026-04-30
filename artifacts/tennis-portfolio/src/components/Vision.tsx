import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";

export function Vision() {
  return (
    <section id="vision" className="py-24 md:py-32 bg-secondary/30 relative">
      <div className="container px-6 md:px-8">
        <SectionTitle number="N° 07 — THE FUTURE" title={playerData.vision.title} className="max-w-2xl" />
        
        <div className="mb-24 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tighter leading-[1.1] max-w-4xl">
              "{playerData.vision.quote}"
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {playerData.vision.goals.map((goal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-8 md:p-12 relative group border-t border-white/10 ${
                i !== 0 ? "border-l-0 md:border-l border-white/10" : ""
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              
              <div className="text-6xl md:text-8xl font-bebas text-white/10 mb-6 tracking-tighter group-hover:text-white/20 transition-colors">
                0{i + 1}
              </div>
              <h3 className="text-2xl font-display font-bold uppercase text-white mb-4 tracking-tight">
                {goal.title}
              </h3>
              <p className="text-white/60 leading-relaxed font-sans text-lg">
                {goal.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
