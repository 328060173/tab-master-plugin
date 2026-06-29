# Tab Master · 浏览器标签大师

一款面向重度浏览器用户的标签页管理扩展，提供平铺/列表/图标/树形四种视图、智能排序与分组、稍后处理、自定义标记、批量操作、状态感知（播放中/静音/未保存表单等）。

- 目标平台：Chrome 88+ / Edge 88+（Mac + Windows）
- 技术栈：Plasmo 0.90 · Vue 3 · TypeScript · Tailwind CSS · Chrome MV3
- 作者：xpd

## 开发

```bash
pnpm install
pnpm dev:safe   # 🌟 日常开发（保险版，会先清理残留进程）
pnpm build:all  # 一次性产出 build/dev/ + build/prod/
pnpm kill-dev   # 杀掉所有 plasmo dev 进程
pnpm package    # 打包成 Chrome Web Store 上架 zip
```

加载扩展：浏览器 → 扩展程序 → 加载已解压：

- 日常开发 → `build/chrome-mv3-dev/`
- 验证生产构建 → `build/prod/`

> 📖 **详细开发流程、多终端规则、报错排查**：见 [`docs/dev-workflow.md`](./docs/dev-workflow.md)
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
