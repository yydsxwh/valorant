import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-red">404</p>
      <h1 className="mt-3 text-3xl font-semibold">这个点位还没人投过</h1>
      <Link href="/" className="mt-6 inline-block bg-red px-4 py-2 clip-btn">回首页</Link>
    </div>
  );
}
