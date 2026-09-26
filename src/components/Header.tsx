"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, Upload, X } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { Avatar } from "./Avatar";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/products", label: "产品" },
  { href: "/library", label: "点位库" },
  { href: "/maps", label: "地图" },
  { href: "/community", label: "社区" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <header className="glass-bar sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-black text-white">
            瞬
          </span>
          <span className="leading-none">
            <strong className="brand-mark block text-[15px]" style={{ fontSize: "var(--fs-brand)" }}>
              瞬懂
            </strong>
            <small className="text-[11px] text-muted">点位社区</small>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" style={{ fontSize: "var(--fs-nav)" }}>
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 ${active ? "bg-brand-soft text-brand-strong" : "text-muted hover:text-ink"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form
          className="ml-auto hidden min-w-0 max-w-sm flex-1 items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 md:flex"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <Search className="h-4 w-4 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜点位、地图、英雄、作者…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </form>

        <Link href="/submit" className="btn btn-primary hidden !min-h-10 !px-4 text-sm md:inline-flex">
          <Upload className="h-4 w-4" />
          投稿
        </Link>

        {user ? (
          <Link href="/me" className="hidden items-center gap-2 md:flex">
            <Avatar name={user.displayName} mark={user.avatar} size="sm" />
            <span className="text-sm">{user.displayName}</span>
          </Link>
        ) : (
          <Link href="/login" className="hidden text-sm text-muted hover:text-ink md:block">
            登录 / 注册
          </Link>
        )}

        <button className="ml-auto md:hidden" onClick={() => setOpen((v) => !v)} aria-label="菜单">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line px-4 py-3 md:hidden">
          <form
            className="mb-3 flex items-center gap-2 rounded-full border border-line bg-card px-3 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              router.push(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <Search className="h-4 w-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索点位"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
          <div className="grid gap-1">
            {[...NAV, { href: "/submit", label: "投稿" }, { href: user ? "/me" : "/login", label: user ? "我的主页" : "登录 / 注册" }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-2 py-2 text-sm hover:bg-brand-soft">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
