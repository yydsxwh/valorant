/**
 * 把这段加进 Andyyyds packages/shared/src/software-products.ts 的 SOFTWARE_PRODUCTS 数组最前面。
 * 软件产品页即可出现「瞬点」，点击打开独立产品。
 */
export const SHUNSPOT_SOFTWARE_PRODUCT = {
  id: "shunspot",
  name: "瞬点 SHUNSPOT",
  tagline: "无畏契约点位社区",
  description:
    "玩家上传点位教学视频和图文攻略笔记，支持评论、点赞、收藏和分享。先单独上线，后续再并进主站。",
  status: "live" as const,
  href: "https://yydsxwh.github.io/valorant/",
  badge: "单独上线",
};
