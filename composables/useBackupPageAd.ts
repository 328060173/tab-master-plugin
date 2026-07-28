/**
 * 备份独立页广告 composable（单例，多槽位版本 2026-07-28）
 *
 * 与 sidepanel 的 useAd 区别（独立页常驻展示位，不消费）：
 * - 不读 adCache storage / 不写 adState storage
 * - 无频率上限 / 无展示即消费 / 无 hideAd
 * - 进页 onMounted 调一次 fetchAd；刷新页面 = 重新挂载 = 自动触发
 * - 报错/超时静默：adMap 清空显占位，不 toast、不影响业务
 *
 * 多槽位架构（2026-07-28 重构）：
 * - 原先 4 个广告位共用一份 adData（POST /ad/list 单条）→ 4 位显同一张图
 * - 现改为 POST /ad/listbypositions 一次取 4 个 position 的广告 → 各位显不同图
 * - adMap: { [position]: AdItem | null }，组件按 position 取 (getAd)
 *
 * 复用 lib/api.ts post（含 fetchWithRetry + AbortController 超时 + 错误归一 + silent 降级），
 * 不重复造轮子。超时用 BUSINESS_CONFIG.adFetchTimeout（3s，与 SW 一致）。
 *
 * 守红线：
 * - singleton-composable-listener-lifecycle：单例不在 onMounted/onUnmounted 注册/移除监听器
 *   （本 composable 不注册任何 chrome.* 监听器，仅暴露 fetchAd 由页面在 onMounted 调用）
 * - 不写 storage（无缓存），无 toPure 需求
 * - 不抛错：所有异常 catch 后置 adMap={}，业务流程零影响
 * - 阿里规约禁魔法值：BACKUP_AD_POSITIONS 常量集中定义，不散落字符串
 */
import { ref } from 'vue';
import { post } from '~lib/api';
import { API_URIS } from '~lib/api-config';
import { BUSINESS_CONFIG } from '~config/app-config';
import { isDev } from '~lib/env';
import { useAuth } from '~composables/useAuth';
import type { AdItem, AdListByPositionsResponse } from '~types/ad';

/**
 * 备份独立页广告槽位常量（后端 position 字段，集中定义禁散落）。
 * 与前端 slot-id（DOM 标识）解耦：slot-id 是前端内部标识（backup-overview-main 等），
 * position 是后端概念（backup-overview 等），不混用。
 */
export const BACKUP_AD_POSITIONS = [
  'backup-overview',
  'backup-sidebar',
  'backup-list',
  'backup-import'
] as const;

/** 槽位字面量类型（getAd 入参类型约束） */
export type BackupAdPosition = (typeof BACKUP_AD_POSITIONS)[number];

let _instance: ReturnType<typeof useBackupPageAdImpl> | null = null;

/**
 * 清洗后端返回的单条广告素材（防御性：任一字段缺失回 null，UI 显占位）
 * 复用 useAd.ts 同款逻辑（不引入跨文件依赖，保持独立页容错自洽）
 */
function sanitizeAdItem(raw: unknown): AdItem | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.id !== 'number') return null;
  return {
    id: obj.id,
    title: typeof obj.title === 'string' ? obj.title : '',
    imageUrl: typeof obj.imageUrl === 'string' ? obj.imageUrl : '',
    linkUrl: typeof obj.linkUrl === 'string' ? obj.linkUrl : '',
    duration: typeof obj.duration === 'number' ? obj.duration : BUSINESS_CONFIG.adDefaultDuration,
    startTime: typeof obj.startTime === 'string' ? obj.startTime : '',
    endTime: typeof obj.endTime === 'string' ? obj.endTime : ''
  };
}

function useBackupPageAdImpl() {
  /** 多槽位广告表：{ [position]: AdItem | null }。缺失 position 取不到返 null（显占位） */
  const adMap = ref<Record<string, AdItem | null>>({});
  const loading = ref(false);
  // 并发去重：onMounted 多次调用 / 切 Tab 重复触发只发一次请求
  let inFlight: Promise<void> | null = null;

  /**
   * 按槽位取广告（组件用）。缺失/未加载完成返 null，UI 显占位。
   * 入参宽松为 string 兼容外部字面量，但推荐用 BACKUP_AD_POSITIONS 常量。
   */
  function getAd(position: string): AdItem | null {
    return adMap.value[position] ?? null;
  }

  /**
   * 拉取多槽位广告：POST /ad/listbypositions，3s 超时静默
   * - 复用 lib/api.ts post（已含超时 + fetchWithRetry + silent 降级日志）
   * - 报错/超时 → adMap={}，不抛、不 toast
   * - 并发去重：已在飞行中直接返回同一 Promise
   */
  async function fetchAd(): Promise<void> {
    if (inFlight) return inFlight;
    loading.value = true;
    inFlight = (async () => {
      try {
        // customerType 走 body（与 SW fetchAdCache 一致，后端按此做登录态灰度/统计）
        // header 里的 customerType 由 lib/api.ts buildHeaders 自动注入，无需手动加
        const { isLoggedIn } = useAuth();
        const customerType = isLoggedIn.value
          ? BUSINESS_CONFIG.customerTypeLoggedIn
          : BUSINESS_CONFIG.customerTypeAnonymous;
        const response = await post<AdListByPositionsResponse>(
          API_URIS.adListByPositions,
          {
            customerType,
            positions: [...BACKUP_AD_POSITIONS],
            trigger: 'manual'
          },
          {
            timeout: BUSINESS_CONFIG.adFetchTimeout,
            silent: true
          }
        );
        if (response.code === 200 && response.data?.adMap) {
          // 逐条清洗：后端可能返 null 或字段缺失，统一过 sanitizeAdItem
          const map: Record<string, AdItem | null> = {};
          for (const pos of BACKUP_AD_POSITIONS) {
            map[pos] = sanitizeAdItem(response.data.adMap[pos]);
          }
          adMap.value = map;
        } else {
          adMap.value = {};
        }
      } catch (e) {
        // 静默：网络/超时/业务错误一律清空 map，UI 显占位，不影响备份业务
        if (isDev) console.warn('[backup-ad] 拉取失败（静默，不影响业务）', e);
        adMap.value = {};
      } finally {
        loading.value = false;
        inFlight = null;
      }
    })();
    return inFlight;
  }

  return { adMap, loading, fetchAd, getAd };
}

/** 单例入口：备份独立页内多处调用共享同一 adMap */
export function useBackupPageAd() {
  if (!_instance) {
    _instance = useBackupPageAdImpl();
  }
  return _instance;
}
