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
    <header className="sticky top-0 z-40 border-b border-line/80 bg-[#07090d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-8 w-8 items-center justify-center bg-red clip-btn">
            <span className="text-sm font-black tracking-tight">瞬</span>
          </span>
          <span className="leading-none">
            <strong className="block text-[15px] tracking-[0.18em]">瞬懂</strong>
            <small className="text-[10px] text-faint tracking-[0.22em]">SHUNDONG</small>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-sm ${active ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {item.label}
                {active && <i className="mt-1 block h-0.5 w-full bg-red" />}
              </Link>
            );
          })}
        </nav>

        <form
          className="ml-auto hidden min-w-0 flex-1 max-w-sm items-center gap-2 rounded-full border border-line bg-elev px-3 py-1.5 md:flex"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <Search className="h-4 w-4 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜点位、地图、英雄、作者…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
          />
        </form>

        <Link
          href="/submit"
          className="hidden items-center gap-1.5 bg-red px-3 py-2 text-sm font-medium text-white clip-btn md:inline-flex"
        >
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
        <div className="border-t border-line bg-bg px-4 py-3 md:hidden">
          <form
            className="mb-3 flex items-center gap-2 rounded-full border border-line bg-elev px-3 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              router.push(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <Search className="h-4 w-4 text-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索点位"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
          <div className="grid gap-1">
            {[...NAV, { href: "/submit", label: "投稿" }, { href: user ? "/me" : "/login", label: user ? "我的主页" : "登录 / 注册" }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm hover:bg-elev">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
