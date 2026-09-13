import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "fs";
import { join } from "path";
import { hashPassword } from "./password";
import { randomBytes } from "crypto";
import type { CommentRecord, GuideStep, PostRecord, PublicUser } from "./types";

export type { CommentRecord, GuideStep, PostRecord, PublicUser } from "./types";

const DATA_DIR = join(process.cwd(), "data");
mkdirSync(join(DATA_DIR, "uploads"), { recursive: true });

function openDatabase() {
  const path = join(DATA_DIR, "valspot.db");
  let last: unknown;
  for (let i = 0; i < 12; i++) {
    try {
      const database = new DatabaseSync(path, { timeout: 20000 });
      database.exec("PRAGMA busy_timeout = 20000;");
      database.exec("PRAGMA journal_mode = WAL;");
      database.exec("PRAGMA foreign_keys = ON;");
      return database;
    } catch (error) {
      last = error;
      const wait = 80 * (i + 1);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, wait);
    }
  }
  throw last;
}

const db = openDatabase();

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  avatar TEXT NOT NULL DEFAULT '瞬',
  rank TEXT NOT NULL DEFAULT '新锐',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  video_kind TEXT NOT NULL DEFAULT 'demo',
  video_url TEXT NOT NULL DEFAULT '',
  cover_url TEXT NOT NULL DEFAULT '',
  map_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  ability TEXT NOT NULL DEFAULT '',
  side TEXT NOT NULL,
  site TEXT NOT NULL DEFAULT '',
  area TEXT NOT NULL DEFAULT '',
  purpose TEXT NOT NULL DEFAULT 'DEFAULT',
  difficulty TEXT NOT NULL DEFAULT '简单',
  start_x REAL NOT NULL DEFAULT 30,
  start_y REAL NOT NULL DEFAULT 60,
  land_x REAL NOT NULL DEFAULT 70,
  land_y REAL NOT NULL DEFAULT 30,
  steps_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  favorite_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  parent_id TEXT,
  body TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS likes (
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  post_id TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'link',
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_map ON posts(map_id);
CREATE INDEX IF NOT EXISTS idx_posts_agent ON posts(agent_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at);
`);

type UserRow = {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  display_name: string;
  bio: string;
  avatar: string;
  rank: string;
  created_at: number;
};

type PostRow = {
  id: string;
  author_id: string;
  type: "video" | "guide";
  title: string;
  summary: string;
  body: string;
  video_kind: PostRecord["videoKind"];
  video_url: string;
  cover_url: string;
  map_id: string;
  agent_id: string;
  ability: string;
  side: string;
  site: string;
  area: string;
  purpose: string;
  difficulty: string;
  start_x: number;
  start_y: number;
  land_x: number;
  land_y: number;
  steps_json: string;
  tags_json: string;
  view_count: number;
  like_count: number;
  favorite_count: number;
  comment_count: number;
  share_count: number;
  created_at: number;
  updated_at: number;
};

function nid(prefix = "") {
  return prefix + randomBytes(8).toString("hex");
}

function publicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio,
    avatar: row.avatar,
    rank: row.rank,
    createdAt: row.created_at,
  };
}

function mapPost(row: PostRow, author: PublicUser): PostRecord {
  return {
    id: row.id,
    authorId: row.author_id,
    type: row.type,
    title: row.title,
    summary: row.summary,
    body: row.body,
    videoKind: row.video_kind,
    videoUrl: row.video_url,
    coverUrl: row.cover_url,
    mapId: row.map_id,
    agentId: row.agent_id,
    ability: row.ability,
    side: row.side,
    site: row.site,
    area: row.area,
    purpose: row.purpose,
    difficulty: row.difficulty,
    startX: row.start_x,
    startY: row.start_y,
    landX: row.land_x,
    landY: row.land_y,
    steps: JSON.parse(row.steps_json || "[]"),
    tags: JSON.parse(row.tags_json || "[]"),
    viewCount: row.view_count,
    likeCount: row.like_count,
    favoriteCount: row.favorite_count,
    commentCount: row.comment_count,
    shareCount: row.share_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    author,
  };
}

const userById = db.prepare("SELECT * FROM users WHERE id = ?");
const userByName = db.prepare("SELECT * FROM users WHERE username = ? OR email = ?");

export function getUserById(id: string): PublicUser | null {
  const row = userById.get(id) as UserRow | undefined;
  return row ? publicUser(row) : null;
}

export function getUserRecord(usernameOrEmail: string) {
  return userByName.get(usernameOrEmail, usernameOrEmail) as UserRow | undefined;
}

export function createUser(input: {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}) {
  const id = nid("u_");
  const now = Date.now();
  db.prepare(
    `INSERT INTO users (id, username, email, password_hash, display_name, bio, avatar, rank, created_at)
     VALUES (?, ?, ?, ?, ?, '', ?, '新锐', ?)`,
  ).run(
    id,
    input.username.trim(),
    input.email.trim().toLowerCase(),
    hashPassword(input.password),
    input.displayName?.trim() || input.username.trim(),
    input.displayName?.trim()?.slice(0, 1) || input.username.trim().slice(0, 1),
    now,
  );
  return getUserById(id)!;
}

export type PostFilters = {
  q?: string;
  type?: string;
  mapId?: string;
  agentId?: string;
  side?: string;
  site?: string;
  purpose?: string;
  difficulty?: string;
  authorId?: string;
  sort?: "new" | "hot" | "likes";
  limit?: number;
  offset?: number;
};

function hydratePosts(rows: PostRow[], userId?: string | null): PostRecord[] {
  const authors = new Map<string, PublicUser>();
  const liked = new Set<string>();
  const favorited = new Set<string>();
  if (userId && rows.length) {
    const ids = rows.map((r) => r.id);
    const likeRows = db
      .prepare(
        `SELECT target_id FROM likes WHERE user_id = ? AND target_type = 'post' AND target_id IN (${ids.map(() => "?").join(",")})`,
      )
      .all(userId, ...ids) as { target_id: string }[];
    likeRows.forEach((r) => liked.add(r.target_id));
    const favRows = db
      .prepare(
        `SELECT post_id FROM favorites WHERE user_id = ? AND post_id IN (${ids.map(() => "?").join(",")})`,
      )
      .all(userId, ...ids) as { post_id: string }[];
    favRows.forEach((r) => favorited.add(r.post_id));
  }
  return rows.map((row) => {
    let author = authors.get(row.author_id);
    if (!author) {
      author = getUserById(row.author_id) || {
        id: row.author_id,
        username: "unknown",
        displayName: "已注销",
        bio: "",
        avatar: "?",
        rank: "",
        createdAt: 0,
      };
      authors.set(row.author_id, author);
    }
    return {
      ...mapPost(row, author),
      liked: liked.has(row.id),
      favorited: favorited.has(row.id),
    };
  });
}

export function listPosts(filters: PostFilters = {}, userId?: string | null) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (filters.q) {
    where.push("(title LIKE ? OR summary LIKE ? OR body LIKE ? OR area LIKE ?)");
    const like = `%${filters.q}%`;
    params.push(like, like, like, like);
  }
  if (filters.type) {
    where.push("type = ?");
    params.push(filters.type);
  }
  if (filters.mapId) {
    where.push("map_id = ?");
    params.push(filters.mapId);
  }
  if (filters.agentId) {
    where.push("agent_id = ?");
    params.push(filters.agentId);
  }
  if (filters.side) {
    where.push("side = ?");
    params.push(filters.side);
  }
  if (filters.site) {
    where.push("site = ?");
    params.push(filters.site);
  }
  if (filters.purpose) {
    where.push("purpose = ?");
    params.push(filters.purpose);
  }
  if (filters.difficulty) {
    where.push("difficulty = ?");
    params.push(filters.difficulty);
  }
  if (filters.authorId) {
    where.push("author_id = ?");
    params.push(filters.authorId);
  }
  const order =
    filters.sort === "likes"
      ? "like_count DESC, created_at DESC"
      : filters.sort === "hot"
        ? "(like_count * 3 + favorite_count * 4 + comment_count * 2 + view_count * 0.02) DESC, created_at DESC"
        : "created_at DESC";
  const limit = Math.min(filters.limit ?? 24, 80);
  const offset = filters.offset ?? 0;
  const sql = `SELECT * FROM posts ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY ${order} LIMIT ? OFFSET ?`;
  const rows = db.prepare(sql).all(...params, limit, offset) as PostRow[];
  const total = (
    db
      .prepare(`SELECT COUNT(*) AS c FROM posts ${where.length ? `WHERE ${where.join(" AND ")}` : ""}`)
      .get(...params) as { c: number }
  ).c;
  return { posts: hydratePosts(rows, userId), total };
}

export function getPost(id: string, userId?: string | null) {
  const row = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as PostRow | undefined;
  if (!row) return null;
  return hydratePosts([row], userId)[0];
}

export function incrementView(id: string) {
  db.prepare("UPDATE posts SET view_count = view_count + 1 WHERE id = ?").run(id);
}

export function createPost(input: Omit<PostRecord, "id" | "author" | "viewCount" | "likeCount" | "favoriteCount" | "commentCount" | "shareCount" | "createdAt" | "updatedAt" | "liked" | "favorited"> & { authorId: string }) {
  const id = nid("p_");
  const now = Date.now();
  db.prepare(
    `INSERT INTO posts (
      id, author_id, type, title, summary, body, video_kind, video_url, cover_url,
      map_id, agent_id, ability, side, site, area, purpose, difficulty,
      start_x, start_y, land_x, land_y, steps_json, tags_json,
      view_count, like_count, favorite_count, comment_count, share_count, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, ?, ?)`,
  ).run(
    id,
    input.authorId,
    input.type,
    input.title,
    input.summary,
    input.body,
    input.videoKind,
    input.videoUrl,
    input.coverUrl,
    input.mapId,
    input.agentId,
    input.ability,
    input.side,
    input.site,
    input.area,
    input.purpose,
    input.difficulty,
    input.startX,
    input.startY,
    input.landX,
    input.landY,
    JSON.stringify(input.steps || []),
    JSON.stringify(input.tags || []),
    now,
    now,
  );
  return getPost(id, input.authorId)!;
}

export function toggleLike(userId: string, targetType: "post" | "comment", targetId: string) {
  const existing = db
    .prepare("SELECT 1 FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?")
    .get(userId, targetType, targetId);
  if (existing) {
    db.prepare("DELETE FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?").run(
      userId,
      targetType,
      targetId,
    );
    if (targetType === "post") {
      db.prepare("UPDATE posts SET like_count = MAX(like_count - 1, 0) WHERE id = ?").run(targetId);
    } else {
      db.prepare("UPDATE comments SET like_count = MAX(like_count - 1, 0) WHERE id = ?").run(targetId);
    }
    return { liked: false };
  }
  db.prepare("INSERT INTO likes (user_id, target_type, target_id, created_at) VALUES (?, ?, ?, ?)").run(
    userId,
    targetType,
    targetId,
    Date.now(),
  );
  if (targetType === "post") {
    db.prepare("UPDATE posts SET like_count = like_count + 1 WHERE id = ?").run(targetId);
  } else {
    db.prepare("UPDATE comments SET like_count = like_count + 1 WHERE id = ?").run(targetId);
  }
  return { liked: true };
}

export function toggleFavorite(userId: string, postId: string) {
  const existing = db.prepare("SELECT 1 FROM favorites WHERE user_id = ? AND post_id = ?").get(userId, postId);
  if (existing) {
    db.prepare("DELETE FROM favorites WHERE user_id = ? AND post_id = ?").run(userId, postId);
    db.prepare("UPDATE posts SET favorite_count = MAX(favorite_count - 1, 0) WHERE id = ?").run(postId);
    return { favorited: false };
  }
  db.prepare("INSERT INTO favorites (user_id, post_id, created_at) VALUES (?, ?, ?)").run(
    userId,
    postId,
    Date.now(),
  );
  db.prepare("UPDATE posts SET favorite_count = favorite_count + 1 WHERE id = ?").run(postId);
  return { favorited: true };
}

export function addShare(postId: string, channel: string, userId?: string | null) {
  db.prepare("INSERT INTO shares (id, user_id, post_id, channel, created_at) VALUES (?, ?, ?, ?, ?)").run(
    nid("s_"),
    userId || null,
    postId,
    channel,
    Date.now(),
  );
  db.prepare("UPDATE posts SET share_count = share_count + 1 WHERE id = ?").run(postId);
  return getPost(postId, userId);
}

export function listFavorites(userId: string) {
  const rows = db
    .prepare(
      `SELECT p.* FROM favorites f JOIN posts p ON p.id = f.post_id WHERE f.user_id = ? ORDER BY f.created_at DESC`,
    )
    .all(userId) as PostRow[];
  return hydratePosts(rows, userId);
}

export function listComments(postId: string, userId?: string | null): CommentRecord[] {
  const rows = db
    .prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC")
    .all(postId) as {
    id: string;
    post_id: string;
    author_id: string;
    parent_id: string | null;
    body: string;
    like_count: number;
    created_at: number;
  }[];
  const liked = new Set<string>();
  if (userId && rows.length) {
    const ids = rows.map((r) => r.id);
    const likeRows = db
      .prepare(
        `SELECT target_id FROM likes WHERE user_id = ? AND target_type = 'comment' AND target_id IN (${ids.map(() => "?").join(",")})`,
      )
      .all(userId, ...ids) as { target_id: string }[];
    likeRows.forEach((r) => liked.add(r.target_id));
  }
  const mapped: CommentRecord[] = rows.map((row) => ({
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    parentId: row.parent_id,
    body: row.body,
    likeCount: row.like_count,
    createdAt: row.created_at,
    author: getUserById(row.author_id) || {
      id: row.author_id,
      username: "unknown",
      displayName: "已注销",
      bio: "",
      avatar: "?",
      rank: "",
      createdAt: 0,
    },
    liked: liked.has(row.id),
    replies: [],
  }));
  const roots: CommentRecord[] = [];
  const byId = new Map(mapped.map((c) => [c.id, c]));
  for (const c of mapped) {
    if (c.parentId && byId.has(c.parentId)) byId.get(c.parentId)!.replies.push(c);
    else roots.push(c);
  }
  return roots;
}

export function addComment(input: { postId: string; authorId: string; body: string; parentId?: string | null }) {
  const id = nid("c_");
  db.prepare(
    "INSERT INTO comments (id, post_id, author_id, parent_id, body, like_count, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)",
  ).run(id, input.postId, input.authorId, input.parentId || null, input.body.trim(), Date.now());
  db.prepare("UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?").run(input.postId);
  return listComments(input.postId, input.authorId);
}

export function siteStats() {
  const posts = (db.prepare("SELECT COUNT(*) AS c FROM posts").get() as { c: number }).c;
  const users = (db.prepare("SELECT COUNT(*) AS c FROM users").get() as { c: number }).c;
  const comments = (db.prepare("SELECT COUNT(*) AS c FROM comments").get() as { c: number }).c;
  const videos = (db.prepare("SELECT COUNT(*) AS c FROM posts WHERE type = 'video'").get() as { c: number }).c;
  const guides = (db.prepare("SELECT COUNT(*) AS c FROM posts WHERE type = 'guide'").get() as { c: number }).c;
  return { posts, users, comments, videos, guides, maps: 13, agents: 26 };
}

export function relatedPosts(post: PostRecord, userId?: string | null) {
  const rows = db
    .prepare(
      `SELECT * FROM posts WHERE id != ? AND (map_id = ? OR agent_id = ?) ORDER BY like_count DESC LIMIT 6`,
    )
    .all(post.id, post.mapId, post.agentId) as PostRow[];
  return hydratePosts(rows, userId);
}

function seed() {
  try {
    db.exec("BEGIN IMMEDIATE");
  } catch {
    return;
  }
  const count = (db.prepare("SELECT COUNT(*) AS c FROM users").get() as { c: number }).c;
  if (count > 0) {
    db.exec("ROLLBACK");
    return;
  }

  const pass = hashPassword("demo123");
  const now = Date.now();
  const users = [
    { id: "u_official", username: "shundong", email: "hello@shundong.app", name: "瞬懂官方", avatar: "瞬", rank: "认证作者", bio: "无畏契约点位社区。欢迎投稿视频和图文。" },
    { id: "u_smoke", username: "yanyan", email: "yan@shundong.app", name: "烟位研究员", avatar: "烟", rank: "不朽", bio: "只研究能进排位的烟。" },
    { id: "u_retake", username: "huifang", email: "hf@shundong.app", name: "回防专家", avatar: "回", rank: "超凡", bio: "守不住就回，回得过来才叫会玩。" },
    { id: "u_flash", username: "shan", email: "flash@shundong.app", name: "闪光手阿闪", avatar: "闪", rank: "神话", bio: "闪光不是为了自己爽，是为了队友能出。" },
    { id: "u_coach", username: "coach", email: "coach@shundong.app", name: "新人教练阿木", avatar: "木", rank: "钻石", bio: "把难点位写成笔记，手残也能学会。" },
    { id: "u_demo", username: "demo", email: "demo@shundong.app", name: "体验玩家", avatar: "体", rank: "黄金", bio: "官方体验账号，密码 demo123。" },
  ];
  const insertUser = db.prepare(
    `INSERT INTO users (id, username, email, password_hash, display_name, bio, avatar, rank, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const u of users) {
    insertUser.run(u.id, u.username, u.email, pass, u.name, u.bio, u.avatar, u.rank, now - 86400000 * 20);
  }

  type SeedPost = {
    id: string;
    author: string;
    type: "video" | "guide";
    title: string;
    summary: string;
    body: string;
    map: string;
    agent: string;
    ability: string;
    side: string;
    site: string;
    area: string;
    purpose: string;
    difficulty: string;
    start: [number, number];
    land: [number, number];
    tags: string[];
    steps: GuideStep[];
    views: number;
    likes: number;
    favs: number;
    shares: number;
    daysAgo: number;
  };

  const posts: SeedPost[] = [
    {
      id: "p_ascent_sage",
      author: "u_official",
      type: "video",
      title: "亚海悬城 · 贤者 B 大非常规天空位",
      summary: "从中厅后门贴箱跳投，冰墙卡在 B 大拱门上沿，挡住长枪线又留出出烟缝。",
      body: "这个天空位不走常规中门，适合默认转 B。视频里拆了站位、准星和落地后怎么跟。\n\n注意：墙要贴上沿，太低会被 B 楼直接打穿。",
      map: "ascent",
      agent: "sage",
      ability: "冰墙",
      side: "进攻",
      site: "B",
      area: "B大",
      purpose: "ENTRY",
      difficulty: "困难",
      start: [46, 62],
      land: [72, 28],
      tags: ["天空位", "非常规", "社区投稿"],
      steps: [
        { kind: "stand", title: "站位", body: "中厅靠 B 一侧的木箱后，角色右侧贴箱沿。", tip: "别露出头给中楼" },
        { kind: "aim", title: "准星", body: "瞄准拱门右上角第三块砖的缝，跳投松手。", tip: "跳到最高点再出墙" },
        { kind: "land", title: "落点", body: "冰墙卡在 B 大通道上沿，形成天空位。", tip: "队友从 B 主出" },
      ],
      views: 12840,
      likes: 932,
      favs: 411,
      shares: 186,
      daysAgo: 2,
    },
    {
      id: "p_sunset_fade",
      author: "u_flash",
      type: "video",
      title: "日落之城 · 幽影 A 大照管道眼",
      summary: "开局 A 大门口贴墙扔诡眼，完整照到管道和 A 小交叉。",
      body: "排位里最常用的开局眼之一。扔完立刻回身，不要自己吃飞镰。",
      map: "sunset",
      agent: "fade",
      ability: "诡眼",
      side: "进攻",
      site: "A",
      area: "A大",
      purpose: "INFO",
      difficulty: "简单",
      start: [22, 58],
      land: [38, 34],
      tags: ["开局", "信息眼", "简单"],
      steps: [
        { kind: "stand", title: "站位", body: "A 大出生方向左侧墙角，身体完全不露管道。", tip: "贴墙即可" },
        { kind: "aim", title: "准星", body: "对准管道口上方灯箱左沿，平抛。", tip: "不要跳" },
        { kind: "land", title: "落点", body: "眼在管道上方展开，照 A 小与包点前压。", tip: "听到脚步再决定进不进" },
      ],
      views: 8602,
      likes: 701,
      favs: 288,
      shares: 94,
      daysAgo: 1,
    },
    {
      id: "p_abyss_fade",
      author: "u_retake",
      type: "video",
      title: "幽邃地窟 · A 包进点后防 Rush 眼",
      summary: "下包后从安全点扔回防眼，专克 A 大回防点。",
      body: "无边地图容错很低，这个眼的价值是让你知道回防是从 A 大还是中路。",
      map: "abyss",
      agent: "fade",
      ability: "诡眼",
      side: "防守",
      site: "A",
      area: "A包",
      purpose: "ANTI_RUSH",
      difficulty: "简单",
      start: [68, 40],
      land: [48, 22],
      tags: ["防Rush", "下包后"],
      steps: [
        { kind: "stand", title: "站位", body: "A 包后平台，不要探出虚空边缘。", tip: "先听步" },
        { kind: "aim", title: "准星", body: "朝 A 大门框上沿平抛。", tip: "晚半秒再扔，躲闪光" },
        { kind: "land", title: "落点", body: "眼打在门内顶部，照清 rush 路线。", tip: "配合队友燃烧" },
      ],
      views: 5420,
      likes: 388,
      favs: 201,
      shares: 57,
      daysAgo: 4,
    },
    {
      id: "p_bind_brim",
      author: "u_smoke",
      type: "video",
      title: "裂变峡谷 · 炼狱 A 短默认三烟",
      summary: "出生直接标 A 浴、A 灯、A 通，10 秒内完成默认。",
      body: "别学那些花里胡哨的深点。这三颗烟能让决斗者安心摸短。",
      map: "bind",
      agent: "brimstone",
      ability: "空中烟雾",
      side: "进攻",
      site: "A",
      area: "A短",
      purpose: "DEFAULT",
      difficulty: "简单",
      start: [18, 72],
      land: [34, 36],
      tags: ["默认", "三烟", "排位常用"],
      steps: [
        { kind: "stand", title: "站位", body: "进攻出生门打开地图标点，人不用出门。", tip: "先标再走" },
        { kind: "aim", title: "落点顺序", body: "先浴再灯最后通道，给队友出短的时间。", tip: "烟落地再催决斗" },
        { kind: "land", title: "效果", body: "A 短三线被切断，灯位无法白打。", tip: "留一颗烟给下包后" },
      ],
      views: 21003,
      likes: 1640,
      favs: 890,
      shares: 320,
      daysAgo: 6,
    },
    {
      id: "p_lotus_viper",
      author: "u_smoke",
      type: "video",
      title: "莲华古城 · 蝰蛇 A 门一排烟",
      summary: "转盘开门瞬间甩毒雾，封死 A 主枪线。",
      body: "关键是和转盘的时机对齐。视频用 0.5 倍速标了松手帧。",
      map: "lotus",
      agent: "viper",
      ability: "毒雾",
      side: "进攻",
      site: "A",
      area: "A大",
      purpose: "SMOKE_CONTROL",
      difficulty: "中等",
      start: [28, 55],
      land: [44, 30],
      tags: ["转盘", "门烟"],
      steps: [
        { kind: "stand", title: "站位", body: "A 主转盘左侧柱后。", tip: "让队友转盘" },
        { kind: "aim", title: "准星", body: "门框中上，门缝刚露就松。", tip: "不要等门全开" },
        { kind: "land", title: "落点", body: "烟贴门内侧，挡住树与包点。", tip: "自己从左绕" },
      ],
      views: 9331,
      likes: 722,
      favs: 351,
      shares: 118,
      daysAgo: 3,
    },
    {
      id: "p_split_gekko",
      author: "u_retake",
      type: "video",
      title: "霓虹町 · 盖可回防飞弹清 A 包",
      summary: "从中楼扔眩晕小子，弹到 A 包后墙再弹回。",
      body: "回防不要自己探头。让小家伙先吃枪线。",
      map: "split",
      agent: "gekko",
      ability: "眩晕小子",
      side: "防守",
      site: "A",
      area: "A包点",
      purpose: "RETAKE",
      difficulty: "中等",
      start: [50, 48],
      land: [68, 22],
      tags: ["回防", "清点"],
      steps: [
        { kind: "stand", title: "站位", body: "中楼靠 A 一侧窗下。", tip: "先听绳索" },
        { kind: "aim", title: "准星", body: "对着 A 后墙上沿甩，让它弹回来。", tip: "回收再扔第二次" },
        { kind: "land", title: "落点", body: "小子在包点弹跳，逼出藏点。", tip: "队友同步出绳" },
      ],
      views: 4102,
      likes: 266,
      favs: 140,
      shares: 41,
      daysAgo: 5,
    },
    {
      id: "p_haven_sova",
      author: "u_flash",
      type: "video",
      title: "隐世修所 · 索瓦 A 长双跳箭",
      summary: "出生双跳侦察箭，同时照 A 长与花园。",
      body: "三包图开局最怕瞎。这支箭能告诉你 A 有几个人。",
      map: "haven",
      agent: "sova",
      ability: "侦察箭",
      side: "进攻",
      site: "A",
      area: "A长",
      purpose: "INFO",
      difficulty: "中等",
      start: [20, 70],
      land: [62, 24],
      tags: ["双跳箭", "开局"],
      steps: [
        { kind: "stand", title: "站位", body: "进攻出生右侧箱，对齐地上裂纹。", tip: "每次站同一条缝" },
        { kind: "aim", title: "准星", body: "天空第二根天线左侧，充能一格跳投。", tip: "充太多会飞出图" },
        { kind: "land", title: "落点", body: "箭在 A 长门框弹一次再进花园。", tip: "报人数，不要自己冲" },
      ],
      views: 15770,
      likes: 1102,
      favs: 540,
      shares: 210,
      daysAgo: 8,
    },
    {
      id: "p_icebox_omen",
      author: "u_smoke",
      type: "guide",
      title: "森寒冬港 · 暗影厨房单向烟笔记",
      summary: "一张图讲清厨房单向：站位、准星高度、以及为什么对面看不见你。",
      body: "冰盒的单向烟被说过无数遍，但大多数人高度不对。\n\n原则：烟的下沿卡在窗沿，你蹲着能看见脚，对面站着只能看见雾。",
      map: "icebox",
      agent: "omen",
      ability: "暗影之幕",
      side: "防守",
      site: "B",
      area: "B厨房",
      purpose: "ONE_WAY",
      difficulty: "简单",
      start: [58, 40],
      land: [62, 36],
      tags: ["单向烟", "图文"],
      steps: [
        { kind: "stand", title: "站位", body: "厨房内侧箱后，面朝窗。", tip: "先放再蹲" },
        { kind: "aim", title: "准星高度", body: "准星压在窗框金属条上，不要偏高。", tip: "偏高就变成普通烟" },
        { kind: "land", title: "效果", body: "对面只能看到雾顶，你能看到进厨房的脚。", tip: "打一枪立刻换位" },
        { kind: "note", title: "常见失误", body: "烟放太靠外会被黄直接炸开。", tip: "贴窗内侧" },
      ],
      views: 19021,
      likes: 1503,
      favs: 977,
      shares: 402,
      daysAgo: 9,
    },
    {
      id: "p_ascent_exec",
      author: "u_coach",
      type: "guide",
      title: "亚海悬城进攻执行：中控后转 B 的完整笔记",
      summary: "给五排用的执行清单：谁封中、谁闪 B 主、谁下包。",
      body: "很多人只会单要点位，不会整套执行。这篇按时间轴写。",
      map: "ascent",
      agent: "sova",
      ability: "侦察箭",
      side: "进攻",
      site: "B",
      area: "中路",
      purpose: "ENTRY",
      difficulty: "中等",
      start: [48, 52],
      land: [70, 26],
      tags: ["执行", "五排", "笔记"],
      steps: [
        { kind: "note", title: "0-20 秒", body: "先锋封中门与市场，侦察箭照 B 主。", tip: "中路先不要死人" },
        { kind: "note", title: "20-35 秒", body: "闪光手从 B 主闪树，决斗出 B 大。", tip: "闪要晚半拍" },
        { kind: "note", title: "下包", body: "包下在树后或门后，留一颗烟给市场回防。", tip: "不要下开放包" },
      ],
      views: 7011,
      likes: 512,
      favs: 388,
      shares: 133,
      daysAgo: 7,
    },
    {
      id: "p_sunset_note",
      author: "u_coach",
      type: "guide",
      title: "日落之城防守补位：一个人怎么同时看管道和 A 小",
      summary: "适合单排补位。用听声 + 一个点位眼顶住 A 区。",
      body: "补位最怕两头跑。正确做法是选一个能同时听到两条线的站位。",
      map: "sunset",
      agent: "fade",
      ability: "诡眼",
      side: "防守",
      site: "A",
      area: "A小",
      purpose: "SITE_HOLD",
      difficulty: "简单",
      start: [40, 32],
      land: [28, 38],
      tags: ["补位", "单排"],
      steps: [
        { kind: "stand", title: "站位", body: "A 包前斜坡，能同时听管道金属音和 A 小脚步。", tip: "别站死点" },
        { kind: "aim", title: "预瞄", body: "准星默认 A 小，管道用耳。", tip: "管道声音更脆" },
        { kind: "note", title: "求助时机", body: "听到双线同时压再喊轮转，不要过早弃点。", tip: "丢一个点好过送两个" },
      ],
      views: 6233,
      likes: 441,
      favs: 290,
      shares: 88,
      daysAgo: 3,
    },
    {
      id: "p_lotus_rotate",
      author: "u_retake",
      type: "guide",
      title: "莲华古城轮转路线：转盘什么时候转、什么时候不转",
      summary: "把三包轮转写成判断树，避免整队被假打带走。",
      body: "莲花输在轮转，不在枪法。",
      map: "lotus",
      agent: "universal",
      ability: "站位技巧",
      side: "防守",
      site: "B",
      area: "中路",
      purpose: "DEFAULT",
      difficulty: "中等",
      start: [50, 50],
      land: [50, 28],
      tags: ["轮转", "判断"],
      steps: [
        { kind: "note", title: "只转一人", body: "听到单点脚步或单个技能，只让中路补，转盘先不动。", tip: "假打最爱骗转盘" },
        { kind: "note", title: "双点确认", body: "两个信息源同时报同一侧再转盘。", tip: "眼 + 脚步" },
        { kind: "note", title: "弃点后", body: "弃 A 要留一个人在连通，防止被 raw 回防。", tip: "不要五个人叠 B" },
      ],
      views: 3880,
      likes: 274,
      favs: 196,
      shares: 61,
      daysAgo: 11,
    },
    {
      id: "p_newbie",
      author: "u_coach",
      type: "guide",
      title: "新手如何练点位：不要先背 50 个，先练这 8 个",
      summary: "一份给黄金以下的练习清单，每张常用图只留最值钱的。",
      body: "点位不是越多越强。你会 8 个稳定点，比会 40 个容易丢的更有用。",
      map: "ascent",
      agent: "brimstone",
      ability: "空中烟雾",
      side: "进攻",
      site: "A",
      area: "A门",
      purpose: "DEFAULT",
      difficulty: "简单",
      start: [40, 60],
      land: [58, 30],
      tags: ["新手", "练习"],
      steps: [
        { kind: "note", title: "每天 15 分钟", body: "自定义房只练站位和松手，不打人。", tip: "用训练机器人当参照" },
        { kind: "note", title: "先练默认", body: "每张图先掌握进攻默认烟 / 防守防 rush。", tip: "执行以后再学" },
        { kind: "note", title: "录自己", body: "失败就回看是站位歪了还是准星高了。", tip: "八成是站位" },
      ],
      views: 25410,
      likes: 2108,
      favs: 1320,
      shares: 640,
      daysAgo: 12,
    },
    {
      id: "p_breeze_mid",
      author: "u_smoke",
      type: "video",
      title: "微风岛屿 · 中路门烟 + 一颗燃烧",
      summary: "中门一颗烟切枪线，燃烧逼出中箱。",
      body: "微风赢中路就赢半局。这套 8 秒能打完。",
      map: "breeze",
      agent: "brimstone",
      ability: "空中烟雾",
      side: "进攻",
      site: "MID",
      area: "中路",
      purpose: "SMOKE_CONTROL",
      difficulty: "简单",
      start: [48, 68],
      land: [50, 42],
      tags: ["中路", "控制"],
      steps: [
        { kind: "stand", title: "站位", body: "出生出门正对中门标点。", tip: "烟要封门不要封自己" },
        { kind: "aim", title: "燃烧", body: "烟落地后把燃烧丢中箱右侧。", tip: "逼人出烟" },
        { kind: "land", title: "跟枪", body: "决斗从左绕，你看右。", tip: "别一起探" },
      ],
      views: 4990,
      likes: 301,
      favs: 155,
      shares: 49,
      daysAgo: 2,
    },
    {
      id: "p_pearl_oneway",
      author: "u_official",
      type: "guide",
      title: "珍珠之城 · B 长单向与防拆点位合集",
      summary: "四张分步图：B 长单向、餐厅信息、下包后防拆、回防闪光。",
      body: "珍珠是传统图，点位稳定，适合做成合集收藏。",
      map: "pearl",
      agent: "viper",
      ability: "毒雾",
      side: "防守",
      site: "B",
      area: "B长",
      purpose: "ONE_WAY",
      difficulty: "中等",
      start: [70, 44],
      land: [62, 40],
      tags: ["合集", "防拆"],
      steps: [
        { kind: "stand", title: "B 长单向", body: "门内侧对齐灯，烟卡在门上沿。", tip: "蹲打" },
        { kind: "note", title: "防拆", body: "下包后毒池贴包，自己看餐厅。", tip: "不要自己拆视野" },
        { kind: "note", title: "回防闪", body: "从中路闪 B 主，晚于第一个出的队友 0.3 秒。", tip: "闪给别人用" },
      ],
      views: 8122,
      likes: 640,
      favs: 418,
      shares: 150,
      daysAgo: 10,
    },
    {
      id: "p_corrode_info",
      author: "u_flash",
      type: "video",
      title: "腐蚀之地 · 开局信息：A 大 + 中道一口气看完",
      summary: "新图开局最容易迷路，这支视频只讲两个最稳的信息点。",
      body: "先把信息做对，再谈执行。",
      map: "corrode",
      agent: "sova",
      ability: "侦察箭",
      side: "进攻",
      site: "A",
      area: "A大",
      purpose: "INFO",
      difficulty: "简单",
      start: [26, 64],
      land: [44, 38],
      tags: ["新图", "开局"],
      steps: [
        { kind: "stand", title: "站位", body: "进攻出生左墙第三根管。", tip: "对齐锈迹" },
        { kind: "aim", title: "准星", body: "天空水塔右侧，充能一格。", tip: "低充能更稳" },
        { kind: "land", title: "阅读", body: "先看 A 大人数，再看中道有没有前压。", tip: "报方位不要报“有人”" },
      ],
      views: 2770,
      likes: 198,
      favs: 121,
      shares: 33,
      daysAgo: 1,
    },
    {
      id: "p_summit_retake",
      author: "u_retake",
      type: "guide",
      title: "巅峰山脊回防笔记：花园丢了怎么不莽",
      summary: "回防不是直线冲包。这篇写了两条安全路线和一个闪光时机。",
      body: "新图大家都会莽。想上分就把回防拆成路线。",
      map: "summit",
      agent: "kayo",
      ability: "闪光/碎片",
      side: "防守",
      site: "A",
      area: "A花园",
      purpose: "RETAKE",
      difficulty: "中等",
      start: [36, 58],
      land: [58, 30],
      tags: ["回防", "新图"],
      steps: [
        { kind: "note", title: "路线 A", body: "从中楼绕，先清窗再闪包点。", tip: "适合人多" },
        { kind: "note", title: "路线 B", body: "从花园外侧贴岩壁，用刀禁技能再出。", tip: "适合残局" },
        { kind: "aim", title: "闪光", body: "贴墙弹闪，让闪在包点上方炸。", tip: "自己别看" },
      ],
      views: 1988,
      likes: 154,
      favs: 97,
      shares: 28,
      daysAgo: 0,
    },
  ];

  const insertPost = db.prepare(
    `INSERT INTO posts (
      id, author_id, type, title, summary, body, video_kind, video_url, cover_url,
      map_id, agent_id, ability, side, site, area, purpose, difficulty,
      start_x, start_y, land_x, land_y, steps_json, tags_json,
      view_count, like_count, favorite_count, comment_count, share_count, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'demo', '', '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`,
  );

  for (const p of posts) {
    const created = now - p.daysAgo * 86400000 - 3600000;
    insertPost.run(
      p.id,
      p.author,
      p.type,
      p.title,
      p.summary,
      p.body,
      p.map,
      p.agent,
      p.ability,
      p.side,
      p.site,
      p.area,
      p.purpose,
      p.difficulty,
      p.start[0],
      p.start[1],
      p.land[0],
      p.land[1],
      JSON.stringify(p.steps),
      JSON.stringify(p.tags),
      p.views,
      p.likes,
      p.favs,
      p.shares,
      created,
      created,
    );
  }

  const comments: [string, string, string, string | null, string, number][] = [
    ["c1", "p_bind_brim", "u_demo", null, "这三烟我今晚排位连用五把，终于有人带我出短了。", 2],
    ["c2", "p_bind_brim", "u_coach", "c1", "记住留一颗给下包后，不然容易被回防白打。", 1],
    ["c3", "p_ascent_sage", "u_flash", null, "天空位好用，但是跳投时机要练，建议自定义打 20 次再上分。", 3],
    ["c4", "p_icebox_omen", "u_official", null, "单向高度讲得很清楚，已加到官方周刊。", 8],
    ["c5", "p_newbie", "u_smoke", null, "花活可以以后再学，这篇才是该先看的。", 4],
    ["c6", "p_newbie", "u_demo", "c5", "被点名了，我先去练默认。", 2],
    ["c7", "p_sunset_fade", "u_retake", null, "管道这只眼太稳了，防守开局也能反着用。", 3],
    ["c8", "p_haven_sova", "u_coach", null, "充能一格是关键，我以前老是飞出图。", 5],
    ["c9", "p_lotus_viper", "u_demo", null, "和转盘对时机好难，求一个语音倒计时。", 1],
    ["c10", "p_pearl_oneway", "u_flash", null, "合集收藏了，珍珠终于能守 B。", 2],
  ];
  const insertComment = db.prepare(
    `INSERT INTO comments (id, post_id, author_id, parent_id, body, like_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  const commentCount: Record<string, number> = {};
  comments.forEach((c, i) => {
    insertComment.run(c[0], c[1], c[2], c[3], c[4], 6 + i, now - (20 - i) * 3600000);
    commentCount[c[1]] = (commentCount[c[1]] || 0) + 1;
  });
  for (const [postId, n] of Object.entries(commentCount)) {
    db.prepare("UPDATE posts SET comment_count = ? WHERE id = ?").run(n, postId);
  }

  db.prepare("INSERT INTO favorites (user_id, post_id, created_at) VALUES (?, ?, ?)").run(
    "u_demo",
    "p_newbie",
    now,
  );
  db.prepare("INSERT INTO likes (user_id, target_type, target_id, created_at) VALUES (?, 'post', ?, ?)").run(
    "u_demo",
    "p_bind_brim",
    now,
  );
  db.exec("COMMIT");
}

try {
  seed();
} catch {
  try {
    db.exec("ROLLBACK");
  } catch {
    /* already unlocked */
  }
}
