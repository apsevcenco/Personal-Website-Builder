import { playerData } from "@/data/playerData";

export function Footer() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-background border-t border-white/10">
      <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-2xl font-display font-extrabold uppercase tracking-widest text-white">
            V. Crosetto
          </span>
          <span className="text-sm text-muted-foreground uppercase tracking-widest">
            {playerData.taglines[0]}
          </span>
        </div>
        
        <div className="flex gap-6 text-sm font-medium text-muted-foreground uppercase tracking-widest">
          <a href="#about" onClick={(e) => scrollTo(e, "#about")} className="hover:text-white transition-colors">Story</a>
          <a href="#gallery" onClick={(e) => scrollTo(e, "#gallery")} className="hover:text-white transition-colors">Gallery</a>
          <a href="#contact" onClick={(e) => scrollTo(e, "#contact")} className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
      
      <div className="container px-4 md:px-6 mt-12 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground/50 border-t border-white/5 pt-8">
        <p>&copy; {currentYear} {playerData.name}. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Designed for excellence.</p>
      </div>
    </footer>
  );
}
