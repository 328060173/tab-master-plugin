/**
 * 静态资源模块类型声明（供 import url from '~assets/...' 用）
 *
 * Plasmo/Parcel 在构建时会把这些 import 解析成打包后的 URL 字符串；
 * 这里只给 TS 补类型，避免 IDE / tsc 报 TS2307。
 * 运行时值为 string（资源的 URL）。
 */
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.webp' {
  const src: string
  export default src
}
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.jpeg' {
  const src: string
  export default src
}
declare module '*.gif' {
  const src: string
  export default src
}
declare module '*.svg' {
  const src: string
  export default src
}
declare module '*.css' {
  const src: string
  export default src
}
