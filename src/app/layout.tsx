import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteTheme } from "@/components/SiteTheme";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "瞬懂｜无畏契约点位社区",
    template: "%s｜瞬懂",
  },
  description: "玩家自由上传无畏契约点位教学视频与图文攻略笔记，支持评论、点赞、收藏和分享。",
  icons: { icon: "/icon.svg" },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <SiteTheme />
        <AuthProvider initialUser={user}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
