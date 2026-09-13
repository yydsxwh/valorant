"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [username, setUsername] = useState(mode === "login" ? "demo" : "");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState(mode === "login" ? "demo123" : "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const next = params.get("next") || "/";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, displayName, password }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "失败了，再试一次");
      return;
    }
    await refresh();
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="panel mx-auto w-full max-w-md p-6 clip-card">
      <h1 className="text-2xl font-semibold">{mode === "login" ? "登录瞬懂" : "加入社区"}</h1>
      <p className="mt-1 text-sm text-muted">
        {mode === "login" ? "体验账号已填好：demo / demo123" : "注册后就能投稿、评论、收藏。"}
      </p>
      <label className="mt-5 block text-sm text-muted">用户名</label>
      <input className="mt-1 w-full border border-line bg-bg px-3 py-2 outline-none focus:border-red" value={username} onChange={(e) => setUsername(e.target.value)} required />
      {mode === "register" && (
        <>
          <label className="mt-4 block text-sm text-muted">邮箱</label>
          <input type="email" className="mt-1 w-full border border-line bg-bg px-3 py-2 outline-none focus:border-red" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label className="mt-4 block text-sm text-muted">昵称</label>
          <input className="mt-1 w-full border border-line bg-bg px-3 py-2 outline-none focus:border-red" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </>
      )}
      <label className="mt-4 block text-sm text-muted">密码</label>
      <input type="password" className="mt-1 w-full border border-line bg-bg px-3 py-2 outline-none focus:border-red" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p className="mt-3 text-sm text-red">{error}</p>}
      <button disabled={busy} className="mt-5 w-full bg-red py-2.5 clip-btn disabled:opacity-50">
        {mode === "login" ? "进入社区" : "创建账号"}
      </button>
      <p className="mt-4 text-center text-sm text-muted">
        {mode === "login" ? (
          <>还没有账号？<Link href="/register" className="text-red">注册</Link></>
        ) : (
          <>已有账号？<Link href="/login" className="text-red">登录</Link></>
        )}
      </p>
    </form>
  );
}
