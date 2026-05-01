import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchContent } from "@/lib/api";
import { defaultContent, type SiteContent } from "@/data/defaultContent";
import { useLanguage } from "@/hooks/useLanguage";

const ContentContext = createContext<SiteContent>(defaultContent);

function mergeWithDefaults(remote: SiteContent | undefined): SiteContent {
  if (!remote) return defaultContent;
  return remote;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const { data } = useQuery({
    queryKey: ["site-content", language],
    queryFn: () => fetchContent(language),
    staleTime: 60_000,
  });
  return (
    <ContentContext.Provider value={mergeWithDefaults(data)}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): SiteContent {
  return useContext(ContentContext);
}
