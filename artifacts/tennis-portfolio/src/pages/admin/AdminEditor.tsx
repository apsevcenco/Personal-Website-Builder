import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RotateCcw, Save, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAdminContent,
  resetContent,
  saveContent,
  translateContent,
  type LocalizedContent,
} from "@/lib/api";
import {
  defaultContent,
  defaultGalleryImages,
  defaultHeroImage,
  defaultProfileImage,
  type SiteContent,
} from "@/data/defaultContent";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Field,
  Area,
  SectionCard,
  StringList,
  ItemList,
} from "@/components/admin/EditorPrimitives";
import {
  LOCALE_FULL,
  LOCALE_LABELS,
  SOURCE_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/i18n/uiStrings";

const TRAINING_ICONS = ["Dumbbell", "Activity", "Swords", "Brain", "Trophy", "Target"];

function emptyLocalized(): LocalizedContent {
  return {
    en: defaultContent,
    fr: defaultContent,
    it: defaultContent,
    de: defaultContent,
    es: defaultContent,
  };
}

export function AdminEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: serverContent, isLoading } = useQuery({
    queryKey: ["admin", "content"],
    queryFn: fetchAdminContent,
    staleTime: 30_000,
  });

  const [locale, setLocale] = useState<Locale>(SOURCE_LOCALE);
  const [draft, setDraft] = useState<LocalizedContent>(emptyLocalized());
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty && serverContent) setDraft(serverContent);
  }, [serverContent, dirty]);

  const current: SiteContent = draft[locale];

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setDraft((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [key]: value },
    }));
    setDirty(true);
  };

  type ObjectKeys = {
    [K in keyof SiteContent]: SiteContent[K] extends object
      ? SiteContent[K] extends ReadonlyArray<unknown>
        ? never
        : K
      : never;
  }[keyof SiteContent];

  const updateNested = <
    K extends ObjectKeys,
    NK extends keyof SiteContent[K],
  >(
    key: K,
    nestedKey: NK,
    value: SiteContent[K][NK],
  ) => {
    setDraft((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [key]: { ...(prev[locale][key] as object), [nestedKey]: value },
      },
    }));
    setDirty(true);
  };

  function syncCachesAfterServerWrite(saved: LocalizedContent) {
    queryClient.setQueryData(["admin", "content"], saved);
    for (const loc of SUPPORTED_LOCALES) {
      queryClient.setQueryData(["site-content", loc], saved[loc]);
    }
    void queryClient.invalidateQueries({ queryKey: ["site-content"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "content"] });
  }

  const saveMutation = useMutation({
    mutationFn: () => saveContent(locale, draft[locale]),
    onSuccess: (saved) => {
      syncCachesAfterServerWrite(saved);
      setDraft(saved);
      setDirty(false);
      toast({
        title: "Changes saved",
        description: `${LOCALE_FULL[locale]} content updated on the live site.`,
      });
    },
    onError: (err) => {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => resetContent(),
    onSuccess: (saved) => {
      syncCachesAfterServerWrite(saved);
      setDraft(saved);
      setDirty(false);
      toast({ title: "Reset to defaults" });
    },
    onError: (err) => {
      toast({
        title: "Reset failed",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    },
  });

  const translateMutation = useMutation({
    mutationFn: () => translateContent(),
    onSuccess: ({ results, content }) => {
      syncCachesAfterServerWrite(content);
      setDraft(content);
      setDirty(false);
      const failures = Object.entries(results).filter(([, v]) => v !== "ok");
      if (failures.length === 0) {
        toast({
          title: "Translation complete",
          description: "English content has been translated to all other languages.",
        });
      } else {
        toast({
          title: "Some translations failed",
          description: failures.map(([k, v]) => `${k}: ${v}`).join("; "),
          variant: "destructive",
        });
      }
    },
    onError: (err) => {
      toast({
        title: "Translation failed",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    },
  });

  const handleReset = () => {
    if (window.confirm("Reset ALL languages to defaults? This cannot be undone.")) {
      resetMutation.mutate();
    }
  };

  const handleTranslate = () => {
    if (dirty) {
      toast({
        title: "Save changes first",
        description: "Save your English edits before translating to other languages.",
        variant: "destructive",
      });
      return;
    }
    if (
      window.confirm(
        "Translate the English content to French, Italian, German, and Spanish? This will overwrite the existing translations.",
      )
    ) {
      translateMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-white/40" size={24} />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl uppercase font-extrabold tracking-tight">
            Site Content
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2">
            Edit each language separately. Use auto-translate to fill the others from English.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {dirty ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              Unsaved changes ({LOCALE_FULL[locale]})
            </span>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={resetMutation.isPending}
            className="font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white"
          >
            <RotateCcw size={14} className="mr-2" />
            Reset all
          </Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={!dirty || saveMutation.isPending}
            className="bg-white text-black hover:bg-white/90 font-mono text-xs uppercase tracking-widest font-bold"
          >
            {saveMutation.isPending ? (
              <Loader2 size={14} className="animate-spin mr-2" />
            ) : (
              <Save size={14} className="mr-2" />
            )}
            Save {LOCALE_LABELS[locale]}
          </Button>
        </div>
      </div>

      {/* Language switcher (admin) */}
      <div className="mb-8 border border-white/10 bg-white/[0.03] rounded-md p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mr-2">
            Language
          </span>
          {SUPPORTED_LOCALES.map((loc) => {
            const active = loc === locale;
            const isSource = loc === SOURCE_LOCALE;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  if (dirty && !window.confirm("You have unsaved changes. Switch language and lose them?")) {
                    return;
                  }
                  if (dirty) {
                    setDraft(serverContent ?? draft);
                    setDirty(false);
                  }
                  setLocale(loc);
                }}
                className={`px-3 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-[0.15em] transition-colors border ${
                  active
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/60 border-white/10 hover:text-white hover:border-white/30"
                }`}
              >
                {LOCALE_LABELS[loc]}
                {isSource ? <span className="ml-1 opacity-60">·src</span> : null}
              </button>
            );
          })}
        </div>
        <Button
          onClick={handleTranslate}
          disabled={translateMutation.isPending}
          variant="outline"
          className="font-mono text-xs uppercase tracking-widest border-white/20 text-white hover:bg-white hover:text-black"
        >
          {translateMutation.isPending ? (
            <Loader2 size={14} className="animate-spin mr-2" />
          ) : (
            <Languages size={14} className="mr-2" />
          )}
          Translate EN → FR · IT · DE · ES
        </Button>
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto p-1 gap-1">
          {[
            ["identity", "Identity"],
            ["hero", "Hero"],
            ["profile", "Profile"],
            ["about", "About"],
            ["achievements", "Achievements"],
            ["training", "Training"],
            ["gallery", "Gallery"],
            ["vision", "Vision"],
            ["partners", "Partners"],
            ["contact", "Contact"],
          ].map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="font-mono text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-white data-[state=active]:text-black"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="identity" className="mt-6 space-y-6">
          <SectionCard title="Identity" description="Core name and tagline">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field
                label="Full Name"
                value={current.name}
                onChange={(v) => update("name", v)}
              />
              <Field
                label="First Name"
                value={current.firstName}
                onChange={(v) => update("firstName", v)}
              />
              <Field
                label="Last Name (display)"
                value={current.lastName}
                onChange={(v) => update("lastName", v)}
              />
            </div>
            <StringList
              label="Taglines (rotating below name)"
              values={current.taglines}
              onChange={(v) => update("taglines", v)}
              placeholder="e.g. 12-Year-Old Junior Tennis Player"
            />
            <StringList
              label="Top Ticker Items"
              values={current.ticker}
              onChange={(v) => update("ticker", v)}
              placeholder="e.g. ITF JUNIOR CIRCUIT"
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="hero" className="mt-6 space-y-6">
          <SectionCard title="Hero Section" description="Main image and headline stats">
            <ImageUpload
              label="Hero Photo"
              value={current.images.hero}
              fallbackPreview={defaultHeroImage}
              onChange={(v) => updateNested("images", "hero", v)}
            />
            <ItemList
              label="Hero Stats (3 small numbers)"
              items={current.heroStats}
              onChange={(v) => update("heroStats", v)}
              newItem={() => ({ label: "", value: "" })}
              renderItem={(item, set) => (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Label" value={item.label} onChange={(v) => set({ ...item, label: v })} />
                  <Field label="Value" value={item.value} onChange={(v) => set({ ...item, value: v })} />
                </div>
              )}
            />
            <ItemList
              label="Bottom Stats Strip"
              items={current.stats}
              onChange={(v) => update("stats", v)}
              newItem={() => ({ label: "", value: "" })}
              renderItem={(item, set) => (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Label" value={item.label} onChange={(v) => set({ ...item, label: v })} />
                  <Field label="Value" value={item.value} onChange={(v) => set({ ...item, value: v })} />
                </div>
              )}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <SectionCard title="Player Profile" description="Personal data card">
            <ImageUpload
              label="Profile Photo"
              value={current.images.profile}
              fallbackPreview={defaultProfileImage}
              onChange={(v) => updateNested("images", "profile", v)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Age" value={current.profile.age} onChange={(v) => updateNested("profile", "age", v)} />
              <Field label="Country" value={current.profile.country} onChange={(v) => updateNested("profile", "country", v)} />
              <Field label="Playing Hand" value={current.profile.playingHand} onChange={(v) => updateNested("profile", "playingHand", v)} />
              <Field label="Favorite Surface" value={current.profile.favoriteSurface} onChange={(v) => updateNested("profile", "favoriteSurface", v)} />
              <Field label="Coach" value={current.profile.coach} onChange={(v) => updateNested("profile", "coach", v)} />
              <Field label="Academy" value={current.profile.academy} onChange={(v) => updateNested("profile", "academy", v)} />
              <Field label="Weekly Training" value={current.profile.weeklyTraining} onChange={(v) => updateNested("profile", "weeklyTraining", v)} />
              <Field label="Current Goals" value={current.profile.currentGoals} onChange={(v) => updateNested("profile", "currentGoals", v)} />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="about" className="mt-6 space-y-6">
          <SectionCard title="About / Story">
            <Field
              label="Section Title"
              value={current.about.story}
              onChange={(v) => updateNested("about", "story", v)}
            />
            <Area
              label="Pull Quote"
              value={current.about.quote}
              rows={2}
              onChange={(v) => updateNested("about", "quote", v)}
            />
            <Area
              label="Description"
              value={current.about.description}
              rows={6}
              onChange={(v) => updateNested("about", "description", v)}
            />
            <ItemList
              label="Trait Cards (Discipline / Focus / etc.)"
              items={current.about.cards}
              onChange={(v) => updateNested("about", "cards", v)}
              newItem={() => ({ title: "", description: "" })}
              renderItem={(item, set) => (
                <>
                  <Field label="Title" value={item.title} onChange={(v) => set({ ...item, title: v })} />
                  <Area label="Description" value={item.description} rows={3} onChange={(v) => set({ ...item, description: v })} />
                </>
              )}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6 space-y-6">
          <SectionCard title="Achievements Timeline">
            <ItemList
              label="Achievements"
              items={current.achievements}
              onChange={(v) => update("achievements", v)}
              newItem={() => ({ year: "", title: "", description: "" })}
              renderItem={(item, set) => (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Field label="Year" value={item.year} onChange={(v) => set({ ...item, year: v })} />
                    <div className="md:col-span-2">
                      <Field label="Title" value={item.title} onChange={(v) => set({ ...item, title: v })} />
                    </div>
                  </div>
                  <Area label="Description" value={item.description} rows={2} onChange={(v) => set({ ...item, description: v })} />
                </>
              )}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="training" className="mt-6 space-y-6">
          <SectionCard title="Training Routine">
            <Field
              label="Section Title"
              value={current.training.title}
              onChange={(v) => updateNested("training", "title", v)}
            />
            <ItemList
              label="Training Pillars"
              items={current.training.items}
              onChange={(v) => updateNested("training", "items", v)}
              newItem={() => ({ title: "", description: "", icon: "Dumbbell" })}
              renderItem={(item, set) => (
                <>
                  <Field label="Title" value={item.title} onChange={(v) => set({ ...item, title: v })} />
                  <Area label="Description" value={item.description} rows={3} onChange={(v) => set({ ...item, description: v })} />
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                      Icon
                    </p>
                    <select
                      value={item.icon}
                      onChange={(e) => set({ ...item, icon: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-md text-sm"
                    >
                      {TRAINING_ICONS.map((name) => (
                        <option key={name} value={name} className="bg-background">
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="gallery" className="mt-6 space-y-6">
          <SectionCard
            title="Media Gallery"
            description="Upload photos for the gallery section"
          >
            <ItemList
              label="Gallery Items"
              items={current.gallery}
              onChange={(v) => update("gallery", v)}
              newItem={() => ({
                id: Date.now(),
                image: "",
                alt: "Gallery image",
              })}
              renderItem={(item, set) => (
                <>
                  <Field
                    label="Caption / Alt Text"
                    value={item.alt}
                    onChange={(v) => set({ ...item, alt: v })}
                  />
                  <ImageUpload
                    label="Photo"
                    value={item.image}
                    fallbackPreview={
                      defaultGalleryImages[
                        current.gallery.findIndex((g) => g === item) %
                          defaultGalleryImages.length
                      ]
                    }
                    onChange={(v) => set({ ...item, image: v })}
                  />
                </>
              )}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="vision" className="mt-6 space-y-6">
          <SectionCard title="Vision / Road Ahead">
            <Field
              label="Section Title"
              value={current.vision.title}
              onChange={(v) => updateNested("vision", "title", v)}
            />
            <Area
              label="Pull Quote"
              value={current.vision.quote}
              rows={2}
              onChange={(v) => updateNested("vision", "quote", v)}
            />
            <Area
              label="Description"
              value={current.vision.description}
              rows={5}
              onChange={(v) => updateNested("vision", "description", v)}
            />
            <ItemList
              label="Goals"
              items={current.vision.goals}
              onChange={(v) => updateNested("vision", "goals", v)}
              newItem={() => ({ title: "", description: "" })}
              renderItem={(item, set) => (
                <>
                  <Field label="Title" value={item.title} onChange={(v) => set({ ...item, title: v })} />
                  <Area label="Description" value={item.description} rows={3} onChange={(v) => set({ ...item, description: v })} />
                </>
              )}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="partners" className="mt-6 space-y-6">
          <SectionCard title="Partners">
            <Field
              label="Section Title"
              value={current.partners.title}
              onChange={(v) => updateNested("partners", "title", v)}
            />
            <Area
              label="Description"
              value={current.partners.description}
              rows={4}
              onChange={(v) => updateNested("partners", "description", v)}
            />
            <ItemList
              label="Partnership Areas"
              items={current.partners.cards}
              onChange={(v) => updateNested("partners", "cards", v)}
              newItem={() => ({ category: "", title: "", description: "" })}
              renderItem={(item, set) => (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="Category" value={item.category} onChange={(v) => set({ ...item, category: v })} />
                    <Field label="Title" value={item.title} onChange={(v) => set({ ...item, title: v })} />
                  </div>
                  <Area label="Description" value={item.description} rows={3} onChange={(v) => set({ ...item, description: v })} />
                </>
              )}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="contact" className="mt-6 space-y-6">
          <SectionCard title="Contact Info">
            <Field
              label="Section Title"
              value={current.contact.title}
              onChange={(v) => updateNested("contact", "title", v)}
            />
            <Field
              label="Email"
              type="email"
              value={current.contact.email}
              onChange={(v) => updateNested("contact", "email", v)}
            />
            <Field
              label="Instagram Handle"
              value={current.contact.instagram}
              onChange={(v) => updateNested("contact", "instagram", v)}
              placeholder="@username"
            />
            <Field
              label="Location"
              value={current.contact.location}
              onChange={(v) => updateNested("contact", "location", v)}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>

      <div className="mt-12 pt-6 border-t border-white/10 flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            if (serverContent) setDraft(serverContent);
            setDirty(false);
          }}
          disabled={!dirty}
          className="font-mono text-xs uppercase tracking-widest"
        >
          Discard changes
        </Button>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={!dirty || saveMutation.isPending}
          className="bg-white text-black hover:bg-white/90 font-mono text-xs uppercase tracking-widest font-bold"
        >
          {saveMutation.isPending ? (
            <Loader2 size={14} className="animate-spin mr-2" />
          ) : (
            <Save size={14} className="mr-2" />
          )}
          Save {LOCALE_LABELS[locale]}
        </Button>
      </div>
    </AdminShell>
  );
}
