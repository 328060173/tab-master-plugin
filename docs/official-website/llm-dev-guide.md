# 用大模型开发官网 · 喂养指南

> 配套 `prd.md` 使用 · Date: 2026-07-07
> 目标：让 DeepSeek / 豆包 / Kimi 按 PRD 产出完整可用的官网（VitePress + 信任蓝浅色系）

---

## 0. 先说结论

**主力用 DeepSeek，配 Trae（或 Cursor）IDE，项目级上下文开发。** 这是国内零门槛、编码最强、效率最高的路径。

| 模型 | 角色 | 为什么 |
|---|---|---|
| **DeepSeek V3** | 🎯 主力编码 | 国内编码能力第一梯队，写 Vue/VitePress 组件又快又准，价格便宜（API 极低，网页版免费） |
| **Kimi** | 长文档消化 | 200 万字上下文，适合先吃透整份 PRD 输出"任务分解 + 组件接口"，再喂给 DeepSeek |
| **豆包专家版（写作模式）** | 文案打磨 | 偏长文创作，适合优化官网文案语气；**写作模式不写代码**，写代码要用豆包代码模式或换 DeepSeek |

**不要让一个模型一次性生成整个官网** —— 一定会失控（丢 section、风格漂、组件不衔接）。必须**分阶段喂**，每阶段验收后再进下一步。

---

## 1. 三条开发路径（按推荐度排序）

### 路径 A（最省事，推荐）：Trae IDE + 内置 DeepSeek/豆包
- **Trae** 是字节出的 AI IDE（Cursor 国内版），国内免费，免翻墙，内置 DeepSeek 和豆包模型。
- 下载：trae.cn 下客户端，登录即用。
- 优势：项目级上下文自动读取，能直接建文件/改代码，比网页对话效率高一个数量级。
- 用法：打开本地项目目录，对话里 `@prd.md` 引用 PRD，让它按阶段实现。

### 路径 B（编码最强）：Cursor + DeepSeek API
- Cursor 免费档每月有额度，且支持填自定义 API key。
- 到 platform.deepseek.com 注册拿 API key（需充值，但几块钱能跑很久，DeepSeek 极便宜）。
- Cursor → Settings → Models → 填 DeepSeek API key + base URL `https://api.deepseek.com`。
- 优势：Cursor 的代码补全 + 多文件编辑体验最佳。

### 路径 C（纯网页版，零安装）：DeepSeek 网页版
- chat.deepseek.com 新建对话，上传 `prd.md`，按阶段贴 prompt。
- 把生成的代码手动复制到本地项目。
- 缺点：多文件协调累，没有项目上下文，容易忘前面生成的组件名。**仅适合验证想法或生成单文件**。

> 你是 10 年全栈，强烈建议走 **路径 A 或 B**。路径 C 只在临时验证时用。

---

## 2. 环境准备（10 分钟）

```bash
# 1. 建官网项目（独立于插件仓库，别放一起）
mkdir tab-master-website && cd tab-master-website
pnpm create vitepress@latest .  # 选默认主题

# 2. 装依赖
pnpm install

# 3. 把 PRD 拷进来（让 IDE 能读到）
mkdir docs
cp /Users/yuyany/web_space/tab-master-plugin/docs/official-website/prd.md ./docs/prd.md

# 4. 启动
pnpm docs:dev  # 默认 http://localhost:5173
```

然后用 Trae/Cursor **打开 `tab-master-website/` 目录**（不是打开单文件，要打开目录才有项目上下文）。

---

## 3. 分阶段 Prompt（直接复制粘贴）

> 每个 prompt 都已包含"上下文 + 任务 + 约束 + 验收"。按顺序执行，**上一阶段验收通过再进下一阶段**。
> 使用时把 `@docs/prd.md` 替换为你 IDE 的引用语法（Trae/Cursor 用 `@文件名`，网页版就手动上传或粘贴）。

---

### M1 · 脚手架 + 设计 Token + Nav + Hero

```
你是资深前端工程师。请阅读 @docs/prd.md，严格按其中的 §5 设计系统、§7 技术选型、§6 Section 1-2 实现。

任务（M1）：
1. 配置 .vitepress/config.ts：cleanUrls、head 注入 §4.1 全站 meta（含 og/twitter，URL 用 https://www.ouu365.com/）、sitemap 插件、nav 项按 §3.2（产品下拉含 4 个产品，仅标签大师可点，其余置灰）。
2. 建 .vitepress/theme/styles/tokens.css：把 §5.4 的间距/圆角/阴影/配色全部写成 CSS 变量（:root），配色用信任蓝 #2563EB。
3. 建 .vitepress/theme/components/ 下：ProductDropdown.vue（产品下拉矩阵，置灰项 tooltip 引导预约）、Hero.vue（§6 Section 2，含 eyebrow/H1/副标题/双 CTA/信任徽章/主视觉占位）。
4. 改 index.md：用自定义组件布局 Hero 区，frontmatter 写 §4.2 的 title 和 description。
5. 图标用 lucide-vue-next（pnpm add lucide-vue-next），禁止 emoji 当图标。

约束：
- 严格用 PRD 里的成品文案，不要自由发挥。
- 所有截图/视频位置用 <!-- SCREENSHOT: 描述 --> 注释占位。
- 商店链接未上架，下载按钮做 §6 Section 7 的「加入候补名单」占位。
- TypeScript 严格模式，不滥用 any。

验收：pnpm docs:dev 能起，首页显示 Nav（含产品下拉）+ Hero，配色为信任蓝，无报错。
```

**验收后你检查：** 产品下拉 4 项是否只有第 1 项可点？Hero 的 H1 是否含"浏览器标签插件"关键词？配色是否 `#2563EB`？

---

### M2 · 痛点 + 核心功能 + 场景 + 产品矩阵

```
继续按 @docs/prd.md 实现 M2。不要改 M1 已完成的文件结构，只新增组件和 section。

任务：
1. PainPoints.vue（§6 Section 3）：6 张痛点卡片 Bento 网格，浅灰底 #F1F5F9，每张含 Lucide 图标 + H3 + 描述，文案用 PRD 原文。
2. CoreFeatures.vue（§6 Section 4）：5 项功能 Bento 不等高网格，第 1 项占 2x2 大卡。每项含图标/H3/描述/关键点列表/截图占位。
3. Scenarios.vue（§6 Section 5）：5 个场景左右交错布局，每场景含 H3 + 角色 tag + 痛点 + 用法 + 截图占位。
4. ProductMatrix.vue（§6 Section 6）：4 张产品卡片，标签大师高亮「已上线」，其余 3 张置灰「即将上线」+ 预约按钮。
5. 在 index.md 里按顺序串联这 4 个组件。

约束：
- Bento 网格用 CSS Grid，响应式：移动单列 / 768px 2 列 / 1024px+ 不等高。
- 置灰卡片 opacity:0.6 + cursor:not-allowed，「预约通知」按钮可点（先 href="#booking"）。
- 所有文案严格用 PRD 原文，H3 不得改写（影响 SEO）。

验收：首页从 Hero 往下滚，痛→功能→场景→产品矩阵，顺序与文案与 PRD 一致，移动端不溢出。
```

---

### M3 · 下载安装 + 文档 + FAQ + 预约反馈打赏微信群 + Footer

```
继续按 @docs/prd.md 实现 M3（转化与闭环模块）。

任务：
1. DownloadInstall.vue（§6 Section 7）：三步说明 + 「加入候补名单」主按钮（商店未上架占位）+ Edge 置灰 + 安装演示视频占位 + 系统要求小字。
2. DocsLinks.vue（§6 Section 8）：6 个文档入口卡片，飞书链接先 href="/docs/" 中转，标 <!-- PLACEHOLDER: 飞书链接 -->。
3. FAQ.vue（§6 Section 9）：手风琴折叠，默认展开第 1 条，10 条 FAQ 用 PRD 原文。同时把 §4.5 的 FAQPage JSON-LD 注入页面 head。
4. FeedbackSection.vue（§6 Section 10）：含 5 个子模块——预约通知表单（邮箱+产品多选）、意见反馈表单（类型+内容+联系方式）、沟通联系（邮箱 hello@ouu365.com 等占位）、打赏（微信赞赏码+支付宝二维码占位）、微信群（群二维码+作者微信占位）。表单 action 先留占位 webhook，标 <!-- PLACEHOLDER: 飞书 webhook -->。
5. SiteFooter.vue（§6 Section 11）：深色底，4 列 + 底部版权，备案号占位。
6. index.md 串联全部 section，顺序：Hero → 痛点 → 功能 → 场景 → 产品矩阵 → 下载 → 文档 → FAQ → 反馈闭环 → Footer。

约束：
- 所有二维码位置用 <!-- QR: 描述 --> 占位。
- 表单提交先用前端校验 + console.log，webhook 占位标清。
- JSON-LD 用 <script type="application/ld+json"> 注入，放页面末尾或 head。

验收：首页完整可滚到底，所有 section 齐全，FAQ 折叠正常，表单能填能校验。
```

---

### M4 · SEO 全量校验

```
按 @docs/prd.md §4 做 SEO 全量收尾。

任务：
1. 检查每页 frontmatter 都有 title（≤30 中文字符）和 description（≤80 字符），首页用 §4.2 原文。
2. 注入 §4.5 的 4 类 JSON-LD：SoftwareApplication / FAQPage / BreadcrumbList / Organization，URL 统一 https://www.ouu365.com/，downloadUrl 标 PLACEHOLDER。
3. 建 public/robots.txt（允许全部 + sitemap 路径）。
4. 确认 sitemap 插件已生成 sitemap.xml。
5. 检查全页只有一个 H1，H2-H3 不跳级，H3 文案含长尾关键词（按 §4.3 矩阵）。
6. 图片占位都声明了 width/height 防止 CLS。

验收：pnpm docs:build 成功；用浏览器 devtools 看 <head> 里 meta/JSON-LD 齐全；H 标签层级正确。
```

---

### M5 · 部署

```
帮我把官网部署到 ouu365.com。

任务：
1. 配 VitePress 构建输出（pnpm docs:build → .vitepress/dist）。
2. 给两种部署方案的具体步骤：
   a. Vercel：连 GitHub 仓库，构建命令 pnpm docs:build，输出目录 .vitepress/dist，绑自定义域名 www.ouu365.com。
   b. 国内（备案后）：腾讯云/阿里云 对象存储 + CDN 静态托管。
3. 域名 DNS 解析：把 ouu365.com 的 CNAME 指向部署平台给的地址。
4. HTTPS：部署平台自动签发。

约束：先给 Vercel 方案（免备案能先跑起来），国内方案等备案号下来再切。

验收：访问 https://www.ouu365.com/ 能打开官网，首屏 LCP < 2s。
```

---

### M6 · 填图（人工 + 模型辅助）

这步主要靠你提供素材，模型只负责替换占位：
- 截图：拍插件各功能截图 → 放 `public/screenshots/` → 让模型把对应 `<!-- SCREENSHOT -->` 替换成 `<img>`。
- OG 封面：可让豆包专家版（多模态）或即梦生成 1200×630。
- 二维码：你提供 → 放 `public/qr/` → 模型替换占位。

---

## 4. 三款模型的免费额度（⚠️ 需核实）

> 我无法联网核实 2026-07 最新政策，以下是已知趋势，**用前到官网确认**：

| 模型 | 网页版 | API | 备注 |
|---|---|---|---|
| DeepSeek | 免费 | 按量计费，极便宜（百万 token 约几元） | 网页版够日常用；API 接 IDE 最划算 |
| 豆包 | 免费（专家版写作/代码不同模式） | 有免费额度 | Trae 内置，免配置 |
| Kimi | 免费 | 有免费额度 | 长上下文是强项，编码略弱于 DeepSeek |

**省钱策略**：日常写代码用 DeepSeek 网页版（免费）+ Trae（免费）；需要 API 接 IDE 时充 10 元 DeepSeek 能用很久。

---

## 5. Kimi 的特殊用法（任务分解器）

DeepSeek 上下文（128K）虽大，但喂整份 PRD + 多轮对话后容易忘前面的组件约定。用 Kimi 先做一次"任务分解"能避免：

```
（在 Kimi 里，上传 prd.md）
你是架构师。读这份官网 PRD，输出一份「组件接口清单」：
- 列出所有要实现的 Vue 组件（名字 + props + 用在哪个 section）
- 列出所有 CSS 变量 token（名字 + 值）
- 列出所有占位符（类型 + 位置）
- 给出文件目录树
不要写实现代码，只要清单。这份清单我会喂给 DeepSeek 当开发约束。
```

把 Kimi 输出的清单存成 `docs/component-spec.md`，后续每次给 DeepSeek 喂 prompt 时 `@component-spec.md` 一起引用，组件命名和接口就不会漂。

---

## 6. 避坑清单

| 坑 | 对策 |
|---|---|
| 一次性让生成整个官网 → 丢 section、风格漂 | 严格按 M1→M6 分阶段，每阶段验收 |
| 模型自由发挥文案 → SEO 关键词丢失 | prompt 里反复强调"用 PRD 原文，H3 不得改写" |
| 商店链接编了假 URL | 反复强调占位，URL 用 PLACEHOLDER |
| 模型忘了前面组件名 | 用 Kimi 先出组件清单，每次 @引用 |
| 配色漂（一会青一会蓝） | tokens.css 一次定死，组件只用变量不用 hex |
| 暗色模式偷偷加了 | 明确说 V1 仅浅色，不写 dark: 类 |
| emoji 当图标 | 强制 lucide-vue-next，prompt 里写明禁止 emoji |
| 构建报错不知道哪阶段坏的 | 每阶段结束 `pnpm docs:build` 跑一次，绿了再下一步 |

---

## 7. 推荐执行顺序（总结）

1. **环境**：建 `tab-master-website` 项目，拷入 PRD，用 Trae 打开目录
2. **可选预热**：Kimi 吃 PRD → 输出组件清单存 `docs/component-spec.md`
3. **M1→M6**：每阶段复制本文档对应 prompt 到 DeepSeek，验收后进下一步
4. **填图**：你提供截图/二维码，让模型替换占位
5. **部署**：先 Vercel 跑起来，备案后切国内 CDN

预计总工时 4-6 小时（不含填图），产出完整可用官网。

---

> 下一步：你定走路径 A（Trae）还是 B（Cursor+API），我可以帮你把对应 IDE 的 DeepSeek 配置步骤也写出来。
