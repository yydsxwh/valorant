import { initials } from "@/lib/format";

export function Avatar({
  name,
  mark,
  size = "md",
}: {
  name: string;
  mark?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-16 w-16 text-2xl" : "h-10 w-10 text-sm";
  return (
    <span
      className={`inline-flex ${dim} items-center justify-center rounded-full bg-linear-to-br from-[#ff4655] to-[#6b1b2a] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]`}
    >
      {mark || initials(name)}
    </span>
  );
}
