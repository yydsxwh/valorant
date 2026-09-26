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
      className={`inline-flex ${dim} items-center justify-center rounded-full bg-brand-soft font-semibold text-brand-strong`}
    >
      {mark || initials(name)}
    </span>
  );
}
