import { NextResponse } from "next/server";
import { FALLBACK_THEME_VARS, parseThemeFromHtml } from "@/lib/site-theme";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://www.yydsxwh.com/", { cache: "no-store" });
    if (res.ok) {
      const snap = parseThemeFromHtml(await res.text());
      if (snap) {
        return NextResponse.json(
          { ...snap, packName: snap.packName || "主站当前装扮" },
          { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=15" } },
        );
      }
    }
  } catch {
    // fall through
  }
  return NextResponse.json(
    { themePackId: "pack-sky-fresh", packName: "清新天蓝", vars: FALLBACK_THEME_VARS },
    { headers: { "Access-Control-Allow-Origin": "*" } },
  );
}
