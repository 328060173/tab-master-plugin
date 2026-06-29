# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Development server with hot reload (builds to build/chrome-mv3-dev/)
pnpm build      # Production build
pnpm package    # Package for Chrome Web Store distribution
```

No test or lint scripts are configured. Prettier (with `@ianvs/prettier-plugin-sort-imports`) handles formatting — config in `.prettierrc.mjs`.

## Architecture

This is a Chrome MV3 browser extension built with [Plasmo](https://docs.plasmo.com) (v0.90.5) and Vue 3 + TypeScript.

Plasmo maps file locations to extension roles automatically:

| File/Dir | Extension role |
|---|---|
| `popup.vue` | Browser action popup |
| `contents/` | Content scripts injected into pages |
| `background.ts` (if added) | Service worker |

**Content scripts** use Plasmo's naming convention:
- `contents/*.vue` with export `config` defining `matches` determines injection targets
- `plasmo-inline` / `plasmo-overlay` config types control how Vue components mount into pages

The extension has `host_permissions: ["https://*/*"]`, so content scripts can run on any HTTPS page.

Vue components use `<script setup lang="ts">` SFC style. The popup entry (`popup.vue`) uses `defineOptions({ prepare(app) {} })` for plugin registration — use this hook to install Vue plugins globally.

## Developer Profile & Principles

**沟通语言：** 中文（所有回复、注释、文档均使用中文）

**Owner:** 10年+全栈经验，近6年专注浏览器插件开发，主导过5款日活10万+的Chrome插件，累计服务用户超500万。

**技术决策第一原则：**
1. 用户价值优先
2. 长期可维护性优先
3. 拒绝过度设计，拒绝为短期便利牺牲代码质量

**技术偏好：**
- TypeScript 严格模式，完整类型定义，禁止滥用 `any`
- Vue 3 Composition API + Pinia 状态管理
- Plasmo 框架为主，熟悉 WXT
- 精通全部 Chrome API（tabs、storage、sidePanel、contextMenus 等）
- 跨浏览器兼容（Chrome/Edge/Firefox/Safari）

**代码质量要求：**
- 权限最小化原则
- CSP 策略、XSS/CSRF 防护，敏感数据加密存储
- ESLint + Prettier 规范

## Project Goal

**浏览器标签大师** — 帮助用户高效管理浏览器标签页。

## 当前开发进度（2026-06-28）

> **明天开工 checklist**：
> 1. `git status` 看未提交改动一览（详见 §「当前未提交的改动」）
> 2. `pnpm dev:safe` 启动 + 浏览器装入 `build/chrome-mv3-dev/` + `chrome://extensions` reload
> 3. **优先做** 4 格矩阵实测（Chrome+Edge × Mac+Win）→ 重点验今天改动的：主题/字号/密度生效、聚焦问号弹框关闭三种路径、清理菜单 Confirm/Detect 两种 Dialog、域名分组归并
> 4. 测通后跟用户确认是否 commit（红线：不自动 commit）
> 5. 然后再开新功能

### 2026-06-28 新增完成 ⭐

**bug 修复（紧急，优先于新功能）**
- `components/GroupItem.vue:32` mustache 里塞 `{{ <Eye /> : <EyeOff /> }}` 触发 babel `Unexpected token (1:17)`，改用 `v-if/v-else` 渲染组件
- `components/HeaderMenu.vue` 用了 `v-click-outside` 但没 `import vClickOutside` → `Failed to resolve directive: click-outside` warn
- `components/TabListItem.vue / TabTileItem.vue / TabContextMenu.vue` 模板里写 `chrome.tabGroups.TAB_GROUP_ID_NONE`，Vue 模板上下文不暴露 `chrome` 全局，导致整段 v-for 渲染中断（只剩固定标签）。在 `useTabGroups.ts` 导出常量 `TAB_GROUP_ID_NONE`，模板用它替代
- 详见记忆 [[lesson-vue-mustache-no-components]]、[[lesson-vue-setup-pitfalls]]

**域名识别 + 分组整改**
- `lib/registrableDomain.ts` — eTLD+1 提取，内置 30 条复合后缀清单（CN/HK/TW/UK/JP/AU/KR），覆盖 99% 国内场景
- `lib/domainNames.ts` 改最长后缀回溯查找：`buy.cloud.tencent.com` → 自动命中"腾讯云"
- `lib/sortUtils.ts` 按域名排序/分组用 eTLD+1 当 key：`www.volcengine.com` / `console.volcengine.com` 自动归一组
- `config/domain-config.json` 补 8 条：bigmodel.cn → 智谱、chrome.com → Chrome、tencent.com → 腾讯（集团兜底）、bytedance.com / alibaba.com / qq.com 等

**清理菜单完整实现（5 个 P0 全部到位）**
- 完整 PRD：`docs/prd/cleanup-toolbar.md`
- `components/ConfirmDialog.vue` — 通用二次确认弹窗（danger 态变红、esc/遮罩关闭）
- `components/DetectReviewDialog.vue` — 检测后预览清单，duplicates / unused 双 mode 共用骨架，阈值下拉、全选/勾选关闭、"建议保留"标记
- `composables/useCleanup.ts` — `detectDuplicates / detectUnused / getEffectiveAccessTime / formatUnusedDuration` + `UNUSED_THRESHOLDS` 常量（1天/3天/7天/30天）
- `types/tab.ts` 加 `lastAccessed?: number`
- `background.ts` 加 `onActivated` 监听 + 1s debounce 写 `tabLastAccessedMap`（Chrome <121 兜底；121+ 走原生 `tab.lastAccessed`）
- `useTabManager.ts` mapTab 双路读 lastAccessed + storage.onChanged 跨页同步 + onTabActivated 即时刷新本会话
- `sidepanel.vue` 5 个清理事件全部走 confirm/detect dialog，操作后 toast 反馈，提示 Ctrl+Shift+T 恢复
- `AppToolbar.vue` 文案分组：「直接关闭 / 检测后选择」；已冻结图标改 Snowflake
- 关键决策（用户已拍板）：lastAccessed 双路兜底 / 撤销只提示 Ctrl+Shift+T / 重复判定 URL 完全相同

**设置面板全面整改（6 类问题）**
- `types/settings.ts` 删 `language`；fontSize enum 改 `normal/large/xlarge`（"标准/大/超大"，默认 normal）；theme 默认改 `system`
- `useSettings.ts` 加 mergeSettings 兼容迁移（旧 `compact/loose` → `normal/large`），删 language 相关代码
- `sidepanel.vue` 全局 `<style>` 落地字号 + 暗色：
  - `:root.fs-normal/large/xlarge { font-size: ... }` —— Tailwind rem 类自动响应
  - `:root.density-compact/loose` 覆盖卡片 `px-3/py-2/p-2/gap-2`，让密度真有视觉差
  - `html.dark` 覆盖核心 Tailwind 类（bg-white / bg-gray-50/100 / text-gray-*/border-gray-* / hover:bg-gray-*），不去 31 个组件逐个加 dark: 前缀
- `components/HeaderMenu.vue` 完全重做：
  - 删界面语言、显示位置改灰显（chrome.sidePanel API 不支持位置控制）
  - 主题/字体改 hover 二级浮层（向左展开，避免越界），当前选中右侧打勾 ✓
  - 触发按钮根据 open 切换激活态（深底亮字）
  - 「更多设置...」走 `chrome.runtime.openOptionsPage()` 开新 tab
  - 去掉 `<style scoped>`，全部用 Tailwind 写在 template 上（让全局 .dark 规则能正确匹配，scoped 会加 [data-v-xxx] 破坏匹配）
- `options.vue`（新增） — Plasmo 自动注册 `options_page`（`open_in_tab: true`），放显示偏好（默认视图/默认排序/卡片密度/字体族）+ 后端占位 + 关于
- `sidepanel.vue` 聚焦问号定位修复：`getBoundingClientRect()` + clamp 到视窗，避免 sidepanel 窄时弹框右半部分跑出窗外
- 删 `components/SettingsDialog.vue`（420px 写死、超出 sidepanel）+ 删 sidepanel 接线 + 删 i18n 字典里的 language / 旧 fontSize labels
- `AppToolbar.vue` 视图/排序/清理按钮加激活态（蓝边+蓝底）；批量按钮原已有

**聚焦问号弹框点空白处关不掉（最后修的）**
- `components/FocusHelpBubble.vue` 完全重写关闭逻辑：不用通用 `v-click-outside`（mounted timing + click 事件被吞两个问题），改用 `watch open + nextTick + document.addEventListener('mousedown', ...)`，三层保险：mousedown 比 click 早 + nextTick 避开同帧自关 + `data-focus-help-trigger` 排除问号按钮本身（让按钮自己 toggle 生效）
- `sidepanel.vue` 两个问号按钮加 `data-focus-help-trigger="true"` 属性
- `openHelpBubble` 加 toggle 守卫：第二次点同一按钮也能关
- 详见记忆 [[lesson-vue-setup-pitfalls]] 第三类坑（待后续整理）

**文档建设**
- `docs/prd/cleanup-toolbar.md` — 清理菜单完整 PRD（痛点 / 业界对标 Tab Wrangler、OneTab、The Great Suspender / 交互 / 技术 / 边界 / 测试用例）
- 记忆库新增：[[lesson-css-class-without-rules]]、[[lesson-vue-mustache-no-components]]
- 记忆库更新：[[lesson-vue-setup-pitfalls]] 把模板全局访问、TS 类型断言纳入

### 2026-06-27 完成（历史）

**聚焦模式（已重做）**
- `composables/useFocusMode.ts` — **重写**：用 `chrome.tabGroups.update({collapsed:true})` 把非聚焦标签折叠到灰色「🌙 已隐藏」分组，**不**再用实验 API `chrome.tabs.hide`
- `components/FocusBanner.vue` / `FocusHelpBubble.vue` / `FocusSelectBar.vue` — 聚焦模式 UI 三件套
- 监听灰色分组手动展开 → 自动重新折叠；监听激活灰色组内标签 → 自动加入聚焦集合

**分组功能（全新）**
- `composables/useTabGroups.ts` — 分组数据层，`windowId: WINDOW_ID_CURRENT` 强约束，过滤聚焦模式的「🌙 已隐藏」分组
- `components/GroupListPage.vue` / `GroupItem.vue` / `CreateGroupDialog.vue` / `GroupBadge.vue` — 分组列表页 + 单项 + 新建弹窗 + 卡片分组徽章
- 标签卡片显示分组颜色条 + 名称小标签（TabListItem / TabTileItem）
- 右键菜单「移到分组」子菜单：新建/现有/移出
- 监听 `tabGroups.onCreated/onRemoved/onUpdated/onMoved` 与原生实时同步

**设置面板（全新）**
- `composables/useSettings.ts` — 集中管理设置，监听 `storage.onChanged` 跨页同步，应用主题/字号/字体/密度到 `<html>` class
- `components/SettingsDialog.vue` — 完整设置弹窗（显示设置 + 外观 + 关于）
- `components/HeaderMenu.vue` — **抽出的共享下拉菜单组件**，解决 sidepanel.vue 两套重复菜单问题
- `lib/i18n.ts` + `lib/locales/zh-CN.ts` / `en-US.ts` — i18n 骨架，缺失 fallback 中文
- `types/settings.ts` — TabMasterSettings 类型 + DEFAULT_SETTINGS
- 灰显项：登录/显示位置/云同步/快照 → disabled + tooltip「需要后端服务，敬请期待」
- Tailwind `darkMode: 'class'` 启用

**文档建设**
- `docs/prd/focus-mode.md`（v3）/ `tab-groups.md` / `settings-panel.md`
- `docs/reference/extension-vue-best-practices.md` — 11 章项目权威开发规范
- `docs/dev-workflow.md` — 完整 dev 流程手册
- `.vscode/settings.json` — Tailwind/CSS lint 配置

**dev 体验改进**
- `package.json`: 新增 `dev:safe` / `kill-dev` 脚本
- `scripts/build.js`: 自动 `pkill plasmo dev` 残留进程

### 项目基础设施（历史，按文件分类）

**入口文件：**
- `sidepanel.vue` — 主界面，包含 Header / 导航 / 工具栏 / 卡片列表 / 底部状态栏
- `newtab.vue` — 新标签页覆盖（双列布局）
- `background.ts` — Service Worker，设置 `openPanelOnActionClick: true`
- `popup.vue` — 已简化（不再使用，侧边栏替代）

**核心逻辑：**
- `composables/useTabManager.ts` — 对接真实 chrome.tabs API，监听 onCreated/onRemoved/onUpdated 实时更新；记录标签切换历史（`chrome.storage.session`，最多 50 条）用于向前/向后导航
- `composables/useTabStats.ts` — 标签状态统计
- `composables/useTabTree.ts` — 树形视图的父子关系追踪（骨架已建）
- `lib/sortUtils.ts` — 排序（按域名/时间正序/倒序）+ 按域名分组
- `lib/statusConfig.ts` — 状态配置
- `lib/domainNames.ts` — 内置 140+ 域名→品牌名映射（中文门户/电商/社交/协作/设计/开发/云服务等）
- `types/tab.ts` — TabItem / LaterItem / CustomTag 类型定义

**组件：**
- `components/TabTileItem.vue` — 平铺视图（激活状态：bg-blue-100 + 蓝色双边框）
- `components/TabListItem.vue` — 列表视图（激活状态：bg-blue-100 + 左侧蓝色竖线 + 加粗标题）
- `components/TabIconItem.vue` — 图标视图（激活状态：bg-blue-100 边框）
- `components/TabTreeItem.vue` — 树形视图（骨架，递归渲染父子标签）
- `components/ActionButtons.vue` — 操作按钮（稍后/复制/关闭）
- `components/FavIcon.vue` — 带失败回退的网站图标
- `components/StatusBadge.vue` — 状态徽章（仅显示：播放中/已静音/录制中/共享中/加载中/未保存表单/连接设备）
- `components/AppToolbar.vue` — 工具栏（视图下拉/排序/批量操作/清理/向前向后导航）
- `components/FooterStats.vue` — 底部状态栏（含图标，超出折叠为"更多"）
- `components/LaterList.vue` — 稍后处理列表（点击可打开对应标签）
- `components/LaterDialog.vue` — 稍后处理弹框（含操作提示语）
- `components/SearchBox.vue` — 搜索框（含 X 清空按钮）
- `components/SearchResults.vue` — 搜索结果（标题/URL 匹配字符高亮）
- `components/TagFilterPanel.vue` — 标记筛选浮层（悬浮在卡片上层，3列网格，多选筛选，添加/重命名标记，15字限制）
- `components/TagPicker.vue` — 卡片内标记选择器（添加/移除标记，存 chrome.storage.local）
- `components/StoragePanel.vue` — 稍后处理面板（独立组件）
- `components/TabNumber.vue` — 标签数角标
- `components/AppToolbar.vue` — 视图下拉（平铺/列表/图标/树形），选中高亮，localStorage 持久化

**已实现功能：**
- 平铺 / 列表 / 图标 / 树形（骨架）四种视图，下拉切换，选中高亮，localStorage 持久化
- 按域名分组 / 时间正序 / 时间倒序排序
- 固定标签单独显示在顶部
- 关闭标签（真实 chrome.tabs.remove）
- 激活标签（真实 chrome.tabs.update）；当前激活标签自动滚动到视图中央
- 稍后处理（存 chrome.storage.local，带备注，持久化；点击可重新打开标签）
- 搜索（标题/URL 实时过滤 + 匹配高亮 + X 清空）
- 批量选择 + 批量关闭
- 状态筛选（工具栏按钮）
- 实时监听标签变化
- 向前 / 向后标签切换历史（chrome.storage.session，最多 50 条）
- 标记（自定义 Tag）：卡片内添加标记，标记筛选浮层多选，持久化到 chrome.storage.local
- 导航标签：首页 / 稍后处理 / 分组（占位）/ 历史（占位）
- Header：聚焦模式按钮、设置下拉菜单（登录/主题/字体/语言/显示位置/云同步/快照，均为占位入口）
- 底部状态栏：13 种状态含图标，超出时显示"更多"折叠
- 域名分组标题显示品牌名（lib/domainNames.ts）

**待开发功能（明天 2026-06-29 继续）：**

🔥 **下次开工先做**

1. **浏览器 4 格矩阵实测**（拖到今天没做）
   - Chrome × macOS、Chrome × Win、Edge × Mac、Edge × Win
   - 重点：今天改动多 → 主题切深色后整界面是否真变深、字号档位切大/超大有无视觉差、卡片密度紧凑/宽松、聚焦问号弹框三种关闭路径（toggle / 点空白 / 点弹框内不关）、清理菜单 ConfirmDialog/DetectReviewDialog 各 case
2. **暗色模式深度精修**（折中方案的尾巴）
   - 当前用全局 CSS 覆盖 Tailwind 关键类（bg-white/text-gray-*/border-*），但少数组件用 `bg-red-50 / bg-amber-50 / text-purple-600` 等品牌色，深色对比度可能不够
   - 暂定策略：碰到一处改一处，不批量改 31 个组件
3. **i18n 翻译扩展**（CLAUDE.md 老待办）
   - 当前 locales 只覆盖 ~70 条文案（cleanup.* 新加了 28 条），但很多组件还硬编码中文
   - 优先级低于功能性新需求

**功能性 - 仍待开发（用户没明说优先级，等拍板）**
- **客服消息提醒**（需求文档第 7 节，未开发）—— 多个标签里识别哪个收到了客服消息
- **智能标签冬眠**（需求文档第 7 节，30 分钟不动自动 suspend，白名单）—— 跟今天的"检测长期未用"是不同心智模型，分开实现
- **快照功能**（需求文档第 8 节，会话快照 + 时间轴 + 一键恢复）—— 需要后端配合
- **AI 总结分析**（需求文档 TabHoverCard 子功能 + 自动归类）—— P1
- **历史记录页**（chrome.history API，导航已占位）
- 树形视图 4 项小精修（HoverCard 在树视图未绑定 / 虚拟滚动 / 崩溃恢复 / 右键菜单确认）—— 主线已能用
- 后端相关：登录账号 / 云同步（已灰显，等后端就绪）

**已知小问题（不紧急）**
- `lib/i18n.ts` 里 `(translations as any)[key]` 使用了 any（动态键访问，可改成 `Record<string, string>` 类型化）
- sidepanel.vue 顶部仍有重复结构（聚焦中 / 普通态 Header），HeaderMenu 已共享但 Header 主体本身没共享

**dev/QA 待办**
- 浏览器 4 格矩阵实测（见上 🔥 #1）
- 测试通过后 git commit（用户规矩：**不自动 commit，等明确指令**）

### 当前未提交的改动（开工前先确认）

工作目录里有大量未提交改动，覆盖：
- 配置：`package.json` / `tailwind.config.js` / `tsconfig.tsbuildinfo`
- 入口：`sidepanel.vue` / `background.ts`
- 新文件：`options.vue` / `composables/useSettings.ts` / `composables/useFocusMode.ts` / `composables/useTabGroups.ts` / `composables/useCleanup.ts` / `lib/i18n.ts` / `lib/locales/zh-CN.ts` / `lib/locales/en-US.ts` / `lib/registrableDomain.ts` / `lib/clickOutside.ts` / `types/settings.ts`
- 组件：`CreateGroupDialog.vue` / `FocusBanner.vue` / `FocusHelpBubble.vue` / `FocusSelectBar.vue` / `GroupBadge.vue` / `GroupItem.vue` / `GroupListPage.vue` / `HeaderMenu.vue` / `ConfirmDialog.vue` / `DetectReviewDialog.vue` / `TabContextMenu.vue` / `TabListItem.vue` / `TabTileItem.vue`
- 删除：`components/SettingsDialog.vue`
- 文档：`docs/prd/*.md` / `docs/reference/extension-vue-best-practices.md` / `docs/dev-workflow.md`

明天先 `git status` 检查 → 实测通过后再决定是否一次 commit 还是拆分多次提交。

### 关键技术决策
- 侧边栏位置由 Chrome 浏览器层控制，**扩展程序无法触发左右切换** — 2026-06-28 重新核实
  - 完整 `chrome.sidePanel` 命名空间（Chrome 145）方法：`getOptions / setOptions / getPanelBehavior / setPanelBehavior / open / close / getLayout / onOpened / onClosed`
  - **只有 `getLayout()` 是读位置（Chrome 140+），没有任何 setter 写位置**
  - 官方原文："在 Chrome 的设置中，用户可以指定面板应显示在哪个侧边" — 位置是用户偏好不是扩展可控属性
  - 我们的策略：HeaderMenu「显示位置」保持 disabled 灰显，tooltip 引导用户去 Chrome 原生右键菜单切换
- 拖动侧边栏宽度由 Chrome 原生支持，无需代码
- 不使用 Pinia（composables 已够用）
- 不使用 shadcn/Radix，纯 Tailwind + v-click-outside 实现下拉菜单
- `lucide-vue-next` 已弃用，改用 `@lucide/vue`
- 标签切换历史用 `chrome.storage.session`（关闭浏览器自动清除，无需手动管理）
- 自定义标记存 `chrome.storage.local`（持久化，扩展重装会丢失）
- **聚焦模式用 `chrome.tabGroups` 折叠**（非 `tabs.hide` 实验 API）—— 2026-06-27 决策
- **设置统一存 `chrome.storage.local` key `tabMasterSettings`** —— 2026-06-27 决策
- **暗色模式用 Tailwind `darkMode: 'class'` + `<html class="theme-dark">`** —— 2026-06-27 决策

### Manifest 权限
`tabs` + `tabGroups` + `storage` + `sidePanel` + `host_permissions: ["https://*/*"]`

### 红线（永远不要做）
- 改 manifest permissions 前必查 https://developer.chrome.com/docs/extensions/reference/permissions-list（`tabHide` 不存在！）
- 调 chrome.* API 前必查官方文档 Methods 章节（`chrome.tabs.hide` 是实验 API！）
- 禁用 `(chrome.x as any)` 强转
- 禁用 v-html（XSS）
- 不自动 git commit/push（等用户明确指令）

### 参考原型
交互原型在 `/Users/yuyany/web_space/tab-master-demo`（React + shadcn/ui），已迁移核心功能到本项目。
