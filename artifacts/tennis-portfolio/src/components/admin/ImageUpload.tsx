import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/lib/api";
import { resolveImageSrc } from "@/data/defaultContent";

interface ImageUploadProps {
  value: string;
  fallbackPreview?: string;
  label?: string;
  onChange: (objectPath: string) => void;
}

export function ImageUpload({ value, fallbackPreview, label, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const previewSrc = value
    ? resolveImageSrc(value, fallbackPreview ?? "")
    : fallbackPreview ?? "";

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Unsupported file",
        description: "Please choose an image file (JPG, PNG, WebP, etc.).",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum image size is 10 MB.",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);
    try {
      const objectPath = await uploadImage(file);
      onChange(objectPath);
      toast({
        title: "Image uploaded",
        description: "Don't forget to press Save to apply the change.",
      });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {label ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          {label}
        </p>
      ) : null}
      <div className="flex items-start gap-4">
        <div className="relative w-32 h-40 shrink-0 overflow-hidden bg-white/5 border border-white/10">
          {previewSrc ? (
            <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-mono uppercase">
              No image
            </div>
          )}
          {isUploading ? (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={20} />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="font-mono text-xs uppercase tracking-widest"
          >
            <Upload size={14} className="mr-2" />
            {value ? "Replace image" : "Upload image"}
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
              className="font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white"
            >
              <X size={14} className="mr-2" />
              Reset to default
            </Button>
          ) : null}
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 mt-1 max-w-xs">
            JPG / PNG / WebP &middot; up to 10 MB
          </p>
        </div>
      </div>
    </div>
  );
}
