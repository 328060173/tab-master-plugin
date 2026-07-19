import { ref } from "vue"
import { isDev } from "~lib/env"

/**
 * 全局 toast（轻提示）单例。
 *
 * sidepanel / options 各自页面是独立 JS 上下文，模块级 ref 互不串扰。
 * 替代原先 sidepanel.vue / options.vue 各自重复的 toastMsg + showToast 定义。
 *
 * 显示 2000ms 后自动消失；连续调用会重置计时器（后一条覆盖前一条）。
 */
const toastMsg = ref("")
let toastTimer: ReturnType<typeof setTimeout> | null = null

export function showToast(msg: string) {
  if (isDev) console.debug("[tab-master] showToast", { msg })
  toastMsg.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMsg.value = ""
  }, 2000)
}

export function useToast() {
  return { toastMsg, showToast }
}
