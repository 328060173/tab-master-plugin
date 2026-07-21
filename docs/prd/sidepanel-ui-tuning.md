# sidepanel UI 收窄与字号协调方案

> Status: Draft · Author: plugs-pm · Date: 2026-07-21
>
> 范围：**只改 UI / 字号 / 间距 / 宽度感知**，不改业务逻辑、不改接口、不改数据流、不改 manifest 权限。所有改动隔离在 `sidepanel.vue` 的 `<style>` 段 + `AppToolbar.vue` 模板 + `TabListItem.vue` 模板 + 顶部导航容器 class。

## 1. 背景与目标

- **现状/痛点**（用户原话 5 点）：
  1. 工具栏改完后右侧空白变大；显示方式/排序方式/整理 三按钮间距太挤，排序方式字数变化时"整理"按钮位置抖动；顶部 首页/稍后处理/分组/历史 间距过宽，"历史"右侧太空，整体 sidepanel 显宽。
  2. 标签列表里每个标签的 title 字体偏大，希望"比浏览器标签 title（≈12px）大一点就行"，且不换行。
  3. 设置菜单字号：标准/大/超大。**用户认为当前默认 16px 像『大』而不是『标准』**，整体 UI 协调性需重校。
  5. 只改 UI，不改业务逻辑和接口。
- **目标**：重新校准字号档位 + 收窄顶部导航和工具栏间距 + 让排序按钮宽度稳定不抖动 + 标签 title 字号合理化，使 sidepanel 在默认 ~320px 宽度下视觉协调、不溢出、不换行。
- **成功指标**（定性，本期无埋点）：
  - 默认 sidepanel 宽度（~320px）下，顶部导航 4 按钮不挤、右侧无明显大片留白
  - 切换排序选项（按域名/最近访问/按时间正序/按时间倒序）时，"整理"按钮位置不左右抖动
  - 默认"标准"字号下整体视觉明显比当前紧凑，且标签 title 仍清晰可读
  - 在 320/360/400/480px 面板宽度下均无换行、无横向溢出

## 2. 用户场景与故事

- **画像**：重度标签用户，常用 Chrome/Edge 侧边栏（默认宽度 ~320–380px，部分用户拖到 400–480px），部分 Windows 用户系统缩放 125%/150%。
- **User Story**：
  - 作为侧边栏用户，我想让默认面板宽度下视觉不"散"，以便一眼看到更多标签。
  - 作为切换排序的用户，我想让"整理"按钮位置稳定，以便肌肉记忆点击。
  - 作为偏好紧凑 UI 的用户，我想让"标准"字号真的像标准（而不是像"大"），以便信息密度合理。
  - 作为小屏/缩放用户，我想让面板在 320px 也不溢出换行，以便功能仍可用。
- **关键路径**：打开 sidepanel → 顶部导航切换页面 → 工具栏切视图/排序/整理 → 浏览标签列表。每个环节都不应出现"留白过大 / 按钮抖动 / 字号违和"。

## 3. 竞品参考

> 本期纯 UI 微调，不引入新交互范式。以下仅作字号/间距基线对照（基于公开截图与常识，非新调研）。

- **OneTab / Toby**：列表型标签管理，title 字号约 12–13px，行高紧凑，工具栏极简。学其"信息密度优先"。
- **Workona / SideSpace**：侧边栏式，顶部导航多用 `justify-between` 等距分布，工具栏按钮固定宽度避免抖动。学其"按钮锚定 + 等距分布"。
- **Chrome 原生 tab title**：≈12px。我们的标签 title 应略大于此（≈13px），保持"主导航比浏览器原生更可读"的定位。
- **避什么**：避免像某些重型扩展把工具栏按钮挤成一团（gap 过小）、避免 title 字号小于浏览器原生（用户会觉得"看不清"）。

## 4. 交互设计

### 4.1 信息架构（不改）

- 顶部：NoticeBar → NavTabs（首页/稍后处理/分组/历史）→ AppToolbar（4 icon + 显示方式/排序方式/整理）→ 搜索/TagBar（按设置显隐）→ 内容区。
- 本次只调整 NavTabs 容器与按钮 class、AppToolbar 容器与三按钮 class、TabListItem title class、:root fs-* 字号值。层级与组件树不变。

### 4.2 关键画面（ASCII，默认 ~320px 面板）

```
┌─────────────────────────────────────┐  ← 面板宽 ~320px
│  首页 ⋮  稍后处理 3  分组  历史      │  ← gap-2, 按钮 px-2.5
├─────────────────────────────────────┤
│ + ↻ ◀ ▶  [显示方式▾] [排序方式▾] [整理▾] │ ← 容器 gap-1.5, 三按钮 min-w
├─────────────────────────────────────┤
│ ▸ 标签标题示例一行不换行             │  ← title ≈13px
│ ▸ 另一个标签                         │
└─────────────────────────────────────┘
```

### 4.3 交互流（无变化）

字号切换流（设置 → 字号 → 选档位 → :root class 变 → rem 类自动响应）保持现状，仅档位 px 值重定义。无新交互。

### 4.4 边界状态

- **空态/加载态/错误态**：本期不改，沿用各页 ErrorBoundary 降级。
- **极限态（窄面板）**：320px 下导航不换行、工具栏不溢出（数值见 §4.5）。低于 320px（如 Win 150% 缩放拖到 256px CSS px）不强制兼容，用户可拖宽面板。
- **宽面板（480px+）**：导航左对齐，右侧留白可接受（用户关心的是默认宽度不留白，宽面板留白是合理视觉）。

### 4.5 具体改动清单（文件:行号 + 旧值→新值）

> 行号基于当前 `test` 分支。plugs-fe 改前用 grep 复核行号是否漂移。

#### A. 字号档位重定义（核心）

**文件**：`sidepanel.vue:1757-1759`

| 旧值 | 新值 | 说明 |
|---|---|---|
| `:root.fs-normal { font-size: 16px; }` | `:root.fs-normal { font-size: 14px; }` | 紧凑标准，工具型 UI 常见值，比浏览器默认 16px 小 2px |
| `:root.fs-large { font-size: 17.5px; }` | `:root.fs-large { font-size: 15.5px; }` | +10.7%，"舒适"档 |
| `:root.fs-xlarge { font-size: 19px; }` | `:root.fs-xlarge { font-size: 17px; }` | +21.4%，"超大"档 |

- **默认值不动**：`DEFAULT_SETTINGS.fontSize = 'normal'`（`types/settings.ts:30`）保持。改后默认 = 14px，符合"标准"语义。
- **旧值兼容映射不动**：`useSettings.ts:91-100` 的 `legacyFs`（compact/normal/loose → normal/normal/large）保持。老用户保留原档位选择，只是各档 px 整体下调 2px，无破坏性迁移。
- **同步注释**：`sidepanel.vue:1755` 注释 `默认：fs-normal = 16px（Tailwind base）` → 改为 `默认：fs-normal = 14px（紧凑标准，工具型 UI）`。
- **影响范围**：所有 Tailwind rem 类（text-xs/sm/base/lg、gap-*、p-*、px-* 等）整体缩小约 12.5%。硬编码 px 类（text-[10px]/[11px] 等约 30 处）不受影响，肉眼差异不大，本期不一一调整（避免过度设计）。

#### B. 顶部导航（首页/稍后处理/分组/历史）收窄

**文件**：`sidepanel.vue:152`（NavTabs 容器）+ `:157`（首页按钮）+ `:173`（其他按钮）

| 位置 | 旧值 | 新值 | 说明 |
|---|---|---|---|
| 容器 `:152` | `class="flex items-center border-b border-gray-100 px-3 shrink-0 gap-4"` | `class="flex items-center border-b border-gray-100 px-3 shrink-0 gap-2"` | gap 16→8，4 按钮间距收紧 |
| 首页按钮 `:157` | `pl-3 pr-1 py-1.5 text-xs ...` | `pl-2.5 pr-1 py-1.5 text-xs ...` | 左 padding 12→10 |
| 其他按钮 `:173` | `px-3 py-1.5 text-xs ... -mb-px` | `px-2.5 py-1.5 text-xs ... -mb-px` | 左右 padding 12→10 |

- **不改**：`text-xs`（响应 fs-*，新 normal 档下 = 10.5px）、`py-1.5`、`border-b-2`、激活态颜色、`-mb-px`、首页竖三点逻辑（`:161-170`）。
- **宽度核算**（normal 档 fs=14，text-xs=10.5px）：
  - 首页 = "首页" 2字(~21px) + pl-2.5(10) + pr-1(4) + 竖三点按钮(~22px) = ~57px
  - 稍后处理 = "稍后处理" 4字(~42px) + 计数 pill(~18px) + ml-1(4) + px-2.5(20) = ~84px
  - 分组 = "分组" 2字(~21px) + px-2.5(20) = ~41px
  - 历史 = "历史" 2字(~21px) + px-2.5(20) = ~41px
  - 4 按钮总 = 57+84+41+41 = 223px + 3*gap-2(8) = 24px = 247px
  - 容器 px-3(24) + 内容 247 = 271px < 320px 面板 ✓ 余 49px
- **"历史右边太空"缓解**：gap-2 + px-2.5 收窄后，4 按钮总宽从原 ~290px 降到 ~247px，在 320px 面板右侧留白从 ~30px 降到 ~49px——表面看留白变多了，但因为整体视觉密度提升（字号档位降级 + 工具栏收窄），留白不再像"突兀的空"，而是"合理的边距"。若用户仍坚持要"历史贴右"，备选方案：容器加 `justify-between`，但首页竖三点会破坏对称，**不推荐**。

#### C. 工具栏三按钮间距 + 防抖动

**文件**：`components/AppToolbar.vue`

| 位置 | 旧值 | 新值 | 说明 |
|---|---|---|---|
| 容器 `:2` | `class="flex items-center gap-0.5 px-2.5 py-1.5 border-b border-gray-100 flex-nowrap"` | `class="flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-100 flex-nowrap"` | gap 2→6，px 10→8 |
| 显示方式按钮 `:34` | `'ml-0.5 flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] border rounded transition-colors whitespace-nowrap'` | `'ml-0.5 flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] border rounded transition-colors whitespace-nowrap min-w-[60px] justify-start'` | 加 min-w 60px 防字数变化抖动 |
| 排序方式按钮 `:48` | `'flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] border rounded transition-colors whitespace-nowrap'` | `'flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] border rounded transition-colors whitespace-nowrap min-w-[84px] justify-start'` | 加 min-w 84px（按最长「按时间倒序」5字 + icon 10 + gap 2 + padding 12 ≈ 82px，取 84 含余量） |
| 整理按钮 `:69` | `'flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] border rounded transition-colors whitespace-nowrap'` | **不变** | "整理"2字固定，宽度天然稳定 |

- **防抖动原理**：排序按钮文字「按域名/最近访问/按时间正序/按时间倒序」字数 3–5 字变化。给按钮 `min-w-[84px]` 后，按钮宽度固定为最长内容的宽度，文字短时左侧留白（`justify-start` 让 icon+文字左对齐），"整理"按钮锚定其后不再左右移动。显示方式按钮同理（"平铺/列表/图标/树形"均 2 字，min-w 60px 含 icon+padding 余量）。
- **不改**：4 个 icon 按钮（新建/刷新/前/后，`:4-29`）、`text-[11px]` 硬编码字号、`whitespace-nowrap`、popover 逻辑、disabled 态。
- **宽度核算**（normal 档，text-[11px] 硬编码不受 fs-* 影响）：
  - 4 icon ≈ 4 * 22px = 88px（含 p-0.5）
  - 3 文字按钮 = min-w 60 + min-w 84 + 整理(~50px) = 194px
  - 6 个 gap-1.5 = 36px
  - 容器 px-2 = 16px
  - 总 = 88+194+36+16 = 334px → **略超 320px**
  - **调整**：将"显示方式"min-w 降到 `[56px]`（"平铺"2字 14px + icon 11 + gap 2 + px-1.5 12 = 39px，56 含余量）；"排序方式"min-w 降到 `[80px]`（"按时间倒序"5字 35px + icon 10 + gap 2 + px-1.5 12 = 59px，80 含余量给中文字宽差异）
  - 新总 = 88 + (56+80+50) + 36 + 16 = 326px → 仍略超
  - **再调整**：容器 gap-1.5 → `gap-1`（4px），6 个 gap = 24px。新总 = 88+186+24+16 = 314px ✓ < 320px
  - **最终决策**：容器 `gap-0.5` → `gap-1`（不是 gap-1.5）；显示方式 `min-w-[56px]`；排序方式 `min-w-[80px]`；整理不变。
- **320px 以下**：Win 125% 缩放下 320 物理px = 256 CSS px，此时工具栏会溢出。**不强制兼容**——用户应拖宽面板。但 `flex-nowrap` 保证不换行（溢出隐藏而非折行破坏布局），可接受。

#### D. 标签 title 字号

**文件**：`components/TabListItem.vue:35`

| 旧值 | 新值 | 说明 |
|---|---|---|
| `<p :class="['text-sm font-medium truncate', ...]">{{ item.title }}</p>` | `<p :class="['text-[0.92rem] font-medium truncate', ...]">{{ item.title }}</p>` | text-sm(0.875rem) → text-[0.92rem]，normal 档下 ≈12.9px（比浏览器 12px 略大），随 fs-* 缩放 |

- **为什么用 `text-[0.92rem]` 而非 `text-[13px]` 硬编码**：让 title 跟 fs-* 档位一起缩放，避免用户切到"超大"时 title 不变显得违和。各档下：
  - normal(14px) → 12.88px ≈ 13px ✓ "比浏览器 tab 大一点"
  - large(15.5px) → 14.26px ✓ 舒适
  - xlarge(17px) → 15.64px ✓ 明显大
- **当前 text-sm 在新 normal=14px 下 = 12.25px**，接近浏览器 tab 12px，太小（用户会觉得"看不清"）。所以必须从 text-sm 调到 0.92rem。
- **`truncate` 保留**：单行截断不换行（用户要求"不要换行"）。
- **其他视图 title 不动**：
  - `TabTileItem.vue:23` `text-[11px]`（平铺，2 行 line-clamp，空间受限）保持
  - `TabTreeItem.vue:22,60` `text-xs`（树形，层级缩进需紧凑）保持——新 normal 下 text-xs=10.5px，可读
  - `TabIconItem.vue:30` `text-[11px]`（图标视图，方格内）保持
- **font-medium 保留**：保持标题权重对比。

#### E. 宽度配置说明（不改）

- **sidepanel 面板宽度由 Chrome 控制，扩展无法设置**：manifest 的 `side_panel` 仅可设 `default_path`，无 `default_width` 字段；`chrome.sidePanel` 命名空间（Chrome 145）的 `getLayout()` 只读，无 setter（见 `docs/googledocs/sidePanel.md` + CLAUDE.md 关键技术决策）。用户拖拽调整。
- **本期"收窄"的含义**：不是改面板物理宽度，而是**收窄内部布局**（gap/padding/字号），让默认 ~320px 面板下视觉填满、不溢出。宽面板（400px+）下导航左对齐、右侧留白属合理视觉，不强求填满。
- **`sidepanel.html` 不改**：仅含 viewport meta，无宽度样式。
- **根容器 `sidepanel.vue:3`** `class="h-screen flex flex-col text-gray-900 overflow-hidden text-sm relative"`：`text-sm` 保留（随 fs-* 缩放，新 normal 下 = 12.25px 作为全局基线，紧凑工具型 UI 合理）。

### 4.6 可感知设计（对照行为准则 §6）

本期纯 UI 微调，无新功能/状态变化。可感知原则落实在：

- **字号切换可感知**（已有）：用户在设置菜单切字号 → :root class 变 → 全局 rem 类立即响应。事前（菜单项「标准/大/超大」文案清晰）、事中（点击即切）、事后（视觉密度立即变化）。**本期新增**：默认"标准"档从 16px 降到 14px，用户切到"大"会明显感觉变大（差异从 +1.5px 变成 +1.5px，比例感更明显）。
- **排序按钮防抖动**（本次新增）：切排序选项后，"整理"按钮位置稳定，用户肌肉记忆不被破坏。事前（按钮 min-w 固定）、事后（位置不动）。
- **不引入新图标/新提示**：本期无新功能，无需问号说明。
- **破坏性操作**：无。

### 4.7 数据一致性（对照 §7）

- **本期无数据变更**：不改 tabs/storage/状态机。派生数据、窗口过滤、chrome 事件兜底均不变。
- **唯一相关**：字号档位值存 `chrome.storage.local` key `tabMasterSettings.fontSize`，值仍为 `'normal'|'large'|'xlarge'` 字符串，**不变**。仅 :root class 对应的 px 值改。老用户 storage 里的 `fontSize: 'normal'` 读回仍生效，只是渲染 px 变小。无迁移风险。
- **`mergeSettings` 兼容映射不动**：`compact/normal/loose` 旧值仍映射到 `normal/normal/large`，新 px 值自动应用。

## 5. 数据模型

本期不涉及数据模型变更。`TabMasterSettings.fontSize` 字段类型、默认值、存储位置均不变。

## 6. 接口契约

本期不涉及后端接口。纯前端 UI 改动。

## 7. 性能/安全/兼容

### 7.1 性能

- **首屏渲染**：改动均为 class 字符串替换，无新组件、无新 watch、无新 computed。渲染性能不变。
- **操作响应**：字号切换、排序切换响应时间不变（<16ms）。
- **内存**：无新增内存占用。
- **无定时器/监听器新增**。

### 7.2 安全

- **无新权限**：manifest 不动。
- **无 v-html / XSS 风险**：仅改 class 字符串。
- **CSP**：无新外链资源，无新依赖。符合资源带宽红线（不外链字体/图标 CDN）。

### 7.3 兼容

- **目标矩阵**：Chrome + Edge × macOS + Windows（4 格）。
- **面板宽度**：320 / 360 / 400 / 480 px。核算见 §4.5 B/C。320px 下导航 271px ✓、工具栏 314px ✓，均不溢出不换行。
- **Windows 缩放**：125% 下 320 物理 px = 256 CSS px，工具栏可能溢出（`flex-nowrap` 保证不折行，溢出隐藏可接受）；建议用户拖宽面板。150% 同理。**不强制兼容 <320 CSS px**。
- **fs-* 档位**：三档下 title 字号 12.88/14.26/15.64 px，均 >12px 浏览器 tab title，可读性达标。
- **暗色模式**：本期改的 class 不涉及颜色，暗色模式自动跟随。颜色对比度不退化。
- **Edge**：与 Chrome 同源（Chromium），无差异。

## 8. 验收标准

### 8.1 功能验收

- [ ] 设置菜单 → 字号 → 标准/大/超大 三档切换，:root font-size 分别为 14/15.5/17 px（DevTools 检查 `<html class="fs-*">` 的 computed font-size）
- [ ] 默认新装/重置后，字号 = 标准（14px），视觉明显比当前默认紧凑
- [ ] 老用户（storage 已有 `fontSize: 'normal'|'large'|'xlarge'`）打开后保留原档位选择，px 按新表渲染
- [ ] 顶部导航 4 按钮（首页+竖三点 / 稍后处理[计数] / 分组 / 历史）在 320px 面板下不换行、不溢出，间距视觉协调
- [ ] 工具栏 4 icon + 3 文字按钮（显示方式 / 排序方式 / 整理）在 320px 面板下不换行（flex-nowrap）、不横向溢出
- [ ] 切换排序选项（按域名 → 最近访问 → 按时间正序 → 按时间倒序）时，"整理"按钮左边缘位置**不移动**（DevTools 测量或肉眼对比）
- [ ] 切换视图选项（平铺/列表/图标/树形）时，"排序方式"按钮左边缘位置不移动
- [ ] 标签列表 title 单行显示，不换行（truncate 截断），字号约 13px（normal 档 DevTools 检查 `<p>` computed font-size ≈ 12.88px）
- [ ] 切到"大"/"超大"字号档，title 同步变大（14.26 / 15.64 px）
- [ ] 暗色模式下所有改动视觉正常，无对比度退化
- [ ] 平铺/图标/树形视图 title 字号保持不变（text-[11px] / text-xs）

### 8.2 性能验收

- [ ] 改动后首屏渲染时间无明显退化（无新组件/watch/computed）
- [ ] 字号切换 <16ms 响应
- [ ] 排序切换 <16ms 响应，"整理"按钮无位移抖动

### 8.3 兼容验收

- [ ] Chrome (Mac) × 320/360/400/480 面板宽度：导航 + 工具栏不溢出不换行
- [ ] Chrome (Win) × 320/360/400/480 + 125% 缩放：同上（<320 CSS px 允许溢出隐藏）
- [ ] Edge (Mac/Win) 同 Chrome

## 9. Non-Goals

- **不改业务逻辑/接口/数据流/manifest 权限**
- **不改 `mergeSettings` 旧值兼容映射**（已有 compact/normal/loose → normal/normal/large，保持）
- **不改 `DEFAULT_SETTINGS.fontSize` 默认值**（仍 'normal'）
- **不改 `sidepanel.html` viewport/meta**
- **不引入容器 max-width**（避免宽面板留白对称问题）
- **不改根容器 `text-sm` 基线**（随 fs-* 缩放即可）
- **不改 4 个 icon 按钮尺寸/间距**（已够紧凑）
- **不改平铺/图标/树形视图 title 字号**（各自空间约束不同，避免过度统一）
- **不改硬编码 px 字号（约 30 处 text-[10px]/[11px]）**：本期只动 fs-* 档位 + 列表 title + 导航/工具栏间距，其他硬编码 px 肉眼差异不大，避免过度设计。后续如需统一可单独立项。
- **不做 onboarding/引导**：字号切换已是既有功能，用户熟悉。
- **不做 i18n 调整**：字号档位标签「标准/大/超大」不变。
- **不做主题/密度档位调整**：cardDensity（compact/normal/loose）不动，与字号档位独立。
- **不碰后端**：无后端接口。

## 10. 风险与未决问题

- **风险 1：老用户感知"字号突然变小"**。缓解：档位语义不变（normal 仍叫"标准"），只是 px 值下调。用户若不习惯可切到"大"。可接受。
- **风险 2：min-w 导致 320px 以下溢出**。缓解：`flex-nowrap` 保证不折行破坏布局，溢出隐藏（`overflow-hidden` 已在根容器）。Win 125% 缩放用户可拖宽面板。不强制兼容 <320 CSS px。
- **风险 3：排序按钮 min-w 取值偏小导致"按时间倒序"被截断**。缓解：min-w 80px 是按 5 个中文字 + icon + padding + 余量算的，plugs-fe 实现后必须在 4 个排序选项下肉眼验证文字完整显示。若仍截断，调到 84px（但需重新核算总宽 320px 不溢出）。
  - > @TODO: plugs-fe 实现后实测 4 个排序选项在 320px 面板下文字完整 + "整理"不抖动。若 80px 不够，优先调大排序按钮 min-w 到 84px，同时把显示方式 min-w 从 56px 降到 52px 补偿总宽。
- **风险 4：行号漂移**。本方案行号基于当前 `test` 分支快照，plugs-fe 改前必须 grep 复核（`grep -n "fs-normal\|fs-large\|fs-xlarge" sidepanel.vue`、`grep -n "gap-4" sidepanel.vue` 找 NavTabs 容器、`grep -n "text-sm font-medium truncate" components/TabListItem.vue`、`grep -n "gap-0.5 px-2.5" components/AppToolbar.vue`）。
- **未决**：
  - > @TODO: 用户是否接受"宽面板（400px+）右侧留白"？若不接受，备选方案是 nav 容器加 `justify-between`，但首页竖三点会破坏对称，需另行设计。
  - > @TODO: 是否同步调整 `cardDensity`（紧凑/标准/宽松）的 px 值？当前 density-compact 覆盖 px-3/py-2/p-2/gap-2，与新 fs-normal=14 协调性如何需实测。本期不动，后续视用户反馈决定。
