import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { useContent } from "@/hooks/useContent";
import { defaultGalleryImages, resolveImageSrc } from "@/data/defaultContent";

export function MediaGallery() {
  const playerData = useContent();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastTriggerIndex = useRef<number | null>(null);

  const items = playerData.gallery.map((item, i) => ({
    ...item,
    src: resolveImageSrc(
      item.image,
      defaultGalleryImages[i % defaultGalleryImages.length],
    ),
  }));

  // Auto-close / clamp the lightbox if the gallery shrinks (e.g., admin removed an item)
  useEffect(() => {
    if (
      openIndex !== null &&
      (items.length === 0 || openIndex >= items.length)
    ) {
      setOpenIndex(null);
    }
  }, [items.length, openIndex]);

  const close = useCallback(() => {
    setOpenIndex(null);
    const idx = lastTriggerIndex.current;
    if (idx !== null) {
      // Restore focus to the thumbnail that opened the lightbox
      requestAnimationFrame(() => triggerRefs.current[idx]?.focus());
    }
  }, []);
  const next = useCallback(
    () =>
      setOpenIndex((idx) =>
        idx === null || items.length === 0
          ? null
          : (idx + 1) % items.length,
      ),
    [items.length],
  );
  const prev = useCallback(
    () =>
      setOpenIndex((idx) =>
        idx === null || items.length === 0
          ? null
          : (idx - 1 + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, next, prev]);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-background relative">
      <div className="container px-6 md:px-8">
        <SectionTitle number="N° 06 — VISUALS" title="On Court" />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {items.map((item, i) => (
            <motion.button
              type="button"
              key={item.id}
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
              onClick={() => {
                lastTriggerIndex.current = i;
                setOpenIndex(i);
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: Math.min(i, 6) * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative aspect-[3/4] overflow-hidden bg-secondary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Open image: ${item.alt}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <Maximize2 size={14} className="text-white" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-10 translate-y-1 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="h-px bg-primary w-4 md:w-6" />
                  <p className="text-white font-mono uppercase tracking-widest text-[10px] md:text-xs truncate">
                    {item.alt}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary z-20 transition-all duration-700 group-hover:w-full" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && items[openIndex] && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 font-mono text-white/70 text-xs uppercase tracking-widest">
              {String(openIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </div>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-2 md:left-6 z-10 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={26} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-2 md:right-6 z-10 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={26} />
                </button>
              </>
            )}

            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-[92vw] max-h-[88vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[openIndex].src}
                alt={items[openIndex].alt}
                className="max-w-[92vw] max-h-[82vh] object-contain shadow-2xl"
              />
              <div className="mt-4 flex items-center gap-3">
                <div className="h-px bg-primary w-6" />
                <p className="text-white/80 font-mono uppercase tracking-widest text-xs">
                  {items[openIndex].alt}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
