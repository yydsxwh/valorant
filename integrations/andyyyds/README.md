# 把瞬点接到歪歪滴艾斯「软件产品」

当前瞬点先单独上线，不并进主站代码。在 Andyyyds 里加一张可点击的产品卡片即可。

独立地址：<https://yydsxwh.github.io/valorant/>

## 1. 软件产品列表

打开 `packages/shared/src/software-products.ts`，把 `SHUNSPOT_SOFTWARE_PRODUCT`（见同目录 `shunspot-product.ts`）插到 `SOFTWARE_PRODUCTS` 最前面。

## 2. 产品页（可选，卡片也可直接外链）

把 `products-shunspot-page.tsx` 拷到：

`src/app/products/shunspot/page.tsx`

若希望卡片进站内再点「打开瞬点」，把产品 `href` 改成 `/products/shunspot`。

## 3. 侧栏 / 导航（可选）

- `packages/shared/src/site-products.ts` 增加 `{ id: "shunspot", label: "瞬点", href: "/products/shunspot", navKey: "nav.shunspot" }`
- `desktop/shell/index.html` 的「产品」分组加一项 `data-path="/products/shunspot"`
- 各语言包加 `"nav.shunspot": "瞬点"`

体验账号：`demo` / `demo123`
