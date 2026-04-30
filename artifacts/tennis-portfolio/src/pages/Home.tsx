import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Achievements } from "@/components/Achievements";
import { PlayerProfile } from "@/components/PlayerProfile";
import { TrainingRoutine } from "@/components/TrainingRoutine";
import { MediaGallery } from "@/components/MediaGallery";
import { Vision } from "@/components/Vision";
import { Partners } from "@/components/Partners";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Achievements />
        <PlayerProfile />
        <TrainingRoutine />
        <MediaGallery />
        <Vision />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
