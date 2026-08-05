<template>
  <!-- 单根：蒙层（本元素）+ 气泡（子元素）。 Teleport 不使用（需与目标元素同处 sidepanel
       栈上下文，目标抬 z-[125] 才能穿过 z-[120] 蒙层形成镂空）。 -->
  <div
    class="fixed inset-0 z-[120] bg-black/55 dark:bg-black/65"
    :class="maskAnimClass"
    role="dialog"
    :aria-label="t('onboarding.guide.ariaLabel')"
    aria-modal="true"
    @click="onMaskClick"
  >
    <!-- 气泡卡片：fixed 定位，位置由 computePopoverPos 计算（横向居中对齐目标） -->
    <div
      ref="bubbleRef"
      class="fixed z-[130] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3"
      :class="bubbleAnimClass"
      :style="bubbleStyle"
      @click.stop
    >
      <!-- 步数指示 -->
      <div class="flex items-center justify-between mb-1">
        <span class="text-[10px] text-gray-400 dark:text-gray-500" aria-live="polite">
          {{ currentStep + 1 }}/{{ steps.value.length }}
        </span>
      </div>

      <!-- 标题（痛点式） -->
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {{ currentTitle }}
      </h3>

      <!-- 说明（功能用法） -->
      <p class="mt-1.5 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
        {{ currentDesc }}
      </p>

      <!-- 优势点 -->
      <p class="mt-2 text-[11px] font-medium text-blue-600 dark:text-blue-400">
        {{ currentAdvantage }}
      </p>

      <!-- 按钮区：上一步 / 跳过 / 下一步·开始使用 -->
      <div class="mt-3 flex items-center justify-between gap-2">
        <button
          class="inline-flex items-center gap-0.5 min-h-[32px] px-2 text-xs rounded text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="currentStep === 0"
          @click="prev"
        >
          <ChevronLeft :size="14" />{{ t('onboarding.guide.prev') }}
        </button>

        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center min-h-[32px] px-2 text-xs rounded text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :aria-label="t('onboarding.guide.skipAria')"
            @click="skip"
          >
            {{ t('onboarding.guide.skip') }}
          </button>
          <button
            class="inline-flex items-center gap-0.5 min-h-[32px] px-3 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            @click="next"
          >
            {{ isLast ? t('onboarding.guide.start') : t('onboarding.guide.next') }}
            <ChevronRight v-if="!isLast" :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 新手引导页（sidepanel 首次打开）。
 *
 * 设计稿：docs/design/sidepanel-onboarding-guide.md
 *
 * 关键约束：
 * - 单根组件（Vue 多根 fallthrough 红线，零容忍）。模板最外层只有一个 div。
 * - 不 Teleport：需与目标元素同处 sidepanel 栈上下文，目标抬 z-[125] 才能穿过
 *   z-[120] 蒙层形成镂空；Teleport 到 body 会被 sidepanel 根 z-index:1 栈上下文
 *   盖住，镂空失效。
 * - 高亮方案 A（设计稿 §10.4）：目标元素临时加 relative + z-[125] + 蓝边框光晕 +
 *   pointer-events-none（点击穿透到蒙层 → 跳过），蒙层本身 bg-black/55 形成镂空
 *   视觉（目标完整可见，其余区域半透明遮罩）。
 * - 气泡定位复用 lib/popoverPosition.ts 的 computePopoverPos（纵向翻转 + clamp），
 *   横向改为居中对齐目标并 clamp 防溢出窄面板。
 * - 完成或跳过 → 写 chrome.storage.local `tabMasterOnboardingDone=true`，
 *   下次 sidepanel 打开不再弹。
 * - 尊重 prefers-reduced-motion：动画降级为瞬切。
 */
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { computePopoverPos } from '~lib/popoverPosition';
import { safeSet } from '~lib/safeStorage';
import { t } from '~lib/i18n';

const emit = defineEmits<{ done: []; skip: [] }>();

/** chrome.storage.local 标志 key：是否已完成新手引导 */
const ONBOARDING_KEY = 'tabMasterOnboardingDone';

/** 高亮目标临时叠加的 class（抬层 + 蓝边框光晕 + 点击穿透到蒙层） */
const HIGHLIGHT_CLASSES = [
  'relative',
  'z-[125]',
  'ring-2',
  'ring-blue-500',
  'shadow-[0_0_0_4px_rgba(59,130,246,0.25)]',
  'rounded-md',
  'pointer-events-none'
];

interface OnboardingStep {
  /** data-onboarding-target 属性值 */
  target: string;
  /** 主目标不可见时的兜底目标（如 TagBar 被关闭 → 竖三点） */
  fallbackTarget?: string;
  /** 气泡方向：底部目标用 bottom（气泡在下方），顶部目标用 top（气泡在上方） */
  anchor: 'bottom' | 'top';
  title: string;
  desc: string;
  advantage: string;
  /** 使用兜底目标时的替代文案（教会用户标记栏可开关） */
  fbTitle?: string;
  fbDesc?: string;
  fbAdvantage?: string;
}

/** 5 步文案（设计稿 §8 定稿，照搬；第 5 步去掉「再看引导」指向不存在的功能，诚实）
 *  文案走 i18n（t()），steps 用 computed 派生，locale 切换时自动重渲染。
 *  target/fallbackTarget/anchor 是非文案配置，固定不变。
 */
const steps = computed<OnboardingStep[]>(() => [
  {
    target: 'backup',
    anchor: 'bottom',
    title: t('onboarding.guide.step1.title'),
    desc: t('onboarding.guide.step1.desc'),
    advantage: t('onboarding.guide.step1.advantage')
  },
  {
    target: 'tags',
    fallbackTarget: 'tags-toggle',
    anchor: 'bottom',
    title: t('onboarding.guide.step2.title'),
    desc: t('onboarding.guide.step2.desc'),
    advantage: t('onboarding.guide.step2.advantage'),
    fbTitle: t('onboarding.guide.step2.fbTitle'),
    fbDesc: t('onboarding.guide.step2.fbDesc'),
    fbAdvantage: t('onboarding.guide.step2.fbAdvantage')
  },
  {
    target: 'view',
    anchor: 'bottom',
    title: t('onboarding.guide.step3.title'),
    desc: t('onboarding.guide.step3.desc'),
    advantage: t('onboarding.guide.step3.advantage')
  },
  {
    target: 'footer',
    anchor: 'top',
    title: t('onboarding.guide.step4.title'),
    desc: t('onboarding.guide.step4.desc'),
    advantage: t('onboarding.guide.step4.advantage')
  },
  {
    target: 'settings',
    anchor: 'bottom',
    title: t('onboarding.guide.step5.title'),
    desc: t('onboarding.guide.step5.desc'),
    advantage: t('onboarding.guide.step5.advantage')
  }
]);

const currentStep = ref(0);
const bubbleRef = ref<HTMLElement | null>(null);
const bubbleStyle = ref<{ left: string; top: string }>({ left: '12px', top: '12px' });
/** 是否正在使用兜底目标（驱动文案切换） */
const usingFallback = ref(false);
/** 进入动画触发 */
const entered = ref(false);
/** 退出动画触发（关闭前先淡出 150ms） */
const closing = ref(false);

/** 当前是否处于最后一步 */
const isLast = computed(() => currentStep.value === steps.value.length - 1);

/** 尊重 prefers-reduced-motion：开启时所有动画降级为瞬切 */
const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const maskAnimClass = computed(() => {
  if (reducedMotion) return '';
  return [
    'transition-opacity',
    'duration-200',
    'ease-out',
    closing.value ? 'opacity-0' : entered.value ? 'opacity-100' : 'opacity-0'
  ].join(' ');
});

const bubbleAnimClass = computed(() => {
  if (reducedMotion) return '';
  return [
    'transition-all',
    'duration-200',
    'ease-out',
    closing.value || !entered.value ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
  ].join(' ');
});

const currentMeta = computed(() => {
  const s = steps.value[currentStep.value];
  if (usingFallback.value) {
    return {
      title: s.fbTitle ?? s.title,
      desc: s.fbDesc ?? s.desc,
      advantage: s.fbAdvantage ?? s.advantage
    };
  }
  return { title: s.title, desc: s.desc, advantage: s.advantage };
});
const currentTitle = computed(() => currentMeta.value.title);
const currentDesc = computed(() => currentMeta.value.desc);
const currentAdvantage = computed(() => currentMeta.value.advantage);

/** 当前高亮的目标元素（用于切步/卸载时移除高亮 class） */
let highlightedEl: HTMLElement | null = null;

/** 查询目标元素，应用/移除高亮 class，并计算气泡位置 */
const updatePosition = () => {
  const step = steps.value[currentStep.value];
  let el: HTMLElement | null = document.querySelector<HTMLElement>(
    `[data-onboarding-target="${step.target}"]`
  );
  usingFallback.value = false;
  if (!el && step.fallbackTarget) {
    el = document.querySelector<HTMLElement>(
      `[data-onboarding-target="${step.fallbackTarget}"]`
    );
    if (el) usingFallback.value = true;
  }

  // 移除上一步高亮
  if (highlightedEl) {
    highlightedEl.classList.remove(...HIGHLIGHT_CLASSES);
    highlightedEl = null;
  }

  if (!el) {
    // 兜底：目标不可见（极少见，如当前不在首页）→ 自动跳到下一步
    goToStep(currentStep.value + 1);
    return;
  }

  el.classList.add(...HIGHLIGHT_CLASSES);
  highlightedEl = el;

  const rect = el.getBoundingClientRect();
  const bubble = bubbleRef.value;
  const width = Math.min(280, window.innerWidth - 24);
  const height = bubble?.offsetHeight ?? 0;
  const anchor = step.anchor === 'top' ? 'top-left' : 'bottom-left';
  // 复用 computePopoverPos：拿到纵向（含空间不足翻转 + clamp）+ 横向 clamp 的基准
  const pos = computePopoverPos(rect, { width, height }, anchor, 8);
  // 横向改为居中对齐目标（设计稿 §10.5），再 clamp 防溢出窄面板
  let left = rect.left + rect.width / 2 - width / 2;
  const VW = window.innerWidth;
  if (left + width > VW - 4) left = VW - width - 4;
  if (left < 4) left = 4;
  bubbleStyle.value = { left: left + 'px', top: pos.top + 'px' };
};

/** 跳到指定步（越界 → 完成）；每次切步 nextTick 重读目标位置 */
const goToStep = (index: number) => {
  if (index >= steps.value.length) {
    finish();
    return;
  }
  if (index < 0) index = 0;
  currentStep.value = index;
  nextTick(updatePosition);
};

const next = () => {
  if (isLast.value) {
    finish();
    return;
  }
  goToStep(currentStep.value + 1);
};

const prev = () => {
  if (currentStep.value === 0) return;
  goToStep(currentStep.value - 1);
};

/** 写入完成标志（safeSet 兜底配额/SW 已死） */
const persistDone = () => {
  safeSet({ [ONBOARDING_KEY]: true }, 'onboarding');
};

/** 完成（最后一步「开始使用」）→ 写标志 + 淡出 + emit done */
const finish = () => {
  if (closing.value) return;
  persistDone();
  closeWithAnim('done');
};

/** 跳过（跳过按钮 / Esc / 点遮罩）→ 写标志 + 淡出 + emit skip */
const skip = () => {
  if (closing.value) return;
  persistDone();
  closeWithAnim('skip');
};

const closeWithAnim = (event: 'done' | 'skip') => {
  // 移除高亮
  if (highlightedEl) {
    highlightedEl.classList.remove(...HIGHLIGHT_CLASSES);
    highlightedEl = null;
  }
  if (reducedMotion) {
    emit(event);
    return;
  }
  closing.value = true;
  // 退出比进入快（150ms < 200ms），符合 exit-faster-than-enter
  window.setTimeout(() => emit(event), 150);
};

/** 点蒙层 → 跳过（设计稿 §5：点遮罩跳过） */
const onMaskClick = () => skip();

/** 收集气泡内可聚焦按钮（focus trap） */
const getFocusables = (): HTMLElement[] => {
  const bubble = bubbleRef.value;
  if (!bubble) return [];
  return Array.from(bubble.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    skip();
    return;
  }
  if (e.key === 'Tab') {
    const focusables = getFocusables();
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeydown, true);
  window.addEventListener('resize', updatePosition);
  // 进入动画
  entered.value = true;
  nextTick(() => {
    updatePosition();
    // 焦点锁到气泡主按钮
    const focusables = getFocusables();
    focusables[focusables.length - 1]?.focus();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown, true);
  window.removeEventListener('resize', updatePosition);
  if (highlightedEl) {
    highlightedEl.classList.remove(...HIGHLIGHT_CLASSES);
    highlightedEl = null;
  }
});
</script>
