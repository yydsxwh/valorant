import Link from "next/link";
import { NavPageTemplateShell } from "@/components/nav-page-template-shell";

const SHUNSPOT_URL =
  process.env.NEXT_PUBLIC_SHUNSPOT_URL || "https://yydsxwh.github.io/valorant/";

export const metadata = {
  title: "瞬点",
  description: "无畏契约点位社区：视频教学与图文笔记",
};

export default function ShunspotProductPage() {
  return (
    <NavPageTemplateShell type="products">
      <div className="container py-10 sm:py-12">
        <p className="text-sm font-medium text-[var(--brand)]">软件产品 · 瞬点</p>
        <h1 className="brand-mark mt-2 text-3xl font-semibold sm:text-4xl">
          瞬点 SHUNSPOT
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          无畏契约点位社区。先作为独立产品上线：上传教学视频或图文笔记，别人可以评论、点赞、收藏、分享。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={SHUNSPOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary min-h-11 px-5"
          >
            打开瞬点
          </a>
          <Link href="/products" className="btn btn-secondary min-h-11 px-5">
            返回软件产品
          </Link>
        </div>
      </div>
    </NavPageTemplateShell>
  );
}
