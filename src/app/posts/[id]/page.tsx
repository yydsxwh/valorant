import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionBar } from "@/components/ActionBar";
import { Avatar } from "@/components/Avatar";
import { CommentSection } from "@/components/CommentSection";
import { LineupStage } from "@/components/LineupStage";
import { PostCard } from "@/components/PostCard";
import { getCurrentUser } from "@/lib/auth";
import { getAgent, getMap, getPurpose } from "@/lib/catalog";
import { getPost, incrementView, listComments, relatedPosts } from "@/lib/db";
import { formatCount, formatTimeAgo } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = getPost(id);
  return { title: post?.title || "内容" };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const post = getPost(id, user?.id);
  if (!post) notFound();
  incrementView(id);
  const comments = listComments(id, user?.id);
  const related = relatedPosts(post, user?.id);
  const map = getMap(post.mapId);
  const agent = getAgent(post.agentId);
  const purpose = getPurpose(post.purpose);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <LineupStage post={post} />
          <div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href={`/maps/${post.mapId}`} className="border border-line px-2 py-0.5">{map?.name}</Link>
              <Link href={`/library?agent=${post.agentId}`} className="border border-line px-2 py-0.5">{agent?.name}</Link>
              <span className="border border-line px-2 py-0.5">{post.side} {post.site}</span>
              <span className="border border-line px-2 py-0.5">{post.difficulty}</span>
              {purpose && <span className="border border-line px-2 py-0.5">{purpose.name}</span>}
              <span className="border border-line px-2 py-0.5">{post.type === "video" ? "视频教学" : "图文笔记"}</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold leading-tight">{post.title}</h1>
            <p className="mt-2 text-muted">{post.summary}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Link href={`/u/${post.author.id}`} className="flex items-center gap-3">
                <Avatar name={post.author.displayName} mark={post.author.avatar} />
                <div>
                  <div className="text-sm font-medium">{post.author.displayName}</div>
                  <div className="text-xs text-faint">{post.author.rank} · {formatTimeAgo(post.createdAt)} · {formatCount(post.viewCount + 1)} 播放</div>
                </div>
              </Link>
              <ActionBar post={{ ...post, viewCount: post.viewCount + 1 }} />
            </div>
          </div>

          {post.steps.length > 0 && (
            <div className="grid gap-3 md:grid-cols-3">
              {post.steps.map((step, i) => (
                <div key={i} className="panel p-4 clip-card">
                  <div className="text-xs text-red">0{i + 1} {step.kind === "stand" ? "站位" : step.kind === "aim" ? "准星" : step.kind === "land" ? "落点" : "笔记"}</div>
                  <h3 className="mt-1 font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
                  {step.tip && <p className="mt-3 text-xs text-gold">提示：{step.tip}</p>}
                </div>
              ))}
            </div>
          )}

          {post.body && (
            <article className="panel p-5 clip-card whitespace-pre-wrap leading-7 text-[15px] text-ink/90">
              {post.body}
            </article>
          )}

          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="bg-soft px-2 py-1 text-xs text-muted">#{t}</span>
            ))}
          </div>

          <CommentSection postId={post.id} initial={comments} />
        </div>

        <aside className="space-y-4">
          <div className="panel p-4 clip-card">
            <h3 className="mb-3 text-sm text-muted">相关推荐</h3>
            <div className="space-y-3">
              {related.map((p) => (
                <Link key={p.id} href={`/posts/${p.id}`} className="block hover:bg-soft p-2">
                  <div className="text-sm">{p.title}</div>
                  <div className="text-xs text-faint">{getMap(p.mapId)?.name} · {p.likeCount} 赞</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:block space-y-3">
            {related.slice(0, 2).map((p) => <PostCard key={p.id} post={p} compact />)}
          </div>
        </aside>
      </div>
    </div>
  );
}
