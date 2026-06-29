# 工具栏「清理」菜单（Cleanup Toolbar）

> Status: Draft · Author: product-manager · Date: 2026-06-28 · Feature slug: `cleanup-toolbar`

---

## 1. 背景与目标

### 现状/痛点

工具栏「清理」下拉里已有 5 个 P0 入口，但**两类功能体验都不达标**：

| 入口 | 当前实现 | 问题 |
|---|---|---|
| 关闭非固定 / 其他 / 已冻结已舍弃 | 后端逻辑已就绪，前端**直接调用、无确认、无反馈** | 用户开 100+ 标签时点一下全没了，误操作不可逆，相当于 OneTab 的暴力关；用户原话「不敢关，怕找不回」 |
| 检测重复 / 检测长期未用 | 只弹 toast「开发中」 | 完全没做 |

用户原话痛点：

> 「不知不觉打开了 5 个一样的帮助文档页面，我是神经病吗？」（重复）
> 「风扇狂转，电脑卡死，几十个标签在后台偷电」（长期未用）
> 「关了就找不回来，浏览器越来越卡也不敢关」（不敢关 → 内存爆炸）

### 目标

1. **关闭类操作有"后果预告"**：弹窗显示"将关 N 个、保留 M 个、撤销方式"，用户点击二次确认才执行
2. **检测类操作走"先检测 → 看清单 → 用户勾选 → 关闭"两步流**
3. **每次操作有结果 Toast**：「已关 23 个」/「未检测到重复」
4. **复用已有：** `showToast()`、`closeTab()`、SW 的采集模式

### 非目标（不做）

- ❌ **自动定时清理**（用户没要求；行业里 Arc/Edge 有 Auto Archive，但属于不同心智模型，留待后续）
- ❌ **撤销列表 / Corral 回收站**（用户决策：只在弹窗提示 `Ctrl+Shift+T`；浏览器原生足够）
- ❌ **重复判定的多档规则**（用户决策：第一版只做 URL 完全相同）
- ❌ **AI 智能分类、归档建议**（P1，需求文档已标为后期）

### 成功指标

- 关闭类操作必须经过弹窗确认（防误操作率 100%）
- 检测类操作打开弹窗 ≤ 300ms（200 个标签场景）
- 撤销路径已知率：弹窗里明文写出 `Ctrl+Shift+T`

---

## 2. 用户场景与故事

### 用户画像

- **囤积型重度用户**：日常 50-200 个标签，深陷"不敢关"焦虑
- **多任务切换用户**：开发/写作期间疯狂打开参考资料，结束时想批量清理
- **内存敏感用户**：MacBook Air 用户，希望释放冻结/舍弃标签的内存

### User Story

- **US-1**：作为用户，点击「关闭非固定标签」时，我想先看到将关多少、保留多少，再决定要不要确认，以免误伤
- **US-2**：作为用户，确认关闭后我想看到一个 toast「已关闭 X 个，可用 Ctrl+Shift+T 恢复」，知道操作完成
- **US-3**：作为用户，点击「检测重复标签」时，我想看到一个清单按 URL 分组显示哪些重复了，每组**默认保留最近打开**的，其他打勾，让我能调整勾选再批量关
- **US-4**：作为用户，点击「检测长期未使用」时，我想能调阈值（1天/3天/7天/30天），看清单按未访问时间降序，能调勾选再批量关

### 关键路径

**路径 A：关闭类（3 步）**
```
点击「清理 ▾」 → 点「关闭非固定标签」
  → 弹 ConfirmDialog（数量/保留/撤销提示）
  → 点「确认」
  → toast「已关 23 个」
```

**路径 B：检测类（4 步）**
```
点击「清理 ▾」 → 点「检测重复标签」
  → 弹 ReviewDialog（按 URL 分组列出，默认保留最新）
  → 可调勾选 / 切换阈值
  → 点「关闭选中 N 个」
  → toast「已关闭 N 个重复标签」
```

---

## 3. 交互设计

### 3.1 工具栏入口（位置不变，分组优化）

现在的「清理」按钮位置 OK，下拉**分组标题**优化更清晰：

```
[🗑 清理 ▾]
─────────────────────
直接关闭                ← 原「关闭标签」分组
  ✕ 关闭非固定标签
  ✕ 关闭其他标签（除当前页）
  ✕ 关闭已冻结/已舍弃
─────────────────────
检测后选择              ← 原「检测」分组
  🔍 检测重复标签
  🕐 检测长期未使用
```

**变更点：** 分组标题从「关闭标签 / 检测」改为「直接关闭 / 检测后选择」—— 让用户预期两类操作的不同行为。

### 3.2 ConfirmDialog（关闭类二次确认）

新建通用组件 `components/ConfirmDialog.vue`，复用模式（覆盖后续所有"危险操作"场景）：

```
┌─────────────────────────────────────────┐
│ ⚠️  确认关闭非固定标签                   │
├─────────────────────────────────────────┤
│ 将关闭 23 个未固定的标签                 │
│                                          │
│ • 保留：5 个固定标签                     │
│ • 保留：当前激活标签                     │
│                                          │
│ 💡 关闭的标签可用 Ctrl+Shift+T 恢复      │
│                                          │
│            [取消]  [确认关闭 23 个]      │
└─────────────────────────────────────────┘
```

三个清理入口的文案（统一变量化）：

| 入口 | 标题 | 正文 |
|---|---|---|
| 关闭非固定 | 确认关闭非固定标签 | 将关闭 **{N}** 个未固定标签；保留 **{M}** 个固定 |
| 关闭其他 | 确认关闭其他标签 | 将关闭 **{N}** 个标签；保留当前激活页 + **{P}** 个固定 |
| 关闭已冻结/舍弃 | 确认关闭已冻结/已舍弃标签 | 将关闭 **{N}** 个已被浏览器冻结或舍弃的标签（这些标签当前不占内存但仍在列表里） |

**特殊情况：** N=0 时不弹窗，直接 toast「没有符合条件的标签」。

### 3.3 DetectReviewDialog（检测类清单）

新建组件 `components/DetectReviewDialog.vue`，两种检测共用：

**重复检测：**
```
┌──────────────────────────────────────────────┐
│ 🔍 检测到 5 组重复 · 共 13 个标签            │
├──────────────────────────────────────────────┤
│ feishu.cn/wiki/abc123          (3 个)         │
│   ☑ 标签 A · 昨天 14:30                       │
│   ☑ 标签 B · 今天 09:15                       │
│   ☐ 标签 C · 今天 16:42  ← 默认保留（最新）   │
│                                                │
│ chat.openai.com                (2 个)         │
│   ☑ 旧的 ChatGPT · 3 天前                     │
│   ☐ 当前 ChatGPT · 刚刚  ← 默认保留           │
│   ...                                          │
├──────────────────────────────────────────────┤
│ 默认每组保留最新打开的一个                    │
│            [取消]  [关闭选中 8 个]            │
└──────────────────────────────────────────────┘
```

**长期未用检测：**
```
┌──────────────────────────────────────────────┐
│ 🕐 检测到 12 个长期未用标签                   │
├──────────────────────────────────────────────┤
│ 阈值: [1 天 ▾]    排除: 固定 + 当前页 + 播放  │
├──────────────────────────────────────────────┤
│ ☑ ChatGPT - Long Conversation Title           │
│   未访问 3 天 12 小时                         │
│                                                │
│ ☑ DeepSeek                                    │
│   未访问 2 天 4 小时                          │
│ ...                                            │
├──────────────────────────────────────────────┤
│            [取消]  [关闭选中 N 个]            │
└──────────────────────────────────────────────┘
```

**阈值下拉：** 1 天 / 3 天 / 7 天 / 30 天（抄 Workona）。阈值切换 → 实时重新筛选清单。

**lastAccessed 兜底显示：**

- Chrome 121+ 拿到原生 `tab.lastAccessed`，显示「未访问 X 天 Y 小时」
- Chrome <121 用 SW 采集的时间戳（从安装那天起），无数据的标签显示「上次访问时间未知」并默认**不勾选**（保守，避免误关用户其实常用的标签）

### 3.4 操作后反馈

| 场景 | Toast 文案 |
|---|---|
| 关闭成功 | 「已关闭 {N} 个标签 · Ctrl+Shift+T 可恢复」 |
| 没有可关的 | 「没有符合条件的标签」 |
| 未检测到 | 「未检测到{重复 / 长期未用}标签」 |
| 部分失败 | 「已关闭 {N} 个，{F} 个失败」（极少见，权限或受保护页） |

---

## 4. 技术方案

### 4.1 新增文件

| 文件 | 职责 |
|---|---|
| `components/ConfirmDialog.vue` | 通用二次确认弹窗。Props: `title / message / hint / confirmText / cancelText`，emit `confirm/cancel` |
| `components/DetectReviewDialog.vue` | 检测后清单。Props: `mode: 'duplicates' \| 'unused'` + 数据，emit `confirm(idsToClose) / cancel` |
| `composables/useCleanup.ts` | 业务逻辑：`detectDuplicates(tabs)` / `detectUnused(tabs, thresholdMs)` / `getLastAccessed(tab)`（含 Chrome 原生 + SW 兜底） |

### 4.2 修改文件

| 文件 | 改动 |
|---|---|
| `components/AppToolbar.vue` | 分组标题文案改：`关闭标签` → `直接关闭`，`检测` → `检测后选择`。下拉里图标微调（已冻结那条用 🧊） |
| `sidepanel.vue` | 不再直接调 `closeUnpinned/...`，改成打开 `ConfirmDialog`；`@detectDuplicates/@detectUnused` 改为打开 `DetectReviewDialog`；接收 `confirm` 事件再调 `useTabManager` 的批量关 |
| `background.ts` | 监听 `chrome.tabs.onActivated`，写 `lastAccessedMap` 到 `chrome.storage.local`（兜底 Chrome <121） |
| `composables/useTabManager.ts` | `TabItem` 扩 `lastAccessed?: number`，在 `mapTab()` 里：优先用 `chrome.tabs.Tab.lastAccessed`，没有再从 SW storage 读 |
| `types/tab.ts` | `TabItem` 加 `lastAccessed?: number` 字段（毫秒时间戳） |

### 4.3 关键技术点

**lastAccessed 双路获取（已与用户确认）**
```typescript
// composables/useTabManager.ts mapTab() 内
const native = (t as any).lastAccessed  // Chrome 121+
const fallback = lastAccessedMap[t.id]   // SW 采集
const lastAccessed = native ?? fallback ?? undefined
```

**SW 采集（写入 background.ts）**
```typescript
// 增量轻量写入，不影响现有 treeParentMap 逻辑
let lastAccessedMap: Record<string, number> = {}
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  lastAccessedMap[tabId] = Date.now()
  // debounce 1s 批量写，避免高频切换时疯狂写 storage
  scheduleSave()
})
```

**重复检测算法**
```typescript
// O(n) 按 URL 分桶，每组按 lastAccessed/openedAt 倒序，最新的标记 keep
function detectDuplicates(tabs: TabItem[]) {
  const buckets = new Map<string, TabItem[]>()
  tabs.forEach(t => {
    if (t.pinned) return  // 固定标签不参与重复检测
    const key = t.url
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key)!.push(t)
  })
  return [...buckets.values()].filter(g => g.length >= 2)
}
```

**未用检测**
```typescript
function detectUnused(tabs: TabItem[], thresholdMs: number, now = Date.now()) {
  return tabs
    .filter(t => !t.pinned && !t.active && !t.audible)
    .filter(t => {
      const last = t.lastAccessed ?? parseTime(t.openedAt)
      return now - last >= thresholdMs
    })
    .sort((a, b) => (a.lastAccessed ?? 0) - (b.lastAccessed ?? 0))
}
```

### 4.4 已有可复用的

- `showToast()` —— sidepanel.vue:521
- `closeTab(id)` —— composables/useTabManager.ts，已含状态同步
- `vClickOutside` —— lib/clickOutside.ts，弹窗点外部关闭
- `parseTime()` —— lib/sortUtils.ts，统一时间戳解析

### 4.5 依赖关系

```
AppToolbar
  └─ emit "closeUnpinned/closeOthers/closeFrozenDiscarded" → sidepanel.vue
                                                                ├─ 打开 ConfirmDialog (新)
                                                                └─ onConfirm → useTabManager.closeUnpinned()

AppToolbar
  └─ emit "detectDuplicates/detectUnused" → sidepanel.vue
                                              ├─ 调用 useCleanup.detect*() (新)
                                              ├─ 打开 DetectReviewDialog (新)
                                              └─ onConfirm(ids) → batch chrome.tabs.remove(ids)

background.ts
  └─ chrome.tabs.onActivated → chrome.storage.local.lastAccessedMap (新)
                                  ↓ storage.onChanged 同步
                                useTabManager.mapTab() 注入 lastAccessed
```

---

## 5. 边界 / 异常

| 场景 | 处理 |
|---|---|
| `chrome.tabs.remove(ids[])` 部分失败 | toast 显示「已关 N 个，F 个失败」；失败原因通常是浏览器内部页（chrome://），已过滤但仍兜底 |
| ConfirmDialog 候选数 = 0 | 不弹窗，直接 toast |
| DetectReview 检测结果 = 0 | 不弹窗，直接 toast「未检测到重复 / 长期未用」 |
| SW 重启后 lastAccessedMap 丢失 | 已 `chrome.storage.local` 持久化，重启自动回填 |
| Chrome 88-120 没有原生 lastAccessed | SW 兜底从扩展安装那天起记录，已知缺口的标签显示「上次访问未知」 |
| 用户在阈值选择切换中 | DetectReviewDialog 内 watch 阈值变化，实时重算清单 |

---

## 6. 测试用例

| # | 场景 | 期望 |
|---|---|---|
| 1 | 点「关闭非固定」N=23, M=5 | 弹窗显示 23/5，点确认后关 23 个，toast |
| 2 | 点「关闭非固定」N=0（全是固定） | 不弹窗，直接 toast「没有符合条件的标签」 |
| 3 | 点「关闭已冻结/舍弃」 | 弹窗文案准确，关闭操作幂等（已关掉的不会重复关） |
| 4 | 检测重复，5 组共 13 个 | 弹窗按组展示，每组最新默认 ☐（不勾），其他 ☑ |
| 5 | 检测重复，结果为空 | 不弹窗，toast「未检测到重复标签」 |
| 6 | 检测长期未用，阈值切 1 天 → 7 天 | 列表实时刷新 |
| 7 | 检测长期未用，所有标签都没有 lastAccessed | 弹窗显示「上次访问未知」且不勾选 |
| 8 | ConfirmDialog 点取消 / 点遮罩 / ESC | 全部能关弹窗 |
| 9 | 弹窗打开时切换聚焦模式 | 弹窗自动关闭（避免状态不一致） |
| 10 | 跨浏览器：Edge Chromium 121+ / Edge 89-120 / Chrome 121+ / Chrome 88-120 | 全部 4 格矩阵都能用，老版本走 SW 兜底，新版本走原生 lastAccessed |

---

## 7. 验证（如何确认改完跑得起来）

```bash
pnpm dev:safe                                    # 启动
# Chrome: chrome://extensions 重新加载扩展
# 1. 工具栏点「清理 ▾」检查 5 个入口文案 / 分组标题
# 2. 点「关闭非固定标签」→ 验弹窗 → 取消 → 再点 → 确认 → 验 toast
# 3. 打开两个相同 URL → 点「检测重复标签」→ 验清单分组 / 默认勾选 → 关闭
# 4. 把某些标签放置 1 分钟不点 → 点「检测长期未用」→ 切阈值「1 天」→ 验空列表 → 切「1 分钟」（开发调试用，正式版没这档） → 验列表
# 5. 控制台无 Vue warn / error
# 6. background.ts 改完，chrome://extensions 「service worker」inspect → 验 lastAccessedMap 写入
```

---

## 8. 非目标 / 留待后续

- **撤销列表 / Corral 回收站**：依赖浏览器原生 `Ctrl+Shift+T`
- **重复判定多档**（忽略 hash / query）：留待用户反馈"误判太多"再加
- **自动定时清理**：需求文档 §7「智能标签冬眠」单独立项，不混入清理菜单
- **AI 智能归档**：P1，等后端就绪

---

## 9. 相关文档/记忆

- 设计原则：`docs/reference/extension-vue-best-practices.md`
- 记忆：[[lesson-vue-mustache-no-components]] [[lesson-vue-setup-pitfalls]] [[pattern-sw-as-collector]] [[constraint-target-platforms]]
- 同源 PRD：`docs/prd/focus-mode.md`（弹窗组件交互范式参考）
