# 浏览器扩展 + Vue 3 开发规范与最佳实践

> 本手册基于以下权威源系统整理（2026-06 核实）：
> - Chrome Extensions 官方文档（developer.chrome.com）
> - Microsoft Edge Extensions API 兼容文档（learn.microsoft.com）
> - Vue 3 官方风格指南（vuejs.org/style-guide）
> - Plasmo Framework 文档（docs.plasmo.com）
> - 开源参考：sidebery（Vue 3 + 6 万行级 Firefox 标签管理器）、tab-manager-plus（Chrome MV3）
>
> 适用项目：浏览器标签大师（Plasmo + Vue 3 + TypeScript + Chrome MV3，兼容 Chrome 102+ / Edge 102+ × macOS + Windows）

---

## 目录

- [一、权限速查（核心，红线）](#一权限速查核心红线)
- [二、核心 API 速查](#二核心-api-速查)
- [三、storage 配额与生命周期](#三storage-配额与生命周期)
- [四、Chrome ↔ Edge 兼容差异](#四chrome--edge-兼容差异)
- [五、Service Worker（MV3 SW）规范](#五service-workermv3-sw规范)
- [六、CSP 与安全规范](#六csp-与安全规范)
- [七、Plasmo 框架特性](#七plasmo-框架特性)
- [八、Vue 3 + TypeScript 最佳实践](#八vue-3--typescript-最佳实践)
- [九、扩展场景的 Vue 实战模式](#九扩展场景的-vue-实战模式)
- [十、本项目最容易犯的低级错误（≥10 条）](#十本项目最容易犯的低级错误10-条)
- [十一、参考资料](#十一参考资料)

---

## 一、权限速查（核心，红线）

### 1.1 项目用到的权限

| 权限名 | 用途 | 安装时警告 | 最低 Chrome | Edge |
|---|---|---|---|---|
| `tabs` | **不是**让你用 chrome.tabs 命名空间；而是允许读 Tab 的 `url` / `pendingUrl` / `title` / `favIconUrl` 四个敏感字段 | ⚠️ "Read your browsing history" | 一直有 | ✅ |
| `tabGroups` | 用 `chrome.tabGroups` API（query/update/move） | ⚠️ "View and manage your tab groups" | Chrome 89+ MV3+ | ✅ |
| `storage` | 用 `chrome.storage.*`（local/session/sync/managed） | ❌ 无 | 一直有 | ✅ |
| `sidePanel` | 用 `chrome.sidePanel` API | ❌ 无 | **Chrome 114+** | ✅（但 Edge 版本号映射要确认） |
| `activeTab` | 当前 tab 临时 host 权限，无警告 | ❌ 无 | 一直有 | ✅ |
| `contextMenus` | `chrome.contextMenus` 右键菜单 | ❌ 无 | 一直有 | ✅ |
| `scripting` | `chrome.scripting.executeScript()` 动态注入 | ❌ 无 | Chrome 88+ MV3+ | ✅ |
| `alarms` | `chrome.alarms` 定时任务（≥30s） | ❌ 无 | 一直有 | ✅ |
| `notifications` | `chrome.notifications` 系统通知 | ⚠️ "Display notifications" | 一直有 | ✅ |
| `favicon` | 通过 `chrome-extension://<id>/_favicon/?pageUrl=...` 读取站点 favicon | ⚠️ "Read the icons of the websites you visit" | Chrome 104+ | ✅ |

### 1.2 host_permissions vs permissions（MV3 关键区别）

**MV3 起两者必须分开**（MV2 是混在一起写的，迁移时常踩坑）：

```json
{
  "manifest_version": 3,
  "permissions": [                  // API 权限：纯 API 名
    "tabs", "storage", "sidePanel"
  ],
  "host_permissions": [             // URL 匹配模式：单独字段
    "https://*/*"
  ],
  "optional_permissions": ["..."],         // 用户运行时同意
  "optional_host_permissions": ["..."]     // 用户运行时同意
}
```

### 1.3 红线（永久禁令）

| ❌ 错误 | ✅ 正确 |
|---|---|
| 凭印象加权限名（如 `tabHide`） | 必查 https://developer.chrome.com/docs/extensions/reference/permissions-list |
| `(chrome.tabs as any).hide()` —— 用强转绕过 TS 类型 | TS 报错就说明该 API **不是稳定特性**，换实现 |
| `<all_urls>` / `*://*/*` 全网 host_permissions | 列出业务真实需要的域名（项目当前用 `https://*/*` 足够） |
| `"permissions": ["tabs", "<all_urls>"]`（MV2 写法） | MV3 host 必须单独放 `host_permissions` |

### 1.4 `tabHide` 不存在 —— 永久备忘

**重要事实**：
- Chrome MV3 的官方权限清单**没有 `tabHide`**
- `chrome.tabs.hide()` / `chrome.tabs.show()` **不在稳定 API 文档里**，是实验性特性，需要 `--enable-experimental-extension-apis` flag
- 项目原聚焦模式 PRD 选了这个 API → **整个技术方案必须重做**
- 替代方案：tabGroups 折叠 / 窗口隔离 / discard + UI 蒙层（见手册第 9.4 节）

---

## 二、核心 API 速查

### 2.1 chrome.tabs（本项目最常用）

**关键规则**：大多数 `chrome.tabs.*` 方法**不需要任何权限**就能调用。`"tabs"` 权限只是让你能读 4 个敏感字段（url/pendingUrl/title/favIconUrl）。

| 方法 | 权限 | 最低 Chrome | Edge | 备注 |
|---|---|---|---|---|
| `tabs.query()` | 无；读 url/title 需 `tabs` 或 host_permissions | 一直有 | ✅ | 项目大量用 |
| `tabs.create()` | 无 | 一直有 | ✅ | 创建新 tab |
| `tabs.update(id, {url, active, muted, pinned, ...})` | 无 | 一直有 | ✅ | 项目用 |
| `tabs.remove(id\|ids)` | 无 | 一直有 | ✅ | 关闭 tab |
| `tabs.move(id\|ids, {index, windowId})` | 无 | 一直有 | ✅ | 可在窗口内/跨窗口移动 |
| `tabs.group({tabIds, groupId?, createProperties?})` | 无（创建分组）/ `tabGroups`（操作分组属性） | Chrome 88+ | ✅ | |
| `tabs.ungroup(ids)` | 无 | Chrome 88+ | ✅ | |
| `tabs.discard(id?)` | 无 | Chrome 54+ | ✅ | 卸载内存但保留 tab strip 显示 |
| `tabs.duplicate(id)` | 无 | 一直有 | ✅ | |
| `tabs.sendMessage(id, msg)` | host_permissions 匹配 tab | 一直有 | ✅ | 给 content script 发消息 |
| `tabs.captureVisibleTab()` | `<all_urls>` 或 `activeTab` | 一直有 | ✅ | 截图 |
| `tabs.detectLanguage()` | 无 | 一直有 | ✅ | |
| `tabs.goBack() / goForward()` | 无 | Chrome 72+ | ✅ | |
| `tabs.highlight()` | 无 | 一直有 | ✅ | 高亮多选 |
| `tabs.setZoom() / getZoom()` | 无 | 一直有 | ✅ | |
| **`tabs.hide() / show()`** | **实验性，禁用** | **不稳定** | ❓ | 见 1.4 节 |

**事件**：onCreated / onUpdated / onRemoved / onActivated / onMoved / onAttached / onDetached / onHighlighted / onReplaced / onZoomChange

**Tab 对象关键字段**（同样需要 tabs 权限或 host_permissions 才能读敏感字段）：
- `id, index, windowId, active, pinned, highlighted, discarded, autoDiscardable, audible, mutedInfo`
- `groupId` (Chrome 88+), `openerTabId`, `incognito`, `status`
- `title, url, pendingUrl, favIconUrl` ← 这 4 个是敏感字段
- `frozen` (Chrome 132+), `lastAccessed` (Chrome 121+)

### 2.2 chrome.storage

| API | 容量上限 | 单项上限 | 写次配额 | 生命周期 | 最低版本 |
|---|---|---|---|---|---|
| `storage.local` | 10MB（Chrome 114+，之前 5MB） | 无 | 无 | 扩展卸载才清 | 一直有 |
| **`storage.session`** | **10MB（Chrome 112+，之前 1MB）** | 无 | 无 | 浏览器重启 / 扩展重载即清；仅内存 | **Chrome 102+ MV3+** |
| `storage.sync` | 100KB 总 | 8KB | 1800/h、120/min | 永久 + 跨设备同步 | 一直有 |
| `storage.managed` | 由企业策略定义 | - | 只读 | - | 一直有 |

**配额超限**：写操作直接失败，Promise reject 或 `runtime.lastError`。

**onChanged 事件**：所有 area 共享一个 listener，参数 `(changes, areaName)`，`areaName` 用来区分。

**unlimitedStorage 权限**：让 `storage.local` 不再限于 10MB；同时也影响 IndexedDB / Cache Storage / OPFS。

### 2.3 chrome.sidePanel（项目主入口）

| 方法 | 最低 | Edge | 用途 |
|---|---|---|---|
| `setPanelBehavior({ openPanelOnActionClick })` | 114+ | ✅ | 点工具栏图标打开 sidepanel（项目用） |
| `setOptions({ tabId?, path, enabled })` | 114+ | ✅ | 全局/按 tab 配置 sidepanel HTML 路径 |
| `getOptions({ tabId? })` | 114+ | ✅ | 查询当前配置 |
| `open({ tabId?, windowId? })` | **116+** | ✅ | 主动打开 sidepanel（必须用户手势触发） |
| `close({ tabId?, windowId? })` | **141+** | ✅ | 关闭 sidepanel |
| `getLayout()` | 140+ | ✅ | 查侧边栏在左/右 |

**事件**：
- `onOpened` (Chrome 141+)
- `onClosed` (Chrome 142+)

**manifest 必备**：
```json
{
  "permissions": ["sidePanel"],
  "side_panel": { "default_path": "sidepanel.html" }
}
```

### 2.4 chrome.tabGroups

| 方法 | 用途 |
|---|---|
| `query({ collapsed?, color?, title?, windowId? })` | 查询分组 |
| `get(groupId)` | 获取单个分组 |
| `update(groupId, { collapsed?, color?, title? })` | 改分组属性（折叠/颜色/标题） |
| `move(groupId, { index, windowId? })` | 移动分组（只能在 windowType=normal 之间移动） |

**Color 枚举**：grey / blue / red / yellow / green / pink / purple / cyan / orange

**事件**：onCreated / onMoved / onRemoved / onUpdated

### 2.5 chrome.runtime（高频）

| 方法/事件 | 用途 |
|---|---|
| `onInstalled.addListener(({reason}))` | 扩展安装/更新/重新加载时触发；reason: "install"/"update"/"chrome_update" |
| `onStartup.addListener()` | 浏览器启动；用来回填 SW 内存缓存 |
| `getURL("page.html")` | 拿扩展资源的完整 chrome-extension:// URL |
| `sendMessage(msg)` | 给自己扩展的其他 context 发消息 |
| `connect({name})` | 建立长连接 Port |
| `onMessage / onConnect` | 接收 |
| `lastError` | 异步 API 错误兜底 |

### 2.6 chrome.alarms

```json
"permissions": ["alarms"]
```

**关键限制**：
- **最小间隔 30 秒**（`periodInMinutes / delayInMinutes < 0.5` 会被忽略并 warning）
- 设备睡眠时 alarm 继续走，但**不会唤醒设备**
- 唤醒后重复 alarm 只补一次
- **持久化**：用 `persistAcrossSessions: true`（Chrome 150+ 之前在其他浏览器不可靠，**总是在 SW 启动时检查 alarm 是否存在**）

```ts
// 健壮模式
async function ensureAlarm() {
  const alarm = await chrome.alarms.get("my-alarm")
  if (!alarm) await chrome.alarms.create("my-alarm", { periodInMinutes: 1 })
}
```

### 2.7 chrome.contextMenus

```json
"permissions": ["contextMenus"]
```

**关键事实**：
- `id` 字段**必填**（service worker context 下）
- onclick 回调在 SW 里**不可用**，必须注册全局 `chrome.contextMenus.onClicked`
- 同时显示的菜单项超过 6 个时（顶级），会自动折叠到子菜单
- 顶级菜单项上限：`ACTION_MENU_TOP_LEVEL_LIMIT = 6`

```ts
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: '打开标签大师',
    contexts: ['all']
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openSidePanel') {
    chrome.sidePanel.open({ windowId: tab.windowId })
  }
})
```

**ContextType 枚举**：all / page / frame / selection / link / editable / image / video / audio / launcher / browser_action / page_action / action / tab

### 2.8 chrome.commands（快捷键）

**关键约束**：
- **必须含 `Ctrl` 或 `Alt`** —— 否则 manifest 解析失败
- 不允许 `Ctrl+Alt` 组合（避免与 AltGr 冲突）
- macOS 上 Ctrl 自动转 Command；用 `MacCtrl` 显式指 macOS 的 Control
- 最多 4 个推荐快捷键，用户可自定更多
- `_execute_action`（MV3）/ `_execute_browser_action`（MV2）/ `_execute_page_action`（MV2）是保留命令，**不触发 onCommand**

```json
{
  "commands": {
    "_execute_action": {
      "suggested_key": { "default": "Ctrl+Shift+M", "mac": "Command+Shift+M" }
    },
    "switch-to-prev": {
      "suggested_key": { "default": "Ctrl+Shift+Space", "mac": "Command+Shift+Space" },
      "description": "切换到上一个激活 tab"
    }
  }
}
```

### 2.9 chrome.action（工具栏图标）

```json
{
  "manifest_version": 3,
  "action": {
    "default_icon": { "16": "...", "24": "...", "32": "..." },
    "default_title": "标签大师",
    "default_popup": "popup.html"        // 与 sidePanel 互斥
  }
}
```

**Badge（角标）** —— 项目可用来显示标签总数：
```ts
chrome.action.setBadgeText({ text: String(tabs.length) })
chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' })
chrome.action.setBadgeTextColor({ color: '#ffffff' })   // Chrome 110+
```

- 文本 ≤ 4 字符（空间限制）
- 可按 tabId 设置（局部）或全局
- `setIcon()` 可动态改图标（用 OffscreenCanvas 生成）—— 但**不要做动画**

**注意：sidePanel + popup 互斥**
- 若设了 `openPanelOnActionClick: true`，点击图标会打开 sidepanel；不会触发 `action.onClicked`
- 若设了 `default_popup`，点击会弹 popup，不会打开 sidepanel
- 同时设两者，**popup 优先**

### 2.10 chrome.scripting（动态注入）

```json
"permissions": ["scripting"]
+ "activeTab" 或 host_permissions 匹配目标 URL
```

```ts
chrome.scripting.executeScript({
  target: { tabId, allFrames?: true, frameIds?: [] },
  func: () => document.title,        // 或 files: ['script.js']
  args: [arg1],                       // 传给 func，必须 JSON 可序列化
  world: 'ISOLATED' | 'MAIN'         // ISOLATED 是扩展隔离环境，MAIN 是页面 JS 环境
})
```

**关键事实**：
- `func` 是序列化后注入的——**闭包和外部引用全部丢失**，依赖项必须通过 `args` 传入
- 返回值若为 Promise，会自动 await
- `insertCSS()` 不返回结果

---

## 三、storage 配额与生命周期

完整对照表（再次强调，因为是项目最高频踩坑点）：

| 选什么 | 长期偏好 | 会话状态 | 跨设备同步 | 临时数据 |
|---|---|---|---|---|
| **方案** | `storage.local` | `storage.session` | `storage.sync` | 内存变量 |
| 用例 | 用户配置、自定义标记、稍后处理列表 | 撤销栈、Tab 切换历史 | 跨设备主题/字体偏好 | computed 派生数据 |
| 容量 | 10MB | 10MB | 100KB 总 / 8KB 单项 | 视内存 |
| 生命周期 | 卸载扩展才清 | 浏览器重启 / 扩展重载即清 | 永久 + 跨设备 | SW 休眠就丢 |
| 最低版本 | 一直有 | **Chrome 102+** | 一直有 | - |
| 调用上限 | 无 | 无 | 写 1800/h | - |
| Edge 兼容 | ✅ | ✅（Edge 102+ 起） | ✅ | - |

**项目现有使用**（与规范对照）：
- 树形父子关系 `treeParentMap` → `storage.local` ✅
- Tab 切换历史 → `storage.session` ✅
- 自定义标记 → `storage.local` ✅
- 聚焦模式状态 → `storage.session` ✅

---

## 四、Chrome ↔ Edge 兼容差异

### 4.1 Edge 支持的相关 API（项目用到的）

**全部支持** ✅：tabs / tabGroups / storage / sidePanel / runtime / scripting / action / alarms / contextMenus / commands / notifications / activeTab / favicon

### 4.2 Edge 不支持的 API

| API | 替代方案 |
|---|---|
| `identity.getAccounts` / `identity.getAuthToken` | 用 `identity.launchWebAuthFlow` |
| `audio`, `documentScan`, `enterprise.*`, `fileBrowserHandler`, `fileSystemProvider`, `loginState`, `platformKeys`, `printing*`, `vpnProvider`, `wallpaper`, `certificateProvider` | ChromeOS-only，桌面浏览器都用不到 |
| `gcm`, `instanceID` | 通常不需要 |
| `readingList` | Edge 没有 reading list 同名功能 |

### 4.3 版本号映射

Edge 是 Chromium 系，**Edge N ≈ Chromium N**（基本同步发布）。所以 "Chrome 102+" 在 Edge 上对应 "Edge 102+"。

### 4.4 实操检查清单（每次改动跑一遍）

1. 用到的 API 在 Edge 文档里有列出 ✅
2. 用到的 API 最低 Chrome 版本，Edge 同版本可用 ✅
3. Manifest 字段如 `side_panel`, `tabGroups`, `offscreen` 等都被 Edge 支持 ✅
4. 跨平台测试矩阵：Chrome × macOS, Chrome × Windows, Edge × macOS, Edge × Windows（4 格全测，见 `[[constraint-target-platforms]]`）

---

## 五、Service Worker（MV3 SW）规范

### 5.1 SW 的本质

> "Extension service workers 是扩展的中央事件处理器"

**关键认知**：
- MV3 没有"长驻 background page"。SW 由事件唤醒，事件处理完会休眠（30 秒空闲后）
- SW **没有 DOM**，不能用 `document` / `window` / `localStorage` —— 用 `chrome.storage` 或 OffscreenDocument 兜底
- SW 也**不能用 `setTimeout` 做长延迟**，会随 SW 一起被回收 —— 用 `chrome.alarms`

### 5.2 项目当前 SW 模式（已遵循 [[pattern-sw-as-collector]]）

```ts
// background.ts —— 永久采集者
// 1. onInstalled / onStartup → 从 storage 回填内存
// 2. chrome.tabs.onCreated → 持续记录父子关系
// 3. chrome.tabs.onRemoved → 级联重连父子关系
// UI 端（sidepanel）只消费，不重复采集
```

### 5.3 SW 启动时 checklist

```ts
// 1. 立刻挂事件（否则唤醒错过事件）
chrome.tabs.onCreated.addListener(onTabCreated)
chrome.tabs.onRemoved.addListener(onTabRemoved)

// 2. onInstalled / onStartup 回填内存缓存
chrome.runtime.onInstalled.addListener(async () => {
  await loadMap()        // 从 storage 读
})
chrome.runtime.onStartup.addListener(loadMap)

// 3. 顶层也调用一次（处理热重载后第一次事件之前的初始化）
loadMap()
```

### 5.4 storage.onChanged 双向同步

```ts
// 别处写 storage → 同步到 SW 内存（避免被旧数据覆盖）
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes[KEY]) return
  cache = changes[KEY].newValue || {}
})
```

---

## 六、CSP 与安全规范

### 6.1 默认 CSP（MV3）

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self';",
    "sandbox": "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';"
  }
}
```

### 6.2 最低可定制 CSP

```json
"extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
```

**不能放宽**：MV3 强制 `script-src` 不允许 `'unsafe-eval'` / `'unsafe-inline'` / 远程脚本。试图放宽时 Chrome 会在安装时报：

```
'content_security_policy.extension_pages': Insecure CSP value "'unsafe-eval'" in directive 'script-src'.
```

### 6.3 安全红线

| ❌ 禁止 | ✅ 正确 |
|---|---|
| `innerHTML = userInput` | `textContent = userInput` 或 `createElement` + `appendChild` |
| `document.write(html)` | 同上 |
| `eval(code)` / `new Function(code)` | MV3 强制 CSP 禁止 |
| HTTP 请求 | HTTPS only |
| `<all_urls>` / `*://*/*` | 列具体域名 |
| `runtime.onMessageExternal` 不校验 sender | `if (sender.id !== TRUSTED_ID) return` |
| `tabs.create({ url: input })` 用户输入直接传 | 白名单或 schema 校验 |

### 6.4 内容脚本边界

- Content script 跟页面**共享 DOM**，但运行在隔离 V8 上下文
- 敏感操作（chrome API 调用、读取本地存储）应放 SW，**不要放 content script**
- 假设 content script 的消息**可能被恶意页面伪造** → 永远校验 `sender` + sanitize input

---

## 七、Plasmo 框架特性

### 7.1 文件路径 → 扩展角色映射

| 文件 | 角色 |
|---|---|
| `popup.vue` / `popup.tsx` | Browser Action 弹出窗 |
| `sidepanel.vue` | Chrome 114+ 侧边栏 |
| `newtab.vue` | 新标签页覆盖 |
| `options.vue` | 扩展选项页 |
| `background.ts` | Service Worker（单文件） |
| `background/index.ts` + `background/messages/*.ts` | SW + Plasmo Messaging 处理器（需要 @plasmohq/messaging） |
| `contents/<name>.ts(x)` | Content script，文件内 `export const config` 定义 matches |

### 7.2 manifest 自动生成

Plasmo **不要手写 manifest.json**——它根据：
1. 文件结构（自动加 popup/sidepanel/newtab/background 字段）
2. `package.json` 的 `manifest` 字段（覆盖/补充）
3. content scripts 文件里的 `export const config`

最终生成 `build/chrome-mv3-{dev,prod}/manifest.json`。

```json
// package.json
"manifest": {
  "host_permissions": ["https://*/*"],
  "permissions": ["tabs", "tabGroups", "storage", "sidePanel"]
}
```

### 7.3 import 别名

Plasmo 内置：
- `~` → 项目根（项目用 `~components/`, `~composables/`, `~lib/`, `~types/`）
- `data-base64:./icon.png` → base64 inline 资源
- `data-text:./template.html` → 文本 inline

### 7.4 @plasmohq/storage（可选，本项目未用）

特点：
- 跨 SW/CS/扩展页面状态同步
- React hook 形式（`useStorage`）—— Vue 项目不太适用
- 自动 fallback 到 web localStorage

**本项目用原生 `chrome.storage.*` 更轻**，不引入 plasmo/storage。

### 7.5 @plasmohq/messaging（可选，本项目未用）

如果项目变复杂（多组件跨 SW 通信），可考虑迁移到这个。当前 SW 只需 `storage.onChanged` 同步即可，不需要。

---

## 八、Vue 3 + TypeScript 最佳实践

### 8.1 官方风格指南（4 个优先级）

**A 类（必须遵守，防错）：**
- 组件名 ≥ 2 个单词（避免和 HTML 标签冲突）：`TabItem` ✅；`Item` ❌
- `v-for` 必须配 `key`（除非用 `<template v-for>` 的特殊场景）
- 避免 `v-if` 和 `v-for` 同时用在一个元素上（用 computed 过滤）
- 组件作用域样式（`<style scoped>` 或 CSS Modules）
- props 名 camelCase 定义 / kebab-case 模板传值

**B 类（强烈推荐）：**
- 单文件组件
- 组件命名 PascalCase（文件名 + import 名）
- prop 必须详细定义类型
- 自闭合 vs 显式闭合：组件 PascalCase 自闭合 `<TabItem />`
- 模板表达式简单，复杂逻辑放 computed/method
- 复杂的 computed 拆成多个简单 computed
- 引号风格统一

**C 类（推荐）：**
- 组件选项顺序统一
- 元素属性顺序统一
- 多 attribute 的元素分行

**D 类（慎用）：**
- 隐式父子通信（建议用 emits 显式）
- 全局状态用 Pinia 而非简单的 `ref` 共享（本项目用 composables 替代 Pinia，已确认）

### 8.2 `<script setup>` + Composition API 模式

**项目用的就是这个模式**，关键约定：

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { TabItem } from '~types/tab'

// 1. props/emits 类型化（用泛型，最干净）
const props = defineProps<{
  tabs: readonly TabItem[]
  isBatch?: boolean
}>()

const emit = defineEmits<{
  (e: 'activate', id: number): void
  (e: 'close', id: number): void
}>()

// 2. 状态：ref 优先于 reactive（更可预测）
const selectedIds = ref<number[]>([])

// 3. 派生：computed
const selectedCount = computed(() => selectedIds.value.length)

// 4. 副作用：watch / watchEffect
watch(() => props.tabs, () => { /* ... */ })

// 5. 生命周期
onMounted(() => { /* ... */ })

// 6. 方法
function handleActivate(id: number) {
  emit('activate', id)
}
</script>
```

### 8.3 ref vs reactive 决策树

```
要存的值是...
├── 基本类型（number/string/boolean） → ref ✅
├── 对象/数组，且会整体重新赋值 → ref ✅
├── 对象，只改属性不重新赋值 → reactive 也行，但 ref 也能用（更一致）
└── 始终用 ref（项目约定，统一就好）
```

**原因**：
- `ref` 在 setup 里要 `.value`，但模板自动解包 → 一致性最好
- `reactive` 解构会破坏响应性，新人易踩坑
- `ref<T>()` 比 `reactive<T>()` 类型推导更可靠

### 8.4 composables 命名 & 设计

| 规则 | 示例 |
|---|---|
| 必须 `useXxx` 前缀 | `useTabManager`, `useFocusMode` |
| 返回值是 `{ ref, computed, function }` 对象（不返回 reactive） | `return { tabs, activate, close }` |
| 不要在 setup 外部调用 | composable 内可以；外部纯函数用 lib/ |
| 写测试时可独立测试（不依赖组件） | 用 `setup` 包一层即可 |

### 8.5 TypeScript 严格模式

`tsconfig.json` 应启用：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true
  }
}
```

**禁止用 `any`**，例外：
- `chrome.*` API 在 TS 类型中确实缺失时（这种情况要怀疑 API 不稳定，见 1.3 节）

---

## 九、扩展场景的 Vue 实战模式

### 9.1 chrome.* API 与 reactive 的边界

```ts
// composables/useTabManager.ts
export function useTabManager() {
  const tabs = ref<TabItem[]>([])

  async function refresh() {
    const list = await chrome.tabs.query({})
    tabs.value = list.map(toTabItem)
  }

  function setupListeners() {
    chrome.tabs.onCreated.addListener(refresh)
    chrome.tabs.onRemoved.addListener(refresh)
    chrome.tabs.onUpdated.addListener(refresh)
  }

  onMounted(() => {
    refresh()
    setupListeners()
  })

  return { tabs }
}
```

**关键**：chrome API 是 Promise/事件式的，**触发任何变化都通过 refresh 写回 ref**，UI 自动响应。**不要直接绑 chrome.* 到 reactive**。

### 9.2 storage.onChanged → ref 同步

```ts
// composables/useCustomTags.ts
const customTags = ref<Record<number, string[]>>({})

async function load() {
  const { customTags: stored } = await chrome.storage.local.get('customTags')
  customTags.value = stored || {}
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.customTags) {
    customTags.value = changes.customTags.newValue || {}
  }
})

onMounted(load)
```

### 9.3 SW ↔ UI 通信选型

| 场景 | 用什么 |
|---|---|
| UI 改了数据，要让 SW 知道 | **写 storage** → SW 的 `storage.onChanged` listener 收到 |
| SW 收到事件，要让 UI 知道 | **写 storage** → UI 的 `storage.onChanged` listener 收到 |
| UI 想问 SW 一个一次性问题（返回值） | `chrome.runtime.sendMessage` + SW 的 `onMessage` |
| 长连接（流式数据） | `chrome.runtime.connect()` + Port |

**项目约定**：**优先用 storage 中转**（参考 [[pattern-sw-as-collector]]）—— 比 messaging 更松耦合，刷新页面也能恢复。

### 9.4 聚焦模式技术方案（基于研究的重设计）

**已废弃方案**：`chrome.tabs.hide()`（实验 API，不能用）

**候选方案 A：tabGroups 折叠**

```ts
async function enterFocus(focusedIds: number[]) {
  const allTabs = await chrome.tabs.query({ currentWindow: true })
  const otherIds = allTabs
    .filter(t => !focusedIds.includes(t.id!) && !t.pinned)
    .map(t => t.id!)

  // 把非聚焦标签塞进一个分组并折叠
  const groupId = await chrome.tabs.group({ tabIds: otherIds })
  await chrome.tabGroups.update(groupId, {
    collapsed: true,
    title: '🌙 已隐藏',
    color: 'grey'
  })

  await chrome.storage.session.set({ focusGroupId: groupId })
}

async function exitFocus() {
  const { focusGroupId } = await chrome.storage.session.get('focusGroupId')
  if (!focusGroupId) return
  const grouped = await chrome.tabs.query({ groupId: focusGroupId })
  await chrome.tabs.ungroup(grouped.map(t => t.id!))
  await chrome.storage.session.remove('focusGroupId')
}
```

**优点**：
- API 稳定（Chrome 89+ / Edge 全支持）
- 用户可手动展开（"安全感"）
- 不破坏窗口布局

**候选方案 B：新窗口隔离**

```ts
async function enterFocus(focusedIds: number[]) {
  const win = await chrome.windows.create({ focused: true })
  await chrome.tabs.move(focusedIds, { windowId: win.id, index: -1 })
}
```

**优点**：彻底物理隔离
**缺点**：用户原窗口可能误关；侧边栏跟不过去

**推荐方案 A**（tabGroups 折叠）—— 视觉接近 PRD 设想、易回退、不冒大险。

---

## 十、本项目最容易犯的低级错误（≥10 条）

按"已踩过"和"潜在"两类：

### 10.1 已踩过的（教训）

1. **`tabHide` 权限不存在** → 加 manifest 时凭印象，导致扩展加载失败
2. **`chrome.tabs.hide()` 用 `as any` 强转** → API 本身不是稳定特性，扩展永远跑不通
3. **CLAUDE.md 写了不存在的 newtab.vue** → 文档没跟上代码
4. **build/chrome-mv3-dev 残留 dev server 进程** → 多 plasmo dev 撞端口，HMR 报错
5. **`@tailwind base` 在 Trae 报错** → IDE 内置 CSS 验证不认 PostCSS at-rule，需关掉

### 10.2 潜在的（提前防范）

6. **MV3 host_permissions 写在 permissions 里** → MV2 写法，MV3 必须分开字段
7. **alarms 周期 < 30 秒** → 静默被忽略，需 ≥ 0.5 分钟
8. **CSP 加 `'unsafe-eval'`** → MV3 强制拒绝，安装失败
9. **content script 直接调 chrome.tabs API** → CS 不能用 chrome.tabs，需通过 SW 中转
10. **content script 用 `chrome.storage` 在 MAIN world** → 拿不到 chrome.* API，需 ISOLATED world
11. **commands 快捷键没含 Ctrl/Alt** → manifest 解析失败
12. **storage.sync 频繁写超 120 次/分钟** → 静默 reject + lastError
13. **storage.sync 单项 > 8KB** → 静默失败；用 local 或拆分
14. **innerHTML 接受用户输入** → CSP 防护不住 XSS；用 textContent
15. **service worker 用 setTimeout** → SW 30s 后被回收，timer 丢失；用 chrome.alarms
16. **service worker 用 localStorage / document** → SW 没有 DOM；用 chrome.storage / OffscreenDocument

---

## 十一、参考资料

### 11.1 官方文档（已下载到 `/tmp/ext-docs/`）

- [Chrome Permissions List](https://developer.chrome.com/docs/extensions/reference/permissions-list)
- [chrome.tabs](https://developer.chrome.com/docs/extensions/reference/api/tabs)
- [chrome.storage](https://developer.chrome.com/docs/extensions/reference/api/storage)
- [chrome.sidePanel](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
- [chrome.tabGroups](https://developer.chrome.com/docs/extensions/reference/api/tabGroups)
- [chrome.action](https://developer.chrome.com/docs/extensions/reference/api/action)
- [chrome.scripting](https://developer.chrome.com/docs/extensions/reference/api/scripting)
- [chrome.contextMenus](https://developer.chrome.com/docs/extensions/reference/api/contextMenus)
- [chrome.alarms](https://developer.chrome.com/docs/extensions/reference/api/alarms)
- [chrome.commands](https://developer.chrome.com/docs/extensions/reference/api/commands)
- [Declare Permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions)
- [MV3 Manifest Migration](https://developer.chrome.com/docs/extensions/develop/migrate/manifest)
- [Stay Secure](https://developer.chrome.com/docs/extensions/develop/security-privacy/stay-secure)
- [CSP for Extensions](https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy)
- [Service Workers](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers)
- [Edge Extension API Support](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/developer-guide/api-support)
- [Vue 3 Style Guide](https://vuejs.org/style-guide/)
- [Plasmo Framework](https://docs.plasmo.com/framework)
- [Plasmo Storage](https://docs.plasmo.com/framework/storage)
- [Plasmo Messaging](https://docs.plasmo.com/framework/messaging)

### 11.2 开源参考实现（已 clone 到 `/tmp/ext-refs/`）

| 项目 | 技术栈 | 看什么 |
|---|---|---|
| [sidebery](https://github.com/mbnuqw/sidebery) | Vue 3 + TS + Firefox（MV2） | 服务模块化（`.bg.ts` / `.fg.ts` 拆分）、tabs 子模块拆分（.handlers / .groups / .scroll / .colors / .rm / .move / .create / .sorting）、60+ Vue 组件命名（panel.tabs.vue / popup.context-menu.vue） |
| [tab-manager-plus](https://github.com/stefanXO/Tab-Manager-Plus) | TS + Chrome MV3（无框架） | manifest 权限清单（含 `favicon`）、commands 快捷键、service_worker 用法 |

### 11.3 本项目相关记忆

- [[constraint-target-platforms]] — 当前兼容矩阵：Chrome+Edge × macOS+Windows
- [[standard-cross-browser-compat]] — Chrome/Edge/Firefox/Safari API 差异速查
- [[standard-extension-best-practices]] — 权限最小化/SW 生命周期/安全/性能
- [[standard-extension-testing]] — 单元/E2E/手动 QA 三层测试策略
- [[pattern-sw-as-collector]] — SW 永久采集 + UI 只消费的架构原则
- [[lesson-verify-api-before-coding]] — 改 manifest / 调 chrome.* 必须先核实官方文档

---

**最后更新**：2026-06-27
**核实状态**：所有 API 版本、权限名、容量配额均与官方文档逐字核对
