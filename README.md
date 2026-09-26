# 瞬懂 SHUNDONG

无畏契约点位社区：玩家可以上传教学视频和图文攻略笔记，并评论、点赞、收藏、分享。

功能参考常见点位检索（按地图 / 英雄筛选），视觉跟随歪歪滴艾斯「一键装扮」，不套用暗色战术站的红黑切角。

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

产品中心：[https://www.yydsxwh.com/products](https://www.yydsxwh.com/products) → [打开瞬懂](https://www.yydsxwh.com/products/shundong/)

发布到主站（与日事相同，需要 `~/.ssh/yyds_aliyun`）：

```bash
./scripts/deploy-shundong.sh
```

体验账号：`demo` / `demo123`

首次启动会自动写入 SQLite（`data/valspot.db`）并生成示例内容。

## 功能

- 首页热门、最新视频 / 图文、地图入口
- 点位库：按地图、英雄、阵营、包点、用途、难度筛选
- 地图页：落点标注 + 列表
- 投稿：本地视频、B 站 / YouTube 链接，或互动演示；图文分步笔记
- 详情：播放器 / 演示、点赞、收藏、分享、评论与回复
- 注册登录、个人主页与收藏夹

打开产品中心页时会读取主站当前装扮（`/api/public/theme`，失败则解析首页 CSS 变量），把 `--brand`、`--fire`、`--site-bg-layers` 等写到页面上。

本站为玩家社区作品，与拳头游戏 / 无畏契约官方无关联。
