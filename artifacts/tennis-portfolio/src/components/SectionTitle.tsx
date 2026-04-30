import React from "react";
import { motion } from "framer-motion";

interface SectionTitleProps {
  number?: string;
  title: string;
  subtitle?: string;
  className?: string;
  alignment?: "left" | "center" | "right";
}

export function SectionTitle({ number, title, subtitle, className = "", alignment = "left" }: SectionTitleProps) {
  const alignClass = alignment === "center" ? "text-center items-center" : alignment === "right" ? "text-right items-end" : "text-left items-start";
  const flexAlign = alignment === "center" ? "justify-center" : alignment === "right" ? "justify-end" : "justify-start";

  return (
    <div className={`mb-16 md:mb-24 flex flex-col ${alignClass} ${className}`}>
      {number && (
        <div className={`flex items-center gap-4 mb-6 ${flexAlign} w-full`}>
          <span className="font-mono text-xs uppercase tracking-widest text-white/50">{number}</span>
          <div className="h-px bg-white/20 w-16" />
        </div>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tighter text-white uppercase mb-6 leading-tight">
        {title.split(' ').map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-3 pb-2">
            <motion.span
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h2>
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
