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
    <footer className="py-24 md:py-32 bg-background border-t border-white/5 relative overflow-hidden flex flex-col justify-between">
      <div className="container px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 md:mb-32">
          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-white/50 mb-2">
              Management
            </span>
            <a href="mailto:management@victorcrosetto.com" className="text-xl font-sans text-white hover:text-primary transition-colors">
              {playerData.contact.email}
            </a>
          </div>
          
          <div className="flex flex-col md:items-end gap-6 md:gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-white/50 mb-2">
              Navigation
            </span>
            <div className="flex flex-wrap gap-x-8 gap-y-4 font-mono text-xs text-white uppercase tracking-widest">
              <a href="#profile" onClick={(e) => scrollTo(e, "#profile")} className="hover:text-primary transition-colors">Profile</a>
              <a href="#about" onClick={(e) => scrollTo(e, "#about")} className="hover:text-primary transition-colors">Story</a>
              <a href="#gallery" onClick={(e) => scrollTo(e, "#gallery")} className="hover:text-primary transition-colors">Gallery</a>
              <a href="#partners" onClick={(e) => scrollTo(e, "#partners")} className="hover:text-primary transition-colors">Partners</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full px-4 overflow-hidden flex justify-center opacity-5 select-none pointer-events-none mt-auto relative z-0">
        <h2 className="font-display font-extrabold uppercase whitespace-nowrap text-white" style={{ fontSize: "clamp(8rem, 20vw, 24rem)", lineHeight: 0.8 }}>
          {playerData.lastName}
        </h2>
      </div>

      <div className="container px-6 md:px-8 mt-12 md:mt-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/40 uppercase tracking-widest border-t border-white/10 pt-8">
          <p>&copy; {currentYear} {playerData.name}. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">ITF Profile</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
