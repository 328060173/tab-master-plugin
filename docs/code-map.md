# 代码地图（改动联动表）

> **这是什么**：一张「改 A 必须联动改 B/C」的地图。新增功能 / 改既有功能 / 仿写类似功能前先查这里，照着把所有关联点都改到，避免"只改一半"。
>
> **维护规则（重要）**：每当你新引入一处**跨文件联动**（"加这个就必须同时改那个"），回来把它补进对应小节。这张表只有持续更新才有价值。Last updated: 2026-07-04。

---

## A. 新增一个持久化存储 key（最容易漏！）

新增一个要长期保存的数据时，**必须**同步这几处，否则"存了但没人统计/没法清理"：

1. **读写它的 composable**：`useTabManager` / `useSettings`(key=`tabMasterSettings`) / `useLogger`(key=`tabMasterLogs`) / `useTabGroups` / `background.ts` 等
2. **`components/StoragePanel.vue`** — 加进 `USER_DEFS` 或 `SYS_DEFS`，并确认 `doClear` 能正确清空（数组→`[]` / 对象→`{}` / 多 key→`remove` / localStorage→`removeItem`）
3. **防御性读取**：`loadLater()` 这类入口要对脏数据兜底（非数组/对象 → 空值），不能让坏数据炸 UI
4. 区分存储位置：`chrome.storage.local`(持久) / `window.localStorage`(持久，目前仅 `viewMode`、`tabmaster_search_history`) / `chrome.storage.session`(关浏览器即清，不进 StoragePanel)

> 当前已登记的 key 清单见 `StoragePanel.vue` 的 `USER_DEFS`/`SYS_DEFS` —— 那是唯一权威清单，改 key 先对照它。

## B. 新增一个浮层 / 下拉 / 子菜单

1. 用 `composables/usePopoverManager.ts`（单例 `activeId`），给一个**唯一 id**
2. 定位用 `lib/popoverPosition.ts`：
   - 按钮正下方弹出 → `computePopoverPos(rect, {width,height?}, anchor)`（已 clamp 进视窗）
   - **侧向飞出的二级子菜单** → `computeFlyoutPos(rowRect, {width,height?}, prefer)`（双向兜底 clamp，窄面板不溢出）。**不要再手写 `left = rect.left - W` 那种土算法**
3. z-index 用 `lib/zLayers.ts` 档位（popover60 / hoverCard70 / dialog100 / contextMenu110 / toast200）
4. 结构：`fixed` + `<Teleport to="body">`
5. 关闭由 `installGlobalPopoverClose`（sidepanel setup 调一次）统一处理 document click / Esc
6. 窄面板提醒：side panel `window.innerWidth` ≈ 面板宽(300-400px)，不是屏幕宽；子菜单别太宽（≤144px 才能浮在菜单旁不压住主菜单，参考主题/字号子菜单）

## C. 新增 / 修改 `.vue` 组件（构建安全红线）

模板里**禁止**：
- TS 语法：`x as HTMLElement`、`x!` 非空断言、泛型、把组件塞进 `{{ }}`
- 复合语句：`@click="fn; popover.close()"` → 抽成一个 handler 函数
- 直接用全局 `window` / `chrome` / `document` → 在 `<script setup>` 暴露常量再用
- 用到的 lucide 图标**必须 import**，否则运行时 "Failed to resolve component: Xxx"

校验（两步都要）：
```bash
npx vue-tsc --noEmit                    # 类型检查（查不出模板 TS 断言）
# Plasmo 同款编译器复核模板（能查出上面的模板 TS 断言 / 标签不闭合）：
node -e "const fs=require('fs');const sfc=require('./node_modules/.pnpm/@vue+compiler-sfc@3.3.4/node_modules/@vue/compiler-sfc');const {descriptor}=sfc.parse(fs.readFileSync('PATH.vue','utf8'),{filename:'x'});const r=sfc.compileTemplate({source:descriptor.template.content,filename:'x',id:'x'});console.log(r.errors.length?r.errors:'OK')"
```

## D. 新增 / 修改 manifest 权限，或调用新的 `chrome.*` API

1. **先查 `docs/googledocs/<api>.md`**（官方副本）核实方法签名 / 权限名 / 最低 Chrome 版本 —— 不凭印象
2. manifest 在 `package.json` 的 `manifest` 字段；非必需权限用 `optional_permissions` + 运行时 `chrome.permissions.request`（必须在用户手势里调）
3. 兼容：`typeof chrome.x.method === 'function'` 检测 + 优雅降级（Edge 落后 Chrome 1-2 版）
4. 新 API 不在 `@types/chrome` 里 → 用**模块增强**补类型（见 `composables/useSidePanelLayout.ts` 的 `declare global`），**禁止 `as any`**

## E. 新增一个设置项

1. `types/settings.ts` — 类型 + `DEFAULT_SETTINGS`
2. `composables/useSettings.ts` — `mergeSettings` 兼容旧数据迁移
3. UI 入口：`components/HeaderMenu.vue`（侧栏内快捷）和/或 `options.vue`（完整设置页）
4. **视觉类设置（主题/字号/密度）**：除了给 `<html>` 加 class，**必须**在 `sidepanel.vue` 全局 `<style>` 写 `:root.xxx` 规则，否则 class 加了但没视觉变化
5. `options.vue` 与 sidepanel 共享同一份 `useSettings()`，改完两边即时生效

## F. 新增导航页 / 标签视图 / 独立页面

- **导航 tab**（首页/稍后/分组/历史）：`sidepanel.vue` 的 `activeNav` + 导航栏 + 内容区 v-if 分支（注意包在 `ErrorBoundary` 内）
- **标签卡片视图**（列表/平铺/图标/树形）：四套组件 `components/Tab{List,Tile,Icon,Tree}Item.vue` 通常要一起改
- **独立浏览器页面**（不在侧栏里）：放 `tabs/<name>.vue` → Plasmo 自动出 `tabs/<name>.html`，用 `chrome.tabs.create({url: chrome.runtime.getURL("tabs/<name>.html")})` 打开（例：`tabs/logs.vue`）。**加 tabs/ 新入口后必须 `rm -rf .plasmo build` 全新构建**

## G. 新增用户操作 / 错误处理（可感知 + 容错）

- 关键操作记 `logInfo(scope, msg)`、捕获到的错误记 `logError(scope, msg, err)`（`composables/useLogger.ts`）
- 可能崩的子树用 `components/ErrorBoundary.vue` 包住（崩了只降级局部，不白屏）
- 破坏性操作 → `ConfirmDialog` 二次确认；耗时 → loading；完成 → toast 反馈（**可感知原则**：事前文案/图标 + 事中反馈 + 事后提示，见 product-manager 角色 §6）
- 复杂/新功能 → 配 `?` 问号说明（它是什么、影响什么、能否撤销）

## H. 域名识别 / 品牌名 / 分组归并

- `lib/registrableDomain.ts` — eTLD+1 提取（复合后缀清单）
- `lib/domainNames.ts` — host → 品牌名（最长后缀回溯）
- `config/domain-config.json` — 品牌名映射数据
- 按域名排序/分组的 key 统一走 `getRegistrableDomain()`（`lib/sortUtils.ts`）

## I. Service Worker 采集型数据（持续追踪的状态）

- 凡是"需要持续追踪浏览器变化"的数据（tab 父子、切换历史、停留时长、lastAccessed）→ **主采集在 `background.ts`**（永久监听），UI 只消费 + 用户主动操作时写
- 详见记忆 `pattern-sw-as-collector`
- UI 侧（composable）的同类监听只是兜底，不能当唯一数据源

## J. 标签操作菜单联动（右键 / 汉堡 / 批量 / 卡片）

标签操作动作逻辑统一在 `composables/useTabActions.ts`（单标签 + 批量）。三个菜单 + 卡片直接操作都调它，改一个操作逻辑只改 `useTabActions.ts` 一处。

### 改一个操作（如"复制链接"）要联动：
1. `useTabActions.ts` 的对应函数 —— 改逻辑/toast 文案
2. （如改菜单项文案/图标）`components/TabContextMenu.vue`（右键）+ `components/TabHoverCard.vue`（汉堡）+ `sidepanel.vue` 批量菜单模板
3. 测试：右键菜单 / 汉堡菜单 / 批量菜单 / 卡片直接按钮 各跑一遍

### 各菜单引用 useTabActions 的函数清单
| 操作 | useTabActions 函数 | 右键 | 汉堡 | 批量 | 卡片 |
|---|---|---|---|---|---|
| 刷新 | refresh | ✓ | ✓ | — | ✓ |
| 复制链接 | copyUrl | ✓ | ✓ | — | ✓ |
| 固定/取消固定 | togglePin | ✓ | ✓ | — | ✓ |
| 静音/取消静音 | toggleMute | ✓ | — | — | — |
| 复制标签页 | duplicate | ✓ | — | — | — |
| 关闭标签 | close | ✓ | ✓ | — | ✓ |
| 关闭其他标签 | closeOthers | ✓ | — | — | — |
| 新建分组 | newGroupSingle | ✓ | — | — | — |
| 加入分组 | addToGroupSingle | ✓ | — | — | — |
| 移出分组 | removeFromGroupSingle | ✓ | — | — | — |
| 批量关闭 | batchClose | — | — | ✓ | — |
| 批量稍后 | batchLater | — | — | ✓ | — |
| 批量加入分组 | batchAddToGroup | — | — | ✓ | — |
| 批量新建分组 | batchNewGroup | — | — | ✓ | — |

### 不在 useTabActions（UI 耦合，仍 sidepanel 管）
- later（开 LaterDialog）/ setNumber（开 number-picker 浮层）/ addTag（开 TagSelectPopover）
- 批量选择入口（selectThis/selectSameDomain/selectSameGroup/selectAllVisible）
- 聚焦模式相关操作

## K. 标记操作联动（增/删/切/查，最容易漏！）

标记操作分散在 7+ 入口，**全部走** `useTabManager` 的**意图式 API**（内部用主实例 `tabs.value` 查当前 tags 再算，调用方只传意图不传完整数组、不依赖 props）。**禁止**用 `props.currentTags` / `props.item.tags` 计算新数组——props 经过 Teleport + 多层 computed 可能旧值，用旧值 filter/concat 会删错/加错（如删一个标记把别的也带没）。详见记忆 `lesson-usetabmanager-not-singleton`。

### 意图式 API（`composables/useTabManager.ts`）
| 函数 | 作用 | 内部实现 |
|---|---|---|
| `addTabTag(id, tag)` | 给标签加一个标记 | tabs.value 查 cur，去重合并 → updateTabTags |
| `removeTabTag(id, tag)` | 从标签删一个标记 | tabs.value 查 cur，filter → updateTabTags |
| `toggleTabTag(id, tag)` | 切换标签的标记 | tabs.value 查 cur，有则删无则加 → updateTabTags |
| `updateTabTags(id, tags[])` | 批量设置（底层） | 直接设 tabs[idx].tags + tabTagsMap + storage（写前必 toPure） |

### 入口 → emit 链路 → sidepanel handler
| 入口 | 触发 | emit 链路 | sidepanel handler |
|---|---|---|---|
| TagPicker（卡片 Tag 按钮，single 模式） | 切换标记 | TagPicker `@toggle`→emit `toggleTag`→TabListItem/Icon/Tile/SearchResults 转发→`@toggle-tag` | `toggleTabTag(id, tag)` |
| TabHoverCard 叉号 | 删单个标记 | TabHoverCard `removeTag`→5 视图（List/Icon/Tile/Tree/Pinned）转发→`@remove-tag` | `removeTabTag(id, tag)` |
| 右键菜单「添加标记」 | 切换标记 | TabContextMenu `act('tag')`→`toggleRightClickTabTag`（已用 tabs.value 查） | `updateTabTags` |
| 批量工具栏标记 | 加/删标记 | TagSelectPopover(batch) `apply`/`remove`→`batchApplyTag`/`batchRemoveTag` | `updateTabTags`（已用 tabs.value 查） |
| TagBar panel 删除标记名 | 从所有标签移除 | TagBar `removeTag`→`handleRemoveTag`→`removeCustomTag` | `removeCustomTag(tag)` |

### 改标记操作要联动（⚠️ 5 视图 + SearchResults 容易漏）
1. `composables/useTabManager.ts` 的意图式 API —— 改逻辑
2. 如改 emit 事件名：**全部 7 个文件联动**——`TagPicker` + `TagSelectPopover` + `TabListItem/Icon/Tile/Tree/Pinned` + `SearchResults` + `sidepanel.vue`
3. 测试：TagPicker 勾选 / TabHoverCard 叉号 / 右键菜单 / 批量 / TagBar panel 删除 各跑一遍

### 红线
- 子组件**不要**用 `props.currentTags` / `props.item.tags` 算新数组再 emit —— 改用意图式 API
- `updateTabTags` 是底层 API，只在 useTabManager 内部 + sidepanel 右键/批量（已用 tabs.value 查）用；子组件不要直接调
- 命名注意：`toggle` 已被「批量选中」占用，标记切换用 `toggleTag`（避免冲突）

---

## 索引：核心文件速查

| 关注点 | 文件 |
|---|---|
| tab 数据/操作 | `composables/useTabManager.ts` |
| 分组 | `composables/useTabGroups.ts` |
| 聚焦模式 | `composables/useFocusMode.ts` |
| 设置 | `composables/useSettings.ts` + `types/settings.ts` |
| 浏览历史(可选权限) | `composables/useHistory.ts` |
| 清理/检测 | `composables/useCleanup.ts` |
| 日志 | `composables/useLogger.ts` + `tabs/logs.vue` |
| 浮层管理/定位/层级 | `composables/usePopoverManager.ts` + `lib/popoverPosition.ts` + `lib/zLayers.ts` |
| 存储占用/清理 | `components/StoragePanel.vue` |
| 设置菜单/设置页 | `components/HeaderMenu.vue` + `options.vue` |
| 工具栏(视图/排序/整理) | `components/AppToolbar.vue` |
| 右键菜单 | `components/TabContextMenu.vue` |
| 错误边界 | `components/ErrorBoundary.vue` |
| 官方 API 文档(离线) | `docs/googledocs/INDEX.md` |
