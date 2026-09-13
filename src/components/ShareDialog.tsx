"use client";

import { useState } from "react";
import { Check, Copy, Link as LinkIcon, X } from "lucide-react";
import type { PostRecord } from "@/lib/types";

export function ShareDialog({
  post,
  onClose,
  onShared,
}: {
  post: PostRecord;
  onClose: () => void;
  onShared: (count: number) => void;
}) {
  const [copied, setCopied] = useState<"link" | "card" | "">("");
  const url = typeof window !== "undefined" ? `${window.location.origin}/posts/${post.id}` : `/posts/${post.id}`;
  const card = `【瞬点】${post.title}\n${post.summary}\n${url}`;

  async function copy(text: string, channel: "link" | "card") {
    await navigator.clipboard.writeText(text);
    setCopied(channel);
    const res = await fetch(`/api/posts/${post.id}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel }),
    });
    const data = await res.json();
    if (data.post) onShared(data.post.shareCount);
    if (navigator.share && channel === "card") {
      try {
        await navigator.share({ title: post.title, text: post.summary, url });
      } catch {
        /* user cancelled */
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="panel w-full max-w-md p-5 clip-card" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">分享这条点位</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-muted" /></button>
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-muted">{post.title}</p>
        <div className="grid gap-2">
          <button
            onClick={() => copy(url, "link")}
            className="flex items-center justify-between border border-line px-3 py-3 text-left hover:bg-soft"
          >
            <span className="inline-flex items-center gap-2"><LinkIcon className="h-4 w-4 text-cyan" />复制链接</span>
            {copied === "link" ? <Check className="h-4 w-4 text-cyan" /> : <Copy className="h-4 w-4 text-faint" />}
          </button>
          <button
            onClick={() => copy(card, "card")}
            className="flex items-center justify-between border border-line px-3 py-3 text-left hover:bg-soft"
          >
            <span className="inline-flex items-center gap-2"><ShareGlyph />复制分享卡片</span>
            {copied === "card" ? <Check className="h-4 w-4 text-cyan" /> : <Copy className="h-4 w-4 text-faint" />}
          </button>
        </div>
        <p className="mt-3 text-xs text-faint">发给开黑队友，或发到群里当补位速查。</p>
      </div>
    </div>
  );
}

function ShareGlyph() {
  return <span className="inline-flex h-4 w-4 items-center justify-center text-gold">✦</span>;
}
