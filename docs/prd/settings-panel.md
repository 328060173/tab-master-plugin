# 设置面板（Settings Panel）

> Status: Draft · Author: product-manager (主 Claude 代行) · Date: 2026-06-27 · Feature slug: `settings-panel`

---

## 1. 背景与目标

### 现状/痛点
- sidepanel.vue Header 已有「设置」下拉菜单，但**所有项都是占位 button**，点击无任何反应
- 用户无法调整主题（白天用着刺眼）、字体大小（视力差的用户没法用）、界面语言（英文用户用不了）
- 默认视图、默认排序、卡片密度等显示偏好无法配置，每次打开扩展都要手动切

### 目标
把现有"设置下拉菜单"升级为**真正可用的设置面板**：
1. **界面主题** —— 浅色 / 深色 / 跟随系统
2. **字体设置** —— 字号（紧凑/标准/宽松） + 字体族（系统/等宽）
3. **界面语言** —— 简体中文 / English（i18n 基础设施 + 中文 fallback）
4. **显示设置** —— 默认视图 / 默认排序 / 卡片密度
5. **未实现项灰显** —— 登录账号 / 云同步 / 快照（依赖后端，集体置灰 + tooltip）

### 非目标（详见 §9）
- 不做后端账号体系、不做云同步、不做导入/导出、不做快捷键自定义、不做完整 i18n 翻译（英文只做骨架占位）

### 成功指标
- 切换主题 / 字号 / 卡片密度 → 100ms 内整个 sidepanel 视觉更新
- 重启浏览器后所有设置保持
- 后端相关项明确灰显并 hover 提示，不再误导用户去点

---

## 2. 用户场景与故事

### 用户画像
- **重度使用者**：每天 8h+ 开扩展，对默认浅色刺眼疲劳 → 主题切深色
- **小屏用户**：MacBook 13" / 笔记本用户标签多希望紧凑视图
- **海外用户**：习惯 English UI（本期英文翻译先占位，骨架先建好）
- **个性化用户**：默认视图想用图标视图但每次打开扩展都是平铺

### User Story
- **US-1**：作为夜间工作者，我想切换深色模式，以便不刺眼
- **US-2**：作为高密度用户，我想用紧凑字号 + 紧凑密度，一屏看更多标签
- **US-3**：作为重度用户，我希望每次打开扩展默认就是我喜欢的视图和排序，不用每次切
- **US-4**：作为用户，我点击「云同步」时希望明确知道"还没做"，而不是点了没反应一脸懵

### 关键路径
```
用户点 Header 设置图标
  → 下拉菜单展开
  → 已实现项（主题/字体/语言/显示）正常可点 + hover 高亮
  → 未实现项（登录/云同步/快照）置灰 + hover 显示 "需要后端服务，敬请期待"
  → 点击 "设置..." (新增主入口)
  → 打开设置弹窗 SettingsDialog
  → 切换主题/字号 → 即时生效
  → 关闭弹窗 → 设置已自动保存到 chrome.storage.local
```

---

## 3. 竞品参考

| 产品 | 同类功能 | 值得学的 | 要避开的 |
|---|---|---|---|
| **Chrome 原生 chrome://settings** | 系统设置 | 分组清晰、即时生效 | 太重、要的不要的全有 |
| **Vivaldi 浏览器设置** | 大量个性化 | 实时预览效果 | 选项太多导致认知过载 |
| **1Password 浏览器扩展** | 简洁设置面板 | 单弹窗承载、分类用 tab | 部分项需登录才能调 |
| **Tab Manager Plus** | 简单偏好 | 默认值合理 | UI 老旧 |

### 差异化定位
- **轻量**：只暴露**当下能控制**的 4 项核心设置，其他统一灰显避免吃配置债
- **即时生效**：主题 / 字号 / 卡片密度切换 ≤ 100ms 看到效果，无需重启
- **不强造**：i18n 基础设施先搭好，英文翻译留给后续迭代

---

## 4. 交互设计

### 4.1 入口改造

**现状**：Header 右上角设置 ⚙️ → 下拉菜单（一坨 button）

**改造**：

```
[⚙️ 设置]                      ← Header 按钮
  ├── 👤 登录账号 [灰显 🛈]          ← 后端未建，置灰 + tooltip
  ├── ─────────────────────
  ├── 🎨 界面主题 →                  ← 可点，hover 显示子菜单
  ├── 🔤 字体设置 →                  ← 可点
  ├── 🌐 界面语言 →                  ← 可点
  ├── ─────────────────────
  ├── ☁️ 云同步 [灰显 🛈]            ← 后端未建
  ├── 📷 快照 [灰显 🛈]              ← 后端未建
  ├── ─────────────────────
  └── ⚙️ 设置...                    ← 新增！打开完整 SettingsDialog
```

**灰显 tooltip 文案**："需要后端服务，敬请期待"

**子菜单决策**：主题/字体/语言 hover 时**直接展开二级菜单**（不打开弹窗），方便快速切换；显示设置项较多，统一进 SettingsDialog。

### 4.2 二级菜单：界面主题

```
┌──────────────────┐
│ 🎨 界面主题 →    │
└──────────────────┘
        └──┐
           ▼
        ┌──────────────────┐
        │ ☀️ 浅色 [✓]      │
        │ 🌙 深色          │
        │ 💻 跟随系统      │
        └──────────────────┘
```

- 当前选中项打勾
- 点击切换 → 即时生效 → 二级菜单关闭

### 4.3 二级菜单：字体设置

```
┌──────────────────┐
│ 🔤 字体设置 →    │
└──────────────────┘
        └──┐
           ▼
        ┌────────────────────┐
        │ 字号              │
        │   紧凑 (12px)      │
        │   标准 (13px) [✓]  │
        │   宽松 (14px)      │
        │ ─────────────────  │
        │ 字体              │
        │   系统默认 [✓]    │
        │   等宽            │
        └────────────────────┘
```

### 4.4 二级菜单：界面语言

```
┌──────────────────┐
│ 🌐 界面语言 →    │
└──────────────────┘
        └──┐
           ▼
        ┌──────────────────────┐
        │ 简体中文 [✓]         │
        │ English (占位)       │
        └──────────────────────┘
```

切换语言后 toast 提示：「语言已切换，重新打开侧边栏生效」（i18n 框架先搭，英文用 fallback 中文文案，不阻塞）。

### 4.5 完整设置弹窗 SettingsDialog（点 "⚙️ 设置..." 进入）

```
┌───────────────────────────────────────┐
│ ⚙️ 设置                          [✕]  │
├───────────────────────────────────────┤
│ 显示设置                              │
│                                       │
│ 默认视图                              │
│ ○ 平铺  ● 列表  ○ 图标  ○ 树形       │
│                                       │
│ 默认排序                              │
│ ○ 按域名  ● 时间倒序  ○ 时间正序     │
│                                       │
│ 卡片密度                              │
│ ○ 紧凑  ● 标准  ○ 宽松               │
│                                       │
├───────────────────────────────────────┤
│ 界面主题  [☀️浅色] [🌙深色] [💻跟随]  │
│ 字号      [紧凑] [标准] [宽松]        │
│ 字体      [系统默认] [等宽]           │
│ 语言      [简体中文] [English]        │
│                                       │
├───────────────────────────────────────┤
│ 关于                                  │
│ 浏览器标签大师 v0.0.1                 │
│ [GitHub] [反馈]                       │
└───────────────────────────────────────┘
```

- **即时生效**：所有改动立即生效，不需要 "保存" 按钮
- **关闭**：点 ✕ 或 ESC 或弹窗外区域即可关闭
- **去重**：弹窗内的主题/字体/语言**和下拉菜单二级菜单同步**（同一 store）

### 4.6 灰显 tooltip 交互

```
┌──────────────────────┐
│ ☁️ 云同步       [🛈] │   ← 灰色 + 不可点
└──────────────────────┘
hover →
  ┌────────────────────────┐
  │ 需要后端服务，敬请期待 │
  └────────────────────────┘
```

实现：button 加 `disabled` + `opacity-50 cursor-not-allowed`，title 属性兜底 tooltip。

### 4.7 边界状态

| 场景 | 系统行为 |
|---|---|
| 首次安装，无任何配置 | 用默认值兜底（见 §5.2） |
| 老用户已有 `localStorage.viewMode` | **迁移**：读取后写入新 storage key，删除旧 key |
| 用户同时开多个 sidepanel 窗口 | 监听 `chrome.storage.onChanged` 跨页同步 |
| 主题选「跟随系统」后系统切色 | 监听 `prefers-color-scheme` mediaquery 变化 |
| 切换语言但翻译未完成 | 缺失 key 自动 fallback 到中文，不报错 |
| 切换字体到等宽但系统无等宽 font | 用 CSS `font-family: ui-monospace, ...` 兜底 |
| storage 写入失败 | 控制台 warn，UI 不报错（设置层不阻塞主流程） |

---

## 5. 数据模型

### 5.1 Storage Schema

**Key**：`tabMasterSettings`（统一存到 `chrome.storage.local`）

```typescript
interface TabMasterSettings {
  theme: 'light' | 'dark' | 'system'         // 默认 'light'
  fontSize: 'compact' | 'normal' | 'loose'   // 默认 'normal'
  fontFamily: 'system' | 'mono'              // 默认 'system'
  language: 'zh-CN' | 'en-US'                // 默认 'zh-CN'
  defaultView: 'tile' | 'list' | 'icon' | 'tree'  // 默认 'tile'
  defaultSort: 'domain' | 'time-asc' | 'time-desc' // 默认 'time-desc'
  cardDensity: 'compact' | 'normal' | 'loose' // 默认 'normal'
}
```

### 5.2 默认值

```typescript
const DEFAULT_SETTINGS: TabMasterSettings = {
  theme: 'light',
  fontSize: 'normal',
  fontFamily: 'system',
  language: 'zh-CN',
  defaultView: 'tile',
  defaultSort: 'time-desc',
  cardDensity: 'normal',
}
```

### 5.3 迁移老用户

启动时检查：
```typescript
const oldViewMode = localStorage.getItem('viewMode')
if (oldViewMode && !settingsExist) {
  newSettings.defaultView = oldViewMode  // 迁移
  localStorage.removeItem('viewMode')    // 清理
}
```

### 5.4 字号/密度 CSS 变量映射

```css
/* 字号 */
:root.fs-compact { font-size: 12px; }
:root.fs-normal  { font-size: 13px; }
:root.fs-loose   { font-size: 14px; }

/* 卡片密度（控制 padding/gap） */
:root.density-compact { --card-pad: 0.375rem; --card-gap: 0.25rem; }
:root.density-normal  { --card-pad: 0.5rem;   --card-gap: 0.5rem;  }
:root.density-loose   { --card-pad: 0.75rem;  --card-gap: 0.75rem; }
```

### 5.5 主题切换实现

```typescript
// useSettings.ts 监听 theme 变化
watch(theme, (v) => {
  const root = document.documentElement
  root.classList.remove('theme-light', 'theme-dark')
  if (v === 'system') {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.add(dark ? 'theme-dark' : 'theme-light')
  } else {
    root.classList.add(`theme-${v}`)
  }
}, { immediate: true })
```

Tailwind 暂用 `class="theme-dark"` 触发暗色样式。

---

## 6. 接口契约

| 行为 | API | 说明 |
|---|---|---|
| 读设置 | `chrome.storage.local.get(['tabMasterSettings'])` | 启动时一次，缺失字段用默认值兜底 |
| 写设置 | `chrome.storage.local.set({ tabMasterSettings: {...} })` | 任意字段变化立即写 |
| 跨页同步 | `chrome.storage.onChanged.addListener` | 监听 area === 'local' && key === 'tabMasterSettings' |
| 系统主题监听 | `window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change')` | 仅 theme === 'system' 时启用 |

**无后端调用**，无新增 manifest 权限。

---

## 7. 性能 / 安全 / 兼容

### 7.1 性能预算
- 主题切换：≤ 100ms（class 切换 + Tailwind 重绘）
- 字号切换：≤ 100ms
- 弹窗打开：≤ 50ms
- storage 读取（启动时）：≤ 30ms

### 7.2 安全
- 无新增网络请求
- 无新增 manifest 权限（`storage` 已有）
- 设置数据不含敏感信息

### 7.3 兼容
- **目标矩阵**：Chrome 102+ / Edge 102+ × macOS / Windows（与项目基线一致）
- **API 检测**：`chrome.storage.local` 是稳定 API，无需特殊检测
- **降级**：storage 写入失败 → console.warn，UI 用内存态兜底（刷新后丢失，但不影响功能）

---

## 8. 验收标准

### 功能验收
- [ ] Header 设置下拉菜单出现「设置...」新入口，点击打开 SettingsDialog
- [ ] 灰显项（登录/云同步/快照）：disabled 不可点 + hover 显示 "需要后端服务，敬请期待"
- [ ] 「界面主题」hover 展开二级菜单，含 浅色/深色/跟随系统，当前选中打勾
- [ ] 「字体设置」hover 展开，字号 3 档 + 字体族 2 档
- [ ] 「界面语言」hover 展开，中文 / English 二选一
- [ ] SettingsDialog 含 显示设置（默认视图/默认排序/卡片密度）+ 主题/字体/字号/语言 整合视图 + 关于区
- [ ] 主题切换 ≤ 100ms 整个 sidepanel 颜色变化
- [ ] 字号切换 ≤ 100ms 字号变化
- [ ] 卡片密度切换 ≤ 100ms padding/gap 变化
- [ ] 默认视图设置后，关闭再打开扩展默认进入该视图
- [ ] 默认排序设置后，启动时按该排序
- [ ] 切换语言 toast 提示 "重新打开侧边栏生效"
- [ ] 跟随系统主题：手动切系统主题 → sidepanel 跟随变化
- [ ] 重启浏览器后所有设置保持

### 边界验收
- [ ] 首次安装，所有项显示默认值（浅色 / 标准 / 系统字体 / 中文 / 平铺 / 时间倒序 / 标准密度）
- [ ] 老用户（有 `localStorage.viewMode`）→ 启动时迁移到新 storage 并清理旧 key
- [ ] 同时打开 2 个 sidepanel，一边改设置，另一边实时同步
- [ ] storage 写入失败时 console.warn，UI 仍可用

### 兼容验收
- [ ] Chrome 102+ × macOS / Windows
- [ ] Edge 102+ × macOS / Windows

---

## 9. Non-Goals（明确不做）

- ❌ **登录账号 / 云同步 / 快照**：依赖后端，本期灰显
- ❌ **完整 i18n 翻译**：英文翻译只做骨架占位，缺失 key fallback 中文
- ❌ **导入/导出设置**：V2 再说
- ❌ **快捷键自定义**：超出范围
- ❌ **更多主题**（如棕色/绿色/护眼黄）：MVP 只做 浅/深/系统
- ❌ **多字体选择**（如思源/方正等自定义 font）：仅系统 + 等宽
- ❌ **导出/导入配置**：V2 再说
- ❌ **细粒度子项**（如每个视图独立排序）：本期统一全局

---

## 10. 风险与未决问题

### 已知风险
| 风险 | 影响 | 缓解 |
|---|---|---|
| Tailwind 暗色模式需要在大量组件加 `dark:` 前缀 | 工作量大 | 本期先把基础设施搭好，暗色样式可分批补 |
| 字号变化触发整个布局重绘 | 性能 | 用 CSS 变量 + html.fs-* class 一次切换 |
| 多 sidepanel 同时打开冲突 | 设置覆盖 | storage.onChanged 单向同步即可 |

### 未决问题
> @TODO: 暗色模式的具体配色方案？建议第一版用 Tailwind 默认 dark: 前缀方案，主色用 gray-800/gray-900 即可，无需自定义色板
> @TODO: 关于区是否显示扩展版本号？是的，读 chrome.runtime.getManifest().version
> @TODO: SettingsDialog 是否支持键盘 ESC 关闭？是的

---

## 11. 给下游开发的提示

### 必读
1. 改 manifest 前查 https://developer.chrome.com/docs/extensions/reference/permissions-list（红线）
2. 调 chrome.* 前查官方文档 Methods 章节
3. 禁用 `(chrome.x as any)` 强转
4. 禁用 v-html（XSS）
5. 不修改聚焦模式 / 分组功能现有行为

### 强烈建议
- **新建 `composables/useSettings.ts`** 集中管理所有设置 + 监听 storage.onChanged
- **新建 `components/SettingsDialog.vue`** 承载完整设置弹窗
- **修改 `sidepanel.vue`** 替换现有占位下拉为真实交互（注意：去掉重复的两套下拉菜单，sidepanel.vue 内现有两套，应该合并为一套或排查是否真有 2 套需要保持一致）
- **i18n 基础设施**：新建 `lib/i18n.ts` + `lib/locales/zh-CN.ts` + `lib/locales/en-US.ts`，提供 `t(key)` 函数，缺失 key 自动 fallback 中文
- **主题样式**：tailwind.config.js 启用 `darkMode: 'class'`（如果还没启用），暗色样式分批加（本期至少 Header / Nav / 卡片背景 / 主背景）
- **TypeScript**：严格 + 完整类型 + 禁止 `any`
- **测试矩阵**：Chrome + Edge × macOS + Windows 4 格全测

### 不要做
- 不要新增 manifest 权限
- 不要修改 useFocusMode.ts / useTabGroups.ts
- 不要 git commit / push（用户规矩）
- 不要 hover 二级菜单做太复杂，能用就行
