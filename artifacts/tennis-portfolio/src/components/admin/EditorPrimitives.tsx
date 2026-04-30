import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

export function Field({ label, value, onChange, placeholder, type = "text" }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 border-white/10 text-white"
      />
    </div>
  );
}

interface AreaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}

export function Area({ label, value, onChange, rows = 4, placeholder }: AreaProps) {
  return (
    <div className="space-y-2">
      <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
        {label}
      </Label>
      <Textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 border-white/10 text-white resize-y"
      />
    </div>
  );
}

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="border border-white/10 bg-white/[0.02] p-6 md:p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="font-display text-xl uppercase tracking-tight font-extrabold">
          {title}
        </h2>
        {description ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {description}
          </p>
        ) : null}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

interface StringListProps {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export function StringList({ label, values, onChange, placeholder }: StringListProps) {
  return (
    <div className="space-y-3">
      <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
        {label}
      </Label>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={v}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="bg-white/5 border-white/10 text-white"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="text-white/40 hover:text-white shrink-0"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => onChange([...values, ""])}
        className="font-mono text-xs uppercase tracking-widest"
      >
        <Plus size={14} className="mr-2" /> Add item
      </Button>
    </div>
  );
}

interface ItemListProps<T> {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (next: T) => void) => React.ReactNode;
}

export function ItemList<T>({
  label,
  items,
  onChange,
  newItem,
  renderItem,
}: ItemListProps<T>) {
  return (
    <div className="space-y-3">
      <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
        {label}
      </Label>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-white/10 bg-black/30 p-4 space-y-3 relative"
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                # {i + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="text-white/40 hover:text-white h-7 w-7"
              >
                <Trash2 size={14} />
              </Button>
            </div>
            {renderItem(item, (next) => {
              const arr = [...items];
              arr[i] = next;
              onChange(arr);
            })}
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => onChange([...items, newItem()])}
        className="font-mono text-xs uppercase tracking-widest"
      >
        <Plus size={14} className="mr-2" /> Add entry
      </Button>
    </div>
  );
}
