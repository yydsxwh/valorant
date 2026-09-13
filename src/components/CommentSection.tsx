"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { CommentRecord } from "@/lib/types";
import { formatTimeAgo } from "@/lib/format";
import { Avatar } from "./Avatar";
import { useAuth } from "./AuthProvider";

export function CommentSection({
  postId,
  initial,
}: {
  postId: string;
  initial: CommentRecord[];
}) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initial);
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<CommentRecord | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!body.trim() || busy) return;
    setBusy(true);
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, parentId: replyTo?.id }),
    });
    const data = await res.json();
    setBusy(false);
    if (data.comments) {
      setComments(data.comments);
      setBody("");
      setReplyTo(null);
    }
  }

  async function like(id: string) {
    const res = await fetch(`/api/comments/${id}/like`, { method: "POST" });
    const data = await res.json();
    if (typeof data.liked !== "boolean") return;
    setComments((list) => mapLike(list, id, data.liked));
  }

  return (
    <section id="comments" className="panel p-5 clip-card">
      <h3 className="mb-4 text-lg font-medium">评论 {countAll(comments)}</h3>
      {user ? (
        <div className="mb-6">
          {replyTo && (
            <div className="mb-2 text-xs text-muted">
              回复 @{replyTo.author.displayName}
              <button className="ml-2 text-red" onClick={() => setReplyTo(null)}>取消</button>
            </div>
          )}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="说说这个点位好不好用、哪里容易扔歪…"
            className="w-full resize-none border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-red"
          />
          <div className="mt-2 flex justify-end">
            <button onClick={submit} disabled={busy} className="bg-red px-4 py-1.5 text-sm clip-btn disabled:opacity-50">
              发布
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-6 text-sm text-muted">
          <Link href={`/login?next=/posts/${postId}`} className="text-red">登录</Link> 后参与讨论
        </p>
      )}
      <div className="space-y-5">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} onReply={setReplyTo} onLike={like} canInteract={!!user} />
        ))}
        {comments.length === 0 && <p className="text-sm text-faint">还没有评论，来写第一条心得。</p>}
      </div>
    </section>
  );
}

function CommentItem({
  comment,
  onReply,
  onLike,
  canInteract,
}: {
  comment: CommentRecord;
  onReply: (c: CommentRecord) => void;
  onLike: (id: string) => void;
  canInteract: boolean;
}) {
  return (
    <div>
      <div className="flex gap-3">
        <Link href={`/u/${comment.author.id}`}>
          <Avatar name={comment.author.displayName} mark={comment.author.avatar} size="sm" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <Link href={`/u/${comment.author.id}`} className="font-medium">{comment.author.displayName}</Link>
            <span className="text-xs text-faint">{comment.author.rank}</span>
            <span className="text-xs text-faint">{formatTimeAgo(comment.createdAt)}</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{comment.body}</p>
          <div className="mt-2 flex gap-4 text-xs text-faint">
            <button
              className={`inline-flex items-center gap-1 ${comment.liked ? "text-red" : ""}`}
              onClick={() => canInteract && onLike(comment.id)}
            >
              <Heart className={`h-3.5 w-3.5 ${comment.liked ? "fill-current" : ""}`} />
              {comment.likeCount}
            </button>
            {canInteract && (
              <button onClick={() => onReply(comment)}>回复</button>
            )}
          </div>
          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-4 border-l border-line pl-4">
              {comment.replies.map((r) => (
                <CommentItem key={r.id} comment={r} onReply={onReply} onLike={onLike} canInteract={canInteract} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function countAll(list: CommentRecord[]): number {
  return list.reduce((n, c) => n + 1 + countAll(c.replies), 0);
}

function mapLike(list: CommentRecord[], id: string, liked: boolean): CommentRecord[] {
  return list.map((c) => {
    if (c.id === id) {
      return { ...c, liked, likeCount: c.likeCount + (liked ? 1 : -1) };
    }
    return { ...c, replies: mapLike(c.replies, id, liked) };
  });
}
