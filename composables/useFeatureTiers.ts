import { FEATURE_TIERS, getFeatureLevel, getFeature } from "~config/feature-tiers"
import type { FeatureLevel, Feature } from "~config/feature-tiers"

// 单例缓存（模块级，参照 useTabManager）
let _instance: ReturnType<typeof useFeatureTiersImpl> | null = null

function useFeatureTiersImpl() {
  // 当前功能分级表（前端内置，后续可扩展为后端增量更新）
  const featureTiers = FEATURE_TIERS

  // 检查功能是否需要登录
  function isAuthenticatedFeature(id: string): boolean {
    return getFeatureLevel(id) === "authenticated"
  }

  // 检查功能是否需要VIP
  function isVipFeature(id: string): boolean {
    return getFeatureLevel(id) === "vip"
  }

  // 检查是否可以使用某功能
  // 当前无VIP系统，vip功能永远返回false；但当前无VIP功能入口，不影响
  function canUse(id: string, isLoggedIn = false, isVip = false): boolean {
    const level = getFeatureLevel(id)
    if (!level) return true // 未知功能默认允许
    switch (level) {
      case "anonymous":
        return true
      case "authenticated":
        return isLoggedIn
      case "vip":
        return isVip
      default:
        return true
    }
  }

  // 获取功能信息
  function getFeatureInfo(id: string): Feature | undefined {
    return getFeature(id)
  }

  // 获取某级别所有功能
  function getFeaturesByLevel(level: FeatureLevel): Feature[] {
    return featureTiers.filter(f => f.level === level)
  }

  // TODO：后续扩展启动时请求后端 GET /feature-tiers 增量更新
  // async function fetchFeatureTiersFromRemote(): Promise<void> { ... }

  return {
    featureTiers,
    isAuthenticatedFeature,
    isVipFeature,
    canUse,
    getFeatureInfo,
    getFeaturesByLevel,
  }
}

// 单例入口：所有 useFeatureTiers() 调用共享同一实例
export function useFeatureTiers() {
  if (_instance) return _instance
  _instance = useFeatureTiersImpl()
  return _instance
}
