import { ref, watch } from 'vue'
import type { TabMasterSettings } from '~types/settings'
import { DEFAULT_SETTINGS } from '~types/settings'

const STORAGE_KEY = 'tabMasterSettings'

// 内存中的设置状态
const settings = ref<TabMasterSettings>({ ...DEFAULT_SETTINGS })
const initialized = ref(false)

// 系统主题媒体查询
let darkModeMediaQuery: MediaQueryList | null = null
let systemThemeChangeListener: ((e: MediaQueryListEvent) => void) | null = null

// 存储监听器
function handleStorageChange(changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) {
  if (areaName === 'local' && changes[STORAGE_KEY]) {
    const newSettings = changes[STORAGE_KEY].newValue
    if (newSettings) {
      settings.value = { ...DEFAULT_SETTINGS, ...newSettings }
    }
  }
}

// 应用主题到DOM
function applyTheme(theme: 'light' | 'dark' | 'system') {
  const root = document.documentElement
  root.classList.remove('theme-light', 'theme-dark')

  let effectiveTheme: 'light' | 'dark'
  if (theme === 'system') {
    effectiveTheme = darkModeMediaQuery?.matches ? 'dark' : 'light'
  } else {
    effectiveTheme = theme
  }

  root.classList.add(`theme-${effectiveTheme}`)

  // 同时设置Tailwind的dark模式class（用于兼容性）
  root.classList.remove('dark')
  if (effectiveTheme === 'dark') {
    root.classList.add('dark')
  }
}

// 应用字体大小到DOM
// class 名规则：`fs-normal | fs-large | fs-xlarge`
// 对应 sidepanel.vue 全局 <style> 里的 :root.fs-* { font-size: ... } 规则
function applyFontSize(size: 'normal' | 'large' | 'xlarge') {
  const root = document.documentElement
  root.classList.remove('fs-normal', 'fs-large', 'fs-xlarge')
  root.classList.add(`fs-${size}`)
}

// 应用字体族到DOM
function applyFontFamily(family: 'system' | 'mono') {
  const root = document.documentElement
  root.classList.remove('font-system', 'font-mono')
  root.classList.add(`font-${family}`)
}

// 应用卡片密度到DOM
function applyCardDensity(density: 'compact' | 'normal' | 'loose') {
  const root = document.documentElement
  root.classList.remove('density-compact', 'density-normal', 'density-loose')
  root.classList.add(`density-${density}`)
}

// 保存设置到storage
async function saveSettings() {
  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: settings.value })
  } catch (e) {
    console.warn('Failed to save settings:', e)
  }
}

// 合并设置（处理缺失字段）+ 兼容旧字段重命名
// 历史迁移：
//   v1: fontSize 'compact|normal|loose' → 'normal|large|xlarge'
//   v1: language 字段被移除（用户要求删除界面语言菜单）
function mergeSettings(saved: Partial<TabMasterSettings> & Record<string, any>): TabMasterSettings {
  const next: any = { ...DEFAULT_SETTINGS, ...saved }
  // fontSize 旧值兼容映射
  const legacyFs: Record<string, 'normal' | 'large' | 'xlarge'> = {
    compact: 'normal',
    normal: 'normal',
    loose: 'large',
  }
  if (typeof next.fontSize === 'string' && legacyFs[next.fontSize]) {
    next.fontSize = legacyFs[next.fontSize]
  } else if (!['normal', 'large', 'xlarge'].includes(next.fontSize)) {
    next.fontSize = DEFAULT_SETTINGS.fontSize
  }
  // 删掉 language 等被移除的字段（如果存在）
  delete next.language
  return next as TabMasterSettings
}

// 迁移旧用户数据
async function migrateOldUser() {
  try {
    const oldViewMode = localStorage.getItem('viewMode')
    if (oldViewMode) {
      const result = await chrome.storage.local.get(STORAGE_KEY)
      if (!result[STORAGE_KEY]) {
        // 没有新设置，迁移旧数据
        settings.value.defaultView = oldViewMode as any
        await saveSettings()
      }
      // 清理旧数据
      localStorage.removeItem('viewMode')
    }
  } catch (e) {
    console.warn('Migration failed:', e)
  }
}

// 导出的hook
export function useSettings() {
  // 初始化
  const init = async () => {
    if (initialized.value) return

    // 设置媒体查询
    darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // 从storage加载设置
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY)
      if (result[STORAGE_KEY]) {
        settings.value = mergeSettings(result[STORAGE_KEY])
      }
    } catch (e) {
      console.warn('Failed to load settings:', e)
    }

    // 迁移旧用户
    await migrateOldUser()

    // 应用当前设置
    applyTheme(settings.value.theme)
    applyFontSize(settings.value.fontSize)
    applyFontFamily(settings.value.fontFamily)
    applyCardDensity(settings.value.cardDensity)

    // 监听系统主题变化
    systemThemeChangeListener = () => {
      if (settings.value.theme === 'system') {
        applyTheme('system')
      }
    }
    darkModeMediaQuery.addEventListener('change', systemThemeChangeListener)

    // 监听storage变化
    chrome.storage.onChanged.addListener(handleStorageChange)

    // 监听设置变化并应用
    watch(() => settings.value.theme, applyTheme)
    watch(() => settings.value.fontSize, applyFontSize)
    watch(() => settings.value.fontFamily, applyFontFamily)
    watch(() => settings.value.cardDensity, applyCardDensity)

    // 设置变化时自动保存
    watch(settings, saveSettings, { deep: true })

    initialized.value = true
  }

  // 更新单个设置
  const updateSetting = <K extends keyof TabMasterSettings>(key: K, value: TabMasterSettings[K]) => {
    settings.value[key] = value
  }

  // 批量更新设置
  const updateSettings = (partial: Partial<TabMasterSettings>) => {
    settings.value = { ...settings.value, ...partial }
  }

  // 重置为默认设置
  const resetSettings = () => {
    settings.value = { ...DEFAULT_SETTINGS }
  }

  // 模块级首次调用时立即初始化（有 initialized 守卫，重复调用安全）
  init()

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
  }
}

// 导出只读的settings（用于不使用hook的地方）
export function getSettingsSnapshot() {
  return { ...settings.value }
}
