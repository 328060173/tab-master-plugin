<template>
  <!-- 树形视图操作说明弹框：覆盖在 sidepanel 之上，需点击「我知道了」或遮罩关闭 -->
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4" @click.self="emit('close')">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-hidden flex flex-col">
        <!-- 头部 -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white">
          <div class="flex items-center gap-2">
            <GitFork :size="16" class="text-amber-600" />
            <h3 class="text-sm font-semibold text-gray-900">{{ t('guide.tree.title') }}</h3>
          </div>
          <button class="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded" @click="emit('close')"><X :size="16" /></button>
        </div>

        <!-- 内容 -->
        <div class="px-4 py-3 overflow-y-auto text-xs text-gray-700 space-y-3">
          <p class="text-gray-500">{{ t('guide.tree.intro') }}</p>

          <ol class="space-y-2.5 pl-1">
            <li class="flex gap-2">
              <span class="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px] flex items-center justify-center mt-0.5">1</span>
              <div class="flex-1 leading-relaxed">
                <p class="font-medium text-gray-900 mb-0.5">{{ t('guide.tree.step1.title') }}</p>
                <p class="text-gray-500">{{ t('guide.tree.step1.desc') }}</p>
              </div>
            </li>
            <li class="flex gap-2">
              <span class="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px] flex items-center justify-center mt-0.5">2</span>
              <div class="flex-1 leading-relaxed">
                <p class="font-medium text-gray-900 mb-0.5">{{ t('guide.tree.step2.titlePre') }} <ChevronRight :size="11" class="inline -mt-0.5" /> {{ t('guide.tree.step2.titlePost') }}</p>
                <p class="text-gray-500">{{ t('guide.tree.step2.desc') }}</p>
              </div>
            </li>
            <li class="flex gap-2">
              <span class="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px] flex items-center justify-center mt-0.5">3</span>
              <div class="flex-1 leading-relaxed">
                <p class="font-medium text-gray-900 mb-0.5">{{ t('guide.tree.step3.title') }}</p>
                <ul class="text-gray-500 mt-1 space-y-0.5 pl-2 border-l-2 border-amber-100">
                  <li>• {{ t('guide.tree.step3.opt1.pre') }} <strong>{{ t('guide.tree.step3.opt1.pos') }}</strong>{{ t('guide.tree.step3.opt1.post') }}</li>
                  <li>• {{ t('guide.tree.step3.opt2.pre') }} <strong>{{ t('guide.tree.step3.opt2.pos') }}</strong>{{ t('guide.tree.step3.opt2.post') }}</li>
                  <li>• {{ t('guide.tree.step3.opt3.pre') }} <strong>{{ t('guide.tree.step3.opt3.pos') }}</strong>{{ t('guide.tree.step3.opt3.post') }}</li>
                </ul>
              </div>
            </li>
            <li class="flex gap-2">
              <span class="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px] flex items-center justify-center mt-0.5">4</span>
              <div class="flex-1 leading-relaxed">
                <p class="font-medium text-gray-900 mb-0.5">{{ t('guide.tree.step4.titlePre') }} <X :size="11" class="inline -mt-0.5" /> {{ t('guide.tree.step4.titlePost') }}</p>
                <p class="text-gray-500">{{ t('guide.tree.step4.desc') }}</p>
              </div>
            </li>
            <li class="flex gap-2">
              <span class="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px] flex items-center justify-center mt-0.5">5</span>
              <div class="flex-1 leading-relaxed">
                <p class="font-medium text-gray-900 mb-0.5">{{ t('guide.tree.step5.title') }}</p>
                <p class="text-gray-500">{{ t('guide.tree.step5.desc') }}</p>
              </div>
            </li>
          </ol>

          <div class="mt-2 pt-3 border-t border-gray-100 bg-gray-50 -mx-4 px-4 -mb-3 pb-3">
            <p class="text-[11px] text-gray-500 leading-relaxed">
              <strong class="text-gray-700">{{ t('guide.tree.note.label') }}</strong>{{ t('guide.tree.note.bodyPre') }} <code class="px-1 bg-gray-200 rounded text-[10px]">{{ t('guide.tree.note.bodyCode') }}</code> {{ t('guide.tree.note.bodyPost') }}
            </p>
            <p class="text-[11px] text-gray-500 leading-relaxed mt-1.5">
              <strong class="text-gray-700">{{ t('guide.tree.limit.label') }}</strong>{{ t('guide.tree.limit.bodyPre') }} <strong>{{ t('guide.tree.limit.bodyStrong') }}</strong>{{ t('guide.tree.limit.bodyPost') }}
            </p>
          </div>
        </div>

        <!-- 底部 -->
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 bg-white">
          <button class="px-4 py-1.5 text-xs font-medium bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors" @click="emit('close')">
            {{ t('guide.tree.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { GitFork, X, ChevronRight } from "@lucide/vue"
import { t } from "~lib/i18n"

defineProps<{ open: boolean }>()
const emit = defineEmits(["close"])
</script>
