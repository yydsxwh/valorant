"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import type { PostRecord } from "@/lib/types";
import { formatCount } from "@/lib/format";
import { useAuth } from "./AuthProvider";
import { ShareDialog } from "./ShareDialog";

export function ActionBar({ post }: { post: PostRecord }) {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(!!post.liked);
  const [favorited, setFavorited] = useState(!!post.favorited);
  const [likes, setLikes] = useState(post.likeCount);
  const [favs, setFavs] = useState(post.favoriteCount);
  const [shares, setShares] = useState(post.shareCount);
  const [shareOpen, setShareOpen] = useState(false);

  async function needLogin() {
    if (user) return false;
    router.push(`/login?next=/posts/${post.id}`);
    return true;
  }

  async function toggle(kind: "like" | "favorite") {
    if (await needLogin()) return;
    const res = await fetch(`/api/posts/${post.id}/${kind}`, { method: "POST" });
    const data = await res.json();
    if (kind === "like") {
      setLiked(data.liked);
      setLikes((n) => n + (data.liked ? 1 : -1));
    } else {
      setFavorited(data.favorited);
      setFavs((n) => n + (data.favorited ? 1 : -1));
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => toggle("like")}
          className={`chip ${liked ? "chip-on" : ""}`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          点赞 {formatCount(likes)}
        </button>
        <button
          onClick={() => toggle("favorite")}
          className={`chip ${favorited ? "chip-on" : ""}`}
        >
          <Bookmark className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
          收藏 {formatCount(favs)}
        </button>
        <a
          href="#comments"
          className="chip hover:text-ink"
        >
          <MessageCircle className="h-4 w-4" />
          评论 {formatCount(post.commentCount)}
        </a>
        <button
          onClick={() => setShareOpen(true)}
          className="chip hover:text-ink"
        >
          <Share2 className="h-4 w-4" />
          分享 {formatCount(shares)}
        </button>
      </div>
      {shareOpen && (
        <ShareDialog
          post={post}
          onClose={() => setShareOpen(false)}
          onShared={(n) => setShares(n)}
        />
      )}
    </>
  );
}
