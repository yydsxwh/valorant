import Link from "next/link";
import { ArrowRight, BookOpen, MapPinned, PlayCircle, Users } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { MAPS, AGENTS } from "@/lib/catalog";
import { listPosts, siteStats } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  const stats = siteStats();
  const { posts: hot } = listPosts({ sort: "hot", limit: 6 }, user?.id);
  const { posts: latest } = listPosts({ sort: "new", limit: 6 }, user?.id);
  const { posts: videos } = listPosts({ type: "video", sort: "hot", limit: 4 }, user?.id);
  const { posts: guides } = listPosts({ type: "guide", sort: "likes", limit: 4 }, user?.id);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 md:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs tracking-[0.28em] text-red">VALORANT LINEUP COMMUNITY</p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
              找点位，不用再把视频拉来拉去。
            </h1>
            <p className="mt-4 max-w-lg text-muted">
              瞬懂是给国服玩家用的无畏契约社区：上传教学视频，写图文笔记，别人可以评论、点赞、收藏和一键分享给开黑队友。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/library" className="bg-red px-5 py-2.5 clip-btn">进入点位库</Link>
              <Link href="/submit" className="border border-line px-5 py-2.5 text-muted clip-btn hover:text-ink">我要投稿</Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <Stat n={stats.posts} label="点位内容" />
              <Stat n={stats.videos} label="教学视频" />
              <Stat n={stats.guides} label="图文笔记" />
              <Stat n={stats.users} label="创作者" />
            </div>
          </div>
          <div className="panel clip-card p-5">
            <div className="mb-3 flex items-center justify-between text-sm text-muted">
              <span>本周热门</span>
              <Link href="/community?sort=hot" className="text-red">全部</Link>
            </div>
            <div className="space-y-3">
              {hot.slice(0, 4).map((p, i) => (
                <Link key={p.id} href={`/posts/${p.id}`} className="flex gap-3 hover:bg-soft p-2">
                  <span className="w-6 text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block truncate">{p.title}</span>
                    <span className="text-xs text-faint">{p.likeCount} 赞 · {p.favoriteCount} 藏</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-medium">按地图找</h2>
          <Link href="/maps" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
            全部地图 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
          {MAPS.slice(0, 10).map((m) => (
            <Link key={m.id} href={`/maps/${m.id}`} className="panel clip-card overflow-hidden group">
              <div className="h-16" style={{ background: `linear-gradient(135deg, ${m.accentSoft}, ${m.accent}66)` }} />
              <div className="p-3">
                <div className="font-medium group-hover:text-red">{m.name}</div>
                <div className="text-xs text-faint">{m.nameEn} · {m.sites.join("/")}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <SectionTitle href="/library?type=video" icon={<PlayCircle className="h-5 w-5 text-red" />} title="教学视频" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {videos.map((p) => <PostCard key={p.id} post={p} compact />)}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <SectionTitle href="/library?type=guide" icon={<BookOpen className="h-5 w-5 text-gold" />} title="图文攻略笔记" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {guides.map((p) => <PostCard key={p.id} post={p} compact />)}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <SectionTitle href="/community" icon={<Users className="h-5 w-5 text-cyan" />} title="社区最新" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 pb-8">
        <div className="mb-4 flex items-center gap-2 text-xl font-medium">
          <MapPinned className="h-5 w-5 text-red" /> 热门英雄
        </div>
        <div className="flex flex-wrap gap-2">
          {AGENTS.filter((a) => a.id !== "universal").slice(0, 16).map((a) => (
            <Link key={a.id} href={`/library?agent=${a.id}`} className="border border-line px-3 py-1.5 text-sm text-muted hover:text-ink" style={{ boxShadow: `inset 3px 0 0 ${a.color}` }}>
              {a.name}
              <span className="ml-2 text-xs text-faint">{a.role}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="border border-line bg-elev/60 px-3 py-3">
      <div className="text-xl font-semibold">{n}</div>
      <div className="text-xs text-faint">{label}</div>
    </div>
  );
}

function SectionTitle({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="inline-flex items-center gap-2 text-xl font-medium">{icon}{title}</h2>
      <Link href={href} className="text-sm text-muted hover:text-ink">更多</Link>
    </div>
  );
}
