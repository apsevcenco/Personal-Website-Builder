import heroImage from "@/assets/images/hero.png";
import serveImage from "@/assets/images/serve.png";
import footworkImage from "@/assets/images/footwork.png";
import trainingImage from "@/assets/images/training.png";
import matchImage from "@/assets/images/match.png";

export type SiteContent = {
  name: string;
  firstName: string;
  lastName: string;
  taglines: string[];
  ticker: string[];
  heroStats: { label: string; value: string }[];
  stats: { label: string; value: string }[];
  about: {
    story: string;
    quote: string;
    description: string;
    cards: { title: string; description: string }[];
  };
  achievements: { year: string; title: string; description: string }[];
  profile: {
    age: string;
    country: string;
    playingHand: string;
    favoriteSurface: string;
    coach: string;
    academy: string;
    weeklyTraining: string;
    currentGoals: string;
  };
  training: {
    title: string;
    items: { title: string; description: string; icon: string }[];
  };
  gallery: { id: number; image: string; alt: string }[];
  vision: {
    title: string;
    quote: string;
    description: string;
    goals: { title: string; description: string }[];
  };
  partners: {
    title: string;
    description: string;
    cards: { category: string; title: string; description: string }[];
  };
  contact: {
    title: string;
    email: string;
    instagram: string;
    location: string;
  };
  images: {
    hero: string;
    profile: string;
  };
};

export const defaultGalleryImages = [serveImage, footworkImage, trainingImage, matchImage];
export const defaultHeroImage = heroImage;
export const defaultProfileImage = matchImage;

export const defaultContent: SiteContent = {
  name: "Victor Crosetto",
  firstName: "Victor",
  lastName: "Crosetto",
  taglines: ["12-Year-Old Junior Tennis Player", "Future of Tennis in the Making"],
  ticker: ["TENNIS EUROPE U14", "MILAN", "2026", "ITF JUNIOR CIRCUIT", "TARGET 2027", "RANKING WATCH", "Q2 2026"],
  heroStats: [
    { label: "AGE", value: "12" },
    { label: "WEEKLY", value: "24h" },
    { label: "DIVISION", value: "U14" },
  ],
  stats: [
    { label: "Age", value: "12" },
    { label: "Status", value: "Junior Player" },
    { label: "Vision", value: "International Goals" },
  ],
  about: {
    story: "The Story Behind the Player",
    quote: "Discipline is doing what you hate to do, but doing it like you love it.",
    description:
      "Victor's journey is defined by a discipline rarely seen in athletes his age. While others are playing, he is building. Every hour on the court is deliberate, focused, and oriented toward a singular, long-term vision. He doesn't just want to compete; he wants to dominate on the international stage. His approach combines rigorous physical conditioning with elite technical instruction and a mature mental game.",
    cards: [
      { title: "Discipline", description: "First on the court, last to leave. Training with the intensity of a seasoned professional." },
      { title: "Focus", description: "Unshakeable concentration during both grueling practice sessions and high-pressure match moments." },
      { title: "Competitive Spirit", description: "A relentless drive to improve, overcome challenges, and outwork the competition every single day." },
    ],
  },
  achievements: [
    { year: "2024", title: "Regional U14 Champion", description: "Secured the regional title playing an age group up." },
    { year: "2024", title: "National Junior Series Finalist", description: "Reached the finals in the prestigious national junior series." },
    { year: "2023", title: "U12 State Champion", description: "Undefeated run through the state championship tournament." },
    { year: "2023", title: "Elite Academy Selection", description: "Selected for the high-performance tier at his training academy." },
  ],
  profile: {
    age: "12",
    country: "Italy",
    playingHand: "Right-handed (Two-handed backhand)",
    favoriteSurface: "Hard Court",
    coach: "Marco Valente",
    academy: "Elite Tennis Academy",
    weeklyTraining: "24 Hours",
    currentGoals: "ITF Junior Circuit Entry",
  },
  training: {
    title: "Built Through Daily Work",
    items: [
      { title: "Tennis Training", description: "Technical refinement, drilling, and tactical awareness.", icon: "Dumbbell" },
      { title: "Physical Conditioning", description: "Strength, agility, speed, and injury prevention.", icon: "Activity" },
      { title: "Match Practice", description: "Live point play, strategy implementation, and competitive scenarios.", icon: "Swords" },
      { title: "Mental Preparation", description: "Focus exercises, visualization, and match-day psychology.", icon: "Brain" },
    ],
  },
  gallery: [
    { id: 1, image: "", alt: "Serve practice" },
    { id: 2, image: "", alt: "Footwork and agility" },
    { id: 3, image: "", alt: "Intense training session" },
    { id: 4, image: "", alt: "Match day focus" },
  ],
  vision: {
    title: "The Road Ahead",
    quote: "Building the foundation today for the international stages of tomorrow.",
    description:
      "He is building step by step toward international competition, stronger tournament results, and long-term professional development.",
    goals: [
      { title: "International Tournaments", description: "Transitioning to the Tennis Europe and ITF Junior circuits to gain international experience." },
      { title: "Strong Junior Ranking", description: "Establishing a dominant position within the national and European junior rankings." },
      { title: "Long-Term Pathway", description: "Laying the physical, technical, and mental foundations for a transition to the ATP tour." },
    ],
  },
  partners: {
    title: "Partnerships",
    description: "Open to meaningful partnerships that support long-term athletic development.",
    cards: [
      { category: "Equipment", title: "Technical Gear", description: "Apparel, racquets, and technical gear to optimize daily performance." },
      { category: "Travel", title: "Tournament Support", description: "Facilitating participation in crucial international ranking events." },
      { category: "Development", title: "Training Resources", description: "Resources for specialized coaching, sports psychology, and elite physical therapy." },
      { category: "Synergy", title: "Brand Alignment", description: "Aligning with premium brands that share a commitment to excellence and high performance." },
    ],
  },
  contact: {
    title: "Get in Touch",
    email: "management@victorcrosetto.com",
    instagram: "@victorcrosetto_tennis",
    location: "Milan, Italy",
  },
  images: {
    hero: "",
    profile: "",
  },
};

export function resolveImageSrc(src: string | undefined | null, fallback: string): string {
  if (!src) return fallback;
  if (src.startsWith("/objects/")) return `/api/storage${src}`;
  return src;
}
