import Link from "next/link";
import { Bookmark, Eye, Heart, MessageCircle, Play } from "lucide-react";
import { getAgent, getMap } from "@/lib/catalog";
import { formatCount, formatTimeAgo } from "@/lib/format";
import type { PostRecord } from "@/lib/types";
import { Avatar } from "./Avatar";

export function PostCard({ post, compact = false }: { post: PostRecord; compact?: boolean }) {
  const map = getMap(post.mapId);
  const agent = getAgent(post.agentId);

  return (
    <article className="surface group overflow-hidden">
      <Link href={`/posts/${post.id}`} className="block">
        <div
          className="relative aspect-video overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${map?.accentSoft || "var(--brand-soft)"}, color-mix(in srgb, ${map?.accent || "var(--brand)"} 35%, white))`,
          }}
        >
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-ink">
              {post.type === "video" ? "视频" : "图文"}
            </span>
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] text-ink">{post.side}</span>
          </div>
          {post.type === "video" && (
            <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-brand-strong shadow-sm transition group-hover:scale-105">
              <Play className="h-5 w-5 fill-current" />
            </span>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-ink">
            <div>
              <div className="text-xs opacity-80">{map?.name} · {agent?.name} · {post.ability || post.area}</div>
            </div>
            <span className="text-[11px] opacity-70">{post.difficulty}</span>
          </div>
        </div>
        <div className={compact ? "p-3" : "p-4"}>
          <h3 className="line-clamp-2 text-[15px] font-medium leading-snug group-hover:text-brand">
            {post.title}
          </h3>
          {!compact && (
            <p className="mt-1.5 line-clamp-2 text-sm text-muted">{post.summary}</p>
          )}
        </div>
      </Link>
      <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-muted">
        <Link href={`/u/${post.author.id}`} className="flex items-center gap-2 hover:text-ink">
          <Avatar name={post.author.displayName} mark={post.author.avatar} size="sm" />
          <span>{post.author.displayName}</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{formatCount(post.viewCount)}</span>
          <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{formatCount(post.likeCount)}</span>
          <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{formatCount(post.commentCount)}</span>
          <span className="hidden sm:inline-flex items-center gap-1"><Bookmark className="h-3.5 w-3.5" />{formatCount(post.favoriteCount)}</span>
        </div>
      </div>
      <div className="px-4 pb-3 text-[11px] text-muted">{formatTimeAgo(post.createdAt)}</div>
    </article>
  );
}
