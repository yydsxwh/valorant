"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PostRecord, PublicUser } from "@/lib/types";
import { Avatar } from "./Avatar";
import { PostCard } from "./PostCard";
import { useAuth } from "./AuthProvider";

export function ProfileView({
  user,
  posts,
  favorites,
  mine,
}: {
  user: PublicUser;
  posts: PostRecord[];
  favorites: PostRecord[];
  mine?: boolean;
}) {
  const [tab, setTab] = useState<"works" | "favs">("works");
  const { logout } = useAuth();
  const router = useRouter();
  const list = tab === "works" ? posts : favorites;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="panel flex flex-wrap items-center gap-5 p-6 clip-card">
        <Avatar name={user.displayName} mark={user.avatar} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold">{user.displayName}</h1>
          <p className="text-sm text-muted">@{user.username} · {user.rank}</p>
          <p className="mt-2 text-sm text-muted">{user.bio || "这个人还没写简介。"}</p>
        </div>
        {mine && (
          <button
            onClick={async () => {
              await logout();
              router.push("/");
              router.refresh();
            }}
            className="border border-line px-3 py-2 text-sm text-muted"
          >
            退出登录
          </button>
        )}
      </div>
      <div className="mt-6 flex gap-2">
        <button onClick={() => setTab("works")} className={`px-3 py-1.5 text-sm ${tab === "works" ? "bg-red" : "border border-line text-muted"}`}>
          作品 {posts.length}
        </button>
        {(mine || favorites.length > 0) && (
          <button onClick={() => setTab("favs")} className={`px-3 py-1.5 text-sm ${tab === "favs" ? "bg-red" : "border border-line text-muted"}`}>
            收藏 {favorites.length}
          </button>
        )}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
      {list.length === 0 && <p className="mt-10 text-center text-muted">这里还是空的。</p>}
    </div>
  );
}
