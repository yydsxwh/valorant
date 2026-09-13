"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { getAgent, getMap } from "@/lib/catalog";
import type { PostRecord } from "@/lib/types";

export function LineupStage({ post }: { post: PostRecord }) {
  if (post.videoKind === "youtube" && post.videoUrl) {
    return (
      <Frame>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${post.videoUrl}`}
          title={post.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Frame>
    );
  }
  if (post.videoKind === "bilibili" && post.videoUrl) {
    return (
      <Frame>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://player.bilibili.com/player.html?bvid=${post.videoUrl}&high_quality=1&autoplay=0`}
          title={post.title}
          allowFullScreen
        />
      </Frame>
    );
  }
  if (post.videoKind === "upload" && post.videoUrl) {
    return (
      <Frame>
        <video className="absolute inset-0 h-full w-full bg-black" src={post.videoUrl} controls playsInline />
      </Frame>
    );
  }
  return <DemoPlayer post={post} />;
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="surface relative aspect-video overflow-hidden bg-ink/90">{children}</div>;
}

function DemoPlayer({ post }: { post: PostRecord }) {
  const map = getMap(post.mapId);
  const agent = getAgent(post.agentId);
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setT((v) => (v >= 100 ? 0 : v + 1.4));
    }, 32);
    return () => window.clearInterval(id);
  }, [playing]);

  const p = t / 100;
  const x = post.startX + (post.landX - post.startX) * ease(p);
  const y = post.startY + (post.landY - post.startY) * ease(p) - Math.sin(p * Math.PI) * 10;

  return (
    <div className="surface overflow-hidden">
      <div
        className="relative aspect-video"
        style={{ background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${map?.accent || "var(--brand)"} 28%, white), var(--bg-deep) 70%)` }}
      >
        <svg viewBox="0 0 100 56" className="absolute inset-0 h-full w-full">
          <defs>
            <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="56" fill="url(#grid)" />
          {["A", "B", "C"].filter((s) => map?.sites.includes(s)).map((site, i) => (
            <g key={site}>
              <rect x={14 + i * 28} y="10" width="18" height="12" fill="var(--brand-soft)" stroke="var(--brand)" strokeWidth="0.4" />
              <text x={23 + i * 28} y="17.5" textAnchor="middle" fill="var(--ink)" fontSize="4">{site}</text>
            </g>
          ))}
          <rect x="40" y="28" width="20" height="8" fill="var(--brand-soft)" stroke="var(--line)" strokeWidth="0.3" />
          <text x="50" y="33.2" textAnchor="middle" fill="var(--muted)" fontSize="2.6">MID</text>
          <line
            x1={post.startX}
            y1={post.startY * 0.56}
            x2={post.landX}
            y2={post.landY * 0.56}
            stroke="var(--brand)"
            strokeDasharray="1.4 1"
            strokeWidth="0.35"
            opacity="0.7"
          />
          <circle cx={post.startX} cy={post.startY * 0.56} r="1.6" fill="var(--brand)" />
          <circle cx={post.landX} cy={post.landY * 0.56} r="2" fill="var(--fire)" opacity="0.9" />
          <circle cx={x} cy={y * 0.56} r="1.3" fill="var(--ink)" />
        </svg>
        <div className="absolute left-4 top-4 text-xs">
          <div className="text-ink">{map?.name} · {agent?.name}</div>
          <div className="mt-1 text-[11px] text-muted">互动演示 · 主色为站位，点缀色为落点</div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setPlaying((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
          </button>
          <button onClick={() => setT(0)} className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card">
            <RotateCcw className="h-4 w-4" />
          </button>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
            <div className="h-full bg-brand" style={{ width: `${t}%` }} />
          </div>
          <span className="text-[11px] text-muted">{post.ability || "技能"}</span>
        </div>
      </div>
    </div>
  );
}

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
