<template>
  <div
    class="min-h-screen text-gray-900 dark:text-gray-100 relative"
    style="z-index: 1">
    <!-- 顶部条 + Tab 栏（合在一个 sticky header 内，一起吸顶） -->
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div class="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
        <Sliders :size="18" class="text-blue-600 dark:text-blue-400" />
        <h1 class="text-base font-semibold">{{ t('options.header.title') }}</h1>
        <span class="text-xs text-gray-400 ml-auto">v{{ version }}</span>
      </div>
      <!-- Tab 栏：风格对齐 sidepanel NavTabs（border-b-2 选中态） -->
      <div
        class="max-w-3xl mx-auto px-6 flex gap-1 border-t border-gray-100 dark:border-gray-700">
        <button
          v-for="tab in optionTabs"
          :key="tab.key"
          type="button"
          :class="[
            'px-3 py-2 text-xs transition-colors border-b-2 -mb-px',
            activeTab === tab.key
              ? 'border-blue-600 text-blue-600 font-medium'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
          ]"
          @click="activeTab = tab.key">
          {{ tab.label }}
        </button>
      </div>
    </header>

    <main class="max-w-3xl mx-auto p-6 space-y-8 relative">
      <!-- 账号 tab：原「账号/同步」section 内容 -->
      <section v-show="activeTab === 'account'">
        <!-- 未登录态：登录入口卡片 -->
        <div
          v-if="!isLoggedIn"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center gap-3">
          <LogIn :size="24" class="text-blue-600 dark:text-blue-400" />
          <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
            {{ t('options.account.loginPrompt') }}
          </p>
          <button
            type="button"
            class="px-4 py-2 text-xs rounded tm-skin-primary-bg text-white font-medium transition-colors"
            @click="loginDialogOpen = true">
            {{ t('options.account.loginButton') }}
          </button>
        </div>

        <!-- 已登录态：个人信息摘要 + 签到 + 更多/退出 -->
        <div
          v-else
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-700">
          <!-- 头像 + 性别选择（2026-07-18 性别头像） -->
          <div class="px-5 py-4 flex items-center gap-4">
            <AvatarWithFrame :email="user?.email || ''" :size="56" />
            <div class="flex items-center gap-1.5 flex-wrap">
              <button
                v-for="opt in SEX_OPTIONS"
                :key="opt.value"
                type="button"
                :disabled="updatingSex !== null || user?.sex === opt.value"
                class="px-3 py-1.5 text-xs rounded border transition-colors disabled:cursor-not-allowed"
                :class="
                  user?.sex === opt.value
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300 font-medium'
                    : 'border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700/50 disabled:opacity-60'
                "
                @click="onUpdateSex(opt.value)">
                {{ updatingSex === opt.value ? t('options.account.sex.submitting') : opt.label }}
              </button>
            </div>
          </div>

          <!-- 邮箱 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('options.account.email') }}</span>
            <span class="text-sm font-medium truncate max-w-[60%]">{{
              user?.email
            }}</span>
          </div>

          <!-- 积分 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('options.account.points') }}</span>
            <span
              class="text-sm font-medium text-blue-600 dark:text-blue-400"
              >{{ user?.points ?? 0 }}</span
            >
          </div>

          <!-- 签到 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div class="min-w-0">
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('options.account.checkin') }}</p>
              <p
                class="text-xs mt-0.5"
                :class="
                  user?.todayCheckedIn
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400'
                ">
                {{ user?.todayCheckedIn ? t('options.account.checkin.done') : t('options.account.checkin.undone') }}
              </p>
              <p
                v-if="user && !user.todayCheckedIn"
                class="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                {{ tWithParams('options.account.checkin.awardTip', { points: user.checkinAwardPoints }) }}
              </p>
            </div>
            <button
              type="button"
              :disabled="user?.todayCheckedIn || checking"
              class="shrink-0 px-3 py-1.5 text-xs rounded border transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              :class="
                user?.todayCheckedIn
                  ? 'border-gray-200 text-gray-400 dark:border-gray-600'
                  : 'border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30'
              "
              @click="onCheckin">
              {{
                user?.todayCheckedIn
                  ? t('options.account.checkin.checked')
                  : checking
                    ? t('options.account.checkin.checking')
                    : t('options.account.checkin.now')
              }}
            </button>
          </div>

          <!-- 更多 / 退出登录 -->
          <div class="px-5 py-4 flex items-center justify-end gap-2">
            <button
              type="button"
              class="px-3 py-1.5 text-xs rounded border border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30 transition-colors"
              @click="onOpenMyPage">
              {{ t('options.account.more') }}
            </button>
            <button
              type="button"
              :disabled="loggingOut"
              class="px-3 py-1.5 text-xs rounded border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-60"
              @click="onLogout">
              {{ loggingOut ? t('options.account.logout.submitting') : t('options.account.logout') }}
            </button>
          </div>
        </div>
      </section>

      <!-- 道具商城（账号 tab 内，登录态信息下方）（PRD docs/coordination/2026-07-17-prop-shop.md）
           2026-07-18 重构：后端 /prop/list 改若依分页（propType 单类型查询），前端加二级 tab + 分页栏；
           透明度滑块从视口 fixed 改为 section 内 absolute right-2 top-2（section 加 relative）。 -->
      <section v-show="activeTab === 'account'" class="relative">
        <!-- 积分摘要（h2 由 tab 标签取代，仅保留积分显示） -->
        <div
          class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <Coins :size="14" class="text-amber-500" />
          <span
            >{{ t('options.prop.myPoints') }}<span
              class="font-medium text-blue-600 dark:text-blue-400"
              >{{ isLoggedIn ? user?.points ?? 0 : "—" }}</span
            ></span
          >
        </div>

        <!-- 恢复默认行（置顶）：三个按钮分别清头像框 / 清背景图 / 全部清 -->
        <div class="flex items-center flex-wrap gap-2 mb-3">
          <button
            type="button"
            :disabled="!purchasedFrame"
            class="px-3 py-1.5 text-xs rounded border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onResetFrame">
            {{ t('options.prop.resetFrame') }}
          </button>
          <button
            type="button"
            :disabled="!purchasedBg"
            class="px-3 py-1.5 text-xs rounded border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onResetBg">
            {{ t('options.prop.resetBg') }}
          </button>
          <button
            type="button"
            :disabled="!purchasedFrame && !purchasedBg"
            class="px-3 py-1.5 text-xs rounded border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onResetActive">
            {{ t('options.prop.resetAll') }}
          </button>
        </div>

        <!-- 透明度横向滑块（主题背景 / 主题纯色背景 tab 内常驻占位）
             拖动即时生效：写 userBgOpacity + persist → storage.onChanged 触发 sidepanel 实时同步；
             无生效背景（effectiveBg 为空，即未使用也未试穿背景）时滑块禁用。 -->
        <div
          v-if="activePropTab === 2 || activePropTab === 3"
          class="flex items-center gap-3 mb-3">
          <span class="text-xs text-gray-500 dark:text-gray-400 shrink-0"
            >{{ t('options.prop.opacity') }}</span
          >
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            :value="bgOpacity"
            :disabled="!effectiveBg"
            class="flex-1 accent-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            @input="onBgOpacityInput" />
          <span class="text-[10px] text-gray-400 tabular-nums w-7 text-center"
            >{{ Math.round(bgOpacity * 100) }}%</span
          >
        </div>

        <div
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 space-y-5">
          <!-- 二级 tab：头像框(propType=1) / 背景图(propType=2)，样式对齐顶部 Tab 栏（border-b-2 选中态） -->
          <div class="flex gap-1 border-b border-gray-100 dark:border-gray-700">
            <button
              v-for="t in propSubTabs"
              :key="t.value"
              type="button"
              :class="[
                'px-3 py-2 text-xs transition-colors border-b-2 -mb-px',
                activePropTab === t.value
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
              ]"
              @click="onPropTabChange(t.value)">
              {{ t.label }}
            </button>
          </div>

          <!-- 加载中 -->
          <div
            v-if="loadingProps"
            class="text-center py-8 text-xs text-gray-400">
            {{ t('options.prop.loading') }}
          </div>
          <!-- 加载失败 -->
          <div v-else-if="loadPropsError" class="text-center py-8">
            <p class="text-xs text-red-500 mb-2">{{ loadPropsError }}</p>
            <button
              type="button"
              class="px-3 py-1.5 text-xs rounded border border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30"
              @click="loadProps">
              {{ t('options.prop.retry') }}
            </button>
          </div>
          <!-- 空列表 -->
          <div
            v-else-if="propList.length === 0"
            class="text-center py-8 text-xs text-gray-400">
            {{ t('options.prop.empty') }}
          </div>
          <template v-else>
            <!-- 试穿中提示条（PRD docs/coordination/2026-07-17-prop-shop.md §3 试穿功能） -->
            <div
              v-if="tryonProp"
              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20 text-xs">
              <Timer
                :size="14"
                class="shrink-0 text-amber-600 dark:text-amber-400" />
              <span class="text-amber-800 dark:text-amber-300 truncate">
                {{ tWithParams('options.prop.tryonBar', { name: tryonPropName, seconds: tryonRemaining }) }}
              </span>
              <button
                type="button"
                class="shrink-0 ml-auto px-2 py-0.5 rounded border border-amber-400 text-amber-700 dark:border-amber-500 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                @click="stopTryon">
                {{ t('options.prop.stopTryon') }}
              </button>
            </div>

            <!-- 网格（ref 用于翻页后滚动定位） -->
            <div
              ref="propGridRef"
              class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                v-for="p in propList"
                :key="p.id"
                class="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
                :class="isUsingProp(p.id) ? 'ring-2 ring-blue-500' : ''">
                <!-- 缩略图（不取原图，省带宽）：头像框 object-contain / 背景图 object-cover / 纯色背景用 CSS 值铺色块 -->
                <div
                  class="aspect-square bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <div
                    v-if="p.propThumbnailUrl && isCssBg(p.propThumbnailUrl)"
                    :style="{ background: p.propThumbnailUrl }"
                    class="w-full h-full"></div>
                  <img
                    v-else-if="p.propThumbnailUrl"
                    :src="p.propThumbnailUrl"
                    :alt="p.propName"
                    :class="
                      activePropTab === 1
                        ? 'w-full h-full object-contain'
                        : 'w-full h-full object-cover'
                    "
                    loading="lazy" />
                  <span v-else class="text-[11px] text-gray-400">{{ t('options.prop.noImage') }}</span>
                </div>
                <!-- 信息 + 操作 -->
                <div class="p-2 flex flex-col gap-1 flex-1">
                  <p
                    class="text-xs font-medium text-gray-800 dark:text-gray-200 truncate"
                    :title="p.propName">
                    {{ p.propName }}
                  </p>
                  <p
                    v-if="p.propTip"
                    class="text-[10px] text-gray-400 truncate"
                    :title="p.propTip">
                    {{ p.propTip }}
                  </p>
                  <p class="text-[11px] text-amber-600 dark:text-amber-400">
                    <template v-if="p.freeFlag === 1">{{ t('options.prop.free') }}</template>
                    <template v-else>{{ tWithParams('options.prop.pointsCost', { points: p.points }) }}</template>
                  </p>
                  <!-- 操作按钮区 -->
                  <div class="flex flex-wrap gap-1 mt-auto">
                    <!-- 已购：显示「使用」/「使用中」 -->
                    <template v-if="p.purchased">
                      <button
                        v-if="isUsingProp(p.id)"
                        type="button"
                        disabled
                        class="flex-1 min-w-[55px] px-2 py-1 text-[11px] rounded bg-blue-500 text-white cursor-default">
                        {{ t('options.prop.inUse') }}
                      </button>
                      <button
                        v-else
                        type="button"
                        class="flex-1 min-w-[55px] px-2 py-1 text-[11px] rounded border border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30 disabled:opacity-60"
                        :disabled="usingId === p.id"
                        @click="onUse(p)">
                        {{ usingId === p.id ? t('options.prop.applying') : t('options.prop.use') }}
                      </button>
                    </template>
                    <!-- 未购：显示「预览」+「试穿」+「兑换」 -->
                    <template v-else>
                      <button
                        type="button"
                        class="flex-1 min-w-[44px] px-1.5 py-1 text-[11px] rounded border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50 disabled:opacity-60"
                        :disabled="
                          previewLoadingId === p.id || tryonLoadingId === p.id
                        "
                        @click="onPreview(p)">
                        {{ previewLoadingId === p.id ? "…" : t('options.prop.preview') }}
                      </button>
                      <button
                        type="button"
                        class="flex-1 min-w-[44px] px-1.5 py-1 text-[11px] rounded border disabled:opacity-60"
                        :class="
                          isTryingOn(p.id)
                            ? 'border-amber-500 bg-amber-500 text-white cursor-default'
                            : 'border-amber-400 text-amber-600 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-300 dark:hover:bg-amber-900/30'
                        "
                        :disabled="
                          tryonLoadingId !== null && tryonLoadingId !== p.id
                        "
                        @click="onTryOn(p)">
                        {{
                          isTryingOn(p.id)
                            ? t('options.prop.tryonOn')
                            : tryonLoadingId === p.id
                              ? "…"
                              : t('options.prop.tryon')
                        }}
                      </button>
                      <button
                        type="button"
                        class="flex-1 min-w-[44px] px-1.5 py-1 text-[11px] rounded border tm-skin-primary-border tm-skin-primary-text hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-60"
                        :disabled="
                          exchangingId === p.id || tryonLoadingId === p.id
                        "
                        @click="onExchange(p)">
                        {{ exchangingId === p.id ? t('options.prop.exchanging') : t('options.prop.exchange') }}
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分页栏：[上一页] 第 N / M 页 [下一页]（M=ceil(total/pageSize)，至少 1） -->
            <div
              class="flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <button
                type="button"
                :disabled="propPageNum <= 1"
                class="px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                @click="onPropPageChange(propPageNum - 1)">
                {{ t('options.prop.prevPage') }}
              </button>
              <span class="tabular-nums"
                >{{ tWithParams('options.prop.pageIndicator', { current: propPageNum, total: propTotalPages }) }}</span
              >
              <button
                type="button"
                :disabled="propPageNum >= propTotalPages"
                class="px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                @click="onPropPageChange(propPageNum + 1)">
                {{ t('options.prop.nextPage') }}
              </button>
            </div>

            <p class="text-[11px] text-gray-400 leading-relaxed">
              {{ t('options.prop.disclaimer') }}
            </p>
          </template>
        </div>
      </section>

      <!-- 设置 tab：原「更多设置」section 内容 -->
      <section v-show="activeTab === 'settings'">
        <div
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-700">
          <!-- 语言（i18n 切换） -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div class="flex items-start gap-1.5">
              <div>
                <p class="text-sm font-medium flex items-center gap-1.5">
                  {{ t('settings.language.label') }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ languageHint }}
                </p>
              </div>
            </div>
            <select
              v-model="languagePref"
              class="shrink-0 px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              @change="onLanguageChange">
              <option value="auto">{{ t('settings.language.auto') }}</option>
              <option value="zh-CN">{{ t('settings.language.zh-CN') }}</option>
              <option value="en-US">{{ t('settings.language.en-US') }}</option>
            </select>
          </div>

          <!-- 自动数据校正 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div class="flex items-start gap-1.5">
              <div>
                <p class="text-sm font-medium flex items-center gap-1.5">
                  {{ t('options.setting.autoReconcile.label') }}
                  <button
                    type="button"
                    class="help-trigger"
                    @click="showReconcileHelp = !showReconcileHelp"
                    :aria-label="t('options.setting.autoReconcile.ariaLabel')">
                    <HelpCircle
                      :size="14"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  </button>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ t('options.setting.autoReconcile.desc') }}
                </p>
              </div>
            </div>
            <!-- toggle 开关 -->
            <button
              type="button"
              role="switch"
              :aria-checked="settings.autoReconcile"
              @click="updateSetting('autoReconcile', !settings.autoReconcile)"
              :class="toggleCls(settings.autoReconcile)">
              <span :class="toggleKnobCls(settings.autoReconcile)"></span>
            </button>
          </div>

          <!-- 刷新菜单内容：向 SW 发 manualRefreshAll，触发菜单/通知/版本同步（manual 不刷广告，避免每次点都弹广告）+ /my 重拉 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div class="flex items-start gap-2">
              <div>
                <p class="text-sm font-medium">{{ t('options.setting.refreshContent.label') }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ t('options.setting.refreshContent.desc') }}
                </p>
                <p
                  v-if="refreshHint"
                  class="text-xs text-green-600 dark:text-green-400 mt-1">
                  {{ t('options.setting.refreshContent.hint') }}
                </p>
              </div>
            </div>
            <button
              type="button"
              :disabled="refreshing"
              @click="onRefreshContent"
              class="shrink-0 px-3 py-1.5 text-xs rounded border transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              :class="
                refreshing
                  ? 'border-gray-200 text-gray-400 dark:border-gray-600'
                  : 'border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30'
              ">
              {{ refreshing ? t('options.setting.refreshContent.button.syncing') : t('options.setting.refreshContent.button.now') }}
            </button>
          </div>
        </div>

        <!-- 问号弹窗（点击问号图标切换显示） -->
        <div
          v-if="showReconcileHelp"
          class="mt-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <p class="font-medium text-blue-700 dark:text-blue-300 mb-2">
            {{ t('options.setting.autoReconcile.helpTitle') }}
          </p>
          <p class="mb-2">
            {{ t('options.setting.autoReconcile.helpP1') }}
          </p>
          <p class="mb-2">
            {{ t('options.setting.autoReconcile.helpP2') }}
          </p>
          <p>{{ t('options.setting.autoReconcile.helpP3') }}</p>
        </div>

        <!-- 更多功能：后端 /setting/menu-list (settingType=2) 下发的动态菜单（options 直接请求，不走 SW） -->
        <!-- 空数组（请求未完成/后端未配/请求失败）时整个区块隐藏，不影响上方「自动数据校正」「刷新菜单内容」 -->
        <SettingMenuOptionsList class="mt-3" />
      </section>
    </main>

    <!-- 登录弹框：跨页面复用 LoginDialog（内部 Teleport to body，不影响本页单根结构） -->
    <LoginDialog
      :open="loginDialogOpen"
      @close="loginDialogOpen = false"
      @success="onLoginSuccess" />

    <!-- 退出登录确认弹框（复用 ConfirmDialog） -->
    <ConfirmDialog
      :open="logoutConfirmOpen"
      :title="t('options.logoutConfirm.title')"
      :message="t('options.logoutConfirm.message')"
      :confirm-text="t('options.logoutConfirm.confirm')"
      danger
      @cancel="logoutConfirmOpen = false"
      @confirm="confirmLogout" />

    <!-- 道具预览弹层（点击预览时按需 GET /prop/{id} 取原图） -->
    <div
      v-if="previewProp"
      class="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center p-6"
      @click="closePreview">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        @click.stop>
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
            {{ previewProp.propName }}
          </p>
          <button
            class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            @click="closePreview">
            <X :size="16" />
          </button>
        </div>
        <div class="p-4">
          <p
            v-if="previewProp.propDiscription"
            class="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {{ previewProp.propDiscription }}
          </p>
          <!-- 头像框道具：套在示例头像上预览（240×240，框 PNG 盖满，头像本体≈197 居中） -->
          <div
            v-if="previewProp.propType === 1"
            class="flex items-center justify-center py-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <AvatarWithFrame
              :email="previewEmail"
              :size="240"
              :frame-url="previewProp.propResourceUrl" />
          </div>
          <!-- 背景图道具：铺满示例区预览（纯色用 CSS 值铺色块，webp 走 img） -->
          <div
            v-else
            class="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
            <div
              v-if="
                previewProp.propResourceUrl &&
                isCssBg(previewProp.propResourceUrl)
              "
              :style="{ background: previewProp.propResourceUrl }"
              class="w-full h-full"></div>
            <img
              v-else-if="previewProp.propResourceUrl"
              :src="previewProp.propResourceUrl"
              :alt="previewProp.propName"
              class="w-full h-full object-cover" />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-xs text-gray-400">
              {{ t('options.preview.noOriginalImage') }}
            </div>
          </div>
          <!-- 头像框预览：底部「试穿 30 秒」次按钮（复用 startTryon，关弹层 + toast） -->
          <div
            v-if="previewProp.propType === 1"
            class="flex justify-center mt-4">
            <button
              type="button"
              class="px-4 py-1.5 text-xs rounded border border-amber-400 text-amber-600 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-300 dark:hover:bg-amber-900/30 transition-colors"
              @click="onPreviewTryOn">
              {{ t('options.preview.tryon30s') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- toast -->
    <div
      v-if="toastMsg"
      class="fixed top-3 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 bg-gray-800 text-white text-xs rounded-full shadow-lg pointer-events-none">
      {{ toastMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 浏览器标签大师完整设置页 —— Plasmo 自动注册为 options_page
 *
 * 设计取舍：
 * - 主题/字号在 sidepanel 顶部菜单内嵌可调；本页放账号个人中心、自动数据校正、刷新菜单内容、关于
 * - 与 sidepanel 共享 useSettings()（module-scope ref），改完立即生效
 * - 与 sidepanel 共享 useAuth()（单例 + storage.local 持久化），options 登录/登出/签到后 storage.onChanged 触发 sidepanel 同步
 * - 不要再加 SettingsDialog —— 用户明确要求"不要弹窗套弹窗"
 *
 * 触发方式：sidepanel HeaderMenu "设置..." → chrome.runtime.openOptionsPage()
 */
import { Coins, HelpCircle, LogIn, Sliders, Timer, X } from "@lucide/vue"
import { computed, onErrorCaptured, onMounted, ref, watch } from "vue"

import AvatarWithFrame from "~components/AvatarWithFrame.vue"
import ConfirmDialog from "~components/ConfirmDialog.vue"
import LoginDialog from "~components/LoginDialog.vue"
import SettingMenuOptionsList from "~components/SettingMenuOptionsList.vue"
import { useAuth } from "~composables/useAuth"
import { installGlobalCapture, logError } from "~composables/useLogger"
import { useSettings } from "~composables/useSettings"
import { useSkin } from "~composables/useSkin"
import { useToast } from "~composables/useToast"
import { get, post } from "~lib/api"
import { API_URIS, buildOfficialUrl, propDetailUri } from "~lib/api-config"
import { t, tWithParams, getUserLocalePref, setUserLocale, initLocale, getLocaleRef, type LocalePref } from "~lib/i18n"
import type {
  ExchangeResultVO,
  PropDetailVO,
  PropListVO,
  PropPageResult
} from "~types/prop"

const { settings, updateSetting } = useSettings()
const { isLoggedIn, user, logout, fetchUser, getToken } = useAuth()
const {
  bgOpacity,
  setBgOpacity,
  purchasedFrame,
  purchasedBg,
  applyPurchasedFrame,
  applyPurchasedBg,
  clearPurchased,
  clearAllActive,
  loadPurchasedActive,
  tryonProp,
  tryonRemaining,
  effectiveBg,
  startTryon,
  stopTryon
} = useSkin()

// 判断道具资源 URL 是否为纯色 CSS 值（如 linear-gradient(...)）
// 非 http/相对路径开头 = CSS（webp 走 https 或 / 路径）
// 用于缩略图色块渲染 + applyPurchasedBg/startTryon 传 bgType
function isCssBg(url: string): boolean {
  return !/^(https?:|\/)/.test(url)
}

const showReconcileHelp = ref(false)

// ========== Tab 切换（账号 / 设置） ==========
// 道具商城并入「账号」tab（登录态信息下方），让用户更容易看到。
// localStorage 持久化上次 tab（key tabMasterOptionsTab），刷新保持。
// options 页是普通 DOM 页面，window.localStorage 可用（非 SW / 非 SSR）。
type OptionsTab = "account" | "settings"
const optionTabs = computed<{ key: OptionsTab; label: string }[]>(() => [
  { key: "account", label: t('options.tab.account') },
  { key: "settings", label: t('options.tab.settings') }
])
const TAB_STORAGE_KEY = "tabMasterOptionsTab"
function loadStoredTab(): OptionsTab {
  try {
    const v = window.localStorage.getItem(TAB_STORAGE_KEY)
    if (v === "account" || v === "settings") return v
  } catch {
    /* localStorage 不可用时静默回退默认 */
  }
  return "account"
}
const activeTab = ref<OptionsTab>(loadStoredTab())
watch(activeTab, (v) => {
  try {
    window.localStorage.setItem(TAB_STORAGE_KEY, v)
  } catch {
    /* ignore */
  }
})

const version = computed(() => {
  try {
    return chrome.runtime.getManifest().version
  } catch {
    return "0.0.1"
  }
})

// 切换开关 class
const toggleCls = (on: boolean) => [
  "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors",
  on ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
]
const toggleKnobCls = (on: boolean) => [
  "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform translate-y-0.5",
  on ? "translate-x-4" : "translate-x-0.5"
]

// ========== 刷新菜单内容（向 SW 发 manualRefreshAll，触发全量后端数据同步） ==========
// sidepanel 的广告/版本/通知/设置菜单走 SW 缓存（频繁开关需控频率）；
// options 业务请求（/my/道具/签到/兑换/菜单查询）直接发后端。
// 本按钮触发 SW 同步 sidepanel 那套数据；options 自身的菜单查询由组件 onMounted 直接发。
// 异步不阻塞：点击 → loading 态 → 短延时后恢复（不监听 SW 完成信号）。
// 失败静默（sendMessage 本身极少失败；即便失败也不阻塞 UI，按钮照常恢复）。
const refreshing = ref(false)
const refreshHint = ref(false)
let refreshTimer: ReturnType<typeof setTimeout> | null = null
let refreshHintTimer: ReturnType<typeof setTimeout> | null = null

const onRefreshContent = () => {
  if (refreshing.value) return
  refreshing.value = true
  try {
    chrome.runtime.sendMessage({ type: "manualRefreshAll" }).catch((e) => {
      console.warn("[options] 发送 manualRefreshAll 失败", e)
    })
  } catch (e) {
    console.warn("[options] sendMessage 异常", e)
  }
  // 短延时后恢复按钮态（不等 SW 完成）
  refreshTimer = setTimeout(() => {
    refreshing.value = false
    refreshHint.value = true
    if (refreshHintTimer) clearTimeout(refreshHintTimer)
    // 提示文案 1.5s 后淡出
    refreshHintTimer = setTimeout(() => {
      refreshHint.value = false
    }, 1500)
  }, 1500)
}

// ========== 账号个人中心 ==========
const loginDialogOpen = ref(false)

// 首次挂载：仅当 URL 带 ?from=login 且未登录时自动弹登录框
// 入口区分（2026-07-17 用户反馈）：
//   - HeaderMenu 未登录点「登录/注册」→ tabs.create(options.html?from=login) → 自动弹登录框
//   - HeaderMenu 已登录点邮箱 / 点「设置...」→ openOptionsPage（无 from）→ 不弹，直接看个人中心/设置
// 避免从「更多设置」进来的用户被强制弹登录框打扰
// useAuth 构造时已触发 loadAuth（异步），首屏 isLoggedIn 可能尚未反映 storage 真实状态；
// 这里独立查一次 storage（key 与 useAuth AUTH_KEY 一致，硬编码，未改 useAuth 导出常量）

// 全局错误捕获（稳定性红线③）：拦截 window error/unhandledrejection/console.error 入运行日志页
installGlobalCapture()
onErrorCaptured((err, _instance, info) => {
  logError(
    "vue",
    `渲染错误：${err instanceof Error ? err.message : String(err)}`,
    { info, err }
  )
  return false
})

onMounted(async () => {
  // 刷新页面重走进入逻辑：拉道具列表 + 从本地恢复使用中态
  // useSkin.init() 已在 useSkin() 调用时 onMounted 触发，会自动 loadPurchasedActive（按 customerId）
  // 但 useAuth.loadAuth 是异步的，登录态可能在首屏后才到 → 这里显式 reload 一次保证 purchased 态对齐当前 customer
  loadPurchasedActive().catch((e) =>
    console.warn("[options] loadPurchasedActive 失败", e)
  )
  loadProps()

  // 已登录则拉一次 /my 刷新积分/会员状态（本地 storage 是旧值，不联网永不更新）。
  // fetchUser 静默失败不阻断（401 由 useAuth 自动登出）；与兑换后 Promise.all([loadProps, fetchUser]) 范式一致。
  try {
    const data = await chrome.storage.local.get("tabMasterAuth")
    const stored = data?.tabMasterAuth as
      | { token?: string; user?: { id?: string } }
      | undefined
    const logged = !!(stored?.token && stored?.user?.id)
    if (logged) {
      fetchUser().catch((e) => console.warn("[options] fetchUser 失败", e))
    } else if (
      new URLSearchParams(window.location.search).get("from") === "login"
    ) {
      // 从登录页跳来但仍未登录 → 弹登录框
      loginDialogOpen.value = true
    }
  } catch (e) {
    console.warn("[options] 读取登录态失败", e)
  }
})

// 登录成功后：重新拉列表（purchased 标记变化）+ 重新加载使用中态（按新 customer）
watch(isLoggedIn, (logged) => {
  if (logged) {
    loadProps()
    loadPurchasedActive().catch((e) =>
      console.warn("[options] loadPurchasedActive 失败", e)
    )
  } else {
    // 退出登录：使用中态自动随 useSkin 监听 tabMasterAuth 变化清空，这里只刷列表
    loadProps()
  }
})

// LoginDialog 内部已调 login + fetchUser 完成登录态建立；此处仅关弹框 + toast
function onLoginSuccess(email: string) {
  loginDialogOpen.value = false
  showToast(t('options.toast.loggedIn'))
}

// 性别选择（2026-07-18 性别头像）：0=男 1=女 2=保密
// 与后端 OuuCustomer.sex 对齐；UI 文案「保密」对应后端「未知(2)」
// 用 computed 让 label 随 locale 切换响应式重渲染
const SEX_OPTIONS = computed<{ label: string; value: 0 | 1 | 2 }[]>(() => [
  { label: t('options.account.sex.male'), value: 0 },
  { label: t('options.account.sex.female'), value: 1 },
  { label: t('options.account.sex.secret'), value: 2 }
])

// 更新性别：调 /customer/update-sex，成功后 fetchUser 刷新 user.sex（storage.onChanged 自动同步 sidepanel）
// updatingSex 同时存「正在提交的值」，按钮文案变「提交中…」；与当前 sex 相同则不触发
const updatingSex = ref<0 | 1 | 2 | null>(null)
async function onUpdateSex(sex: 0 | 1 | 2) {
  if (updatingSex.value !== null) return
  if (user.value?.sex === sex) return
  updatingSex.value = sex
  try {
    await post<{ code: number; msg: string }>(API_URIS.customerUpdateSex, {
      sex
    })
    await fetchUser()
    showToast(t('options.toast.sexUpdated'))
  } catch (e) {
    // ApiError.message 已是后端 msg；NetworkError.message 是网络提示
    const msg = e instanceof Error ? e.message : t('options.toast.sexUpdateFailed')
    showToast(msg)
  } finally {
    updatingSex.value = null
  }
}

// 签到：调 /customer/checkin，成功后 fetchUser 刷新 points/todayCheckedIn
// fetchUser 写 storage.local → useAuth storage.onChanged 监听器触发 sidepanel 内存态同步
const checking = ref(false)
async function onCheckin() {
  if (checking.value || user.value?.todayCheckedIn) return
  checking.value = true
  try {
    const res = await post<{
      code: number
      msg: string
      data: { awardPoints: number; continuousDays: number; afterPoints: number }
    }>(API_URIS.checkin, {})
    const d = res.data
    showToast(tWithParams('options.toast.checkinSuccess', { points: d.awardPoints, days: d.continuousDays }))
    await fetchUser()
  } catch (e) {
    // ApiError.message 已是后端 msg（如「今日已签到」）；NetworkError.message 是网络提示
    const msg = e instanceof Error ? e.message : t('options.toast.checkinFailed')
    showToast(msg)
    // 业务错误（如已签到）也刷新一次状态，保证 UI 与后端一致
    await fetchUser()
  } finally {
    checking.value = false
  }
}

// 退出登录：先弹确认框，确认后调 useAuth.logout（清 storage → sidepanel 同步）
// 2026-07-17 用户反馈：退出统一在 options 页 + 加确认弹框（HeaderMenu 不再提供退出入口）
const logoutConfirmOpen = ref(false)
const loggingOut = ref(false)
function onLogout() {
  if (loggingOut.value) return
  logoutConfirmOpen.value = true
}
async function confirmLogout() {
  logoutConfirmOpen.value = false
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await logout()
    showToast(t('options.toast.loggedOut'))
  } catch (e) {
    console.warn("[options] 退出登录失败", e)
    showToast(t('options.toast.logoutFailed'))
  } finally {
    loggingOut.value = false
  }
}

// 跳官网 /my（带 token，官网落地后建立登录态）
function onOpenMyPage() {
  const url = buildOfficialUrl("/my", getToken())
  chrome.tabs.create({ url })
}

// ========== 主题装扮（道具商城驱动，无静态兜底） ==========
// 头像用登录邮箱，未登录用 mock 邮箱
const previewEmail = computed(
  () => user.value?.email || "preview@tabmaster.com"
)

// 背景透明度滑块：拖动即时生效（写 userBgOpacity + persist → storage.onChanged 触发 sidepanel 实时同步）
function onBgOpacityInput(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  if (Number.isFinite(v)) setBgOpacity(v)
}

// ========== 道具商城（PRD docs/coordination/2026-07-17-prop-shop.md） ==========
// 2026-07-18 改造：后端 /prop/list 改若依分页（GET 带 pageNum/pageSize/propType，返回 TableDataInfo 形状）。
// 前端二级 tab [头像框/背景图] 切 propType，分页栏 [上一页/下一页]，propList 只含当前 tab 当前页数据。
const propList = ref<PropListVO[]>([])
const loadingProps = ref(false)
const loadPropsError = ref("")

// 二级 tab（propType）：1=头像框 2=主题背景(webp) 3=主题纯色背景(CSS 值)，localStorage 持久化上次选择（key tabMasterPropTab，默认 1）
type PropTab = 1 | 2 | 3
const propSubTabs = computed<{ value: PropTab; label: string }[]>(() => [
  { value: 1, label: t('options.prop.subtab.frame') },
  { value: 2, label: t('options.prop.subtab.bg') },
  { value: 3, label: t('options.prop.subtab.solid') }
])
const PROP_TAB_STORAGE_KEY = "tabMasterPropTab"
function loadPropTab(): PropTab {
  try {
    const v = window.localStorage.getItem(PROP_TAB_STORAGE_KEY)
    if (v === "1" || v === "2" || v === "3") return Number(v) as PropTab
  } catch {
    /* localStorage 不可用时静默回退默认 */
  }
  return 1
}
const activePropTab = ref<PropTab>(loadPropTab())
// 分页状态：pageNum 当前页（1-based）、pageSize 固定 20、total 后端返回总条数
const propPageNum = ref(1)
const propPageSize = 20
const propTotal = ref(0)
// 总页数：至少 1，避免空列表时显示「第 1 / 0 页」
const propTotalPages = computed(() =>
  Math.max(1, Math.ceil(propTotal.value / propPageSize))
)
// 网格容器 ref：翻页后 scrollIntoView 滚到网格顶
const propGridRef = ref<HTMLElement | null>(null)

function onPropTabChange(t: PropTab) {
  if (activePropTab.value === t) return
  activePropTab.value = t
  try {
    window.localStorage.setItem(PROP_TAB_STORAGE_KEY, String(t))
  } catch {
    /* ignore */
  }
  // 切 tab 重置到第 1 页 + 重新拉
  propPageNum.value = 1
  loadProps()
}

async function onPropPageChange(n: number) {
  if (n < 1 || n > propTotalPages.value || n === propPageNum.value) return
  propPageNum.value = n
  await loadProps()
  // 加载完成滚到网格顶（block:'start' 贴顶）
  try {
    propGridRef.value?.scrollIntoView({ behavior: "smooth", block: "start" })
  } catch {
    /* scrollIntoView 不支持时静默 */
  }
}

// 预览态：点击「预览」才 GET /prop/{id} 取原图（省带宽）
const previewProp = ref<PropDetailVO | null>(null)
const previewLoadingId = ref<number | null>(null)
// 兑换态
const exchangingId = ref<number | null>(null)
// 使用态（点「使用」时也要取一次原图拿 resourceUrl）
const usingId = ref<number | null>(null)

// 拉列表（免登录可调；已登录后端按 token 标记 purchased）
// 2026-07-18：改若依分页 GET /prop/list?pageNum&pageSize&propType，返回 { code, msg, rows, total }
async function loadProps() {
  loadingProps.value = true
  loadPropsError.value = ""
  try {
    const res = await get<PropPageResult>(API_URIS.propList, {
      params: {
        pageNum: propPageNum.value,
        pageSize: propPageSize,
        propType: activePropTab.value
      }
    })
    const arr = Array.isArray(res.rows) ? res.rows : []
    propList.value = arr
    propTotal.value = typeof res.total === "number" ? res.total : arr.length
  } catch (e) {
    const msg = e instanceof Error ? e.message : t('options.toast.propLoadFailed')
    loadPropsError.value = msg
  } finally {
    loadingProps.value = false
  }
}

// 判断某 prop 是否处于「使用中」态（按类型读 useSkin.purchasedFrame/purchasedBg）
function isUsingProp(propId: number): boolean {
  return (
    purchasedFrame.value?.propId === propId ||
    purchasedBg.value?.propId === propId
  )
}

// 预览：取原图后弹层（头像框套示例头像；背景图铺满示例区）
async function onPreview(p: PropListVO) {
  if (previewLoadingId.value !== null) return
  previewLoadingId.value = p.id
  try {
    const res = await get<{ code: number; msg: string; data: PropDetailVO }>(
      propDetailUri(p.id)
    )
    if (res.data) previewProp.value = res.data
  } catch (e) {
    const msg = e instanceof Error ? e.message : t('options.toast.detailLoadFailed')
    showToast(msg)
  } finally {
    previewLoadingId.value = null
  }
}
function closePreview() {
  previewProp.value = null
}

// 预览弹层内「试穿 30 秒」：复用 startTryon（与列表「试穿」按钮同链路），关弹层 + toast
// 仅头像框预览弹层有此按钮（背景图预览弹层不变）；previewProp.propResourceUrl 已在 onPreview 时取到
function onPreviewTryOn() {
  if (!isLoggedIn.value) {
    loginDialogOpen.value = true
    return
  }
  const p = previewProp.value
  if (!p) return
  const url = p.propResourceUrl
  if (!url) {
    showToast(t('options.toast.tryonResourceMissing'))
    return
  }
  startTryon(p.id, p.propType, url, isCssBg(url) ? "solid" : "image")
  closePreview()
  showToast(tWithParams('options.toast.tryonStarted', { name: p.propName }))
}

// 兑换：未登录→弹登录框；已登录→POST /prop/exchange，积分不足透传后端 msg
async function onExchange(p: PropListVO) {
  if (exchangingId.value !== null) return
  if (!isLoggedIn.value) {
    loginDialogOpen.value = true
    return
  }
  exchangingId.value = p.id
  try {
    const res = await post<{
      code: number
      msg: string
      data: ExchangeResultVO
    }>(API_URIS.propExchange, { propId: p.id })
    showToast(tWithParams('options.toast.exchangeSuccess', { points: res.data.afterPoints }))
    // 刷新列表（该道具变已购）+ 刷新积分
    await Promise.all([loadProps(), fetchUser()])
  } catch (e) {
    // ApiError.message 已是后端 msg（积分不足提示语在后端常量）；NetworkError.message 是网络提示
    const msg = e instanceof Error ? e.message : t('options.toast.exchangeFailed')
    showToast(msg)
  } finally {
    exchangingId.value = null
  }
}

// 使用：已购道具，取原图 resourceUrl 后设为该类型使用中（同类型其他已购自动变未使用）
async function onUse(p: PropListVO) {
  if (usingId.value !== null) return
  if (!isLoggedIn.value) {
    loginDialogOpen.value = true
    return
  }
  usingId.value = p.id
  try {
    // 列表无 resourceUrl，需按需取详情
    const res = await get<{ code: number; msg: string; data: PropDetailVO }>(
      propDetailUri(p.id)
    )
    const url = res.data?.propResourceUrl
    if (!url) {
      showToast(t('options.toast.useResourceMissing'))
      return
    }
    if (p.propType === 1) {
      applyPurchasedFrame(p.id, url)
    } else {
      // 背景道具（webp=propType=2 / 纯色=propType=3）：按 url 是否 CSS 值决定 bgType
      applyPurchasedBg(p.id, url, isCssBg(url) ? "solid" : "image")
    }
    showToast(tWithParams('options.toast.useApplied', { name: p.propName }))
  } catch (e) {
    const msg = e instanceof Error ? e.message : t('options.toast.useFailed')
    showToast(msg)
  } finally {
    usingId.value = null
  }
}

// 恢复默认：清除全部「使用中」已购道具态（头像框+背景图回默认，清本地缓存；不清已购记录）
function onResetActive() {
  clearAllActive()
  showToast(t('options.toast.resetAll'))
}
// 仅清头像框使用中态（恢复默认头像框，不动背景图）
function onResetFrame() {
  clearPurchased("frame")
  showToast(t('options.toast.resetFrame'))
}
// 仅清背景图使用中态（恢复默认主题背景，不动头像框）
function onResetBg() {
  clearPurchased("bg")
  showToast(t('options.toast.resetBg'))
}

// ========== 试穿（PRD docs/coordination/2026-07-17-prop-shop.md §3） ==========
// 试穿：未购道具点「试穿」→ GET /prop/{id} 取原图 → startTryon（30s 倒计时，跨页同步）
// 未登录禁止试穿：头像框试穿依赖用户头像，未登录只有灰色默认剪影，框套上去无意义 → 弹登录框
const tryonLoadingId = ref<number | null>(null)

// 试穿中道具名（提示条显示）
const tryonPropName = computed(() => {
  const tp = tryonProp.value
  if (!tp) return ""
  return propList.value.find((p) => p.id === tp.propId)?.propName ?? t('options.prop.fallbackName')
})

// 某道具是否处于试穿中
function isTryingOn(propId: number): boolean {
  return tryonProp.value?.propId === propId
}

async function onTryOn(p: PropListVO) {
  if (tryonLoadingId.value !== null) return
  if (!isLoggedIn.value) {
    loginDialogOpen.value = true
    return
  }
  tryonLoadingId.value = p.id
  try {
    const res = await get<{ code: number; msg: string; data: PropDetailVO }>(
      propDetailUri(p.id)
    )
    const url = res.data?.propResourceUrl
    if (!url) {
      showToast(t('options.toast.tryonResourceMissing'))
      return
    }
    startTryon(p.id, p.propType, url, isCssBg(url) ? "solid" : "image")
    showToast(tWithParams('options.toast.tryonStarted', { name: p.propName }))
  } catch (e) {
    const msg = e instanceof Error ? e.message : t('options.toast.tryonFailed')
    showToast(msg)
  } finally {
    tryonLoadingId.value = null
  }
}

// ========== toast（useToast 单例，与 sidepanel 共用） ==========
const { toastMsg, showToast } = useToast()

// ========== 语言切换（i18n-en-support §6.1 D2：独立 key __locale__） ==========
// languagePref 是 select v-model：'auto' / 'zh-CN' / 'en-US'
// 初始值从 storage 读（getUserLocalePref），用户切换时 setUserLocale 写 storage + 立即 setLocale
// 响应式 currentLocale 改动 → 模板里 t() 自动重渲染（无需 reload）
const languagePref = ref<LocalePref>('auto')
// 当前生效 locale（响应式 ref），与 HeaderMenu.languageHint 统一实现，避免重复逻辑分歧
const currentLocaleRef = getLocaleRef()
const languageHint = computed(() => {
  // 提示语：当前生效 locale + 是否跟随浏览器
  const cur = currentLocaleRef.value === 'zh-CN'
    ? t('settings.language.zh-CN')
    : t('settings.language.en-US')
  return languagePref.value === 'auto'
    ? `${t('settings.language.auto')} · ${cur}`
    : cur
})
async function onLanguageChange() {
  const pref = languagePref.value
  await setUserLocale(pref)
  showToast(t('toast.languageChanged'))
}

// 初始化 locale + 读 storage 恢复 select 选中态（在 onMounted 内统一触发，与 sidepanel 一致）
// 不阻塞首屏渲染：storage.get 几 ms，失败静默回退默认 zh-CN
initLocale().catch((e) => console.warn('[options] initLocale 失败', e))
getUserLocalePref().then((pref) => {
  languagePref.value = pref
}).catch((e) => console.warn('[options] getUserLocalePref 失败', e))
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background-color: #f9fafb;
}
html.dark body {
  background-color: #111827;
}

/* 与 sidepanel 同步的字号/暗色规则（让 options 也响应同一份 settings） */
:root.fs-normal {
  font-size: 16px;
}
:root.fs-large {
  font-size: 17.5px;
}
:root.fs-xlarge {
  font-size: 19px;
}
:root.font-mono body {
  font-family: "SF Mono", "Cascadia Code", Consolas, Monaco, monospace;
}
.help-trigger {
  background: transparent;
  border: none;
  padding: 0;
  cursor: help;
  display: inline-flex;
}
</style>
