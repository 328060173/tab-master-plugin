# 开发日志（历史归档）

> 从 CLAUDE.md 归档于 2026-06-30。这里是逐日完成记录 + 项目结构快照，**只读历史**。
> 当前状态/待办/决策看 `CLAUDE.md`；踩坑教训已沉淀进 memory（见 MEMORY.md 索引）。

## 当前开发进度（2026-06-29）

> **明天（2026-06-30）开工 checklist**：
> 1. `git status` 看未提交改动（这几天改了海量文件，详见下方 2026-06-29 清单）
> 2. **先重启 dev 验证构建**：`Ctrl+C` 停掉 → `rm -rf .plasmo/cache build` → `pnpm dev:safe` → 看到构建成功（无 ERROR）再 reload 扩展。今天 HistoryList.vue 一度被 agent 写成 HTML 转义全文+双 script 块导致构建失败，已重写修复
> 3. **重点回归测**：① 导航栏（首页/稍后/分组/历史）来回切不卡死 ② 聚焦模式开启→卡片出 checkbox 能勾选 ③ 4 视图（列表/平铺/图标/树形）批量都能用 ④ 历史页（先关几个标签产生数据）搜索/排序/恢复/移除 ⑤ 标记行：空态引导/chips 筛选/溢出更多/管理入口
> 4. 测通后跟用户确认是否 commit（红线：不自动 commit）
> 5. 然后继续：完整浏览历史 P1（见待办）

### 协作协议（2026-06-29 确立，务必遵守）
- **多 agent 分工**：实质需求走 `product-manager` agent 出 PRD（docs/prd/）→ `extension-frontend` agent 实现 → main 只做协调+审查。详见记忆 [[feedback-multiagent-and-no-regression]]
- **不跑 build/dev**：用户全天自己跑 `pnpm dev:safe`（输出 build/chrome-mv3-dev/，浏览器加载这个）。main 跑 build 会抢 `.plasmo/cache/parcel` 缓存导致"改了没生效"。main 只静态审查（grep 禁止模式 + tsc --noEmit）。详见 [[feedback-no-build-user-runs-dev]]
- **新功能不碰老功能**；**重构/统一既有代码需先经用户批准**
- **审查 agent 产出必查**：① Vue 模板复合语句 `@click="fn; x()"` ② 模板内 TS 断言 `as HTMLElement`/`(x as any)` ③ 新建 .vue 是否被 HTML 转义（grep `&lt;`）+ 是否多个 `<script setup>` 块 ④ 是否波及既有功能

### 2026-06-29 完成 ⭐

**浮层统一（PopoverManager）**
- 新建 `composables/usePopoverManager.ts`（单例 activeId + activeAnchorRect，全局 document click/Esc 关，installGlobalPopoverClose 在 sidepanel setup 调一次）
- 新建 `lib/popoverPosition.ts`（computePopoverPos：fixed + 按钮 rect 计算 + 视窗 clamp + 智能翻转）、`lib/zLayers.ts`（z 分层文档：popover60/hoverCard70/dialog100/contextMenu110/toast200）
- 所有浮层迁过来 + fixed+Teleport+z-[60]：视图/排序/清理(AppToolbar)、设置(HeaderMenu)、聚焦问号(FocusHelpBubble)、底栏更多(FooterStats)、搜索历史(SearchBox)、标记筛选(TagFilterPanel)、卡片标记(TagPicker)、分组菜单(GroupItem)、右键标记/编号(sidepanel)
- z-index 七档混乱（z-10~z-[9999]）全部统一

**汉堡菜单(TabHoverCard)统一**
- 从独立 `useHoverCard` 迁到 PopoverManager（每卡 `hover-card-{id}`），**删除 useHoverCard.ts**
- 影响 TabListItem/TabTileItem/TabIconItem/TabTreeItem/PinnedBar
- TabHoverCard 加 `hideAddTag` prop（固定标签隐藏标记按钮）

**批量功能（多轮重做，最终方案）**
- 入口在**普通标签容器右上角**（不在工具栏 flex 流，拖宽度不跑位）：普通态 `[批量]`，批量态 `[☑全选][更多▾][取消批量]`
- 全选 checkbox **三态**（全选✓/部分横杠 indeterminate/全不选空）
- 「更多」下拉：反选 / 关闭 N / 加入稍后 / 加入分组▸ / 添加标记▸（二级 hover 子菜单），「取消批量」独立退出
- **4 视图全支持**（含树形 TabTreeItem checkbox + provide('isTabSelected') 给递归子节点）
- 右键菜单加「选择此/同域名/同分组/全选可见」一步进批量
- 批量动作：关闭/稍后/加分组/加标记/全选/反选；切非 home tab 自动退出；聚焦选择态隐藏批量按钮

**标记体系**
- 修闭环 bug：卡片 TagPicker「添加」现在同时把新标记赋给当前卡片（之前只加全局列表→筛选不到）
- 卡片内嵌 TagPicker（TabListItem/Tile/Icon）+ hover 卡标记按钮复用之
- **搜索+标记重设计**（PRD docs/prd/search-and-tags.md）：搜索独立第 1 行、标记独立第 2 行（新建 `components/TagBar.vue`）。空态常驻「+ 添加标记」引导；chips 横排点击筛选(多选 AND)+选中×取消+[全部]清除；溢出末尾「更多(N)」；**管理入口始终显示**（没溢出时「···」按钮，进 TagFilterPanel 增删改）
- TagFilterPanel 加编辑✏️+删除✗（内联二次确认）+ 非空校验
- 固定标签去掉标记功能（PinnedBar 省空间）

**历史页 P0（零权限·最近关闭）**
- 新建 `components/HistoryList.vue`：复用已有 recentlyClosed（20 条，无需权限）；列表形式；搜索(标题/URL/域名)；排序(时间新→旧/旧→新/按域名)；时间分组(今天/昨天/更早)或域名分组；相对时间；点击恢复(restoreTab)；× 移除
- useTabManager 加 `removeRecentlyClosed`
- sidepanel：全局搜索框/TagBar/SearchResults/批量限制 `activeNav==='home'`（清理非首页冗余）；**导航栏和聚焦按钮保持 focusMode 判断不被误限**

**数据防御**
- useTabManager loadLater 全 try-catch 隔离；customTags/tabTagsMap 深度校验（sanitizeTabTagsMap：内层必须 string[]）；防御代码不阻塞主链（fire-and-forget + catch）

**PRD 产出**：docs/prd/batch-toolbar.md、search-and-tags.md、history.md

### 待办（2026-06-30 继续）
- **完整浏览历史 P1**（history.md 已设计：渐进式双模式——没授权只显「最近关闭」，授权后加「浏览历史」segmented 切换）：需 `chrome.history` 走 `optional_permissions`（运行时 chrome.permissions.request 申请）。**红线：改 manifest 前必查官方文档**（developer.chrome.com 当前网络拉不到，需用户那边能访问时核实权限名 + permissions.request/contains/remove 签名）
- 4 格矩阵实测（Chrome+Edge × Mac+Win）这几天积累的全部改动
- 这几天 build hash 反复是 f8401743 不变 = Parcel 缓存卡死的信号，遇到"改了像旧代码"先清 .plasmo/cache 重启

### 今天踩的坑（教训）
- agent 反复写坏 Vue 模板：复合语句、模板内 as 断言、**整文件 HTML 转义**、双 script 块 → 审查必查
- customTags 防御代码塞进 onMounted 主 await 链 → set 抛错让 loadTabs 不执行 → **全部标签消失**
- 批量重构丢了聚焦选择态对卡片的接线 → 聚焦没法勾选
- 历史 agent 误把 `activeNav==='home'` 加到导航栏 → 切走卡死回不来

---

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
---

## 2026-07-01 完成（大量重构 + 标记系统 + 一致性底线）

> 一天产出密集，主线：错误处理体系 → 标记功能两轮优化 → 固定标签拖动 → 状态栏与数据一致性 → 菜单动作统一抽象。期间因审查疏漏导致 4 次运行时白屏，已修正审查流程。

### 一、错误处理重做（每页独立 ErrorBoundary）
- 每个页面/区域独立 `ErrorBoundary`（`components/ErrorBoundary.vue`）包裹，scope 命名（later/groups/history/home/focus），崩了只降级局部、不波及其它
- 统一降级 UI「⚠️ 此区域出错了 / 其它功能不受影响」+ [重试此区域][去设置重新打开]
- ErrorBoundary 只 `console.error` 不写 storage（不依赖暂缓的日志功能）
- **聚焦态内容区补 ErrorBoundary**（之前漏了，补 scope="focus"）
- 全局兜底链：页面级 ErrorBoundary → 根级 onErrorCaptured → app.config.errorHandler → window.error/unhandledrejection
- 立规矩写进 [[pattern-unified-error-handling]] + agent 红线 F 节

### 二、标记系统两轮优化
**第一轮**（PM PRD `docs/prd/tag-system-redesign.md` → 落地）：
- `useTabManager`：addCustomTag 加 15 上限 + 15 字 + 重复校验（返回 boolean）；新增 reorderCustomTags；removeCustomTag 同步清 tabTagsMap
- `TagBar.vue` 重构：横向滚动替代折叠"更多"；chip=[手柄][名称][计数]；拖动排序；右键编辑/删除；问号引导
- 两个添加标记浮层加宽（TagPicker + 右键浮层 w-48→w-72, 3列→4列, z-60→z-80）

**第二轮**（体验修订）：
- TagBar 横滚 → **下拉 panel**（点 ▾ 展开 w-80 panel，内含拖动排序+编辑+删除+添加，收起即不可见）—— 解决"标记多了不好操作、编辑删除入口找不到"
- 问号移入 panel 头部，不占栏宽
- 有标记时行首加「标记：」label

**第三轮**（统一浮层，PM PRD `docs/prd/unified-tag-picker.md` → 落地）：
- 新建 `components/TagSelectPopover.vue` 统一组件，替换四处重复"添加标记"浮层（卡片汉堡/右键/批量/卡片内嵌）
- props: id/currentTags/allTags/mode(single|batch)/batchTabTags/placement
- 列数自适应（≤5单列/6-10双列/>10四列）；长标记 truncate+tooltip；选中态统一蓝底
- batch 三态（未应用/部分/全部），点击=全部应用或移除

### 三、固定标签拖动排序 + 菜单 bug 修复
- `PinnedBar` 加 GripVertical 手柄，HTML5 drag 拖动排序，`chrome.tabs.move` 真实移动
- **修 PinnedBar 菜单按钮失效 bug**：根因 sidepanel 的事件绑定用三元 `@copy="focusMode==='focusing' ? undefined : copyUrl"`，Vue 编译为 `$event => (三元)` 只返回函数引用不调用（用 @vue/compiler-sfc@3.3.4 实测确认）。改内联箭头函数
- `useTabManager` 补 `chrome.tabs.onMoved` 监听（之前缺失，拖动后顺序不刷新）

### 四、树形 5 层限制 + 滚动留白
- `buildTree` 加 `clampDepth`：超过第 5 层的节点提升到第 5 层并排（不丢失不无限嵌套），导出 MAX_TREE_DEPTH=5
- TreeGuideDialog 说明补充层级限制
- 滚动容器动态 pb-16（scrolled 时）避让「回到顶部」按钮挡最后标签的关闭/菜单

### 五、状态栏 + 数据一致性底线（⚠️ 最高优先级）
- **状态筛选自动回全部**：activeFilter 对应计数变 0 时自动回"all"（watch stats）
- **0 计数状态不可点**：FooterStats 按钮 disabled + 灰色
- **状态排序**：PRIORITY_ORDER 把 hasConnectedDevice(🔌) 提到 frozen 前（播放中→已静音→录制中→共享中→连接设备→冻结等）
- **固定标签数量不一致修复**（底线）：
  - `pinnedItems` 改从 `tabs.value` 直接派生（原经 filteredTabs 被筛选污染）
  - `onTabCreated` 加窗口判断（其他窗口标签不混入）
  - `currentWindowId` 从 tabs.query 结果推导（不用 chrome.windows.getCurrent，免权限）
  - 新增 onAttached/onDetached → 防抖 scheduleResync(200ms) → 全量 loadTabs（跨窗口移动兜底）
- **数据一致性底线写进 [[pattern-data-consistency-with-browser]] + agent 红线 G 节 + CLAUDE.md 红线**：开发+设计+测试都要保证插件数据=浏览器实际

### 六、菜单动作统一抽象
- 新建 `composables/useTabActions.ts` 统一标签操作动作逻辑（单标签+批量）：refresh/copyUrl/togglePin/toggleMute/duplicate/close/closeOthers/addToGroupSingle/.../batchClose/batchLater/batchAddToGroup/batchNewGroup
- 三个菜单（右键/汉堡/批量）+ 卡片都调它，改一处动作逻辑全菜单生效
- UI 耦合操作（later/setNumber/addTag 仍 sidepanel 管）
- `docs/code-map.md` 新增 J 节「标签操作菜单联动」：改一个操作要联动 3 步 + 各菜单引用函数矩阵

### 七、聚焦模式 UI 改造
- 聚焦态改**全屏黑罩 + 页面正中央大红「关闭聚焦」按钮**（像浏览器屏幕共享的"结束共享"）
- 蒙层 z-[150] 盖住所有（含固定标签，不可点），不盖 toast(z-200)
- 删除原底部红条退出按钮

### 八、存储持久性澄清 + 文档修正
- 修正 CLAUDE.md 错误流程「移除扩展 + 重新加载」→ 改为「点扩展刷新按钮」（移除=卸载会清空 chrome.storage.local）
- 补 storage 持久性速查：local 只在卸载时清，session 刷新/重启即清
- 写进 [[reference-chrome-api-docs]] 旁

### 九、审查流程升级（4 次白屏教训）
今天因审查疏漏导致 4 次运行时白屏：
1. `watch([stats, activeFilter])` TDZ（activeFilter 后定义）
2. `onEnterTagSubmenu` const 重复声明
3. `createGroup` 重复解构（useTabManager vs useTabGroups）
4. `useTabActions({showToast})` TDZ（showToast 后定义）

**共同根因**：vue-tsc 查不出 TDZ、查不出重复解构声明。已修正审查规范：
- 改 .vue 后必跑 **compileScript**（不只 compileTemplate/vue-tsc）—— compileScript 才抓重复声明
- **主动扫 setup 顶层执行顺序的 TDZ**（useXxx() 调用参数是否在定义前）
- 写进 [[lesson-compilescript-not-just-compiletemplate]] + CLAUDE.md 审查规范

### 十、运行日志功能（暂缓，待办已记）
- 需求记进 CLAUDE.md 待办：捕获所有日志（console.error/warn + Vue 错误 + window.error + unhandledrejection）统一写 chrome.storage.local
- `useLogger.installGlobalCapture()` 已写好拦截逻辑但未接入（时序问题未解决前不调用）
- 复活前必须先查官方文档 + 最佳实践

### 新增文件
- `components/TagSelectPopover.vue`（统一标记浮层）
- `composables/useTabActions.ts`（统一动作层）
- `docs/prd/tag-system-redesign.md`、`docs/prd/unified-tag-picker.md`
- 记忆：pattern-unified-error-handling / pattern-data-consistency-with-browser / lesson-compilescript-not-just-compiletemplate

### 待办（2026-07-02 继续）
- 🔥 `pnpm fresh` → 点扩展刷新按钮（不要移除）→ 全量实测今天所有改动
- 4 格矩阵实测（Chrome+Edge × macOS+Windows）
- 批量菜单 hover「标记」交互：PopoverManager 单例会关掉批量菜单，体验待确认（可能改 click 触发）
- 暗色模式精修、i18n 扩展
- 运行日志功能复活（先查官方文档）
- 后端相关（登录/同步）等后端就绪

---

## 2026-07-02 完成（批量布局迭代 + 标记校验统一 + 防白屏清单）

> 主线：批量按钮与普通标签容器的布局质感迭代（多次调整）+ 添加标记业务逻辑统一校验 + 提交前防白屏清单落地。期间因审查疏漏又出 2 次白屏（addCustomTag 未解构、useTabActions TDZ），已修。

### 一、批量按钮 / 普通标签容器布局迭代（4 轮）
用户反复反馈"批量按钮滚走、边框跳、半遮掩、没质感"，经多轮调整：
1. **sticky panel 常驻**（`bc85ac2`）：批量行 `sticky top-0` + 半透模糊 panel，常驻内容区顶部不随滚
2. **legend 跨边框**（`9a5cfc6`）：普通标签列表包进带边框 scroll-view，批量按钮 `absolute -top-3` 跨在边框上（fieldset legend 式），容器内自身滚动
3. **sticky 替代 absolute**（`66f8ffc`）：因双层滚动（contentRef 外层 + border 内层）导致 absolute 按钮随外层滚消失，改 `sticky top-0` + 去掉内层滚动
4. **抽屉式容器**（`3ae177b`，最终方案）：contentRef home 普通态 `overflow-hidden` 不滚；border 容器 `flex-1 flex flex-col` 撑满；批量按钮 `shrink-0` 固定顶部；标签区 `flex-1 overflow-y-auto` 内部滚。抽屉效果：容器和按钮固定，只标签在容器内滚，边框不跳不露
- 新增 `homeTabsScrollRef` 指向标签区，`onContentScroll`/`scrollToTop`/`scrollToActive` 适配新滚动容器
- 去掉 legend 上的「普通标签」4 字（用户要求）

### 二、添加标记业务逻辑统一校验（`42152d1`）
用户问"添加标记逻辑统一了吗"——捋清后发现底层统一（都走 addCustomTag）但前端校验各写各的，且有真 bug：
- **TagPicker 数据不一致 bug**：`handleCreate` 无论 addCustomTag 成不成功都 emit update 把标记挂到标签上 → 重复/超限时标签挂了全局不存在的标记
- **新建 `lib/tagValidate.ts`**：`validateTag(raw, existingTags)` 统一校验（trim + 空 + 15字 + 15个上限 + 重复），`TAG_MAX_COUNT`/`TAG_MAX_LENGTH` 常量，`TAG_INVALID_MSG` 提示映射
- 所有入口（TagPicker / TagSelectPopover / TagBar canSubmit+doAdd+doPanelAdd / 底层 addCustomTag）统一用 validateTag
- 入口样式不同（浮层/下拉panel/卡片内嵌），但判断逻辑一处定义处处复用

### 三、修 addCustomTag 未解构报错（`10a5bad`）
useTabActions 重构时误把 addCustomTag 从 useTabManager 解构删了，但模板 `@add-tag` 和 handleAddTag 内部还在用 → "addCustomTag is not a function" → 卡片/汉堡/搜索添加标记全报错。加回解构 + 所有 `@add-tag` 统一走 `handleAddTag`（带 toast + 上限提示）。

### 四、提交前防白屏清单落地（`46d74b3` + `60bf992`）
今天又出 2 次白屏（addCustomTag 未解构、useTabActions TDZ），用户强烈批评。写进 CLAUDE.md 协作协议 + 记忆 `lesson-precommit-checklist-after-bugs`：
- 改完代码必跑 5 步：① compileScript（抓重复声明/解构重名）② compileTemplate（抓模板 TS 断言）③ vue-tsc（抓类型）④ 顶层 TDZ 扫描（useXxx 调用参数是否在定义前）⑤ 未定义引用扫描（改解构后 grep 模板用到的函数是否还在）
- **绝不能只跑 vue-tsc 就提交**——它查不出 TDZ/重复声明
- 每次对照清单，不许跳过

### 五、消息通知感知 PRD（暂缓未实现）
- 用户问"100 个标签怎么知道哪个有消息通知" → 查官方文档确认 Chrome tabs API 无消息字段，`attention` 等字段全是硬编码 false
- PM 出 PRD `docs/prd/tab-notification.md`：用标题变化检测（`(3) Gmail` 模式），零额外权限，复用 attention 字段 + 底部状态栏筛选
- 澄清"网站弹的通知权限框"与扩展功能无关（那是网站请求系统通知权限）
- 用户决定暂不实现，PRD 留档

### 六、customTags 脏数据自愈（一次性 warn）
- 用户遇到 "customTags 在 storage 中被存成了非数组" warn —— 历史脏数据，防御代码已自动重置（loadLater 检测非数组 → 清空 → 写回 storage），一次性自愈，刷新后不再报

### 待办（2026-07-03 继续）
- 🔥 `pnpm fresh` → 点扩展刷新按钮 → 全量实测今天所有改动（重点：抽屉式批量容器、添加标记统一校验）
- 4 格矩阵实测（Chrome+Edge × macOS+Windows）
- 消息通知感知（PRD 已出，暂缓，将来想做时拿来实现）
- 两个 Vue warn（data-tabid/contextmenu 透传到多根卡片）看要不要修
- 暗色模式精修、i18n 扩展

---

## 2026-07-02 补记（标记不展示 + 首次绑标记 toast 修复）

> 用户反馈两个 bug：① 点齿轮菜单「重新打开」后搜索栏下 TagBar 的标记 chips 不展示；② 第一次添加标记没 toast。main 协调 extension-frontend agent 实现 + 审查，已提交 `0fc4c58`。

### 问题定位（main 静态分析 + 与用户确认复现路径）
- 用户点的「重新打开」是 **齿轮菜单的「重新打开」**（HeaderMenu onReload → `window.location.reload()`），**不是** StoragePanel「清空所有缓存」→ 排除 storage.local.clear 路径
- 标记名（`customTags`）本就持久化在 storage.local，普通刷新/重启/崩溃都不清；只有 StoragePanel 清空缓存或单项清理才会清 → 设计符合"用户添加的标记永远存在"底线
- 对齐 `docs/tag-disappearance-analysis.md` 的 Bug2 假说：`loadLater()` catch 分支在 reload 瞬间 `storage.get` 抛异常时把内存清空 → TagBar 空白

### 改动（3 文件）
1. **`composables/useTabManager.ts`**
   - `loadLater` catch 分支：不再清空 `customTags/tabTagsMap/...`，保留当前内存数据（守"标记名永远展示"底线）；仅 `tagSelectMode` 在 undefined/null 时兜底 "multi"
   - `updateTabTags`：`tagsSessionNoticeShown` 旗标从 `storage.local` 改存 `storage.session`（原存 local 导致"会话级提示"一辈子只弹一次；改 session 后每次浏览器开启后首次绑标记都弹一次，名副其实）
2. **`sidepanel.vue`**
   - `onTagsSessionNoticeChanged` 监听改 `area === "session"`
   - `handleAddTag` / `showToast` 加 dev-only `[tab-master:tags]` 诊断日志（协助定位"创建标记名 toast 不弹"——代码链路通，疑 stale build）
3. **`components/StoragePanel.vue`**
   - `__guides__` 的 keys 移除 `tagsSessionNoticeShown`（已改 session，不该在 local 存储面板显示）+ 更新 warning 文案

### 防白屏清单（main 亲跑，全过）
- ✅ compileScript（@vue/compiler-sfc@3.3.4）：265 bindings，无重复声明/解构重名
- ✅ compileTemplate：无模板 TS 断言/复合语句
- ✅ vue-tsc --noEmit：仅 tsconfig 既有 deprecation 警告（TS5107/TS5101），与本次改动无关，无类型错误
- ✅ TDZ 扫描：handleAddTag(761)→showToast(1022) 是运行时事件 handler，setup 完成后才触发，无 TDZ
- ✅ 未定义引用扫描：未删任何解构名，StoragePanel 移除的只是字符串 key，无悬空引用

### 待用户验证（main 不跑扩展）
1. `pnpm fresh`（清 .plasmo+build 绕缓存）
2. chrome://extensions 点扩展「刷新」（⚠️ 不要移除，移除=卸载清 storage.local）
3. Bug1：加几个标记 → 点齿轮「重新打开」→ TagBar 标记应仍在
4. Bug2-a：完全关 Chrome 再开 → 首次绑标记 → 应弹"标记绑在当前标签页…"toast；同会话再绑不弹；下次开 Chrome 又弹
5. Bug2-b：TagBar 空状态创建标记名 → 应弹"已添加标记「x」"。若还不弹，看侧栏 Console `[tab-master:tags]` 日志定位

### 待办（明天继续）
- 🔥 上述 5 步实测验证（重点 Bug2-b：若 pnpm fresh 后仍不弹，按 console 日志在哪一步断的继续定位）
- 4 格矩阵实测（Chrome+Edge × macOS+Windows）
- 批量菜单 hover「标记」交互体验确认
- 暗色模式精修、i18n 扩展
- 运行日志功能复活（先查官方文档）

---

## 2026-07-03 标记系统修复（reactive proxy 真凶 + 提示 UX 优化）

### 核心问题：标记重启浏览器后丢失 — reactive proxy 真凶

**症状**：用户反馈重启浏览器后工具栏标记列表（customTags）丢失；控制台每次报 `[tab-master] customTags 在 storage 中被存成了非数组 [object Object]`。

**真凶**：`customTags = ref<string[]>([])` 的 `.value` 是 Vue reactive proxy 数组。`chrome.storage.local.set({ customTags: customTags.value })` 内部用**结构化克隆**序列化参数，把 proxy 数组克隆成数字键对象（`["工作"]` → `{"0":"工作"}`）。读回时 `Array.isArray` 失败，被 `loadLater` 防御性校验当脏数据重置成 `[]` → 标记全丢。`tabTagsMap` 内层 string[] 同理变对象被 `sanitizeTabTagsMap` 丢弃。

**关键误导**：`JSON.stringify(customTags.value)` 走 Array.prototype 输出数组（日志看着正常），但 storage 里实际是对象——`[tag-debug]` 日志显示数组，与 storage 实际不符。

**修复**：`useTabManager.ts` 顶层加 `toPure = (x) => JSON.parse(JSON.stringify(x))` helper，所有写 storage 的 set 用 `toPure(...)` 转纯 JSON。涉及 `updateTabTags` / `addCustomTag` / `removeCustomTag` / `renameCustomTag` / `reorderCustomTags`。

**memory**：[[lesson-reactive-proxy-storage-serialize]]（ref.value 是 proxy，chrome.storage.local.set 把数组克隆成数字键对象，写前必 toPure）。

### tagsSessionNoticeShown 改回 storage.local + 提示改 ConfirmDialog

- 2026-07-02 改 session（每会话首次绑都弹）→ 不合理，改回 **storage.local**（用户首次绑标记只提示一次，清缓存才重置）
- toast 2 秒消失看不清 → 改 **ConfirmDialog 模态弹窗**（需点按钮才关）
- ConfirmDialog 加 `centerTitle`（标题居中）+ `highlight`（amber 警示框）两个可选 prop
- 文案排版分主次：标题「标记关联提醒」居中 / message=现象（灰）/ highlight=「由于浏览器 API 规范，同一网址每次打开标签 ID 不同…」amber 强调 / hint=后续 URL 优化（蓝框）

### TagBar 类型收窄 + 文案 DRY

- `isDuplicate` / `isPanelDuplicate`：`!r.ok && r.reason` 在 `&&` 里部分 TS 工具不收窄 → TS2339。改 `r.ok === false && r.reason`，TS 一定收窄
- TagBar 标记绑定局限提示原在空状态帮助块(84) + panel 帮助块(158) 重复两遍 → 提取 `TAG_BIND_NOTICE` 常量复用，文案加「由于浏览器 API 限制」前置

### 临时诊断日志（已清除）

排查期间加的 `[tag-debug]` 日志（loadLater/addCustomTag/remove/rename/reorder/loadTabs + sidepanel onCustomTagsChanged 监听）已完成使命，全部清除（sed + 手动 Edit），保留 toPure 修复与原有 DEV 日志。

### 装 ui-ux-pro-max-skill plugin（本地手动安装）

`/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` 因 SSH clone GitHub 超时失败。本地 zip 解压版无 .git，git clone 也不行。手动装：
1. `cp -rf ~/Desktop/ui-ux-pro-max-skill-main ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill`
2. `known_marketplaces.json` 加 `local` source 条目

⚠️ `source: "local"` 是推断格式（未查到官方文档确认），重启 Claude Code 后 `/plugin` 验证；不识别则改 `directory`/`path`。

### 提交记录
- `c68baf6` fix(标记): tagsSessionNoticeShown 改 local + 加诊断日志
- `87d116c` fix(标记): 修 reactive proxy 被 storage 序列化成对象导致标记全丢（真凶）
- `d52b8a5` feat(标记): 首次绑标记提示改确认框 + 文案通俗化
- `53760f4` chore(标记): 去除 tag-debug 诊断日志 + 弹框文案排版优化
- `88504ed` fix(标记): 修 TagBar isDuplicate 类型收窄
- `4e05c65` refactor(标记): TagBar 标记绑定提示提取常量 + 加「由于浏览器 API 限制」

### 防白屏清单（每步都跑，全过）
compileScript + compileTemplate（sidepanel/ConfirmDialog/TagBar）+ vue-tsc --noEmit + TDZ 扫描 + 未定义引用扫描。

### 待用户验证（重启后）
1. `git pull` + `pnpm fresh` + chrome://extensions 刷新扩展（⚠️ 不要移除）
2. 添加标记 → 首次绑标记弹「标记关联提醒」ConfirmDialog（amber 框强调 API 规范）
3. 重启浏览器 → 工具栏标记**应还在**（reactive proxy 修复生效）；Console **不应再报** customTags 非数组
4. `/plugin` 看 ui-ux-pro-max-skill marketplace 是否识别（local source 格式待验证）

### 2026-07-04：标记叉号崩溃 + 全量审计修复（3 commit）

**起因**：用户报「标签列表点汉堡菜单 → 标记 chip 右上角叉号点击没反应，多点几次浏览器卡崩」。

**根因 1（数据破坏级）**：`TabHoverCard.onRemoveTag` 直接调 `useTabManager().updateTabTags`，但 useTabManager 非单例 → 拿独立空实例（`tabs=[]`、`tabTagsMap={}`）→ UI 不更新（"没反应"）+ `storage.set({tabTagsMap:{[id]:x}})` 把整个标记表覆盖成只剩当前 tab → 反复点击反复覆盖 + 卡顿。

**修复 1**（`c0ab81b`）：TabHoverCard 改 emit `updateTags`，由 List/Icon/Tile/Tree/Pinned 五视图转发到 sidepanel 主实例。

**根因 2（同源扩散 + 数据丢失）**：全量审计发现：
- `useTabActions.ts:17`、`TagBar.vue:448` 也直接调 `useTabManager()` 拿独立实例 → `togglePin`/`moveToLater` 等功能失效 + 3 份 chrome.tabs.onXxx 监听器堆积
- `laterTabs`/`recentlyClosed`/`tabOpenedAtMap`/`treeParentMap`/`tabNumberMap`/`storageUpdate` 写 storage 漏 `toPure` → reactive proxy 数组被结构化克隆成数字键对象 → 读回 `Array.isArray` 失败被重置 → 稍后处理/最近关闭/树关系/打开时间重启后丢失（同 [[lesson-reactive-proxy-storage-serialize]] 陷阱，tabTagsMap/customTags 已修，这几个漏网）

**修复 2**（`f0aa711`）：
- A. **useTabManager 单例化**：模块级 `_instance` 缓存，所有调用共享。onMounted/onUnmounted 只在 sidepanel 顶层第一次调用时注册。零波及其它文件。监听器 3 份→1 份，togglePin/moveToLater 等功能恢复。
- B. **storage 写入全加 toPure**：10 处 storage.set 改用 `toPure()`。

**审计范围与限制**：派 4 个 Explore agent 审计标记/搜索/聚焦/稍后/分组/历史/整理/通用基础设施，但 3 个因 API 周配额超限失败（429，2026-07-06 重置）。改用 grep 全量扫 `useTabManager` 调用点 + `storage.set` + 监听器配对，覆盖高危项。`useCleanup.ts` 检测算法健康（O(n) Map 分桶 + 异常值处理）。`background.ts` SW 健康（循环检测 + 节流）。`useFocusMode.ts` try-catch 完整。**未覆盖**（配额+时间）：搜索防抖、历史授权状态机、分组事件防抖等中低风险项；单例化间接修复了这些模块若调 useTabManager 的问题，后续可补。

### 提交记录
- `c0ab81b` fix(标记): TabHoverCard 删标记改 emit 链路，修独立实例致 UI 不更新 + storage 覆盖
- `9103211` docs: CLAUDE.md 红线加「子组件禁直接调 useTabManager 写方法」（后由 f0aa711 单例化更新为 toPure 规则 + 单例已实现）
- `f0aa711` fix(架构): useTabManager 单例化 + storage 写入全加 toPure

### 防白屏清单
vue-tsc --noEmit 通过（仅 tsconfig 既有弃用警告 TS5107/TS5101）。本次只改 .ts（useTabManager.ts），无 .vue 改动，compileScript/compileTemplate 不适用。

### 待用户验证
1. `git pull` + `pnpm fresh` + chrome://extensions 刷新扩展（⚠️ 不要移除）
2. 标签列表点汉堡菜单 → 标记 chip 叉号 → 立即消失 + 其它标签标记不受影响
3. 点固定/静音/稍后处理 → 功能正常 + UI 实时刷新
4. 重启浏览器 → 稍后处理列表/最近关闭/树关系仍在（toPure 修复生效）
5. ⚠️ 之前因 bug 已丢失的标记/稍后项需重新绑（代码修复不恢复已丢数据）

### 2026-07-04（续）：标记架构重做——意图式 API 修删标记 bug（commit d1ea3f7）

**用户反馈**：① 有多个标记的标签，叉掉一个，另一个也没了；② hover card 标记叉不掉。

**根因**：`TabHoverCard.onRemoveTag` 用 `props.item.tags.filter(t => t !== tag)` 计算 newTags。props 经过 Teleport + 多层 computed 传递可能旧值，用旧值 filter 会删错（如 props 只有一个 tag 时 filter 出 `[]`，把别的 tag 也带没）。其它入口（batchRemoveTag/toggleRightClickTabTag）都用主实例 `tabs.value` 查，唯独 onRemoveTag 用 props——脆弱点。

**架构 review 结论**：标记操作分散在 7+ 入口（TagBar/TagPicker/TabHoverCard/右键/批量），部分用 props 计算新数组（脆弱），部分用主实例 tabs 查（鲁棒），不统一。

**修复（方案 B：意图式 API + 删除链路）**：
- useTabManager 加 `addTabTag(id, tag)` / `removeTabTag(id, tag)` / `toggleTabTag(id, tag)`——内部用主实例 tabs.value 查当前 tags 再算，调用方只传意图不传完整数组、不依赖 props
- TabHoverCard.onRemoveTag 改 emit('removeTag', tag)（只传 tag 名）
- 5 视图（List/Icon/Tile/Tree/Pinned）转发 removeTag
- sidepanel: 动态组件/PinnedBar 加 @remove-tag 调 removeTabTag；treeAction case 'updateTags' → 'removeTag'

**校验**：compileScript + compileTemplate（@vue/compiler-sfc@3.3.4）+ vue-tsc 全过。

**后续可选**：TagPicker toggle 仍用 props.currentTags 计算（同源风险，用户未报），可改造走 toggleTabTag 进一步消除 props 依赖（方案 C，未做）。

### 待用户验证（追加）
6. 标签列表点汉堡菜单 → 多标记标签叉掉一个 → 只删那个，其它标记保留
7. hover card 标记叉号 → 立即生效
