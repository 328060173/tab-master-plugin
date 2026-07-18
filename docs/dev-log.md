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

### 2026-07-04（续2）：方案 C——TagPicker toggle 改意图式（commit f44cf72）

**用户反馈**：鲁棒性差，改一个功能影响别的；一个功能多个地方少改；code-map 没更新。

**根因**：TagPicker 的 toggle 用 `props.currentTags` 计算新数组（同 onRemoveTag 的 props 依赖根因，props 旧值会算错）。5 处 TagPicker 使用点（TabListItem/Icon/Tile + SearchResults×2）。

**修复（方案 C）**：
- TagPicker: emit `update` → `toggleTag`；@toggle 转发不计算；handleCreate 改 toggleTag
- 5 视图 + SearchResults: @update → @toggleTag + emit updateTags → toggleTag
- sidepanel: @update-tags → @toggle-tag 调 toggleTabTag
- 命名：`toggle` 已被「批量选中」占用，标记切换用 `toggleTag` 避免冲突

**遗漏检查**：grep emit update / @update / @updateTags / @update-tags 全空，无遗留。

**code-map 更新**：`docs/code-map.md` 加 K 节「标记操作联动」——记录标记操作全部入口 + 意图式 API + 联动文件清单（5 视图 + SearchResults 容易漏），避免后续少改。

**校验**：compileScript + compileTemplate（9 .vue）+ vue-tsc 全过。

### 待用户验证（追加2）
8. TagPicker 勾选标记（卡片 Tag 按钮）→ 立即生效
9. 搜索结果里的标记勾选 → 正常

### 2026-07-04（续3）：检测长期未用标签阈值支持自定义输入

**需求**：整理菜单「检测长期未用标签」阈值原只有 1/3/7/30 四个固定 select 选项，改为也支持用户输入数字（1-30 正整数）。

**实现**（`components/DetectReviewDialog.vue` 一处，sidepanel 不用改）：
- 4 个快捷 chip（1/3/7/30 天）一键切换
- 数字 input（type=number min=1 max=30）支持自定义；`@change` 校验：空/小数/<1/>30 自动复位到当前 thresholdMs 对应天数
- `customDays` ref + `watch(thresholdMs)` 同步：chip 切换时 input 显示对应天数，input 输入时 emit ms 给 sidepanel 重算
- thresholdMs 通用（ms），sidepanel `onChangeUnusedThreshold` 不变

**校验**：compileScript + compileTemplate + vue-tsc 全过。

---

## 2026-07-06 完成（整理菜单 + 排序 + TagBar 标记栏，12 commit）

### 整理菜单优化（3 commit）

**bf70316 检测长期未用标签空结果直接打开弹窗**
- 需求：原点击「检测长期未使用标签」若默认 1 天无命中，弹 toast「未检测到长期未用标签」不弹窗。用户嫌「长期」模糊、且想直接看到天数选项
- 改：`sidepanel.vue openDetectUnused` 删空结果 toast 拦截，无论命中与否都打开弹窗
- `DetectReviewDialog.vue` 空状态文案改「暂无超过 X 天未使用标签」（用 `customDays` ref，随阈值切换/自定义输入更新）；title 空结果时同文案
- cac5d95 同步修过时注释（原「sidepanel 已拦截」过时）

**1f4ac35 检测弹窗去恢复提示 + 标记筛选模式默认改单选**
- `DetectReviewDialog.vue` 删底部「💡 Ctrl+Shift+T 逐个恢复」提示（挤占按钮空间）
- `useTabManager.ts` `tagSelectMode` 默认 `multi`→`single`（默认值 + storage 读取兜底 + 异常兜底，3 处）；`StoragePanel.vue` 重置提示文案联动「单选」
- ⚠️ 老用户已存 multi 不会自动变（只影响无 key 的新用户/重置后）

### 排序功能（4 commit）

**29d819a 域名排序同 host 内改打开时间正序**
- `lib/sortUtils.ts` domain 分支第三级（同完整 host 内）从倒序改正序，新打开的在后
- 排序入口唯一（sortTabs 只在 sidepanel.vue:1215 调一次），list/tile/icon 三视图共用 sortedNormalItems，groupByDomain 组内继承传入数组——改 1 处全联动，无需抽象

**5cba3d7 新增「最新访问优先」排序 + sortMode 持久化**（PM PRD → 开发）
- PM agent 出 PRD `docs/prd/recent-activity.md`：三方案对比后选方案 3（排序选项），否决新 tab / 首页折叠区
- `sortUtils.ts` `sortTabs` 加 `lastAccessed` 分支：按 `getEffectiveAccessTime` 倒序（最新访问在最上），缺失降级 `openedAt`
- `AppToolbar.vue` `SORT_OPTIONS` 第二位加 `{ value: "lastAccessed", label: "最新访问优先" }`
- `sidepanel.vue` `sortMode` 持久化（localStorage，和 viewMode 一致）+ `setSortMode` 函数；`@sort-change` 改调函数（原内联 `sortMode = $event`）
- 切标签自动升顶：`onTabActivated`（useTabManager.ts:548）已更新 `lastAccessed = Date.now()` → `sortedNormalItems` computed 自动重算，无需改 onTabActivated
- 默认排序保持「按域名」（PM 决策，不改老用户体验）

**0dfb087 getEffectiveAccessTime 移至 sortUtils 打破循环依赖**
- 5cba3d7 让 sortUtils import useCleanup 的 getEffectiveAccessTime，但 useCleanup 已 import sortUtils 的 parseTime → 循环依赖（vue-tsc 查不出，运行时隐患）
- 修：getEffectiveAccessTime 从 useCleanup 搬到 sortUtils（时间工具同源），useCleanup 改为从 sortUtils import。依赖变单向 useCleanup→sortUtils。DetectReviewDialog import 路径同步

**5987499 排序 label 改名**
- 按访问时间 → **最新访问优先**（明确"最新置顶"语义）
- 时间正序 → **按打开时间正序**；时间倒序 → **按打开时间倒序**（加"打开"区分"访问"）
- value 不变，仅 label

### TagBar 标记栏（4 commit）

**0a66a49 删除标记确认后保持「管理标记」panel 不关**
- 需求：点「确认删除」后想回到「管理标记」页面且刷新数据，不要收起
- 根因：不是 doDelete 关了 panel，而是 ConfirmDialog 按钮 click 冒泡到 document，触发 PopoverManager 全局 closeAll 误关下层 panel
- 修：`ConfirmDialog.vue` 遮罩改 `onMaskClick`（`stopPropagation` + `target===currentTarget` 判断），阻止内部 click 冒泡。确认/取消/遮罩后 panel 保持，`props.tags` reactive 自动刷新
- 附带影响（非破坏）：清理菜单 ConfirmDialog 确认后「整理 ▾」popover 改前被意外关、改后保持（修正副作用）

**11cbe06 + a9ff771 TagBar chips 最多 3 行 + 超出截断「更多」按钮**
- 需求：原单行溢出隐藏，超 1 行的标记看不到。改为最多 3 行，超出截断 + 末尾「更多」按钮
- 实现：隐藏测量层（`invisible` 绝对定位）渲染所有 chip + 更多按钮测宽度，模拟换行算 `visibleCount`；真实容器只渲染前 N 个 + 更多按钮
- 触发重算：onMounted + watch tags.length/tabCountByTag + ResizeObserver（rAF 防抖）
- 「更多」popover 显示剩余标记，复用 `toggleTag` 筛选，保持弹层可连选
- **a9ff771 修 agent 漏的 bug**：测量层 chip 用 `<span>` 缺 `shrink-0`，首次测量时 containerWidth=0、DOM 未同步，span 默认 flex-shrink:1 被 shrink 到 0 → offsetWidth=0 → 算成 1 行 → 全显无更多按钮 → 第 4 行+被截断的标记看不到也无入口。加 shrink-0 与真实 chip 一致

**a595da9 全部按钮移进 chips 行，折行对齐下拉框右侧**
- 需求：原布局 `[标记:][单选▾][全部][chips容器 flex-1][▾]`，chips 容器在「全部」右侧，折行第二行对齐到「全部」下方，左边「标记:/单选▾/全部」下方空一大排
- 改：「全部」按钮从独立位置移进 chips 容器作为首元素（参与 flex-wrap），chips 容器紧跟 select。第二行对齐到全部按钮 = 下拉框右侧
- 测量同步：测量层加 `data-all`，`measure()` 第一行起始宽度算上 `allWidth`（全部按钮占位），避免 visibleCount 偏大

### 过程教训（已沉淀 memory）

- **agent 多次超范围引入 bug**：本会话 extension-frontend agent 多次超范围改动——把 `isProtectedUrl` 的 `about:` 改成 `about://`（保护页识别失效）、把 `reorderCustomTags` 重命名成 `reorderCustomTag`（调用方引用失败）、引入 sortUtils↔useCleanup 循环依赖、漏加测量层 shrink-0。还出现 agent **没 commit 却报告"已完成"**。main 审查靠 `git diff` 全文 + `git log` 确认 commit 才发现。已更新 memory `feedback-multiagent-and-no-regression` 加"审查三步：diff 全文 → git log 确认 commit → 防白屏清单"
- **HMR 缓存不一致**：用户遇 Vue warn（`morePopoverId`/`visibleTags` 等未定义），源码 + compileScript bindings 全正常。判断是 Plasmo/Parcel HMR 累积局部更新导致 template（新）和 script setup（旧缓存）不一致 → `pnpm fresh` 解决

### 待用户验证（2026-07-06）
1. 排序选「最新访问优先」→ 最新访问的标签在最上；切标签 → 该标签自动升顶
2. 刷新扩展 → 排序选择保持（localStorage 持久化）
3. 排序下拉显示新文案：最新访问优先 / 按打开时间正序 / 按打开时间倒序
4. 标记栏多标记（>3 行）→ 前 3 行 + 末尾「更多 ▾」；点更多看剩余标记可筛选
5. 拖动 sidepanel 宽度 → chips 自适应重排
6. 删除标记：确认/取消/遮罩后「管理标记」panel 保持 + 列表刷新
7. 域名排序同 host 内 → 新打开的标签在后
8. 检测长期未用标签：空结果直接弹窗 + 「暂无超过 X 天未使用标签」+ 无恢复提示
9. 标记筛选下拉框 → 新用户/重置后默认「单选」
10. 清理菜单危险项确认后 → 整理 popover 保持（点空白可关）



---

## 2026-07-12 账号体系 + 运营变现 + 版本检查（跨三线大迭代）

> 本日跨插件/后端/官网三线，建立账号体系、功能分级、运营变现（广告+捐助）、版本检查、消息通知。**后端暂缓约束解除**（后端已就绪，登录链路通）。共 33 commit（插件 25 + 后端 7 + 官网 1）。

### 插件仓（25 commit，test 分支）

**账号体系**
- `useAuth.ts` 单例：token 持久化（chrome.storage.local）+ 401 自动登出 + sessionExpired（区分过期/主动登出）+ 注册 tokenGetter/loggedInGetter 到 api.ts
- `LoginDialog.vue`：邮箱+图形验证码（复用 CaptchaInput）+ 邮箱验证码 60s 倒计时 + 登录即注册提示 + 登录/注册合并
- 登录流程：发码（消费图形码）-> 刷新新图形码 + 清空 captchaCode -> 用户填新图形码+邮箱码 -> 登录（修复置灰 bug）
- 登录请求传 accessDeviceInfo + accessLoc + versionCode + loginType

**统一请求拦截（lib/api.ts）**
- buildHeaders 统一构建：公共头（platform/appCode/versionCode）+ Authorization Bearer + customerType（1登录/0未登录）
- 统一请求日志 `[api] -> / <-`（所有请求自动打，silent 选项降级 warn）
- RequestOptions 加 params（URLSearchParams 拼 query，GET 用）
- 环境区分：`process.env.NODE_ENV`（dev localhost:8080 / prod api.ouu365.com，不用 import.meta.env.DEV 不稳定）
- 401 拦截 -> authExpiredHandler 清登录态

**功能分级**
- `config/feature-tiers.ts`：27 功能三表（未登录 22 / 登录 4 / VIP 5 预留，当前无 VIP）
- `useFeatureTiers.ts` 单例：canUse 判断，VIP 预留扩展

**图形验证码（复用官网）**
- `CaptchaInput.vue`：搬官网，Tailwind 样式，@lucide/vue，i18n 接入，5s 超时 + 失败重试占位

**版本检查**
- `useVersionCheck.ts` 单例：每天自然日去重 + 3s 超时 + 静默失败 + 缓存兜底
- `UpdateBanner.vue`：强制更新红色无关闭按钮 / 非强制蓝色可关
- `POST /version/check-version`（改 POST，GET+RequestBody 前端不好发）+ 传 accessDeviceInfo + versionCode=101 + customerType

**广告位**
- `useAd.ts` 单例：每天最多 3 次 + 点击/关闭按 adId 当天不再展示 + 自然日重置 + 3s 静默失败
- `AdBanner.vue`：底部 10 秒弹层 + 倒计时进度条 + 图片失败降级
- **登录用户不显示广告**（前端 isLoggedIn 判断 + 后端 customerType 兜底双保险）

**消息通知**
- `useNotice.ts` 单例：拉 GET /notice/page-list + 按 id 记已读 + 5s 静默失败
- `NoticeBar.vue`：铃铛 + 未读数红点 + 展开列表 + 全部已读（**无数据不显示整条**）

**设置菜单（HeaderMenu 6 项改造）**
- 未登录显「登录 / 注册」；已登录显邮箱 + 「退出登录」（红色，登录后才显示）
- 6 项：登录/加群联系/反馈/操作说明/打赏（跳官网或 guide 页）
- 邮箱行点击进「我的」页（chrome.tabs.create mine.html）

**「我的」页（tabs/mine.vue）**
- 首字母头像 + 邮箱 + VIP 标记 + 账号信息 + 功能入口 + 退出登录
- 未登录保护

**操作说明（tabs/guide.vue）**
- 功能概览 / 快捷键（Mac Option+Shift / Win Alt+Shift）/ FAQ / 联系我们

**登录引导 banner**
- 当天频控（toDateString 比对，7 天->当天）+ 全局化（4 tab + 聚焦态都显示）
- 登录后 watch isLoggedIn 自动隐藏

**基础设施**
- `manifest` host_permissions 加 `http://localhost/*` + `http://127.0.0.1/*`（本地联调，prod 不扩大权限）
- `config/app-config.ts` 配置中心：API_CONFIG / HEADERS_CONFIG / BUSINESS_CONFIG（9 项 TODO 后续后端返回）
- `lib/device-info.ts` 通用设备信息收集（会话级缓存，login/version 复用）
- i18n 全接入 t()/tWithParams（zh-CN + en-US）
- StoragePanel 注册 4 个新 key（banner/version/ad/notice）

### 后端仓（7 commit，test 分支）
- `26db047` 发码+登录加图形验证码校验（Redis + 防重放，复用若依 validateCaptcha）
- `eff38a4` 广告接口 GET /ad/list（@Anonymous，生效中广告按 sort，MyBatis 全 #{} 无拼接）
- `e776e53` 删 EmailCreateRequest.captcha 死字段
- `9404e4d` checkVersion 加 @Anonymous（未登录可检查）
- `f9b59ef` checkVersion GET->POST + customer/my 接口（假数据，CustomerMyVO 隔离敏感字段）
- `5598043` getAdList 按 customerType 过滤（登录返回空，双保险）
- logout 用若依自带（SecurityConfig logoutUrl("/logout") + LogoutSuccessHandlerImpl 删 token，**无需新建 Controller**）

### 官网仓（1 commit，test 分支）
- `45a86c2` /donate + /contact 页面 PRD（二维码打包进 public/qr/，合规资源红线，需 4 张二维码图）

### 关键审查修复（不只信 agent 报告）
1. CaptchaInput 重复 `</template>` 致 Plasmo 白屏（sfc.parse errors 没检，已加进防白屏5步，白屏教训 4->5 次）
2. LoginDialog 发码成功误关弹窗 -> 保持打开
3. 登录按钮置灰（发码后刷新图形码+清空 captchaCode，用户填新码才亮）
4. baseURL 走 prod（import.meta.env.DEV 不稳定 -> 改 process.env.NODE_ENV）
5. host_permissions 没覆盖 http://localhost（Failed to fetch 根因）
6. /ad/list 缺 position 参数（500 -> 加 params 支持）
7. AdBanner 重复 defineEmits（sfc.parse 抓到）
8. 后端 OuuCustomerController#my 重复声明 Long customerId（api-backend 改一半粘重）
9. 反馈菜单锁"需登录"是错的（后端 /feedback/suggest 是 @Anonymous）

### 过程教训（已沉淀 memory）
- **防白屏5步强化**：sfc.parse 的 errors 必检（compileTemplate 遇首个 `</template>` 截断，抓不到重复闭合标签；Plasmo 用 sfc.parse 验整体结构会报错）。白屏教训 4->5 次
- **后端暂缓约束解除**：`project-defer-backend-features` 记忆更新为"2026-07-12 解除暂缓，后端已就绪"
- **agent 卡住直接接手**：版本检查 agent 卡在 i18n 造轮子（i18n 本就有 tWithParams），main 接手完成省时间

### 待用户验证（2026-07-12）
1. `pnpm fresh` + 刷新扩展（改了 manifest + 新增 tabs/mine.vue + tabs/guide.vue，必须全新构建）
2. 后端起服务 localhost:8080 + 部署最新代码 + 建广告表（执行 sql/ouu_advertisement.sql）
3. 控制台日志：所有请求 `[api] -> / <-`，请求头带 appCode=app_1001 + versionCode=101 + customerType（登录1/未登录0）+ Authorization（登录后）
4. 登录链路：banner 点击 -> 弹窗 -> 邮箱+图形码+邮箱码 -> 登录成功 -> banner 消失 -> 设置菜单显邮箱
5. 版本检查：POST /version/check-version（带 accessDeviceInfo）-> 强制更新红色横幅不可关 / 非强制蓝色可关 / 后端关静默
6. 广告：未登录底部 10 秒弹层 + 点击/关闭按 adId 当天不再显 + 每天 3 次上限 + 登录后不显示
7. 消息通知：无数据不显示 / 有数据铃铛+未读数+展开
8. 退出登录：设置菜单「退出登录」-> POST /logout（若依自带）-> 清 token -> 菜单恢复
9. 「我的」页：点邮箱进 -> 首字母头像+账号信息+功能入口+退出
10. 设置菜单 6 项：加群/打赏跳官网、操作说明跳 guide、反馈占位

### 待办（后续开发）
- **FeedbackDialog 反馈弹窗**：复用 CaptchaInput，接 POST /feedback/suggest（@Anonymous 免登录 + 图形码防滥用）
- **customer/my 接真实数据**：后端接 IOuuCustomerService.selectOuuCustomerById 替换假数据
- **useAppConfig**：启动拉 GET /app-config（待后端开发），合并到 BUSINESS_CONFIG，失败用前端兜底（9 项 TODO）
- **「我的」页 onOpenLogin 补全**：未登录访问 mine 页点"去登录"需 sendMessage 触发侧边栏登录弹窗
- **web-fe 实现官网 /donate /contact**：PRD 已出，需 4 张二维码图（微信赞赏码/支付宝/微信群/公众号）
- **后端配真实数据**：ouu_advertisement 广告内容、ouu_apps_version 版本记录、ouu_apps_notice 通知
- **预留扩展**：VIP 会员（功能清单已留 5 功能，isVip 永远 false）、云同步（3 类已分级，功能暂缓）、第三方登录

---

## 2026-07-16 开发进度（跨三仓大改造，test 分支）

### 插件仓（多 commit）
- **SW 后台拉取架构**：广告/version/notice/setting 四接口全部从 sidepanel onMounted 发请求改为 Service Worker 后台定时拉取 + sidepanel 只读缓存。四闹钟独立（tabMasterAdSync/VersionSync/NoticeSync/SettingSync），onAlarm switch 分发，后端下发 nextSyncIntervalMinutes + 前端 0~60min 随机偏移错峰。sidepanel 禁止任何 fetch（核心红线）。
- **广告展示即消费**：onAdDismiss/onAdExpired/onAdClick 把缓存 adData 置 null，本时间窗口不再弹；SW 下次拉新广告才再弹 1 次。间隔由后端 AdPositionEnum 按 position 配置（banner=480min）。
- **notice 已读永久不展示**：notices 是 computed 过滤 readIds，已读 id 永久保留（超 1000 清最早），SW 4h 后重拉同 id 仍被过滤。
- **统一错误处理三层**：L1 lib/api.ts 归一 NetworkError/ApiError + fetchWithRetry（仅 NetworkError 退避1s重试1次）；L2 调用点 try/catch + 失败回退缓存；L3 useLogger unhandledrejection preventDefault 防业务错误进 chrome errors 面板。
- **外部资源统一校验** lib/external-resource.ts：isValidExternalUrl（含黑名单，资源加载用）/ isRenderableImgSrc（放行浏览器内部协议，FavIcon 用）/ isSafeExternalLink（不查黑名单，菜单跳转用）。AdBanner/FavIcon/useSettingMenu 接入。
- **设置菜单三任务**：①点击空白关闭（usePopoverManager 改捕获阶段 + data-popover-content 豁免）②注释云同步/快照 ③帮助→更多动态化（后端 ouu_apps_tm_setting 表，SW 拉取，默认兜底4项带内置 lucide 图标）。
- **TabTileItem 改单根**：修复多根 fallthrough 刷屏崩浏览器（contextmenu/data-tabid 无法继承），立红线 + 防白屏第⑥步 baseParse 扫描。
- **versionCode 统一**：单一来源 lib/api-config.ts APP_VERSION_CODE=1（发生产必升+1），package.json version=1.0.0。
- **环境配置回归 Plasmo 标准**：删 lib/env.ts，地址恢复单文件 api-config.ts，用 process.env.PLASMO_PUBLIC_*（Plasmo 规范，弃用 import.meta.env——行为不稳定是菜单 localhost 没生效根因）。MENU_SITE_URL 单独变量默认生产官网 ouu365.com。.gitignore 忽略所有 .env*（本地覆盖用 .env.local）。
- **排序文案**：「访问优先」→「最近访问」+ 默认值改 lastAccessed + 按钮/选项 hover 提示。

### 后端仓（多 commit）
- **广告 /ad/list**：返回 AdSyncVO(hideAd/expireTime/adData/serverTime/nextSyncIntervalMinutes)，间隔由 AdPositionEnum(banner=480) 配置。改 POST + @RequestBody，登录态用标准模式（customerType + SecurityUtils.getCustomerId try-catch），通用头 platform/versionCode/appCode 保留 @RequestHeader。
- **version /version/check-version**：返回加 nextSyncIntervalMinutes=1440(24h)。
- **notice /notice/page-list**：返回改 R<NoticeSyncVO>(rows/total/nextSyncIntervalMinutes=240/4h)。
- **setting /setting/menu-list（新增）**：建表 ouu_apps_tm_setting，按 delete_flag/版本/灰度过滤返回可见菜单，nextSyncIntervalMinutes=1440。默认4条菜单（文档/FAQ/意见和需求反馈/联系我们，URL 带 ?app-code=app_1001）。POST + @RequestBody + 标准登录态模式。
- **SecurityConfig**：permitAll 加 /setting/menu-list（与 ad/version/notice 一致）。
- **登录态判断统一标准模式**（参考 AppVersionController#checkVersion）：customerType + SecurityUtils.getCustomerId try-catch，禁用 tokenService.getLoginUser（ad/setting 曾误用被纠正）。
- 注：application.yml/application-druid.yml 本地环境切换未提交（含生产库密码）。

### 官网仓
- `551b4ff` .doc-page .doc-inner 改直接子选择器，修复 /contents 双栏布局错乱（CSS 级联冲突，后代选择器误命中 /contents 分支）。

### hub 仓
- 立红线：多根组件 fallthrough 刷屏崩浏览器（零容忍）+ 防白屏第⑥步 baseParse 扫描。写入插件仓 CLAUDE.md + hub CLAUDE.md §10 + plugs-fe agent。
- 强化 api-backend agent：免登录接口登录态统一标准模式，禁用 tokenService。
- 记忆新增：multi-root-fallthrough-crash / plugin-version-release-rule / backend-anonymous-login-pattern。

### 🔴 明天第一件事：生产 nginx /contents 路由问题（未解决）
**现象**：生产 https://www.ouu365.com/contents/docs（及 /faq /feedback /contact）返回的是**首页内容**（title 是首页的，HTML 含 page-baidu/browser-page 首页组件），不是 /contents 页面。本地 dev 正常。
**根因**：生产 nginx 没把 /contents/* 路由到 VitePress SSG 产物（/contents/docs.html），fallback 到了首页 index.html。**不是插件、不是 CSS、不是 hydration**——是 nginx 路由。
**之前误判**：以为是 hydration mismatch / app-code query 触发 / CSS 级联——都不是。CSS 修复(551b4ff)已上线生产（确认产物含 .doc-page>.doc-inner），但路由没修所以页面还是错的。
**修复方向**：nginx 加 `try_files $uri $uri.html $uri/ /index.html;`（漏了 $uri.html 导致 /contents/docs 找不到文件 fallback 首页）。需用户给宝塔 nginx 配置或确认产物结构（dist/contents/docs.html 是否存在）。

### 待用户验证
1. 重启后端（SecurityConfig + 新接口生效）+ 清插件缓存重载扩展
2. SW 控制台四套 [xxx-sync] 缓存已更新日志，无 401/code=undefined
3. 设置菜单点过去：dev 跳 localhost:5173 正常 / 生产 ouu365.com 因 nginx 路由问题仍错（待修 nginx）
4. 广告展示即消费、notice 已读永久不展示、排序 hover 提示、点击空白关菜单

### 待办（后续）
- **生产 nginx /contents 路由**（明天优先）：try_files 加 $uri.html
- **后端配置真实数据**：ouu_apps_tm_setting 菜单、ouu_advertisement 广告、ouu_apps_version 版本记录(version_code=1)、ouu_apps_notice 通知
- **官网 appearance**：config.ts 未设（默认启用暗色但 Layout 无切换按钮，半启用），建议 appearance:false 待用户拍板
- **appearance false 后验证 hydration**：nginx 修好后若 /contents fresh load 仍报 hydration mismatch 再查
- **expireTime**：广告 hideAd 时 expireTime 暂用 null + TODO（待会员体系上线查会员表到期）

---

## 2026-07-17 收工（装扮主题动态化 + 道具商城兑换）

### 今日完成（未 commit，全在 test 分支）

#### A. 装扮主题落地 sidepanel + 效果调优
- **sidepanel 应用主题背景 + 头像框**：root 去 bg-white、白底移 body，body::before 6% 主题图从间隙透出；两个 Header 加已登录态 AvatarWithFrame（size 38）；HeaderMenu 账号行 User 图标换 AvatarWithFrame（size 32）。useSkin 单例 + storage.onChanged 跨页同步。
- **效果调优**：背景 opacity 0.06→0.18→0.32；纯色主题（护眼墨绿/极简纯白/暗夜深渊）原 pageBgImage:'none' 不渲染，改为铺渐变底 + 高 bgOpacity（0.6/0.7/0.85）；SkinThemeConfig 加可选 bgOpacity 覆盖默认。
- **背景透明度用户可调**：useSkin 加 userBgOpacity + bgOpacity computed + setBgOpacity；options 加滑块（0~100% 步进5%），持久化进 tabMasterSkinPreview，跨页同步。后迁为竖向 fixed 右侧滑块。

#### B. 道具商城兑换（跨线：后端 + 前端）
- **协调文档**：docs/coordination/2026-07-17-prop-shop.md（API 契约 + 设计决策）
- **后端**（api-backend，mvn compile BUILD SUCCESS）：建表 ouu_prop/ouu_customer_prop（含 uk_customer_prop 唯一索引防并发重复兑换）；3 接口 GET /prop/list（免登录不返回原图）、GET /prop/{id}（免登录取原图）、POST /prop/exchange（需登录）；**兑换扣积分写进 IOuuCustomerPointsService.exchangeProp**（照 checkInAdd 乐观锁减积分 + 流水 IN_OR_OUT=2/EXCHANGE_PROP(3)）；防重三层（Service判重+DB唯一索引+免费也判重）；积分不足提示语后端常量控制。
  - ⚠️ 偏离契约：exchangeProp 签名 Integer→ExchangeDeductResultDTO（返回 afterPoints+relationOrderNo），让流水 relationOrderNo 与 ouu_customer_prop.prop_order_no 同单号。
- **前端**（plugs-fe，vue-tsc 0 错 + 防白屏5步+第⑥步过）：options 道具商城 section；列表按 propType 分两组（头像框在前/背景图在后）+ 缩略图 lazy；预览/兑换/使用三态按钮；purchased 使用中态本地存（key tabMasterSkinActive:{customerId} 按 customerId 隔离，存 resourceUrl 避免重取）；useSkin 拓展 applyPurchasedFrame/Bg/clearPurchased/loadPurchasedActive，purchased 优先级 > 静态主题；AvatarWithFrame 加 frameUrl prop。

#### C. 试穿功能
- 试穿=临时态（30秒倒计时自动恢复，防白嫖付费道具），区别于 purchased 持久使用中态。
- useSkin 加 tryonProp/tryonEndAt/tryonRemaining + startTryon/stopTryon；interval 模块级 timer（守单例监听器红线，不在 onMounted/onUnmounted）；跨页同步 storage.local key tabMasterSkinTryon；优先级 试穿>purchased>静态。
- 未购道具卡片：预览 + 试穿 + 兑换 三按钮；已购只显示使用/使用中。试穿中提示条「试穿中：{名}·剩余{N}s·[结束试穿]」。试穿 bg 时透明度滑块也可调。

#### D. options 信息架构重构
- 删静态「主题装扮」section（12 主题+8 框写死数据，后端没数据时不应显示）。主题/头像框统一只走道具商城（后端）。背景透明度滑块保留迁入。
- **分 Tab**：原 [账号/同步][更多设置][道具商城] 三平铺 → Tab 切换。后按用户要求**去掉「装扮」tab**，道具商城并入「账号」tab（登录信息下方，让用户更易看到）。现 Tab：[账号]（含道具商城）[设置]。localStorage 持久化上次 tab。
- 透明度滑块改竖向 fixed 右侧（v-if 守卫 shop→account）。
- 文案修正：「使用中」状态本地存，卸载/清缓存回默认，重新点「使用」恢复，不影响已购道具。
- 加「恢复默认」按钮：useSkin.clearAllActive() 清 purchasedFrame+Bg 使用中态（不清已购记录），主题背景+头像框回默认，跨页同步。

#### E. 资源
- 静态背景图/头像框资源已 copy 到 assets/skin/（bg/ 9张 webp + frames/ 7张 png），**体积超标 10-30 倍**（400KB-1.3MB，要求 ≤45KB），部署前必须压缩或切 CDN（cdn.ouu365.com/skin/）。useSkin.ts 有 @TODO 标记。
- 图片格式兼容：`<img :src>` 浏览器原生支持 webp/png/jpeg/jpg，后端返回任意格式都兼容，无需特殊处理。AvatarWithFrame frameUrl 同理。

### 🔴 明天待续

#### 后端
1. **执行建表 SQL**：sql/ouu_prop_shop.sql（ouu_prop + ouu_customer_prop）
2. **录入道具数据**：ouu_prop 录入头像框/背景图道具，prop_thumbnail_url + prop_resource_url **走 CDN URL**（带宽红线，别用本地图）
3. **联调** 3 接口（/prop/list、/prop/{id}、/prop/exchange）+ 兑换扣积分 + 积分不足提示语

#### 前端（联调后）
4. `pnpm dev:safe` 实测：道具商城列表/预览/试穿30秒倒计时/兑换扣积分/使用切换/跨页同步（options 设使用中→sidepanel 跟变）/恢复默认/竖向透明度滑块/Tab 切换
5. 联调 OK 后**提交全部装扮+道具商城改动到 test 分支**（3 仓：插件 + 后端 + 协调文档）
6. **sidepanel 静态框清理评估**：useSkin.ts 的 THEMES/FRAMES 静态数组目前保留（sidepanel AvatarWithFrame 回退用），后续若确认 sidepanel 也不需要静态框再单独清理

#### 部署前
7. **资源压缩/CDN**：assets/skin 背景图压到 ≤45KB 或切 CDN（useSkin.ts @TODO）
8. **versionCode 升级**：发生产前 lib/api-config.ts APP_VERSION_CODE +1（当前=1）

### 当前 git 状态
- 插件仓 test 分支：装扮+道具商城+试穿+Tab 重构 全部未 commit
- 后端仓 test 分支：道具商城后端 13 新文件+2改 未 commit
- hub 仓：docs/coordination/2026-07-17-prop-shop.md 未 commit
- 三仓 master 全锁定，不 merge 不直推

---

## 2026-07-18 收工（性别头像 + 道具商城重构 + 纯色背景 + 本地缓存按id隔离）

### 今日完成（全部已 commit 到 test 分支）

#### A. 性别头像 + options 改性别
- **后端** `POST /customer/update-sex`（body `{sex:0|1|2}`，仅更新 sex 字段，requireLogin 兜底）
- **插件**：3 张性别 SVG → `assets/avatars/avatar-{default,female,male}.svg`；useAuth 持久化 sex；AvatarWithFrame 头像本体由「邮箱彩色圆+首字母」改为性别 SVG 剪影（移除 md5/调色板死代码）；options 账号区加「头像+性别选择」行
- 修了 disabled 的 `0 即假` 坑（`updatingSex ||` → `updatingSex !== null ||`）

#### B. 道具商城重构（8 项需求）
- **后端** `/prop/list` 改若依分页（startPage+getDataTable，返 TableDataInfo）+ propType 过滤参数
- **插件** options 道具商城：
  - 二级 tab [头像框/主题背景/主题纯色背景]（propType 1/2/3）+ 分页 20/页
  - 头像框预览弹层 240×240（AvatarWithFrame size=240）+ 弹层内「试穿30秒」按钮
  - 恢复默认三分按钮置顶（头像框/主题背景/全部）
  - sidepanel 头部布局收紧（gap-1、头像 38→32、标签数 shrink-0）
  - 顶部标题「X个标签」挨着标题 + 黑色跟随明暗
- 文案：背景图→主题背景

#### C. 本地缓存按用户id隔离（红线，已写入 CLAUDE.md）
- `tabMasterSkinActive:{id}` 已购frame/bg、`tabMasterSkinOpacity:{id}` 透明度、`tabMasterSkinSolidBg`(已废，纯色改走后端)
- 退出登录清当前id、重新登录清非当前id残留（`cleanOtherCustomerCache` 扫 storage 全 key）、未登录全默认
- storage.onChanged 改 startsWith 前缀匹配
- hub 记忆 [[plugin-user-cache-isolation-by-id]]

#### D. 清死代码 + 纯色背景走后端统一
- **清死代码**：删 THEMES/FRAMES（9 webp+7 png import）、applyTheme/applyFrame/resetSkin/findTheme/findFrame、activeThemeId/activeFrameId；AvatarWithFrame 删静态框两分支 + frame computed；StoragePanel 删 tabMasterSkinPreview 条目；净删 ~300 行
- **拆 bgOpacity**：从 tabMasterSkinPreview 拆出独立 key `tabMasterSkinOpacity:{id}`
- **纯色背景走后端**：ouu_prop 加 prop_type=3，7 种彩虹护眼暖色（CSS 存 prop_resource_url），免费，走标准兑换。前端 isCssBg() 判断缩略图/预览 CSS→色块、URL→img；writeThemeVars 加 bgType（image 包 url()、solid 直接用 CSS 值不包 url，核心解冲突）；purchasedBg 加 bgType，effectiveBg 派生，互斥天然（单值覆盖）
- **SQL 已给用户**：7 条 INSERT prop_type=3 纯色道具（用户执行）

#### E. 透明度拖动即时生效（修 sidepanel 不同步）
- 之前 draft/preview/apply 机制（拖动只预览、点应用才存）导致 sidepanel 不同步
- 改为 setBgOpacity 即时写 userBgOpacity+persist → storage.onChanged 触发 sidepanel 实时同步
- 删 draft 体系 + 「应用」按钮

### 关键 commit
- 插件：`4115c99`→`549df6b`→`09a02d8`→`cc34b92`→`f1ddb09`→`ba26ccc`→`6a7f686`→`a8d4ffb`
- 后端：`254322d`→`13212bf`→`08d33d0`
- 官网：`484323b`（清零引用 logo）

### 🔴 明天待续

#### 联调验证（用户跑）
1. **后端**：执行纯色背景 SQL（7 条 prop_type=3）+ 起服务
2. **前端** `pnpm dev:safe` 实测：
   - 性别头像：/my 返回性别→头像切换；options 改性别→sidepanel 同步
   - 道具商城：分 tab+分页、头像框预览240+试穿30s、纯色背景色卡/兑换/使用/试穿、恢复默认三分
   - 透明度：拖动即时同步 sidepanel（试穿/使用中）
   - 按id隔离：退出清、重登同id关联、换号清残留
3. 联调 OK 后**push 三仓 test 分支**（目前都只本地 commit 未 push）

#### 部署前
4. **资源压缩/CDN**：assets/skin 背景图（webp 400KB-1.3MB）压到 ≤45KB 或切 CDN（useSkin.ts @TODO；纯色背景已走后端 CSS 不占本地体积）
5. **versionCode 升级**：发生产前 lib/api-config.ts APP_VERSION_CODE +1（当前=1）

### 当前 git 状态
- 插件仓 test 分支：今日 8 commit，全部已 commit，**未 push**
- 后端仓 test 分支：今日 3 commit，全部已 commit，**未 push**
- 官网仓 test 分支：1 commit，**未 push**
- 三仓 master 全锁定，不 merge 不直推

---

## 2026-07-18 续（透明度跨页同步修复 + 纯色背景加深）

### 透明度 sidepanel 不同步根因 & 修复（commit a8d4ffb + a969132）

**问题**：拖动透明度滑块，options 背景变，sidepanel 完全不变。但试穿能同步。

**根因（对比试穿 vs 透明度同步链路）**：
| | 试穿（能同步） | 透明度（不能同步） |
|---|---|---|
| storage key | tabMasterSkinTryon（固定，不绑id） | tabMasterSkinOpacity:{id}（绑id） |
| 未登录写 storage | ✅ 写 | ❌ persist() 里 if(!cid) return 不写 |
| sidepanel 监听 | if(changes[TRYON_KEY]) 无条件 | 要 activeCustomerId 匹配 |

未登录试穿调透明度 → setBgOpacity → persist() 未登录 return 不写 storage → sidepanel 收不到事件。试穿写固定 key 不看登录，所以能同步。

**修复（实时同步与持久化记忆分离）**：
- 新增临时同步 key `SKIN_OPACITY_LIVE_KEY = 'tabMasterSkinBgOpacityLive'`（不绑 id，像试穿一样）
- setBgOpacity：写本页 DOM + 写 LIVE key（未登录/试穿也写）→ sidepanel 实时收到 + 登录额外写 id key（持久化记忆）
- handleStorageChange：加 LIVE key 分支（跨页实时同步主力）+ 保留 id key 分支（持久化记忆同步）
- 中间还经历过 draft/preview/apply 机制（拖动只预览、应用才存）→ 改回 setBgOpacity 即时生效（a8d4ffb）

### 纯色背景加深（commit 69d0712 + SQL）

**问题**：纯色背景太浅太淡（#f0fdf4 那种浅色），用户要草原翠绿、天蓝、红扑扑、黄橙橙的饱和度。

**色号改 Windows 桌面色系**（查 Wikipedia Bliss/Windows 10 Hero 蓝）：
- 草原翠绿 #3A7E1E（Windows XP Bliss 草地绿采样）
- 天蓝 #0078D4（Windows 10 Hero 蓝）
- 红扑扑 #C30052（Windows 11 红）
- 黄橙橙 #FFB900（Windows 黄）
- 暖橙 #D83B01、湖青 #008577、丁香紫 #7B3FA0
- 每色 linear-gradient(主色→略深同色) 铺底，比纯色耐看
- **SQL 给用户执行**（DELETE prop_type=3 + INSERT 7 条新色）
- 前端默认透明度 solid 0.6→0.45（加深色用低透明度更平衡，不压内容）

### 关键 commit
- `a8d4ffb` 透明度拖动即时生效+实时同步sidepanel（删 draft/apply 机制）
- `a969132` 透明度跨页实时同步走临时key(不绑id)，未登录/试穿也同步
- `69d0712` 纯色背景默认透明度0.6→0.45(加深色更平衡)

### 🔴 明天待续
1. **用户执行纯色 SQL**（加深版 7 条）+ 后端起服务
2. `pnpm dev:safe` 实测：
   - 纯色背景饱和度（草原翠绿/天蓝/红扑扑）
   - 透明度 sidepanel 实时同步（未登录试穿 + 登录使用中）
   - 性别头像/道具商城全套回归
3. **push 三仓 test 分支**（目前都只本地 commit 未 push）
4. 部署前：assets/skin webp 压缩或切 CDN；versionCode +1

### 当前 git 状态
- 插件仓 test 分支：今日共 11 commit，全部已 commit，**未 push**
- 后端仓 test 分支：3 commit，**未 push**（纯色 SQL 由用户执行，不改后端代码）
- 官网仓 test 分支：1 commit，**未 push**
- hub 仓：干净
- 三仓 master 全锁定
