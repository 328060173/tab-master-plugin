/**
 * 道具商城相关类型（PRD docs/coordination/2026-07-17-prop-shop.md §2 API 契约）
 *
 * 字段名严格对齐后端 PropListVO / PropDetailVO / ExchangeResultVO，
 * 前后端联调靠字段名一致，勿擅自改名。
 */

/** 道具类型：1=头像框 2=背景图（后端 PropTypeEnum） */
export type PropType = 1 | 2

/** 免费标记：1=免费 2=收费（后端 free_flag） */
export type PropFreeFlag = 1 | 2

/** GET /prop/list 列表项（不含 propResourceUrl，省带宽） */
export interface PropListVO {
  id: number
  propType: PropType
  propName: string
  /** 缩略图下小提示 */
  propTip: string
  propDiscription: string
  /** 缩略图 URL（列表只用这个，不取原图） */
  propThumbnailUrl: string
  freeFlag: PropFreeFlag
  /** 兑换所需积分（freeFlag=1 时为 0） */
  points: number
  propSort: number
  /** 是否已购：未登录=false；已登录=ouu_customer_prop 存在该 prop_id 记录 */
  purchased: boolean
}

/** GET /prop/{id} 详情 = PropListVO 全字段 + 原图 */
export interface PropDetailVO extends PropListVO {
  /** 原图 URL（预览/使用时才取，省带宽） */
  propResourceUrl: string
  /** 原图资源类型（后端预留字段，前端目前不分支处理） */
  propResourceType: number
}

/** POST /prop/exchange 响应 data */
export interface ExchangeResultVO {
  propId: number
  afterPoints: number
}

/**
 * GET /prop/list 若依分页响应（2026-07-18 改造，后端 /prop/list 改 TableDataInfo 形状）
 *
 * 字段对齐后端 com.ruoyi.common.core.page.TableDataInfo：
 * - code/msg：标准状态码与提示
 * - rows：当前页数据列表
 * - total：总记录数（用于分页栏计算总页数）
 *
 * query 参数（请求侧，不在响应里）：pageNum / pageSize / propType(1头像框 2背景图，可空)
 */
export interface PropPageResult {
  code: number
  msg: string
  rows: PropListVO[]
  total: number
}
