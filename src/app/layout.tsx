import type { Metadata } from "next";
import { Noto_Sans_SC, Outfit } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const noto = Noto_Sans_SC({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "瞬点｜无畏契约点位社区",
    template: "%s｜瞬点",
  },
  description: "玩家自由上传无畏契约点位教学视频与图文攻略笔记，支持评论、点赞、收藏和分享。",
  icons: { icon: "/icon.svg" },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="zh-CN" className={`${outfit.variable} ${noto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider initialUser={user}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
