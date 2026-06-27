/**
 * v-click-outside：点击元素外部时触发回调
 * 用法：<div v-click-outside="() => open = false" />
 *
 * 设计取舍：
 * - 全局只挂一个 document click，靠 contains() 路由，避免每个用法独立挂监听
 * - 选 click 而非 mousedown：避免按下时打断用户的拖选/双击操作
 * - 用 WeakMap 而非 element 上挂 _o 私有属性，类型干净不污染 DOM
 */
import type { Directive } from "vue"

type Handler = () => void
const handlerMap = new WeakMap<HTMLElement, (e: MouseEvent) => void>()

export const vClickOutside: Directive<HTMLElement, Handler> = {
  mounted(el, binding) {
    const fn = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    handlerMap.set(el, fn)
    document.addEventListener("click", fn)
  },
  unmounted(el) {
    const fn = handlerMap.get(el)
    if (fn) {
      document.removeEventListener("click", fn)
      handlerMap.delete(el)
    }
  }
}
