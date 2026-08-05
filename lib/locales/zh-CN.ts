export default {
  // Header
  'header.settings': '设置',
  'header.login': '登录账号',
  'header.focusMode': '聚焦模式',
  'header.focusMode.on': '聚焦模式 开启',
  'header.focusMode.off': '聚焦模式 关闭',
  'header.reload': '重新打开',

  // 设置菜单
  'menu.theme': '界面主题',
  'menu.theme.light': '浅色',
  'menu.theme.dark': '深色',
  'menu.theme.system': '跟随系统',
  'menu.font': '字体设置',
  'menu.fontSize': '字号',
  'menu.fontSize.normal': '标准',
  'menu.fontSize.large': '大',
  'menu.fontSize.xlarge': '超大',
  'menu.fontFamily': '字体',
  'menu.fontFamily.system': '系统默认',
  'menu.fontFamily.mono': '等宽',
  'menu.displayPosition': '显示位置',
  'menu.cloudSync': '云同步',
  'menu.cloudSync.loginRequired': '需登录',
  'menu.cloudSync.comingSoon': '云同步即将开放',
  'menu.snapshot': '快照',
  'menu.snapshot.vipRequired': 'VIP',
  'menu.snapshot.comingSoon': '快照功能即将开放',
  'menu.storage': '存储空间',
  'menu.settings': '更多设置...',
  'menu.logs': '运行日志',

  // 账号相关
  'menu.register': '注册',
  'menu.login': '登录 / 注册',
  'menu.logout': '退出登录',
  'menu.loggedOut': '已退出登录',

  // 帮助/支持
  'menu.contact': '加群 & 联系我们',
  'menu.feedback': '意见 & 需求反馈',
  'menu.feedback.comingSoon': '反馈功能即将开放',
  'menu.feedback.loginRequired': '需登录',
  'menu.guide': '操作说明',
  'menu.donate': '请作者喝杯咖啡',

  // 分组标题
  'menu.group.account': '账号',
  'menu.group.interface': '界面',
  'menu.group.data': '数据',
  'menu.group.help': '帮助',
  'menu.group.more': '更多',

  // 灰显提示
  'menu.backendRequired': '需要后端服务，敬请期待',

  // 导航
  'nav.home': '首页',
  'nav.later': '稍后处理',
  'nav.groups': '分组',
  'nav.history': '历史',
  'nav.tools': '小工具',

  // 通用补充
  'common.gotIt': '知道啦',
  'common.invert': '反选',
  'common.batch': '批量',
  'common.selectAll': '全选',
  'common.cancelBatch': '取消批量',

  // 设置弹窗
  'settings.title': '设置',
  'settings.display': '显示设置',
  'settings.defaultView': '默认视图',
  'settings.defaultView.tile': '平铺',
  'settings.defaultView.list': '列表',
  'settings.defaultView.icon': '图标',
  'settings.defaultView.tree': '树形',
  'settings.defaultSort': '默认排序',
  'settings.defaultSort.domain': '按域名',
  'settings.defaultSort.timeAsc': '时间正序',
  'settings.defaultSort.timeDesc': '时间倒序',
  'settings.cardDensity': '卡片密度',
  'settings.cardDensity.compact': '紧凑',
  'settings.cardDensity.normal': '标准',
  'settings.cardDensity.loose': '宽松',
  'settings.appearance': '外观',
  'settings.about': '关于',
  'settings.version': '浏览器标签大师 v{version}',
  'settings.github': 'GitHub',
  'settings.feedback': '反馈',

  // Toast提示
  'toast.languageChanged': '语言已切换',
  'toast.copied': '已复制URL',
  'toast.numberSet': '编号 {modKey}{number} 已设置，按 {modKey}{number} 可快速跳转',
  'toast.numberCleared': '编号已清除',
  'toast.scrolledToTop': '已回到顶部',

  // 通用
  'common.all': '全部',
  'common.clear': '清空',
  'common.confirm': '确定',
  'common.cancel': '取消',
  'common.close': '关闭',
  'common.save': '保存',
  'common.delete': '删除',
  'common.edit': '编辑',
  'common.add': '添加',
  'common.more': '更多',
  'common.loading': '加载中...',
  'common.noResult': '暂无数据',
  'common.noTabs': '暂无标签',

  // 视图切换
  'view.tile': '平铺',
  'view.list': '列表',
  'view.icon': '图标',
  'view.tree': '树形',

  // 排序
  'sort.domain': '按域名',
  'sort.timeAsc': '时间正序',
  'sort.timeDesc': '时间倒序',

  // 工具栏「清理」菜单 —— 详见 PRD: docs/prd/cleanup-toolbar.md
  // 注：当前 sidepanel.vue 暂走硬编码中文，这里先把字典完整入库，等 i18n 接通时无缝切换
  'cleanup.menu.directGroup': '直接关闭',
  'cleanup.menu.detectGroup': '检测后选择',
  'cleanup.menu.closeUnpinned': '关闭非固定标签',
  'cleanup.menu.closeOthers': '关闭其他标签（除当前页）',
  'cleanup.menu.closeFrozenDiscarded': '关闭已冻结/已舍弃标签',
  'cleanup.menu.detectDuplicates': '检测重复标签',
  'cleanup.menu.detectUnused': '检测长期未使用标签',

  // 确认弹窗（关闭类）
  'cleanup.confirm.unpinnedTitle': '确认关闭非固定标签',
  'cleanup.confirm.othersTitle': '确认关闭其他标签',
  'cleanup.confirm.frozenDiscardedTitle': '确认关闭已冻结/已舍弃标签',
  'cleanup.confirm.hint': '关闭的标签可用 Ctrl+Shift+T 逐个恢复',
  'cleanup.confirm.button': '确认关闭 {count} 个',

  // 检测弹窗
  'cleanup.detect.duplicatesTitle': '检测到 {groups} 组重复 · 共 {total} 个标签',
  'cleanup.detect.unusedTitle': '检测到 {total} 个长期未用标签',
  'cleanup.detect.duplicatesSummary': '已按 URL 完全相同分组；每组默认保留最新打开的一个',
  'cleanup.detect.unusedSummary': '按未访问时长降序排列；缺少访问数据的标签默认不勾选',
  'cleanup.detect.threshold': '阈值',
  'cleanup.detect.excludeNote': '已排除固定/当前页/正播放',
  'cleanup.detect.selectAll': '全选',
  'cleanup.detect.unselectAll': '取消全选',
  'cleanup.detect.suggestKeep': '建议保留',
  'cleanup.detect.accessUnknown': '上次访问未知',
  'cleanup.detect.accessRecent': '刚刚访问',
  'cleanup.detect.notVisitedFor': '未访问 {duration}',
  'cleanup.detect.closeButton': '关闭选中 {count} 个',

  // 操作后 toast
  'cleanup.toast.noUnpinned': '没有非固定标签可关闭',
  'cleanup.toast.noOthers': '没有其他标签可关闭',
  'cleanup.toast.noFrozen': '没有已冻结/已舍弃的标签',
  'cleanup.toast.noDuplicates': '未检测到重复标签',
  'cleanup.toast.noUnused': '未检测到长期未用标签',
  'cleanup.toast.closed': '已关闭 {count} 个标签 · Ctrl+Shift+T 可恢复',
  'cleanup.toast.closedPartial': '已关闭 {success} 个，{failed} 个失败 · Ctrl+Shift+T 可恢复',

  // 登录引导 Banner
  'loginBanner.title': '登录获取更多功能',
  'loginBanner.comingSoon': '登录功能即将开放',

  // 验证码
  'captcha.placeholder': '验证码',

  // 登录弹窗
  'login.title': '登录 / 注册',
  'login.email': '邮箱地址',
  'login.emailPlaceholder': '请输入邮箱',
  'login.captcha': '图形验证码',
  'login.emailCode': '邮箱验证码',
  'login.emailCodePlaceholder': '请输入验证码',
  'login.getCode': '获取验证码',
  'login.sendCode': '发送验证码',
  'login.submit': '登录 / 注册',
  'login.success': '登录成功',
  'login.codeSent': '验证码已发送',
  'login.agree': '登录即表示同意用户协议',
  'login.autoRegisterTip': '邮箱已注册将直接登录，未注册将自动注册并登录',
  'login.expired': '登录已过期，请重新登录',

  // 版本更新
  'update.found': '发现新版本',
  'update.forceMsg': '发现新版本，请立即更新',
  'update.normalMsg': '发现新版本 v{version}',
  'update.goUpdate': '去更新',
  'update.changeLog': '更新内容',

  // 广告
  'ad.label': '广告',
  'ad.close': '关闭',
  'ad.learnMore': '了解详情',

  // 「我的」页面
  'mine.title': '我的',
  'mine.pleaseLogin': '请先登录',
  'mine.pleaseLoginHint': '登录后可访问个人中心',
  'mine.goLogin': '去登录',
  'mine.accountInfo': '账号信息',
  'mine.email': '邮箱',
  'mine.userId': '用户ID',
  'mine.membership': '会员状态',
  'mine.membershipNormal': '普通用户',
  'mine.membershipVip': 'VIP会员',
  'mine.loginMethod': '登录方式',
  'mine.loginMethodEmail': '邮箱验证码',
  'mine.quickActions': '功能入口',
  'mine.feedback': '意见反馈',
  'mine.donate': '请作者喝杯咖啡',
  'mine.contact': '加群 & 联系我们',
  'mine.guide': '操作说明',
  'mine.logout': '退出登录',
  'mine.refresh': '刷新用户信息',
  'mine.viewVipRights': '查看更多会员权益',

  // 消息通知
  'notice.empty': '暂无通知',
  'notice.markAllRead': '全部已读',
  'notice.gotIt': '知道了',
  'notice.dontShowAgain': '不再显示',

  // 语言菜单（设置页「语言」下拉项）
  'settings.language.label': '语言',
  'settings.language.auto': '跟随浏览器',
  'settings.language.zh-CN': '简体中文',
  'settings.language.en-US': 'English',

  // sidepanel 样板改造 key（任务1 验证架构用，不全量替换）
  'sidepanel.tabCount': '{count} 个标签',
  'sidepanel.backupMenu': '标签导入导出',
  'sidepanel.backupMenu.tooltip.off': '标签导入导出 · 崩溃找回 / 多档还原 / 兼容导入（未开启）',
  'sidepanel.backupMenu.tooltip.error': '标签导入导出 · 上次备份失败，点开重试',
  'sidepanel.backupMenu.tooltip.on': '标签导入导出 · 崩溃找回 / 多档还原 / 兼容导入',
  'sidepanel.backup.export': '导出',
  'sidepanel.backup.import': '导入',
  'sidepanel.backup.manual': '手动备份',
  'sidepanel.backup.restore': '恢复标签',
  'sidepanel.backup.manage': '打开管理页',
  'sidepanel.focus': '聚焦',
  'sidepanel.cancelSelect': '取消选择',
  'sidepanel.storageCleared': '已清理',
  'sidepanel.personalCenter': '个人中心',

  // sidepanel 任务2 剩余硬编码改造（按功能分组）
  // 聚焦模式
  'sidepanel.focus.menu.enter': '开启聚焦模式',
  'sidepanel.focus.menu.help': '聚焦说明',
  'sidepanel.focus.tooltip.unsupported': '聚焦模式需要 Chrome 102+ 或 Edge 102+',
  'sidepanel.focus.tooltip.supported': '聚焦模式：只显示选中的标签，其余隐藏',
  'sidepanel.focus.selectHint': '选择要聚焦的标签 · 已选 {count}',
  'sidepanel.focus.selectHintTip': '💡 用搜索、排序快速找到要聚焦的标签，勾选后点底部按钮',
  'sidepanel.focus.protectedExcluded': '已自动排除 {count} 个系统页面',
  'sidepanel.focus.exitButton': '关闭聚焦',
  'sidepanel.focus.exitTooltip': '退出聚焦模式',
  'sidepanel.focus.toast.groupRecollapsed': '聚焦模式中，分组已重新折叠',
  'sidepanel.focus.toast.tabAdded': '已加入聚焦标签：{title}',
  'sidepanel.focus.toast.allClosed': '所有聚焦标签已关闭，已退出聚焦模式',
  'sidepanel.focus.toast.entered': '进入聚焦模式，{count} 个标签',
  'sidepanel.focus.toast.exited': '已退出聚焦模式',
  'sidepanel.focus.toast.switched': '已切换到聚焦标签：{title}',
  'sidepanel.focus.toast.allPinned': '固定标签本来就不会被折叠，本次聚焦实际未折叠任何标签',
  'sidepanel.focus.toast.suggestRange': '建议聚焦 4-7 个标签，效果更好',
  'sidepanel.focus.toast.reset': '聚焦状态已重置（浏览器重启）',

  // 首页工具栏/选项
  'sidepanel.home.optionsTitle': '显示选项',
  'sidepanel.home.showSearch': '显示搜索',
  'sidepanel.home.showTags': '显示标记',
  'sidepanel.home.searching': '搜索中：{query}',
  'sidepanel.home.batchSelected': '已选 {count}',
  'sidepanel.home.scrollTopTooltip': '回到顶部',
  'sidepanel.home.numberPickerTitle': '快捷键编号',
  'sidepanel.home.clearNumber': '清除编号',

  // 批量菜单
  'sidepanel.batch.sectionSelect': '选择',
  'sidepanel.batch.sectionAction': '操作',
  'sidepanel.batch.closeCount': '关闭 {count} 个',
  'sidepanel.batch.addToLater': '加入稍后处理',
  'sidepanel.batch.addToGroup': '加入分组',
  'sidepanel.batch.addTag': '添加标记',
  'sidepanel.batch.newGroup': '新建分组...',
  'sidepanel.batch.toast.selected': '已选中 {count} 个标签',
  'sidepanel.batch.defaultGroupName': '分组 {index}',
  'sidepanel.batch.newGroupSingle': '新分组',

  // 分组
  'sidepanel.group.untitled': '未命名分组',
  'sidepanel.group.toast.created': '已创建「{name}」分组（{tabCount} 个标签）',
  'sidepanel.group.toast.createFailed': '创建分组失败，详见运行日志',
  'sidepanel.group.toast.added': '已将 {tabCount} 个标签加入分组',

  // 标记
  'sidepanel.tag.notice.title': '标记关联提醒',
  'sidepanel.tag.notice.msg': '重启浏览器、或关闭标签后重新打开同一个网页，之前绑的标记可能对不上。',
  'sidepanel.tag.notice.highlight': '标记靠标签 ID 关联，同一网址每次打开 ID 都不同，所以可能对不上。',
  'sidepanel.tag.notice.hint': '建议开启自动备份或用导出保存标记。备份/导入能找回标记名并关联到恢复的标签（按网址匹配），标记名已存在则跳过。',
  'sidepanel.tag.toast.added': '已添加标记「{tag}」',
  'sidepanel.tag.toast.removed': '已删除标记「{tag}」',
  'sidepanel.tag.toast.renamed': '已将「{oldTag}」重命名为「{newTag}」',
  'sidepanel.tag.toast.limit': '已达15个标记上限',
  'sidepanel.tag.toast.exists': '该标记已存在',
  'sidepanel.tag.toast.batchApplied': '已为 {count} 个标签添加标记「{tag}」',
  'sidepanel.tag.toast.batchRemoved': '已从 {count} 个标签移除标记「{tag}」',
  'sidepanel.tag.toast.batchMerged': '已为 {tabCount} 个标签加 {tagCount} 个标记',

  // 编号
  'sidepanel.number.notice.title': '快捷键编号 {n} 已设置',
  'sidepanel.number.notice.message': '已为该标签设置编号 {n}。\n\n{howTo}，即可快速切换到该标签。\n\n三个键要一起按住，在浏览器任意页面都能触发。编号仅支持 1-4。',
  'sidepanel.number.notice.howToMac': 'Mac 电脑：同时按住「Option ⌥」键和「Shift ⇧」键不放，再按数字「{n}」',
  'sidepanel.number.notice.howToWin': 'Windows 电脑：同时按住「Alt」键和「Shift」键不放，再按数字「{n}」',

  // 备份状态文案
  'sidepanel.backup.status.backingUp': '正在备份…',
  'sidepanel.backup.status.off': '未开启备份 · 崩溃将丢标签',
  'sidepanel.backup.status.dirLost': '备份文件夹需重新授权',
  'sidepanel.backup.status.failed': '上次备份失败 · 点管理重试',
  'sidepanel.backup.status.lastAt': '上次 {time}',
  'sidepanel.backup.status.never': '尚未备份',
  'sidepanel.backup.status.snapshotCount': '{count} 快照',
  'sidepanel.backup.relative.justNow': '刚刚',
  'sidepanel.backup.relative.minutesAgo': '{count} 分钟前',
  'sidepanel.backup.relative.hoursAgo': '{count} 小时前',
  'sidepanel.backup.relative.daysAgo': '{count} 天前',
  'sidepanel.backup.toast.openManageFailed': '打开备份管理失败',
  'sidepanel.backup.toast.openPageFailed': '打开备份页失败',

  // 恢复 / 新手引导
  'sidepanel.restore.toast.restored': '已恢复标签',
  'sidepanel.onboarding.done': '开始使用浏览器标签大师，标签再多也井井有条。',

  // 清理确认弹窗 message（title/hint/button 已在 cleanup.confirm.*）
  'cleanup.confirm.unpinnedMessage': '将关闭 {count} 个未固定标签',
  'cleanup.confirm.unpinnedRetain': '，保留 {count} 个固定标签',
  'cleanup.confirm.othersMessage': '将关闭 {count} 个标签，保留当前激活的页面',
  'cleanup.confirm.othersPinnedNote': '（注：固定标签也会被关）',
  'cleanup.confirm.frozenMessage': '将关闭 {count} 个被浏览器冻结或舍弃的标签。这些标签当前不占内存，但仍占用列表空间',

  // options.vue 完整 i18n（任务3）
  // 顶部标题 + Tab 栏
  'options.header.title': '浏览器标签大师 · 设置',
  'options.tab.account': '账号',
  'options.tab.settings': '设置',

  // 账号 tab
  'options.account.loginPrompt': '登录账号以同步个人设置与积分',
  'options.account.loginButton': '登录账号',
  'options.account.sex.male': '男',
  'options.account.sex.female': '女',
  'options.account.sex.secret': '保密',
  'options.account.sex.submitting': '提交中…',
  'options.account.email': '邮箱',
  'options.account.points': '积分',
  'options.account.checkin': '签到',
  'options.account.checkin.done': '今日已签到',
  'options.account.checkin.undone': '今日未签到',
  'options.account.checkin.awardTip': '签到可以获得{points}积分哦',
  'options.account.checkin.checked': '已签到',
  'options.account.checkin.checking': '签到中…',
  'options.account.checkin.now': '立即签到',
  'options.account.more': '更多',
  'options.account.logout': '退出登录',
  'options.account.logout.submitting': '退出中…',

  // 道具商城
  'options.prop.myPoints': '我的积分：',
  'options.prop.resetFrame': '头像框恢复默认',
  'options.prop.resetBg': '主题背景恢复默认',
  'options.prop.resetAll': '全部恢复默认',
  'options.prop.opacity': '透明度调整',
  'options.prop.loading': '加载中…',
  'options.prop.retry': '重试',
  'options.prop.empty': '暂无可兑换的道具',
  'options.prop.tryonBar': '试穿中：{name} · 剩余 {seconds}s',
  'options.prop.stopTryon': '结束试穿',
  'options.prop.noImage': '无图',
  'options.prop.free': '免费',
  'options.prop.pointsCost': '{points} 积分',
  'options.prop.inUse': '使用中',
  'options.prop.applying': '应用中…',
  'options.prop.use': '使用',
  'options.prop.preview': '预览',
  'options.prop.tryonOn': '试穿中…',
  'options.prop.tryon': '试穿',
  'options.prop.exchanging': '兑换中…',
  'options.prop.exchange': '兑换',
  'options.prop.prevPage': '上一页',
  'options.prop.pageIndicator': '第 {current} / {total} 页',
  'options.prop.nextPage': '下一页',
  'options.prop.disclaimer': '道具按类型各保留一个使用中（头像框 + 主题背景可共存）。「使用中」状态仅保存在本地，卸载插件或清缓存后会恢复默认，届时重新点击「使用」即可恢复，不影响已购买的道具。',
  'options.prop.subtab.frame': '头像框',
  'options.prop.subtab.bg': '主题背景',
  'options.prop.subtab.solid': '主题纯色背景',
  'options.prop.fallbackName': '道具',

  // 设置 tab：自动数据校正
  'options.setting.autoReconcile.label': '自动数据校正',
  'options.setting.autoReconcile.ariaLabel': '了解自动数据校正',
  'options.setting.autoReconcile.desc': '定期同步标签列表与浏览器实际状态',
  'options.setting.autoReconcile.helpTitle': '自动数据校正',
  'options.setting.autoReconcile.helpP1': '由于网络环境、计算机运行不稳定或浏览器自身机制，标签列表可能偶尔与实际状态不一致。',
  'options.setting.autoReconcile.helpP2': '开启后，每 60 秒自动校正一次，保证列表始终准确反映浏览器真实标签。',
  'options.setting.autoReconcile.helpP3': '校正仅读取本地数据，不联网、不消耗流量，推荐保持开启。',

  // 设置 tab：刷新菜单内容
  'options.setting.refreshContent.label': '刷新菜单内容',
  'options.setting.refreshContent.desc': '手动同步菜单、通知等最新内容',
  'options.setting.refreshContent.hint': '已触发同步，侧边栏内容将自动更新',
  'options.setting.refreshContent.button.syncing': '同步中…',
  'options.setting.refreshContent.button.now': '立即同步',

  // 退出登录确认弹框
  'options.logoutConfirm.title': '退出登录',
  'options.logoutConfirm.message': '确定要退出登录吗？退出后将无法同步个人设置与积分。',
  'options.logoutConfirm.confirm': '确认退出',

  // 预览弹层
  'options.preview.noOriginalImage': '无原图',
  'options.preview.tryon30s': '试穿 30 秒',

  // toast
  'options.toast.loggedIn': '已登录',
  'options.toast.sexUpdated': '已更新',
  'options.toast.sexUpdateFailed': '更新失败',
  'options.toast.checkinSuccess': '签到成功 +{points} 积分，连续 {days} 天',
  'options.toast.checkinFailed': '签到失败',
  'options.toast.loggedOut': '已退出登录',
  'options.toast.logoutFailed': '退出失败，请重试',
  'options.toast.propLoadFailed': '加载道具失败',
  'options.toast.detailLoadFailed': '加载详情失败',
  'options.toast.tryonResourceMissing': '道具资源缺失，无法试穿',
  'options.toast.tryonStarted': '试穿中：{name}（30 秒后自动恢复）',
  'options.toast.exchangeSuccess': '兑换成功，剩余 {points} 积分',
  'options.toast.exchangeFailed': '兑换失败',
  'options.toast.useResourceMissing': '道具资源缺失，无法使用',
  'options.toast.useApplied': '已使用：{name}',
  'options.toast.useFailed': '使用失败',
  'options.toast.resetAll': '已恢复默认装扮',
  'options.toast.resetFrame': '已恢复默认头像框',
  'options.toast.resetBg': '已恢复默认主题背景',
  'options.toast.tryonFailed': '试穿失败',
}
