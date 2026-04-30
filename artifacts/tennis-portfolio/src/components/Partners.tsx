import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";
import { Button } from "@/components/ui/button";

export function Partners() {
  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="partners" className="py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="md:w-2/3">
            <SectionTitle title={playerData.partners.title} subtitle={playerData.partners.description} className="mb-0" />
          </div>
          <div className="md:w-1/3 flex justify-start md:justify-end pb-2">
            <Button 
              size="lg" 
              className="rounded-none bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest h-14 px-8"
              onClick={() => scrollTo("#contact")}
            >
              Discuss Partnership
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {playerData.partners.cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel p-6 sm:p-8 flex flex-col justify-between min-h-[240px]"
            >
              <h3 className="text-lg font-display font-bold uppercase text-white mb-4">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
