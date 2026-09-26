/** 与主站 packages/shared/src/site-theme.ts 对齐的装扮变量。 */

export const SITE_THEME_VARS = [
  "--bg",
  "--bg-deep",
  "--ink",
  "--muted",
  "--line",
  "--brand",
  "--brand-strong",
  "--brand-soft",
  "--fire",
  "--fire-strong",
  "--fire-soft",
  "--accent",
  "--accent-soft",
  "--card",
  "--shadow",
  "--site-bg-layers",
  "--surface-radius",
  "--surface-pad",
  "--fs-nav",
  "--ff-nav",
  "--fs-brand",
  "--ff-brand",
  "--fs-hero-title",
  "--ff-hero-title",
  "--fs-hero-sub",
  "--ff-hero-sub",
  "--fs-section-title",
  "--ff-section-title",
  "--fs-section-desc",
  "--ff-section-desc",
  "--fs-filter-tag",
  "--ff-filter-tag",
] as const;

export type SiteThemeSnapshot = {
  themePackId?: string | null;
  paletteId?: string | null;
  backgroundId?: string | null;
  packName?: string | null;
  fx?: string | null;
  vars: Record<string, string>;
};

/** 拉不到主站装扮时的回退：清新天蓝，不走暗色战术红 */
export const FALLBACK_THEME_VARS: Record<string, string> = {
  "--bg": "#f5f9fc",
  "--bg-deep": "#e8f1f8",
  "--ink": "#0f172a",
  "--muted": "#5b6b7c",
  "--line": "rgba(15, 23, 42, 0.1)",
  "--brand": "#0ea5e9",
  "--brand-strong": "#0284c7",
  "--brand-soft": "rgba(14, 165, 233, 0.1)",
  "--fire": "#f43f5e",
  "--fire-strong": "#e11d48",
  "--fire-soft": "rgba(244, 63, 94, 0.1)",
  "--accent": "#f43f5e",
  "--accent-soft": "rgba(244, 63, 94, 0.1)",
  "--card": "rgba(255, 255, 255, 0.92)",
  "--shadow": "0 16px 40px rgba(15, 23, 42, 0.06)",
  "--site-bg-layers":
    "radial-gradient(ellipse 90% 55% at 8% -8%, rgba(14, 165, 233, 0.22), transparent 58%), radial-gradient(ellipse 60% 42% at 92% 0%, rgba(56, 189, 248, 0.12), transparent 50%), linear-gradient(180deg, #f7fbfe 0%, #f5f9fc 42%, #e4eef6 100%)",
  "--surface-radius": "28px",
  "--surface-pad": "1.5rem",
};

const THEME_ENDPOINTS = ["/api/public/theme", "https://www.yydsxwh.com/api/public/theme"];

export function applyThemeVars(vars: Record<string, string>, fx?: string | null) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    if (key.startsWith("--") && value) root.style.setProperty(key, value);
  }
  if (fx) root.setAttribute("data-theme-fx", fx);
  else root.removeAttribute("data-theme-fx");
}

function decodeCssValue(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .trim();
}

export function parseThemeFromHtml(html: string): SiteThemeSnapshot | null {
  const tag = html.match(/<html\b[^>]*>/i)?.[0];
  if (!tag) return null;
  const style = tag.match(/style=(["'])([\s\S]*?)\1/i)?.[2];
  if (!style) return null;
  const vars: Record<string, string> = {};
  for (const part of style.split(";")) {
    const i = part.indexOf(":");
    if (i < 0) continue;
    const key = part.slice(0, i).trim();
    const value = decodeCssValue(part.slice(i + 1));
    if (key.startsWith("--") && value) vars[key] = value;
  }
  if (!vars["--brand"] || !vars["--bg"]) return null;
  const fx = tag.match(/data-theme-fx=(["'])([\s\S]*?)\1/i)?.[2] || null;
  return { vars, fx };
}

async function fetchJsonTheme(url: string): Promise<SiteThemeSnapshot | null> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as SiteThemeSnapshot;
  if (!data?.vars || !data.vars["--brand"]) return null;
  return data;
}

export async function loadMainSiteTheme(): Promise<SiteThemeSnapshot> {
  for (const url of THEME_ENDPOINTS) {
    try {
      const snap = await fetchJsonTheme(url);
      if (snap) return snap;
    } catch {
      // try next source
    }
  }
  const pages = ["/", "https://www.yydsxwh.com/", "https://www.yydsxwh.com/products"];
  for (const url of pages) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const snap = parseThemeFromHtml(await res.text());
      if (snap) return { ...snap, packName: snap.packName || "主站当前装扮" };
    } catch {
      // try next source
    }
  }
  return {
    themePackId: "pack-sky-fresh",
    packName: "清新天蓝",
    vars: FALLBACK_THEME_VARS,
  };
}
