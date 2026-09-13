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

  async function boot() {
    apply(FALLBACK, null, "清新天蓝");
    var sources = ["/api/public/theme", "https://www.yydsxwh.com/api/public/theme"];
    for (var i = 0; i < sources.length; i++) {
      try {
        var snap = await loadJson(sources[i]);
        if (snap) {
          apply(snap.vars, snap.fx, snap.packName || "主站装扮");
          return;
        }
      } catch (e) {}
    }
    var pages = ["/", "https://www.yydsxwh.com/", "https://www.yydsxwh.com/products"];
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
