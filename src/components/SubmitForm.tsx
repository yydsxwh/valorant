"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AGENTS, MAPS, PURPOSES, SIDES, DIFFICULTIES, parseVideoSource } from "@/lib/catalog";
import type { GuideStep } from "@/lib/types";
import { useAuth } from "./AuthProvider";

export function SubmitForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [type, setType] = useState<"video" | "guide">("video");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [mapId, setMapId] = useState("ascent");
  const [agentId, setAgentId] = useState("sova");
  const [ability, setAbility] = useState("");
  const [side, setSide] = useState("进攻");
  const [site, setSite] = useState("A");
  const [area, setArea] = useState("");
  const [purpose, setPurpose] = useState("ENTRY");
  const [difficulty, setDifficulty] = useState("简单");
  const [videoInput, setVideoInput] = useState("");
  const [videoFileUrl, setVideoFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [start, setStart] = useState({ x: 30, y: 64 });
  const [land, setLand] = useState({ x: 68, y: 28 });
  const [pin, setPin] = useState<"start" | "land">("start");
  const [steps, setSteps] = useState<GuideStep[]>([
    { title: "站位", body: "", kind: "stand" },
    { title: "准星", body: "", kind: "aim" },
    { title: "落点", body: "", kind: "land" },
  ]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const agent = useMemo(() => AGENTS.find((a) => a.id === agentId), [agentId]);

  async function upload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setVideoFileUrl(data.url);
    else setError(data.error || "上传失败");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login?next=/submit");
      return;
    }
    setBusy(true);
    setError("");
    const source = parseVideoSource(videoFileUrl || videoInput);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        title,
        summary,
        body,
        mapId,
        agentId,
        ability: ability || agent?.abilities[0]?.name || "",
        side,
        site,
        area,
        purpose,
        difficulty,
        videoKind: type === "video" ? source.kind : "demo",
        videoUrl: type === "video" ? source.url || videoFileUrl : "",
        startX: start.x,
        startY: start.y,
        landX: land.x,
        landY: land.y,
        steps: steps.filter((s) => s.title || s.body),
        tags: ["社区投稿"],
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "发布失败");
      return;
    }
    router.push(`/posts/${data.post.id}`);
  }

  if (!user) {
    return (
      <div className="panel p-8 text-center clip-card">
        <p className="text-muted">投稿需要先登录。</p>
        <button onClick={() => router.push("/login?next=/submit")} className="mt-4 bg-red px-4 py-2 clip-btn">去登录</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["video", "guide"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 text-sm clip-btn ${type === t ? "bg-red" : "border border-line text-muted"}`}
            >
              {t === "video" ? "视频教学" : "图文攻略笔记"}
            </button>
          ))}
        </div>
        <Field label="标题">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：亚海悬城 炼狱 A 门默认烟" className="input" />
        </Field>
        <Field label="一句话摘要">
          <input required value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="让别人 3 秒看懂这是什么点" className="input" />
        </Field>
        <Field label="正文">
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="补充时机、配合、常见失误…" className="input resize-y" />
        </Field>
        {type === "video" && (
          <div className="panel p-4 space-y-3">
            <p className="text-sm text-muted">上传视频文件，或粘贴 B 站 / YouTube 链接。没有视频时会生成互动演示。</p>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
              }}
            />
            {uploading && <p className="text-xs text-cyan">上传中…</p>}
            {videoFileUrl && <p className="text-xs text-cyan">已上传 {videoFileUrl}</p>}
            <input value={videoInput} onChange={(e) => setVideoInput(e.target.value)} placeholder="https://www.bilibili.com/video/BVxxxx 或 YouTube 链接" className="input" />
          </div>
        )}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-muted">分步笔记</h3>
            <button
              type="button"
              className="text-xs text-red"
              onClick={() => setSteps((s) => [...s, { title: "补充", body: "", kind: "note" }])}
            >
              加一步
            </button>
          </div>
          {steps.map((step, i) => (
            <div key={i} className="grid gap-2 border border-line p-3 md:grid-cols-2">
              <input value={step.title} onChange={(e) => setSteps(update(steps, i, { title: e.target.value }))} className="input" placeholder="步骤标题" />
              <input value={step.tip || ""} onChange={(e) => setSteps(update(steps, i, { tip: e.target.value }))} className="input" placeholder="小提示（可选）" />
              <textarea value={step.body} onChange={(e) => setSteps(update(steps, i, { body: e.target.value }))} className="input md:col-span-2" rows={2} placeholder="这一步怎么做" />
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="panel p-4 grid gap-3">
          <Select label="地图" value={mapId} onChange={setMapId} options={MAPS.map((m) => ({ value: m.id, label: m.name }))} />
          <Select label="英雄" value={agentId} onChange={setAgentId} options={AGENTS.map((a) => ({ value: a.id, label: `${a.name} · ${a.role}` }))} />
          <Select label="技能" value={ability} onChange={setAbility} options={[{ value: "", label: "选择技能" }, ...(agent?.abilities.map((a) => ({ value: a.name, label: a.name })) || [])]} />
          <Select label="阵营" value={side} onChange={setSide} options={SIDES.map((s) => ({ value: s, label: s }))} />
          <Select label="包点" value={site} onChange={setSite} options={["A", "B", "C", "MID"].map((s) => ({ value: s, label: s }))} />
          <Field label="区域">
            <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="A大 / 中门 / 厨房" className="input" />
          </Field>
          <Select label="用途" value={purpose} onChange={setPurpose} options={PURPOSES.map((p) => ({ value: p.id, label: p.name }))} />
          <Select label="难度" value={difficulty} onChange={setDifficulty} options={DIFFICULTIES.map((d) => ({ value: d, label: d }))} />
        </div>
        <div className="panel p-4">
          <div className="mb-2 flex gap-2 text-xs">
            <button type="button" onClick={() => setPin("start")} className={`px-2 py-1 ${pin === "start" ? "bg-cyan text-black" : "border border-line"}`}>标站位</button>
            <button type="button" onClick={() => setPin("land")} className={`px-2 py-1 ${pin === "land" ? "bg-red" : "border border-line"}`}>标落点</button>
          </div>
          <button
            type="button"
            className="relative aspect-video w-full overflow-hidden bg-[#0d121a]"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              if (pin === "start") setStart({ x, y });
              else setLand({ x, y });
            }}
          >
            <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan" style={{ left: `${start.x}%`, top: `${start.y}%` }} />
            <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red" style={{ left: `${land.x}%`, top: `${land.y}%` }} />
            <span className="absolute left-2 top-2 text-[11px] text-faint">点击小地图标注</span>
          </button>
        </div>
        {error && <p className="text-sm text-red">{error}</p>}
        <button disabled={busy} className="w-full bg-red py-3 clip-btn disabled:opacity-50">
          {busy ? "发布中…" : "发布到社区"}
        </button>
      </aside>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function update(steps: GuideStep[], i: number, patch: Partial<GuideStep>) {
  return steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
}
