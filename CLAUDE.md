# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **🔔 hub 已建立（2026-07-08）**：本仓的研发 agent（`product-manager` / `extension-frontend` / `backend-ruoyi`）已重组并迁至协调 hub：`/Users/yuyany/hub/hub_plugin-master/.claude/agents/`，更名为 `plugs-pm` / `plugs-fe` / `api-backend`，并新增 `web-pm` / `web-fe` / `product-master`。**研发协调请从 hub 启动 claude**：`cd /Users/yuyany/hub/hub_plugin-master && claude`。本 CLAUDE.md 仍为插件规范基准，agent 动工前必读；跨仓协调见 hub `CLAUDE.md` + `docs/agent-roster.md` + `docs/project-map.md`。

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

**TM-浏览器标签整理大师** — 帮助用户高效管理浏览器标签页。


## 协作协议（务必遵守）
- **研发工作必须用研发 agent**：实质性前端开发派 `plugs-fe` agent 实现，main 只协调+审查+提交，不要自己瞎写。没把握/不确定的先查资料和最佳实践（`docs/googledocs/` + 网上），**不要靠猜**；查不了（网络限制）就明确告诉用户需要哪份资料、让用户查完生成 .md 给我。详见 [[feedback-rnd-via-agent-and-research-first]]
- **多 agent 分工**：实质需求 → `plugs-pm` 出 PRD（docs/prd/）→ `plugs-fe` 实现 → main 协调+审查。详见 [[feedback-multiagent-and-no-regression]]
- **不跑 build/dev**：用户自己跑 `pnpm dev:safe`（产物 `build/chrome-mv3-dev/`）。main 跑 build 会抢 Parcel 缓存 → "改了没生效"。详见 [[feedback-no-build-user-runs-dev]]
- **审查 .vue 必查**：① 模板复合语句 `@click="fn; x()"` ② 模板内 TS 语法 `as X` / `!` 非空断言 / 泛型 ③ HTML 转义（grep `&lt;`）+ 多个 `<script setup>` 块 ④ 是否波及既有功能。⚠️ **`vue-tsc` 检不出模板内 TS 断言，也查不出重复解构声明**——必须用 Plasmo 同款 `@vue/compiler-sfc@3.3.4` 跑 **`compileScript`**（不只 `compileTemplate`！compileScript 才解析 script setup、抓重复 `const`/解构重名）复核（见 [[lesson-vue-mustache-no-components]]）。改 sidepanel 等大文件后**必跑 compileScript**，否则 Plasmo 实构建会白屏/失败
- **🚨 提交前防白屏清单（5 次白屏教训，每次改完必跑，不许跳过）**：① compileScript（抓重复声明/解构重名）② compileTemplate（抓模板 TS 断言/复合语句）③ `npx vue-tsc --noEmit`（抓类型）④ 顶层 TDZ 扫描（`useXxx({ident})` 的 ident 是否在调用前定义）⑤ 未定义引用扫描（改解构后 grep 模板用到的函数是否还在解构里）⑥ **多根组件 fallthrough 扫描**（见下方红线，2026-07-16 新增）⑦ **computed/ref 模板 .value 误用扫描**（2026-08-05 新增，i18n 改造踩坑）：把 const 数组改 `computed` 时，**模板里 computed ref 自动 unwrap，写 `{{ xxx.value }}` 是 undefined → 运行时报错**。script 里 `.value` 正确，模板里不该有。grep 检查：`grep -rnE "\\{\\{[^}]*\\b[A-Za-z_]+\\.value\\b" --include="*.vue"`（排除对象属性 value 如 `s.value`/`opt.value`，那是数据字段不是 ref）。**vue-tsc/compileScript 查不出此 bug，只在运行时渲染触发**。详见 [[lesson-precommit-checklist-after-bugs]]。**绝不能只跑 vue-tsc 就提交**——它查不出 TDZ/重复声明，也查不出多根 fallthrough，更查不出 .value 误用
- **新功能不碰老功能；重构/统一既有代码需先经用户批准**
- **改动 / 新增功能前先查 `docs/code-map.md`（代码地图）**——它列了"改 A 必须联动改 B/C"（如：加 storage key 必须同步 `StoragePanel.vue`）；引入新的跨文件联动后**回去更新这张表**
- **所有改动基于 `test` 分支开发/commit/push**（2026-07-08 起改 test 流程）：在 `test` 分支上 `git add`/`commit`/`push`，静态校验（防白屏 5 步）通过后即可提交，不必逐次问。⚠️ **未经用户允许不准把 test 合并到 master，也不准直接改/commit/push master 分支** -> [[feedback-no-auto-commit]]

## 官方文档（改 manifest / 调 chrome.* 前必查）
- 本地权威副本：`docs/googledocs/`（76 个 Chrome 扩展 API 的 `.md` + `INDEX.md` 索引，每文件头带官方 URL）。重抓脚本：`docs/googledocs/fetch-chrome-docs.sh`
- 流程：先 grep/读 `docs/googledocs/<api>.md` 核实方法签名 / 权限名 / 最低版本，**不凭印象**。详见 [[lesson-verify-api-before-coding]]、[[reference-chrome-api-docs]]
- **通用原则（2026-07-16 复盘，硬规矩）**：任何文档/资料**本地有就先查本地**（`docs/googledocs/` + `docs/` 下任意 md + 各仓 CLAUDE.md/WEBSITE-HANDOFF.md），**本地没有再走外网**。WebFetch/WebSearch 外网是**兜底，不是首选**——曾因直接 WebFetch `developer.chrome.com` 卡半天，而本地 `docs/googledocs/alarms.md` 就有答案，浪费用户时间。流程：① 先 `ls`/grep 本地 docs 目录；② 本地有 → 读本地；③ 本地确无 → 才 WebFetch，且一次抓不到就告诉用户需要哪份资料、让用户给，**不要反复重试外网卡等**。

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
- **错误处理重做**（`3b51277`，plugs-fe agent 实现）：每页独立 ErrorBoundary（later/groups/history/home 各一个 scope）—— 一页崩不波及其它；统一降级 UI「⚠️ 此区域出错了 / 其它功能不受影响。可以重试，或在『设置』里点『重新打开』尝试恢复」+ [重试此区域][去设置重新打开] 两按钮

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

## 待办（2026-07-07 继续）

### 2026-07-06 完成（整理菜单 + 排序 + TagBar 标记栏，12 commit，细节看 docs/dev-log.md + git log）
- **整理菜单**：① 检测长期未用空结果直接打开弹窗 + 空状态「暂无超过 X 天未使用标签」（bf70316）② 弹窗去恢复提示避让按钮 + 标记筛选模式默认改单选（1f4ac35）
- **排序**：① 域名排序同 host 内改打开时间正序（29d819a）② 新增「最新访问优先」排序 + sortMode 持久化（PM PRD `docs/prd/recent-activity.md` → 5cba3d7）③ getEffectiveAccessTime 移至 sortUtils 打破循环依赖（0dfb087）④ label 改名：最新访问优先 / 按打开时间正序 / 按打开时间倒序（5987499）
- **TagBar 标记栏**：① 删除标记确认后保持「管理标记」panel 不关（ConfirmDialog stopPropagation 修根因，0a66a49）② chips 最多 3 行 + 超出截断「更多」按钮（11cbe06）+ 修测量层 shrink-0（a9ff771）③ 全部按钮移进 chips 行，折行对齐下拉框右侧（a595da9）
- **过程教训**：agent 多次超范围引入 bug（about:// / reorderCustomTag 重命名 / 循环依赖 / 漏 shrink-0）+ 没 commit 却报告完成 → 已更新 memory `feedback-multiagent-and-no-regression` 审查三步。HMR 缓存不一致致 Vue warn → pnpm fresh 解决

### 🔥 明天第一件事（用户验证 2026-07-06 改动）
`git pull` + `pnpm fresh` + chrome://extensions **刷新扩展**（不要移除）→ 验证：
1. 排序「最新访问优先」→ 切标签自动升顶 + 刷新扩展保持选择
2. 排序下拉新文案：最新访问优先 / 按打开时间正序 / 按打开时间倒序
3. 标记栏 >3 行 → 前 3 行 + 末尾「更多 ▾」→ 拖 sidepanel 宽度自适应
4. 删除标记确认/取消/遮罩 → 「管理标记」panel 保持 + 列表刷新
5. 域名排序同 host → 新打开的标签在后
6. 检测长期未用空结果 → 直接弹窗 + 「暂无超过 X 天」+ 无恢复提示
7. 标记筛选下拉 → 新用户/重置后默认「单选」
8. 清理菜单危险项确认后 → 整理 popover 保持

### 待办（未完成）
- **🔥 TagBar 管理按钮内联方案（用户搁置，待确认需求方向）**：用户提出把 ▾管理按钮放最后一个可见 chip 后面（参与 flex-wrap，最多 2 行，3 行不展示），但和已实现的方案 A（3 行 + 行外按钮）冲突，且需求有歧义（占满时按钮放哪、超 2 行是否展示前 2 行+按钮）。用户说"先不动了"。明天确认：① 最多 2 行还是 3 行 ② 占满时按钮位置 ③ 超 2 行是否显示前 2 行 + 按钮
- **🔥 打包给别人测试（待执行）**：用户要打包发别人。正确做法 `pnpm build`（生产构建 `build/chrome-mv3-prod/`，JS 压缩）+ `pnpm package`（打 zip）。⚠️ `build/chrome-mv3-dev` 是 dev 构建未压缩不能发。对方拿到 zip 解压 → chrome://extensions 开开发者模式 → 加载已解压的扩展程序 → 选文件夹（不是 zip）
- **默认排序是否改「最新访问优先」**：PM 建议不改（保持按域名），用户未明确，待定
- **运行日志功能：暂缓**（sidepanel 写 storage.local 时序问题未搞定，未查官方文档靠猜）。代码保留但不调用。复活前必须先查官方文档 + 最佳实践
- **聚焦态内容区补 ErrorBoundary**（2026-07-01 核实缺口）：sidepanel.vue 聚焦态分支未包 ErrorBoundary。见 [[pattern-unified-error-handling]]
- 分组页交互实测（搜索/排序/放入/新建）确认顺
- **4 格矩阵实测**（Chrome+Edge × macOS+Windows）这几天积累的全部改动
- **暗色模式精修**：少数品牌色类深色对比度不足，碰到一处改一处
- **i18n 扩展**：中英文已落地（2026-08-05，1351 key，zh/en 1:1），架构 `lib/i18n.ts` 响应式 + chrome.i18n 管 manifest + 后端 Accept-Language 头已铺路。后续加日/德/法等语言：加 `lib/locales/<locale>.ts` + `locales` map 一行 + `LocaleKey/LocalePref` 类型 + `normalizeBrowserLocale` 分支。**新功能开发必须同步加 i18n key（见红线）**
- **审计未覆盖**（2026-07-04 配额超限 429，7-06 重置）：搜索防抖、历史授权状态机、分组事件防抖等中低风险项未深入
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
- **版本号维护**：versionCode 单一来源在 `lib/api-config.ts` 的 `APP_VERSION_CODE`（export），background.ts 等都 import 复用，**禁止在别处重复硬编码**。当前 versionCode=1（未发生产）。**每次发生产版本必须 versionCode+1**（versionName 同步升，versionName 前端不维护常量、后端 ouu_apps_version 表管）。发版时同步提醒后端 ouu_apps_version 表插新版本记录。详见 [[plugin-version-release-rule]]
- 禁用 `(chrome.x as any)` 强转
- 禁用 v-html（XSS）
- **数据一致性**（底线）：派生数据不从 filteredTabs 派生（避免筛选污染数量）；onTabCreated 必须过滤窗口；跨窗口移动监听 onAttached/onDetached 兜底重载。开发+测试都要验收「插件数量=浏览器实际」。详见 [[pattern-data-consistency-with-browser]]
- **🚨 storage 写入 reactive 数据必须 `toPure()`**：`chrome.storage.local.set({ key: ref.value })` 时 Vue reactive proxy 数组被结构化克隆成数字键对象（`["工作"]`→`{"0":"工作"}`），读回 `Array.isArray` 失败被当脏数据重置成 `[]` → **数据丢失**。所有写 reactive ref（数组/对象）的 `storage.set` 必须包 `toPure()`（`JSON.parse(JSON.stringify(x))`，helper 在 useTabManager.ts）。2026-07-04 修复 laterTabs/recentlyClosed/tabOpenedAtMap/treeParentMap/tabNumberMap/storageUpdate 漏网（commit f0aa711，之前只修了 tabTagsMap/customTags）。详见 [[lesson-reactive-proxy-storage-serialize]]
- **useTabManager 已单例化**（2026-07-04 commit f0aa711）：模块级 `_instance` 缓存，所有 `useTabManager()` 调用共享同一实例，子组件可直接调（拿主实例）。⚠️ 若改回非单例，子组件会拿独立空实例 → UI 不更新 + storage 覆盖（数据破坏）——历史教训见 [[lesson-usetabmanager-not-singleton]]，**不要改回去**
- **🚨 改核心功能前必查「崩溃/卡死/数据破坏 8 类陷阱」**：reactive proxy storage 序列化 / composable 非单例 / 监听器泄漏 / storage 覆盖 / async 未 catch / SW 重启丢状态 / watch 无限触发 / 同步阻塞主线程。完整说明 + grep 审计速查表见 [[reference-extension-crash-pitfalls]]，改前对照 grep 一遍
- **🔴 多根组件 fallthrough 红线（零容忍，2026-07-16 立案）**：组件模板有 ≥2 个根节点（fragment）时，父级传的**未在 emits 声明的事件监听**（如 `@contextmenu`）和**未在 props 声明的属性**（如 `:data-tabid`）无法自动继承 → Vue 每次 patch 刷一条 `[Vue warn] Extraneous non-emits/non-props...` → 在 v-for 高频渲染场景（标签列表/平铺视图，几十~上百项）**疯狂刷屏 → 浏览器卡死崩溃**。教训：TabTileItem 双根（主 div + TabHoverCard 兄弟节点），父级传 `@contextmenu` + `:data-tabid`，切平铺视图瞬间刷屏崩浏览器（commit 9e204c4 修复）。**已知的现存多根组件**（改前必查）：PinnedBar / TagPicker / FooterStats / AppToolbar / StoragePanel / ErrorBoundary——当前因父级事件都声明在 emits 里而暂安全，属脆弱平衡，新增任何 fallthrough 必先合规。**合规写法二选一**：① 首选保持单根——含 `<Teleport>` 的把 Teleport 收进主根内（Teleport 本就不在自身 DOM 树渲染，放哪都行，TabTileItem 即此修法）；② 多根不可避免时，父级传的所有事件必须声明在 `defineEmits`、所有非 props 属性用 `inheritAttrs:false` + 显式 `$attrs` 绑定，**且禁止在 v-for 高频渲染里用多根组件接收 fallthrough**。**提交前必扫**（防白屏第⑥步）：用 `@vue/compiler-dom` 的 `baseParse` 数模板根级 element 节点，>1 即多根，再 grep 其父级用法是否传未声明的事件/属性。详见 [[lesson-multi-root-fallthrough-crash]]
- **🔴 用户相关本地缓存按 id 隔离红线（2026-07-18 立案）**：所有与登录用户绑定的 `chrome.storage.local` 缓存 key **必须带用户id**（`/customer/my` 返回的 `user.id`），形如 `xxx:{customerId}`。退出登录→清当前 id 缓存、回默认；重新登录→清非当前 id 的残留 + load 当前 id 缓存（同 id 可关联上）；未登录用户全用默认。换号不串数据。**实现要点**（见 `useSkin.ts` `cleanOtherCustomerCache`/`loadPurchasedActive`）：① key 用 `prefix + ':' + customerId` 拼接函数（如 `skinPreviewKey`/`skinActiveKey`）；② customer 变化时清全部相关内存态 + storage 残留；③ storage.onChanged 监听用 `startsWith(prefix)` 前缀匹配，非固定 key。**当前已知带 id key**：`tabMasterSkinPreview:{id}`（主题/透明度）、`tabMasterSkinActive:{id}`（已购frame/bg使用中态）；**不隔离的**：`tabMasterSkinTryon`（试穿临时态，跨页30s）、`tabMasterOptionsTab`/`tabMasterPropTab`（UI 偏好，非用户数据）、`tabMasterSettings`（全局设置）、`tabMasterAuth`（登录态本身）。后续新增用户相关缓存**必须**遵循此原则。详见 [[plugin-user-cache-isolation-by-id]]
- **🔴 稳定性红线（2026-07-19 立，上架前必守，零容忍卡死/白屏/CPU 过热/存储爆）**——以下任一条触发都会被用户差评下架，改核心功能前对照 grep 一遍：
  1. **storage 累积型数据必须有上限 + GC**：数组型 slice 限长（`recentlyClosed` 限 50、`laterTabs` 限 200、`tabMasterLogs` 限 N）；map 型（`tabTagsMap`/`tabNumberMap`/`tabLastAccessedMap`/`tabOpenedAtMap`/`treeParentMap`）**必须在 `onTabRemoved` 删该 tab 条目** + reconcile 时清孤儿（key 不在当前 validIds 里的全删）。无 `unlimitedStorage` 权限，`chrome.storage.local` 默认 10MB 硬上限——重度用户标签多，不 GC 几个月撑爆，撑爆后所有 set reject。教训：`onTabRemoved` 曾只清 treeParentMap/tabOpenedAtMap 漏清 tabTagsMap/tabNumberMap（2026-07-19 审查发现）。
  2. **所有 `chrome.storage.local.set` 必须 `.catch`**：配额耗尽或 SW 已死时 set 会 reject，不 catch → unhandled rejection + 静默丢数据（标记存不住/编号失效）。fire-and-forget 写入统一用 `lib/safeStorage.ts` 的 `safeSet`/`safeRemove` 兜底。
  3. **全局错误捕获必须安装**：入口（sidepanel/options）setup 顶层调一次 `installGlobalCapture()`（拦截 `window error`/`unhandledrejection`/`console.error` 入运行日志页）+ `onErrorCaptured` 兜底 Vue 渲染错误。不装=线上问题全看不到日志 + 顶层异常直接白屏无降级。教训：`useLogger.installGlobalCapture`/`vueErrorHandler` 曾定义但全仓从未调用（2026-07-19 审查发现）。
  4. **reload 必须节流防死循环**：`chrome.runtime.id` 失效时 reload 要用 sessionStorage 记上次 reload 时间，<10s 不再 reload，改显示静态降级页（"扩展已失效，请重新启用"）。失效持续时无限 reload = 侧边栏闪白屏 + CPU 吃满。教训：`loadTabs` catch + `onVisibilityChange` 两处裸 reload（2026-07-19 审查发现）。
  5. **watch ↔ storage.onChanged 必须等值短路**：外部 storage 变更回写内存 ref 后，deep watch 会再写一次盘；多页（sidepanel+options）同时打开会交叉 2-3 轮冗余写。回写前 `JSON.stringify` 等值比较短路。
  6. **高频定时器克制**：`setInterval <500ms` 需评估。进度条别用 100ms tick + CSS transition 叠加（持续 60fps 重排，低端机风扇响）——用 `requestAnimationFrame` 或 ≥250ms tick、去掉 transition。
  7. **全量重建大数组须增量 diff**：`loadTabs`/reconcile 对几百标签全量 `map` 重建 + 触发所有依赖 computed（filteredTabs/sorted/domainGroups/tree/stats）重算，卡主线程 50-200ms。须按 id diff 只更新变化项；visibilitychange 高频触发时尤其。
  8. **监听器配对移除**：单例 composable **不在** onMounted/onUnmounted 注册 chrome.* listener（会永久丢失或泄漏），文档级生命周期随文档 GC OK。见 [[singleton-composable-listener-lifecycle]]。
  9. **顶层 setup 不 throw**：async 初始化必须有 loading/error 态 + try/catch，顶层裸 throw 直接白屏。访问属性链 `a.b.c` 须守卫。
  10. **service worker 状态持久化**：MV3 SW 30s 空闲会重启，所有 SW 内存态（lastAccessedMap/treeParentMap/缓存）必须 storage 持久化 + install/startup 时 load，重启后能恢复，否则 SW 重启=状态丢失。
  - **扩展崩溃通用成因（改前对照）**：主线程长任务 >50ms / 内存泄漏（闭包持有大对象、监听器未移除、DOM 引用）/ storage 超 10MB 配额 / 消息端口断开（SW 已死时 sendMessage）/ v-for 无 key 或 key 冲突 / 响应式大数组深追踪开销 / chrome.* API 在不支持版本调用抛错（须版本守卫，见 [[cross-platform-compat]]）。详见 [[rule-extension-stability]]
- **🔴 单文件行数红线（2026-07-19 立案，后续禁止巨型文件）**：新写/重构文件行数上限——`.vue` ≤ 800 行、`.ts` ≤ 500 行。超出必须拆分（模板抽子组件、setup 逻辑抽 composable、background 按职责拆模块），且拆分需经审查 + 跑防白屏校验确认无回归。**现存超限文件**（历史遗留，待分步拆，不强制本轮一次性拆完，但每次改动应顺手减负）：`sidepanel.vue`（~1760 行）、`options.vue`（~978 行）、`background.ts`（~632 行）、`useSkin.ts`（~590 行）、`TagBar.vue`（~870 行）。新代码禁止再往这几个文件里堆逻辑——新功能优先新开组件/composable/模块文件。详见 [[rule-single-file-size-limit]]
- **🔴 国际化红线（2026-08-05 立案，零容忍中文硬编码回退）**——i18n 已全量落地（`lib/i18n.ts` 响应式 + `lib/locales/zh-CN.ts`/`en-US.ts` 1351 key 1:1，chrome.i18n 管 manifest，后端 Accept-Language 头已铺路）。**后续所有功能开发必须同步 i18n，不许新增用户可见的中文硬编码**：
  - **用户可见文案**（模板 `>中文<` / `title="中文"` / `placeholder="中文"` / `showToast('中文')` / `confirm('中文')` / `new Error('中文')` 抛给 UI 的 / 数据表 label/desc / toast / tooltip / 按钮文字 / 空状态 / 引导文案）→ **必须**走 `t()`/`tWithParams()`，zh-CN.ts + en-US.ts 同步加 key（1:1 对齐，缺英文 fallback 到中文但不许只加中文）
  - **key 命名**：按模块前缀分组（`sidepanel.*`/`options.*`/`backup.*`/`dialog.*`/`status.*` 等），复用既有 `common.*`（取消/确认/关闭/更多等），禁止重复造同义 key（grep 现有 key 再决定新建还是复用）
  - **响应式**：const 数组里的 label（如 `VIEW_OPTIONS`/`SORT_OPTIONS`）要改 `computed` 让 locale 切换时跟随重渲染；数据表（statusConfig/feature-tiers）用 `labelKey/descKey` 字符串 + 消费侧 `t()` 翻译
  - **带参数文案**：用 `tWithParams(key, {name})` 命名占位，英文语序与中文不同时翻译时调语序（如 "已关闭 N 个" → "Closed N tabs"）
  - **导出文件内容例外**：`lib/backup/exporters.ts` 导出的 Markdown/JSON 内容固定中文（D1 决策，备份文件是数据可能跨语言共享），不算违规；但 toast/错误消息要 i18n
  - **console.warn/注释例外**：开发者诊断日志、代码注释保留中文，不算违规
  - **校验**：提交前 grep 确认无新增用户可见中文硬编码：`grep -rnE "title=\"[一-鿿]|placeholder=\"[一-鿿]|showToast\(['\"][一-鿿]" components/ tabs/ sidepanel.vue options.vue composables/`；zh/en key 1:1 对齐：`grep -cE "^\s+'[a-zA-Z]" lib/locales/zh-CN.ts` 和 en-US.ts 数量一致
  - **加新语言扩展口**：加 `lib/locales/<locale>.ts` + `locales` map 一行 + `LocaleKey`/`LocalePref` 类型加成员 + `normalizeBrowserLocale` 加分支，3-4 处改动
  - 详见 [[rule-i18n-no-hardcoded-chinese]]
- 所有改动基于 `test` 分支开发/commit/push（2026-07-08 起）。⚠️ 未经用户允许不准 merge test->master，不准直接改/commit/push master 分支

### 参考原型
交互原型在 `/Users/yuyany/web_space/tab-master-demo`（React + shadcn/ui），已迁移核心功能到本项目。

