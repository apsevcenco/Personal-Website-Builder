import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/hooks/useContent";
import { saveContent, resetContent } from "@/lib/api";
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

const TRAINING_ICONS = ["Dumbbell", "Activity", "Swords", "Brain", "Trophy", "Target"];

export function AdminEditor() {
  const current = useContent();
  const [draft, setDraft] = useState<SiteContent>(current);
  const [dirty, setDirty] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!dirty) setDraft(current);
  }, [current, dirty]);

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
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
      [key]: { ...(prev[key] as object), [nestedKey]: value },
    }));
    setDirty(true);
  };

  const saveMutation = useMutation({
    mutationFn: () => saveContent(draft),
    onSuccess: (saved) => {
      queryClient.setQueryData(["site-content"], saved);
      void queryClient.invalidateQueries({ queryKey: ["site-content"] });
      setDraft(saved);
      setDirty(false);
      toast({ title: "Changes saved", description: "Live site has been updated." });
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
      queryClient.setQueryData(["site-content"], saved);
      void queryClient.invalidateQueries({ queryKey: ["site-content"] });
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

  const handleReset = () => {
    if (window.confirm("Reset all content to defaults? This cannot be undone.")) {
      resetMutation.mutate();
    }
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl uppercase font-extrabold tracking-tight">
            Site Content
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2">
            Edit text, photos, and section data — saved instantly to the live site
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirty ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              Unsaved changes
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
            Reset defaults
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
            Save
          </Button>
        </div>
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
                value={draft.name}
                onChange={(v) => update("name", v)}
              />
              <Field
                label="First Name"
                value={draft.firstName}
                onChange={(v) => update("firstName", v)}
              />
              <Field
                label="Last Name (display)"
                value={draft.lastName}
                onChange={(v) => update("lastName", v)}
              />
            </div>
            <StringList
              label="Taglines (rotating below name)"
              values={draft.taglines}
              onChange={(v) => update("taglines", v)}
              placeholder="e.g. 12-Year-Old Junior Tennis Player"
            />
            <StringList
              label="Top Ticker Items"
              values={draft.ticker}
              onChange={(v) => update("ticker", v)}
              placeholder="e.g. ITF JUNIOR CIRCUIT"
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="hero" className="mt-6 space-y-6">
          <SectionCard title="Hero Section" description="Main image and headline stats">
            <ImageUpload
              label="Hero Photo"
              value={draft.images.hero}
              fallbackPreview={defaultHeroImage}
              onChange={(v) => updateNested("images", "hero", v)}
            />
            <ItemList
              label="Hero Stats (3 small numbers)"
              items={draft.heroStats}
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
              items={draft.stats}
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
              value={draft.images.profile}
              fallbackPreview={defaultProfileImage}
              onChange={(v) => updateNested("images", "profile", v)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Age" value={draft.profile.age} onChange={(v) => updateNested("profile", "age", v)} />
              <Field label="Country" value={draft.profile.country} onChange={(v) => updateNested("profile", "country", v)} />
              <Field label="Playing Hand" value={draft.profile.playingHand} onChange={(v) => updateNested("profile", "playingHand", v)} />
              <Field label="Favorite Surface" value={draft.profile.favoriteSurface} onChange={(v) => updateNested("profile", "favoriteSurface", v)} />
              <Field label="Coach" value={draft.profile.coach} onChange={(v) => updateNested("profile", "coach", v)} />
              <Field label="Academy" value={draft.profile.academy} onChange={(v) => updateNested("profile", "academy", v)} />
              <Field label="Weekly Training" value={draft.profile.weeklyTraining} onChange={(v) => updateNested("profile", "weeklyTraining", v)} />
              <Field label="Current Goals" value={draft.profile.currentGoals} onChange={(v) => updateNested("profile", "currentGoals", v)} />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="about" className="mt-6 space-y-6">
          <SectionCard title="About / Story">
            <Field
              label="Section Title"
              value={draft.about.story}
              onChange={(v) => updateNested("about", "story", v)}
            />
            <Area
              label="Pull Quote"
              value={draft.about.quote}
              rows={2}
              onChange={(v) => updateNested("about", "quote", v)}
            />
            <Area
              label="Description"
              value={draft.about.description}
              rows={6}
              onChange={(v) => updateNested("about", "description", v)}
            />
            <ItemList
              label="Trait Cards (Discipline / Focus / etc.)"
              items={draft.about.cards}
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
              items={draft.achievements}
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
              value={draft.training.title}
              onChange={(v) => updateNested("training", "title", v)}
            />
            <ItemList
              label="Training Pillars"
              items={draft.training.items}
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
              items={draft.gallery}
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
                        draft.gallery.findIndex((g) => g === item) %
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
              value={draft.vision.title}
              onChange={(v) => updateNested("vision", "title", v)}
            />
            <Area
              label="Pull Quote"
              value={draft.vision.quote}
              rows={2}
              onChange={(v) => updateNested("vision", "quote", v)}
            />
            <Area
              label="Description"
              value={draft.vision.description}
              rows={5}
              onChange={(v) => updateNested("vision", "description", v)}
            />
            <ItemList
              label="Goals"
              items={draft.vision.goals}
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
              value={draft.partners.title}
              onChange={(v) => updateNested("partners", "title", v)}
            />
            <Area
              label="Description"
              value={draft.partners.description}
              rows={4}
              onChange={(v) => updateNested("partners", "description", v)}
            />
            <ItemList
              label="Partnership Areas"
              items={draft.partners.cards}
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
              value={draft.contact.title}
              onChange={(v) => updateNested("contact", "title", v)}
            />
            <Field
              label="Email"
              type="email"
              value={draft.contact.email}
              onChange={(v) => updateNested("contact", "email", v)}
            />
            <Field
              label="Instagram Handle"
              value={draft.contact.instagram}
              onChange={(v) => updateNested("contact", "instagram", v)}
              placeholder="@username"
            />
            <Field
              label="Location"
              value={draft.contact.location}
              onChange={(v) => updateNested("contact", "location", v)}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>

      <div className="mt-12 pt-6 border-t border-white/10 flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            setDraft(current);
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
          Save all changes
        </Button>
      </div>

      <div className="sr-only">
        {/* Force-include defaultContent type so unused defaults don't get tree-shaken */}
        {defaultContent.name}
      </div>
    </AdminShell>
  );
}
