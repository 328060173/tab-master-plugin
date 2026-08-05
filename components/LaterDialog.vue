<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center" @click.self="emit('close')">
      <div class="bg-white rounded-xl shadow-xl w-80 p-5">
        <h3 class="text-sm font-bold mb-2">{{ t('dialog.later.title') }}</h3>
        <!-- 提示语 -->
        <div class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
          <p class="text-xs text-amber-700 leading-relaxed">
            {{ t('dialog.later.tipPrefix') }}<strong>{{ t('dialog.later.tipStrong') }}</strong>{{ t('dialog.later.tipSuffix') }}
          </p>
        </div>
        <p class="text-xs text-gray-500 mb-2">{{ t('dialog.later.noteLabel') }}</p>
        <input
          v-model="note" type="text" ref="inputRef" maxlength="15"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :placeholder="t('dialog.later.notePlaceholder')"
          @keydown.enter="confirm" @keydown.esc="emit('close')"
        />
        <div class="flex gap-2 mt-4 justify-end">
          <button class="px-4 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50" @click="emit('close')">{{ t('common.cancel') }}</button>
          <button class="px-4 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="confirm">{{ t('dialog.later.confirm') }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue"
import { t } from "~lib/i18n"
const props = defineProps<{ open: boolean }>()
const emit = defineEmits(["close", "confirm"])
const note = ref("")
const inputRef = ref<HTMLInputElement>()
watch(() => props.open, async (v) => { if (v) { note.value = ""; await nextTick(); inputRef.value?.focus() } })
const confirm = () => { emit("confirm", note.value.trim()); note.value = "" }
</script>
