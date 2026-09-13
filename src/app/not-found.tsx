import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <p className="text-sm font-medium text-brand">404</p>
      <h1 className="mt-3 text-3xl font-semibold">这个点位还没人投过</h1>
      <Link href="/" className="btn btn-primary mt-6">回首页</Link>
    </div>
  );
}
