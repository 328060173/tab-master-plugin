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
 * 关闭传播原理：
 * - Trigger 按钮 @click.stop → 点击不冒泡，document 监听不触发；toggle 内部自己切 activeId
 * - Popover 内容 @click.stop → 点内部不冒泡，不会误关
 * - 点击空白/任何非 popover 区域 → 冒泡到 document → closeAll
 * - Esc 键 → closeAll
 *
 * 安装：在应用顶层 setup 调用 installGlobalPopoverClose() 一次（已在 sidepanel.vue 调用）
 */
import { ref, readonly } from "vue"

// 模块级单例 state ——所有组件共享
const activeId = ref<string | null>(null)
// 触发按钮的 rect，popover 用它配合 lib/popoverPosition 计算 fixed 位置
const activeAnchorRect = ref<DOMRect | null>(null)

export const usePopoverManager = () => ({
  activeId: readonly(activeId),
  activeAnchorRect: readonly(activeAnchorRect),
  isOpen: (id: string) => activeId.value === id,
  open: (id: string, anchorEl?: HTMLElement | null) => {
    activeId.value = id
    // 防御：只有真的是 Element 才调 getBoundingClientRect，避免脏数据/Ref 对象传进来 throw 整个 click handler
    activeAnchorRect.value = anchorEl && typeof (anchorEl as any).getBoundingClientRect === "function"
      ? (anchorEl as HTMLElement).getBoundingClientRect()
      : null
  },
  /**
   * 用任意 rect 打开（右键菜单触发的 picker 没有 DOM 触发元素，用 clientX/Y 合成 0x0 rect）
   */
  openAtRect: (id: string, rect: DOMRect) => {
    activeId.value = id
    activeAnchorRect.value = rect
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
  },
  closeAll: () => {
    activeId.value = null
    activeAnchorRect.value = null
  },
  toggle: (id: string, anchorEl?: HTMLElement | null) => {
    if (activeId.value === id) {
      activeId.value = null
      activeAnchorRect.value = null
    } else {
      activeId.value = id
      activeAnchorRect.value = anchorEl && typeof (anchorEl as any).getBoundingClientRect === "function"
        ? (anchorEl as HTMLElement).getBoundingClientRect()
        : null
    }
  },
})

/**
 * 全局关闭监听 —— 在应用顶层 setup 调用一次。
 *
 * - document click：popover trigger 和 content 都用 @click.stop，所以这里只会被
 *   "空白/非 popover 元素的点击"触发，正是想要的关闭时机
 * - keydown Escape：通用的"放弃当前操作"键位
 */
let installed = false
export const installGlobalPopoverClose = () => {
  if (installed) return
  installed = true
  document.addEventListener("click", () => {
    activeId.value = null
    activeAnchorRect.value = null
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      activeId.value = null
      activeAnchorRect.value = null
    }
  })
}
