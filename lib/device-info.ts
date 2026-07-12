/**
 * 设备信息收集（通用）
 *
 * 收集浏览器/系统/设备信息，拼成 JSON 字符串，供后端接口的 accessDeviceInfo 字段使用。
 * 调用方：login-by-email-code / check-version / feedback 等需要设备信息的接口。
 *
 * 后端字段（OuuCheckVersionCreateRequest / LoginEmailRequest 等）：
 * - accessDeviceInfo: String（JSON 字符串）
 * - accessLoc: String（位置信息，浏览器无法获取，留 "-"）
 * - deviceNumber: String（设备编号，浏览器无法获取，留空）
 *
 * 收集到的字段（能取的取，取不到留空，不报错）：
 * - deviceType: desktop / mobile
 * - browser: Chrome / Edge / Firefox / Safari
 * - browserVersion: 浏览器版本
 * - os: Windows / macOS / Linux
 * - platform: navigator.platform
 * - language: navigator.language
 * - userAgent: navigator.userAgent
 * - imei: 浏览器无法获取（隐私），留空
 * - deviceNumber: 浏览器无法获取，留空
 *
 * 缓存：设备信息在一次会话内不变，模块级缓存避免重复收集
 */

let cachedDeviceInfo: string | null = null

/**
 * 收集设备信息，返回 JSON 字符串
 * 首次调用收集并缓存，后续直接返回缓存（设备信息会话内不变）
 */
export function collectDeviceInfo(): string {
  if (cachedDeviceInfo) return cachedDeviceInfo

  try {
    const ua = navigator.userAgent
    // 解析浏览器类型/版本
    let browser = 'unknown'
    let browserVersion = ''
    if (/Edg\/([\d.]+)/.test(ua)) { browser = 'Edge'; browserVersion = RegExp.$1 }
    else if (/Chrome\/([\d.]+)/.test(ua)) { browser = 'Chrome'; browserVersion = RegExp.$1 }
    else if (/Firefox\/([\d.]+)/.test(ua)) { browser = 'Firefox'; browserVersion = RegExp.$1 }
    else if (/Safari\/([\d.]+)/.test(ua)) { browser = 'Safari'; browserVersion = RegExp.$1 }
    // 系统
    let os = 'unknown'
    if (/Windows/.test(ua)) os = 'Windows'
    else if (/Macintosh|Mac OS X/.test(ua)) os = 'macOS'
    else if (/Linux/.test(ua)) os = 'Linux'
    // 设备类型
    const deviceType = /Mobile|Android|iPhone/.test(ua) ? 'mobile' : 'desktop'

    const info = {
      deviceType,
      browser,
      browserVersion,
      os,
      platform: navigator.platform || '',
      language: navigator.language || '',
      userAgent: ua,
      // imei/设备编号：浏览器无法获取（隐私限制），留空
      imei: '',
      deviceNumber: ''
    }
    cachedDeviceInfo = JSON.stringify(info)
    return cachedDeviceInfo
  } catch (e) {
    console.warn('[device-info] 收集设备信息失败', e)
    cachedDeviceInfo = JSON.stringify({ deviceType: 'unknown' })
    return cachedDeviceInfo
  }
}

/**
 * 位置信息（浏览器无法获取精确位置，留 "-"，后端按需处理）
 */
export const ACCESS_LOC = '-'

/**
 * 设备编号（浏览器无法获取，留空）
 */
export const DEVICE_NUMBER = ''
