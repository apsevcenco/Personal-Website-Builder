import type { SiteContent } from "@/data/defaultContent";
import type { Locale } from "@/i18n/uiStrings";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

export type LocalizedContent = Record<Locale, SiteContent>;

async function jsonFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchContent(language: Locale): Promise<SiteContent> {
  return jsonFetch<SiteContent>(
    `${API_BASE}/content?lang=${encodeURIComponent(language)}`,
  );
}

export async function fetchAdminContent(): Promise<LocalizedContent> {
  const res = await jsonFetch<{ content: LocalizedContent }>(
    `${API_BASE}/admin/content`,
  );
  return res.content;
}

export async function saveContent(
  locale: Locale,
  content: SiteContent,
): Promise<LocalizedContent> {
  const res = await jsonFetch<{ ok: true; content: LocalizedContent }>(
    `${API_BASE}/admin/content`,
    {
      method: "PUT",
      body: JSON.stringify({ locale, content }),
    },
  );
  return res.content;
}

export async function resetContent(): Promise<LocalizedContent> {
  const res = await jsonFetch<{ ok: true; content: LocalizedContent }>(
    `${API_BASE}/admin/content/reset`,
    { method: "POST" },
  );
  return res.content;
}

export async function translateContent(
  targets?: Locale[],
): Promise<{ results: Record<string, string>; content: LocalizedContent }> {
  const body = targets ? JSON.stringify({ targets }) : "{}";
  const res = await jsonFetch<{
    ok: true;
    results: Record<string, string>;
    content: LocalizedContent;
  }>(`${API_BASE}/admin/content/translate`, {
    method: "POST",
    body,
  });
  return { results: res.results, content: res.content };
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const res = await jsonFetch<{ inquiries: Inquiry[] }>(`${API_BASE}/inquiries`);
  return res.inquiries;
}

export async function markInquiryRead(id: number): Promise<void> {
  await jsonFetch(`${API_BASE}/inquiries/${id}/read`, { method: "POST" });
}

export async function deleteInquiry(id: number): Promise<void> {
  await jsonFetch(`${API_BASE}/inquiries/${id}`, { method: "DELETE" });
}

export async function adminLogin(password: string): Promise<{ ok: true }> {
  return jsonFetch(`${API_BASE}/admin/login`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export async function adminLogout(): Promise<{ ok: true }> {
  return jsonFetch(`${API_BASE}/admin/logout`, { method: "POST" });
}

export async function adminMe(): Promise<{ authenticated: boolean }> {
  return jsonFetch(`${API_BASE}/admin/me`);
}

export async function uploadImage(file: File): Promise<string> {
  const presign = await jsonFetch<{ uploadURL: string; objectPath: string }>(
    `${API_BASE}/storage/uploads/request-url`,
    {
      method: "POST",
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        contentType: file.type || "application/octet-stream",
      }),
    },
  );
  const putRes = await fetch(presign.uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!putRes.ok) {
    throw new Error(`Upload failed (${putRes.status})`);
  }
  return presign.objectPath;
}
