import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";
import { Card } from "@/components/ui/card";

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
    <section id="profile" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tennis-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tennis-grid)" />
        </svg>
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3">
            <SectionTitle title="Player Profile" className="mb-8" />
            <p className="text-muted-foreground text-lg mb-8">
              A comprehensive look at the foundation and physical attributes driving Victor's game forward.
            </p>
          </div>
          
          <div className="lg:w-2/3 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-panel border-white/10 rounded-none p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                  {profileItems.map((item, i) => (
                    <div 
                      key={i} 
                      className={`p-6 md:p-8 flex flex-col justify-center ${
                        i >= 2 ? "border-t border-white/10" : ""
                      }`}
                    >
                      <dt className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">{item.label}</dt>
                      <dd className="text-xl md:text-2xl font-display font-bold text-white">{item.value}</dd>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
