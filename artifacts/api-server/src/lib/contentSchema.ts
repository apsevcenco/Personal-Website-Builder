import { z } from "zod";

export const heroStatSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const aboutCardSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const achievementSchema = z.object({
  year: z.string(),
  title: z.string(),
  description: z.string(),
});

export const trainingItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const galleryItemSchema = z.object({
  id: z.number(),
  image: z.string(),
  alt: z.string(),
});

export const visionGoalSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const partnerCardSchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
});

export const siteContentSchema = z.object({
  name: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  taglines: z.array(z.string()).length(2),
  ticker: z.array(z.string()),
  heroStats: z.array(heroStatSchema),
  stats: z.array(heroStatSchema),
  about: z.object({
    story: z.string(),
    quote: z.string(),
    description: z.string(),
    cards: z.array(aboutCardSchema),
  }),
  achievements: z.array(achievementSchema),
  profile: z.object({
    age: z.string(),
    country: z.string(),
    playingHand: z.string(),
    favoriteSurface: z.string(),
    coach: z.string(),
    academy: z.string(),
    weeklyTraining: z.string(),
    currentGoals: z.string(),
  }),
  training: z.object({
    title: z.string(),
    items: z.array(trainingItemSchema),
  }),
  gallery: z.array(galleryItemSchema),
  vision: z.object({
    title: z.string(),
    quote: z.string(),
    description: z.string(),
    goals: z.array(visionGoalSchema),
  }),
  partners: z.object({
    title: z.string(),
    description: z.string(),
    cards: z.array(partnerCardSchema),
  }),
  contact: z.object({
    title: z.string(),
    email: z.string(),
    instagram: z.string(),
    location: z.string(),
  }),
  images: z.object({
    hero: z.string(),
    profile: z.string(),
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export const SUPPORTED_LOCALES = ["en", "fr", "it", "de", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const SOURCE_LOCALE: Locale = "en";

export const localeSchema = z.enum(SUPPORTED_LOCALES);

export const localizedContentSchema = z.object({
  en: siteContentSchema,
  fr: siteContentSchema,
  it: siteContentSchema,
  de: siteContentSchema,
  es: siteContentSchema,
});

export type LocalizedContent = z.infer<typeof localizedContentSchema>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
