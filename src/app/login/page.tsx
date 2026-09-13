import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "登录" };

export default function LoginPage() {
  return (
    <div className="px-4 py-16">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
