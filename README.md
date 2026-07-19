# Tab Master · TM-浏览器标签整理大师

一款面向重度浏览器用户的标签页管理扩展，提供平铺/列表/图标/树形四种视图、智能排序与分组、稍后处理、自定义标记、批量操作、状态感知（播放中/静音/未保存表单等）。

- 目标平台：Chrome 88+ / Edge 88+（Mac + Windows）
- 技术栈：Plasmo 0.90 · Vue 3 · TypeScript · Tailwind CSS · Chrome MV3
- 作者：xpd

## 开发

```bash
pnpm install
pnpm dev:safe   # 🌟 日常开发（保险版，会先清理残留进程）
pnpm fresh      # 🧹 全新构建（清 .plasmo+build 再起，遇到任何怪问题无脑跑这个）
pnpm build:all  # 一次性产出 build/dev/ + build/prod/
pnpm kill-dev   # 杀掉所有 plasmo dev 进程
pnpm package    # 打包成 Chrome Web Store 上架 zip
```

加载扩展：浏览器 → 扩展程序 → 加载已解压：

- 日常开发 → `build/chrome-mv3-dev/`
- 验证生产构建 → `build/prod/`

## 构建卡住 / 报错恢复

> 😀 **嫌麻烦、不想思考？任何怪问题统一一招**：`pnpm fresh`（清 `.plasmo`+`build` 全新构建），等构建成功无 ERROR → 浏览器扩展页点 ↻ reload。
>
> 🔫 它靠 `pkill -f plasmo` **按进程名杀光所有 plasmo**——不管你用 Trae 还是 VSCode、在几个终端开过、build 过多少次，全部清零，**以这次重新构建为准**。终端无关，无脑跑。
> （手敲等价命令：`pkill -f plasmo; rm -rf .plasmo build && pnpm dev:safe` —— 注意 pkill 后是 `;` 不是 `&&`，否则没进程时会中断。）

> ⚠️ 想省那十几秒、做精细控制时，看下面分档版。任何清理前先 **Ctrl+C 停掉 dev**。平时不用删，直接 `pnpm dev:safe`。

按严重程度三档，**二选一，别同时敲**：

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

> 📖 **详细开发流程、多终端规则、报错排查**：见 [`docs/dev-workflow.md`](./docs/dev-workflow.md)
> 🗺️ **代码地图（改 A 要联动改 B/C）**：见 [`docs/code-map.md`](./docs/code-map.md) — 改 / 加功能前先查
> 📚 **完整开发规范**（权限/API/存储配额/Vue 实战）：见 [`docs/reference/extension-vue-best-practices.md`](./docs/reference/extension-vue-best-practices.md)

## 目录约定

| 路径 | 角色 |
|---|---|
| `sidepanel.vue` | 侧边栏主界面 |
| `newtab.vue` | 新标签页 |
| `popup.vue` | 浏览器工具栏点击弹窗（已简化，主入口为侧边栏） |
| `background.ts` | Service Worker — 追踪 tab 父子关系、设置 sidePanel 行为 |
| `components/` | UI 组件 |
| `composables/` | Vue 组合式逻辑（tab 数据、统计、树、悬浮卡） |
| `lib/` | 工具：排序、域名映射、时间格式化、平台检测、状态优先级 |
| `types/` | 类型定义 |

## 权限

```json
"permissions":      ["tabs", "storage", "sidePanel"],
"host_permissions": ["https://*/*"]
```
严格遵循权限最小化原则；未使用 `<all_urls>` 或 `*://*/*`。

## License

Private. © xpd
