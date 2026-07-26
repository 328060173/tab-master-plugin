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

### I-2. 广告拉取（SW 定时拉 + sidepanel 只读缓存，2026-07-16 重设计）
- **SW 拉取**：`background.ts` 的 `fetchAdCache(trigger)` 在 `onInstalled`/`onStartup` 初始化拉 + `chrome.alarms` 一次性闹钟定时拉。间隔由后端下发 `nextSyncIntervalMinutes`（banner=480）+ 0~60min 随机偏移；前端不再写死 6~12h（2026-07-16 改造）。`fetchAdCache` 内部 finally 统一调 `scheduleNextAdAlarm`（成功用后端间隔，失败兜底 480）保证闹钟常在
- **展示即消费（2026-07-16 改造）**：`useAd.ts` 的 `onAdClick`/`onAdDismiss`/`onAdExpired` 调 `consumeCurrentAd()` 把缓存 `adData` 置 null 并写回 storage（守 toPure，只清素材不动 lastSync/nextSyncIntervalMinutes）；`selectAd()` 在「有缓存但 adData=null」分支返回 null，本窗口不再弹，等 SW 下次拉新广告（adCacheUpdated 通知）才再弹
- **缓存写入**：SW 写 `chrome.storage.local.tabMasterAdCache`（含 hideAd/adData/expireTime/lastSync/nextSyncIntervalMinutes/serverTime），再 `sendMessage({type:'adCacheUpdated'})` 通知
- **sidepanel 只读缓存**：`useAd.ts` 初始化 + 收到 onMessage 时读 `tabMasterAdCache`，调 `selectAd()` 选广告渲染。**sidepanel 禁止任何 fetch 广告请求**（消费写 adData=null 是「消费」语义，不造素材）
- **两个 key 各司其职**：`tabMasterAdCache`（SW 写/sidepanel 读+消费写 adData=null，广告素材+hideAd+下次拉取间隔）vs `tabMasterAdState`（sidepanel 读写，展示去重 shownCount/interactedAdIds）
- **改广告拉取/缓存逻辑要联动**：`background.ts`(拉取+缓存+闹钟间隔) + `composables/useAd.ts`(读取+选择+消费) + `types/ad.ts`(共享类型) + `components/StoragePanel.vue`(key 清理)
- 需要 `alarms` 权限（manifest 已加，Chrome 111+ / Edge 同步支持）

### I-3. 版本检查拉取（SW 定时拉 + sidepanel 只读缓存，2026-07-16 重设计）
- **SW 拉取**：`background.ts` 的 `fetchVersionCache(trigger)` 在 `onInstalled`/`onStartup` 初始化拉 + `chrome.alarms`（`tabMasterVersionSync`）一次性闹钟定时拉。POST `/version/check-version`，body 含 `customerType`/`versionCode`(101)/`accessDeviceInfo`(collectDeviceInfo)/`accessLoc`/`deviceNumber`；登录态走 `getAuthHeaders`（读 `tabMasterAuth`，token 进 extraHeaders，customerType 同时进 body+header）。间隔由后端下发 `nextSyncIntervalMinutes`（version=1440/24h）+ 0~60min 随机偏移；兜底 1440。`fetchVersionCache` 内部 finally 统一调 `scheduleAlarm`（成功用后端间隔，失败兜底）保证闹钟常在
- **缓存写入**：SW 写 `chrome.storage.local.tabMasterVersionCache`（含 updateFlag/versionData/nextSyncIntervalMinutes/lastSync），再 `sendMessage({type:'versionCacheUpdated'})` 通知
- **sidepanel 只读缓存**：`useVersionCheck.ts` 初始化 + 收到 onMessage 时读 `tabMasterVersionCache`，派生 `UpdateInfo` 渲染 `UpdateBanner.vue`。**sidepanel 禁止任何 fetch 版本请求**
- **两个 key 各司其职**：`tabMasterVersionCache`（SW 写/sidepanel 只读，版本数据+下次拉取间隔）vs `tabMasterVersionCheck`（sidepanel 读写，用户关闭记录 dismissedVersionCode）
- **改版本拉取/缓存逻辑要联动**：`background.ts`(fetchVersionCache+scheduleAlarm+ensureAlarm+onAlarm 分发) + `composables/useVersionCheck.ts`(只读缓存+onMessage+dismissedVersionCode) + `types/version.ts`(共享类型) + `lib/device-info.ts`(collectDeviceInfo，SW 可用) + `components/StoragePanel.vue`(key 清理) + `sidepanel.vue`(只解构 updateInfo/shouldShowBanner/dismiss/openUpdatePage，onMounted 不调 checkVersion)

### I-4. 通知拉取（SW 定时拉 + sidepanel 只读缓存，2026-07-16 重设计）
- **SW 拉取**：`background.ts` 的 `fetchNoticeCache(trigger)` 在 `onInstalled`/`onStartup` 初始化拉 + `chrome.alarms`（`tabMasterNoticeSync`）一次性闹钟定时拉。GET `/notice/page-list`（后端返回 `R<NoticeSyncVO>`：rows/total/nextSyncIntervalMinutes）；登录态走 `getAuthHeaders`（token 进 extraHeaders）。间隔由后端下发 `nextSyncIntervalMinutes`（notice=240/4h）+ 0~60min 随机偏移；兜底 240。`fetchNoticeCache` 内部 finally 统一调 `scheduleAlarm` 保证闹钟常在
- **缓存写入**：SW 写 `chrome.storage.local.tabMasterNoticeCache`（含 rows/nextSyncIntervalMinutes/lastSync），再 `sendMessage({type:'noticeCacheUpdated'})` 通知
- **sidepanel 只读缓存**：`useNotice.ts` 初始化 + 收到 onMessage 时读 `tabMasterNoticeCache`。**sidepanel 禁止任何 fetch 通知请求**
- **已读永久不展示（2026-07-16 用户新硬要求）**：`tabMasterNoticeRead` 已读 id 列表**永久保留**（不跨天清零，与广告 interactedAdIds 当天重置不同）；`useNotice` 的 `notices` computed = 缓存 rows 过滤掉 readIds（已读彻底不展示）；`markAllRead`（=「知道了」）把当前可见通知全标已读并从展示列表剔除；SW 重新拉到同 id 因 readIds 有记录仍被过滤；readIds 超 1000 条清最早的（防 storage 无限膨胀）
- **两个 key 各司其职**：`tabMasterNoticeCache`（SW 写/sidepanel 只读，通知列表+下次拉取间隔）vs `tabMasterNoticeRead`（sidepanel 读写，已读 id 永久记录）
- **改通知拉取/缓存逻辑要联动**：`background.ts`(fetchNoticeCache+scheduleAlarm+ensureAlarm+onAlarm 分发) + `composables/useNotice.ts`(只读缓存+onMessage+已读永久过滤) + `types/notice.ts`(共享类型) + `components/NoticeBar.vue`(展示+markAllRead 触发) + `components/StoragePanel.vue`(key 清理) + `sidepanel.vue`(只解构 notices/unreadCount/markAllRead，onMounted 不调 fetchNotices)
- **三闹钟独立分发**：`background.ts` 的 `chrome.alarms.onAlarm` 按 `alarm.name` switch 分发到 `handleAdAlarm`/version/notice 三个 handler，互不串扰；三个闹钟名 `tabMasterAdSync`/`tabMasterVersionSync`/`tabMasterNoticeSync` 各自独立

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
| 主题装扮(商城驱动) | `composables/useSkin.ts` + `components/AvatarWithFrame.vue` + `assets/skin/skin-overlay.css` |
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

## L. 标签会话备份（阶段一完整本地闭环，2026-07-25）

### storage key 全部登记到 `StoragePanel.vue`
- `tabMasterBackupCache`（USER_DEFS）- 本地缓存快照数组，限长 50，受 5MB 配额约束
- `tabMasterBackupState`（SYS_DEFS）- 上次备份时间/快照数/缓存大小/失败原因
- `tabMasterBackupSettings`（SYS_DEFS）- 总开关 + 缓存开关 + 目录开关 + 配额 + 定时频率 + 保留天数 + 事件触发开关
- `tabMasterDeviceId`（SYS_DEFS）- 设备唯一标识（首次生成）
- `tabMasterBackupNoticeAck`（SYS_DEFS）- 首次开启 5 条限制告知确认状态
- `tabMasterBackupDirMeta`（SYS_DEFS）- 用户目录元信息（目录名/大小缓存/权限状态）；handle 本身在 IndexedDB `tabmaster_backup_fs`
- `tabMasterBackupUndo`（SYS_DEFS）- 恢复前快照 + 30s 撤销窗口

### IndexedDB（非 storage.local，但属于清理范围）
- `tabmaster_backup_fs` 库 `handles` store 的 `backup_dir_handle` 键 —— 用户目录 handle；解绑目录时清

### 改备份相关要联动
1. `composables/useBackupService.ts`（单例）—— 备份服务核心：采集 + 构建 BackupFile + 写缓存 + 状态/设置持久化 + 定时/事件/目录/GFS/锁定
2. `composables/useBackupRestore.ts` —— 恢复流程（预览+冲突解决+执行+撤销）
3. `composables/useBackupIO.ts` —— 导入导出流程
4. `types/backup.ts` —— BackupFile / Snapshot / SnapshotSummary / BackupSettings / BackupState / BackupDirMeta / BackupNoticeAck / BackupUndo / RestorePreview / ConflictItem / FpUnmatchedItem / ImportResult / ExportFormat / BACKUP_KEYS / BACKUP_ALARM_NAME
5. `lib/backup/fingerprint.ts` —— URL 规范化 + sha1 主/弱指纹 + uuidV4
6. `lib/backup/snapshotBuilder.ts` —— 快照构建（collectMeta + buildSnapshot）
7. `lib/backup/gfs.ts` —— GFS 分层保留清理
8. `lib/backup/fsAccess.ts` —— File System Access API 封装 + IndexedDB handle 持久化
9. `lib/backup/exporters.ts` —— JSON/Markdown/OneTab 导出
10. `lib/backup/restore.ts` —— 冲突检测 + fingerprint 匹配 + 恢复执行
11. `lib/backup/importers/{ours,onetab,nicetab,toby,vertitab,index}.ts` —— 五家格式导入解析器 + 嗅探
12. `components/BackupStatusCard.vue` —— sidepanel 首页底部入口卡片（紧凑态）
13. `components/BackupNoticeDialog.vue` —— 首次开启 5 条限制告知弹窗
14. `components/BackupSnapshotList.vue` —— Tab1 快照列表
15. `components/BackupRestorePanel.vue` —— Tab2 恢复与冲突
16. `components/BackupConflictDialog.vue` —— 冲突解决 git-merge 风格弹窗
17. `components/BackupRestoreConfirmDialog.vue` —— 恢复方式三选一弹窗
18. `components/BackupIOPanel.vue` —— Tab3 导入导出
19. `components/BackupSettingsPanel.vue` —— Tab4 设置
20. `tabs/backup.vue` —— 独立管理页（max-w-3xl，仿 logs.vue 范式，组合 4 个 Tab 面板）
21. `components/StoragePanel.vue` —— 新增 7 个 key 的清理登记
22. `sidepanel.vue` —— ErrorBoundary scope=backup 包 BackupStatusCard 挂载点
23. `background.ts` —— BACKUP_ALARM_NAME 闹钟分发 + onStartup 触发 + ensureBackupAlarm

### 红线
- 备份服务独立单例，**不侵入 useTabManager**（不改其结构 / 不调其方法）
- 只读 storage 老数据（customTags/tabTagsMap/laterTabs/recentlyClosed/tabGroups/tabMasterSettings），**不改老 key**
- 所有写 storage 走 `safeSet` + `toPure`（reactive proxy 序列化红线）
- 不调 `chrome.sessions.setTabValue`（Chrome 不存在）
- `chrome.tabs.query({})` 全量所有窗口，**不经过 sidepanel filteredTabs**
- File System Access API 仅在 sidepanel/options/tabs 页面调用，**不在 SW**（无用户手势）
- 恢复冲突**绝不自动合并**，永远 UI 让用户逐项选
- 未匹配 fingerprint **绝不强行绑定**，标红让用户手动指派或跳过
- 隐身窗口默认不恢复（不问，预览告知）
- manifest 新增 `idle` 可选权限（按需运行时申请，PRD §B）；不申请 `unlimitedStorage`
