<template>
  <!-- root 不设 bg：白色底移到 body（见 <style>），让 body::before 的主题背景图（z-index:0）
       能从 root 的透明间隙透出来。relative + z-index:1 把内容层抬到 ::before 之上（参考 options.vue）。 -->
  <div class="h-screen flex flex-col text-gray-900 overflow-hidden text-sm relative" style="z-index: 1;">
    <div v-if="toastMsg" class="fixed top-3 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 bg-gray-800 text-white text-xs rounded-full shadow-lg pointer-events-none">{{ toastMsg }}</div>

    <!-- Storage Panel -->
    <StoragePanel v-if="showStorage" @close="showStorage = false" @cleared="showToast('已清理')" />

    <!-- Header - 聚焦中 -->
    <div v-if="focusMode === 'focusing'" class="flex items-center justify-between px-3 py-2 border-b border-gray-200 shrink-0">
      <div class="flex items-center gap-1.5">
        <!-- 不重复显示标题（浏览器侧边栏标题栏已显示 manifest name），直接顶左显示标签数 -->
        <span class="text-xs text-gray-900 dark:text-gray-100 whitespace-nowrap shrink-0">{{ focusingTabs.length }} 个标签</span>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="px-2 py-1 text-xs rounded border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1"
          @click="exitFocusingWithToast">
          聚焦模式 关闭
        </button>
        <button
          :class="['p-1 rounded transition-colors',
            popover.isOpen('focus-help')
              ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100'
              : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600 dark:hover:bg-gray-700']"
          @click.stop="toggleFocusHelpFromEvent">
          <HelpCircle :size="14" />
        </button>
        <!-- 已登录态头像（含装扮头像框）：点按跳 options 个人中心；头像框走 useSkin 单例 purchasedFrameUrl/tryonFrameUrl -->
        <button
          v-if="isLoggedIn"
          class="shrink-0 rounded-full hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-700 transition-shadow"
          title="个人中心"
          @click.stop="openOptionsForUser"
        >
          <AvatarWithFrame :email="userEmail" :size="32" />
        </button>
        <HeaderMenu
          @open-storage="showStorage = true"
          @reload="reloadPanel"
          @show-toast="showToast"
        />
      </div>
    </div>

    <!-- Header - 普通/选择态 -->
    <div v-else class="flex items-center justify-between px-3 py-2 border-b border-gray-200 shrink-0">
      <div class="flex items-center gap-1.5">
        <!-- 不重复显示标题（浏览器侧边栏标题栏已显示 manifest name），直接顶左显示标签数 -->
        <span class="text-xs text-gray-900 dark:text-gray-100 whitespace-nowrap shrink-0">{{ tabs.length }} 个标签</span>
      </div>
      <div class="flex items-center gap-2">
        <!-- 标签导入导出（下拉）：未开启红点/失败⚠；下拉项含手动备份/自动备份/导入/导出/管理 -->
        <div class="relative shrink-0">
          <button
            ref="backupMenuBtnRef"
            class="relative inline-flex items-center gap-1 min-h-[32px] px-2 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            :aria-expanded="popover.isOpen('backup-menu')"
            aria-haspopup="menu"
            :title="backupMenuTooltip"
            @click.stop="toggleBackupMenu"
          >
            <Shield :size="14" :class="backupBadgeKind === 'off' ? 'text-gray-400 dark:text-gray-500' : 'text-blue-600 dark:text-blue-400'" />
            <span class="whitespace-nowrap">标签导入导出</span>
            <ChevronDown :size="11" class="text-gray-400" />
            <!-- 角标：未阅引导红点（进页点「知道了」消除）；失败⚠异常提醒 -->
            <span
              v-if="!backupSvc.firstVisitAcked.value"
              class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-800"
              aria-hidden="true"
            ></span>
            <AlertTriangle
              v-else-if="backupBadgeKind === 'error'"
              :size="10"
              class="absolute -top-1 -right-1 text-red-500 bg-white dark:bg-gray-800 rounded-full ring-1 ring-white dark:ring-gray-800"
              aria-hidden="true"
            />
          </button>
          <!-- 下拉菜单 -->
          <div
            v-if="popover.isOpen('backup-menu')"
            data-popover-content
            class="fixed z-[60] w-[180px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
            :style="backupMenuPos"
            @click.stop
          >
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="onBackupMenuExport">
              <Download :size="12" />导出
            </button>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="onBackupMenuImport">
              <Upload :size="12" />导入
            </button>
            <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="onBackupMenuManual">
              <Save :size="12" />手动备份
            </button>
            <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            <!-- 打开管理页：未阅引导时带小红点（进页点「知道了」后消除） -->
            <button class="relative flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="onBackupMenuManage">
              <FolderOpen :size="12" />打开管理页
              <span
                v-if="!backupSvc.firstVisitAcked.value"
                class="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500"
                aria-hidden="true"
              ></span>
            </button>
          </div>
        </div>
        <!-- 聚焦模式（下拉合并）：按钮 + 帮助合并；选择态显示取消 -->
        <div class="relative shrink-0">
          <button v-if="focusMode === 'normal'"
            ref="focusMenuBtnRef"
            :class="['inline-flex items-center gap-1 min-h-[32px] px-2 py-1 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
              !SUPPORTS_FOCUS_MODE ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700']"
            :disabled="!SUPPORTS_FOCUS_MODE"
            :title="!SUPPORTS_FOCUS_MODE ? '聚焦模式需要 Chrome 102+ 或 Edge 102+' : '聚焦模式：只显示选中的标签，其余隐藏'"
            @click.stop="toggleFocusMenu"
          >
            <Zap :size="13" />
            <span>聚焦</span>
            <ChevronDown :size="11" class="text-gray-400" />
          </button>
          <button v-else-if="focusMode === 'selecting'"
            class="px-2 py-1 text-xs text-blue-600 hover:underline"
            @click="exitFocusSelectMode">
            取消选择
          </button>
          <div
            v-if="focusMode === 'normal' && popover.isOpen('focus-menu')"
            data-popover-content
            class="fixed z-[60] w-[160px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
            :style="focusMenuPos"
            @click.stop
          >
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="onFocusMenuEnter">
              <Zap :size="12" />开启聚焦模式
            </button>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="onFocusMenuHelp">
              <HelpCircle :size="12" />聚焦说明
            </button>
          </div>
        </div>
        <!-- 已登录态头像（含装扮头像框）：点按跳 options 个人中心；头像框走 useSkin 单例 purchasedFrameUrl/tryonFrameUrl -->
        <button
          v-if="isLoggedIn"
          class="shrink-0 rounded-full hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-700 transition-shadow"
          title="个人中心"
          @click.stop="openOptionsForUser"
        >
          <AvatarWithFrame :email="userEmail" :size="32" />
        </button>
        <HeaderMenu
          @open-storage="showStorage = true"
          @reload="reloadPanel"
          @show-toast="showToast"
        />
      </div>
    </div>

    <!-- 选择态顶部提示 -->
    <div v-if="focusMode === 'selecting'" class="bg-blue-50 border-b border-blue-200 px-4 py-2.5 flex items-center gap-2">
      <Zap :size="14" class="text-blue-600" />
      <div class="flex-1">
        <p class="text-xs text-blue-800 font-medium">
          选择要聚焦的标签 · 已选 {{ focusSelectedIds.length }}
        </p>
        <p v-if="isFirstFocusTime" class="text-[10px] text-blue-600 mt-0.5">
          💡 用搜索、排序快速找到要聚焦的标签，勾选后点底部按钮
        </p>
      </div>
      <span v-if="protectedTabCount > 0" class="text-[10px] text-blue-500">
        已自动排除 {{ protectedTabCount }} 个系统页面
      </span>
    </div>

    <!-- 聚焦态顶部提示 -->
    <FocusBanner v-if="focusMode === 'focusing'" :focused-count="focusingTabs.length" :hidden-count="hiddenGroupTabCount" />

    <!-- 版本更新提示（强制更新最顶，不可关闭；非强制可关闭） -->
    <ErrorBoundary v-if="shouldShowUpdateBanner" scope="update">
      <UpdateBanner :info="updateInfo" @dismiss="onDismissUpdate" @go-update="openUpdatePage" />
    </ErrorBoundary>

    <!-- 登录引导 Banner -->
    <ErrorBoundary v-if="showLoginBanner" scope="login">
      <!-- 样板阶段内联；批量做登录弹窗时抽成独立 LoginBanner.vue 组件 -->
      <div
        class="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-3 py-1.5 flex items-center gap-2 cursor-pointer"
        @click="handleLoginBannerClick"
      >
        <button
          class="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          @click.stop="handleLoginBannerDismiss"
        >
          <X :size="12" />
        </button>
        <LogIn :size="12" class="shrink-0 text-gray-500 dark:text-gray-400" />
        <div class="flex-1 min-w-0">
          <p class="text-xs text-gray-600 dark:text-gray-300 truncate">
            {{ t('loginBanner.title') }}
          </p>
        </div>
        <ChevronRight :size="12" class="shrink-0 text-gray-400 dark:text-gray-500" />
      </div>
    </ErrorBoundary>

    <!-- 消息通知条（登录引导下、NavTabs 上；普通态显示）-->
    <ErrorBoundary v-if="focusMode === 'normal'" scope="notice">
      <NoticeBar
        :notices="notices"
        :unread-count="unreadCount"
        @mark-read="markNoticeRead"
      />
    </ErrorBoundary>

    <!-- Nav Tabs（仅普通态显示） -->
    <div v-if="focusMode === 'normal'" class="flex items-center border-b border-gray-100 px-1.5 shrink-0">
      <template v-for="nav in navItems" :key="nav.key">
        <!-- 首页：文字 + 竖三点收进同一容器，让三点明确归属首页且紧贴文字 -->
        <div v-if="nav.key === 'home'" class="flex items-center -mb-px flex-1 justify-center">
          <button
            :class="['px-1.5 py-1.5 text-xs text-center whitespace-nowrap transition-colors border-b-2', activeNav === 'home' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800']"
            @click="activeNav = 'home'">
            {{ nav.label }}
          </button>
          <!-- 竖三点菜单：紧贴首页文字右侧（专属首页，点击弹显示选项） -->
          <button
            v-if="activeNav === 'home'"
            ref="homeOptionsTriggerRef"
            class="p-1 rounded shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600"
            title="显示选项"
            @click.stop="popover.toggle('home-toolbar-options', homeOptionsTriggerRef)">
            <MoreVertical :size="14" />
          </button>
        </div>
        <button
          v-else
          :class="['px-1.5 py-1.5 text-xs text-center whitespace-nowrap flex-1 transition-colors border-b-2 -mb-px', activeNav === nav.key ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800']"
          @click="activeNav = nav.key">
          {{ nav.label }}
          <span v-if="nav.key === 'later' && laterTabs.length" class="ml-1 shrink-0 whitespace-nowrap text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded-full">{{ laterTabs.length }}</span>
        </button>
      </template>
    </div>

    <!-- 三点菜单下拉 -->
    <Teleport to="body">
      <div
        v-if="popover.isOpen('home-toolbar-options')"
        :style="homeOptionsMenuPos"
        data-popover-content
        class="fixed z-[60] w-[176px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
        @click.stop>
        <label class="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" @click="toggleHomeSearchVisible">
          <span class="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
            <CheckSquare v-if="settings.homeSearchVisible" :size="12" class="text-blue-600" />
          </span>
          <span>显示搜索</span>
        </label>
        <label class="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" @click="toggleHomeTagBarVisible">
          <span class="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
            <CheckSquare v-if="settings.homeTagBarVisible" :size="12" class="text-blue-600" />
          </span>
          <span>显示标记</span>
        </label>
      </div>
    </Teleport>

    <!-- 搜索提示：搜索框隐藏但有搜索词时显示 -->
    <div v-if="activeNav === 'home' && focusMode === 'normal' && !settings.homeSearchVisible && search.trim()" class="px-3 py-2 border-b border-gray-100 shrink-0">
      <div class="inline-flex items-center gap-2 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700">
        <span>搜索中：{{ search.trim() }}</span>
        <button class="hover:text-blue-900" @click="search = ''">
          <X :size="12" />
        </button>
      </div>
    </div>

    <!-- Search（普通/选择态显示） -->
    <div v-if="activeNav === 'home' && (focusMode === 'normal' || focusMode === 'selecting') && settings.homeSearchVisible" class="px-3 py-2 border-b border-gray-100 shrink-0">
      <SearchBox v-model="search" />
    </div>

    <!-- Tag Bar（仅普通态显示） -->
    <TagBar
      v-if="activeNav === 'home' && focusMode === 'normal' && settings.homeTagBarVisible"
      :tags="customTags"
      :active-tags="activeTagFilters"
      :tab-count-by-tag="tabCountByTag"
      :total-count="tabs.length"
      @apply="activeTagFilters = $event"
      @add-tag="handleAddTag"
      @remove-tag="handleRemoveTag"
      @rename-tag="handleRenameTag"
      @reorder-tag="reorderCustomTags"
    />

    <!-- Toolbar（普通/选择态显示）。批量按钮只看 isBatchMode 本身，不被聚焦选择态污染 -->
    <AppToolbar
      v-if="(activeNav === 'home' && focusMode === 'normal') || focusMode === 'selecting'"
      :is-later-page="false"
      :view-mode="viewMode" :sort-mode="sortMode" :can-go-back="canGoBack" :can-go-forward="canGoForward"
      @view-change="setViewMode" @sort-change="setSortMode"
      @close-unpinned="openCleanupUnpinned" @close-others="openCleanupOthers" @close-frozen-discarded="openCleanupFrozenDiscarded"
      @detect-duplicates="openDetectDuplicates" @detect-unused="openDetectUnused"
      @go-back="goBack" @go-forward="goForward"
      @new-tab="openNewTab"
      @refresh-current="refreshCurrentTab"
    />

    <!-- 固定标签置顶栏（普通/选择态显示搜索结果时不显示，聚焦态显示） -->
    <PinnedBar
      v-if="focusMode === 'focusing' || (!search.trim() && activeNav === 'home')"
      :items="focusMode === 'focusing' ? focusingPinnedItems : pinnedItems"
      @activate="activateTab"
      @close="(id) => focusMode === 'focusing' ? handleFocusTabClosed(id) : closeAction(id)"
      @later="(id) => { if (focusMode !== 'focusing') openLater(id) }"
      @copy="(url) => { if (focusMode !== 'focusing') copyUrl(url) }"
      @refresh="(id) => { if (focusMode !== 'focusing') refresh(id) }"
      @pin="(id) => { if (focusMode !== 'focusing') togglePin(id) }"
      @update-number="(id, n) => { if (focusMode !== 'focusing') { updateTabNumber(id, n); onNumberSet(n) } }"
      @remove-tag="(id, tag) => { if (focusMode !== 'focusing') removeTabTag(id, tag) }"
      @ctx="(e, item) => { if (focusMode !== 'focusing') onContextMenu(e, item) }"
      @move="(sourceId, targetId) => handlePinnedMove(sourceId, targetId)"
    />

    <!-- 搜索结果（普通/选择态显示，仅首页） -->
    <SearchResults
      v-if="activeNav === 'home' && (focusMode === 'normal' || focusMode === 'selecting') && search.trim()"
      :pinned="searchPinned" :open="searchOpen" :closed="searchClosed"
      :query="search.trim()" :custom-tags="customTags"
      @activate="activateTab($event); search = ''"
      @restore="restoreTab($event); search = ''"
      @later="openLater" @close="closeAction" @copy="copyUrl"
      @toggle-tag="toggleTabTag" @add-tag="handleAddTag"
    />

    <!-- 正常内容区（普通/选择态）。home 普通态用 overflow-hidden 让普通标签容器自己内部滚（抽屉效果），其它页正常滚 -->
    <div v-else-if="focusMode !== 'focusing'" ref="contentRef" :class="['flex-1 min-h-0 px-3 py-2 flex flex-col', (activeNav === 'home' && focusMode === 'normal') ? 'overflow-hidden' : 'overflow-y-auto', scrolled ? 'pb-16' : 'pb-2']" @scroll="onContentScroll">
      <!-- 稍后页面 -->
      <ErrorBoundary v-if="activeNav === 'later'" scope="later" @reload="reloadPanel">
        <LaterList :items="laterTabs" @remove="removeLater" @open="restoreTab($event)" />
      </ErrorBoundary>
      <!-- 分组页面 -->
      <ErrorBoundary v-else-if="activeNav === 'groups'" scope="groups" @reload="reloadPanel">
        <GroupListPage
          :groups="groups"
          :ungrouped-tabs="ungroupedTabs"
          :guide-shown="tabGroupsGuideShown"
          @activate-tab="activateTab"
          @close-tab="closeTab"
          @create-group="onGroupCreate"
          @add-to-group="onGroupAdd"
          @rename-group="(id, name) => updateGroup(id, { title: name })"
          @change-group-color="(id, color) => updateGroup(id, { color })"
          @toggle-group-collapse="(id, collapsed) => updateGroup(id, { collapsed })"
          @ungroup="ungroupAll"
          @close-group-tabs="closeGroupTabs"
          @mark-guide-shown="markTabGroupsGuideShown"
        />
      </ErrorBoundary>
      <!-- 历史页面 -->
      <ErrorBoundary v-else-if="activeNav === 'history'" scope="history" @reload="reloadPanel">
        <HistoryList
          :items="recentlyClosed"
          :has-permission="historyHasPermission"
          :history-items="historyItems"
          :history-loading="historyLoading"
          :history-supported="historySupported"
          @restore="onRestoreFromHistory"
          @remove="removeRecentlyClosed"
          @request-permission="requestHistoryPermission"
          @revoke-permission="revokeHistoryPermission"
          @delete-history="deleteHistoryUrl"
        />
      </ErrorBoundary>
      <!-- 小工具页面 -->
      <ErrorBoundary v-else-if="activeNav === 'tools'" scope="tools" @reload="reloadPanel">
        <ToolsList v-if="toolsView === 'list'" @select="onToolSelect" />
        <NotesTool v-else-if="toolsView === 'notes'" @back="toolsView = 'list'" />
        <TimestampTool v-else-if="toolsView === 'timestamp'" @back="toolsView = 'list'" />
      </ErrorBoundary>
      <!-- 首页 -->
      <ErrorBoundary v-else scope="home" @reload="reloadPanel">
        <!-- 普通标签列表：抽屉式容器——撑满剩余空间，批量按钮固定顶部，标签区内部滚动 -->
        <div v-if="activeNav === 'home' && focusMode === 'normal'" class="flex-1 min-h-0 mt-1 flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <!-- 批量按钮组：固定在容器顶部，不随标签滚动 -->
          <div class="shrink-0 flex items-center gap-1 px-2 py-1.5 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
            <span v-if="isBatchMode" class="text-[11px] text-blue-600 dark:text-blue-400 ml-1">已选 {{ selectedIds.length }}</span>
            <div class="flex-1"></div>
            <template v-if="!isBatchMode">
              <button
                :class="['flex items-center gap-1 px-2 py-0.5 text-xs rounded border transition-colors', 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-900']"
                @click.stop="onBatchButtonClick"
              >
                <CheckSquare :size="11" />
                批量
              </button>
            </template>
            <template v-else>
              <label class="flex items-center gap-1 px-2 py-0.5 text-xs rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer">
                <input
                  ref="selectAllCheckboxRef"
                  type="checkbox"
                  class="w-4 h-4 cursor-pointer accent-blue-600"
                  :checked="selectAllState === 'all'"
                  @click.stop="onToggleSelectAll"
                />
                全选
              </label>
              <button
                ref="batchMenuTriggerRef"
                :class="['flex items-center gap-1 px-2 py-0.5 text-xs rounded border transition-colors', popover.isOpen('normal-batch') ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50']"
                @click.stop="onBatchMenuClick"
              >
                更多
                <ChevronDown :size="10" class="text-gray-400" />
              </button>
              <button
                :class="['flex items-center gap-1 px-2 py-0.5 text-xs rounded border transition-colors', 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50']"
                @click.stop="exitBatch"
              >
                <XSquare :size="11" />
                取消批量
              </button>
            </template>
          </div>

          <!-- 标签内容区：容器内部滚动（抽屉），撑满批量按钮下方的剩余空间 -->
          <div ref="homeTabsScrollRef" class="flex-1 overflow-y-auto p-3" @scroll="onContentScroll">
            <template v-if="viewMode === 'tree'">
              <TreeGuideBanner @open="treeGuideOpen = true" />
              <TabTreeItem v-for="node in treeNodes" :key="node.item.id"
                :item="node.item" :children="node.children" :depth="0"
                :is-batch="isBatchMode"
                :is-checked="selectedIds.includes(node.item.id)"
                @activate="activateTab(node.item.id)" @activate-child="activateTab($event)"
                @close="closeAction(node.item.id)" @close-child="closeAction($event)"
                @toggle="toggleSelect(node.item.id)"
                @toggle-child="toggleSelect($event)"
              />
            </template>
            <template v-else>
              <div v-if="!normalItems.length" class="text-center text-gray-400 text-xs py-12">暂无标签</div>
              <template v-if="sortMode === 'domain' && viewMode !== 'icon'">
                <div v-for="group in domainGroups" :key="group.domain" class="mb-3">
                  <p class="text-[10px] font-bold text-gray-400 tracking-wide mb-1">{{ group.displayName }}</p>
                  <div :class="gridClass">
                    <component :is="itemComponent" v-for="item in group.items" :key="item.id"
                      :data-tabid="item.id"
                      :item="item" :is-batch="isBatchMode" :is-checked="selectedIds.includes(item.id)" :custom-tags="customTags" :is-prev="item.id === prevActiveTabId"
                      @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)"
                      @later="openLater(item.id)" @close="closeAction(item.id)" @copy="copyUrl(item.url)"
                      @toggle-tag="toggleTabTag(item.id, $event)" @remove-tag="removeTabTag(item.id, $event)" @add-tag="handleAddTag"
                      @update-number="(n) => { updateTabNumber(item.id, n); onNumberSet(n) }"
                      @refresh="refresh(item.id)" @pin="togglePin(item.id)"
                      @contextmenu.prevent="onContextMenu($event, item)" />
                  </div>
                </div>
              </template>
              <template v-else>
                <div :class="gridClass">
                  <component :is="itemComponent" v-for="item in sortedNormalItems" :key="item.id"
                    :data-tabid="item.id"
                    :item="item" :is-batch="isBatchMode" :is-checked="selectedIds.includes(item.id)" :custom-tags="customTags" :is-prev="item.id === prevActiveTabId"
                    @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)"
                    @later="openLater(item.id)" @close="closeAction(item.id)" @copy="copyUrl(item.url)"
                    @toggle-tag="toggleTabTag(item.id, $event)" @remove-tag="removeTabTag(item.id, $event)" @add-tag="handleAddTag"
                    @update-number="(n) => { updateTabNumber(item.id, n); onNumberSet(n) }"
                    @refresh="refresh(item.id)" @pin="togglePin(item.id)"
                    @contextmenu.prevent="onContextMenu($event, item)" />
                </div>
              </template>
            </template>
          </div>
        </div>

        <!-- 非首页普通态（聚焦选择态等）保留原结构 -->
        <template v-else>
          <template v-if="viewMode === 'tree'">
            <!-- 树形视图常驻黄条引导 -->
            <TreeGuideBanner @open="treeGuideOpen = true" />
            <TabTreeItem v-for="node in treeNodes" :key="node.item.id"
              :item="node.item" :children="node.children" :depth="0"
              :is-batch="focusMode === 'selecting' ? true : isBatchMode"
              :is-checked="focusMode === 'selecting' ? focusSelectedIds.includes(node.item.id) : selectedIds.includes(node.item.id)"
              @activate="activateTab(node.item.id)" @activate-child="activateTab($event)"
              @close="closeAction(node.item.id)" @close-child="closeAction($event)"
              @toggle="focusMode === 'selecting' ? toggleSelectFocusTab(node.item.id) : toggleSelect(node.item.id)"
              @toggle-child="focusMode === 'selecting' ? toggleSelectFocusTab($event) : toggleSelect($event)"
            />
          </template>
          <template v-else>
            <div v-if="!normalItems.length" class="text-center text-gray-400 text-xs py-12">暂无标签</div>
            <template v-if="sortMode === 'domain' && viewMode !== 'icon'">
              <div v-for="group in domainGroups" :key="group.domain" class="mb-3">
                <p class="text-[10px] font-bold text-gray-400 tracking-wide mb-1">{{ group.displayName }}</p>
                <div :class="gridClass">
                  <component :is="itemComponent" v-for="item in group.items" :key="item.id"
                    :data-tabid="item.id"
                    :item="item" :is-batch="focusMode === 'selecting' ? true : isBatchMode" :is-checked="focusMode === 'selecting' ? focusSelectedIds.includes(item.id) : selectedIds.includes(item.id)" :custom-tags="customTags" :is-prev="item.id === prevActiveTabId"
                    @activate="activateTab(item.id)" @toggle="focusMode === 'selecting' ? toggleSelectFocusTab(item.id) : toggleSelect(item.id)"
                    @later="openLater(item.id)" @close="closeAction(item.id)" @copy="copyUrl(item.url)"
                    @toggle-tag="toggleTabTag(item.id, $event)" @remove-tag="removeTabTag(item.id, $event)" @add-tag="handleAddTag"
                    @update-number="(n) => { updateTabNumber(item.id, n); onNumberSet(n) }"
                    @refresh="refresh(item.id)" @pin="togglePin(item.id)"
                    @contextmenu.prevent="onContextMenu($event, item)" />
                </div>
              </div>
            </template>
            <template v-else>
              <div :class="gridClass">
                <component :is="itemComponent" v-for="item in sortedNormalItems" :key="item.id"
                  :data-tabid="item.id"
                  :item="item" :is-batch="focusMode === 'selecting' ? true : isBatchMode" :is-checked="focusMode === 'selecting' ? focusSelectedIds.includes(item.id) : selectedIds.includes(item.id)" :custom-tags="customTags" :is-prev="item.id === prevActiveTabId"
                  @activate="activateTab(item.id)" @toggle="focusMode === 'selecting' ? toggleSelectFocusTab(item.id) : toggleSelect(item.id)"
                  @later="openLater(item.id)" @close="closeAction(item.id)" @copy="copyUrl(item.url)"
                  @toggle-tag="toggleTabTag(item.id, $event)" @remove-tag="removeTabTag(item.id, $event)" @add-tag="handleAddTag"
                  @update-number="(n) => { updateTabNumber(item.id, n); onNumberSet(n) }"
                  @refresh="refresh(item.id)" @pin="togglePin(item.id)"
                  @contextmenu.prevent="onContextMenu($event, item)" />
              </div>
            </template>
          </template>
        </template>
      </ErrorBoundary>
    </div>

    <!-- 聚焦态内容区 - 只显示聚焦标签 -->
    <div v-else ref="contentRef" :class="['flex-1 overflow-y-auto min-h-0 px-3 py-2', scrolled ? 'pb-16' : 'pb-2']" @scroll="onContentScroll">
      <ErrorBoundary scope="focus" @reload="reloadPanel">
        <div v-if="!focusingNormalItems.length && !focusingPinnedItems.length" class="text-center text-gray-400 text-xs py-12">暂无标签</div>
        <!-- 聚焦态只显示平铺列表，简化操作 -->
        <div class="flex flex-col gap-1">
          <TabListItem v-for="item in focusingNormalItems" :key="item.id"
            :data-tabid="item.id"
            :item="item" :is-batch="false" :is-checked="false" :custom-tags="customTags" :is-prev="item.id === prevActiveTabId"
            @activate="activateTab(item.id)" @close="handleFocusTabClosed(item.id)"
          />
        </div>
      </ErrorBoundary>
    </div>

    <!-- 底部统计栏（普通/选择态显示） -->
    <FooterStats v-if="focusMode !== 'focusing'" :stats="stats" :active-filter="activeFilter" @filter="activeFilter = $event" />

    <LaterDialog :open="laterDialogOpen" @close="laterDialogOpen = false" @confirm="confirmLater" />
    <TreeGuideDialog :open="treeGuideOpen" @close="treeGuideOpen = false" />

    <!-- 批量菜单 -->
    <Teleport to="body">
      <div
        v-if="popover.isOpen('normal-batch')"
        :style="batchMenuPos"
        data-popover-content
        class="fixed z-[60] w-[192px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
        @click.stop
        @mouseleave="batchActiveSubmenu = null"
      >
        <p class="px-3 py-1 text-[10px] text-gray-400 font-medium uppercase tracking-wide">选择</p>
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="invertSelection">
          <RefreshCw :size="12" />
          反选
        </button>
        <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
        <p class="px-3 py-1 text-[10px] text-gray-400 font-medium uppercase tracking-wide">操作</p>
        <button
          :disabled="!selectedIds.length"
          :class="['flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left transition-colors', selectedIds.length ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed']"
          @click="onMenuBatchClose"
        >
          <X :size="12" />
          <span class="flex-1">关闭 {{ selectedIds.length }} 个</span>
        </button>
        <button
          :disabled="!selectedIds.length"
          :class="['flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left transition-colors', selectedIds.length ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed']"
          @click="onMenuBatchLater"
        >
          <Clock :size="12" class="text-amber-500" />
          <span class="flex-1">加入稍后处理</span>
        </button>
        <button
          :disabled="!selectedIds.length"
          :class="['flex items-center justify-between w-full px-3 py-1.5 text-xs text-left transition-colors', selectedIds.length ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed', batchActiveSubmenu === 'group' && 'bg-gray-50 dark:bg-gray-700']"
          @mouseenter="onEnterGroupSubmenu"
        >
          <span class="flex items-center gap-2"><Folder :size="12" class="text-blue-500" />加入分组</span>
          <ChevronLeft :size="11" class="text-gray-400" />
        </button>
        <button
          :disabled="!selectedIds.length"
          :class="['flex items-center justify-between w-full px-3 py-1.5 text-xs text-left transition-colors', selectedIds.length ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed', batchActiveSubmenu === 'tag' && 'bg-gray-50 dark:bg-gray-700']"
          @mouseenter="onEnterTagSubmenu"
        >
          <span class="flex items-center gap-2"><Tag :size="12" class="text-purple-500" />添加标记</span>
          <ChevronLeft :size="11" class="text-gray-400" />
        </button>
      </div>

      <!-- 批量子菜单：加入分组 -->
      <div
        v-if="popover.isOpen('normal-batch') && batchActiveSubmenu === 'group'"
        :style="batchGroupSubmenuPos"
        data-popover-content
        class="fixed z-[60] w-[180px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
        @click.stop
        @mouseenter="batchActiveSubmenu = 'group'"
      >
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="onMenuCreateNewGroup">
          <Plus :size="12" />新建分组...
        </button>
        <div v-if="groups.length" class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
        <button
          v-for="g in groups" :key="g.id"
          class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="onMenuPickGroup(g.id)"
        >
          <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: groupColorHex(g.color) }"></span>
          <span class="flex-1 truncate">{{ g.title || '未命名分组' }}</span>
        </button>
      </div>

      <!-- 统一标记选择浮层（右键/汉堡菜单/批量/卡片内嵌共用） -->
      <TagSelectPopover
        id="right-click-tag-picker"
        :currentTags="rightClickTab?.tags ?? []"
        :allTags="customTags"
        mode="single"
        placement="bottom-left"
        @toggle="toggleRightClickTabTag"
        @create="handleAddTag"
      />
      <TagSelectPopover
        id="batch-tag-picker"
        :currentTags="batchSelectedCommonTags"
        :allTags="customTags"
        mode="batch"
        :batch-tab-tags="batchSelectedTabTags"
        placement="bottom-right"
        @apply="batchApplyTag"
        @remove="batchRemoveTag"
        @create="handleAddTagForBatch"
      />

    </Teleport>

    <!-- 清理菜单：直接关闭类的二次确认 -->
    <ConfirmDialog
      :open="!!cleanupConfirm"
      :title="cleanupConfirm?.title ?? ''"
      :message="cleanupConfirm?.message"
      :hint="cleanupConfirm?.hint"
      :confirm-text="cleanupConfirm?.confirmText"
      danger
      @cancel="cleanupConfirm = null"
      @confirm="runCleanupConfirm"
    />

    <!-- 首次绑标记告知弹窗（替代一晃没的 toast） -->
    <ConfirmDialog
      :open="tagNoticeOpen"
      :title="TAG_NOTICE_TITLE"
      :message="TAG_NOTICE_MSG"
      :highlight="TAG_NOTICE_HIGHLIGHT"
      :hint="TAG_NOTICE_HINT"
      center-title
      confirm-text="知道啦"
      cancel-text="关闭"
      @cancel="tagNoticeOpen = false"
      @confirm="tagNoticeOpen = false"
    />

    <!-- 设置编号成功后的用法说明弹窗（明确告知 Mac/Windows 怎么按） -->
    <ConfirmDialog
      :open="numberSetNotice !== null"
      :title="numberSetNotice?.title ?? ''"
      :message="numberSetNotice?.message ?? ''"
      :highlight="numberSetNotice?.highlight"
      center-title
      confirm-text="知道啦"
      :cancel-text="undefined"
      @confirm="numberSetNotice = null"
      @cancel="numberSetNotice = null"
    />

    <!-- 清理菜单：检测类的预览清单 -->
    <DetectReviewDialog
      :open="!!detectDialog"
      :mode="detectDialog?.mode ?? 'duplicates'"
      :groups="detectDialog?.mode === 'duplicates' ? detectDialog?.groups : undefined"
      :items="detectDialog?.mode === 'unused' ? detectDialog?.items : undefined"
      :threshold-ms="detectDialog?.mode === 'unused' ? detectDialog?.thresholdMs : undefined"
      @cancel="detectDialog = null"
      @confirm="runDetectConfirm"
      @change-threshold="onChangeUnusedThreshold"
    />

    <!-- 聚焦模式组件 -->
    <FocusHelpBubble />
    <FocusSelectBar v-if="focusMode === 'selecting'" :selected-count="focusSelectedIds.length" @cancel="exitFocusSelectMode" @start-focus="startFocusingWithToast" />

    <!-- 右键菜单 -->
    <TabContextMenu :tab="ctxMenu?.tab ?? null" :x="ctxMenu?.x ?? 0" :y="ctxMenu?.y ?? 0"
      @action="handleCtxAction" @close="ctxMenu = null" />
    <!-- 编号选择浮层（右键→设置编号） -->
    <div v-if="popover.isOpen('number-picker') && numberPickerTab" data-popover-content class="fixed z-[60] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl w-[176px] p-2.5"
      :style="numberPickerStyle" @click.stop>
      <p class="text-[11px] font-medium text-gray-600 dark:text-gray-300 mb-2">快捷键编号</p>
      <div class="flex gap-1.5">
        <button v-for="n in 4" :key="n"
          :class="['flex-1 h-7 text-xs rounded border transition-colors',
            numberPickerTab?.number === n
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600']"
          @click="pickNumber(n)">{{ n }}</button>
      </div>
      <button v-if="numberPickerTab?.number" class="mt-1.5 text-[10px] text-gray-400 hover:text-red-500 w-full text-left" @click="clearNumberFromPicker">清除编号</button>
    </div>
    <button v-if="scrolled && focusMode !== 'focusing'" class="fixed bottom-10 right-3 z-30 p-1.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all" @click="scrollToTop" title="回到顶部">
      <ChevronUp :size="14" />
    </button>

    <!-- 聚焦模式全屏蒙层 + 中央关闭按钮 -->
    <div v-if="focusMode === 'focusing'" class="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center">
      <button
        class="px-8 py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-base font-semibold rounded-lg shadow-2xl flex items-center gap-2 transition-colors"
        @click="exitFocusingWithToast"
        title="退出聚焦模式">
        <XCircle :size="20" />
        关闭聚焦
      </button>
    </div>

    <!-- 广告浮层（底部 10 秒弹层，Teleport 到 body）-->
    <ErrorBoundary scope="ad">
      <AdBanner
        :ad="currentAd"
        @click="onAdClickFromBanner"
        @dismiss="onAdDismissFromBanner"
        @expired="onAdExpiredFromBanner"
      />
    </ErrorBoundary>

  </div>
</template>

<script setup lang="ts">
import { isDev } from "~lib/env"
import { useToast } from "~composables/useToast"
import { safeSet } from "~lib/safeStorage"
import { installGlobalCapture, logError } from "~composables/useLogger"
import { ref, computed, watch, nextTick, onMounted, onUnmounted, provide, onErrorCaptured } from "vue"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, HelpCircle, Zap, CheckSquare, XSquare, X, RefreshCw, Folder, FolderOpen, Plus, Clock, Tag, XCircle, LogIn, MoreHorizontal, MoreVertical, Shield, AlertTriangle, Save, Settings, Upload, Download } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import UpdateBanner from "~components/UpdateBanner.vue"
import AdBanner from "~components/AdBanner.vue"
import NoticeBar from "~components/NoticeBar.vue"
import { useAuth } from "~composables/useAuth"
import { useSkin } from "~composables/useSkin"
import { useVersionCheck } from "~composables/useVersionCheck"
import { useAd } from "~composables/useAd"
import { useNotice } from "~composables/useNotice"
import TagSelectPopover from "~components/TagSelectPopover.vue"
import { useTabManager } from "~composables/useTabManager"
import { useTabActions } from "~composables/useTabActions"
import { useTabStats } from "~composables/useTabStats"
import { useTabTree } from "~composables/useTabTree"
import { useFocusMode, SUPPORTS_FOCUS_MODE } from "~composables/useFocusMode"
import { useTabGroups, SUPPORTS_TAB_GROUPS, TAB_GROUP_ID_NONE } from "~composables/useTabGroups"
import { useSettings } from "~composables/useSettings"
import { useHistory } from "~composables/useHistory"
import { usePopoverManager, installGlobalPopoverClose } from "~composables/usePopoverManager"
import { computePopoverPos, computeFlyoutPos } from "~lib/popoverPosition"
import { sortTabs, groupByDomain } from "~lib/sortUtils"
import { t } from "~lib/i18n"
import HeaderMenu from "~components/HeaderMenu.vue"
import TabTileItem from "~components/TabTileItem.vue"
import TabListItem from "~components/TabListItem.vue"
import TabIconItem from "~components/TabIconItem.vue"
import TabTreeItem from "~components/TabTreeItem.vue"
import AppToolbar from "~components/AppToolbar.vue"
import CreateGroupDialog from "~components/CreateGroupDialog.vue"
import LaterList from "~components/LaterList.vue"
import LaterDialog from "~components/LaterDialog.vue"
import FooterStats from "~components/FooterStats.vue"
import SearchResults from "~components/SearchResults.vue"
import SearchBox from "~components/SearchBox.vue"
import TagBar from "~components/TagBar.vue"
import StoragePanel from "~components/StoragePanel.vue"
import TabContextMenu from "~components/TabContextMenu.vue"
import PinnedBar from "~components/PinnedBar.vue"
import TreeGuideBanner from "~components/TreeGuideBanner.vue"
import TreeGuideDialog from "~components/TreeGuideDialog.vue"
import ConfirmDialog from "~components/ConfirmDialog.vue"
import DetectReviewDialog from "~components/DetectReviewDialog.vue"
import { detectDuplicates as detectDuplicatesFn, detectUnused as detectUnusedFn, UNUSED_THRESHOLDS, type DuplicateGroup } from "~composables/useCleanup"
import FocusHelpBubble from "~components/FocusHelpBubble.vue"
import FocusSelectBar from "~components/FocusSelectBar.vue"
import FocusBanner from "~components/FocusBanner.vue"
import GroupListPage from "~components/GroupListPage.vue"
import GroupBadge from "~components/GroupBadge.vue"
import HistoryList from "~components/HistoryList.vue"
import ToolsList from "~components/tools/ToolsList.vue"
import NotesTool from "~components/tools/NotesTool.vue"
import TimestampTool from "~components/tools/TimestampTool.vue"
import ErrorBoundary from "~components/ErrorBoundary.vue"
import AvatarWithFrame from "~components/AvatarWithFrame.vue"
import type { TabItem } from "~types/tab"
import { pinyin } from "pinyin-pro"
import { isMac } from "~lib/platform"

const {
  tabs, laterTabs, customTags, recentlyClosed, treeParentMap, prevActiveTabId, activeTabId,
  canGoBack, canGoForward, goBack, goForward,
  closeTab, activateTab, restoreTab, moveToLater, removeLater, removeRecentlyClosed,
  updateTabNumber, updateTabTags, addTabTag, removeTabTag, toggleTabTag, addCustomTag, removeCustomTag, renameCustomTag, reorderCustomTags,
  closeUnpinned, closeOthers, closeFrozenDiscarded,
  groupTab,
  updateTreeParent, moveTabToIndex,
} = useTabManager()

// ========== 登录引导 Banner 逻辑 ==========
const showLoginBanner = ref(false)
const { isLoggedIn, user, sessionExpired, clearSessionExpired, fetchUser } = useAuth()
// 装扮主题（背景图 + 头像框状态）：onMounted 自动从 storage 恢复持久化主题到 :root；
// storage.onChanged 已在 useSkin 内注册，options 改主题这里自动同步，无需额外监听
useSkin()

// 头像点击：跳 options 个人中心（与 HeaderMenu「邮箱行」入口一致）
const openOptionsForUser = () => {
  try { chrome.runtime.openOptionsPage() } catch (e) { console.warn("openOptionsPage failed", e) }
}

// 备份服务单例（用于 header 角标状态：未开启红点 / 失败⚠ / 已开启无角标）
const backupSvc = useBackupService()
const backupBadgeKind = computed<"off" | "error" | "ok">(() => {
  if (!backupSvc.enabled.value) return "off"
  const dirLost = backupSvc.dirMeta.value.permission === "prompt" || backupSvc.dirMeta.value.permission === "denied"
  if (backupSvc.state.value.lastBackupError || dirLost) return "error"
  return "ok"
})
/** 顶部备份状态文案：未开启 / 备份中 / 失败 / 已开启·上次X·N快照 */
const backupSnapshotCount = computed(() => backupSvc.snapshots.value.length || backupSvc.state.value.snapshotCount || 0)
const backupStatusText = computed(() => {
  if (backupSvc.isBackingUp.value) return backupSvc.lastProgress.value || "正在备份…"
  if (backupBadgeKind.value === "off") return "未开启备份 · 崩溃将丢标签"
  if (backupBadgeKind.value === "error") {
    const dirLost = backupSvc.dirMeta.value.permission === "prompt" || backupSvc.dirMeta.value.permission === "denied"
    return dirLost ? "备份文件夹需重新授权" : "上次备份失败 · 点管理重试"
  }
  const last = backupSvc.state.value.lastBackupAt
  const lastLabel = last ? `上次 ${fmtBackupRelative(last)}` : "尚未备份"
  return `${lastLabel} · ${backupSnapshotCount.value} 快照`
})
function fmtBackupRelative(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return "刚刚"
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  return `${Math.floor(diff / 86_400_000)} 天前`
}
function openBackupManage() {
  try {
    chrome.tabs.create({ url: chrome.runtime.getURL("tabs/backup.html") })
  } catch (e) {
    console.warn("[sidepanel] 打开备份管理失败", e)
    showToast("打开备份管理失败")
  }
}

// ========== 顶部「标签导入导出」下拉菜单 ==========
const backupMenuBtnRef = ref<HTMLElement | null>(null)
const backupMenuPos = computed(() => {
  if (!popover.isOpen("backup-menu") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 180, height: 320 }, "bottom-right")
  return { left: `${p.left}px`, top: `${p.top}px` }
})
/** 按钮 hover 说明：未开启/失败/已开启 给不同文案，让用户一眼知道是干啥的 */
const backupMenuTooltip = computed(() => {
  if (backupBadgeKind.value === "off") return "标签导入导出 · 崩溃找回 / 多档还原 / 兼容导入（未开启）"
  if (backupBadgeKind.value === "error") return "标签导入导出 · 上次备份失败，点开重试"
  return "标签导入导出 · 崩溃找回 / 多档还原 / 兼容导入"
})
function toggleBackupMenu(e: MouseEvent) {
  popover.toggle("backup-menu", e.currentTarget as HTMLElement)
}
function closeBackupMenu() { popover.close("backup-menu") }
/** 跳独立页并带 action + page query：action 开弹框（一次性），page 定位页面（刷新可恢复） */
function openBackupPage(action: "manual" | "import" | "export" | "manage") {
  // action → page 映射：manual/export/manage 在概览页、import 跳导入管理
  // 2026-07-28：manage 改跳概览（用户从侧栏「打开管理页」默认看概览，非列表）
  const pageMap: Record<"manual" | "import" | "export" | "manage", "overview" | "list" | "import"> = {
    manual: "overview",
    import: "import",
    export: "overview",
    manage: "overview",
  }
  const page = pageMap[action]
  try {
    chrome.tabs.create({ url: chrome.runtime.getURL(`tabs/backup.html?action=${action}&page=${page}`) })
  } catch (e) {
    console.warn("[sidepanel] 打开备份页失败", e)
    showToast("打开备份页失败")
  }
}
function onBackupMenuManual() { closeBackupMenu(); openBackupPage("manual") }
function onBackupMenuImport() { closeBackupMenu(); openBackupPage("import") }
function onBackupMenuExport() { closeBackupMenu(); openBackupPage("export") }
function onBackupMenuManage() { closeBackupMenu(); openBackupPage("manage") }

// ========== 顶部「聚焦」下拉菜单 ==========
const focusMenuBtnRef = ref<HTMLElement | null>(null)
const focusMenuPos = computed(() => {
  if (!popover.isOpen("focus-menu") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 160, height: 80 }, "bottom-right")
  return { left: `${p.left}px`, top: `${p.top}px` }
})
function toggleFocusMenu(e: MouseEvent) {
  popover.toggle("focus-menu", e.currentTarget as HTMLElement)
}
function onFocusMenuEnter() {
  popover.close("focus-menu")
  enterFocusSelectMode()
}
function onFocusMenuHelp() {
  // 关 focus-menu，开 focus-help 气泡（复用既有 toggleFocusHelpFromEvent 用的 'focus-help' id）
  popover.close("focus-menu")
  if (focusMenuBtnRef.value) {
    popover.open("focus-help", focusMenuBtnRef.value)
  }
}
// 用户邮箱（未登录为空字符串，AvatarWithFrame 仅在 isLoggedIn 时渲染，此处仅传值）
const userEmail = computed(() => user.value?.email ?? "")
// 版本检查（静默失败，不阻塞 UI；强制更新顶部弹框）
const { updateInfo, shouldShowBanner: shouldShowUpdateBanner, dismiss: dismissUpdate, openUpdatePage } = useVersionCheck()
function onDismissUpdate() { dismissUpdate() }
// 广告（底部 10 秒弹层，只读 SW 缓存不发请求：每天最多3次+点击/关闭按adId当天不再展示）
const { currentAd, markShown, onAdClick, onAdDismiss, onAdExpired } = useAd()
function onAdClickFromBanner() { onAdClick() }
function onAdDismissFromBanner() { onAdDismiss() }
function onAdExpiredFromBanner() { onAdExpired() }
// 消息通知（首页通知条，静默失败，按 id 记已读）
const { notices, unreadCount, markAllRead: markAllNoticeRead, markRead: markNoticeRead } = useNotice()

// 加载 Banner 状态
async function loadBannerState() {
  const data = await chrome.storage.local.get("tabMasterBannerState")
  const state = data.tabMasterBannerState
  if (!state || typeof state !== "object") {
    showLoginBanner.value = !isLoggedIn.value
    return
  }
  const dismissedAt = typeof state.dismissedAt === "number" ? state.dismissedAt : null
  if (isLoggedIn.value) {
    showLoginBanner.value = false
  } else if (!dismissedAt) {
    showLoginBanner.value = true
  } else {
    // 当天关闭不显示，次日（自然日）重新显示
    showLoginBanner.value = new Date(dismissedAt).toDateString() !== new Date().toDateString()
  }
}

// 点击 Banner - 跳 options 页登录（2026-07-17：登录入口迁移至 options 页）
function handleLoginBannerClick() {
  try { chrome.runtime.openOptionsPage() } catch (e) { console.warn("openOptionsPage failed", e) }
}

// 关闭 Banner
async function handleLoginBannerDismiss() {
  showLoginBanner.value = false
  await chrome.storage.local.set({
    tabMasterBannerState: { dismissedAt: Date.now() },
  })
}

// 登录状态变化 -> 同步 banner 显示（登录后隐藏，退出后按频控重新判断）
watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    showLoginBanner.value = false
  } else {
    loadBannerState()
  }
})

// 会话过期（401）-> toast 提示重新登录（区别于主动退出）
watch(sessionExpired, (expired) => {
  if (expired) {
    showToast(t('login.expired'))
    clearSessionExpired()
  }
})

// 广告出现 -> 计展示次数（频率上限控制，不打扰用户）
watch(currentAd, (ad) => {
  if (ad) {
    markShown()
  }
})

const stats = computed(() => useTabStats(tabs).value)

const treeNodes = useTabTree(tabs, treeParentMap)

// 浏览历史（可选权限 chrome.history）—— 渐进式：未授权只显最近关闭，授权后多一个「浏览历史」分段
const {
  hasPermission: historyHasPermission,
  historyItems,
  loading: historyLoading,
  supported: historySupported,
  requestPermission: requestHistoryPermission,
  revokePermission: revokeHistoryPermission,
  loadHistory,
  deleteHistoryUrl,
} = useHistory()

// 标签分组
const {
  groups,
  ungroupedTabs,
  guideShown: tabGroupsGuideShown,
  loadGroups,
  createGroup,
  addToGroup,
  removeFromGroup,
  updateGroup,
  ungroupAll,
  closeGroupTabs,
  getGroupById,
  markGuideShown: markTabGroupsGuideShown,
  updateGroupTabs,
} = useTabGroups(tabs)

// 提供 getGroupById 给子组件
provide('getGroupById', getGroupById)
provide('tabGroups', groups)
// 提供给 TabTreeItem 递归子节点 —— 让深层子节点能正确判断自己是否被选中
provide('isTabSelected', (id: number) => focusMode.value === 'selecting' ? focusSelectedIds.value.includes(id) : selectedIds.value.includes(id))

// 聚焦模式
const {
  mode: focusMode,
  selectedTabIds: focusSelectedIds,
  focusingTabs,
  hiddenGroupId,
  selectableTabs: focusSelectableTabs,
  protectedTabCount,
  isFirstTime: isFirstFocusTime,
  toastEvent: focusToastEvent,
  enterSelectMode: enterFocusSelectMode,
  exitSelectMode: exitFocusSelectMode,
  toggleSelectTab,
  startFocusing,
  exitFocusing,
  onFocusTabClosed,
  onNewTabInFocus,
  restoreFocusState,
} = useFocusMode(tabs)

// 计算灰色分组中的标签数量
const hiddenGroupTabCount = computed(() => {
  if (!hiddenGroupId.value) return 0
  return tabs.value.filter(t => t.groupId === hiddenGroupId.value).length
})

// 聚焦标签中的固定标签和普通标签
const focusingPinnedItems = computed(() => focusingTabs.value.filter(t => t.pinned))
const focusingNormalItems = computed(() => focusingTabs.value.filter(t => !t.pinned))

// 监听聚焦 toast 事件
watch(focusToastEvent, (event) => {
  if (!event) return
  switch (event.type) {
    case 'group_recollapsed':
      showToast('聚焦模式中，分组已重新折叠')
      break
    case 'tab_added_to_focus':
      showToast(`已加入聚焦标签：${event.tabTitle.slice(0, 20)}`)
      break
    case 'all_focus_closed':
      showToast('所有聚焦标签已关闭，已退出聚焦模式')
      break
    case 'enter_focus':
      showToast(`进入聚焦模式，${event.count} 个标签`)
      break
    case 'exit_focus':
      showToast('已退出聚焦模式')
      break
  }
  // 重置事件
  focusToastEvent.value = null
})

// 聚焦问号气泡现在由 PopoverManager（id='focus-help'）统一管理 —— 见 FocusHelpBubble.vue
// 之前散落在这里的 helpBubblePos / openHelpBubble / closeHelpBubble 全部移除
const toggleFocusHelpFromEvent = (e: MouseEvent) => {
  popover.toggle("focus-help", e.currentTarget as HTMLElement)
}

const startFocusingWithToast = async () => {
  const result = await startFocusing()
  if (result.needActivateFirst && result.firstTabId !== undefined) {
    const tab = tabs.value.find(t => t.id === result.firstTabId)
    showToast(`已切换到聚焦标签：${tab?.title?.slice(0, 20) || ''}`)
  }
  // 检查是否全是固定标签
  const allPinned = focusingTabs.value.every(t => t.pinned)
  if (allPinned) {
    showToast('固定标签本来就不会被折叠，本次聚焦实际未折叠任何标签')
  }
}

const exitFocusingWithToast = async () => {
  await exitFocusing()
}

const toggleSelectFocusTab = (id: number) => {
  const focusTabIds = focusSelectableTabs.value.map(t => t.id)
  if (focusTabIds.includes(id)) {
    toggleSelectTab(id)
    // 检查是否超过7个
    if (focusSelectedIds.value.length > 7) {
      showToast('建议聚焦 4-7 个标签，效果更好')
    }
  }
}

const handleNewTabInFocus = (t: chrome.tabs.Tab) => {
  if (focusMode.value === 'focusing' && t.id !== undefined) {
    onNewTabInFocus(t.id)
  }
}

// 树形操作 handler：provide 给 TabTreeItem（HoverCard 用）
provide('treeAction', (action: string, item: TabItem, data?: any) => {
  switch (action) {
    case 'later': openLater(item.id); break
    case 'copy': copyUrl(item.url); break
    case 'refresh': refresh(item.id); break
    case 'pin': togglePin(item.id); break
    case 'updateNumber': updateTabNumber(item.id, data); onNumberSet(data); break
    case 'removeTag': removeTabTag(item.id, data); break
    case 'addTag': {
      // 树形视图 hover card 的「标记」：data 是标记按钮 DOM，用它的位置打开右键标记选择器
      rightClickTabId.value = item.id
      const rect = data instanceof HTMLElement ? data.getBoundingClientRect() : new DOMRect(0, 0, 0, 0)
      popover.openAtRect('right-click-tag-picker', rect)
      break
    }
  }
})

// 树形拖拽 handler：provide 给 TabTreeItem
provide('treeDrag', (dragId: number, targetId: number, pos: 'before' | 'into' | 'after') => {
  if (pos === 'into') {
    updateTreeParent(dragId, targetId)
  } else {
    // 同级调整：通过 Chrome API 移动标签位置
    const targetTab = tabs.value.find(t => t.id === targetId)
    const targetIdx = targetTab ? tabs.value.indexOf(targetTab) : -1
    if (targetIdx >= 0) moveTabToIndex(dragId, pos === 'before' ? targetIdx : targetIdx + 1)
    // 同时清除拖动项的自定义 parent（还原到同级）
    const targetParent = treeParentMap.value[String(targetId)] ?? null
    updateTreeParent(dragId, targetParent)
  }
})

const activeNav = ref("home")
const viewMode = ref(localStorage.getItem("viewMode") || "list")
const sortMode = ref(localStorage.getItem("sortMode") || "lastAccessed")
const search = ref("")
const isBatchMode = ref(false)
const selectedIds = ref<number[]>([])
const activeFilter = ref("all")
// 当 activeFilter 对应的状态计数变 0 时，自动切回"全部"（避免关闭最后一个该状态标签后卡空列表）
watch([stats, activeFilter], () => {
  if (activeFilter.value === 'all') return
  const curStat = stats.value.find(s => s.key === activeFilter.value)
  if (curStat && curStat.value === 0) {
    activeFilter.value = 'all'
  }
})
const activeTagFilters = ref<string[]>([])
// 监听 customTags 变化，清理 activeTagFilters 中不存在的标记
watch(customTags, (newTags) => {
  activeTagFilters.value = activeTagFilters.value.filter(tag => newTags.includes(tag))
})
// 处理添加标记
const handleAddTag = async (tag: string) => {
  if (!!isDev) {
    console.debug("[tab-master:tags] handleAddTag 被调用", { tag, currentCustomTags: customTags.value })
  }
  const success = await addCustomTag(tag)
  if (success) {
    if (!!isDev) {
      console.debug("[tab-master:tags] handleAddTag 成功，准备 showToast")
    }
    showToast(`已添加标记「${tag}」`)
  } else if (customTags.value.length >= 15) {
    showToast('已达15个标记上限')
  } else if (customTags.value.includes(tag.trim())) {
    showToast('该标记已存在')
  }
}
// 处理删除标记
const handleRemoveTag = async (tag: string) => {
  await removeCustomTag(tag)
  // 从 activeTagFilters 中移除
  activeTagFilters.value = activeTagFilters.value.filter(t => t !== tag)
  showToast(`已删除标记「${tag}」`)
}
// 处理重命名标记
const handleRenameTag = async (oldTag: string, newTag: string) => {
  await renameCustomTag(oldTag, newTag)
  // 更新 activeTagFilters
  const idx = activeTagFilters.value.indexOf(oldTag)
  if (idx !== -1) {
    activeTagFilters.value.splice(idx, 1, newTag)
  }
  showToast(`已将「${oldTag}」重命名为「${newTag}」`)
}
const laterDialogOpen = ref(false)
const pendingLaterTabId = ref<number | null>(null)
const { settings, updateSetting } = useSettings()  // 初始化设置：加载 storage + 应用主题/字号/字体/密度
installGlobalPopoverClose()  // 安装全局浮层关闭监听（点空白/Esc 关）
const popover = usePopoverManager()
const batchMenuTriggerRef = ref<HTMLElement | null>(null)
const homeOptionsTriggerRef = ref<HTMLElement | null>(null)

// 首页工具栏选项菜单位置：bottom-right 让菜单从竖三点右下展开（右边对齐三点），
// 不挡住「首页」文字和三点按钮本身（避免盖住触发点导致无法点别处关闭）。
const homeOptionsMenuPos = computed(() => {
  if (!popover.isOpen('home-toolbar-options') || !popover.activeAnchorRect.value) return { left: '0px', top: '0px' }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 176, height: 80 }, 'bottom-right')
  return { left: `${p.left}px`, top: `${p.top}px` }
})

// 切换首页搜索框显示
const toggleHomeSearchVisible = () => {
  updateSetting('homeSearchVisible', !settings.value.homeSearchVisible)
}
// 切换首页标记栏显示
const toggleHomeTagBarVisible = () => {
  updateSetting('homeTagBarVisible', !settings.value.homeTagBarVisible)
}
const selectAllCheckboxRef = ref<HTMLInputElement | null>(null)
const batchActiveSubmenu = ref<"group" | "tag" | null>(null)
const batchSubmenuAnchorRect = ref<DOMRect | null>(null)
const showStorage = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const { toastMsg, showToast } = useToast()
const ctxMenu = ref<{ tab: TabItem; x: number; y: number } | null>(null)
// 右键 picker —— 用 PopoverManager 统一管理 open/close，自身只保留"对哪个 tab"
const rightClickTabId = ref<number | null>(null)

const rightClickTab = computed(() => rightClickTabId.value !== null ? tabs.value.find(t => t.id === rightClickTabId.value) ?? null : null)
const numberPickerTab = computed(() => rightClickTabId.value !== null && popover.isOpen('number-picker') ? tabs.value.find(t => t.id === rightClickTabId.value) ?? null : null)

// 右键 picker 位置：从 PopoverManager 的 activeAnchorRect 读出（右键时合成的 1x1 rect）
const rightClickTagPickerStyle = computed(() => {
  if (!popover.isOpen('right-click-tag-picker') || !popover.activeAnchorRect.value) return { left: '0px', top: '0px' }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 288, height: 240 }, 'bottom-left')
  return { left: `${p.left}px`, top: `${p.top}px` }
})
const numberPickerStyle = computed(() => {
  if (!popover.isOpen('number-picker') || !popover.activeAnchorRect.value) return { left: '0px', top: '0px' }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 176, height: 100 }, 'bottom-left')
  return { left: `${p.left}px`, top: `${p.top}px` }
})

const pickNumber = (n: number) => {
  if (rightClickTabId.value === null) return
  updateTabNumber(rightClickTabId.value, n)
  onNumberSet(n)
  popover.close('number-picker')
  rightClickTabId.value = null
}
const clearNumberFromPicker = () => {
  if (rightClickTabId.value !== null) {
    updateTabNumber(rightClickTabId.value, 0)
    showToast('编号已清除')
  }
  popover.close('number-picker')
  rightClickTabId.value = null
}

// ===== 统一标记选择浮层相关 =====
// 右键菜单/汉堡菜单用：切换单个标签的标记
const toggleRightClickTabTag = (tag: string) => {
  if (!rightClickTabId.value) return
  const tab = tabs.value.find(t => t.id === rightClickTabId.value)
  if (!tab) return
  const newTags = tab.tags.includes(tag)
    ? tab.tags.filter(t => t !== tag)
    : [...tab.tags, tag]
  updateTabTags(rightClickTabId.value, newTags)
}

// 批量模式用：计算选中标签的 tags 数组
const batchSelectedTabTags = computed(() => {
  return selectedIds.value
    .map(id => tabs.value.find(t => t.id === id)?.tags ?? [])
})

// 批量模式用：计算选中标签的共同标记（交集）
const batchSelectedCommonTags = computed(() => {
  const tagsArray = batchSelectedTabTags.value
  if (tagsArray.length === 0) return []
  return tagsArray.reduce((acc, tags) => acc.filter(t => tags.includes(t)), tagsArray[0])
})

// 批量模式用：应用标记到所有选中标签
const batchApplyTag = (tag: string) => {
  batchAddTags([tag])
  showToast(`已为 ${selectedIds.value.length} 个标签添加标记「${tag}」`)
}

// 批量模式用：从所有选中标签移除标记
const batchRemoveTag = (tag: string) => {
  const ids = [...selectedIds.value]
  for (const id of ids) {
    const cur = tabs.value.find(t => t.id === id)?.tags ?? []
    updateTabTags(id, cur.filter(t => t !== tag))
  }
  showToast(`已从 ${ids.length} 个标签移除标记「${tag}」`)
}

// 批量模式用：新建标记后自动应用到所有选中标签
const handleAddTagForBatch = async (tag: string) => {
  const success = await addCustomTag(tag)
  if (success) {
    showToast(`已添加标记「${tag}」`)
    batchApplyTag(tag)
  } else if (customTags.value.length >= 15) {
    showToast('已达15个标记上限')
  } else if (customTags.value.includes(tag.trim())) {
    showToast('该标记已存在')
  }
}

// 修改：批量菜单「标记」项 hover 时打开统一的 TagSelectPopover
const onEnterTagSubmenu = (e: MouseEvent) => {
  if (!selectedIds.value.length) return
  onBatchEnterSubmenuRow("tag", e.currentTarget as HTMLElement)
  // 延迟打开，确保 submenu 状态先切换
  setTimeout(() => {
    if (batchActiveSubmenu.value === "tag") {
      popover.open("batch-tag-picker", e.currentTarget as HTMLElement)
    }
  }, 0)
}

// ===== 工具栏「清理」菜单 =====
// 详见 PRD: docs/prd/cleanup-toolbar.md

// 直接关闭类的待确认状态
type CleanupKind = "unpinned" | "others" | "frozenDiscarded"
interface CleanupConfirmState {
  kind: CleanupKind
  title: string
  message: string
  hint?: string
  confirmText: string
  /** 要关的标签数（提前算好，避免确认时数据已变） */
  count: number
}
const cleanupConfirm = ref<CleanupConfirmState | null>(null)

// 检测类的弹窗状态
type DetectDialogState =
  | { mode: "duplicates"; groups: DuplicateGroup[] }
  | { mode: "unused"; items: TabItem[]; thresholdMs: number }
const detectDialog = ref<DetectDialogState | null>(null)

// === 直接关闭类入口 ===
const openCleanupUnpinned = () => {
  const targets = tabs.value.filter(t => !t.pinned)
  if (!targets.length) { showToast("没有非固定标签可关闭"); return }
  const pinnedCount = tabs.value.length - targets.length
  cleanupConfirm.value = {
    kind: "unpinned",
    title: "确认关闭非固定标签",
    message: `将关闭 ${targets.length} 个未固定标签${pinnedCount > 0 ? `，保留 ${pinnedCount} 个固定标签` : ''}`,
    hint: "关闭的标签可用 Ctrl+Shift+T 逐个恢复",
    confirmText: `确认关闭 ${targets.length} 个`,
    count: targets.length,
  }
}
const openCleanupOthers = () => {
  // closeOthers 后台用 t.active 判定；这里口径保持一致
  const targets = tabs.value.filter(t => !t.active)
  if (!targets.length) { showToast("没有其他标签可关闭"); return }
  const pinnedCount = tabs.value.filter(t => t.pinned && !t.active).length
  cleanupConfirm.value = {
    kind: "others",
    title: "确认关闭其他标签",
    message: `将关闭 ${targets.length} 个标签，保留当前激活的页面${pinnedCount > 0 ? `（注：固定标签也会被关）` : ''}`,
    hint: "关闭的标签可用 Ctrl+Shift+T 逐个恢复",
    confirmText: `确认关闭 ${targets.length} 个`,
    count: targets.length,
  }
}
const openCleanupFrozenDiscarded = () => {
  const targets = tabs.value.filter(t => t.frozen || t.discarded)
  if (!targets.length) { showToast("没有已冻结/已舍弃的标签"); return }
  cleanupConfirm.value = {
    kind: "frozenDiscarded",
    title: "确认关闭已冻结/已舍弃标签",
    message: `将关闭 ${targets.length} 个被浏览器冻结或舍弃的标签。这些标签当前不占内存，但仍占用列表空间`,
    hint: "关闭的标签可用 Ctrl+Shift+T 逐个恢复",
    confirmText: `确认关闭 ${targets.length} 个`,
    count: targets.length,
  }
}
// 用户点「确认」时调原来的批量关 API（不重写逻辑，复用 useTabManager 已实现好的）
const runCleanupConfirm = async () => {
  const conf = cleanupConfirm.value
  if (!conf) return
  cleanupConfirm.value = null
  if (conf.kind === "unpinned") await closeUnpinned()
  else if (conf.kind === "others") await closeOthers()
  else await closeFrozenDiscarded()
  showToast(`已关闭 ${conf.count} 个标签 · Ctrl+Shift+T 可恢复`)
}

// === 检测类入口 ===
const openDetectDuplicates = () => {
  const groups = detectDuplicatesFn(tabs.value)
  if (!groups.length) { showToast("未检测到重复标签"); return }
  detectDialog.value = { mode: "duplicates", groups }
}
const openDetectUnused = () => {
  const defaultMs = UNUSED_THRESHOLDS[0].ms // 默认 1 天
  const items = detectUnusedFn(tabs.value, defaultMs)
  detectDialog.value = { mode: "unused", items, thresholdMs: defaultMs }
}
// 用户切换阈值时重新筛选
const onChangeUnusedThreshold = (ms: number) => {
  if (detectDialog.value?.mode !== "unused") return
  const items = detectUnusedFn(tabs.value, ms)
  detectDialog.value = { mode: "unused", items, thresholdMs: ms }
}
// 用户点「关闭选中 N 个」
const runDetectConfirm = async (ids: number[]) => {
  detectDialog.value = null
  if (!ids.length) return
  let success = 0, failed = 0
  for (const id of ids) {
    try { await closeTab(id); success++ } catch { failed++ }
  }
  showToast(failed > 0
    ? `已关闭 ${success} 个，${failed} 个失败 · Ctrl+Shift+T 可恢复`
    : `已关闭 ${success} 个标签 · Ctrl+Shift+T 可恢复`,
  )
}


const navItems = [
  { key: "home", label: "首页" },
  { key: "later", label: "稍后处理" },
  { key: "groups", label: "分组" },
  { key: "history", label: "历史" },
  { key: "tools", label: "小工具" },
]

// 小工具子路由：list 显示工具卡片，notes/timestamp 切到对应工具
const toolsView = ref<'list' | 'notes' | 'timestamp'>('list')
// 切走 tools tab 时重置回列表（避免回来时停在子工具）
watch(activeNav, (v) => {
  if (v !== 'tools') toolsView.value = 'list'
})
const onToolSelect = (t: 'notes' | 'timestamp') => {
  toolsView.value = t
}

// 首次给标签绑定标记时，弹告知确认框（替代一晃没的 toast，文案通俗化）
// 用 storage.onChanged 监听而非 watch ref —— useTabManager 非单例，各入口（TagPicker/右键/
// 批量/HoverCard 删除/useTabActions）调的是各自实例的 updateTabTags，ref 跨实例不共享；
// 但都写同一个 storage key，监听 storage 才能全覆盖
// tagsSessionNoticeShown 存 storage.local：用户首次绑标记只提示一次，清缓存才重置
const tagNoticeOpen = ref(false)
const TAG_NOTICE_TITLE = "标记关联提醒"
const TAG_NOTICE_MSG = "重启浏览器、或关闭标签后重新打开同一个网页，之前绑的标记可能对不上。"
const TAG_NOTICE_HIGHLIGHT = "标记靠标签 ID 关联，同一网址每次打开 ID 都不同，所以可能对不上。"
const TAG_NOTICE_HINT = "建议开启自动备份或用导出保存标记。备份/导入能找回标记名并关联到恢复的标签（按网址匹配），标记名已存在则跳过。"

// 设置编号成功后的用法说明弹窗（明确告知 Mac/Windows 怎么按，强制用户确认）
// 用弹窗而非 toast：toast 一晃而过，用户记不住键位；弹窗需点确认，确保用户看到用法
const numberSetNotice = ref<{ title: string; message: string; highlight?: string } | null>(null)
const onNumberSet = (n: number) => {
  if (n > 0) {
    const howTo = isMac
      ? `Mac 电脑：同时按住「Option ⌥」键和「Shift ⇧」键不放，再按数字「${n}」`
      : `Windows 电脑：同时按住「Alt」键和「Shift」键不放，再按数字「${n}」`
    numberSetNotice.value = {
      title: `快捷键编号 ${n} 已设置`,
      message: `已为该标签设置编号 ${n}。\n\n${howTo}，即可快速切换到该标签。\n\n三个键要一起按住，在浏览器任意页面都能触发。编号仅支持 1-4。`,
    }
  } else {
    showToast('编号已清除')
  }
}
const onTagsSessionNoticeChanged = (changes: { [k: string]: chrome.storage.StorageChange }, area: string) => {
  if (area !== "local" || !changes.tagsSessionNoticeShown) return
  if (changes.tagsSessionNoticeShown.newValue === true) {
    tagNoticeOpen.value = true
  }
}

// 标签操作动作层（单标签 + 批量）：refresh/copyUrl/togglePin/close/batchClose 等
// 必须在 showToast 定义之后调用（内部传 showToast 回调）
const {
  refresh, copyUrl, togglePin, toggleMute, duplicate, close: closeAction, closeOthers: closeOthersAction,
  addToGroupSingle, removeFromGroupSingle, newGroupSingle,
  batchClose, batchLater, batchAddToGroup, batchNewGroup,
} = useTabActions({ showToast, addToGroup, removeFromGroup, createGroup })
// 分组：创建/加入后给 toast 反馈（可感知原则·事后）
const onGroupCreate = async (tabIds: number[], name: string, color: string) => {
  const id = await createGroup(tabIds, name, color)
  showToast(id !== null ? `已创建「${name || '未命名分组'}」分组（${tabIds.length} 个标签）` : "创建分组失败，详见运行日志")
}
const onGroupAdd = async (tabIds: number[], groupId: number) => {
  await addToGroup(tabIds, groupId)
  showToast(`已将 ${tabIds.length} 个标签加入分组`)
}
// 历史页：恢复一条最近关闭的标签
const onRestoreFromHistory = (url: string) => {
  restoreTab(url)
  showToast("已恢复标签")
}
const setViewMode = (v: string) => {
  viewMode.value = v
  localStorage.setItem("viewMode", v)
  // 切到树形视图：若用户从未看过引导，自动打开 dialog（chrome.storage.local 持久化首次标志）
  if (v === "tree" && !treeGuideShown.value) {
    treeGuideOpen.value = true
    treeGuideShown.value = true
    safeSet({ treeGuideShown: true }, "sidepanel")
  }
  // 切视图后列表重建，当前激活标签可能滚出视野，重新锚定（含树形，data-tabid 已加到 TabTreeItem）
  // 树形若 active 标签在折叠子树内则 DOM 未渲染、锚定不到，属可接受边界
  scrollToActive(activeTabId.value ?? undefined)
}
const setSortMode = (v: string) => {
  sortMode.value = v
  localStorage.setItem("sortMode", v)
  // 切排序后列表重排，当前激活标签可能滚出视野，重新锚定到它（居中高亮）
  scrollToActive(activeTabId.value ?? undefined)
}

// 树形视图引导：黄条点击/首次切换自动打开
const treeGuideOpen = ref(false)
const treeGuideShown = ref(false)
chrome.storage.local.get("treeGuideShown").then((d) => {
  treeGuideShown.value = !!d.treeGuideShown
  // 初始 viewMode 已经是 tree 且首次：异步加载完后再触发
  if (viewMode.value === "tree" && !treeGuideShown.value) {
    treeGuideOpen.value = true
    treeGuideShown.value = true
    safeSet({ treeGuideShown: true }, "sidepanel")
  }
})
// 模板里直接用 window.location.reload() 在 Vue 3 <script setup> 的求值上下文中找不到 window，
// 包成方法暴露给模板才能正常触发。
const reloadPanel = () => { window.location.reload() }

const scrolled = ref(false)
const homeTabsScrollRef = ref<HTMLElement | null>(null)
const onContentScroll = (e: Event) => { scrolled.value = (e.target as HTMLElement).scrollTop > 80 }
const scrollToTop = () => {
  // home 普通态滚动在 homeTabsScrollRef；其它页在 contentRef
  const target = homeTabsScrollRef.value ?? contentRef.value
  target?.scrollTo({ top: 0, behavior: 'smooth' })
}

// SW manualRefreshAll 完成后会广播 manualRefreshMy：已登录则静默重拉 /my 一次
// 复用 useAuth.fetchUser（不新建架构、不改 /my 原有调用时机），失败静默
const onManualRefreshMyMsg = (msg: unknown) => {
  if (!msg || typeof msg !== 'object' || Array.isArray(msg)) return
  if ((msg as Record<string, unknown>).type !== 'manualRefreshMy') return
  if (!isLoggedIn.value) return
  fetchUser().catch((e) => {
    console.warn('[sidepanel] 手动刷新 /my 失败（静默）', e)
  })
}

// 全局错误捕获（稳定性红线③）：拦截 window error/unhandledrejection/console.error 入运行日志页，
// + onErrorCaptured 兜底 Vue 渲染错误。不装=线上问题全看不到日志 + 顶层异常直接白屏。
installGlobalCapture()
onErrorCaptured((err, _instance, info) => {
  logError("vue", `渲染错误：${err instanceof Error ? err.message : String(err)}`, { info, err })
  return false // 阻止冒泡到 app 级默认 handler（已入库，避免控制台重复报）
})

onMounted(async () => {
  // 初始化聚焦模式
  if (SUPPORTS_FOCUS_MODE) {
    const result = await restoreFocusState()
    if (result.reset) {
      showToast('聚焦状态已重置（浏览器重启）')
    }
  }
  // 监听标签创建事件（用于聚焦模式）
  chrome.tabs.onCreated.addListener(handleNewTabInFocus)
  // 监听首次绑标记（storage 写入 tagsSessionNoticeShown=true）→ 弹告知确认框
  chrome.storage.onChanged.addListener(onTagsSessionNoticeChanged)
  // 监听 SW 手动刷新完成后的 /my 重拉广播：已登录则静默刷新一次用户信息（不新建架构，复用 fetchUser）
  chrome.runtime.onMessage.addListener(onManualRefreshMyMsg)
  // 加载登录引导 Banner 状态
  await loadBannerState()
  // 广告/版本/通知均由 Service Worker 后台定时拉取 + storage 缓存，sidepanel 只读缓存
  // （useAd/useVersionCheck/useNotice 初始化时自动加载缓存，收到 SW onMessage 时刷新）

  // 已登录则拉一次 /my 刷新积分/会员状态（本地 storage 是旧值，不联网永不更新；
  // 头像/积分展示依赖最新 user 信息）。fetchUser 静默失败不阻断，401 由 useAuth 自动登出。
  // 直读 storage 判登录态，避免 loadAuth 异步未完成时漏拉（与 options onMounted 范式一致）。
  try {
    const data = await chrome.storage.local.get('tabMasterAuth')
    const stored = data?.tabMasterAuth as { token?: string; user?: { id?: string } } | undefined
    if (stored?.token && stored?.user?.id) {
      fetchUser().catch((e) => console.warn('[sidepanel] fetchUser 失败', e))
    }
  } catch (e) {
    console.warn('[sidepanel] 读取登录态失败', e)
  }
})

onUnmounted(() => {
  chrome.tabs.onCreated.removeListener(handleNewTabInFocus)
  chrome.storage.onChanged.removeListener(onTagsSessionNoticeChanged)
  chrome.runtime.onMessage.removeListener(onManualRefreshMyMsg)
})


const scrollToActive = (activeId: number | undefined) => {
  if (!activeId) return
  // 等 Vue 完成 computed 链 + DOM 渲染（两个 tick + 一次宏任务）
  // 切排序/视图后列表重排，需等 DOM 重建才能定位到新位置的元素
  nextTick(() => setTimeout(() => {
    // home 普通态滚动容器是 homeTabsScrollRef；其它页是 contentRef
    const container = homeTabsScrollRef.value ?? contentRef.value
    if (!container) return
    const el = container.querySelector(`[data-tabid="${activeId}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: "center", behavior: "smooth" })
  }, 0))
}
watch(activeTabId, scrollToActive, { immediate: true })

// 切换导航 tab 时自动退出批量模式
watch(activeNav, (newNav) => {
  if (newNav !== 'home' && isBatchMode.value) {
    exitBatch()
  }
  // 进入历史页且已授权时刷新浏览历史，保证看到最新记录
  if (newNav === 'history' && historyHasPermission.value) loadHistory()
})

const itemComponent = computed(() => {
  if (viewMode.value === "tile") return TabTileItem
  if (viewMode.value === "icon") return TabIconItem
  return TabListItem
})
const gridClass = computed(() => {
  if (viewMode.value === "tile") return "grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-1.5"
  if (viewMode.value === "icon") return "grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2"
  return "flex flex-col gap-1"
})

const matchSearch = (q: string, t: { title: string; url: string; domain: string }) => {
  const lq = q.toLowerCase()
  return t.title.toLowerCase().includes(lq) || t.url.toLowerCase().includes(lq) || t.domain.toLowerCase().includes(lq) || matchTitlePinyin(q, t.title)
}
// 标题拼音匹配：全拼或首字母命中（大小写/空格不敏感）。只对 title 加、与现有子串匹配是「或」关系。
const matchTitlePinyin = (q: string, title: string): boolean => {
  const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase()
  const lq = norm(q)
  if (!lq) return false
  try {
    const full = norm(pinyin(title, { pattern: "pinyin", toneType: "none" }))
    const first = norm(pinyin(title, { pattern: "first", toneType: "none" }))
    return full.includes(lq) || first.includes(lq)
  } catch {
    // 库异常时降级为不命中，不阻断子串匹配
    return false
  }
}
const searchPinned = computed(() => { const q = search.value.trim(); return q ? tabs.value.filter(t => t.pinned && matchSearch(q, t)) : [] })
const searchOpen = computed(() => { const q = search.value.trim(); return q ? tabs.value.filter(t => !t.pinned && matchSearch(q, t)) : [] })
const searchClosed = computed(() => { const q = search.value.trim(); return q ? recentlyClosed.value.filter(t => matchSearch(q, t)) : [] })

const filteredTabs = computed(() => {
  let list = tabs.value
  // 选择态下过滤掉受保护的标签
  if (focusMode.value === 'selecting') {
    list = list.filter(t => !t.isProtected)
  }
  if (activeTagFilters.value.length) list = list.filter(t => activeTagFilters.value.every(tag => t.tags.includes(tag)))
  if (activeFilter.value !== "all") {
    const f = activeFilter.value
    const filters: Record<string, (t: typeof list[0]) => boolean> = {
      active: t => t.active, playing: t => t.audible, muted: t => t.muted,
      pinned: t => t.pinned, frozen: t => t.frozen, discarded: t => t.discarded,
      loading: t => t.loading, recording: t => t.recording, sharing: t => t.sharing,
      attention: t => t.attention, hasUnsavedForm: t => t.hasUnsavedForm,
      hasConnectedDevice: t => t.hasConnectedDevice, isProtected: t => t.isProtected,
    }
    if (filters[f]) list = list.filter(filters[f])
  }
  return list
})

const pinnedItems = computed(() => tabs.value.filter(t => t.pinned))
const normalItems = computed(() => filteredTabs.value.filter(t => !t.pinned))
const sortedNormalItems = computed(() => sortTabs(normalItems.value, sortMode.value))
const domainGroups = computed(() => groupByDomain(sortedNormalItems.value))

const tabCountByTag = computed(() => {
  const counts: Record<string, number> = {}
  for (const t of tabs.value) for (const tag of t.tags) counts[tag] = (counts[tag] || 0) + 1
  return counts
})

const toggleSelect = (id: number) => {
  selectedIds.value = selectedIds.value.includes(id) ? selectedIds.value.filter(i => i !== id) : [...selectedIds.value, id]
}
const toggleBatch = () => { isBatchMode.value = !isBatchMode.value; if (!isBatchMode.value) selectedIds.value = [] }
const exitBatch = () => {
  isBatchMode.value = false;
  selectedIds.value = [];
  popover.close('normal-batch');
  batchActiveSubmenu.value = null;
}

const onBatchButtonClick = (e: MouseEvent) => {
  toggleBatch();
  if (isBatchMode.value) {
    popover.open('normal-batch', e.currentTarget as HTMLElement);
  }
}

const onBatchMenuClick = (e: MouseEvent) => {
  popover.toggle('normal-batch', e.currentTarget as HTMLElement);
}

// 批量菜单位置计算
const batchMenuPos = computed(() => {
  if (!popover.isOpen('normal-batch') || !popover.activeAnchorRect.value) return { left: '0px', top: '0px' }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 192, height: 280 }, 'bottom-right')
  return { left: `${p.left}px`, top: `${p.top}px` }
})

// 批量子菜单位置计算（统一走 computeFlyoutPos，双向兜底 clamp 不溢出窄面板）
const batchGroupSubmenuPos = computed(() => {
  if (!batchSubmenuAnchorRect.value) return { left: '0px', top: '0px' }
  const p = computeFlyoutPos(batchSubmenuAnchorRect.value, { width: 180, height: 200 }, 'left')
  return { left: `${p.left}px`, top: `${p.top}px` }
})

const onBatchEnterSubmenuRow = (type: "group" | "tag", rowEl: HTMLElement | null) => {
  batchActiveSubmenu.value = type
  batchSubmenuAnchorRect.value = rowEl?.getBoundingClientRect() ?? null
}

// 子菜单 hover 入口（绕开 Vue 模板 TS 断言不能用的限制）
const onEnterGroupSubmenu = (e: MouseEvent) => {
  if (!selectedIds.value.length) return
  onBatchEnterSubmenuRow("group", e.currentTarget as HTMLElement)
}

// 批量菜单项的 click handlers（避免在模板里写 `fn; popover.close()` 这种 statement 组合，Vue 解析不稳）
const onMenuBatchClose = async () => {
  if (!selectedIds.value.length) return
  await batchClose(selectedIds.value)
  selectedIds.value = []
  isBatchMode.value = false
  popover.close("normal-batch")
}
const onMenuBatchLater = async () => {
  if (!selectedIds.value.length) return
  await batchLater(selectedIds.value)
  selectedIds.value = []
  isBatchMode.value = false
  popover.close("normal-batch")
}
const onMenuCreateNewGroup = async () => {
  if (!selectedIds.value.length) return
  const name = `分组 ${groups.value.length + 1}`
  await batchNewGroup(selectedIds.value, name, 'blue')
  selectedIds.value = []
  isBatchMode.value = false
  popover.close("normal-batch")
}
const onMenuPickGroup = async (gid: number) => {
  if (!selectedIds.value.length) return
  await batchAddToGroup(selectedIds.value, gid)
  selectedIds.value = []
  isBatchMode.value = false
  popover.close("normal-batch")
}


const GROUP_COLOR_HEX: Record<string, string> = {
  grey: "#6b7280", blue: "#3b82f6", red: "#ef4444", yellow: "#eab308",
  green: "#22c55e", pink: "#ec4899", purple: "#a855f7", cyan: "#06b6d4", orange: "#f97316",
}
const groupColorHex = (color: string | undefined) => color ? (GROUP_COLOR_HEX[color] || "#6b7280") : "#6b7280"

/** 从单条右键快速进入批量并预选 —— 右键「选择此/同域名/同分组/全选可见」入口共用 */
const enterBatchWithSelection = (ids: number[]) => {
  selectedIds.value = ids.filter(id => visibleNormalIds.value.includes(id))
  isBatchMode.value = true
  if (selectedIds.value.length) showToast(`已选中 ${selectedIds.value.length} 个标签`)
}

// 批量动作：当前可见标签 = sortedNormalItems（已经过搜索/标记/状态过滤 + 排序）
// 注意：固定标签 (pinnedItems) 不参与批量 —— 批量是为了清理/整理非固定标签
const visibleNormalIds = computed(() => sortedNormalItems.value.map(t => t.id))

// 三态全选逻辑
const selectAllState = computed<'all' | 'partial' | 'none'>(() => {
  const visible = visibleNormalIds.value
  if (!visible.length) return 'none'
  const selectedVisible = visible.filter(id => selectedIds.value.includes(id))
  if (selectedVisible.length === 0) return 'none'
  if (selectedVisible.length === visible.length) return 'all'
  return 'partial'
})

// 监听三态变化，更新DOM的indeterminate状态
watch(selectAllState, (state) => {
  if (selectAllCheckboxRef.value) {
    selectAllCheckboxRef.value.indeterminate = state === 'partial'
    selectAllCheckboxRef.value.checked = state === 'all'
  }
}, { immediate: true })

const onToggleSelectAll = () => {
  if (selectAllState.value === 'all') {
    selectedIds.value = []
  } else {
    selectedIds.value = [...visibleNormalIds.value]
  }
}
const invertSelection = () => {
  const visible = visibleNormalIds.value
  const sel = new Set(selectedIds.value)
  selectedIds.value = visible.filter(id => !sel.has(id))
}
const batchAddTags = async (tags: string[]) => {
  if (!tags.length || !selectedIds.value.length) return
  const ids = [...selectedIds.value]
  for (const id of ids) {
    const cur = tabs.value.find(t => t.id === id)?.tags ?? []
    const merged = Array.from(new Set([...cur, ...tags]))
    await updateTabTags(id, merged)
  }
  showToast(`已为 ${ids.length} 个标签加 ${tags.length} 个标记`)
  // 标记保留批量模式（用户可能继续做别的动作）
}

const openLater = (id: number) => { pendingLaterTabId.value = id; laterDialogOpen.value = true }
const confirmLater = async (note: string) => {
  if (pendingLaterTabId.value !== null) await moveToLater(pendingLaterTabId.value, note)
  pendingLaterTabId.value = null; laterDialogOpen.value = false
}
const openNewTab = () => chrome.tabs.create({})
const refreshCurrentTab = () => { if (activeTabId.value) refresh(activeTabId.value) }
const handlePinnedMove = async (sourceId: number, targetId: number) => {
  // 获取当前标签的实际index（tabs数组按Chrome顺序排列）
  const targetIndex = tabs.value.findIndex(t => t.id === targetId)
  if (targetIndex === -1) return
  await moveTabToIndex(sourceId, targetIndex)
}

const onContextMenu = (e: MouseEvent, item: TabItem) => {
  e.preventDefault(); ctxMenu.value = { tab: item, x: e.clientX, y: e.clientY }
}
const handleCtxAction = (action: string, data?: any) => {
  const tab = ctxMenu.value?.tab; if (!tab) return
  const { x, y } = ctxMenu.value!
  ctxMenu.value = null
  const acts: Record<string, () => void | Promise<void>> = {
    refresh: () => refresh(tab.id),
    duplicate: () => duplicate(tab.id),
    pin: () => togglePin(tab.id),
    mute: () => toggleMute(tab.id),
    group: () => groupTab(tab.id),
    newGroup: () => newGroupSingle(tab.id, '新分组', 'blue'),
    addToGroup: () => {
      if (typeof data === 'number') {
        addToGroupSingle(tab.id, data);
      }
    },
    removeFromGroup: () => removeFromGroupSingle(tab.id),
    // 右键 tag/setNumber：用 setTimeout(0) 推迟一帧 —— 当前点击事件仍在冒泡，会被全局
    // popover-close 监听器一开就立刻关掉；推到下一个事件循环可避开这个 race
    tag: () => {
      rightClickTabId.value = tab.id
      setTimeout(() => popover.openAtRect('right-click-tag-picker', new DOMRect(x, y, 0, 0)), 0)
    },
    setNumber: () => {
      rightClickTabId.value = tab.id
      setTimeout(() => popover.openAtRect('number-picker', new DOMRect(x, y, 0, 0)), 0)
    },
    later: () => openLater(tab.id),
    copyUrl: () => copyUrl(tab.url),
    close: () => closeAction(tab.id),
    closeOthers: () => closeOthersAction(tab.id),
    // 批量选择入口：从单条右键直接进入批量模式并预选好对应标签
    selectThis: () => enterBatchWithSelection([tab.id]),
    selectSameDomain: () => {
      const domain = tab.domain.toLowerCase()
      const ids = tabs.value.filter(t => t.domain.toLowerCase() === domain).map(t => t.id)
      enterBatchWithSelection(ids)
    },
    selectSameGroup: () => {
      if (tab.groupId === TAB_GROUP_ID_NONE) return
      const ids = tabs.value.filter(t => t.groupId === tab.groupId).map(t => t.id)
      enterBatchWithSelection(ids)
    },
    selectAllVisible: () => enterBatchWithSelection(visibleNormalIds.value),
  }
  acts[action]?.()
}

</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #ffffff; }

/* ======================================================================
 * 字号档位 —— 通过改 :root font-size 让 Tailwind rem 类自动响应
 * 影响：text-xs/sm/base/lg 等所有 rem 单位的字号
 * 不影响：硬编码的 text-[10px]/[11px] 等任意值（约 30 处，肉眼差异不大）
 * 默认：fs-normal = 14px（紧凑标准，工具型 UI）
 * ====================================================================== */
:root.fs-normal  { font-size: 14px; }
:root.fs-large   { font-size: 15.5px; }   /* +10.7% */
:root.fs-xlarge  { font-size: 17px; }     /* +21.4% */

/* ======================================================================
 * 字体族
 * ====================================================================== */
:root.font-mono body { font-family: 'SF Mono', 'Cascadia Code', Consolas, Monaco, monospace; }

/* ======================================================================
 * 卡片密度档位 —— 覆盖标签卡片的 padding，让"紧凑/标准/宽松"真的有视觉差
 * 设计取舍：用 :root.density-* 选择卡片 padding 相关 Tailwind 类做覆盖
 * 影响范围：TabListItem (px-3 py-2) / TabTileItem (p-2)
 * 默认：density-normal 不做任何覆盖（Tailwind 原值）
 * ====================================================================== */
:root.density-compact .px-3 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
:root.density-compact .py-2 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
:root.density-compact .p-2  { padding: 0.375rem !important; }
:root.density-compact .gap-2 { gap: 0.375rem !important; }

:root.density-loose .px-3 { padding-left: 1rem !important; padding-right: 1rem !important; }
:root.density-loose .py-2 { padding-top: 0.625rem !important; padding-bottom: 0.625rem !important; }
:root.density-loose .p-2  { padding: 0.75rem !important; }
:root.density-loose .gap-2 { gap: 0.625rem !important; }

/* ======================================================================
 * 暗色模式 —— 全局 CSS 覆盖关键 Tailwind 类
 * 设计取舍：不去 31 个组件逐个加 dark:bg-xxx，集中在这里维护
 * 覆盖范围：背景、文字、边框、hover 态、divide 边框
 * 不覆盖：blue/red/green 等品牌色（保持视觉锚点）、shadow（深色已经够低对比）
 * ====================================================================== */
html.dark body { background-color: #1f2937; color: #e5e7eb; }

html.dark .bg-white         { background-color: #1f2937 !important; }
html.dark .bg-gray-50       { background-color: #1f2937 !important; }
html.dark .bg-gray-100      { background-color: #374151 !important; }

html.dark .border-gray-100,
html.dark .border-gray-200,
html.dark .border-gray-300  { border-color: #374151 !important; }

html.dark .text-gray-400    { color: #9ca3af !important; }
html.dark .text-gray-500    { color: #9ca3af !important; }
html.dark .text-gray-600,
html.dark .text-gray-700,
html.dark .text-gray-800,
html.dark .text-gray-900    { color: #e5e7eb !important; }

html.dark .hover\:bg-gray-50:hover,
html.dark .hover\:bg-gray-100:hover { background-color: #374151 !important; }

html.dark .divide-gray-100 > * + *,
html.dark .divide-gray-200 > * + * { border-color: #374151 !important; }

/* 浅蓝色高亮（激活态/选中）在暗色模式下需要降透明 */
html.dark .bg-blue-50       { background-color: rgba(59, 130, 246, 0.15) !important; }
html.dark .bg-blue-100      { background-color: rgba(59, 130, 246, 0.25) !important; }
html.dark .text-blue-600,
html.dark .text-blue-700    { color: #60a5fa !important; }
</style>
