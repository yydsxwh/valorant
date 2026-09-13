export type Side = "进攻" | "防守";
export type Difficulty = "简单" | "中等" | "困难";
export type PostType = "video" | "guide";

export type MapInfo = {
  id: string;
  name: string;
  nameEn: string;
  sites: string[];
  blurb: string;
  accent: string;
  accentSoft: string;
};

export type AgentInfo = {
  id: string;
  name: string;
  nameEn: string;
  role: "决斗" | "先锋" | "侦察" | "哨卫" | "通用";
  color: string;
  abilities: { id: string; name: string }[];
};

export const MAPS: MapInfo[] = [
  { id: "ascent", name: "亚海悬城", nameEn: "Ascent", sites: ["A", "B", "MID"], blurb: "中路开阔，天空位与门烟决定整局节奏。", accent: "#c9844a", accentSoft: "#2a1c12" },
  { id: "bind", name: "裂变峡谷", nameEn: "Bind", sites: ["A", "B"], blurb: "传送门改写轮转，短点烟位最值钱。", accent: "#d2a36a", accentSoft: "#241910" },
  { id: "haven", name: "隐世修所", nameEn: "Haven", sites: ["A", "B", "C"], blurb: "三包图，默认与补位点位决定能不能守住。", accent: "#c45c4a", accentSoft: "#2a1412" },
  { id: "split", name: "霓虹町", nameEn: "Split", sites: ["A", "B", "MID"], blurb: "垂直空间多，绳索与二楼是教学重点。", accent: "#e14b8a", accentSoft: "#2a1220" },
  { id: "icebox", name: "森寒冬港", nameEn: "Icebox", sites: ["A", "B", "MID"], blurb: "高低差极大，单向烟和垂直闪光很吃香。", accent: "#6cb6d6", accentSoft: "#102028" },
  { id: "breeze", name: "微风岛屿", nameEn: "Breeze", sites: ["A", "B", "MID"], blurb: "超远程对枪，中路控制与门烟是核心。", accent: "#3ec6b5", accentSoft: "#0f2420" },
  { id: "fracture", name: "断裂位面", nameEn: "Fracture", sites: ["A", "B"], blurb: "两侧夹击，拉链与信息技能决定开局。", accent: "#e07a3d", accentSoft: "#27160d" },
  { id: "pearl", name: "珍珠之城", nameEn: "Pearl", sites: ["A", "B", "MID"], blurb: "传统两包，长走廊适合箭与单向。", accent: "#3d8f9e", accentSoft: "#0d1e22" },
  { id: "lotus", name: "莲华古城", nameEn: "Lotus", sites: ["A", "B", "C"], blurb: "转盘与三包轮转，门烟和信息眼最常用。", accent: "#7fbf6b", accentSoft: "#142015" },
  { id: "sunset", name: "日落之城", nameEn: "Sunset", sites: ["A", "B", "MID"], blurb: "管道与中楼是交战焦点，适合补位教学。", accent: "#f08a3a", accentSoft: "#2a180c" },
  { id: "abyss", name: "幽邃地窟", nameEn: "Abyss", sites: ["A", "B", "MID"], blurb: "无边坠落，站位容错低，点位更讲究。", accent: "#8b6cff", accentSoft: "#161226" },
  { id: "corrode", name: "腐蚀之地", nameEn: "Corrode", sites: ["A", "B", "MID"], blurb: "残破工业区，中路与侧道烟位更新快。", accent: "#b8c24a", accentSoft: "#1f2010" },
  { id: "summit", name: "巅峰山脊", nameEn: "Summit", sites: ["A", "B", "MID"], blurb: "新图高低差明显，花园与二楼值得收藏。", accent: "#9ec4e8", accentSoft: "#121820" },
];

export const AGENTS: AgentInfo[] = [
  { id: "jett", name: "捷风", nameEn: "Jett", role: "决斗", color: "#8fd4ff", abilities: [{ id: "updraft", name: "上升气流" }, { id: "dash", name: "疾风步" }, { id: "smoke", name: "烟雾" }] },
  { id: "raze", name: "雷兹", nameEn: "Raze", role: "决斗", color: "#ff9a3c", abilities: [{ id: "nade", name: "爆破弹" }, { id: "bot", name: "爆破机器人" }, { id: "satchel", name: "爆破包" }] },
  { id: "phoenix", name: "不死鸟", nameEn: "Phoenix", role: "决斗", color: "#ff7a3c", abilities: [{ id: "flash", name: "闪光曲线" }, { id: "molly", name: "燃烧墙" }, { id: "wall", name: "火墙" }] },
  { id: "reyna", name: "雷诺", nameEn: "Reyna", role: "决斗", color: "#c46bff", abilities: [{ id: "eye", name: "摄魂眼" }, { id: "dismiss", name: "无视" }] },
  { id: "yoru", name: "夜露", nameEn: "Yoru", role: "决斗", color: "#4f6dff", abilities: [{ id: "flash", name: "盲点" }, { id: "clone", name: "分身" }, { id: "tp", name: "裂隙突进" }] },
  { id: "neon", name: "霓虹", nameEn: "Neon", role: "决斗", color: "#3de0ff", abilities: [{ id: "relay", name: "电墙" }, { id: "stun", name: "继电器" }] },
  { id: "iso", name: "异能者", nameEn: "Iso", role: "决斗", color: "#6b7dff", abilities: [{ id: "wall", name: "能量墙" }, { id: "shield", name: "护盾" }] },
  { id: "brimstone", name: "炼狱", nameEn: "Brimstone", role: "先锋", color: "#ff8a3a", abilities: [{ id: "smoke", name: "空中烟雾" }, { id: "molly", name: "燃烧弹" }, { id: "stim", name: "鼓舞信标" }] },
  { id: "viper", name: "蝰蛇", nameEn: "Viper", role: "先锋", color: "#54d16a", abilities: [{ id: "smoke", name: "毒雾" }, { id: "wall", name: "毒墙" }, { id: "molly", name: "毒池" }] },
  { id: "omen", name: "暗影", nameEn: "Omen", role: "先锋", color: "#7a6bff", abilities: [{ id: "smoke", name: "暗影之幕" }, { id: "flash", name: "偏执" }, { id: "tp", name: "暗影步伐" }] },
  { id: "astra", name: "星璇", nameEn: "Astra", role: "先锋", color: "#b56bff", abilities: [{ id: "smoke", name: "星云" }, { id: "pull", name: "重力井" }, { id: "stun", name: "新星脉冲" }] },
  { id: "harbor", name: "海神", nameEn: "Harbor", role: "先锋", color: "#3dc4c4", abilities: [{ id: "wall", name: "高墙" }, { id: "cove", name: "掩护罩" }, { id: "cascade", name: "浪潮" }] },
  { id: "clove", name: "丁香", nameEn: "Clove", role: "先锋", color: "#e86bd2", abilities: [{ id: "smoke", name: "残局烟" }, { id: "decay", name: "凋零" }] },
  { id: "sova", name: "索瓦", nameEn: "Sova", role: "侦察", color: "#4aa3ff", abilities: [{ id: "recon", name: "侦察箭" }, { id: "shock", name: "震荡箭" }, { id: "drone", name: "猫头鹰无人机" }] },
  { id: "breach", name: "铁臂", nameEn: "Breach", role: "侦察", color: "#ffb24a", abilities: [{ id: "flash", name: "闪点" }, { id: "stun", name: "故障线" }, { id: "aftershock", name: "余震" }] },
  { id: "skye", name: "斯凯", nameEn: "Skye", role: "侦察", color: "#5ad36b", abilities: [{ id: "flash", name: "引路者" }, { id: "seeker", name: "寻路者" }, { id: "heal", name: "再生" }] },
  { id: "kayo", name: "K/O", nameEn: "KAY/O", role: "侦察", color: "#6ea0ff", abilities: [{ id: "knife", name: "抑制刀" }, { id: "flash", name: "闪光/碎片" }, { id: "nade", name: "零点" }] },
  { id: "fade", name: "幽影", nameEn: "Fade", role: "侦察", color: "#c45b5b", abilities: [{ id: "haunt", name: "诡眼" }, { id: "prowler", name: "窥视者" }, { id: "seize", name: "捕获" }] },
  { id: "gekko", name: "盖可", nameEn: "Gekko", role: "侦察", color: "#c8e04a", abilities: [{ id: "flash", name: "眩晕小子" }, { id: "plant", name: "小翼手" }, { id: "molly", name: "莫什坑" }] },
  { id: "sage", name: "贤者", nameEn: "Sage", role: "哨卫", color: "#7ae0d6", abilities: [{ id: "wall", name: "冰墙" }, { id: "slow", name: "减速球" }, { id: "heal", name: "治疗球" }] },
  { id: "cypher", name: "零", nameEn: "Cypher", role: "哨卫", color: "#d6c48a", abilities: [{ id: "cage", name: "神经牢笼" }, { id: "cam", name: "间谍摄像" }, { id: "wire", name: "陷阱线" }] },
  { id: "killjoy", name: "奇乐", nameEn: "Killjoy", role: "哨卫", color: "#f0d24a", abilities: [{ id: "alarm", name: "警报机器人" }, { id: "turret", name: "炮台" }, { id: "molly", name: "纳米群" }] },
  { id: "chamber", name: "尚勃勒", nameEn: "Chamber", role: "哨卫", color: "#e0c36b", abilities: [{ id: "tp", name: "会面" }, { id: "trap", name: "商标" }, { id: "wall", name: "境域" }] },
  { id: "deadlock", name: "铁壁", nameEn: "Deadlock", role: "哨卫", color: "#9aa4b5", abilities: [{ id: "wall", name: "音障" }, { id: "gravnet", name: "引力网" }, { id: "sensor", name: "声波传感器" }] },
  { id: "vyse", name: "薇斯", nameEn: "Vyse", role: "哨卫", color: "#7b8cff", abilities: [{ id: "wall", name: "晶壁" }, { id: "flash", name: "弧光" }, { id: "trap", name: "荆棘" }] },
  { id: "veto", name: "薇托", nameEn: "Veto", role: "哨卫", color: "#c9a36b", abilities: [{ id: "deny", name: "否决" }, { id: "flash", name: "闪光" }] },
  { id: "universal", name: "通用", nameEn: "Universal", role: "通用", color: "#9aa4b2", abilities: [{ id: "wallbang", name: "穿点" }, { id: "tip", name: "站位技巧" }] },
];

export const PURPOSES = [
  { id: "ENTRY", name: "进点执行" },
  { id: "ANTI_RUSH", name: "防Rush" },
  { id: "RETAKE", name: "回防" },
  { id: "SITE_HOLD", name: "守点" },
  { id: "INFO", name: "信息" },
  { id: "ONE_WAY", name: "单向" },
  { id: "POST_PLANT", name: "下包后" },
  { id: "ANTI_DEFUSE", name: "防拆" },
  { id: "DEFAULT", name: "默认" },
  { id: "FLASH_ASSIST", name: "闪光辅助" },
  { id: "SMOKE_CONTROL", name: "烟控" },
  { id: "COMBO", name: "连招" },
] as const;

export const DIFFICULTIES: Difficulty[] = ["简单", "中等", "困难"];
export const SIDES: Side[] = ["进攻", "防守"];

export function getMap(id: string) {
  return MAPS.find((m) => m.id === id);
}

export function getAgent(id: string) {
  return AGENTS.find((a) => a.id === id);
}

export function getPurpose(id: string) {
  return PURPOSES.find((p) => p.id === id);
}

export function parseVideoSource(input: string): {
  kind: "youtube" | "bilibili" | "upload" | "demo";
  url: string;
} {
  const value = input.trim();
  if (!value) return { kind: "demo", url: "" };
  if (value.startsWith("/api/files/") || value.startsWith("/uploads/")) {
    return { kind: "upload", url: value };
  }
  const yt = value.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/,
  );
  if (yt) return { kind: "youtube", url: yt[1] };
  const bv = value.match(/BV[0-9A-Za-z]+/);
  if (bv || /bilibili\.com|player\.bilibili/.test(value)) {
    return { kind: "bilibili", url: bv?.[0] || value };
  }
  if (/^https?:\/\//.test(value)) return { kind: "upload", url: value };
  return { kind: "demo", url: value };
}
