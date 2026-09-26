# 瞬懂挂到主站产品中心

和颗秒日事同一条路：独立仓库出静态包，SSH 发到主站 `public/products/shundong/`，再改服务器上的 `software-products.ts`。

```bash
./scripts/deploy-shundong.sh
```

- 产品中心：https://www.yydsxwh.com/products
- 打开产品：https://www.yydsxwh.com/products/shundong/
- 装扮：页面启动后读取主站 `/api/public/theme`，套用当前一键装扮的 CSS 变量
