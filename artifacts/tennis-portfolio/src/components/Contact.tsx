import { useState } from "react";
import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { playerData } from "@/data/playerData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Instagram, MapPin } from "lucide-react";

export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We will be in touch soon.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-secondary/30 border-t border-white/5">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <SectionTitle title={playerData.contact.title} />
            <p className="text-lg text-muted-foreground mb-12 max-w-md">
              For professional inquiries, media requests, or to discuss long-term partnership opportunities.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-4 text-white">
                <div className="p-4 glass-panel shrink-0">
                  <Mail size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                  <p className="text-lg font-mono">{playerData.contact.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="p-4 glass-panel shrink-0">
                  <Instagram size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-1">Instagram</p>
                  <p className="text-lg font-mono">{playerData.contact.instagram}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="p-4 glass-panel shrink-0">
                  <MapPin size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-1">Location</p>
                  <p className="text-lg font-mono">{playerData.contact.location}</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel p-8 md:p-12 relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none" />
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                <Input 
                  id="name" 
                  required 
                  className="bg-background/50 border-white/10 rounded-none h-14 focus-visible:ring-primary font-sans text-base" 
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  className="bg-background/50 border-white/10 rounded-none h-14 focus-visible:ring-primary font-sans text-base" 
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                <Textarea 
                  id="message" 
                  required 
                  className="bg-background/50 border-white/10 rounded-none min-h-[150px] resize-y focus-visible:ring-primary font-sans text-base" 
                  placeholder="How can we collaborate?"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest h-14"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
