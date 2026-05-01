import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { useContent } from "@/hooks/useContent";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Check } from "lucide-react";

export function Contact() {
  const playerData = useContent();
  const { ui } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Failed to send inquiry");
      }
      setSubmitted(true);
      toast({
        title: ui.contactForm.successTitle,
        description: ui.contactForm.successDesc,
      });
      form.reset();
    } catch (err) {
      toast({
        title: ui.contactForm.errorTitle,
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const instagramHandle = playerData.contact.instagram.replace(/^@/, "");
  const instagramUrl = `https://instagram.com/${instagramHandle}`;
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(playerData.contact.location)}`;

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
                <a
                  href={`mailto:${playerData.contact.email}`}
                  className="text-lg font-sans text-white hover:text-primary transition-colors inline-block"
                >
                  {playerData.contact.email}
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Social</p>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-sans text-white hover:text-primary transition-colors inline-block"
                >
                  {playerData.contact.instagram}
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Base</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-sans text-white hover:text-primary transition-colors inline-block"
                >
                  {playerData.contact.location}
                </a>
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
                  name="name"
                  required
                  className="w-full bg-transparent border-0 border-b border-white/20 pb-4 text-xl md:text-2xl font-sans text-white focus:ring-0 focus:outline-none focus:border-primary transition-colors peer placeholder:text-transparent"
                  placeholder={ui.contactForm.name}
                />
                <label htmlFor="name" className="absolute left-0 top-0 text-white/40 font-mono text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-primary peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[10px]">
                  {ui.contactForm.name}
                </label>
              </div>
              
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full bg-transparent border-0 border-b border-white/20 pb-4 text-xl md:text-2xl font-sans text-white focus:ring-0 focus:outline-none focus:border-primary transition-colors peer placeholder:text-transparent"
                  placeholder={ui.contactForm.email}
                />
                <label htmlFor="email" className="absolute left-0 top-0 text-white/40 font-mono text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-primary peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[10px]">
                  {ui.contactForm.email}
                </label>
              </div>
              
              <div className="relative group mt-4">
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full bg-transparent border-0 border-b border-white/20 pb-4 text-xl md:text-2xl font-sans text-white focus:ring-0 focus:outline-none focus:border-primary transition-colors peer resize-y min-h-[100px] placeholder:text-transparent"
                  placeholder={ui.contactForm.message}
                />
                <label htmlFor="message" className="absolute left-0 top-0 text-white/40 font-mono text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-primary peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[10px]">
                  {ui.contactForm.message}
                </label>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting || submitted}
                className="group flex items-center justify-between w-full bg-white text-black px-8 py-6 text-sm font-mono uppercase tracking-widest font-bold hover:bg-white/90 transition-colors disabled:opacity-50 mt-4"
              >
                <span>{submitted ? ui.contactForm.successTitle : isSubmitting ? ui.contactForm.sending : ui.contactForm.send}</span>
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
                        {ui.contactForm.successTitle}
                      </p>
                      <p className="text-white/80 font-sans text-sm leading-relaxed">
                        {ui.contactForm.successDesc}
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
