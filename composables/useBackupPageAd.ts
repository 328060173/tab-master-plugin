/**
 * 备份独立页广告 composable（单例）
 *
 * 与 sidepanel 的 useAd 区别（独立页常驻展示位，不消费）：
 * - 不读 adCache storage / 不写 adState storage
 * - 无频率上限 / 无展示即消费 / 无 hideAd
 * - 进页 onMounted 调一次 fetchAd；刷新页面 = 重新挂载 = 自动触发
 * - 报错/超时静默：adData=null 显占位，不 toast、不影响业务
 *
 * 复用 lib/api.ts post（含 fetchWithRetry + AbortController 超时 + 错误归一 + silent 降级），
 * 不重复造轮子。超时用 BUSINESS_CONFIG.adFetchTimeout（3s，与 SW 一致）。
 *
 * 守红线：
 * - singleton-composable-listener-lifecycle：单例不在 onMounted/onUnmounted 注册/移除监听器
 *   （本 composable 不注册任何 chrome.* 监听器，仅暴露 fetchAd 由页面在 onMounted 调用）
 * - 不写 storage（无缓存），无 toPure 需求
 * - 不抛错：所有异常 catch 后置 adData=null，业务流程零影响
 */
import { ref } from 'vue';
import { post } from '~lib/api';
import { API_URIS } from '~lib/api-config';
import { BUSINESS_CONFIG } from '~config/app-config';
import { isDev } from '~lib/env';
import { useAuth } from '~composables/useAuth';
import type { AdItem, AdSyncResponse } from '~types/ad';

let _instance: ReturnType<typeof useBackupPageAdImpl> | null = null;

/**
 * 清洗后端返回的广告素材（防御性：任一字段缺失回 null，UI 显占位）
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
  const adData = ref<AdItem | null>(null);
  const loading = ref(false);
  // 并发去重：onMounted 多次调用 / 切 Tab 重复触发只发一次请求
  let inFlight: Promise<void> | null = null;

  /**
   * 拉取广告：POST /ad/list，3s 超时静默
   * - 复用 lib/api.ts post（已含超时 + fetchWithRetry + silent 降级日志）
   * - 报错/超时 → adData=null，不抛、不 toast
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
        const response = await post<AdSyncResponse>(
          API_URIS.adList,
          {
            customerType,
            position: BUSINESS_CONFIG.adPosition,
            trigger: 'manual'
          },
          {
            timeout: BUSINESS_CONFIG.adFetchTimeout,
            silent: true
          }
        );
        if (response.code === 200 && response.data) {
          adData.value = sanitizeAdItem(response.data.adData);
        } else {
          adData.value = null;
        }
      } catch (e) {
        // 静默：网络/超时/业务错误一律 null，UI 显占位，不影响备份业务
        if (isDev) console.warn('[backup-ad] 拉取失败（静默，不影响业务）', e);
        adData.value = null;
      } finally {
        loading.value = false;
        inFlight = null;
      }
    })();
    return inFlight;
  }

  return { adData, loading, fetchAd };
}

/** 单例入口：备份独立页内多处调用共享同一 adData */
export function useBackupPageAd() {
  if (!_instance) {
    _instance = useBackupPageAdImpl();
  }
  return _instance;
}
