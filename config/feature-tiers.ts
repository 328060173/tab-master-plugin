// 功能使用级别
export type FeatureLevel = "anonymous" | "authenticated" | "vip"

/**
 * 功能定义（i18n 化，2026-08-05 i18n-en-support §6.1）。
 *
 * 改造方式：原 `name`/`description` 中文硬编码 → 改为 `nameKey`/`descKey` i18n key 字符串，
 * 消费侧通过 t(nameKey)/t(descKey) 翻译为当前 locale 文案。
 *
 * 理由：
 * - 数据表是静态数组，模块加载时确定，无法在定义时调用 t()（locale 可能尚未 init）。
 * - 后续后端 GET /feature-tiers 增量更新若返回原始字符串，调用方需自行判断是 key 还是字符串；
 *   当前前端无 UI 渲染此表（仅 useFeatureTiers 内部使用，未在组件中渲染 name/description），
 *   改造对运行时零影响。
 */
export interface Feature {
  id: string                // 功能ID，永久不变
  nameKey: string           // 功能名称 i18n key
  descKey: string           // 功能描述 i18n key
  path: string              // 功能路径（UI入口，内部描述，不翻译）
  level: FeatureLevel       // 使用级别
}

// 功能分级表（前端内置，权威清单）
// 启动时可选请求后端 GET /feature-tiers 获取增量更新（后端待开发），失败用此表兜底
// VIP功能当前仅预留扩展，不拦截、不展示
export const FEATURE_TIERS: Feature[] = [
  // === 未登录可用（anonymous）22个 ===
  { id: "F001", nameKey: "feature.F001.name", descKey: "feature.F001.desc", path: "首页->列表视图", level: "anonymous" },
  { id: "F002", nameKey: "feature.F002.name", descKey: "feature.F002.desc", path: "首页->平铺视图", level: "anonymous" },
  { id: "F003", nameKey: "feature.F003.name", descKey: "feature.F003.desc", path: "首页->图标视图", level: "anonymous" },
  { id: "F004", nameKey: "feature.F004.name", descKey: "feature.F004.desc", path: "首页->树形视图", level: "anonymous" },
  { id: "F005", nameKey: "feature.F005.name", descKey: "feature.F005.desc", path: "首页->搜索框", level: "anonymous" },
  { id: "F006", nameKey: "feature.F006.name", descKey: "feature.F006.desc", path: "首页->筛选下拉", level: "anonymous" },
  { id: "F007", nameKey: "feature.F007.name", descKey: "feature.F007.desc", path: "首页->排序下拉", level: "anonymous" },
  { id: "F008", nameKey: "feature.F008.name", descKey: "feature.F008.desc", path: "首页->批量选择", level: "anonymous" },
  { id: "F009", nameKey: "feature.F009.name", descKey: "feature.F009.desc", path: "右键->稍后 / 批量->稍后", level: "anonymous" },
  { id: "F010", nameKey: "feature.F010.name", descKey: "feature.F010.desc", path: "导航->稍后", level: "anonymous" },
  { id: "F011", nameKey: "feature.F011.name", descKey: "feature.F011.desc", path: "导航->分组 / 右键->新建分组", level: "anonymous" },
  { id: "F012", nameKey: "feature.F012.name", descKey: "feature.F012.desc", path: "右键->聚焦模式", level: "anonymous" },
  { id: "F013", nameKey: "feature.F013.name", descKey: "feature.F013.desc", path: "导航->历史", level: "anonymous" },
  { id: "F014", nameKey: "feature.F014.name", descKey: "feature.F014.desc", path: "TagBar / 右键->添加标记", level: "anonymous" },
  { id: "F015", nameKey: "feature.F015.name", descKey: "feature.F015.desc", path: "整理->检测长期未用", level: "anonymous" },
  { id: "F016", nameKey: "feature.F016.name", descKey: "feature.F016.desc", path: "设置->界面主题", level: "anonymous" },
  { id: "F017", nameKey: "feature.F017.name", descKey: "feature.F017.desc", path: "设置->字体设置", level: "anonymous" },
  { id: "F018", nameKey: "feature.F018.name", descKey: "feature.F018.desc", path: "设置->存储空间", level: "anonymous" },
  { id: "F019", nameKey: "feature.F019.name", descKey: "feature.F019.desc", path: "设置->运行日志", level: "anonymous" },
  { id: "F101", nameKey: "feature.F101.name", descKey: "feature.F101.desc", path: "导航->历史->完整历史", level: "anonymous" },
  { id: "F205", nameKey: "feature.F205.name", descKey: "feature.F205.desc", path: "首页->多窗口切换", level: "anonymous" },
  { id: "F206", nameKey: "feature.F206.name", descKey: "feature.F206.desc", path: "设置->数据导出", level: "anonymous" },

  // === 登录才能用（authenticated）4个 ===
  { id: "F102", nameKey: "feature.F102.name", descKey: "feature.F102.desc", path: "设置->意见与需求反馈", level: "authenticated" },
  { id: "F103", nameKey: "feature.F103.name", descKey: "feature.F103.desc", path: "设置->云同步->标记同步", level: "authenticated" },
  { id: "F104", nameKey: "feature.F104.name", descKey: "feature.F104.desc", path: "设置->云同步->稍后同步", level: "authenticated" },
  { id: "F105", nameKey: "feature.F105.name", descKey: "feature.F105.desc", path: "设置->云同步->设置同步", level: "authenticated" },

  // === VIP才能用（vip）5个（当前无VIP，仅预留扩展，不拦截不展示）===
  { id: "F201", nameKey: "feature.F201.name", descKey: "feature.F201.desc", path: "整理->快照", level: "vip" },
  { id: "F202", nameKey: "feature.F202.name", descKey: "feature.F202.desc", path: "导航->快照", level: "vip" },
  { id: "F203", nameKey: "feature.F203.name", descKey: "feature.F203.desc", path: "分组->智能建议", level: "vip" },
  { id: "F204", nameKey: "feature.F204.name", descKey: "feature.F204.desc", path: "设置->自动清理", level: "vip" },
  { id: "F207", nameKey: "feature.F207.name", descKey: "feature.F207.desc", path: "设置->联系我们->优先通道", level: "vip" },
]

// 按 level 索引（方便快速查）
export const FEATURES_BY_LEVEL: Record<FeatureLevel, Feature[]> = {
  anonymous: FEATURE_TIERS.filter(f => f.level === "anonymous"),
  authenticated: FEATURE_TIERS.filter(f => f.level === "authenticated"),
  vip: FEATURE_TIERS.filter(f => f.level === "vip"),
}

// 按功能ID快速查级别
export function getFeatureLevel(id: string): FeatureLevel | undefined {
  return FEATURE_TIERS.find(f => f.id === id)?.level
}

// 按功能ID快速查功能
export function getFeature(id: string): Feature | undefined {
  return FEATURE_TIERS.find(f => f.id === id)
}
