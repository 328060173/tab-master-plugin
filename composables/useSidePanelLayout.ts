import { ref, onMounted, onUnmounted } from "vue"

/**
 * 侧边栏位置感知（chrome.sidePanel.getLayout，Chrome 140+）。
 *
 * 能力边界（已核实官方文档 docs/googledocs/sidePanel.md）：
 * - getLayout() 只能【读】面板在 "left" 还是 "right"，**没有 setter 不能改位置**
 * - 位置是用户在 Chrome 设置里定的；扩展只能感知 + 引导用户手动切
 *
 * 用途：HeaderMenu「显示位置」据此显示「当前：左/右侧」+ 给出对应的切换引导。
 * 兼容：getLayout 是 Chrome 140+ 的新 API，@types/chrome 0.0.258 尚未收录，
 *       这里用模块增强补类型（不破坏严格模式、不用 as any）；老版本 supported=false 静默降级。
 */

declare global {
  namespace chrome {
    namespace sidePanel {
      type Side = "left" | "right"
      interface PanelLayout {
        side: Side
      }
      function getLayout(): Promise<PanelLayout>
    }
  }
}

export type SidePanelSide = "left" | "right" | "unknown"

export const SUPPORTS_GET_LAYOUT =
  typeof chrome !== "undefined" &&
  !!chrome.sidePanel &&
  typeof chrome.sidePanel.getLayout === "function"

export function useSidePanelLayout() {
  const side = ref<SidePanelSide>("unknown")
  const supported = ref(SUPPORTS_GET_LAYOUT)

  const detectLayout = async () => {
    if (!SUPPORTS_GET_LAYOUT) {
      side.value = "unknown"
      return
    }
    try {
      const layout = await chrome.sidePanel.getLayout()
      side.value = layout?.side === "left" || layout?.side === "right" ? layout.side : "unknown"
    } catch {
      // 极少数情况下调用失败 → 退回 unknown，不报错、不影响其它功能
      side.value = "unknown"
    }
  }

  // 用户可能在 Chrome 设置里随时切换左右；面板重新可见时重新探测，保证显示最新
  const onVisible = () => {
    if (document.visibilityState === "visible") detectLayout()
  }

  onMounted(() => {
    detectLayout()
    document.addEventListener("visibilitychange", onVisible)
  })
  onUnmounted(() => {
    document.removeEventListener("visibilitychange", onVisible)
  })

  return { side, supported, detectLayout }
}
