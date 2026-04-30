import type { SiteContent } from "@/data/defaultContent";

const API_BASE = "/api";

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

export async function fetchContent(): Promise<SiteContent> {
  return jsonFetch<SiteContent>(`${API_BASE}/content`);
}

export async function saveContent(content: SiteContent): Promise<SiteContent> {
  const res = await jsonFetch<{ ok: true; content: SiteContent }>(
    `${API_BASE}/content`,
    {
      method: "PUT",
      body: JSON.stringify(content),
    },
  );
  return res.content;
}

export async function resetContent(): Promise<SiteContent> {
  const res = await jsonFetch<{ ok: true; content: SiteContent }>(
    `${API_BASE}/content/reset`,
    { method: "POST" },
  );
  return res.content;
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
