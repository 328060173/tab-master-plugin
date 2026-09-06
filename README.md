# 🗂️ 浏览器标签大师 · Tab Master

> 管理、搜索、整理和备份浏览器标签页——下班直接关浏览器，明天一键恢复工作状态。

一款面向重度浏览器用户的标签页管理扩展。当你的浏览器被几十上百个标签塞满、内存吃紧、找不到想看的那个页面时，它帮你把混乱变回秩序。

🌐 **官网**：<https://www.ouu365.com/>

---

## ✨ 特性

- **四种视图自由切换** —— 平铺 / 列表 / 图标 / 树形，按当前任务选最顺手的看法
- **智能排序与分组** —— 按域名、标题、访问时间等自动归组，一目了然
- **秒级搜索** —— 跨所有窗口即时检索标签，回车直达
- **稍后处理** —— 临时标记"待办"标签，处理完再清掉，不丢线索
- **自定义标记** —— 给重要标签打标记，状态感知（播放中 / 静音 / 未保存表单等一眼可见）
- **批量操作** —— 选中即批量关闭 / 合并 / 移动 / 备份
- **一键备份与恢复** —— 把当前所有标签导出备份，换电脑或第二天一键还原工作状态
- **跨窗口管理** —— 在一个侧边栏里看到并操作所有窗口的标签
- **隐私优先** —— 数据全部本地处理，不上传任何浏览记录

## 🎯 目标用户

- 每天开着几十上百个标签的研究者、产品经理、开发者、运营
- 经常"明天还要继续今天这摊事"的人
- 受够了浏览器原生标签栏挤成一堆的人

## 📦 安装

### 方式一：商店安装（推荐普通用户）

即将上架 Chrome Web Store 与 Edge Add-ons。上架前请访问 [官网](https://www.ouu365.com/) 获取最新安装包。

### 方式二：从源码加载（开发者 / 尝鲜）

1. 克隆本仓库
   ```bash
   git clone git@github.com:328060173/tab-master-plugin.git
   cd tab-master-plugin
   ```
2. 安装依赖并构建
   ```bash
   pnpm install
   pnpm build:all   # 产出 build/dev/ 与 build/prod/
   ```
3. 打开浏览器 → `chrome://extensions`（或 `edge://extensions`）→ 打开右上角「开发者模式」→「加载已解压的扩展程序」→ 选择：
   - 日常使用 → `build/prod/`
   - 调试体验 → `build/dev/`

> 要求：Chrome / Edge 88+，Mac 或 Windows。本扩展基于 Manifest V3。

## 🛠️ 开发

### 技术栈

- **框架**：[Plasmo](https://www.plasmo.com/) 0.90（浏览器扩展框架）
- **视图**：Vue 3 + TypeScript
- **样式**：Tailwind CSS
- **架构**：Chrome Manifest V3（Service Worker + Side Panel）

### 常用命令

```bash
pnpm install     # 安装依赖（包管理器用 pnpm，不要用 npm/yarn）
pnpm dev:safe    # 🌟 日常开发（保险版，先清理残留 dev 进程再起）
pnpm fresh       # 🧹 全新构建（清 .plasmo + build 再起，遇到怪问题无脑跑这个）
pnpm build:all   # 一次性产出 build/dev/ + build/prod/
pnpm package     # 打包成 Chrome Web Store 上架 zip
pnpm kill-dev    # 杀掉所有 plasmo dev 进程
```

加载开发版扩展：浏览器扩展页 → 加载已解压 → `build/chrome-mv3-dev/`。

### 构建卡住 / 报错恢复

> 😀 **嫌麻烦、不想思考？任何怪问题统一一招**：`pnpm fresh`（清 `.plasmo`+`build` 全新构建），等构建成功无 ERROR → 浏览器扩展页点 ↻ reload。
>
> 🔫 它靠 `pkill -f plasmo` **按进程名杀光所有 plasmo**——不管你在几个终端开过、build 过多少次，全部清零，**以这次重新构建为准**。终端无关，无脑跑。
> （手敲等价命令：`pkill -f plasmo; rm -rf .plasmo build && pnpm dev:safe` —— 注意 pkill 后是 `;` 不是 `&&`，否则没进程时会中断。）

> ⚠️ 想省那十几秒、做精细控制时，看下面分档版。任何清理前先 **Ctrl+C 停掉 dev**。平时不用删，直接 `pnpm dev:safe`。

按严重程度分档，**二选一，别同时敲**：

| 情况 | 命令 |
|---|---|
| 改了代码没生效 / 构建 hash 一直不变 | `rm -rf .plasmo/cache` → `pnpm dev:safe` |
| 构建报怪错（`manifest.json does not exist`、组件解析失败、`xxx.filter is not a function` 等莫名错误） | `rm -rf .plasmo build` → `pnpm dev:safe` |

> `.plasmo/cache` 是 `.plasmo` 的子目录，删整个 `.plasmo` 已包含它，做了第二档就不必再删 cache。
> 重清后第一次构建慢十几秒，**等"构建成功、无 ERROR"再 reload 扩展**（别在 `🔄 Building` 时就 reload）。

**怎么看是不是重复启动了多个 dev：**

```bash
pgrep -fl 'plasmo dev'   # 1 行=正常；≥2 行=有残留；无输出=没在跑
pkill -f plasmo          # 杀掉所有残留（不管几个）
```

一步到位的"干净重启"：

```bash
pkill -f plasmo && rm -rf .plasmo build && pnpm dev:safe
```

## 📁 目录约定

| 路径 | 角色 |
|---|---|
| `sidepanel.vue` | 侧边栏主界面（产品主入口） |
| `newtab.vue` | 新标签页 |
| `popup.vue` | 工具栏点击弹窗（已简化，主入口为侧边栏） |
| `background.ts` | Service Worker —— 追踪 tab 父子关系、设置 sidePanel 行为 |
| `components/` | UI 组件 |
| `composables/` | Vue 组合式逻辑（tab 数据、统计、树、悬浮卡） |
| `lib/` | 工具：排序、域名映射、时间格式化、平台检测、状态优先级、i18n |
| `types/` | 类型定义 |

## 🔐 权限与隐私

```json
"permissions":      ["tabs", "storage", "sidePanel"],
"host_permissions": ["https://*/*"]
```

- **tabs**：读取与操作标签页（核心功能）
- **storage**：本地保存设置与备份数据
- **sidePanel**：提供侧边栏界面
- **host_permissions**：用于域名识别与分组展示

严格遵循权限最小化原则；未使用 `<all_urls>` 或 `*://*/*`。**所有标签数据在本地处理，不上传到任何服务器。**

## 📚 文档

- 📖 详细开发流程 / 多终端规则 / 报错排查：[`docs/dev-workflow.md`](./docs/dev-workflow.md)
- 🗺️ 代码地图（改 A 要联动改 B/C）：[`docs/code-map.md`](./docs/code-map.md) —— 改 / 加功能前先查
- 📚 完整开发规范（权限 / API / 存储配额 / Vue 实战）：[`docs/reference/extension-vue-best-practices.md`](./docs/reference/extension-vue-best-practices.md)

## 🌐 链接

- **官网**：<https://www.ouu365.com/>
- **GitHub**：<https://github.com/328060173/tab-master-plugin>

## 📄 License

Private. © xpd
