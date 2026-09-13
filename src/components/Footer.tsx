import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center bg-red clip-btn text-sm font-black">瞬</span>
            <div>
              <strong>瞬懂</strong>
              <p className="text-sm text-muted">让每个点位都有人教，也有地方讨论。</p>
            </div>
          </div>
          <p className="mt-3 max-w-lg text-xs text-faint">
            玩家社区作品，与拳头游戏 / 无畏契约官方无关联。游戏名称与相关素材版权归其权利人所有。
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <Link href="/products">产品</Link>
          <Link href="/library">点位教程库</Link>
          <Link href="/community">社区</Link>
          <Link href="/submit">投稿</Link>
          <Link href="/maps">地图查询</Link>
        </div>
      </div>
    </footer>
  );
}
