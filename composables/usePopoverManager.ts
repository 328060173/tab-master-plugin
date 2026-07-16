/**
 * 全局浮层管理器（PopoverManager）—— 单例排他控制。
 *
 * 设计目标：
 * - 全局任何时刻最多 1 个 popover 打开（视图/排序/清理/设置/标记筛选/...）
 * - 打开新 popover 自动关闭旧的（互斥），不再出现"多个层同时打开"
 * - 点击空白处自动关闭、Esc 键关闭
 *
 * 使用范式：
 *   const popover = usePopoverManager()
 *   // trigger 按钮：
 *   <button ref="btn" @click.stop="popover.toggle('toolbar-view', btn)">视图</button>
 *   // popover 内容（建议 Teleport 到 body）：
 *   <Teleport to="body">
 *     <div v-if="popover.isOpen('toolbar-view')" @click.stop class="fixed z-[60] ...">...</div>
 *   </Teleport>
 *
 * 关闭传播原理（捕获阶段，2026-07-16 修复“点空白不关闭”）：
 * - 全局 document click 监听挂在**捕获阶段**，事件到达任何目标前先收到，绝不漏接
 * - 点当前触发按钮（activeAnchorEl）→ 豁免，交给 trigger 自身 @click.toggle
 * - 点 popover 内容（标了 data-popover-content）→ 豁免，保留“点内容不关”语义
 * - 点击空白/任何非 popover 区域 → closeAll
 * - Esc 键 → closeAll
 * ⚠️ 新增 popover 内容（Teleport 浮层本体）务必加 `data-popover-content` 属性，否则点其内部会被误关
 *
 * 安装：在应用顶层 setup 调用 installGlobalPopoverClose() 一次（已在 sidepanel.vue 调用）
 */
import { ref, readonly } from "vue"

// 模块级单例 state ——所有组件共享
const activeId = ref<string | null>(null)
// 触发按钮的 rect，popover 用它配合 lib/popoverPosition 计算 fixed 位置
const activeAnchorRect = ref<DOMRect | null>(null)
// 触发按钮的 DOM 元素本身（open/toggle 时传入）——仅用于全局 click 捕获阶段判断
// “点击是否落在当前触发按钮上”，避免点 trigger 时被误关（toggle 自身处理开/关）。
// openAtRect（右键菜单/编号浮层）没有触发元素，保持 null。
let activeAnchorEl: HTMLElement | null = null

export const usePopoverManager = () => ({
  activeId: readonly(activeId),
  activeAnchorRect: readonly(activeAnchorRect),
  isOpen: (id: string) => activeId.value === id,
  open: (id: string, anchorEl?: HTMLElement | null) => {
    activeId.value = id
    // 防御：只有真的是 Element 才调 getBoundingClientRect，避免脏数据/Ref 对象传进来 throw 整个 click handler
    const valid = anchorEl && typeof (anchorEl as any).getBoundingClientRect === "function"
    activeAnchorRect.value = valid ? (anchorEl as HTMLElement).getBoundingClientRect() : null
    activeAnchorEl = valid ? (anchorEl as HTMLElement) : null
  },
  /**
   * 用任意 rect 打开（右键菜单触发的 picker 没有 DOM 触发元素，用 clientX/Y 合成 0x0 rect）
   */
  openAtRect: (id: string, rect: DOMRect) => {
    activeId.value = id
    activeAnchorRect.value = rect
    // 右键/合成 rect 打开：无触发元素，全局 click 捕获靠 data-popover-content 标记的内容自身豁免
    activeAnchorEl = null
  },
  /**
   * 关闭 popover。
   * - 不传 id：无条件关闭当前活动的
   * - 传 id：只在当前活动的恰好是这个 id 时才关闭（避免误关别人的）
   */
  close: (id?: string) => {
    if (id && activeId.value !== id) return
    activeId.value = null
    activeAnchorRect.value = null
    activeAnchorEl = null
  },
  closeAll: () => {
    activeId.value = null
    activeAnchorRect.value = null
    activeAnchorEl = null
  },
  toggle: (id: string, anchorEl?: HTMLElement | null) => {
    if (activeId.value === id) {
      activeId.value = null
      activeAnchorRect.value = null
      activeAnchorEl = null
    } else {
      activeId.value = id
      const valid = anchorEl && typeof (anchorEl as any).getBoundingClientRect === "function"
      activeAnchorRect.value = valid ? (anchorEl as HTMLElement).getBoundingClientRect() : null
      activeAnchorEl = valid ? (anchorEl as HTMLElement) : null
    }
  },
})

/**
 * 全局关闭监听 —— 在应用顶层 setup 调用一次。
 *
 * 为什么用捕获阶段（capture=true）而非冒泡：
 * 早期冒泡版依赖“trigger/content 用 @click.stop 阻断冒泡，空白点击冒泡到 document 触发关闭”。
 * 但实际线上出现“点空白处菜单不关闭”——某些场景下空白点击的冒泡链路被中间元素截断，
 * document 冒泡监听收不到。改成捕获阶段后，document 在事件到达任何目标之前先收到，
 * 绝不漏接。
 *
 * 捕获阶段误关的防护（点 trigger / 点 popover 内容不关）：
 * 1. 点当前触发按钮（activeAnchorEl）→ contains(target) 命中 → 豁免，交给 trigger 自身 @click.toggle
 * 2. 点 popover 内容（带 data-popover-content 标记的元素）→ closest() 命中 → 豁免，
 *    保留“点菜单内容不关”的原有语义（批量标记浮层多点、编号输入框等不能被误关）
 * 3. 其余点击（真正空白）→ closeAll
 *
 * - keydown Escape：通用的“放弃当前操作”键位
 */
let installed = false
export const installGlobalPopoverClose = () => {
  if (installed) return
  installed = true
  document.addEventListener("click", (e: MouseEvent) => {
    // 没有打开的 popover，无需处理（也避免无谓 closeAll）
    if (activeId.value === null) return
    const target = e.target
    // 点 popover 内容（菜单/浮层本体）→ 豁免：交给内容自身 @click.stop / 各项 @click 处理
    if (target instanceof Element && target.closest("[data-popover-content]")) return
    // 点当前触发按钮 → 豁免：交给 trigger 自身 @click.stop + toggle 处理（否则 open→close 会被捕获先关再被 toggle 误开）
    if (activeAnchorEl && target instanceof Node && activeAnchorEl.contains(target)) return
    // 真正的空白点击 → 关闭
    activeId.value = null
    activeAnchorRect.value = null
    activeAnchorEl = null
  }, true)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      activeId.value = null
      activeAnchorRect.value = null
      activeAnchorEl = null
    }
  })
}
