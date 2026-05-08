import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

let cachedClient: SupabaseClient | null = null;

function getEnv(): { url: string; key: string; bucket: string } | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = (process.env.SUPABASE_STORAGE_BUCKET ?? "uploads").trim();
  if (!url || !key) return null;
  return { url, key, bucket };
}

export function isSupabaseStorageConfigured(): boolean {
  return getEnv() !== null;
}

function getClient(): { client: SupabaseClient; bucket: string; url: string } {
  const env = getEnv();
  if (!env) {
    throw new Error(
      "Supabase Storage not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  if (!cachedClient) {
    cachedClient = createClient(env.url, env.key, {
      auth: { persistSession: false },
    });
  }
  return { client: cachedClient, bucket: env.bucket, url: env.url };
}

function extToFilename(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot < 0 || dot === name.length - 1) return "";
  const ext = name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext ? `.${ext}` : "";
}

export async function createSupabaseUpload(opts: {
  name: string;
  contentType: string;
}): Promise<{ uploadURL: string; objectPath: string }> {
  const { client, bucket, url } = getClient();
  const ext = extToFilename(opts.name);
  const objectName = `uploads/${randomUUID()}${ext}`;

  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUploadUrl(objectName);
  if (error || !data) {
    throw new Error(`Supabase signed upload URL failed: ${error?.message ?? "unknown"}`);
  }

  const publicUrl = `${url.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${objectName}`;

  return {
    uploadURL: data.signedUrl,
    objectPath: publicUrl,
  };
}
