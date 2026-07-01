<template>
  <!-- 树形视图操作说明弹框：覆盖在 sidepanel 之上，需点击「我知道了」或遮罩关闭 -->
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4" @click.self="emit('close')">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-hidden flex flex-col">
        <!-- 头部 -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white">
          <div class="flex items-center gap-2">
            <GitFork :size="16" class="text-amber-600" />
            <h3 class="text-sm font-semibold text-gray-900">树形视图操作说明</h3>
          </div>
          <button class="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded" @click="emit('close')"><X :size="16" /></button>
        </div>

        <!-- 内容 -->
        <div class="px-4 py-3 overflow-y-auto text-xs text-gray-700 space-y-3">
          <p class="text-gray-500">树形视图按打开关系（父标签 → 子标签）展示。常见操作：</p>

          <ol class="space-y-2.5 pl-1">
            <li class="flex gap-2">
              <span class="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px] flex items-center justify-center mt-0.5">1</span>
              <div class="flex-1 leading-relaxed">
                <p class="font-medium text-gray-900 mb-0.5">点击标签 → 激活</p>
                <p class="text-gray-500">直接切换到对应浏览器标签页</p>
              </div>
            </li>
            <li class="flex gap-2">
              <span class="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px] flex items-center justify-center mt-0.5">2</span>
              <div class="flex-1 leading-relaxed">
                <p class="font-medium text-gray-900 mb-0.5">点击 <ChevronRight :size="11" class="inline -mt-0.5" /> 箭头 → 折叠/展开</p>
                <p class="text-gray-500">折叠后只看到父标签，节省空间</p>
              </div>
            </li>
            <li class="flex gap-2">
              <span class="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px] flex items-center justify-center mt-0.5">3</span>
              <div class="flex-1 leading-relaxed">
                <p class="font-medium text-gray-900 mb-0.5">拖拽节点 → 改变父子关系</p>
                <ul class="text-gray-500 mt-1 space-y-0.5 pl-2 border-l-2 border-amber-100">
                  <li>• 拖到目标 <strong>上方</strong>：放在前面（同级）</li>
                  <li>• 拖到目标 <strong>中间</strong>：成为它的子节点</li>
                  <li>• 拖到目标 <strong>下方</strong>：放在后面（同级）</li>
                </ul>
              </div>
            </li>
            <li class="flex gap-2">
              <span class="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px] flex items-center justify-center mt-0.5">4</span>
              <div class="flex-1 leading-relaxed">
                <p class="font-medium text-gray-900 mb-0.5">右侧 <X :size="11" class="inline -mt-0.5" /> → 关闭</p>
                <p class="text-gray-500">关闭分组节点会关闭整个分支；关闭中间节点后，子节点自动挂到上一级（不会丢失）</p>
              </div>
            </li>
            <li class="flex gap-2">
              <span class="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px] flex items-center justify-center mt-0.5">5</span>
              <div class="flex-1 leading-relaxed">
                <p class="font-medium text-gray-900 mb-0.5">悬停节点 → 出现操作菜单</p>
                <p class="text-gray-500">在节点上方稍作停留，会浮出刷新/复制/固定/标记/稍后等快捷操作</p>
              </div>
            </li>
          </ol>

          <div class="mt-2 pt-3 border-t border-gray-100 bg-gray-50 -mx-4 px-4 -mb-3 pb-3">
            <p class="text-[11px] text-gray-500 leading-relaxed">
              <strong class="text-gray-700">说明：</strong>父子关系由 Chrome 记录的 <code class="px-1 bg-gray-200 rounded text-[10px]">openerTabId</code> 推断（即"哪个标签打开了哪个"）。在树形视图下排序按钮会被禁用。
            </p>
            <p class="text-[11px] text-gray-500 leading-relaxed mt-1.5">
              <strong class="text-gray-700">层级限制：</strong>树形最多显示 <strong>5 层</strong>。超过 5 层的标签会自动放到第 5 层、与第 5 层的节点并排显示（按打开顺序依次追加），不会丢失也不会无限嵌套。
            </p>
          </div>
        </div>

        <!-- 底部 -->
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 bg-white">
          <button class="px-4 py-1.5 text-xs font-medium bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors" @click="emit('close')">
            我知道了
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { GitFork, X, ChevronRight } from "@lucide/vue"

defineProps<{ open: boolean }>()
const emit = defineEmits(["close"])
</script>
