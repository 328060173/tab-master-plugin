# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Development server with hot reload (builds to build/chrome-mv3-dev/)
pnpm build      # Production build
pnpm package    # Package for Chrome Web Store distribution
```

No test or lint scripts are configured. Prettier (with `@ianvs/prettier-plugin-sort-imports`) handles formatting — config in `.prettierrc.mjs`.

## Architecture

This is a Chrome MV3 browser extension built with [Plasmo](https://docs.plasmo.com) (v0.90.5) and Vue 3 + TypeScript.

Plasmo maps file locations to extension roles automatically:

| File/Dir | Extension role |
|---|---|
| `popup.vue` | Browser action popup |
| `contents/` | Content scripts injected into pages |
| `background.ts` (if added) | Service worker |

**Content scripts** use Plasmo's naming convention:
- `contents/*.vue` with export `config` defining `matches` determines injection targets
- `plasmo-inline` / `plasmo-overlay` config types control how Vue components mount into pages

The extension has `host_permissions: ["https://*/*"]`, so content scripts can run on any HTTPS page.

Vue components use `<script setup lang="ts">` SFC style. The popup entry (`popup.vue`) uses `defineOptions({ prepare(app) {} })` for plugin registration — use this hook to install Vue plugins globally.

## Developer Profile & Principles

**沟通语言：** 中文（所有回复、注释、文档均使用中文）

**Owner:** 10年+全栈经验，近6年专注浏览器插件开发，主导过5款日活10万+的Chrome插件，累计服务用户超500万。

**技术决策第一原则：**
1. 用户价值优先
2. 长期可维护性优先
3. 拒绝过度设计，拒绝为短期便利牺牲代码质量

**技术偏好：**
- TypeScript 严格模式，完整类型定义，禁止滥用 `any`
- Vue 3 Composition API + Pinia 状态管理
- Plasmo 框架为主，熟悉 WXT
- 精通全部 Chrome API（tabs、storage、sidePanel、contextMenus 等）
- 跨浏览器兼容（Chrome/Edge/Firefox/Safari）

**代码质量要求：**
- 权限最小化原则
- CSP 策略、XSS/CSRF 防护，敏感数据加密存储
- ESLint + Prettier 规范

## Project Goal

**浏览器标签大师** — 帮助用户高效管理浏览器标签页。


## 协作协议（务必遵守）
- **多 agent 分工**：实质需求 → `product-manager` 出 PRD（docs/prd/）→ `extension-frontend` 实现 → main 协调+审查。详见 [[feedback-multiagent-and-no-regression]]
- **不跑 build/dev**：用户自己跑 `pnpm dev:safe`（产物 `build/chrome-mv3-dev/`）。main 跑 build 会抢 Parcel 缓存 → "改了没生效"。详见 [[feedback-no-build-user-runs-dev]]
- **审查 .vue 必查**：① 模板复合语句 `@click="fn; x()"` ② 模板内 TS 语法 `as X` / `!` 非空断言 / 泛型 ③ HTML 转义（grep `&lt;`）+ 多个 `<script setup>` 块 ④ 是否波及既有功能。⚠️ **`vue-tsc` 检不出模板内 TS 断言**——必须用 Plasmo 同款 `@vue/compiler-sfc@3.3.4` 跑 `compileTemplate` 复核（见 [[lesson-vue-mustache-no-components]]）
- **新功能不碰老功能；重构/统一既有代码需先经用户批准**
- **不自动 git commit/push**，等明确指令

## 官方文档（改 manifest / 调 chrome.* 前必查）
- 本地权威副本：`docs/googledocs/`（76 个 Chrome 扩展 API 的 `.md` + `INDEX.md` 索引，每文件头带官方 URL）。重抓脚本：`docs/googledocs/fetch-chrome-docs.sh`
- 流程：先 grep/读 `docs/googledocs/<api>.md` 核实方法签名 / 权限名 / 最低版本，**不凭印象**。详见 [[lesson-verify-api-before-coding]]、[[reference-chrome-api-docs]]

## 历史与参考
- 逐日完成记录 + 项目结构快照 → `docs/dev-log.md`
- 功能 PRD → `docs/prd/<feature>.md`；开发规范手册（11 章）→ `docs/reference/extension-vue-best-practices.md`；dev 命令 / 报错排查 → `docs/dev-workflow.md`
- 历史修复细节 → `git log`（不在此复述）

## 近期已完成（摘要，细节看 docs/dev-log.md + git log）
- 聚焦模式（`chrome.tabGroups` 折叠）/ 分组 / 设置面板 / 清理菜单 / 域名 eTLD+1 分组归并
- 浮层统一 PopoverManager / 批量功能（4 视图全支持）/ 标记体系重设计（TagBar）
- 历史页：最近关闭（50 条，零权限）+ **完整浏览历史 P1 已落地**（`chrome.history` 走 `optional_permissions`，引导式运行时授权）

## 待办
- **4 格矩阵实测**（Chrome+Edge × macOS+Windows）这几天积累的全部改动
- **暗色模式精修**：少数品牌色类（`bg-red-50` / `bg-amber-50` / `text-purple-600`）深色对比度不足，碰到一处改一处，不批量改组件
- **i18n 扩展**：`lib/locales` 仅覆盖部分文案，很多组件仍硬编码中文（优先级低）
- 功能性（等用户拍板优先级）：客服消息提醒 / 智能标签冬眠（30min suspend+白名单）/ 快照（需后端）/ AI 总结归类 / 树形视图精修
- 后端相关（登录 / 云同步）→ 等后端就绪解锁，见 [[project-defer-backend-features]]
- ⚠️ build hash 卡死信号：遇"改了像旧代码"先 `rm -rf .plasmo/cache` 重启 dev

### 关键技术决策
- 侧边栏位置由 Chrome 浏览器层控制，**扩展程序无法触发左右切换** — 2026-06-28 重新核实
  - 完整 `chrome.sidePanel` 命名空间（Chrome 145）方法：`getOptions / setOptions / getPanelBehavior / setPanelBehavior / open / close / getLayout / onOpened / onClosed`
  - **只有 `getLayout()` 是读位置（Chrome 140+），没有任何 setter 写位置**
  - 官方原文："在 Chrome 的设置中，用户可以指定面板应显示在哪个侧边" — 位置是用户偏好不是扩展可控属性
  - 我们的策略：HeaderMenu「显示位置」保持 disabled 灰显，tooltip 引导用户去 Chrome 原生右键菜单切换
- 拖动侧边栏宽度由 Chrome 原生支持，无需代码
- 不使用 Pinia（composables 已够用）
- 不使用 shadcn/Radix，纯 Tailwind + v-click-outside 实现下拉菜单
- `lucide-vue-next` 已弃用，改用 `@lucide/vue`
- 标签切换历史用 `chrome.storage.session`（关闭浏览器自动清除，无需手动管理）
- 自定义标记存 `chrome.storage.local`（持久化，扩展重装会丢失）
- **聚焦模式用 `chrome.tabGroups` 折叠**（非 `tabs.hide` 实验 API）—— 2026-06-27 决策
- **设置统一存 `chrome.storage.local` key `tabMasterSettings`** —— 2026-06-27 决策
- **暗色模式用 Tailwind `darkMode: 'class'` + `<html class="theme-dark">`** —— 2026-06-27 决策

### Manifest 权限
`tabs` + `tabGroups` + `storage` + `sidePanel` + `host_permissions: ["https://*/*"]`
可选权限（运行时按需申请）：`optional_permissions: ["history"]`（完整浏览历史，用户授权后启用）

### 红线（永远不要做）
- 改 manifest permissions / 调 chrome.* 前必查 `docs/googledocs/<api>.md`（官方副本）核实——`tabHide` 不存在、`chrome.tabs.hide` 是实验 API
- 禁用 `(chrome.x as any)` 强转
- 禁用 v-html（XSS）
- 不自动 git commit/push（等用户明确指令）

### 参考原型
交互原型在 `/Users/yuyany/web_space/tab-master-demo`（React + shadcn/ui），已迁移核心功能到本项目。

