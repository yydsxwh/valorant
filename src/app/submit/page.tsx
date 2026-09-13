import type { Metadata } from "next";
import { SubmitForm } from "@/components/SubmitForm";

export const metadata: Metadata = { title: "投稿" };

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">投稿点位</h1>
      <p className="mt-2 mb-8 text-muted">视频教学或图文笔记都可以。标好地图、英雄和站位，方便别人检索。</p>
      <SubmitForm />
    </div>
  );
}
