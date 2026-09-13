/**
 * 主站 packages/shared/src/software-products.ts 里的瞬懂卡片。
 * 与颗秒日事一样：静态包挂在 /products/shundong/，卡片上点「打开网页版」。
 */
export const SHUNDONG_SOFTWARE_PRODUCT = {
  id: "kemiao-shundong",
  name: "瞬懂",
  tagline: "无畏契约点位社区",
  description:
    "上传点位教学视频和图文攻略笔记，支持评论、点赞、收藏和分享。按地图、英雄和用途检索。",
  status: "live" as const,
  href: "/products/shundong/",
  badge: "网页版",
  actions: [{ label: "打开网页版", href: "/products/shundong/", primary: true }],
};
