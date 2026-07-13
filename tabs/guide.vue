<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <!-- 顶部条 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
      <div class="max-w-3xl mx-auto flex items-center gap-3">
        <BookOpen :size="18" class="text-blue-600 dark:text-blue-400" />
        <h1 class="text-base font-semibold">标签大师 · 操作指南</h1>
      </div>
    </header>

    <main class="max-w-3xl mx-auto p-6 space-y-6">
      <!-- 功能介绍 -->
      <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
        <h2 class="text-sm font-semibold mb-3 flex items-center gap-2">
          <Palette :size="14" class="text-blue-500" />
          功能概览
        </h2>
        <div class="text-xs text-gray-600 dark:text-gray-300 space-y-2 leading-relaxed">
          <p>标签大师是一款轻量级的浏览器标签管理扩展，帮助你：</p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>快速浏览和搜索当前窗口的所有标签</li>
            <li>使用自定义标签对标签进行分类标记</li>
            <li>聚焦模式：只显示你关注的标签，隐藏其他干扰</li>
            <li>分组管理：使用浏览器原生标签分组功能</li>
            <li>历史记录：查看并恢复最近关闭的标签</li>
          </ul>
        </div>
      </section>

      <!-- 快捷键 -->
      <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
        <h2 class="text-sm font-semibold mb-3 flex items-center gap-2">
          <Type :size="14" class="text-blue-500" />
          快捷键
        </h2>
        <div class="text-xs text-gray-600 dark:text-gray-300 space-y-2">
          <p>给标签设置编号后，可以通过快捷键快速切换：</p>
          <div class="grid gap-2 mt-2">
            <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
              <span class="text-gray-500 dark:text-gray-400">Mac</span>
              <span class="font-mono text-gray-700 dark:text-gray-200">Option + Shift + [1-4]</span>
            </div>
            <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
              <span class="text-gray-500 dark:text-gray-400">Windows</span>
              <span class="font-mono text-gray-700 dark:text-gray-200">Alt + Shift + [1-4]</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 常见问题 -->
      <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
        <h2 class="text-sm font-semibold mb-3 flex items-center gap-2">
          <MessageSquare :size="14" class="text-blue-500" />
          常见问题
        </h2>
        <div class="text-xs text-gray-600 dark:text-gray-300 space-y-3">
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-200 mb-1">Q: 标签标记会保存吗？</p>
            <p>A: 标记会保存在本地，但由于浏览器每次打开标签会分配新的 ID，重启浏览器后标记会丢失。后续会优化为基于 URL 关联。</p>
          </div>
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-200 mb-1">Q: 如何切换侧边栏位置？</p>
            <p>A: 右键点击侧边栏顶部标题区域，选择「显示在左侧」或「显示在右侧」。</p>
          </div>
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-200 mb-1">Q: 聚焦模式有什么用？</p>
            <p>A: 聚焦模式可以隐藏你暂时不需要关注的标签，只显示你选择的标签，减少视觉干扰。</p>
          </div>
        </div>
      </section>

      <!-- 联系我们 -->
      <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
        <h2 class="text-sm font-semibold mb-3 flex items-center gap-2">
          <Users :size="14" class="text-blue-500" />
          联系我们
        </h2>
        <div class="text-xs text-gray-600 dark:text-gray-300 space-y-2">
          <p>有问题或建议？欢迎通过以下方式联系：</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <button class="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-xs" @click="onContact">
              访问官网
            </button>
            <button class="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-xs" @click="onDonate">
              请作者喝杯咖啡
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * 操作指南独立页（Plasmo tabs 页，URL: tabs/guide.html）。
 * 入口：sidepanel HeaderMenu「操作说明」→ chrome.tabs.create(runtime.getURL("tabs/guide.html"))
 */
import { BookOpen, Palette, Type, MessageSquare, Users } from "@lucide/vue"
import { OFFICIAL_SITE_URL } from "~lib/api-config"

const onContact = () => {
  try {
    chrome.tabs.create({ url: `${OFFICIAL_SITE_URL}/feedback` })
  } catch (e) {
    console.warn("open contact page failed", e)
  }
}
const onDonate = () => {
  try {
    chrome.tabs.create({ url: `${OFFICIAL_SITE_URL}/feedback` })
  } catch (e) {
    console.warn("open donate page failed", e)
  }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
:root.fs-normal  { font-size: 16px; }
:root.fs-large   { font-size: 17.5px; }
:root.fs-xlarge  { font-size: 19px; }
</style>
