# 瞬点 SHUNSPOT

无畏契约点位社区：玩家可以上传教学视频和图文攻略笔记，并评论、点赞、收藏、分享。

灵感来自 B 站的社区互动，以及 [瞬投](https://shuntou.top/) 的地图 / 英雄点位检索。

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

独立产品地址（可从软件产品页点开）：[https://yydsxwh.github.io/valorant/](https://yydsxwh.github.io/valorant/)

接到歪歪滴艾斯「软件产品」的改法见 `integrations/andyyyds/`。

体验账号：`demo` / `demo123`

首次启动会自动写入 SQLite（`data/valspot.db`）并生成示例内容。

## 功能

- 首页热门、最新视频 / 图文、地图入口
- 点位库：按地图、英雄、阵营、包点、用途、难度筛选
- 地图页：落点标注 + 列表
- 投稿：本地视频、B 站 / YouTube 链接，或互动演示；图文分步笔记
- 详情：播放器 / 演示、点赞、收藏、分享、评论与回复
- 注册登录、个人主页与收藏夹

本站为玩家社区作品，与拳头游戏 / 无畏契约官方无关联。
