export function formatCount(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}千`;
  return String(n);
}

export function formatTimeAgo(ts: number) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "刚刚";
  if (min < 60) return `${min} 分钟前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} 小时前`;
  const day = Math.floor(hour / 24);
  if (day < 30) return `${day} 天前`;
  const date = new Date(ts);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function initials(name: string) {
  return name.slice(0, 1).toUpperCase();
}
