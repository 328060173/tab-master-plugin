<template>
  <!--
    首次开启 5 条限制告知弹窗 - PRD §4.2 ASCII
    单根 + Teleport 收进主根内（多根 fallthrough 红线）。
    5 条逐条勾选"我已知晓"，全勾选才允许开启。
  -->
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4" @click.self="onCancel">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5">
        <h2 class="text-base font-semibold text-center mb-1">开启标签备份前请知悉</h2>
        <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300 text-center mb-4">
          以下 5 条是浏览器官方 API 限制，非产品缺陷。我们已为每条提供应对方式，请逐条确认：
        </p>
        <div class="space-y-2.5">
          <label
            v-for="(item, i) in items"
            :key="item.id"
            class="flex items-start gap-2 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
            :class="ack[i] ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''"
          >
            <input type="checkbox" v-model="ack[i]" class="mt-0.5 shrink-0" />
            <div class="flex-1 min-w-0 text-xs">
              <p class="font-medium text-gray-800 dark:text-gray-100">{{ i + 1 }}. {{ item.title }}</p>
              <p class="text-gray-600 dark:text-gray-300 mt-0.5">{{ item.desc }}</p>
              <p class="text-blue-600 dark:text-blue-400 mt-0.5">应对：{{ item.action }}</p>
            </div>
          </label>
        </div>
        <p class="text-[11px] text-gray-500 dark:text-gray-300 mt-3 text-center">
          事件触发策略（标签关闭/窗口关闭/空闲）可在设置页逐项调整。
        </p>
        <div class="flex gap-2 justify-end mt-4">
          <button class="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700" @click="onCancel">取消</button>
          <button
            :disabled="!allChecked"
            :class="[
              'px-3 py-1.5 text-xs rounded',
              allChecked
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
            ]"
            @click="onConfirm"
          >
            全部确认后开启
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 首次开启 5 条限制告知弹窗 - PRD §4.2 ASCII / §D
 * 5 条逐条勾选，全勾选才允许开启；勾选状态存 tabMasterBackupNoticeAck。
 */
import { ref, computed, watch } from "vue"

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: "confirm"): void
  (e: "cancel"): void
}>()

const items = [
  {
    id: "dir-permission",
    title: "重启后目录权限可能失效",
    desc: "File System Access API 安全模型要求，重启后写用户目录可能需重新点授权按钮。",
    action: "本地缓存始终可用；目录失效时 UI 会提示「重新授权」。",
  },
  {
    id: "tag-mismatch",
    title: "标记/分组重启后可能对不上",
    desc: "Chrome 无持久 tabId（setTabValue 不存在），fingerprint 兜底有失败率。",
    action: "恢复时未匹配项标红，由你手动指派。",
  },
  {
    id: "same-url-multi",
    title: "同 URL 多开无法 100% 区分",
    desc: "只能按窗口内顺序兜底匹配。",
    action: "恢复后人工核对；必要时手动指派。",
  },
  {
    id: "spa-mismatch",
    title: "SPA/登录跳转可能匹配偏差",
    desc: "URL/title 动态变化的页面 fingerprint 可能匹配失败。",
    action: "未匹配项标红可手动指派。",
  },
  {
    id: "multi-device-write",
    title: "云同步目录多设备同时写会产生多个文件",
    desc: "不会覆盖（不可变快照 + 时间戳文件名），但恢复时需手动选哪一个。",
    action: "恢复界面列多版本让你选。",
  },
]

const ack = ref<boolean[]>([false, false, false, false, false])

const allChecked = computed(() => ack.value.every((x) => x))

watch(
  () => props.open,
  (v) => {
    if (v) ack.value = [false, false, false, false, false]
  }
)

function onConfirm() {
  if (!allChecked.value) return
  emit("confirm")
}
function onCancel() {
  emit("cancel")
}
</script>
