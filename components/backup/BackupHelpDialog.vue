<template>
  <!--
    备份说明大弹窗（占满屏遮罩 + 居中卡片）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    用户可见处禁技术黑话（不出现 JSON / token 等词）。
    Props: open: boolean
    Emits: cancel
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[140] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-[720px] max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="backup-help-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题栏 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-3 shrink-0 border-b border-gray-100 dark:border-gray-700">
          <h2 id="backup-help-title" class="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <HelpCircle :size="18" class="text-blue-600 dark:text-blue-400" />
            标签备份说明
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="关闭"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 内容区 -->
        <div class="px-5 py-4 flex-1 overflow-y-auto space-y-4 text-xs text-gray-600 dark:text-gray-300">
          <!-- 什么是备份 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">什么是备份</h3>
            <p>把当前浏览器打开的所有标签保存成一份记录。以后标签丢了、关了、浏览器崩了，都能从备份里找回来。</p>
          </section>

          <!-- 为什么要备份 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">为什么要备份</h3>
            <p>浏览器闪退、手滑关掉整个窗口、重启电脑标签被清空——这些随时会发生。有备份就能一键找回整套标签，不用一个个翻历史记录。</p>
          </section>

          <!-- 手动备份 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">手动备份</h3>
            <p>随时点一下，把当前标签存一份。适合"现在状态很重要，先存一份"。</p>
            <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">去哪用：备份管理 → 备份概览 → 手动备份</p>
          </section>

          <!-- 自动备份 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">自动备份</h3>
            <p>开启后插件按设定间隔自动备份，崩溃也能找回，不用你手动操作。默认只在定时触发，可在设置里勾选"标签关闭时""窗口关闭时""电脑空闲时"额外备份。</p>
            <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">去哪用：备份管理 → 备份概览 → 自动备份</p>
          </section>

          <!-- 导入 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">导入</h3>
            <p>从外部文件把标签导入回来，直接打开这些标签。支持本插件导出的数据，也兼容 OneTab。</p>
            <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">去哪用：备份管理 → 导入管理</p>
          </section>

          <!-- 导出 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">导出</h3>
            <p>把当前标签或某次备份导出成数据文件，存到电脑或转移给别的设备。</p>
            <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">去哪用：备份管理 → 备份概览 → 导出</p>
          </section>

          <!-- 备份和导入导出的区别 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">备份和导入导出的区别</h3>
            <p>备份（手动/自动）是把<b>当前打开的标签</b>存一份到本插件，不用你手动操作文件，崩溃找回用这个。导入导出是和<b>外部数据文件</b>打交道：导出把标签存成文件放到电脑里，导入把文件里的标签打开回来。想长期保留或换设备转移，用导入导出；想随时找回当前标签，用备份。</p>
          </section>

          <!-- 常见问题 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">常见问题</h3>
            <div class="space-y-2.5">
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">Q：备份存在哪？会丢吗？</p>
                <p class="mt-0.5">A：备份存在本浏览器的本地存储里，不上传云端。⚠️ 注意：如果插件被卸载或删除，本地存储会一起被清空，备份也会丢失。想长期保留数据，请用「导出」把备份存成数据文件保存到电脑，需要时再「导入」恢复。云同步将在后续版本上线。</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">Q：备份会占很多空间吗？</p>
                <p class="mt-0.5">A：默认保留近 {{ BACKUP_RULES.maxSnapshots }} 条自动备份、{{ BACKUP_RULES.retentionDays }} 天，超出自动清理；手动备份最多 {{ BACKUP_RULES.manualMaxSnapshots }} 条，永不自动删除。</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">Q：手动备份和自动备份的区别？</p>
                <p class="mt-0.5">A：手动备份是你主动存的，最多 {{ BACKUP_RULES.manualMaxSnapshots }} 条，永不自动删；自动备份是插件按频率自己存的，受保留条数（{{ BACKUP_RULES.maxSnapshots }} 条）和天数（{{ BACKUP_RULES.retentionDays }} 天）限制，超出自动清理最早的。</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">Q：导入的标签会进入备份列表吗？</p>
                <p class="mt-0.5">A：不会。导入只是把文件里的标签打开，不写入备份列表。备份列表只记录手动备份和自动备份。</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">Q：备份里"备份了 X 个"是什么意思？</p>
                <p class="mt-0.5">A：X 是这次实际备份的标签数量。比如"备份了 12 个"表示这次备份了 12 个标签。</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">Q：删除的备份能找回吗？</p>
                <p class="mt-0.5">A：删除后 30 秒内可点撤销恢复，超时无法找回。</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">Q：备份/导入能找回标记吗？</p>
                <p class="mt-0.5">A：能找回标记名和稍后处理项。标记会关联到你实际恢复的标签（按网址匹配），若标记名已存在则跳过。由于浏览器 API 限制，同一网址每次打开标签 ID 不同，靠网址匹配而非标签 ID。</p>
              </div>
            </div>
          </section>
        </div>

        <!-- 底部按钮 -->
        <div class="px-5 py-3 shrink-0 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            class="inline-flex items-center justify-center min-h-[36px] px-5 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onCancel"
          >知道了</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 备份说明大弹窗：纯静态说明内容，无业务逻辑。
 * 守红线：
 * - 单根（Teleport + 单 div）
 * - 用户可见处无技术黑话
 * - 无 fallthrough（emits 声明 cancel）
 */
import { X, HelpCircle } from '@lucide/vue'
import { BACKUP_RULES } from '~lib/backup/backupRules'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

function onCancel() {
  emit('cancel')
}
</script>
