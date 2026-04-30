import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";

export function MediaGallery() {
  return (
    <section id="gallery" className="py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <SectionTitle title="On Court" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {playerData.gallery.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative group overflow-hidden ${
                i === 0 || i === 3 ? "md:col-span-2 aspect-[21/9]" : "aspect-square md:aspect-[4/3]"
              }`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src={item.image} 
                alt={item.alt}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-medium uppercase tracking-widest text-sm">{item.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
