import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";

export function PlayerProfile() {
  const profileItems = [
    { label: "Age", value: playerData.profile.age },
    { label: "Country", value: playerData.profile.country },
    { label: "Playing Hand", value: playerData.profile.playingHand },
    { label: "Favorite Surface", value: playerData.profile.favoriteSurface },
    { label: "Coach", value: playerData.profile.coach },
    { label: "Academy", value: playerData.profile.academy },
    { label: "Weekly Training", value: playerData.profile.weeklyTraining },
    { label: "Current Goals", value: playerData.profile.currentGoals },
  ];

  return (
    <section id="profile" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container px-6 md:px-8">
        <SectionTitle number="N° 04 — THE ATHLETE" title="Player Profile" className="mb-16" />
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-5/12 aspect-[3/4] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-black/20 z-10 transition-colors group-hover:bg-transparent" />
            <img 
              src={playerData.images.profile} 
              alt="Victor Crosetto Profile" 
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 p-6 z-20">
              <span className="font-mono text-xs uppercase tracking-widest text-white/70 bg-black/50 backdrop-blur-md px-3 py-1">
                DATA SHEET // {new Date().getFullYear()}
              </span>
            </div>
          </motion.div>
          
          <div className="lg:w-7/12 border-l border-white/10 lg:pl-12 xl:pl-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              {profileItems.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col border-b border-white/5 pb-4 group"
                >
                  <dt className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-widest mb-2 transition-colors group-hover:text-primary">
                    {item.label}
                  </dt>
                  <dd className="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-tight">
                    {item.value}
                  </dd>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-12 pt-12 border-t border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="h-[1px] bg-primary w-12" />
                <span className="font-mono text-xs uppercase tracking-widest text-white/50">
                  VERIFIED STATS
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
