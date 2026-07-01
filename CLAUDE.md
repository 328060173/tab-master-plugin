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


## 协作协议（务必遵守）
- **研发工作必须用研发 agent**：实质性前端开发派 `extension-frontend` agent 实现，main 只协调+审查+提交，不要自己瞎写。没把握/不确定的先查资料和最佳实践（`docs/googledocs/` + 网上），**不要靠猜**；查不了（网络限制）就明确告诉用户需要哪份资料、让用户查完生成 .md 给我。详见 [[feedback-rnd-via-agent-and-research-first]]
- **多 agent 分工**：实质需求 → `product-manager` 出 PRD（docs/prd/）→ `extension-frontend` 实现 → main 协调+审查。详见 [[feedback-multiagent-and-no-regression]]
- **不跑 build/dev**：用户自己跑 `pnpm dev:safe`（产物 `build/chrome-mv3-dev/`）。main 跑 build 会抢 Parcel 缓存 → "改了没生效"。详见 [[feedback-no-build-user-runs-dev]]
- **审查 .vue 必查**：① 模板复合语句 `@click="fn; x()"` ② 模板内 TS 语法 `as X` / `!` 非空断言 / 泛型 ③ HTML 转义（grep `&lt;`）+ 多个 `<script setup>` 块 ④ 是否波及既有功能。⚠️ **`vue-tsc` 检不出模板内 TS 断言**——必须用 Plasmo 同款 `@vue/compiler-sfc@3.3.4` 跑 `compileTemplate` 复核（见 [[lesson-vue-mustache-no-components]]）
- **新功能不碰老功能；重构/统一既有代码需先经用户批准**
- **改动 / 新增功能前先查 `docs/code-map.md`（代码地图）**——它列了"改 A 必须联动改 B/C"（如：加 storage key 必须同步 `StoragePanel.vue`）；引入新的跨文件联动后**回去更新这张表**
- **改完代码自行 `git add`/`commit`/`push` 到 master**（2026-06-30 用户授权，静态校验通过后即可提交，不必逐次问）→ [[feedback-no-auto-commit]]

## 官方文档（改 manifest / 调 chrome.* 前必查）
- 本地权威副本：`docs/googledocs/`（76 个 Chrome 扩展 API 的 `.md` + `INDEX.md` 索引，每文件头带官方 URL）。重抓脚本：`docs/googledocs/fetch-chrome-docs.sh`
- 流程：先 grep/读 `docs/googledocs/<api>.md` 核实方法签名 / 权限名 / 最低版本，**不凭印象**。详见 [[lesson-verify-api-before-coding]]、[[reference-chrome-api-docs]]

## 历史与参考
- 逐日完成记录 + 项目结构快照 → `docs/dev-log.md`
- 功能 PRD → `docs/prd/<feature>.md`；开发规范手册（11 章）→ `docs/reference/extension-vue-best-practices.md`；dev 命令 / 报错排查 → `docs/dev-workflow.md`
- **代码地图（改动联动表）→ `docs/code-map.md`** —— 改/加功能前先查，照着把所有关联点改到
- 历史修复细节 → `git log`（不在此复述）

## 近期已完成（摘要，细节看 docs/dev-log.md + git log）
- 聚焦模式（`chrome.tabGroups` 折叠）/ 分组 / 设置面板 / 清理菜单 / 域名 eTLD+1 分组归并
- 浮层统一 PopoverManager / 批量功能（4 视图全支持）/ 标记体系重设计（TagBar）
- 历史页：最近关闭（50 条，零权限）+ **完整浏览历史 P1 已落地**（`chrome.history` 走 `optional_permissions`，引导式运行时授权）
- **侧边栏位置感知**：`useSidePanelLayout.ts`（getLayout 读左/右，不能写）+ HeaderMenu「显示位置」hover 问号指引
- **整理菜单**：Trash2→ListChecks +「整理 ▾」+ 危险项标红/检测项「先预览」标注
- **存储占用核对**：`StoragePanel.vue` 补齐 tabLastAccessedMap/tabMasterSettings/tabMasterLogs/引导记录/viewMode 等
- **代码地图** `docs/code-map.md`（改 A 联动改 B 表）+ Chrome API 离线副本 `docs/googledocs/`（76 API + INDEX）
- **`pnpm fresh`**：杀全部 plasmo→清 .plasmo+build→重启（任何怪问题无脑跑）
- **分组交互重设计**（2026-07-01，PM PRD→落地）：未分组复选框常显 + 顶部「已选 N 个」+「新建分组」+ 已有分组「← 放入」一气呵成；加搜索 + 排序（时间/ID 倒序）
- **分组 bug 修复**（`e30c4cc`）：`GroupItem` 的 `selectedIds` 未传 → `.includes` 崩 → 触发 ErrorBoundary（这才是"添加分组报错"真凶，跟 Proxy 无关）。已加 `withDefaults(()=>[])`
- **错误处理重做**（`3b51277`，extension-frontend agent 实现）：每页独立 ErrorBoundary（later/groups/history/home 各一个 scope）—— 一页崩不波及其它；统一降级 UI「⚠️ 此区域出错了 / 其它功能不受影响。可以重试，或在『设置』里点『重新打开』尝试恢复」+ [重试此区域][去设置重新打开] 两按钮

## 待办（2026-07-02 继续）
> 🔥 **明天第一件事**：`pnpm fresh`（清 .plasmo+build 重新构建，绕缓存）→ 在 chrome://extensions **点扩展卡片「刷新」按钮**（⚠️ **不要移除扩展**！移除=卸载会清空 `chrome.storage.local`，标记/稍后/树关系/编号全丢。刷新不清 storage）→ 进分组页验证：① 分组页正常显示不再报错 ② 添加分组/放入正常 ③ 搜索+排序可用
> - ⚠️ **存储持久性**（查自 `docs/googledocs/storage.md` 官方原文）：`chrome.storage.local` 在「清缓存/历史」「扩展刷新/更新」「浏览器重启」时都**不清**；**只在「移除/卸载扩展」时清空**。`storage.session` 才在刷新/重启时清。项目数据全走 `storage.local` → 刷新扩展数据不丢，移除扩展数据全丢。
- **运行日志功能：暂缓（没做出来）**：sidepanel 上下文写 chrome.storage.local 的时序问题我没搞定，且没查官方文档靠猜。代码保留（useLogger.ts / tabs/logs.vue / StoragePanel 的 tabMasterLogs 项）但当前不调用。将来复活前必须先查官方文档 + 最佳实践，查不了让用户给 .md
  - **需求（复活时要实现的）**：捕获**所有**日志 —— `console.error`/`warn` 拦截 + Vue 渲染/事件错误（`app.config.errorHandler` + 根级 `onErrorCaptured`）+ `window.error` + `unhandledrejection`，统一写入 `chrome.storage.local`（key `tabMasterLogs`），设置页可查看/清空。当前 `useLogger.installGlobalCapture()` 已写好拦截逻辑但**未被调用**（时序问题未解决前不接入）
- **聚焦态内容区补 ErrorBoundary**（2026-07-01 核实发现缺口）：`sidepanel.vue` 聚焦态分支（`focusMode === 'focusing'` 的 `v-else` 内容区）未包 ErrorBoundary，崩了无局部降级 UI。补的话派 extension-frontend agent。见 [[pattern-unified-error-handling]]
- 分组页交互实测（搜索/排序/放入/新建）确认顺
- **4 格矩阵实测**（Chrome+Edge × macOS+Windows）这几天积累的全部改动
- **暗色模式精修**：少数品牌色类深色对比度不足，碰到一处改一处
- **i18n 扩展**（优先级低）
- 功能性（等拍板）：客服消息提醒 / 智能标签冬眠 / 快照（需后端）/ AI 总结归类 / 树形视图精修
- 后端相关（登录 / 云同步）→ 等后端就绪，见 [[project-defer-backend-features]]
- ⚠️ build hash 卡死信号：遇"改了像旧代码"先 `pnpm fresh`

### 关键技术决策
- **统一错误处理**（2026-07-01 用户拍板）：每个页面/区域独立 `ErrorBoundary`（`components/ErrorBoundary.vue`）包裹，scope 命名（later/groups/history/home/...），崩了只降级局部、不波及其它；统一降级 UI「⚠️ 此区域出错了」+ [重试此区域][去设置重新打开]；ErrorBoundary 只 `console.error` 不写 storage（不依赖暂缓的日志功能）。新增页面/区域**先包 ErrorBoundary 再写内容**，不许裸渲染可能崩的子树、不许自己随便写 try/catch。详见 [[pattern-unified-error-handling]]
- **数据一致性底线**（2026-07-01 用户拍板，最高优先级，开发+设计+测试都要保证）：插件显示的所有数据/数量/操作必须与浏览器实际状态一致，任何漂移都是底线问题。① 派生数据（PinnedBar 等）从 `tabs.value` 直接派生，不经过 filteredTabs（不受筛选/搜索污染）② `onTabCreated` 必须判断 `t.windowId === currentWindowId`，其他窗口标签不加入 ③ `currentWindowId` 从 `tabs.query` 结果推导，不用 `chrome.windows.getCurrent()`（免 windows 权限）④ `onAttached`/`onDetached` → 防抖 `scheduleResync()` → 全量 `loadTabs()` 兜底跨窗口移动 ⑤ `onVisibilityChange` 会话内兜底保留。详见 [[pattern-data-consistency-with-browser]]
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
可选权限（运行时按需申请）：`optional_permissions: ["history"]`（完整浏览历史，用户授权后启用）

### 红线（永远不要做）
- 改 manifest permissions / 调 chrome.* 前必查 `docs/googledocs/<api>.md`（官方副本）核实——`tabHide` 不存在、`chrome.tabs.hide` 是实验 API
- 禁用 `(chrome.x as any)` 强转
- 禁用 v-html（XSS）
- **数据一致性**（底线）：派生数据不从 filteredTabs 派生（避免筛选污染数量）；onTabCreated 必须过滤窗口；跨窗口移动监听 onAttached/onDetached 兜底重载。开发+测试都要验收「插件数量=浏览器实际」。详见 [[pattern-data-consistency-with-browser]]
- 改完代码自行 git add/commit/push 到 master（静态校验通过后即可，2026-06-30 用户授权）

### 参考原型
交互原型在 `/Users/yuyany/web_space/tab-master-demo`（React + shadcn/ui），已迁移核心功能到本项目。

