/// <reference types="vite/client" />

// 声明 import.meta.env 类型，让 lib/env.ts 能直接读 import.meta.env.DEV
// 无需 (import.meta as any).env 强转（Plasmo 构建期静态替换 import.meta.env.DEV）。
interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  readonly PLASMO_PUBLIC_API_BASE?: string
  readonly PLASMO_PUBLIC_SITE_BASE?: string
  readonly PLASMO_PUBLIC_MENU_SITE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
