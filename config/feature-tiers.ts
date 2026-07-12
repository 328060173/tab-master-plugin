// 功能使用级别
export type FeatureLevel = "anonymous" | "authenticated" | "vip"

// 功能定义
export interface Feature {
  id: string              // 功能ID，永久不变
  name: string            // 功能名称
  description: string     // 功能描述
  path: string            // 功能路径（UI入口）
  level: FeatureLevel     // 使用级别
}

// 功能分级表（前端内置，权威清单）
// 启动时可选请求后端 GET /feature-tiers 获取增量更新（后端待开发），失败用此表兜底
// VIP功能当前仅预留扩展，不拦截、不展示
export const FEATURE_TIERS: Feature[] = [
  // === 未登录可用（anonymous）22个 ===
  { id: "F001", name: "标签列表视图", description: "以列表形式展示标签", path: "首页->列表视图", level: "anonymous" },
  { id: "F002", name: "标签平铺视图", description: "以卡片平铺形式展示标签", path: "首页->平铺视图", level: "anonymous" },
  { id: "F003", name: "标签图标视图", description: "以图标网格形式展示标签", path: "首页->图标视图", level: "anonymous" },
  { id: "F004", name: "标签树形视图", description: "以树形层级展示标签", path: "首页->树形视图", level: "anonymous" },
  { id: "F005", name: "标签搜索", description: "按标题/URL搜索标签", path: "首页->搜索框", level: "anonymous" },
  { id: "F006", name: "标签筛选", description: "按标记筛选标签", path: "首页->筛选下拉", level: "anonymous" },
  { id: "F007", name: "标签排序", description: "按域名/时间排序标签", path: "首页->排序下拉", level: "anonymous" },
  { id: "F008", name: "批量操作", description: "批量关闭/稍后/分组", path: "首页->批量选择", level: "anonymous" },
  { id: "F009", name: "稍后处理", description: "把标签加入稍后列表", path: "右键->稍后 / 批量->稍后", level: "anonymous" },
  { id: "F010", name: "稍后列表管理", description: "查看/打开/移除稍后标签", path: "导航->稍后", level: "anonymous" },
  { id: "F011", name: "标签分组", description: "使用chrome.tabGroups分组", path: "导航->分组 / 右键->新建分组", level: "anonymous" },
  { id: "F012", name: "聚焦模式", description: "折叠其他标签，聚焦当前", path: "右键->聚焦模式", level: "anonymous" },
  { id: "F013", name: "最近关闭标签", description: "查看最近关闭50条标签", path: "导航->历史", level: "anonymous" },
  { id: "F014", name: "标记系统", description: "自定义标记并关联标签", path: "TagBar / 右键->添加标记", level: "anonymous" },
  { id: "F015", name: "清理检测", description: "检测长期未用标签", path: "整理->检测长期未用", level: "anonymous" },
  { id: "F016", name: "界面主题切换", description: "浅色/深色/跟随系统", path: "设置->界面主题", level: "anonymous" },
  { id: "F017", name: "字号/密度设置", description: "调整字体大小和卡片密度", path: "设置->字体设置", level: "anonymous" },
  { id: "F018", name: "存储空间查看", description: "查看本地存储占用", path: "设置->存储空间", level: "anonymous" },
  { id: "F019", name: "运行日志", description: "查看插件运行日志", path: "设置->运行日志", level: "anonymous" },
  { id: "F101", name: "完整浏览历史", description: "查看完整历史（需history权限）", path: "导航->历史->完整历史", level: "anonymous" },
  { id: "F205", name: "多窗口管理", description: "同时管理多个窗口标签", path: "首页->多窗口切换", level: "anonymous" },
  { id: "F206", name: "导出功能", description: "导出标签/快照/历史数据", path: "设置->数据导出", level: "anonymous" },

  // === 登录才能用（authenticated）4个 ===
  { id: "F102", name: "意见反馈", description: "提交反馈给作者", path: "设置->意见与需求反馈", level: "authenticated" },
  { id: "F103", name: "标记云同步", description: "跨设备同步自定义标记", path: "设置->云同步->标记同步", level: "authenticated" },
  { id: "F104", name: "稍后列表云同步", description: "跨设备同步稍后列表", path: "设置->云同步->稍后同步", level: "authenticated" },
  { id: "F105", name: "设置云同步", description: "跨设备同步偏好设置", path: "设置->云同步->设置同步", level: "authenticated" },

  // === VIP才能用（vip）5个（当前无VIP，仅预留扩展，不拦截不展示）===
  { id: "F201", name: "标签快照", description: "保存当前窗口标签快照", path: "整理->快照", level: "vip" },
  { id: "F202", name: "快照历史", description: "查看和恢复历史快照", path: "导航->快照", level: "vip" },
  { id: "F203", name: "智能分组建议", description: "AI建议分组方案", path: "分组->智能建议", level: "vip" },
  { id: "F204", name: "自动清理规则", description: "配置自动清理长期未用标签", path: "设置->自动清理", level: "vip" },
  { id: "F207", name: "优先客服支持", description: "优先处理问题反馈", path: "设置->联系我们->优先通道", level: "vip" },
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
