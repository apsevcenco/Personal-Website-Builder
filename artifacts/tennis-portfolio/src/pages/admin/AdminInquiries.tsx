import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Trash2, Check, Loader2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  fetchInquiries,
  markInquiryRead,
  deleteInquiry,
  type Inquiry,
} from "@/lib/api";
import { AdminShell } from "@/components/admin/AdminShell";

export function AdminInquiries() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ["inquiries"],
    queryFn: fetchInquiries,
  });

  const readMutation = useMutation({
    mutationFn: (id: number) => markInquiryRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inquiries"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast({ title: "Inquiry deleted" });
    },
  });

  const unreadCount = inquiries.filter((i: Inquiry) => !i.read).length;

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl uppercase font-extrabold tracking-tight">
          Inquiries
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2">
          {inquiries.length} total &middot; {unreadCount} unread
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-white/40" size={24} />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.02] py-24 text-center">
          <Inbox className="mx-auto text-white/30 mb-4" size={32} />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            No inquiries yet
          </p>
          <p className="font-sans text-sm text-white/40 mt-2">
            New messages from the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry: Inquiry) => (
            <article
              key={inquiry.id}
              className={`border p-6 space-y-4 transition-colors ${
                inquiry.read
                  ? "border-white/10 bg-white/[0.02]"
                  : "border-primary/30 bg-primary/[0.04]"
              }`}
            >
              <header className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-display text-lg uppercase font-bold tracking-tight">
                      {inquiry.name}
                    </h2>
                    {!inquiry.read ? (
                      <Badge className="bg-primary text-black font-mono text-[10px] uppercase tracking-widest">
                        New
                      </Badge>
                    ) : null}
                  </div>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="font-mono text-xs text-white/60 hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <Mail size={12} /> {inquiry.email}
                  </a>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {new Date(inquiry.createdAt).toLocaleString()}
                </p>
              </header>
              <p className="font-sans text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                {inquiry.message}
              </p>
              <footer className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                {!inquiry.read ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => readMutation.mutate(inquiry.id)}
                    disabled={readMutation.isPending}
                    className="font-mono text-xs uppercase tracking-widest text-white/70 hover:text-white"
                  >
                    <Check size={14} className="mr-2" /> Mark read
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm("Delete this inquiry?")) {
                      deleteMutation.mutate(inquiry.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-red-400"
                >
                  <Trash2 size={14} className="mr-2" /> Delete
                </Button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
