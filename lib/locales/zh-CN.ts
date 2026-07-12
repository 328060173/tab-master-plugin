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

  // 灰显提示
  'menu.backendRequired': '需要后端服务，敬请期待',

  // 导航
  'nav.home': '首页',
  'nav.later': '稍后处理',
  'nav.groups': '分组',
  'nav.history': '历史',

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
  'toast.languageChanged': '语言已切换，重新打开侧边栏生效',
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
}
