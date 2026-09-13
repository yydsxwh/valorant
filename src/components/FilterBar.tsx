"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AGENTS, DIFFICULTIES, MAPS, PURPOSES, SIDES } from "@/lib/catalog";

export function FilterBar({ basePath }: { basePath: string }) {
  const router = useRouter();
  const params = useSearchParams();

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || next.get(key) === value) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  const chip = (active: boolean) =>
    `px-2.5 py-1 text-xs border ${active ? "border-red bg-red/15 text-ink" : "border-line text-muted hover:text-ink"}`;

  return (
    <div className="space-y-3">
      <Row label="类型">
        <button className={chip(params.get("type") === "video")} onClick={() => set("type", "video")}>视频教学</button>
        <button className={chip(params.get("type") === "guide")} onClick={() => set("type", "guide")}>图文笔记</button>
      </Row>
      <Row label="地图">
        {MAPS.map((m) => (
          <button key={m.id} className={chip(params.get("map") === m.id)} onClick={() => set("map", m.id)}>
            {m.name}
          </button>
        ))}
      </Row>
      <Row label="英雄">
        {AGENTS.map((a) => (
          <button key={a.id} className={chip(params.get("agent") === a.id)} onClick={() => set("agent", a.id)}>
            {a.name}
          </button>
        ))}
      </Row>
      <Row label="阵营">
        {SIDES.map((s) => (
          <button key={s} className={chip(params.get("side") === s)} onClick={() => set("side", s)}>{s}</button>
        ))}
        {["A", "B", "C", "MID"].map((s) => (
          <button key={s} className={chip(params.get("site") === s)} onClick={() => set("site", s)}>{s}点</button>
        ))}
      </Row>
      <Row label="用途">
        {PURPOSES.map((p) => (
          <button key={p.id} className={chip(params.get("purpose") === p.id)} onClick={() => set("purpose", p.id)}>
            {p.name}
          </button>
        ))}
        {DIFFICULTIES.map((d) => (
          <button key={d} className={chip(params.get("difficulty") === d)} onClick={() => set("difficulty", d)}>{d}</button>
        ))}
      </Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="w-10 shrink-0 pt-1 text-xs text-faint">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
