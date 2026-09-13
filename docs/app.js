const MAPS = [
  ["ascent", "亚海悬城"], ["bind", "裂变峡谷"], ["haven", "隐世修所"], ["split", "霓虹町"],
  ["icebox", "森寒冬港"], ["breeze", "微风岛屿"], ["lotus", "莲华古城"], ["sunset", "日落之城"],
  ["abyss", "幽邃地窟"], ["pearl", "珍珠之城"], ["corrode", "腐蚀之地"], ["summit", "巅峰山脊"],
];
const AGENTS = [["sage", "贤者"], ["sova", "索瓦"], ["fade", "幽影"], ["brimstone", "炼狱"], ["viper", "蝰蛇"], ["omen", "暗影"], ["gekko", "盖可"], ["kayo", "K/O"], ["universal", "通用"]];

const SEED_POSTS = [
  { id: "p_bind_brim", type: "video", title: "裂变峡谷 · 炼狱 A 短默认三烟", summary: "出生直接标 A 浴、A 灯、A 通。", body: "别学花活。这三颗烟能让决斗者安心摸短。", map: "bind", agent: "brimstone", ability: "空中烟雾", side: "进攻", site: "A", difficulty: "简单", likes: 1640, favs: 890, comments: [{ user: "体验玩家", body: "这三烟今晚连用五把。" }], views: 21003, author: "烟位研究员" },
  { id: "p_ascent_sage", type: "video", title: "亚海悬城 · 贤者 B 大非常规天空位", summary: "中厅后门贴箱跳投，冰墙卡在拱门上沿。", body: "墙要贴上沿，太低会被 B 楼打穿。", map: "ascent", agent: "sage", ability: "冰墙", side: "进攻", site: "B", difficulty: "困难", likes: 932, favs: 411, comments: [], views: 12840, author: "瞬懂官方" },
  { id: "p_icebox_omen", type: "guide", title: "森寒冬港 · 暗影厨房单向烟笔记", summary: "烟的下沿卡窗沿，你蹲着能看见脚。", body: "大多数人高度不对。原则：下沿卡窗沿。", map: "icebox", agent: "omen", ability: "暗影之幕", side: "防守", site: "B", difficulty: "简单", likes: 1503, favs: 977, comments: [{ user: "瞬懂官方", body: "单向高度讲得很清楚。" }], views: 19021, author: "烟位研究员" },
  { id: "p_newbie", type: "guide", title: "新手如何练点位：先练这 8 个", summary: "会 8 个稳定点，比会 40 个容易丢的更有用。", body: "每天自定义 15 分钟，先练默认。", map: "ascent", agent: "brimstone", ability: "空中烟雾", side: "进攻", site: "A", difficulty: "简单", likes: 2108, favs: 1320, comments: [], views: 25410, author: "新人教练阿木" },
  { id: "p_sunset_fade", type: "video", title: "日落之城 · 幽影 A 大照管道眼", summary: "开局 A 大门口贴墙扔诡眼。", body: "排位最常用开局眼。扔完立刻回身。", map: "sunset", agent: "fade", ability: "诡眼", side: "进攻", site: "A", difficulty: "简单", likes: 701, favs: 288, comments: [], views: 8602, author: "闪光手阿闪" },
  { id: "p_haven_sova", type: "video", title: "隐世修所 · 索瓦 A 长双跳箭", summary: "出生双跳侦察箭，同时照 A 长与花园。", body: "充能一格是关键。", map: "haven", agent: "sova", ability: "侦察箭", side: "进攻", site: "A", difficulty: "中等", likes: 1102, favs: 540, comments: [], views: 15770, author: "闪光手阿闪" },
];

const KEY = "shundong:v1";
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { user: null, posts: SEED_POSTS, liked: {}, fav: {} };
}
function save(state) { localStorage.setItem(KEY, JSON.stringify(state)); }
let state = load();

function mapName(id) { return (MAPS.find((m) => m[0] === id) || [id, id])[1]; }
function agentName(id) { return (AGENTS.find((a) => a[0] === id) || [id, id])[1]; }
function navigate(hash) { location.hash = hash; }
function route() {
  const raw = location.hash.replace(/^#/, "") || "/";
  const [path, qs] = raw.split("?");
  const q = Object.fromEntries(new URLSearchParams(qs || ""));
  return { path, q };
}

function card(p) {
  return `<article class="panel clip">
    <a href="#/posts/${p.id}">
      <div class="card-cover" style="background:linear-gradient(135deg,#151820,#ff465555)"></div>
      <div style="padding:16px">
        <div class="faint">${p.type === "video" ? "视频" : "图文"} · ${mapName(p.map)} · ${agentName(p.agent)}</div>
        <h3 style="margin:8px 0 0;font-size:16px">${esc(p.title)}</h3>
        <p class="muted" style="font-size:14px">${esc(p.summary)}</p>
      </div>
    </a>
    <div class="faint" style="padding:0 16px 12px">${esc(p.author)} · ${p.likes} 赞 · ${p.favs} 藏</div>
  </article>`;
}
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function render() {
  const { path, q } = route();
  document.getElementById("nav").innerHTML = [
    ["#/", "首页"],
    ["#/products", "产品"],
    ["#/library", "点位库"],
    ["#/maps", "地图"],
    ["#/community", "社区"],
    ["#/submit", "投稿"],
  ].map(([h, l]) => `<a href="${h}" class="${path === h.slice(1) || (h === "#/" && path === "/") ? "on" : ""}">${l}</a>`).join("");
  document.getElementById("who").innerHTML = state.user
    ? `<a href="#/me">${esc(state.user)}</a>`
    : `<a href="#/login">登录 / 注册</a>`;

  const app = document.getElementById("app");
  if (path === "/products") {
    app.innerHTML = `<h1 style="font-size:28px">产品</h1>
      <p class="muted">瞬懂已挂在主站产品中心，也可在这里直接打开。</p>
      <article class="panel clip" style="max-width:36rem;margin-top:24px;padding:24px">
        <div class="faint">单独上线 · 无畏契约点位社区</div>
        <h2>瞬懂 SHUNDONG</h2>
        <p class="muted">上传点位教学视频和图文攻略笔记，支持评论、点赞、收藏和分享。</p>
        <a class="btn" href="#/">打开瞬懂</a>
      </article>`;
    return;
  }
  if (path === "/" ) {
    app.innerHTML = `<section class="grid hero" style="align-items:center;gap:32px;margin-bottom:40px">
      <div>
        <div style="color:var(--red);letter-spacing:.28em;font-size:12px">VALORANT LINEUP COMMUNITY</div>
        <h1>找点位，不用再把视频拉来拉去。</h1>
        <p class="muted">瞬懂是给国服玩家用的无畏契约社区：上传教学视频，写图文笔记，别人可以评论、点赞、收藏和一键分享给开黑队友。</p>
        <div class="actions" style="margin-top:20px">
          <a class="btn" href="#/library">进入点位库</a>
          <a class="btn ghost" href="#/submit">我要投稿</a>
        </div>
      </div>
      <div class="panel clip" style="padding:20px">
        <div class="muted" style="margin-bottom:8px">本周热门</div>
        ${[...state.posts].sort((a,b)=>b.likes-a.likes).slice(0,4).map((p,i)=>`<a href="#/posts/${p.id}" style="display:block;padding:8px 0">${String(i+1).padStart(2,"0")} ${esc(p.title)}</a>`).join("")}
      </div>
    </section>
    <div class="grid cards">${state.posts.slice(0,6).map(card).join("")}</div>`;
    return;
  }
  if (path === "/library" || path === "/community") {
    let posts = state.posts;
    if (q.type) posts = posts.filter((p) => p.type === q.type);
    if (q.map) posts = posts.filter((p) => p.map === q.map);
    app.innerHTML = `<h1 style="font-size:28px">${path === "/library" ? "点位教程库" : "社区动态"}</h1>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin:16px 0">
        <button class="chip ${!q.type?"on":""}" data-go="${path}">全部</button>
        <button class="chip ${q.type==="video"?"on":""}" data-go="${path}?type=video">视频教学</button>
        <button class="chip ${q.type==="guide"?"on":""}" data-go="${path}?type=guide">图文笔记</button>
        ${MAPS.map(([id,n])=>`<button class="chip ${q.map===id?"on":""}" data-go="${path}?map=${id}">${n}</button>`).join("")}
      </div>
      <div class="grid cards">${posts.map(card).join("") || "<p class='muted'>没有匹配内容</p>"}</div>`;
    app.querySelectorAll("[data-go]").forEach((el) => el.onclick = () => navigate("#" + el.dataset.go));
    return;
  }
  if (path === "/maps") {
    app.innerHTML = `<h1 style="font-size:28px">按地图查点位</h1>
      <div class="grid cards" style="margin-top:20px">${MAPS.map(([id,n]) => `<a class="panel clip" href="#/library?map=${id}" style="padding:20px"><h3>${n}</h3><p class="faint">${id}</p></a>`).join("")}</div>`;
    return;
  }
  if (path.startsWith("/posts/")) {
    const id = path.slice(7);
    const p = state.posts.find((x) => x.id === id);
    if (!p) { app.innerHTML = "<p>没有这条内容</p>"; return; }
    p.views = (p.views || 0) + 1; save(state);
    const liked = !!state.liked[id];
    const faved = !!state.fav[id];
    app.innerHTML = `<div class="panel clip" style="aspect-ratio:16/9;background:radial-gradient(circle at 30% 20%,#ff465533,#0b0f16 55%);margin-bottom:20px;display:grid;place-items:center" class="muted">互动演示 · ${esc(p.ability)}</div>
      <div class="faint">${p.type==="video"?"视频教学":"图文笔记"} · ${mapName(p.map)} · ${agentName(p.agent)} · ${p.side}${p.site}</div>
      <h1 style="font-size:32px">${esc(p.title)}</h1>
      <p class="muted">${esc(p.summary)}</p>
      <div class="actions" style="margin:16px 0">
        <button class="btn ${liked?"":"ghost"}" id="like">点赞 ${p.likes}</button>
        <button class="btn ${faved?"":"ghost"}" id="fav">收藏 ${p.favs}</button>
        <button class="btn ghost" id="share">分享</button>
      </div>
      <article class="panel clip" style="padding:20px;white-space:pre-wrap">${esc(p.body)}</article>
      <section class="panel clip" style="padding:20px;margin-top:20px">
        <h3>评论 ${(p.comments||[]).length}</h3>
        <div id="clist">${(p.comments||[]).map((c)=>`<p><strong>${esc(c.user)}</strong> ${esc(c.body)}</p>`).join("") || "<p class='faint'>来写第一条心得</p>"}</div>
        <textarea id="cbody" class="input" rows="3" placeholder="说说这个点位好不好用…"></textarea>
        <div style="margin-top:8px"><button class="btn" id="cpub">发布</button></div>
      </section>`;
    document.getElementById("like").onclick = () => {
      if (!needUser()) return;
      state.liked[id] = !state.liked[id];
      p.likes += state.liked[id] ? 1 : -1;
      save(state); render();
    };
    document.getElementById("fav").onclick = () => {
      if (!needUser()) return;
      state.fav[id] = !state.fav[id];
      p.favs += state.fav[id] ? 1 : -1;
      save(state); render();
    };
    document.getElementById("share").onclick = async () => {
      const url = location.href;
      try { await navigator.clipboard.writeText(`【瞬懂】${p.title}\n${url}`); alert("分享卡片已复制"); } catch { alert(url); }
    };
    document.getElementById("cpub").onclick = () => {
      if (!needUser()) return;
      const body = document.getElementById("cbody").value.trim();
      if (!body) return;
      p.comments = p.comments || [];
      p.comments.push({ user: state.user, body });
      save(state); render();
    };
    return;
  }
  if (path === "/login") {
    app.innerHTML = `<form class="panel clip" style="max-width:420px;margin:40px auto;padding:24px" id="lf">
      <h1 style="font-size:28px">登录瞬懂</h1>
      <p class="muted">体验账号已填好：demo / demo123</p>
      <label class="muted">用户名</label><input class="input" name="u" value="demo" />
      <label class="muted" style="display:block;margin-top:12px">密码</label><input class="input" name="p" type="password" value="demo123" />
      <button class="btn" style="width:100%;margin-top:16px">进入社区</button>
    </form>`;
    document.getElementById("lf").onsubmit = (e) => {
      e.preventDefault();
      const u = e.target.u.value.trim();
      const p = e.target.p.value;
      if ((u === "demo" && p === "demo123") || (u && p.length >= 6)) {
        state.user = u === "demo" ? "体验玩家" : u;
        save(state);
        navigate("#/");
      } else alert("用户名或密码不对");
    };
    return;
  }
  if (path === "/submit") {
    if (!state.user) { navigate("#/login"); return; }
    app.innerHTML = `<h1 style="font-size:28px">投稿点位</h1>
      <form id="sf" class="panel clip" style="padding:20px;margin-top:16px">
        <label class="muted">标题</label><input class="input" name="title" required placeholder="例如：亚海悬城 炼狱 A 门默认烟" />
        <label class="muted" style="display:block;margin-top:12px">摘要</label><input class="input" name="summary" required />
        <label class="muted" style="display:block;margin-top:12px">正文</label><textarea class="input" name="body" rows="5"></textarea>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
          <label>地图<select class="input" name="map">${MAPS.map(([id,n])=>`<option value="${id}">${n}</option>`).join("")}</select></label>
          <label>英雄<select class="input" name="agent">${AGENTS.map(([id,n])=>`<option value="${id}">${n}</option>`).join("")}</select></label>
        </div>
        <button class="btn" style="margin-top:16px">发布到社区</button>
      </form>`;
    document.getElementById("sf").onsubmit = (e) => {
      e.preventDefault();
      const f = e.target;
      const id = "p_" + Math.random().toString(16).slice(2, 10);
      state.posts.unshift({
        id, type: "guide", title: f.title.value, summary: f.summary.value, body: f.body.value,
        map: f.map.value, agent: f.agent.value, ability: "", side: "进攻", site: "A", difficulty: "简单",
        likes: 0, favs: 0, comments: [], views: 1, author: state.user,
      });
      save(state);
      navigate("#/posts/" + id);
    };
    return;
  }
  if (path === "/me") {
    if (!state.user) { navigate("#/login"); return; }
    const mine = state.posts.filter((p) => p.author === state.user);
    const favs = state.posts.filter((p) => state.fav[p.id]);
    app.innerHTML = `<h1 style="font-size:28px">${esc(state.user)}</h1>
      <p class="muted">作品 ${mine.length} · 收藏 ${favs.length}</p>
      <div class="grid cards" style="margin-top:16px">${[...mine, ...favs].map(card).join("") || "<p class='muted'>这里还是空的</p>"}</div>
      <p style="margin-top:20px"><button class="btn ghost" id="out">退出登录</button></p>`;
    document.getElementById("out").onclick = () => { state.user = null; save(state); navigate("#/"); };
  }
}

function needUser() {
  if (state.user) return true;
  navigate("#/login");
  return false;
}

window.addEventListener("hashchange", render);
render();
