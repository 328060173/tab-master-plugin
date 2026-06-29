# 开发流程手册

> 给自己看的操作 SOP。下次忘了直接翻这份。

## 一、命令速查

| 命令 | 干嘛的 | 何时用 |
|---|---|---|
| `pnpm dev:safe` | **保险版 dev**：先杀残留再起 dev | 🌟 日常开发首选 |
| `pnpm dev` | 裸跑 dev（不清残留） | 确定没残留时也行 |
| `pnpm kill-dev` | 杀掉所有 plasmo dev 进程 | 切到 build 前 / 状态不明时 |
| `pnpm build:all` | 一次性打包 dev/ + prod/ | 提测前、上架前、性能验证 |
| `pnpm clean` | 删除整个 `build/` 目录 | 排查诡异缓存问题 |
| `pnpm package` | 打 Chrome Web Store 上架 zip | 正式上架 |

## 二、产物目录对照

| 目录 | 何时产生 | 是否含 HMR | 用途 |
|---|---|---|---|
| `build/chrome-mv3-dev/` | 跑 `pnpm dev` 期间 | ✅ 有 | 日常开发加载这个 |
| `build/dev/` | `pnpm build:all` 产物之一 | ✅ 有（但 dev server 不在跑） | 分发给团队调试（一般用不到） |
| `build/prod/` | `pnpm build:all` 产物之一 | ❌ 无 | 提测、上架、性能验证 |

## 三、常用场景剧本

### 场景 1：早上开始干活

```bash
cd /Users/yuyany/web_space/tab-master-plugin
pnpm dev:safe
```

浏览器：`chrome://extensions` → 加载已解压 → 选 `build/chrome-mv3-dev/`

之后写代码自动刷新，**终端不要关**。

### 场景 2：电脑昨天没关，今天接着干

```bash
pnpm dev:safe   # 自动杀掉昨天残留的 dev（如果有）再起新的
```

### 场景 3：要测生产构建（提测/上架前）

```bash
# 1. 先停 dev
#   - 在跑 dev 的终端按 Ctrl+C
#   - 或在任意终端跑：
pnpm kill-dev

# 2. 打包
pnpm build:all

# 3. 浏览器卸载旧扩展，加载 build/prod/

# 4. 测完想继续开发：
pnpm dev:safe
```

### 场景 4：奇怪报错（WebSocket / 缓存错乱 / 模块找不到）

```bash
pnpm kill-dev
pnpm clean
rm -rf .plasmo/cache
pnpm dev:safe
```

### 场景 5：要跑 git / npm install / 别的命令

dev 终端继续挂着，开新终端跑 git 类命令 ✅ 安全。

如果是 `pnpm install` 装新包 → 装完回 dev 终端 Ctrl+C 重启一次 dev，避免缓存对不上。

## 四、多终端铁律 ⚠️

**同一项目，全局只能有一个 plasmo 进程在跑。**

| 操作 | 是否允许 |
|---|---|
| 终端 A 跑 dev，终端 B 跑 git / ls / cat | ✅ |
| 终端 A 跑 dev，终端 B 再跑 `pnpm dev` | ❌ 端口冲突，撞车 |
| 终端 A 跑 dev，终端 B 跑 `pnpm build:all` | ❌ build/ 目录互撕 |
| 终端 A 跑 dev，终端 B 跑 `pnpm kill-dev` | ⚠️ 会一起把 A 杀掉 |

**为什么？** 因为 dev server 是「项目级」的——不同终端只是不同窗口，看到的是**同一个项目目录、同一个 `build/`、同一个 `.plasmo/cache/`**，两个 plasmo 进程会抢这些资源。

## 五、状态自检

```bash
# 看现在有没有 plasmo 进程
ps aux | grep plasmo | grep -v grep
```

- 输出为空 → 可以放心起 dev 或 build
- 输出有内容 → 已经有 dev 在跑了，要么去用它，要么 `pnpm kill-dev` 清掉

## 六、概念速通

### `pnpm dev` vs `pnpm build:all`

| | `pnpm dev` | `pnpm build:all` |
|---|---|---|
| 底层 | `plasmo dev` | `plasmo build` + 内嵌一次 20s `plasmo dev` |
| 目的 | 实时开发 | 一次性打包 |
| 是否退出 | ❌ 常驻 | ✅ 跑完就退 |
| 含 HMR 客户端 | ✅ | dev/ 有；prod/ 没有 |
| 代码压缩 | ❌ | prod 压缩 |
| 输出位置 | `build/chrome-mv3-dev/` | `build/dev/` + `build/prod/` |

### HMR 客户端是啥？

**HMR = Hot Module Replacement（热模块替换）**

- `pnpm dev` 起来时会顺带启一个 WebSocket server（监听 `localhost:53000`）
- dev 产物里注入一段 JS 叫"HMR 客户端"，会连这个 WebSocket
- 文件改动 → server 推消息 → 客户端让扩展自动加载新代码（不用手动刷新）

**报错信号**：浏览器控制台看到 `WebSocket connection to 'ws://localhost:53000/' failed` → 说明加载的产物含 HMR 客户端，但 dev server 没在跑。两种处理：

1. 你本来就想开发 → `pnpm dev:safe` 起 server
2. 你想测生产 → 卸载当前扩展，重新加载 `build/prod/`

## 七、一句话决策

> **dev 起一次挂着用，要测生产先停 dev，开新终端别再跑 pnpm 改东西，出问题先 kill-dev。**
