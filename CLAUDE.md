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

## 当前开发进度（2026-06-23）

### 已完成

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

**待开发功能：**
- 树形视图（需 background 追踪 tab 父子关系，骨架已有）
- 分组标签（chrome.tabGroups API，导航已占位）
- 历史记录页（chrome.history API，导航已占位）
- 聚焦模式（Header 按钮已有，逻辑待实现）
- 云同步（设置菜单已占位）
- 设置页完整实现（主题/字体/语言/显示位置）

### 关键技术决策
- 侧边栏在 Chrome 右侧（Chrome API 限制，无法改为左侧）
- 拖动侧边栏宽度由 Chrome 原生支持，无需代码
- 不使用 Pinia（composables 已够用）
- 不使用 shadcn/Radix，纯 Tailwind + v-click-outside 实现下拉菜单
- `lucide-vue-next` 已弃用，改用 `@lucide/vue`
- 标签切换历史用 `chrome.storage.session`（关闭浏览器自动清除，无需手动管理）
- 自定义标记存 `chrome.storage.local`（持久化，扩展重装会丢失）

### Manifest 权限
`tabs` + `storage` + `sidePanel` + `host_permissions: ["https://*/*"]`

### 参考原型
交互原型在 `/Users/yuyany/web_space/tab-master-demo`（React + shadcn/ui），已迁移核心功能到本项目。
