import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Check } from "lucide-react";

export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Inquiry Sent",
        description: "Thank you for reaching out. We will be in touch shortly.",
      });
      form.reset();
    }, 800);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-secondary/20 relative">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <div className="lg:col-span-5">
            <SectionTitle number="N° 09 — INQUIRIES" title={playerData.contact.title} />
            <p className="text-white/60 font-sans text-lg mb-16 leading-relaxed max-w-md">
              For professional inquiries, media requests, or to discuss long-term partnership opportunities.
            </p>
            
            <div className="flex flex-col gap-12 border-l border-white/10 pl-8">
              <div>
                <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Management</p>
                <p className="text-lg font-sans text-white hover:text-primary transition-colors cursor-pointer inline-block">
                  {playerData.contact.email}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Social</p>
                <p className="text-lg font-sans text-white hover:text-primary transition-colors cursor-pointer inline-block">
                  {playerData.contact.instagram}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Base</p>
                <p className="text-lg font-sans text-white">
                  {playerData.contact.location}
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 pt-0 lg:pt-24"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-12">
              <div className="relative group">
                <input 
                  id="name" 
                  required 
                  className="w-full bg-transparent border-0 border-b border-white/20 pb-4 text-xl md:text-2xl font-sans text-white focus:ring-0 focus:outline-none focus:border-primary transition-colors peer placeholder:text-transparent" 
                  placeholder="Full Name"
                />
                <label htmlFor="name" className="absolute left-0 top-0 text-white/40 font-mono text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-primary peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[10px]">
                  Full Name
                </label>
              </div>
              
              <div className="relative group">
                <input 
                  id="email" 
                  type="email" 
                  required 
                  className="w-full bg-transparent border-0 border-b border-white/20 pb-4 text-xl md:text-2xl font-sans text-white focus:ring-0 focus:outline-none focus:border-primary transition-colors peer placeholder:text-transparent" 
                  placeholder="Email Address"
                />
                <label htmlFor="email" className="absolute left-0 top-0 text-white/40 font-mono text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-primary peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[10px]">
                  Email Address
                </label>
              </div>
              
              <div className="relative group mt-4">
                <textarea 
                  id="message" 
                  required 
                  className="w-full bg-transparent border-0 border-b border-white/20 pb-4 text-xl md:text-2xl font-sans text-white focus:ring-0 focus:outline-none focus:border-primary transition-colors peer resize-y min-h-[100px] placeholder:text-transparent" 
                  placeholder="Message"
                />
                <label htmlFor="message" className="absolute left-0 top-0 text-white/40 font-mono text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-primary peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[10px]">
                  Message
                </label>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting || submitted}
                className="group flex items-center justify-between w-full bg-white text-black px-8 py-6 text-sm font-mono uppercase tracking-widest font-bold hover:bg-white/90 transition-colors disabled:opacity-50 mt-4"
              >
                <span>{submitted ? "Inquiry Received" : isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
                {submitted ? (
                  <Check size={20} />
                ) : (
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
                )}
              </button>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    role="status"
                    aria-live="polite"
                    className="border border-white/15 bg-white/5 px-6 py-5 flex items-start gap-4"
                  >
                    <Check size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">
                        Inquiry Received
                      </p>
                      <p className="text-white/80 font-sans text-sm leading-relaxed">
                        Thank you for reaching out. Management will be in touch shortly.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
