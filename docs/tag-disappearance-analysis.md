# 标记消失问题分析

## 任务 A：标记相关代码路径分析

| 路径 | 触发条件 | 改 storage? | 改内存? | 是否清空 | 待验证的假说 | 代码位置 |
|------|---------|------------|--------|---------|------------|---------|
| `loadLater()` - 正常流程 | 组件挂载 / `onVisibilityChange` | 仅当 `customTags` 需要修复时 | ✅ `customTags`/`tabTagsMap`/等 | ❌ | - | `useTabManager.ts:141-160` |
| `loadLater()` - catch 分支 | storage 读取失败（权限问题/磁盘满/数据损坏） | ❌ | ✅ 设为空值 | ✅ **是** | **bug2 假说：reload 时 chrome.storage.local.get 抛异常** | `useTabManager.ts:161-172` |
| `updateTabTags()` | 用户给标签添加/修改/删除标记 | ✅ `tabTagsMap` | ✅ `tabs.value[idx].tags` / `tabTagsMap` | ❌ | - | `useTabManager.ts:228-233` |
| `addCustomTag()` | 用户添加新标记类别 | ✅ `customTags` | ✅ `customTags` | ❌ | - | `useTabManager.ts:234-240` |
| `removeCustomTag()` | 用户删除标记类别 | ✅ `customTags` + `tabTagsMap` | ✅ 两者都更新 | ❌（仅移除此标记） | - | `useTabManager.ts:241-256` |
| `renameCustomTag()` | 用户重命名标记类别 | ✅ `customTags` + `tabTagsMap` | ✅ 两者都更新 | ❌ | - | `useTabManager.ts:257-273` |
| `reorderCustomTag()` | 用户重新排序标记 | ✅ `customTags` | ✅ `customTags` | ❌ | - | `useTabManager.ts:274-283` |
| `onVisibilityChange` | 标签页从隐藏变为可见 | ❌ | ❌（调用 `loadTabs()`+`loadLater()`） | ❌（取决于 `loadLater`） | - | `useTabManager.ts:454-458` |
| `onTabRemoved` | 标签被关闭 | ✅ `recentlyClosed`/`treeParentMap`/`tabOpenedAtMap` | ✅ | ❌（**注意：不清理 `tabTagsMap` 孤儿**） | 可能导致回填错位 | `useTabManager.ts:345-374` |
| 页面刷新（重新打开） | 用户点击「重新打开」按钮 | ❌ | ❌（整页重载） | ❌（storage 持久化） | - | `HeaderMenu.vue:92` → `sidepanel.vue:1069` |
| 聚焦模式进入/退出 | 用户使用聚焦模式 | ❌（仅 `sessionStorage`） | ✅（`focusMode` 状态） | ❌ | **bug1 假说：需确认 loadLater/loadTabs 调用顺序与 tabTagsMap 状态** | `useFocusMode.ts` |

### 关键发现（待复现确认）

#### Bug1（聚焦模式后标记消失）待验证假说：
1. **Tab ID 生命周期问题**：`chrome.tabs.Tab.id` 是会话级唯一，浏览器重启/会话恢复时会改变。但聚焦模式不应该导致 tabId 改变。
2. **`onTabMoved` → `loadTabs()` 时序问题**：聚焦模式会调用 `chrome.tabs.group()`/`ungroup()`，这会触发 `onTabMoved` 事件 → 调用 `loadTabs()`。如果 `tabTagsMap` 内存状态还没准备好，可能有问题。
3. **`onVisibilityChange` 调用顺序**：`onVisibilityChange` 只在"睡眠唤醒/锁屏解锁"场景触发，调用顺序是 `loadTabs()` 然后 `loadLater()`。但聚焦退出是否触发 `visibilitychange` 需复现确认。

#### Bug2（重新打开后标记消失）待验证假说：
1. **`loadLater()` 的 catch 分支**：当 `chrome.storage.local.get()` 抛出异常时，代码会将 `tabTagsMap.value` 设为空对象 `{}`。需复现确认 reload 时是否真的抛异常（比如扩展 context invalidated）。
2. **异常原因可能包括**：
   - Storage 区域被浏览器策略限制
   - 数据损坏
   - 扩展上下文失效
3. **更严重的是**：内存被设为空，但不会自动写回 storage，所以刷新后还能恢复，但当前会话标记消失了。

---

## 任务 B：添加诊断日志

我在关键位置添加了 dev-only 诊断日志，帮助定位问题：

### 修改的文件和日志点：

1. **`useTabManager.ts` - `loadLater()` 函数**
   - 日志点 1：进入函数时，记录从 storage 读取的原始数据
   - 日志点 2：处理完成后，记录内存中的最终状态
   - 日志点 3：catch 分支，专门记录异常

2. **`useTabManager.ts` - `updateTabTags()` 函数**
   - 日志点 1：写入前，记录要写入的 tabId 和 tags
   - 日志点 2：写入后，回读 storage 验证数据确实被保存了

3. **`useTabManager.ts` - `loadTabs()` 函数**
   - 日志点 1：开始时，记录查询到的 tab 数量和当前 tabTagsMap 状态
   - 日志点 2：回填完成后，统计有多少标签成功回填了标记

4. **`useTabManager.ts` - `onVisibilityChange()` 函数**
   - 日志点 1：触发时，记录当前状态

### 使用方法：
1. 打开扩展的 DevTools（右键点击扩展图标 → 「检查弹出内容」或「检查侧栏」）
2. 切换到 Console 标签
3. 复现 bug
4. 查看带有 `[tab-master:tags]` 前缀的日志

---

## 任务 C：标签元数据持久化的最佳实践

### Chrome 官方文档说明

1. **`chrome.tabs.Tab.id` 的生命周期**（来源：[docs/googledocs/tabs.md:679](file:///Users/yuyany/web_space/tab-master-plugin/docs/googledocs/tabs.md)）
   - "Tab IDs are unique within a browser session."（Tab ID 在浏览器会话内唯一）
   - "Under some circumstances a tab may not be assigned an ID; for example, when querying foreign tabs using the sessions API, in which case a session ID may be present."（某些情况下标签可能没有 ID，例如使用 sessions API 查询外部标签时，会使用 session ID）

2. **`chrome.tabs.Tab.sessionId` 的用途**（来源：[docs/googledocs/sessions.md](file:///Users/yuyany/web_space/tab-master-plugin/docs/googledocs/sessions.md)）
   - `sessionId` 仅用于 sessions API，用于恢复最近关闭的标签
   - 需要 `sessions` 权限
   - 但 sessionId 也是会话级的，不是永久标识

### 备选方案分析

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| **当前方案：tab.id** | 简单直接，性能好 | 会话重启/崩溃后 ID 会变；标签恢复时 ID 会变 | 仅需当前会话内持久化 |
| **URL + 标题哈希** | 会话重启后仍可能匹配 | URL 会变（SPA、哈希路由）；不同标签可能有相同 URL | 静态内容标签 |
| **`tab.openerTabId` + URL** | 可追踪标签间关系 | openerTabId 可能失效；仍然依赖 URL | 树形结构 |
| **组合标识：URL + 打开时间 + 标题** | 更稳定，冲突概率低 | 实现复杂；仍可能冲突（罕见） | 需要跨会话持久化 |
| **历史记录 ID（如果可用）** | 跨会话稳定 | Chrome 扩展 API 不直接暴露内部历史 ID | 不可行 |

### 业界主流做法

根据公开资料，主流标签管理扩展的做法：

1. **OneTab / Tab Wrangler / Toby 等**：
   - 当前会话内使用 `tab.id`
   - 保存到「稍后」或导出时，使用 URL + 标题 + 时间戳的组合
   - 恢复时采用模糊匹配策略（优先匹配 URL，然后标题）

2. **Session Buddy**：
   - 使用 `sessions` API（需要权限）
   - 保存会话时同时保存 tab.id 和 URL
   - 恢复时通过 sessions API 获取原始 tabId 映射

### 针对当前项目的建议

**短期（修复当前 bug）：**
1. 使用我们刚添加的诊断日志确认 bug 原因
2. 根据诊断结果决定是否修复 `loadLater()` 的 catch 分支（不要清空内存，保持现有状态）

**中期（提升稳定性）：**
1. 实现「孤儿标记」清理机制（`onTabRemoved` 时）
2. 考虑使用 `tab.url` 作为后备匹配（当 tabId 找不到时）
3. 添加用户可见的警告，告知 storage 异常情况

**长期（跨会话持久化）：**
1. 实现组合标识策略（URL + 打开时间戳）
2. 建立标记迁移机制（当 tabId 改变时自动迁移）
3. 考虑使用 `sessions` API（需要添加权限请求）

---

## 需要用户复现确认的点

1. **Bug2 优先**：在 DevTools Console 开启的情况下，点击「重新打开」按钮，查看是否有 `[tab-master:tags] loadLater 异常` 日志
2. **Bug1 复现**：进入聚焦模式前先看 Console 日志，然后进入再退出，查看 `loadLater`/`loadTabs` 的调用顺序与 tabTagsMap 是否被清空
