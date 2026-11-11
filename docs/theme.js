(function () {
  var FALLBACK = {
    "--bg": "#f5f9fc",
    "--bg-deep": "#e8f1f8",
    "--ink": "#0f172a",
    "--muted": "#5b6b7c",
    "--line": "rgba(15, 23, 42, 0.1)",
    "--brand": "#0ea5e9",
    "--brand-strong": "#0284c7",
    "--brand-soft": "rgba(14, 165, 233, 0.12)",
    "--fire": "#f43f5e",
    "--fire-strong": "#e11d48",
    "--fire-soft": "rgba(244, 63, 94, 0.1)",
    "--accent": "#f43f5e",
    "--accent-soft": "rgba(244, 63, 94, 0.1)",
    "--card": "rgba(255, 255, 255, 0.92)",
    "--shadow": "0 16px 40px rgba(15, 23, 42, 0.06)",
    "--site-bg-layers":
      "radial-gradient(ellipse 90% 55% at 8% -8%, rgba(14, 165, 233, 0.22), transparent 58%), linear-gradient(180deg, #f7fbfe 0%, #f5f9fc 42%, #e4eef6 100%)",
    "--surface-radius": "28px",
    "--surface-pad": "1.5rem",
  };

  function apply(vars, fx, name) {
    var root = document.documentElement;
    Object.keys(vars || {}).forEach(function (key) {
      if (key.indexOf("--") === 0 && vars[key]) root.style.setProperty(key, vars[key]);
    });
    if (fx) root.setAttribute("data-theme-fx", fx);
    if (name) {
      root.dataset.themePack = name;
      var el = document.getElementById("theme-pack");
      if (el) el.textContent = "装扮 · " + name;
    }
  }

  function decode(value) {
    return String(value || "")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .trim();
  }

  function parseHtml(html) {
    var tag = (html.match(/<html\b[^>]*>/i) || [])[0];
    if (!tag) return null;
    var styleMatch = tag.match(/style=(["'])([\s\S]*?)\1/i);
    if (!styleMatch) return null;
    var vars = {};
    styleMatch[2].split(";").forEach(function (part) {
      var i = part.indexOf(":");
      if (i < 0) return;
      var key = part.slice(0, i).trim();
      var value = decode(part.slice(i + 1));
      if (key.indexOf("--") === 0 && value) vars[key] = value;
    });
    if (!vars["--brand"]) return null;
    var fx = (tag.match(/data-theme-fx=(["'])([\s\S]*?)\1/i) || [])[2] || "";
    return { vars: vars, fx: fx, packName: "主站当前装扮" };
  }

  async function loadJson(url) {
    var res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    var data = await res.json();
    return data && data.vars && data.vars["--brand"] ? data : null;
  }

  function fromPublic(data) {
    var colors = data && data.colors;
    if (!colors || !colors.brand) return null;
    var font = data.font || {};
    return {
      vars: {
        "--bg": colors.bg,
        "--bg-deep": colors.bgDeep,
        "--ink": colors.ink,
        "--muted": colors.muted,
        "--line": colors.line,
        "--brand": colors.brand,
        "--brand-strong": colors.brandStrong,
        "--brand-soft": colors.brandSoft,
        "--fire": colors.fire,
        "--fire-strong": colors.fireStrong,
        "--fire-soft": colors.fireSoft,
        "--accent": colors.fire,
        "--accent-soft": colors.fireSoft,
        "--card": colors.card,
        "--shadow": colors.shadow,
        "--site-bg-layers": (data.background && data.background.layers) || colors.bg,
        "--surface-radius": (data.radiusPx || 16) + "px",
        "--surface-pad": data.surfacePad || "1.5rem",
        "--font-body": font.family || FALLBACK["--font-body"],
      },
      fx: "",
      packName: data.paletteId || "主站装扮",
    };
  }

  async function boot() {
    var cacheKey = "kemiao-shundong-theme";
    try {
      var cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      if (cached && cached.vars) {
        apply(cached.vars, cached.fx, cached.packName);
        if (cached.storedAt && Date.now() - cached.storedAt < 60000) return;
      } else {
        apply(FALLBACK);
      }
    } catch (error) {
      apply(FALLBACK);
    }
    try {
      var current = await loadJson("/api/theme/public");
      var mapped = fromPublic(current);
      if (mapped) {
        apply(mapped.vars, mapped.fx, mapped.packName);
        localStorage.setItem(cacheKey, JSON.stringify({ vars: mapped.vars, fx: mapped.fx, packName: mapped.packName, storedAt: Date.now() }));
        return;
      }
    } catch (error) {}
    var sources = ["/api/public/theme"];
    for (var i = 0; i < sources.length; i++) {
      try {
        var snap = await loadJson(sources[i]);
        if (snap) {
          apply(snap.vars, snap.fx, snap.packName || "主站装扮");
          return;
        }
      } catch (e) {}
    }
    var pages = ["/", "https://www.kemiao.net/", "https://www.kemiao.net/products"];
    for (var j = 0; j < pages.length; j++) {
      try {
        var res = await fetch(pages[j], { cache: "no-store" });
        if (!res.ok) continue;
        var parsed = parseHtml(await res.text());
        if (parsed) {
          apply(parsed.vars, parsed.fx, parsed.packName);
          return;
        }
      } catch (e) {}
    }
  }

  boot();
})();
