import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "注册" };

export default function RegisterPage() {
  return (
    <div className="px-4 py-16">
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}
