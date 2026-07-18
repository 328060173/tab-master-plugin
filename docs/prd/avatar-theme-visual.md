# 头像框 + 主题背景 · 视觉与交互设计

> Status: Draft · Author: plugs-pm · Date: 2026-07-17 · Feature slug: `avatar-theme-visual`
> 范围：装扮商城精简版的**视觉位置、效果、切换操作、图片资源清单**。不重复盈利/积分/邀请方案（见 `avatar-theme-shop.md`），不设计表结构、不写代码。
> 目标读者：plugs-fe（做静态效果页）、用户（照资源清单生成图片）。

---

## 0. TL;DR（一句话结论）

- **头像本体**：邮箱 MD5 hash → 预设调色板取色 → canvas 绘制首字母（**不外链 Gravatar**，守带宽红线）。本期不做头像本体商品。
- **头像框位置**：只在**两个登录态位置**套框——options.vue 邮箱行（40px 头像 + 56px 总外延）、HeaderMenu 主菜单邮箱行（20px 头像 + 28px 总外延）。sidepanel 顶栏不放（空间太窄，进入下拉菜单才看得到）。
- **头像框清单**：8 款（铜/翠竹/银/樱粉/星辰/金/百日签到 + 彩虹流光 CSS），与主题完全解耦，用户自由混搭。详见 §1.5。
- **主题覆盖**：sidepanel（必跟）+ options（必跟）+ 商城页（自举必跟）。官网 /my 跨线后置。
- **13 套主题**：季节 4（春樱初绽/盛夏清荷/金秋满陇/暖冬初雪）+ 风景 6（星河璀璨/碧海潮生/原野牧风/护眼墨绿/极简纯白/晴川芳洲）+ 风格 3（机甲战纪/暗夜深渊/软萌奶霜）。详见 §2.3。
- **5 个 CSS 变量**全部带 fallback，未启用主题 = 取 fallback = 现状零回归。
- **切换逻辑**：点「启用」→ CSS 变量实时写入 `:root.style` → 200ms 内可见变化 + toast「已启用：星河璀璨」。无需刷新。
- **图片资源**：7 张头像框透明 PNG（144×144）+ 10 张主题背景图 WebP（1920×1080）= **17 张核心产出**，单图 ≤45KB，总 ≤765KB。3 套主题（护眼墨绿/极简纯白/暗夜深渊）+ 1 框（彩虹流光）纯 CSS 无需图。可选 20 张商品预览图建议 FE 截图自生成。

---

## 1. 头像框的位置与生成

### 1.1 头像本体生成（确认 PRD v2 决策点 9）

**采用方案**：MD5(email.toLowerCase().trim()) → 取 hash 前 8 位映射到 10 色调色板 → canvas 绘制首字母（大写英文字母）。

**为什么不外链 Gravatar**：
- 守带宽红线（资源带宽红线禁止外链图片 CDN，且 Gravatar 在国内不可达）。
- 守隐私红线（邮箱 MD5 上送第三方服务暴露用户行为）。
- 本地 canvas 生成零网络成本，首屏即渲染无闪烁。

**调色板**（10 色，覆盖性别/情感中性）：
`#3b82f6`(蓝) / `#10b981`(绿) / `#f59e0b`(琥珀) / `#ef4444`(红) / `#8b5cf6`(紫) / `#ec4899`(粉) / `#14b8a6`(青) / `#f97316`(橙) / `#64748b`(灰) / `#0ea5e9`(天蓝)

**生成规则**：
- 字母取 email @ 前首字符的大写；非英文字符（中文/数字开头）取邮箱首字符的 Unicode 编码取模 26 映射到 A-Z。
- 字体：系统字体栈（`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`），白色 600 字重居中。
- 圆形头像，背景填调色板色，无边框（头像框套在外面）。

**头像本体尺寸规格**（三档）：

| 用途 | 头像本体直径 | 字号 | 用在哪 |
|---|---|---|---|
| options 邮箱行 | 40px | 18px | options.vue 已登录邮箱行左侧 |
| HeaderMenu 邮箱项 | 20px | 10px | HeaderMenu 主菜单已登录邮箱行（line 40-52 的 User 图标位置替换为头像） |
| 商城商品卡预览 | 56px | 24px | 头像框商品卡内的示例头像（展示框套上去的效果） |

> sidepanel 顶栏（HeaderMenu 触发按钮那行）**不放头像框**——侧边栏宽 300-400px，标题+标签数+聚焦按钮+HeaderMenu 已占满，再塞头像会让头部拥挤。用户要看头像进 HeaderMenu 下拉即可。

### 1.2 头像框尺寸规格（含装饰外延）

头像框是**透明 PNG 环**，外圈装饰比头像本体大一定外延，套在头像外圈。三档规格：

| 档位 | 头像本体 | 框外延（每侧） | 框总尺寸（PNG 画布） | 用途 |
|---|---|---|---|---|
| 小 | 20px | 2px | 24×24px | HeaderMenu 主菜单邮箱行 |
| 中 | 40px | 4px | 48×48px | options 邮箱行 |
| 大 | 56px | 6px | 68×68px | 商城商品卡预览 |

**实现方式**：FE 用一张高分辨率源 PNG（144×144，3x 中档），通过 CSS `background-size` 缩放复用到三档；或三档独立 PNG（更清晰但体积大）。**推荐单张 144×144 源图 + CSS 缩放**（守带宽红线，1 张图复用三档）。

**头像框层级**：头像框 PNG 在 z 轴上**盖在头像本体之上**（`position: absolute; inset: 0; pointer-events: none;`），让装饰外延伸出到头像圆形之外。

### 1.3 头像框放置位置（逐个确认）

#### 位置 A：options.vue 邮箱行（必做）

现状（options.vue line 37-40）：
```
邮箱        [邮箱字符串]
```
改造后：
```
┌────┐
│头  │  邮箱    [邮箱字符串]
│框  │
└────┘
```
- 头像+框组件 48×48px（中档），左侧 padding-left 0
- 「邮箱」label 移到头像右侧、邮箱字符串上方，或保持行级 label（二选一，推荐行级 label 不动，头像替换 label 左侧的空白）
- 布局：`flex items-center gap-3` → [头像+框 48px] [邮箱 label + 字符串 flex-1]

**未登录态**：邮箱行整块不渲染（被「登录账号」卡片替代），**不显空头像框**。

#### 位置 B：HeaderMenu 主菜单邮箱项（必做）

现状（HeaderMenu.vue line 40-52）：`<User :size="13" />` + 邮箱字符串 + VIP 王冠。
改造后：User 图标替换为 24×24px 头像+框（小档）。

```
┌──┐
│头│ user@example.com  👑
└──┘
```
- 头像+框 24×24px 替换原 User 图标位
- 邮箱字符串 truncate `max-w-[140px]`（原 150px 让 10px 给头像）
- VIP 王冠保持在邮箱后

#### 位置 C：sidepanel 顶栏（不做）

理由见 §0——空间太窄，已占满。用户进 HeaderMenu 下拉即可看到头像+框。

#### 位置 D：商城商品卡（必做）

头像框商品卡的预览图就是「示例头像 + 框」组合渲染的图，展示框套上去的最终效果（见 §5）。

#### 位置 E：官网 /my（跨线，本期不做）

后置到 web-pm 出 /my PRD。本期插件内做完即可。

### 1.4 未登录态显不显头像框

**不显**。所有头像+框组件只在 `isLoggedIn === true` 时渲染。未登录态：
- options.vue：显「登录账号」卡片（现状不变）
- HeaderMenu：显「登录/注册」菜单项（现状不变，无头像位）

### 1.5 头像框商品清单（独立不绑主题）

**核心原则**：头像框与主题**完全解耦**——用户可任意混搭（如「机甲战纪主题 + 樱粉丝带框」）。两类商品各自单选启用，互不影响。

本期 **8 款头像框**（7 张 PNG + 1 个 CSS 动画）：

| # | 成品名 | skuId | 类型 | 定价 | 需图？ | 视觉描述（一句话） |
|---|---|---|---|---|---|---|
| 1 | 铜质光环 | `frame-bronze-100` | PNG 透明环 | 50（引流款） | ✅ | 铜色金属渐变圆环，环宽 8px，简约无装饰，入门款 |
| 2 | 翠竹青 | `frame-bamboo-green` | PNG 透明环 | 100（普通款） | ✅ | 竹青色（#65a30d→#15803d 渐变）圆环，环宽 9px，环上 4 片小竹叶点缀，清新 |
| 3 | 银浪纹 | `frame-silver-wave` | PNG 透明环 | 150（走量款） | ✅ | 银色渐变圆环，环宽 10px，环上波浪纹理深浅交替，外圈微光 |
| 4 | 樱粉丝带 | `frame-sakura-ribbon` | PNG 透明环 | 150（走量款） | ✅ | 粉色（#f9a8d4→#ec4899 渐变）圆环，环宽 10px，顶部斜绑一根丝带蝴蝶结，可爱 |
| 5 | 星辰银 | `frame-starry-silver` | PNG 透明环 | 250（精品款） | ✅ | 深紫银（#94a3b8→#4c1d95 渐变）圆环，环宽 11px，环上镶 6 颗小星点（白色发光），神秘 |
| 6 | 金桂冠 | `frame-gold-laurel` | PNG 透明环 | 300（精品款） | ✅ | 金色（#fbbf24→#f59e0b 渐变）金属圆环，环宽 12px，顶部月桂枝叶装饰左右各一枝，稍华丽 |
| 7 | 彩虹流光 | `frame-rainbow-anim` | CSS conic-gradient 动画 | 300（精品款） | ❌ CSS | 彩虹色 conic-gradient 旋转动画框，无需图，无固定装饰 |
| 8 | 百日签到专属 | `frame-sign-100d` | PNG 透明环 | 0（成就款，累计签到 100 天解锁，不可购买） | ✅ | 深金带光泽圆环，环宽 12px，环上镶 12 颗小星点，顶部一颗大星，底部「100」字样，仪式感 |

**定价档位说明**：
- 50/100：引流+普通款，让低积分用户也能消费，培养商城习惯
- 150：走量款，主力消费档
- 250/300：精品款，高积分用户彰显身份
- 0 成就款：只能通过累计签到 100 天解锁，不可花钱买，强化签到留存（数据一致性：以 `checkin_cumulative` 字段为准，前端不本地猜算）

**头像框 PNG 通用规格**（详见 §5.1）：
- 源图 144×144 PNG 透明背景，单图复用三档（24/48/68px）通过 CSS `background-size` 缩放
- 中心透明圆直径 86px（头像本体 56px + 4px 间隙 + 框内边）
- 环宽 8-12px 视款式
- ≤45KB/张

**彩虹流光框**（CSS 动画实现，无需图，§5.1 末尾给 CSS 代码）。

---

## 2. 主题背景的覆盖范围与效果

### 2.1 覆盖页面

| 页面 | 是否跟主题 | 理由 |
|---|---|---|
| sidepanel（主界面） | ✅ 必跟 | 用户最高频看到的页面，主题感知最强 |
| options（设置页） | ✅ 必跟 | 个人中心+装扮入口所在地，统一体验 |
| 商城页 tabs/shop.html | ✅ 必跟（自举） | 商城本身消费 `--tm-skin-primary`，让用户在商城里预览主题色 |
| 官网 /my | ⏸ 后置 | 跨线，web-pm 出 PRD |
| popup（如有） | ❌ 不跟 | popup 是浏览器动作弹窗，与 sidepanel 重复，不跟 |

### 2.2 5 个 CSS 变量各自作用的具体 UI 元素

| CSS 变量 | 默认值（fallback） | 消费的 UI 元素（具体到组件/类） |
|---|---|---|
| `--tm-skin-primary` | `#2563eb`（Tailwind blue-600） | ① options.vue 主按钮（登录/立即签到/立即同步/更多）`bg-blue-600` 系列<br>② 商城页主按钮（积分兑换）<br>③ sidepanel 当前选中标签卡的边框/选中态<br>④ HeaderMenu 子菜单选中项的 ✓ 颜色<br>⑤ options 积分数字颜色<br>⑥ NavTabs 当前激活 tab 的下划线 |
| `--tm-skin-accent-bg` | `transparent` | ① sidepanel header 背景 `::after` 半透明叠加（不替换底色，叠一层主题色调）<br>② options header 背景 `::after` 同上<br>③ 商城页顶部 banner 背景 |
| `--tm-skin-page-bg-image` | `none` | body `::before` 伪元素背景图，铺满整页，透明度由 `--tm-skin-bg-opacity` 控制（见 §2.4），z-index 在内容之下 |
| `--tm-skin-card-radius` | `0.5rem` | ① TabTileItem 标签卡 `rounded-lg`<br>② options 卡片 `rounded-lg`<br>③ 商城商品卡 `rounded-lg`<br>④ PinnedBar 固定标签卡<br>⑤ LoginDialog / ConfirmDialog 弹窗 |
| `--tm-skin-card-border` | `1px solid rgba(229,231,235,1)` | 同上所有卡片的 `border` 类替换为 `var(--tm-skin-card-border, ...)` |

**适配原则**：FE 用 grep 找出上述硬编码 `bg-blue-600` / `rounded-lg` / `border-gray-200` 的位置，改为 `var(--tm-skin-xxx, <原值>)`。**每处都带 fallback**——变量未写入时取原值，与现状像素级一致（零回归红线）。

### 2.3 13 套预设主题总表

13 套主题分三个系列：**季节系列 4 套**（春夏秋冬）+ **风景系列 6 套**（星空/海浪/草原/护眼/纯色/晴川）+ **风格系列 3 套**（机甲/暗黑/可爱）。每套定 5 个 CSS 变量值 + 视觉感受 + 是否需背景图 + 定价。

**定价档位**：引流款 100 / 走量款 150 / 精品款 250 / 高价款 500。本期 13 套均积分可购买，成就款主题（如"周年荣耀"）留 Non-Goal 下期再做（成就款目前只在头像框里设 1 个，见 §1.5）。

**总表**：

| # | 成品名 | 系列 | primary | accentBg（叠加渐变） | pageBgImage | cardRadius | cardBorder | 需图？ | 定价 | 视觉感受 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 春樱初绽 | 季节·春 | `#ec4899` | `linear-gradient(135deg, rgba(252,231,243,0.5) 0%, rgba(251,207,232,0.3) 100%)` | `url('https://cdn.ouu365.com/skin/bg-sakura-spring.webp')` | `0.75rem` | `1px solid rgba(236,72,153,0.2)` | ✅ 樱花 | 100 | 粉色主色 + 樱花飘落背景隐约 + 大圆角，温柔浪漫，引流款拉新 |
| 2 | 盛夏清荷 | 季节·夏 | `#059669` | `linear-gradient(135deg, rgba(209,250,229,0.4) 0%, rgba(165,243,252,0.2) 100%)` | `url('https://cdn.ouu365.com/skin/bg-lotus-summer.webp')` | `0.625rem` | `1px solid rgba(5,150,105,0.2)` | ✅ 荷塘 | 150 | 荷绿主色 + 荷塘涟漪背景隐约 + 中圆角，清凉沉静 |
| 3 | 金秋满陇 | 季节·秋 | `#d97706` | `linear-gradient(135deg, rgba(254,215,170,0.4) 0%, rgba(253,230,138,0.2) 100%)` | `url('https://cdn.ouu365.com/skin/bg-autumn-maple.webp')` | `0.5rem` | `1px solid rgba(217,119,6,0.25)` | ✅ 枫叶稻田 | 250 | 琥珀金主色 + 枫叶飘金背景隐约 + 标准圆角，丰收厚重 |
| 4 | 暖冬初雪 | 季节·冬 | `#6366f1` | `linear-gradient(135deg, rgba(224,231,255,0.5) 0%, rgba(199,210,254,0.3) 100%)` | `url('https://cdn.ouu365.com/skin/bg-winter-snow.webp')` | `0.625rem` | `1px solid rgba(99,102,241,0.2)` | ✅ 雪景 | 250 | 雪青紫主色 + 雪花飘落背景隐约 + 中圆角，安静温暖 |
| 5 | 星河璀璨 | 风景·星空 | `#6d28d9` | `linear-gradient(135deg, rgba(237,233,254,0.4) 0%, rgba(196,181,253,0.2) 100%)` | `url('https://cdn.ouu365.com/skin/bg-starry-night.webp')` | `0.5rem` | `1px solid rgba(109,40,217,0.3)` | ✅ 星空 | 500 | 深紫主色 + 银河星点背景隐约 + 标准圆角，深邃神秘，最高价 |
| 6 | 碧海潮生 | 风景·海浪 | `#0284c7` | `linear-gradient(135deg, rgba(207,250,254,0.4) 0%, rgba(186,230,253,0.2) 100%)` | `url('https://cdn.ouu365.com/skin/bg-ocean-waves.webp')` | `0.625rem` | `1px solid rgba(2,132,199,0.2)` | ✅ 海浪 | 150 | 海蓝主色 + 海浪波纹背景隐约 + 中圆角，开阔清爽 |
| 7 | 原野牧风 | 风景·草原 | `#65a30d` | `linear-gradient(135deg, rgba(247,254,231,0.4) 0%, rgba(217,249,157,0.2) 100%)` | `url('https://cdn.ouu365.com/skin/bg-grassland.webp')` | `0.625rem` | `1px solid rgba(101,163,13,0.2)` | ✅ 草原 | 150 | 草绿主色 + 草原远山背景隐约 + 中圆角，辽阔自由 |
| 8 | 护眼墨绿 | 风景·护眼 | `#10b981` | `linear-gradient(135deg, rgba(209,250,229,0.5) 0%, rgba(167,243,208,0.3) 100%)` | `none` | `0.625rem` | `1px solid rgba(16,185,129,0.2)` | ❌ 纯 CSS | 100 | 翠绿主色 + 浅绿 header 叠加 + 中圆角，纯色护眼无背景图，效率工具用户首选 |
| 9 | 极简纯白 | 风景·纯色 | `#4b5563` | `transparent` | `none` | `0.5rem` | `1px solid rgba(229,231,235,1)` | ❌ 纯 CSS | 100 | 中性灰主色 + 无叠加 + 标准圆角，极简最接近默认，引流款 |
| 10 | 晴川芳洲 | 风景·晴川 | `#0ea5e9` | `linear-gradient(135deg, rgba(224,242,254,0.5) 0%, rgba(186,230,253,0.3) 100%)` | `url('https://cdn.ouu365.com/skin/bg-river-mountain.webp')` | `0.625rem` | `1px solid rgba(14,165,233,0.2)` | ✅ 山川江畔 | 250 | 天蓝主色 + 晴朗山川江畔背景隐约 + 中圆角，明朗开阔 |
| 11 | 机甲战纪 | 风格·机甲 | `#14b8a6` | `linear-gradient(135deg, rgba(204,251,241,0.3) 0%, rgba(45,212,191,0.15) 100%)` | `url('https://cdn.ouu365.com/skin/bg-mecha-tech.webp')` | `0.25rem` | `1px solid rgba(20,184,166,0.3)` | ✅ 科技纹理 | 500 | 科技青主色 + 机甲纹理背景隐约 + 小圆角方正，硬朗科技感，最高价 |
| 12 | 暗夜深渊 | 风格·暗黑 | `#1f2937` | `linear-gradient(135deg, rgba(31,41,55,0.15) 0%, rgba(17,24,39,0.1) 100%)` | `none` | `0.5rem` | `1px solid rgba(75,85,99,0.4)` | ❌ 纯 CSS | 150 | 深灰主色 + 深色 header 叠加 + 标准圆角，暗黑模式强化（比默认 dark 更深一档） |
| 13 | 软萌奶霜 | 风格·可爱 | `#f472b6` | `linear-gradient(135deg, rgba(253,242,248,0.5) 0%, rgba(252,231,243,0.3) 100%)` | `url('https://cdn.ouu365.com/skin/bg-cute-clouds.webp')` | `1rem` | `1px solid rgba(244,114,182,0.25)` | ✅ 奶霜云朵 | 150 | 粉嫩主色 + 奶霜云朵小星星背景隐约 + 大圆角，软萌治愈 |

**逐套 JSON config（FE 写死在代码里，对应 MOCK_SKINS.themes[].config）**：

```jsonc
// 1. 春樱初绽
{ "primary":"#ec4899", "accentBg":"linear-gradient(135deg, rgba(252,231,243,0.5) 0%, rgba(251,207,232,0.3) 100%)", "pageBgImage":"url('https://cdn.ouu365.com/skin/bg-sakura-spring.webp')", "cardRadius":"0.75rem", "cardBorder":"1px solid rgba(236,72,153,0.2)" }
// 2. 盛夏清荷
{ "primary":"#059669", "accentBg":"linear-gradient(135deg, rgba(209,250,229,0.4) 0%, rgba(165,243,252,0.2) 100%)", "pageBgImage":"url('https://cdn.ouu365.com/skin/bg-lotus-summer.webp')", "cardRadius":"0.625rem", "cardBorder":"1px solid rgba(5,150,105,0.2)" }
// 3. 金秋满陇
{ "primary":"#d97706", "accentBg":"linear-gradient(135deg, rgba(254,215,170,0.4) 0%, rgba(253,230,138,0.2) 100%)", "pageBgImage":"url('https://cdn.ouu365.com/skin/bg-autumn-maple.webp')", "cardRadius":"0.5rem", "cardBorder":"1px solid rgba(217,119,6,0.25)" }
// 4. 暖冬初雪
{ "primary":"#6366f1", "accentBg":"linear-gradient(135deg, rgba(224,231,255,0.5) 0%, rgba(199,210,254,0.3) 100%)", "pageBgImage":"url('https://cdn.ouu365.com/skin/bg-winter-snow.webp')", "cardRadius":"0.625rem", "cardBorder":"1px solid rgba(99,102,241,0.2)" }
// 5. 星河璀璨
{ "primary":"#6d28d9", "accentBg":"linear-gradient(135deg, rgba(237,233,254,0.4) 0%, rgba(196,181,253,0.2) 100%)", "pageBgImage":"url('https://cdn.ouu365.com/skin/bg-starry-night.webp')", "cardRadius":"0.5rem", "cardBorder":"1px solid rgba(109,40,217,0.3)" }
// 6. 碧海潮生
{ "primary":"#0284c7", "accentBg":"linear-gradient(135deg, rgba(207,250,254,0.4) 0%, rgba(186,230,253,0.2) 100%)", "pageBgImage":"url('https://cdn.ouu365.com/skin/bg-ocean-waves.webp')", "cardRadius":"0.625rem", "cardBorder":"1px solid rgba(2,132,199,0.2)" }
// 7. 原野牧风
{ "primary":"#65a30d", "accentBg":"linear-gradient(135deg, rgba(247,254,231,0.4) 0%, rgba(217,249,157,0.2) 100%)", "pageBgImage":"url('https://cdn.ouu365.com/skin/bg-grassland.webp')", "cardRadius":"0.625rem", "cardBorder":"1px solid rgba(101,163,13,0.2)" }
// 8. 护眼墨绿
{ "primary":"#10b981", "accentBg":"linear-gradient(135deg, rgba(209,250,229,0.5) 0%, rgba(167,243,208,0.3) 100%)", "pageBgImage":"none", "cardRadius":"0.625rem", "cardBorder":"1px solid rgba(16,185,129,0.2)" }
// 9. 极简纯白
{ "primary":"#4b5563", "accentBg":"transparent", "pageBgImage":"none", "cardRadius":"0.5rem", "cardBorder":"1px solid rgba(229,231,235,1)" }
// 10. 晴川芳洲
{ "primary":"#0ea5e9", "accentBg":"linear-gradient(135deg, rgba(224,242,254,0.5) 0%, rgba(186,230,253,0.3) 100%)", "pageBgImage":"url('https://cdn.ouu365.com/skin/bg-river-mountain.webp')", "cardRadius":"0.625rem", "cardBorder":"1px solid rgba(14,165,233,0.2)" }
// 11. 机甲战纪
{ "primary":"#14b8a6", "accentBg":"linear-gradient(135deg, rgba(204,251,241,0.3) 0%, rgba(45,212,191,0.15) 100%)", "pageBgImage":"url('https://cdn.ouu365.com/skin/bg-mecha-tech.webp')", "cardRadius":"0.25rem", "cardBorder":"1px solid rgba(20,184,166,0.3)" }
// 12. 暗夜深渊
{ "primary":"#1f2937", "accentBg":"linear-gradient(135deg, rgba(31,41,55,0.15) 0%, rgba(17,24,39,0.1) 100%)", "pageBgImage":"none", "cardRadius":"0.5rem", "cardBorder":"1px solid rgba(75,85,99,0.4)" }
// 13. 软萌奶霜
{ "primary":"#f472b6", "accentBg":"linear-gradient(135deg, rgba(253,242,248,0.5) 0%, rgba(252,231,243,0.3) 100%)", "pageBgImage":"url('https://cdn.ouu365.com/skin/bg-cute-clouds.webp')", "cardRadius":"1rem", "cardBorder":"1px solid rgba(244,114,182,0.25)" }
```

**需图 vs 纯 CSS 分布**：
- 需背景图（10 套）：春樱初绽 / 盛夏清荷 / 金秋满陇 / 暖冬初雪 / 星河璀璨 / 碧海潮生 / 原野牧风 / 晴川芳洲 / 机甲战纪 / 软萌奶霜
- 纯 CSS 无背景图（3 套）：护眼墨绿 / 极简纯白 / 暗夜深渊

**深色模式适配**：每套主题与深色模式叠加生效（不互斥）。深色模式下 `--tm-skin-primary` 由 FE 用 `dark:` 变体自动调亮一档（如 `#ec4899` → `#f472b6`），`--tm-skin-card-border` 透明度自动调整，`--tm-skin-bg-opacity` 从 0.06 降到 0.04。机甲战纪/暗夜深渊在深色模式下视觉反差最小，需 FE 重点测对比度。

### 2.4 背景图的视觉处理（透明度/平铺/可读性）

`--tm-skin-page-bg-image` 走 body `::before` 伪元素，规则：

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: var(--tm-skin-page-bg-image, none);
  background-size: cover;       /* 整页覆盖，不重复平铺 */
  background-position: center;
  background-repeat: no-repeat;
  opacity: var(--tm-skin-bg-opacity, 0);   /* 默认 0=不显 */
  pointer-events: none;
  z-index: -1;
}
```

**透明度规则**（确保标签内容可读，不喧宾夺主）：

| 模式 | `--tm-skin-bg-opacity` |
|---|---|
| 浅色模式 + 启用带背景图主题 | `0.06` |
| 深色模式 + 启用带背景图主题 | `0.04` |
| 未启用主题 / 主题无背景图 | `0`（不渲染） |

**为什么这么低**：
- sidepanel 是高频工作区，标签标题/favicon/状态文字必须清晰可读。
- 0.06 透明度下背景图只是"隐隐约约的氛围"，不抢内容焦点。
- 用户若觉得太淡，下期可加「背景强度」滑块（Non-Goal 本期不做）。

**平铺方式**：`background-size: cover`（整页覆盖，不重复）。背景图源图按 1920×1080 设计，cover 模式下任意尺寸都填充。

### 2.5 CSS 动画背景模式（下期预留，本期 13 套均不使用）

> 本期 13 套主题中**无 CSS 动画背景主题**（原极光流彩方案下期作为「成就款动画主题」复刻）。彩虹流光头像框仍用 CSS conic-gradient 动画（见 §5.1.8）。以下 CSS 动画背景模式作为**下期预留 pattern** 保留，FE 本期不实现：

```css
/* 下期预留：仅当主题 = 动画背景类时启用，body::before 改为渐变动画 */
body::before {
  background: linear-gradient(135deg, #c4b5fd, #f0abfc, #93c5fd, #6ee7b7, #c4b5fd);
  background-size: 400% 400%;
  animation: tm-aurora 20s ease infinite;
  opacity: 0.08;  /* 动画背景透明度略高，因色彩淡 */
}
@keyframes tm-aurora {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

**动画节制**：20s 一周期，缓慢流动，不抢注意力。深色模式下透明度降到 0.05。

### 2.6 深色模式适配

主题与深色模式**叠加生效，不互斥**：
- 用户在 HeaderMenu 选「深色」模式 + 启用「春樱初绽」主题 → 深色底 + 粉色主色 + 樱花背景图（透明度 0.04）
- `--tm-skin-primary` 在深色模式下 FE 用 `dark:` 变体或 CSS media query 自动调亮一档（如粉色 `#ec4899` → 深色用 `#f472b6`），保证对比度
- `--tm-skin-card-border` 在深色模式下颜色透明度自动调整（FE 用 `dark:` 覆盖）
- **暗夜深渊**主题在深色模式下视觉反差最小，需 FE 重点测对比度（已记入验收清单）

---

## 3. 切换操作逻辑

### 3.1 入口位置

**两个入口**（都只在已登录态显示）：

1. **options.vue 已登录态**：在「账号/同步」section 内、邮箱行下方加一行「我的装扮」入口
   ```
   邮箱        [头像+框] [邮箱字符串]
   积分        [320]  [商城] [邀请好友] [充值(灰)]
   签到        [今日未签到] [立即签到]
   我的装扮    [当前：春樱初绽主题 · 铜质光环] [更换 ▾]   ← 新增
   更多 / 退出登录
   ```

2. **商城页 tabs/shop.html 顶部**：「我的装扮」按钮（已在盈利 PRD §7.1 设计）

**未登录态**：不显示「我的装扮」行（被「登录账号」卡片替代）。

### 3.2 「我的装扮」弹层结构

```
┌──────────────────────────────────────────┐
│ 我的装扮                             [✕] │
├──────────────────────────────────────────┤
│                                          │
│ 当前头像框（8 款，横向滚动）             │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│ │ 无 │ │ 铜 │ │ 翠 │ │ 银 │ │ 樱 │ ...  │
│ │ ○  │ │ ●  │ │ ○  │ │ ○  │ │ ○  │      │
│ └────┘ └────┘ └────┘ └────┘ └────┘      │
│ （单选，● = 当前启用，○ = 已拥有未启用） │
│                                          │
│ 当前插件主题（13 款，分系列横向滚动）    │
│ 季节系列：                               │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐             │
│ │ 默 │ │ 春 │ │ 夏 │ │ 秋 │ │ 冬 │      │
│ │ 认 │ │ 樱 │ │ 荷 │ │ 陇 │ │ 雪 │      │
│ │ ○  │ │ ●  │ │ ○  │ │ ○  │ │ ○  │      │
│ └────┘ └────┘ └────┘ └────┘ └────┘      │
│ 风景系列：[星空][海浪][草原][护眼][纯白][晴川] │
│ 风格系列：[机甲][暗夜][软萌]             │
│                                          │
│ [恢复全部默认]  ← 红色文字按钮           │
│                                          │
│ 💡 头像框与主题可自由混搭，互不影响      │
│ 💡 装扮在所有登录设备同步                │
└──────────────────────────────────────────┘
```

- 每类单选（学 VS Code 主题每类单选）
- 「无 / 默认」选项始终存在，用于清除该类启用
- 已拥有项可点选切换；未拥有项不显示（在商城里显示）
- 「恢复全部默认」二次确认 → 清空 frame + theme 启用 → UI 回默认

### 3.3 切换流程（状态机 + 时序）

**状态机**（每个商品 sku 的状态）：

```
┌──────────┐  兑换成功   ┌────────────┐  点「启用」  ┌──────────┐
│  未拥有  │ ─────────> │ 已拥有未启用│ ──────────> │ 启用中   │
│ (locked) │            │ (owned)    │             │ (loading)│
└──────────┘            └────────────┘             └─────┬────┘
                              ↑                          │
                              │  点其他商品「启用」      │
                              │   (该商品回退)           │
                              │                          ↓
                              │                    ┌──────────┐
                              └────────────────────│ 已启用   │
                                                   │ (active) │
                                                   └──────────┘
```

**切换时序**（用户点「启用」按钮）：

1. **事前**：按钮显示当前状态（「启用」次按钮 / 「✓ 启用中」禁用绿色）
2. **事中**：点击 → 按钮变 loading（spinner + 文字「切换中…」）→ 调 `POST /shop/activate` → **CSS 变量立即写入** `:root.style`（不等后端返回，先乐观更新；后端失败再回滚）
3. **事后**：
   - 成功 → toast「已启用：春樱初绽」+ 按钮切「✓ 启用中」+ 其他同类商品按钮切回「启用」
   - 失败 → toast「切换失败，已恢复原样」+ CSS 变量回滚到前一态
4. **撤销**：用户可随时在「我的装扮」点其他商品切换，或点「恢复全部默认」

**生效方式**：CSS 变量实时写入 `document.documentElement.style.setProperty('--tm-skin-primary', value)`，**无需刷新**，浏览器立即 repaint。预期 ≤200ms 可见变化（PRD v2 §1.3 性能指标）。

### 3.4 预览机制

**切换前预览**（hover 预览，不打断当前启用）：

- 在「我的装扮」弹层 / 商城页商品卡上，**hover 商品卡片 500ms** → 临时应用该商品 CSS 变量到 `:root.style`（标记 `data-preview="true"`）→ UI 实时变化预览效果
- 鼠标移出 → 立即恢复当前启用态（移除 `data-preview` 重新写入 active 配置）
- 已拥有项可 hover 预览；未拥有项也可 hover 预览（让用户先看效果再决定兑换）

**预览的视觉提示**：hover 预览时顶部出现一条提示条「预览中：星河璀璨 · 移开鼠标恢复」（amber 色），避免用户以为已切换。

### 3.5 多设备同步（本期静态效果不用管后端）

- 后端 `currentSkin` 是单一真相源（PRD v2 §7.8）
- 本期静态页：FE 用本地 storage 模拟启用态，刷新页面保持。后端接口对齐留给 plugs-fe 接 api-backend 阶段。

---

## 4. 商城页（静态）布局

### 4.1 整体结构

```
┌──────────────────────────────────────────────────────────────┐
│ 🛍 装扮商城                              积分: 320  [?]      │
│              [邀请好友 +50/人]  [我的装扮 ▾]  [签到]          │
├──────────────────────────────────────────────────────────────┤
│ [ 头像框 8 款 ] [ 插件主题 13 款 ]                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ [预览图] │ │ [预览图] │ │ [预览图] │ │ [预览图] │        │
│  │ 铜质光环 │ │ 翠竹青   │ │ 银浪纹   │ │ 樱粉丝带 │        │
│  │ 50 积分  │ │ 100 积分 │ │ 150 积分 │ │ 150 积分 │        │
│  │[积分兑换]│ │[积分兑换]│ │[积分兑换]│ │[积分兑换]│        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ [预览图] │ │ [预览图] │ │ [预览图] │ │ [预览图] │        │
│  │ 星辰银   │ │ 金桂冠   │ │ 彩虹流光 │ │ 百日专属 │        │
│  │ 250 积分 │ │ 300 积分 │ │ 300 积分 │ │ 成就款   │        │
│  │[积分兑换]│ │[积分兑换]│ │[积分兑换]│ │[未解锁]  │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
│  （切到「插件主题」Tab 显示 13 张主题商品卡，网格同上）      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- 顶部固定栏：标题 + 当前积分 + [?] + [邀请好友] + [我的装扮] + [签到]
- Tab 切换：头像框（8 款）/ 插件主题（13 款），默认头像框
- 商品网格：每行 4 张卡（桌面宽）/ 3 张（中宽）/ 2 张（窄）；卡片间距 16px
- 商品卡固定尺寸：宽 200px，高 280px（预览图 160px 高 + 文字区 120px）
- 主题 Tab 13 张卡分 3 段展示：季节系列（4）+ 风景系列（6）+ 风格系列（3），每段上方加小标题「季节系列」「风景系列」「风格系列」分组

### 4.2 商品卡片内容与四态

**卡片结构**：
```
┌────────────────┐
│                │
│   [预览图]      │  ← 160px 高，居中
│                │
├────────────────┤
│ 铜质光环        │  ← 名称，14px font-medium
│ 50 积分 · ¥0.5 │  ← 价格，12px text-gray-500
│ [积分兑换]     │  ← 按钮区
└────────────────┘
```

**四态按钮**（沿用 PRD v2 §7.2）：

| 状态 | 按钮文案 | 样式 |
|---|---|---|
| 未拥有 + 积分够 | `积分兑换 50` | 主按钮，`bg-blue-600` 跟主题主色 |
| 未拥有 + 积分不够 | `积分不足` | 禁用灰 + 小字「还差 30 分 · 多签到」 |
| 已拥有未启用 | `启用` | 次按钮，边框态 |
| 已拥有已启用 | `✓ 启用中` | 禁用绿色 |
| 成就款未达成 | `未解锁` | 禁用灰 + 小字「累计签到 100 天」 |
| 成就款已达成 | `启用` | 同已拥有未启用 |

### 4.3 积分余额显示

- 商城顶部固定栏右侧「积分: 320」
- 兑换成功后**以后端返回的新积分为准**刷新（不本地猜算，数据一致性底线）
- 积分余额与 options.vue 显示一致（同源 useAuth.user.points）

### 4.4 未登录态商城

- 商城页本身可访问（让用户先看商品）
- 顶部固定栏积分位显「未登录」+ 「登录」按钮
- 所有商品卡的兑换按钮置灰 + tooltip「登录后可兑换」
- 点任意兑换按钮 → 弹 LoginDialog（复用现有组件）

---

## 5. 图片资源清单（给用户生成用 · 极细致规格）

> **守带宽红线**：所有图 ≤50KB（背景图/头像框单图上限 ≤45KB），格式 WebP（照片/背景类）或 PNG（透明装饰类）。不打包进扩展包，走后端 CDN（`cdn.ouu365.com/skin/`）。
> **能 CSS 实现的不用图**：彩虹流光框（CSS conic-gradient 动画）、护眼墨绿/极简纯白/暗夜深渊三套主题（纯 CSS 变量），均不出图。

### 5.0 资源总览（先看这张表，再读详细规格）

| 类别 | 数量 | 文件名前缀 | 尺寸 | 格式 | 单图上限 |
|---|---|---|---|---|---|
| 头像框 PNG | **7 张** | `frame-*.png` | 144×144 | PNG 透明 | ≤45KB |
| 主题背景图 | **10 张** | `bg-*.webp` | 1920×1080 | WebP | ≤45KB |
| 商品预览图（可选） | 7+13=20 张 | `preview-*.png` | 320×200 | WebP/PNG | ≤40KB |
| **核心产出（用户须生成）** | **17 张** | — | — | — | 总 ≤765KB |
| CSS 实现（无需图） | 1 框 + 3 主题 | — | — | — | 0 |

**建议先出 1 张样板确认风格**：`bg-sakura-spring.webp`（春樱初绽背景图）—— 它能一次性验证 4 个关键点：①AI 工具出图风格是否符合品牌（意境 vs 写实）②0.06 透明度下饱和度是否够 ③留白构图是否避开卡片遮挡 ④WebP 压到 45KB 内的画质损失。这张确认后，剩余 9 张背景图按同风格批量出；7 张头像框 PNG 再单独出 1 张 `frame-bronze-100.png` 样板确认装饰画法。

---

### 5.1 头像框素材（透明 PNG 环 · 7 张 · 极细致规格）

**通用规格（7 张全部遵守）**：
- **画布尺寸**：144×144 px（固定，CSS `background-size` 缩放复用到 24/48/68px 三档）
- **格式**：PNG-24 带 alpha 通道（透明背景）
- **体积上限**：≤45KB/张（用 `pngquant --quality 70-85` 或 `oxipng -o 4` 压缩）
- **中心透明圆**：直径 **86px**，居中（圆心坐标 72,72），透明度 alpha=0（完全透出头像）
- **环宽**：8-12 px（视款式，见各框说明）
- **外圈安全边**：装饰不超出画布边缘，留 2px 安全边（即外径 ≤140px）
- **背景**：100% 透明（只画框本身，不画底色）
- **抗锯齿**：边缘清晰，缩放到 24×24 仍能辨识主体形状
- **头像层级**：FE 渲染时框 PNG `position:absolute; inset:0; pointer-events:none;` 盖在头像本体之上

#### 5.1.1 `frame-bronze-100.png` — 铜质光环（50 分，引流款）

| 维度 | 规格 |
|---|---|
| 用途 | 头像框（套在头像外圈） |
| 尺寸 | 144×144 px |
| 格式 | PNG 透明背景 |
| 体积 | ≤40KB |
| 画布/背景 | 100% 透明 |
| 构图 | 圆环居中，外径 124px、内径 108px（环宽 8px），中心透明圆 86px |
| 形状 | 正圆环，无断裂 |
| 颜色 | 主体铜色金属渐变：`#92400e` → `#b45309` → `#d97706` → `#b45309`（左上→右下方向，模拟金属高光） |
| 装饰元素 | 无额外装饰物；外圈带 1px 浅色高光（`#fbbf24` 透明度 40%），内圈带 1px 暗影（`#451a03` 透明度 60%）增强立体感 |
| 文字 | 无 |
| 质感 | 哑光金属，无镜面反光 |
| 透明度/留白 | 中心 86px 完全透明；外圈装饰不超 124px |
| AI prompt 关键词 | 圆环头像框 / 铜色金属质感 / 简约无装饰 / 透明背景 PNG / 144x144 / bronze metal ring avatar frame, minimalist, transparent background, copper gradient #b45309, 8px ring width, no decoration, centered, PNG with alpha |

#### 5.1.2 `frame-bamboo-green.png` — 翠竹青（100 分，普通款）

| 维度 | 规格 |
|---|---|
| 用途 | 头像框 |
| 尺寸 | 144×144 px |
| 格式 | PNG 透明背景 |
| 体积 | ≤45KB |
| 画布/背景 | 100% 透明 |
| 构图 | 圆环居中，外径 126px、内径 108px（环宽 9px），中心透明圆 86px |
| 形状 | 正圆环 |
| 颜色 | 竹青色渐变：`#84cc16` → `#65a30d` → `#15803d` → `#65a30d`（左上→右下） |
| 装饰元素 | 环上等距 4 片小竹叶（位置 12点/3点/6点/9点钟方向），每片叶长约 14px、宽 5px，竹叶色 `#16a34a` 带浅色叶脉 `#bbf7d0`，叶子向外微伸（不超出 140px 安全边） |
| 文字 | 无 |
| 质感 | 半哑光，竹叶带细微蜡质光泽 |
| 透明度/留白 | 中心 86px 透明 |
| AI prompt | 圆环头像框 / 竹青色 / 环上四片小竹叶 / 透明背景 PNG / 144x144 / bamboo green ring avatar frame, 4 small bamboo leaves on ring at 12/3/6/9 o'clock, transparent background, gradient #65a30d to #15803d, 9px ring, PNG alpha |

#### 5.1.3 `frame-silver-wave.png` — 银浪纹（150 分，走量款）

| 维度 | 规格 |
|---|---|
| 用途 | 头像框 |
| 尺寸 | 144×144 px |
| 格式 | PNG 透明背景 |
| 体积 | ≤45KB |
| 画布/背景 | 100% 透明 |
| 构图 | 圆环居中，外径 128px、内径 108px（环宽 10px），中心透明圆 86px |
| 形状 | 正圆环，环面带连续波浪纹理 |
| 颜色 | 银色渐变：`#9ca3af` → `#e5e7eb` → `#f9fafb` → `#9ca3af`（左上→右下，模拟银器光泽） |
| 装饰元素 | 环上 8 道等距波浪纹（凹凸相间，凹处色 `#6b7280`、凸处色 `#f9fafb`），外圈 1px 微光晕 `#e5e7eb` 透明度 50% |
| 文字 | 无 |
| 质感 | 抛光银器，有反光层次 |
| 透明度/留白 | 中心 86px 透明 |
| AI prompt | 圆环头像框 / 银色金属 / 环上波浪纹理 / 透明背景 PNG / 144x144 / silver wave ring avatar frame, polished silver gradient #9ca3af to #e5e7eb, 8 wave patterns on ring, 10px width, outer glow, transparent background PNG |

#### 5.1.4 `frame-sakura-ribbon.png` — 樱粉丝带（150 分，走量款）

| 维度 | 规格 |
|---|---|
| 用途 | 头像框 |
| 尺寸 | 144×144 px |
| 格式 | PNG 透明背景 |
| 体积 | ≤45KB |
| 画布/背景 | 100% 透明 |
| 构图 | 圆环居中，外径 128px、内径 108px（环宽 10px），中心透明圆 86px |
| 形状 | 正圆环，环面平滑 |
| 颜色 | 粉色渐变：`#f9a8d4` → `#ec4899` → `#be185d` → `#ec4899`（左上→右下） |
| 装饰元素 | 顶部 12 点钟方向斜绑一根丝带蝴蝶结：丝带宽 6px、长 28px，左右各一蝴蝶翅膀（每翅 14×10px），丝带色 `#f472b6` 描边 `#be185d`，蝴蝶结中心结点 4×4px 实色 `#be185d`；环上零星 3 片小樱花瓣（5 瓣花，每瓣 3×3px，色 `#fbcfe8`）位于 4 点/8 点钟方向 |
| 文字 | 无 |
| 质感 | 缎面丝带光泽，柔滑 |
| 透明度/留白 | 中心 86px 透明；蝴蝶结不超出 140px 安全边 |
| AI prompt | 圆环头像框 / 粉色 / 顶部丝带蝴蝶结 / 透明背景 PNG / 144x144 / pink ribbon ring avatar frame, sakura pink gradient #f9a8d4 to #ec4899, satin ribbon bow on top, 3 small sakura petals on ring, transparent background PNG |

#### 5.1.5 `frame-starry-silver.png` — 星辰银（250 分，精品款）

| 维度 | 规格 |
|---|---|
| 用途 | 头像框 |
| 尺寸 | 144×144 px |
| 格式 | PNG 透明背景 |
| 体积 | ≤45KB |
| 画布/背景 | 100% 透明 |
| 构图 | 圆环居中，外径 130px、内径 108px（环宽 11px），中心透明圆 86px |
| 形状 | 正圆环 |
| 颜色 | 深紫银渐变：`#94a3b8` → `#64748b` → `#4c1d95` → `#1e1b4b`（左上→右下，模拟夜空银紫） |
| 装饰元素 | 环上等距 6 颗小星点（位置 12/2/4/6/8/10 点钟），每颗星 4 角十字形 4×4px，色 `#f8fafc` 中心带光晕 `#c4b5fd` 透明度 70%（模拟发光星）；外圈带 0.5px 银色光晕 `#cbd5e1` 透明度 40% |
| 文字 | 无 |
| 质感 | 夜空金属，星点带柔光 |
| 透明度/留白 | 中心 86px 透明 |
| AI prompt | 圆环头像框 / 银紫色 / 环上六颗发光星点 / 透明背景 PNG / 144x144 / starry silver ring avatar frame, silver-purple gradient #94a3b8 to #4c1d95, 6 glowing star dots on ring at 12/2/4/6/8/10 o'clock, 4-point cross stars with glow, transparent background PNG |

#### 5.1.6 `frame-gold-laurel.png` — 金桂冠（300 分，精品款）

| 维度 | 规格 |
|---|---|
| 用途 | 头像框 |
| 尺寸 | 144×144 px |
| 格式 | PNG 透明背景 |
| 体积 | ≤45KB |
| 画布/背景 | 100% 透明 |
| 构图 | 圆环居中，外径 132px、内径 108px（环宽 12px），中心透明圆 86px |
| 形状 | 正圆环 |
| 颜色 | 金色金属渐变：`#fbbf24` → `#f59e0b` → `#d97706` → `#f59e0b`（左上→右下） |
| 装饰元素 | 顶部 11-1 点钟方向月桂枝叶装饰左右各一枝：每枝长 22px，含 5 片小叶（每叶 6×3px 椭圆，色 `#84cc16` 描边 `#facc15`），枝干金色 `#d97706`；底部 6 点钟方向一朵小桂花簇（3 朵，每朵 4 瓣 3×3px，色 `#fde047`），环外圈带 1px 金色高光 `#fef3c7` 透明度 60% |
| 文字 | 无 |
| 质感 | 镜面金，有强反光 |
| 透明度/留白 | 中心 86px 透明；月桂枝不超出 140px 安全边 |
| AI prompt | 圆环头像框 / 金色金属 / 顶部月桂枝叶装饰 / 透明背景 PNG / 144x144 / gold laurel ring avatar frame, gold metallic gradient #fbbf24 to #f59e0b, laurel branch leaves on top left and right, small osmanthus flower cluster at bottom, 12px ring, mirror gold shine, transparent background PNG |

#### 5.1.7 `frame-sign-100d.png` — 百日签到专属（0 分，成就款，累计签到 100 天解锁）

| 维度 | 规格 |
|---|---|
| 用途 | 头像框（成就奖励，不可购买） |
| 尺寸 | 144×144 px |
| 格式 | PNG 透明背景 |
| 体积 | ≤45KB |
| 画布/背景 | 100% 透明 |
| 构图 | 圆环居中，外径 132px、内径 108px（环宽 12px），中心透明圆 86px |
| 形状 | 正圆环 |
| 颜色 | 深金光泽渐变：`#d97706` → `#f59e0b` → `#fbbf24` → `#f59e0b`（环面带强光泽流动感） |
| 装饰元素 | ①环上等距镶 12 颗小星点（每 30° 一颗，4 角星 3×3px，色 `#fde047` 带光晕 `#fef3c7` 透明度 80%）；②顶部 12 点钟方向一颗大星（5 角星 12×12px，色 `#fbbf24` 描边 `#d97706`，带柔光晕）；③底部 6 点钟方向文字「100」（极小，字号约 8px，色 `#fbbf24` 描边 `#92400e`，加粗） |
| 文字 | 「100」，位置 6 点钟方向环上，加粗金色，字号 8px |
| 质感 | 仪式感金属勋章，星点带柔光 |
| 透明度/留白 | 中心 86px 透明；大星不超出 140px 安全边 |
| AI prompt | 圆环头像框 / 金色勋章 / 12 颗小星 + 顶部大星 + 底部"100"字 / 透明背景 PNG / 144x144 / golden achievement ring avatar frame, deep gold gradient #d97706 to #fbbf24, 12 small star dots evenly on ring, 1 big 5-point star on top, text "100" at bottom, medal style, transparent background PNG |

#### 5.1.8 彩虹流光框（CSS 动画，**无需图**）

`frame-rainbow-anim` 商品 config 用 `cssClass` 字段，FE 渲染时套这个 class，不引用任何 PNG：

```css
.tm-frame-rainbow {
  background: conic-gradient(from 0deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #ef4444);
  border-radius: 50%;
  padding: 3px;
  animation: tm-rainbow-spin 4s linear infinite;
}
@keyframes tm-rainbow-spin { to { transform: rotate(360deg); } }
```

---

### 5.2 主题背景图（WebP · 10 张 · 极细致规格）

**通用规格（10 张全部遵守）**：
- **画布尺寸**：1920×1080 px（16:9 横版，`background-size: cover` 整页覆盖会裁切适配）
- **格式**：WebP（有损，quality 75-80）
- **体积上限**：≤45KB/张（用 `cwebp -q 78` 压缩；如超限降 q 到 70）
- **透明度规则**：源图**不透明**（实色背景 + 主体），由 FE `body::before` 用 `opacity: 0.06`（浅色）/ `0.04`（深色）整体压淡显示 → **因此源图颜色饱和度要比正常壁纸高一档**，避免 0.06 后淡到看不出
- **构图留白**：①左上角 + 中央留空（标签列表核心区，避免干扰内容可读性）；②**右下角留空**（避免被 PinnedBar/底部状态栏卡片遮挡）；③主体元素集中在右侧、底部边缘、四角
- **内容禁忌**：不含人脸、不含可识别文字、不含版权角色/IP、不含商标
- **风格统一**：10 张采用「**轻插画意境风**」（非写实照片、非扁平卡通），笔触柔和、留白多、氛围感强，符合效率工具品牌调性

#### 5.2.1 `bg-sakura-spring.webp` — 春樱初绽（季节·春，100 分）★ 建议首张样板

| 维度 | 规格 |
|---|---|
| 用途 | 春樱初绽主题背景（`--tm-skin-page-bg-image`） |
| 尺寸 | 1920×1080 px |
| 格式 | WebP |
| 体积 | ≤45KB |
| 画布/背景 | 实色背景 `#fffafb`（极浅米粉白） |
| 构图 | 樱花树枝从右上角斜伸入画（占画布右上 30% 区域），主枝粗 8px、分 3-4 根细枝；5-8 片粉色花瓣零星飘落散布在右半画布（不进入左上 + 中央留白区）；左下角一抹浅粉渐变阴影 |
| 形状 | 树枝 organic 曲线，花瓣 5 瓣樱花形（每瓣 8×8px） |
| 颜色 | 树枝 `#78350f`（深褐）；花瓣 `#fce7f3` → `#fbcfe8` → `#f9a8d4` 渐变（浅粉到中粉）；花蕊 `#fbbf24` 点缀 |
| 装饰元素 | 3-5 朵未开小花苞（每苞 3×3px，色 `#fbcfe8`）点缀枝头 |
| 文字 | 无 |
| 质感 | 水彩轻插画，柔边、半透明叠色 |
| 透明度/留白 | 左上 600×600px + 中央 800×600px 留空；右下 400×300px 留空 |
| AI prompt | 樱花树枝从右上角斜伸 / 5-8 片粉色花瓣飘落 / 极浅米粉白背景 / 轻水彩插画风格 / 留白多 / 1920x1080 / cherry blossom branch from top-right corner, 5-8 pink petals falling, very light pink background #fffafb, soft watercolor illustration, minimalist, lots of negative space, no text, no people, 1920x1080, high saturation for 0.06 opacity display |

#### 5.2.2 `bg-lotus-summer.webp` — 盛夏清荷（季节·夏，150 分）

| 维度 | 规格 |
|---|---|
| 用途 | 盛夏清荷主题背景 |
| 尺寸 | 1920×1080 px |
| 格式 | WebP |
| 体积 | ≤45KB |
| 画布/背景 | 实色背景 `#f0fdfa`（极浅青白） |
| 构图 | 右下角一片半展开荷叶（直径 240px，占画布右下 25%），叶缘微波浪；左侧中部一朵半开荷花（直径 80px）斜出；3-5 道淡青色水波纹横贯底部（每纹长 300px、高 2px） |
| 形状 | 荷叶圆形带缺口，荷花 8 瓣重瓣 |
| 颜色 | 荷叶 `#86efac` → `#22c55e` → `#15803d`（叶面渐变，叶脉 `#bbf7d0`）；荷花 `#fce7f3` → `#fbcfe8`（粉白渐变，花蕊 `#fbbf24`）；水波纹 `#a5f3fc` 透明度 50% |
| 装饰元素 | 2-3 颗水珠（每珠 3×3px，色 `#bae6fd` 带高光）点缀荷叶 |
| 文字 | 无 |
| 质感 | 水墨轻彩，柔边晕染 |
| 透明度/留白 | 左上 + 中央留空 |
| AI prompt | 右下角半展开荷叶 / 左侧一朵粉色荷花 / 底部淡青色水波纹 / 极浅青白背景 / 水墨轻彩风格 / 留白 / 1920x1080 / lotus leaf bottom-right, pink lotus flower left, light cyan water ripples at bottom, very light cyan background #f0fdfa, soft ink-wash illustration, minimalist, no text, 1920x1080, high saturation |

#### 5.2.3 `bg-autumn-maple.webp` — 金秋满陇（季节·秋，250 分）

| 维度 | 规格 |
|---|---|
| 用途 | 金秋满陇主题背景 |
| 尺寸 | 1920×1080 px |
| 格式 | WebP |
| 体积 | ≤45KB |
| 画布/背景 | 实色背景 `#fffbeb`（极浅米黄） |
| 构图 | 右上角一枝枫树枝斜伸（占右上 25%），枝上 5-7 片枫叶（5 裂掌状，每叶 30×30px）；6-8 片飘落枫叶散布右半画布（小到中号，10-20px）；左下角一束稻穗（3 根，每根长 80px，穗粒 `#fbbf24`） |
| 形状 | 枫叶 5 裂掌状，稻穗椭圆颗粒 |
| 颜色 | 枫叶 `#fde68a` → `#fb923c` → `#dc2626` 渐变（黄到橙到红，3 色层次）；稻穗 `#fbbf24` 谷粒 `#d97706`；树枝 `#78350f` |
| 装饰元素 | 2-3 颗小果实（每颗 4×4px，色 `#dc2626`）点缀枝头 |
| 文字 | 无 |
| 质感 | 水彩轻彩，叶脉清晰 |
| 透明度/留白 | 左上 + 中央留空 |
| AI prompt | 右上角枫树枝 / 5-7 片枫叶飘落 / 左下角稻穗 / 极浅米黄背景 / 水彩轻彩风格 / 留白 / 1920x1080 / maple branch top-right with 5-7 maple leaves, falling leaves scattered, rice ears bottom-left, very light cream background #fffbeb, soft watercolor illustration, autumn palette yellow-orange-red, minimalist, no text, 1920x1080 |

#### 5.2.4 `bg-winter-snow.webp` — 暖冬初雪（季节·冬，250 分）

| 维度 | 规格 |
|---|---|
| 用途 | 暖冬初雪主题背景 |
| 尺寸 | 1920×1080 px |
| 格式 | WebP |
| 体积 | ≤45KB |
| 画布/背景 | 实色背景 `#f8fafc`（极浅雪白） |
| 构图 | 顶部 1/3 区域一片渐变云层（灰白 `#e2e8f0` → 透明）；20-30 片雪花零星飘落散布全画布（避开左上 + 中央留白区，每片 4-12px 大小不一）；右下角一座小雪屋剪影（80×60px，色 `#cbd5e1` 描边 `#94a3b8`，屋顶白雪 `#f8fafc`）；底部一抹雪地起伏（高 60px，色 `#f1f5f9`） |
| 形状 | 雪花 6 角对称晶体，雪屋三角屋顶 + 方形主体 |
| 颜色 | 雪花 `#e0e7ff` → `#c7d2fe`（浅雪青）；雪屋 `#cbd5e1`；屋顶雪 `#f8fafc`；云层 `#e2e8f0` |
| 装饰元素 | 雪屋窗口 2 个（每个 6×6px，色 `#fde047` 暖黄发光，模拟暖灯） |
| 文字 | 无 |
| 质感 | 轻插画，柔边、雪晶清晰 |
| 透明度/留白 | 左上 + 中央留空 |
| AI prompt | 20-30 片雪花飘落 / 右下角小雪屋剪影 / 暖黄窗户灯 / 底部雪地 / 极浅雪白背景 / 轻插画风格 / 留白 / 1920x1080 / 20-30 snowflakes falling, small snow cabin silhouette bottom-right with warm yellow window light, snow ground at bottom, very light snow white background #f8fafc, soft illustration, minimalist, no text, 1920x1080, high saturation snowflakes |

#### 5.2.5 `bg-starry-night.webp` — 星河璀璨（风景·星空，500 分，最高价）

| 维度 | 规格 |
|---|---|
| 用途 | 星河璀璨主题背景 |
| 尺寸 | 1920×1080 px |
| 格式 | WebP |
| 体积 | ≤45KB |
| 画布/背景 | 实色背景 `#1e1b4b`（深靛蓝紫，**饱和度极高**因 0.06 显示后会变极淡） |
| 构图 | 中央斜向一条银河带（从左下到右上，宽 200px，渐变紫蓝白）；银河内密集 60-80 颗小星点（每点 1-3px，4 角十字形）；银河外零星 15-20 颗散星；右下角一弯新月（直径 60px，月相 1/4，色 `#fbbf24` 带光晕） |
| 形状 | 星点 4 角十字，银河带 organic 倾斜，新月弧形 |
| 颜色 | 银河 `#6d28d9` → `#7c3aed` → `#a78bfa` → `#f0abfc`（深紫到粉紫渐变）；星点 `#f8fafc` 白色带 `#c4b5fd` 紫色光晕；大星 5 颗 `#fbbf24` 金色 |
| 装饰元素 | 5 颗大星（每颗 5 角星 6×6px，色 `#fbbf24` 带光晕）分布在银河带边缘 |
| 文字 | 无 |
| 质感 | 深空璀璨，星点带柔光，银河带星云感 |
| 透明度/留白 | **此主题特殊**：因深色背景在 0.06 透明度下几乎不可见，需在银河带 + 大星位置加更高饱和度白光，确保压淡后仍有「星空感」；左上 400×400px 留空（避免干扰标签标题） |
| AI prompt | 中央斜向银河带 / 60-80 颗小星 + 5 颗大金星 / 右下角一弯新月 / 深靛蓝紫背景 / 高饱和度 / 1920x1080 / diagonal milky way band across center, 60-80 small white stars, 5 big golden stars, crescent moon bottom-right, deep indigo purple background #1e1b4b, very high saturation, starry night illustration, minimalist, no text, no people, 1920x1080, vivid colors for low opacity display |

#### 5.2.6 `bg-ocean-waves.webp` — 碧海潮生（风景·海浪，150 分）

| 维度 | 规格 |
|---|---|
| 用途 | 碧海潮生主题背景 |
| 尺寸 | 1920×1080 px |
| 格式 | WebP |
| 体积 | ≤45KB |
| 画布/背景 | 实色背景 `#f0f9ff`（极浅天蓝白） |
| 构图 | 底部 1/3 海面（高 360px，色 `#bae6fd` → `#0284c7` 渐变）；海面 5-7 道白色浪花线（每线长 200-400px、高 4px，色 `#f0f9ff` 带泡沫感）；右下角一块小礁石剪影（80×50px，色 `#475569`）；上方天空留白带 3-5 朵小云（每朵 60×20px 椭圆，色 `#f8fafc`） |
| 形状 | 海面水平线 + 浪花弧线，云朵椭圆 |
| 颜色 | 海面 `#bae6fd` → `#7dd3fc` → `#0284c7`（浅到深蓝渐变）；浪花 `#f0f9ff` 白；礁石 `#475569` 灰蓝；云 `#f8fafc` |
| 装饰元素 | 2-3 只海鸥剪影（每只 8×3px，V 形，色 `#1e293b`）点缀天空 |
| 文字 | 无 |
| 质感 | 轻水彩，浪花带泡沫质感 |
| 透明度/留白 | 左上 + 中央上方留空（海面只在底部） |
| AI prompt | 底部海面 / 5-7 道白色浪花 / 右下角小礁石 / 上方天空 3-5 朵小云 + 2-3 只海鸥 / 极浅天蓝白背景 / 轻水彩风格 / 留白 / 1920x1080 / ocean waves at bottom third, 5-7 white foam wave lines, small reef bottom-right, 3-5 small clouds and 2-3 seagulls in sky, very light sky blue background #f0f9ff, soft watercolor illustration, minimalist, no text, 1920x1080 |

#### 5.2.7 `bg-grassland.webp` — 原野牧风（风景·草原，150 分）

| 维度 | 规格 |
|---|---|
| 用途 | 原野牧风主题背景 |
| 尺寸 | 1920×1080 px |
| 格式 | WebP |
| 体积 | ≤45KB |
| 画布/背景 | 实色背景 `#f7fee7`（极浅黄绿白） |
| 构图 | 底部 1/3 草原（高 360px，色 `#bbf7d0` → `#65a30d` 渐变）；草原上 5-8 株小草丛（每丛 20×15px，色 `#16a34a`）；远景中部一条起伏山丘线（高 80px，色 `#86efac` 透明度 60%）；右下角一棵孤独小树（高 80px，树冠 40×40px 色 `#16a34a`、树干 4×30px 色 `#78350f`）；上方天空 3-5 朵蓬松云 |
| 形状 | 山丘 organic 起伏曲线，树冠圆形，云朵椭圆叠加 |
| 颜色 | 草原 `#bbf7d0` → `#86efac` → `#65a30d`；山丘 `#86efac`；树冠 `#16a34a`；云 `#f8fafc` |
| 装饰元素 | 2-3 朵小野花（每朵 5 瓣 4×4px，色 `#fde047` / `#f87171` / `#f0abfc`）点缀草原 |
| 文字 | 无 |
| 质感 | 轻插画，柔边、层次清晰 |
| 透明度/留白 | 左上 + 中央上方天空留空 |
| AI prompt | 底部草原 / 远景起伏山丘 / 右下角孤独小树 / 草原上小野花 / 上方蓬松云 / 极浅黄绿白背景 / 轻插画风格 / 留白 / 1920x1080 / grassland at bottom third, rolling hills in distance, lone tree bottom-right, small wildflowers on grass, fluffy clouds in sky, very light yellow-green background #f7fee7, soft illustration, minimalist, no text, 1920x1080 |

#### 5.2.8 `bg-river-mountain.webp` — 晴川芳洲（风景·晴川，250 分）

| 维度 | 规格 |
|---|---|
| 用途 | 晴川芳洲主题背景 |
| 尺寸 | 1920×1080 px |
| 格式 | WebP |
| 体积 | ≤45KB |
| 画布/背景 | 实色背景 `#eff6ff`（极浅天蓝白） |
| 构图 | 底部 1/3 江面（高 360px，色 `#bfdbfe` → `#0ea5e9` 渐变）；远景中部 3 座层叠山峦（左中右各一，最高 120px，色 `#93c5fd` → `#3b82f6` 渐变带雾感）；江面 1 条小船剪影（30×10px，色 `#1e293b`）位于左下；右下角一枝垂柳枝条（长 100px，色 `#16a34a`）斜垂入画 |
| 形状 | 山峦三角起伏，江面水平，柳枝 organic 下垂曲线 |
| 颜色 | 江面 `#bfdbfe` → `#0ea5e9`；山峦 `#93c5fd` → `#3b82f6`（远山带雾感透明度 70%）；船 `#1e293b`；柳枝 `#16a34a` |
| 装饰元素 | 2-3 道江面波纹（每纹 100×1px，色 `#e0f2fe` 透明度 60%） |
| 文字 | 无 |
| 质感 | 水墨轻彩青绿山水，雾感层次 |
| 透明度/留白 | 左上 + 中央上方天空留空 |
| AI prompt | 底部江面 / 远景 3 座层叠山峦 / 江面小船 / 右下角垂柳枝 / 极浅天蓝白背景 / 水墨青绿山水风格 / 留白 / 1920x1080 / river at bottom, 3 layered misty mountains in distance, small boat silhouette on river, weeping willow branch bottom-right, very light sky blue background #eff6ff, ink-wash landscape illustration, minimalist, no text, 1920x1080 |

#### 5.2.9 `bg-mecha-tech.webp` — 机甲战纪（风格·机甲，500 分，最高价）

| 维度 | 规格 |
|---|---|
| 用途 | 机甲战纪主题背景 |
| 尺寸 | 1920×1080 px |
| 格式 | WebP |
| 体积 | ≤45KB |
| 画布/背景 | 实色背景 `#0f172a`（深靛黑，**饱和度高**因 0.06 后几乎不可见） |
| 构图 | 全画布分布科技网格线（每格 80×80px，线 0.5px 色 `#14b8a6` 透明度 30%）；右下角一组机甲装甲板碎片（3-4 块六边形，每块 60×60px，色 `#14b8a6` → `#0f766e` 渐变带金属高光）；左上角一个 HUD 圆环（直径 120px，环宽 3px，色 `#5eead4` 透明度 60%，环上 4 个小刻度）；中部偏右一束斜向能量光（长 400px、宽 4px，色 `#5eead4` 带光晕 `#14b8a6` 透明度 80%） |
| 形状 | 六边形装甲板，HUD 圆环，能量光直线 |
| 颜色 | 网格 `#14b8a6` 透明 30%；装甲板 `#14b8a6` → `#0f766e`；HUD `#5eead4`；能量光 `#5eead4` → `#14b8a6` |
| 装饰元素 | 5-8 个小数据点（每点 2×2px，色 `#5eead4` 带闪烁感）散布网格交叉点 |
| 文字 | 无（**不含任何字符/数字，避免识别为版权 UI**） |
| 质感 | 科技金属，硬朗线条，发光元素 |
| 透明度/留白 | 中央 600×400px 留空（仅网格，不放主体）；左上 HUD 不进入标签列表核心区 |
| AI prompt | 深靛黑背景 / 科技网格线 / 右下角机甲六边形装甲板 / 左上 HUD 圆环 / 中部能量光束 / 高饱和青色 / 1920x1080 / dark indigo background #0f172a, tech grid lines, mecha hexagonal armor plates bottom-right, HUD ring top-left, energy beam diagonal, cyan accent #14b8a6, sci-fi tech style, minimalist, no text, no characters, 1920x1080, high saturation |

#### 5.2.10 `bg-cute-clouds.webp` — 软萌奶霜（风格·可爱，150 分）

| 维度 | 规格 |
|---|---|
| 用途 | 软萌奶霜主题背景 |
| 尺寸 | 1920×1080 px |
| 格式 | WebP |
| 体积 | ≤45KB |
| 画布/背景 | 实色背景 `#fdf2f8`（极浅粉白） |
| 构图 | 全画布散布 8-12 朵小奶霜云（每朵 40×20px 椭圆叠加，色 `#fef3c7` / `#fce7f3` / `#ede9fe` 三色随机）；6-10 颗小星星（5 角星 6×6px，色 `#fbbf24` 带光晕）；3-5 颗小爱心（5×5px，色 `#f472b6`）；右下角一个大奶油蛋糕剪影（80×80px，3 层圆形叠加，色 `#fdf2f8` 描边 `#f472b6`，顶上一颗樱桃 `#dc2626`） |
| 形状 | 云朵椭圆叠加，星星 5 角，心形，蛋糕 3 层圆塔 |
| 颜色 | 云 `#fef3c7` / `#fce7f3` / `#ede9fe`；星 `#fbbf24`；爱心 `#f472b6`；蛋糕 `#fdf2f8` 描边 `#f472b6` |
| 装饰元素 | 2-3 个小彩虹弧（每个 30×15px 半圆，色 `#fca5a5`/`#fbbf24`/`#86efac`/`#93c5fd`/`#c4b5fd` 五色） |
| 文字 | 无 |
| 质感 | 软萌卡通，柔边、糖果色 |
| 透明度/留白 | 左上 + 中央 500×400px 留空 |
| AI prompt | 极浅粉白背景 / 散布 8-12 朵奶霜云 / 6-10 颗小金星 / 3-5 颗小爱心 / 右下角 3 层奶油蛋糕剪影 / 软萌卡通风格 / 留白 / 1920x1080 / very light pink background #fdf2f8, 8-12 cream clouds scattered, 6-10 small gold stars, 3-5 small pink hearts, 3-tier cream cake silhouette bottom-right with cherry, kawaii cartoon style, minimalist, no text, no characters, 1920x1080 |

---

### 5.3 商品预览缩略图（WebP/PNG · 20 张 · 可选 · FE 可截图自生成）

> 商品卡上的预览图，让用户在商城里看到商品长什么样。不是商品本身素材，是「商品应用后的效果图」。**推荐 FE 实现静态页后自己截图生成**（最真实），用户不必出图。如用户选择出图，按下表规格。

**通用规格**：
- 尺寸 320×200 px（卡片预览区显示尺寸的 2x 高清）
- 格式 WebP（主题类）/ PNG（头像框类，需保持示例头像清晰）
- 体积 ≤40KB/张
- 头像框预览图统一用蓝底白字"A"示例头像（与商城 FE 静态页一致）
- 主题预览图：sidepanel 缩略截图，展示该主题主色 + 背景图隐约 + 卡片样式

| 文件名 | 对应商品 | 尺寸 | 格式 | 体积 | 视觉描述 |
|---|---|---|---|---|---|
| `preview-frame-bronze.png` | 铜质光环 | 320×200 | PNG | ≤35KB | 示例头像（蓝底白字"A"）+ 铜质光环框套外圈，居中，背景浅灰 #f3f4f6 |
| `preview-frame-bamboo.png` | 翠竹青 | 320×200 | PNG | ≤35KB | 同上构图换翠竹青框 |
| `preview-frame-silver.png` | 银浪纹 | 320×200 | PNG | ≤35KB | 同上换银浪纹框 |
| `preview-frame-sakura-ribbon.png` | 樱粉丝带 | 320×200 | PNG | ≤35KB | 同上换樱粉丝带框 |
| `preview-frame-starry.png` | 星辰银 | 320×200 | PNG | ≤35KB | 同上换星辰银框 |
| `preview-frame-gold.png` | 金桂冠 | 320×200 | PNG | ≤35KB | 同上换金桂冠框 |
| `preview-frame-rainbow.png` | 彩虹流光 | 320×200 | WebP | ≤35KB | 示例头像 + 彩虹流光动画框（截图静态帧：彩色环） |
| `preview-frame-sign-100d.png` | 百日签到专属 | 320×200 | PNG | ≤35KB | 示例头像 + 百日框，背景带「100 天」浅水印 |
| `preview-theme-sakura-spring.png` | 春樱初绽 | 320×200 | WebP | ≤40KB | sidepanel 缩略截图，粉色主色 + 樱花背景隐约 |
| `preview-theme-lotus-summer.png` | 盛夏清荷 | 320×200 | WebP | ≤40KB | 荷绿主色 + 荷塘背景隐约 |
| `preview-theme-autumn-maple.png` | 金秋满陇 | 320×200 | WebP | ≤40KB | 琥珀金主色 + 枫叶背景隐约 |
| `preview-theme-winter-snow.png` | 暖冬初雪 | 320×200 | WebP | ≤40KB | 雪青紫主色 + 雪景背景隐约 |
| `preview-theme-starry-night.png` | 星河璀璨 | 320×200 | WebP | ≤40KB | 深紫主色 + 银河背景隐约 |
| `preview-theme-ocean-waves.png` | 碧海潮生 | 320×200 | WebP | ≤40KB | 海蓝主色 + 海浪背景隐约 |
| `preview-theme-grassland.png` | 原野牧风 | 320×200 | WebP | ≤40KB | 草绿主色 + 草原背景隐约 |
| `preview-theme-eye-green.png` | 护眼墨绿 | 320×200 | WebP | ≤40KB | 翠绿主色 + 浅绿 header，无背景图 |
| `preview-theme-pure-white.png` | 极简纯白 | 320×200 | WebP | ≤40KB | 中性灰主色，极简无背景图 |
| `preview-theme-river-mountain.png` | 晴川芳洲 | 320×200 | WebP | ≤40KB | 天蓝主色 + 山川背景隐约 |
| `preview-theme-mecha-tech.png` | 机甲战纪 | 320×200 | WebP | ≤40KB | 科技青主色 + 机甲背景隐约 + 小圆角方正 |
| `preview-theme-dark-abyss.png` | 暗夜深渊 | 320×200 | WebP | ≤40KB | 深灰主色 + 深色 header，无背景图 |
| `preview-theme-cute-clouds.png` | 软萌奶霜 | 320×200 | WebP | ≤40KB | 粉嫩主色 + 奶霜云朵背景隐约 + 大圆角 |

### 5.4 资源体积汇总

| 类别 | 数量 | 单图上限 | 总体积上限 |
|---|---|---|---|
| 头像框 PNG（核心产出） | 7 张 | ≤45KB | ≤315KB |
| 主题背景图 WebP（核心产出） | 10 张 | ≤45KB | ≤450KB |
| 商品预览图（可选，FE 截图） | 20 张 | ≤40KB | ≤800KB |
| **核心产出合计（用户须生成）** | **17 张** | — | **≤765KB** |
| CSS 实现（无需图） | 1 框 + 3 主题 | 0 | 0 |

**单页加载控制**：
- 商城页头像框 tab：8 张预览（≤320KB）；主题 tab：13 张预览（≤520KB），均 < 1MB
- 头像框 PNG 在 sidepanel/options 渲染时按需加载（IntersectionObserver），不进首屏 critical path
- 主题背景图仅在用户启用该主题后才加载（未启用不下载）；CDN 失败时 `body::before` 透明，主色仍生效（fallback 兜底）

### 5.5 用户生成图片的命名与存放

- 命名严格按上表文件名（FE 代码硬编码引用，不可改名）
- 存放路径：后端 CDN `https://cdn.ouu365.com/skin/<filename>`
- 用户生成后交给 api-backend 上传到 CDN，FE 通过 `previewUrl` / `pageBgImage` 字段从后端拉取
- **本期静态效果页阶段**：FE 可先把图放在 `assets/skin/` 目录本地引用，验证视觉效果；上线前切换到 CDN URL

### 5.6 建议生成顺序

1. **样板确认阶段（2 张）**：
   - `bg-sakura-spring.webp`（春樱背景）—— 验证插画风格 + 0.06 饱和度 + 留白构图 + WebP 压缩画质
   - `frame-bronze-100.png`（铜质光环框）—— 验证头像框环宽 + 中心透明圆 + 装饰画法
2. **批量背景图阶段（剩余 9 张）**：样板确认后按同风格批量出：`bg-lotus-summer` / `bg-autumn-maple` / `bg-winter-snow` / `bg-starry-night` / `bg-ocean-waves` / `bg-grassland` / `bg-river-mountain` / `bg-mecha-tech` / `bg-cute-clouds`
3. **批量头像框阶段（剩余 6 张）**：`frame-bamboo-green` / `frame-silver-wave` / `frame-sakura-ribbon` / `frame-starry-silver` / `frame-gold-laurel` / `frame-sign-100d`
4. **预览图（可选）**：FE 实现静态页后截图生成，最真实

---

## 6. 给 FE 的静态效果页指引

### 6.1 范围

FE 做一个**纯静态可交互**的预览页，展示装扮系统的视觉效果。不接后端、不做积分扣除、不做真实兑换。目的是让用户/PM 看到效果拍板。

### 6.2 实现方式（推荐）

**方案**：在 options.vue 加一个隐藏入口（如 URL 带 `?preview=skin` 时显示），或独立 `tabs/skin-preview.html` 新 tab 页。**推荐独立新 tab 页**（不影响 options 正常功能，便于分享 URL 给用户看）。

**文件清单**（FE 新增，仅静态预览用）：
- `tabs/skin-preview.html` + `tabs/skin-preview.vue` — 静态预览页入口
- 复用盈利 PRD §14.2 的 `composables/useSkin.ts`（本地 storage 模拟启用态，不接后端）
- 复用 `components/AvatarWithFrame.vue`（新增，头像+框叠加组件）
- 复用 `components/ShopSkuCard.vue`（新增，商品卡片）
- 复用 `components/MySkinDialog.vue`（新增，我的装扮弹层）

### 6.3 静态页要展示的内容

1. **主题切换器**（核心）
   - 顶部一排按钮：[默认] [春樱初绽] [盛夏清荷] [金秋满陇] [暖冬初雪] [星河璀璨] [碧海潮生] [原野牧风] [护眼墨绿] [极简纯白] [晴川芳洲] [机甲战纪] [暗夜深渊] [软萌奶霜]
   - 按系列分组显示（季节 4 / 风景 6 / 风格 3）
   - 点击任一按钮 → CSS 变量实时写入 → 页面立即变样
   - 当前选中的按钮高亮

2. **sidepanel 效果模拟区**
   - 在静态页内嵌一个模拟 sidepanel（标题栏 + 几张假标签卡）
   - 标签卡消费 `--tm-skin-card-radius` / `--tm-skin-card-border`
   - 选中态标签卡边框消费 `--tm-skin-primary`
   - header 叠加 `--tm-skin-accent-bg`

3. **options 效果模拟区**
   - 模拟 options 邮箱行（带头像+框）+ 主按钮（消费 primary）
   - 头像本体用邮箱 hash 生成（写死一个测试邮箱 `test@example.com`）
   - 头像框切换器：[无] [铜] [翠竹] [银] [樱粉] [星辰] [金] [彩虹] [百日]，点击切换头像框 PNG

4. **商城页静态布局**
   - 顶部积分（写死 320）+ Tab 切换 + 商品网格
   - 商品卡四态展示（未拥有积分够/未拥有积分不够/已拥有未启用/已拥有已启用）各放一张做演示
   - 商品卡预览图先用本地占位图，等用户生成真图后替换

5. **「我的装扮」弹层**
   - 点击「我的装扮」按钮 → 弹层
   - 头像框单选 + 主题单选 + 恢复默认按钮
   - 切换后立即生效（CSS 变量写入）

6. **深色模式适配**
   - 页面右上角加深色模式开关，验证主题在浅/深色模式下都可用

### 6.4 静态页数据（FE 写死）

```js
// 本地模拟数据，不接后端
const MOCK_SKINS = {
  frames: [
    { skuId: 'frame-bronze-100', name: '铜质光环', pointsPrice: 50, owned: true, active: true, previewUrl: 'assets/skin/preview-frame-bronze.png' },
    { skuId: 'frame-bamboo-green', name: '翠竹青', pointsPrice: 100, owned: true, active: false, previewUrl: 'assets/skin/preview-frame-bamboo.png' },
    { skuId: 'frame-silver-wave', name: '银浪纹', pointsPrice: 150, owned: true, active: false, previewUrl: 'assets/skin/preview-frame-silver.png' },
    { skuId: 'frame-sakura-ribbon', name: '樱粉丝带', pointsPrice: 150, owned: false, active: false, previewUrl: 'assets/skin/preview-frame-sakura-ribbon.png' },
    { skuId: 'frame-starry-silver', name: '星辰银', pointsPrice: 250, owned: false, active: false, previewUrl: 'assets/skin/preview-frame-starry.png' },
    { skuId: 'frame-gold-laurel', name: '金桂冠', pointsPrice: 300, owned: false, active: false, previewUrl: 'assets/skin/preview-frame-gold.png' },
    { skuId: 'frame-rainbow-anim', name: '彩虹流光', pointsPrice: 300, owned: false, active: false, cssClass: 'tm-frame-rainbow' },
    { skuId: 'frame-sign-100d', name: '百日签到专属', pointsPrice: 0, owned: false, active: false, unlockCondition: { type: 'checkin_cumulative', days: 100 } }
  ],
  themes: [
    // 季节系列 4 套
    { skuId: 'theme-sakura-spring', name: '春樱初绽', series: 'season', pointsPrice: 100, owned: true, active: true, config: { primary:'#ec4899', accentBg:'linear-gradient(135deg, rgba(252,231,243,0.5) 0%, rgba(251,207,232,0.3) 100%)', pageBgImage:"url('https://cdn.ouu365.com/skin/bg-sakura-spring.webp')", cardRadius:'0.75rem', cardBorder:'1px solid rgba(236,72,153,0.2)' } },
    { skuId: 'theme-lotus-summer', name: '盛夏清荷', series: 'season', pointsPrice: 150, owned: false, active: false, config: { /* 见 §2.3 JSON */ } },
    { skuId: 'theme-autumn-maple', name: '金秋满陇', series: 'season', pointsPrice: 250, owned: false, active: false, config: { /* ... */ } },
    { skuId: 'theme-winter-snow', name: '暖冬初雪', series: 'season', pointsPrice: 250, owned: false, active: false, config: { /* ... */ } },
    // 风景系列 6 套
    { skuId: 'theme-starry-night', name: '星河璀璨', series: 'scenery', pointsPrice: 500, owned: false, active: false, config: { /* ... */ } },
    { skuId: 'theme-ocean-waves', name: '碧海潮生', series: 'scenery', pointsPrice: 150, owned: false, active: false, config: { /* ... */ } },
    { skuId: 'theme-grassland', name: '原野牧风', series: 'scenery', pointsPrice: 150, owned: false, active: false, config: { /* ... */ } },
    { skuId: 'theme-eye-green', name: '护眼墨绿', series: 'scenery', pointsPrice: 100, owned: false, active: false, config: { primary:'#10b981', accentBg:'linear-gradient(135deg, rgba(209,250,229,0.5) 0%, rgba(167,243,208,0.3) 100%)', pageBgImage:'none', cardRadius:'0.625rem', cardBorder:'1px solid rgba(16,185,129,0.2)' } },
    { skuId: 'theme-pure-white', name: '极简纯白', series: 'scenery', pointsPrice: 100, owned: false, active: false, config: { primary:'#4b5563', accentBg:'transparent', pageBgImage:'none', cardRadius:'0.5rem', cardBorder:'1px solid rgba(229,231,235,1)' } },
    { skuId: 'theme-river-mountain', name: '晴川芳洲', series: 'scenery', pointsPrice: 250, owned: false, active: false, config: { /* ... */ } },
    // 风格系列 3 套
    { skuId: 'theme-mecha-tech', name: '机甲战纪', series: 'style', pointsPrice: 500, owned: false, active: false, config: { /* ... */ } },
    { skuId: 'theme-dark-abyss', name: '暗夜深渊', series: 'style', pointsPrice: 150, owned: false, active: false, config: { primary:'#1f2937', accentBg:'linear-gradient(135deg, rgba(31,41,55,0.15) 0%, rgba(17,24,39,0.1) 100%)', pageBgImage:'none', cardRadius:'0.5rem', cardBorder:'1px solid rgba(75,85,99,0.4)' } },
    { skuId: 'theme-cute-clouds', name: '软萌奶霜', series: 'style', pointsPrice: 150, owned: false, active: false, config: { /* ... */ } }
  ]
}
const MOCK_POINTS = 320
const MOCK_EMAIL = 'test@example.com'
```

> themes 完整 config 见 §2.3 JSON，FE 写死时全量复制（含 pageBgImage URL）。

### 6.5 静态页验收

- [ ] 13 套主题切换按钮可点，点击后页面主色/背景/卡片样式实时变化
- [ ] 10 套带背景图主题（春樱/盛夏荷/金秋/暖冬/星空/海浪/草原/晴川/机甲/软萌）有背景图（先用本地占位图）
- [ ] 3 套纯 CSS 主题（护眼墨绿/极简纯白/暗夜深渊）无背景图，仅主色 + 叠加 + 圆角变化
- [ ] 头像本体按邮箱 hash 生成（同一邮箱同色同字母）
- [ ] 8 个头像框可切换，框套在头像外圈正确
- [ ] 彩虹流光框有旋转动画（CSS conic-gradient）
- [ ] 百日签到框在未解锁态显灰 + 「累计签到 100 天」
- [ ] 商城商品卡四态显示正确（8 框 + 13 主题共 21 张卡）
- [ ] 「我的装扮」弹层单选切换生效（头像框与主题解耦，互不影响）
- [ ] 深色模式下所有主题均可用（重点测暗夜深渊对比度）
- [ ] **未启用任何主题时，页面外观与现状 sidepanel/options 100% 一致（零回归）**

---

## 7. 可感知设计检查清单（对照行为准则 §6）

| 用户动作 | 事前文案/图标 | 事中反馈 | 事后提示 | 撤销路径 |
|---|---|---|---|---|
| 切换主题 | 按钮显当前启用态（「✓ 启用中」绿色禁用） | 按钮 loading「切换中…」+ CSS 立即变样 | toast「已启用：星河璀璨」 | 点其他主题 / 恢复默认 |
| hover 预览商品 | 商品卡 hover 500ms 触发 | 顶部 amber 提示条「预览中：星河璀璨 · 移开鼠标恢复」 | 移开鼠标恢复原样 | 移开鼠标即撤销 |
| 恢复默认 | 红色文字按钮「恢复全部默认」 | 二次确认「将恢复默认头像框/主题」 | toast「已恢复默认」 | 重新启用 |
| 头像框未拥有时点兑换 | 按钮显「积分兑换 50」明示扣分 | 二次确认「扣除 50 积分，不可退回」+ loading | toast「已兑换并启用 ✓」 | 在「我的装扮」切换其他（积分不退） |
| 积分不足 | 按钮禁用 + 小字「还差 30 分 · 多签到或邀请好友」 | - | - | - |
| 未登录点兑换 | 按钮置灰 + tooltip「登录后可兑换」 | - | 点按钮弹 LoginDialog | - |
| 成就款未解锁 | 卡片显「未解锁 · 累计签到 100 天」 | - | 达成时 toast「百日签到达成，专属头像框已解锁」 | - |

**检验三问**：
- 切换前：用户知道当前是哪个主题/框（按钮 ✓ 启用中标记）✓
- 切换中：用户知道正在切换（按钮 loading + CSS 实时变样）✓
- 切换后：用户知道结果（toast + UI 变样）✓

---

## 8. 数据一致性（对照行为准则 §7）

本期静态效果页阶段：
- 启用态存 `chrome.storage.local` key `tabMasterSkinPreview`（仅静态页用，不与真实后端交互）
- 主题 config 写死在 FE 代码里（MOCK_SKINS），不从后端拉
- 切换主题/头像框 → 写本地 storage + 写 CSS 变量，刷新页面保持

**上线后**（PRD v2 §7.8 已设计，本期不实现）：
- 当前启用以后端 `/customer/my` 返回的 `currentSkin` 为单一真相源
- 本地 storage 仅作首屏加速缓存，每次启动强制拉后端覆盖
- 兑换/切换都走后端事务，前端不本地猜算积分

---

## 9. Non-Goals（本期静态效果页明确不做）

- ❌ 接后端 API（积分/拥有/启用/邀请全部静态 mock）
- ❌ 真实积分扣除
- ❌ 真实邮箱登录态联动（用写死的测试邮箱）
- ❌ 邀请机制（盈利 PRD §3，本期不展示）
- ❌ 充值入口（盈利 PRD §4.2，灰显也不做）
- ❌ 背景强度滑块（主题透明度固定 0.06/0.04）
- ❌ 主题自由组合（主色/背景/边框不可各选各的，只整包预设）
- ❌ 用户上传头像
- ❌ 装扮过期机制
- ❌ 限时装扮/倒计时
- ❌ 官网 /my 同步（跨线后置）
- ❌ sidepanel 顶栏放头像框（空间太窄，进 HeaderMenu 下拉才看）
- ❌ 商品搜索/分页（21 个 SKU 不需要：8 框 + 13 主题）
- ❌ 成就款主题（如「周年荣耀」动画主题下期再做，本期 13 套均积分可购买；成就款目前只在头像框里设 1 个：百日签到专属）
- ❌ CSS 动画背景主题（原极光流彩方案下期作为成就款动画主题复刻，见 §2.5 预留 pattern）

---

## 10. 风险与未决问题

### 10.1 已知风险

| 风险 | 影响 | 缓解 |
|---|---|---|
| 主题色与 Tailwind 硬编码冲突，5 个变量覆盖不全 | 换主题视觉变化不明显 | MVP 只承诺 5 个变量点变化；问号说明明示影响范围；静态页让用户先看效果拍板 |
| 背景图透明度 0.06 太淡看不出 | 用户觉得主题没生效 | 静态页阶段让用户看效果反馈，可调整透明度；下期可加滑块 |
| 头像框 PNG 缩放到 24×24 失真 | 小尺寸看不清装饰 | 源图 144×144 高分辨率，CSS 缩放测试；必要时为小档单独出图 |
| 极光流彩动画在低性能设备卡顿 | 侧边栏卡 | 动画 20s 周期缓慢 + 透明度低 + 只在 body::before 一处；必要时改静态渐变（本期无动画主题，下期复刻再考虑） |
| 主题在深色模式下对比度不足 | 文字看不清 | FE 用 `dark:` 变体调亮 primary；静态页阶段四格矩阵必测；暗夜深渊重点测 |
| 深色背景图主题（星河璀璨/机甲战纪）在 0.06 透明度下几乎不可见 | 用户觉得主题没生效 | 源图饱和度拉到最高 + 主体元素加发光；静态页阶段让用户看效果，必要时调到 0.08 |
| CDN 背景图加载失败 | 主题色仍生效但无背景图 | CSS fallback：背景图 URL 失败时 `::before` 透明，不影响主色 |
| 17 张图片生成工作量大 | 用户出图周期长 | 分阶段：先 2 张样板（bg-sakura-spring + frame-bronze-100）确认风格再批量；FE 静态页先用占位图推进 |

### 10.2 未决问题

> @TODO: 用户确认头像框 PNG 设计风格是否满意（建议先出 2 张样板：`frame-bronze-100.png` + `frame-gold-laurel.png` 让用户确认简约款与华丽款两极风格，再批量做其他 5 张）

> @TODO: 用户确认 13 套主题的 primary 色值是否需要调整（静态页可实时调色让用户选）

> @TODO: 主题背景图透明度 0.06 是否够，尤其深色背景主题（星河璀璨/机甲战纪）可能需调到 0.08

> @TODO: 头像框是否要为小档（24×24）单独出图（取决于 144×144 源图缩放后的清晰度）

> @TODO: 商城商品预览图由 FE 截图生成还是用户出图（推荐 FE 实现后截图，最真实）

> @TODO: 用户是否需要为 13 套主题增设 1-2 个成就款（如累计签到 30 天解锁「春樱初绽」、累计 365 天解锁周年主题）—— 本期 13 套均积分购买，成就款留 Non-Goals，待用户决策
