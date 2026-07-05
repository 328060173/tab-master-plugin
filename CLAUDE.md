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
- **审查 .vue 必查**：① 模板复合语句 `@click="fn; x()"` ② 模板内 TS 语法 `as X` / `!` 非空断言 / 泛型 ③ HTML 转义（grep `&lt;`）+ 多个 `<script setup>` 块 ④ 是否波及既有功能。⚠️ **`vue-tsc` 检不出模板内 TS 断言，也查不出重复解构声明**——必须用 Plasmo 同款 `@vue/compiler-sfc@3.3.4` 跑 **`compileScript`**（不只 `compileTemplate`！compileScript 才解析 script setup、抓重复 `const`/解构重名）复核（见 [[lesson-vue-mustache-no-components]]）。改 sidepanel 等大文件后**必跑 compileScript**，否则 Plasmo 实构建会白屏/失败
- **🚨 提交前防白屏清单（4 次白屏教训，每次改完必跑，不许跳过）**：① compileScript（抓重复声明/解构重名）② compileTemplate（抓模板 TS 断言/复合语句）③ `npx vue-tsc --noEmit`（抓类型）④ 顶层 TDZ 扫描（`useXxx({ident})` 的 ident 是否在调用前定义）⑤ 未定义引用扫描（改解构后 grep 模板用到的函数是否还在解构里）。详见 [[lesson-precommit-checklist-after-bugs]]。**绝不能只跑 vue-tsc 就提交**——它查不出 TDZ/重复声明
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

### 2026-07-01 完成摘要（细节看 docs/dev-log.md + git log）
- **聚焦态补 ErrorBoundary**（scope=focus）+ 立统一错误处理规矩（[[pattern-unified-error-handling]] + agent 红线 F）
- **标记系统三轮优化**：①TagBar 重构（拖动排序+15上限+右键管理+问号）②横滚改下拉 panel（编辑/删除/排序/添加归拢）③统一浮层 `TagSelectPopover`（四处入口共用，列数自适应，batch 三态）
- **固定标签拖动排序**（GripVertical+chrome.tabs.move）+ 修 PinnedBar 菜单失效 bug（三元 handler 返回引用不调用）+ 补 onMoved 监听
- **树形限 5 层**（超层并到第 5 层）+ 滚动 pb-16 避让回到顶部
- **状态栏 + 数据一致性底线**：筛选自动回全部 + 0计数不可点 + 状态排序（🔌提前）+ pinnedItems 解耦筛选 + onTabCreated 过滤窗口 + onAttached/onDetached 兜底重载（[[pattern-data-consistency-with-browser]] + agent 红线 G）
- **菜单动作统一抽象** `useTabActions.ts`（单+批量）+ code-map J 节联动矩阵
- **聚焦模式 UI**：全屏黑罩 + 中央大红「关闭聚焦」按钮（屏幕共享样式）
- **审查流程升级**（4 次白屏教训）：改 .vue 必跑 compileScript（不只 vue-tsc/compileTemplate）+ 扫顶层 TDZ（[[lesson-compilescript-not-just-compiletemplate]]）

### 2026-07-03 完成摘要（细节看 docs/dev-log.md + git log）
- **标记重启丢失真凶修复**：Vue reactive proxy 数组经 `chrome.storage.local.set` 被结构化克隆成数字键对象（`["工作"]`→`{"0":"工作"}`）→ 读回 `Array.isArray` 失败被当脏数据重置成 `[]`。加 `toPure = JSON.parse(JSON.stringify(x))` helper 写前转纯 JSON。记 [[lesson-reactive-proxy-storage-serialize]]
- **首次绑标记提示 UX**：toast 改 ConfirmDialog 模态弹窗（标题「标记关联提醒」居中，amber 框强调「由于浏览器 API 规范」）；ConfirmDialog 加 `centerTitle`+`highlight` 两个可选 prop；`tagsSessionNoticeShown` 改回 storage.local 只提示一次
- **TagBar 类型修复**：`isDuplicate`/`isPanelDuplicate` 的 `!r.ok && r.reason` 改 `r.ok === false && r.reason` 修 TS2339（&& 里 `!r.ok` 不收窄）；标记绑定局限提示提取 `TAG_BIND_NOTICE` 常量 DRY（原 84/158 两处重复）
- **ui-ux-pro-max-skill plugin 本地装**：GitHub SSH 超时 + zip 无 .git → 手动 cp + `known_marketplaces.json` 注册 `local` source（格式待重启验证）

## 待办（2026-07-05 继续）

### 2026-07-04 完成（标记架构重做 + 鲁棒性，10 commit）
- **标记叉号崩溃 bug 修复链**：
  - `c0ab81b` TabHoverCard.onRemoveTag 改 emit（修独立空实例 → UI 不更新 + storage 覆盖）
  - `f0aa711` useTabManager 单例化（模块级 `_instance`）+ storage 写入全加 toPure（修 laterTabs/recentlyClosed/tabOpenedAtMap/treeParentMap/tabNumberMap/storageUpdate 漏 toPure → 重启丢失）
  - `d1ea3f7` 方案 B：onRemoveTag 改意图式 `removeTabTag`（修 props.item.tags 旧值 → 删一个把别的带没）
  - `f44cf72` 方案 C：TagPicker toggle 改意图式 `toggleTabTag`（消除 props.currentTags 依赖）+ code-map 加 K 节
- **架构资产**：
  - useTabManager 意图式 API：`addTabTag`/`removeTabTag`/`toggleTabTag`（内部用主实例 tabs.value 查，不依赖 props）
  - `docs/code-map.md` K 节「标记操作联动」——全部入口 + 联动文件清单（5 视图 + SearchResults 容易漏）
  - CLAUDE.md 红线：storage 写入必须 toPure / useTabManager 已单例化不要改回 / 8 类崩溃陷阱速查（指向 reference-extension-crash-pitfalls）
  - memory：`lesson-usetabmanager-not-singleton`（非单例坑 + 意图式 API）+ `reference-extension-crash-pitfalls`（9 类陷阱 + grep 审计速查表）
- **小优化**：`2fb1b9f` 检测长期未用标签阈值支持自定义输入（1-30 天正整数，chips + input）

### 🔥 明天第一件事（用户验证）
`git pull` + `pnpm fresh` + chrome://extensions **刷新扩展**（⚠️ **不要移除**！移除会清空 `chrome.storage.local`，全丢；刷新不清 storage）→ 验证：
1. 标签列表点汉堡菜单 → 多标记标签叉掉一个 → **只删那个，其它保留**
2. TagPicker 勾选（卡片 Tag 按钮）/ 搜索结果勾选 / 右键添加标记 / 批量加删 / TagBar panel 删标记名 → 全正常
3. 点固定/静音/稍后处理 → 功能正常 + UI 实时刷新（单例化验证）
4. 重启浏览器 → 稍后/最近关闭/树关系/标记都在（toPure 验证）
5. 整理 ▾ → 检测长期未使用标签 → chip 切换 + 自定义输入 5/0/31/1.5 看校验
- ⚠️ 之前因 bug 已丢失的标记/稍后项需重新绑（代码修复不恢复已丢数据）
- ⚠️ 存储持久性（查自 `docs/googledocs/storage.md`）：`chrome.storage.local` 在「清缓存/历史」「扩展刷新/更新」「浏览器重启」时都**不清**；**只在「移除/卸载扩展」时清空**。刷新扩展数据不丢，移除扩展数据全丢。

### 待办（未完成）
- **运行日志功能：暂缓**（sidepanel 写 storage.local 时序问题未搞定，未查官方文档靠猜）。代码保留（useLogger.ts / tabs/logs.vue / StoragePanel 的 tabMasterLogs 项）但不调用。复活前必须先查官方文档 + 最佳实践，查不了让用户给 .md
  - 需求：捕获所有日志（console.error/warn 拦截 + Vue errorHandler + onErrorCaptured + window.error + unhandledrejection）写入 storage.local key `tabMasterLogs`，设置页可查看/清空
- **聚焦态内容区补 ErrorBoundary**（2026-07-01 核实缺口）：sidepanel.vue 聚焦态分支（`focusMode === 'focusing'` 的 v-else 内容区）未包 ErrorBoundary。见 [[pattern-unified-error-handling]]
- 分组页交互实测（搜索/排序/放入/新建）确认顺
- **4 格矩阵实测**（Chrome+Edge × macOS+Windows）这几天积累的全部改动
- **暗色模式精修**：少数品牌色类深色对比度不足，碰到一处改一处
- **i18n 扩展**（优先级低）
- **审计未覆盖**（2026-07-04 配额超限 429，7-06 重置）：搜索防抖、历史授权状态机、分组事件防抖等中低风险项未深入。单例化间接修复了这些模块若调 useTabManager 的问题，但可补审
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
- **🚨 storage 写入 reactive 数据必须 `toPure()`**：`chrome.storage.local.set({ key: ref.value })` 时 Vue reactive proxy 数组被结构化克隆成数字键对象（`["工作"]`→`{"0":"工作"}`），读回 `Array.isArray` 失败被当脏数据重置成 `[]` → **数据丢失**。所有写 reactive ref（数组/对象）的 `storage.set` 必须包 `toPure()`（`JSON.parse(JSON.stringify(x))`，helper 在 useTabManager.ts）。2026-07-04 修复 laterTabs/recentlyClosed/tabOpenedAtMap/treeParentMap/tabNumberMap/storageUpdate 漏网（commit f0aa711，之前只修了 tabTagsMap/customTags）。详见 [[lesson-reactive-proxy-storage-serialize]]
- **useTabManager 已单例化**（2026-07-04 commit f0aa711）：模块级 `_instance` 缓存，所有 `useTabManager()` 调用共享同一实例，子组件可直接调（拿主实例）。⚠️ 若改回非单例，子组件会拿独立空实例 → UI 不更新 + storage 覆盖（数据破坏）——历史教训见 [[lesson-usetabmanager-not-singleton]]，**不要改回去**
- **🚨 改核心功能前必查「崩溃/卡死/数据破坏 8 类陷阱」**：reactive proxy storage 序列化 / composable 非单例 / 监听器泄漏 / storage 覆盖 / async 未 catch / SW 重启丢状态 / watch 无限触发 / 同步阻塞主线程。完整说明 + grep 审计速查表见 [[reference-extension-crash-pitfalls]]，改前对照 grep 一遍
- 改完代码自行 git add/commit/push 到 master（静态校验通过后即可，2026-06-30 用户授权）

### 参考原型
交互原型在 `/Users/yuyany/web_space/tab-master-demo`（React + shadcn/ui），已迁移核心功能到本项目。

