"use client";

import { useEffect } from "react";
import { applyThemeVars, loadMainSiteTheme } from "@/lib/site-theme";

export function SiteTheme() {
  useEffect(() => {
    let cancelled = false;
    loadMainSiteTheme().then((snap) => {
      if (cancelled) return;
      applyThemeVars(snap.vars, snap.fx);
      if (snap.packName) {
        document.documentElement.dataset.themePack = snap.packName;
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
