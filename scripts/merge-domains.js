const fs = require('fs');

const newDomains = [
  // 搜索与门户
  { domain: 'baidu.com', name: '百度', comment: '中文搜索引擎' },
  { domain: 'google.com', name: 'Google', comment: '国际搜索引擎' },
  { domain: 'bing.com', name: '必应', comment: '微软搜索引擎' },
  { domain: 'sogou.com', name: '搜狗', comment: '搜索引擎' },
  { domain: '360.cn', name: '360搜索', comment: '奇虎360搜索' },
  { domain: 'qq.com', name: '腾讯网', comment: '腾讯官方网站' },
  { domain: '163.com', name: '网易', comment: '综合门户网站' },
  { domain: 'sohu.com', name: '搜狐', comment: '综合门户网站' },
  { domain: 'sina.com.cn', name: '新浪', comment: '综合门户网站' },
  { domain: 'toutiao.com', name: '今日头条', comment: '新闻资讯' },
  { domain: 'zhihu.com', name: '知乎', comment: '问答社区' },
  { domain: 'people.com.cn', name: '人民网', comment: '人民日报旗下网站' },
  { domain: 'cctv.com', name: '央视网', comment: '中央电视台官网' },
  { domain: 'xinhuanet.com', name: '新华网', comment: '新华社官网' },
  { domain: 'thepaper.cn', name: '澎湃新闻', comment: '新闻媒体' },
  { domain: 'jiemian.com', name: '界面新闻', comment: '财经新闻' },
  { domain: 'cnnic.cn', name: '中国互联网络信息中心', comment: 'CNNIC官方' },
  { domain: 'xinnet.com', name: '新网', comment: '域名注册服务商' },
  
  // 电商与生活服务
  { domain: 'taobao.com', name: '淘宝', comment: '电商平台' },
  { domain: 'jd.com', name: '京东', comment: '电商平台' },
  { domain: 'pinduoduo.com', name: '拼多多', comment: '电商平台' },
  { domain: 'tmall.com', name: '天猫', comment: '品牌商城' },
  { domain: 'suning.com', name: '苏宁易购', comment: '电商平台' },
  { domain: 'vip.com', name: '唯品会', comment: '电商平台' },
  { domain: 'meituan.com', name: '美团', comment: '本地生活' },
  { domain: 'dianping.com', name: '大众点评', comment: '本地生活' },
  { domain: 'ele.me', name: '饿了么', comment: '外卖平台' },
  { domain: 'douyin.com', name: '抖音', comment: '短视频/电商' },
  { domain: 'douyinec.com', name: '抖音电商', comment: '抖音电商' },
  { domain: 'fxg.jinritemai.com', name: '抖店', comment: '抖音商家平台' },
  { domain: 'xiaohongshu.com', name: '小红书', comment: '社交电商' },
  { domain: 'brand.xiaohongshu.com', name: '小红书商家平台', comment: '小红书商家后台' },
  { domain: 'temu.com', name: 'Temu', comment: '跨境电商' },
  { domain: 'aliexpress.com', name: '速卖通', comment: '跨境电商' },
  { domain: 'amazon.com', name: '亚马逊', comment: '国际电商' },
  { domain: 'ebay.com', name: 'eBay', comment: '拍卖平台' },
  { domain: 'booking.com', name: 'Booking', comment: '酒店预订' },
  
  // 社交与即时通讯
  { domain: 'weixin.qq.com', name: '微信', comment: '即时通讯' },
  { domain: 'work.weixin.qq.com', name: '企业微信', comment: '企业通讯' },
  { domain: 'qq.com', name: 'QQ', comment: '即时通讯' },
  { domain: 'weibo.com', name: '新浪微博', comment: '社交媒体' },
  { domain: 'weibo.cn', name: '新浪微博', comment: '微博移动端' },
  { domain: 'facebook.com', name: '脸书', comment: '社交网络' },
  { domain: 'instagram.com', name: 'Instagram', comment: '图片社交' },
  { domain: 'x.com', name: 'X', comment: '原Twitter' },
  { domain: 'tiktok.com', name: 'TikTok', comment: '短视频' },
  { domain: 'youtube.com', name: 'YouTube', comment: '视频平台' },
  { domain: 'bilibili.com', name: '哔哩哔哩', comment: '弹幕视频' },
  { domain: 'kuaishou.com', name: '快手', comment: '短视频平台' },
  { domain: 'reddit.com', name: 'Reddit', comment: '社区论坛' },
  
  // 办公协作与文档
  { domain: 'dingtalk.com', name: '钉钉', comment: '协作办公' },
  { domain: 'feishu.cn', name: '飞书', comment: '协作办公' },
  { domain: 'yuque.com', name: '语雀', comment: '文档协作' },
  { domain: 'docs.qq.com', name: '腾讯文档', comment: '在线文档' },
  { domain: 'kdocs.cn', name: '金山文档', comment: '在线文档' },
  { domain: 'shimo.im', name: '石墨文档', comment: '在线文档' },
  { domain: 'office.com', name: 'Microsoft 365', comment: 'Office在线' },
  { domain: 'google.com', name: 'Google Workspace', comment: '谷歌办公套件' },
  { domain: 'notion.so', name: 'Notion', comment: '笔记工具' },
  { domain: 'yinxiang.com', name: '印象笔记', comment: '笔记工具' },
  { domain: 'youdao.com/note', name: '有道云笔记', comment: '笔记工具' },
  { domain: 'muji-app.com', name: '幕布', comment: '思维导图' },
  { domain: 'jiandaoyun.com', name: '简道云', comment: '低代码平台' },
  { domain: 'meeting.tencent.com', name: '腾讯会议', comment: '视频会议' },
  { domain: 'zoom.us', name: 'Zoom', comment: '视频会议' },
  { domain: 'slack.com', name: 'Slack', comment: '团队协作' },
  { domain: 'atlassian.com', name: 'Atlassian', comment: 'Jira/Confluence' },
  
  // 设计与创意
  { domain: 'figma.com', name: 'Figma', comment: '设计工具' },
  { domain: 'lanhuapp.com', name: '蓝湖', comment: '设计协作' },
  { domain: 'js.design', name: '即时设计', comment: '设计工具' },
  { domain: 'mastergo.com', name: 'MasterGo', comment: '设计工具' },
  { domain: 'modao.cc', name: '墨刀', comment: '原型工具' },
  { domain: 'canva.cn', name: 'Canva可画', comment: '设计工具' },
  { domain: 'processon.com', name: 'ProcessOn', comment: '思维导图' },
  { domain: 'draw.io', name: 'Draw.io', comment: '绘图工具' },
  { domain: 'gitmind.com', name: 'GitMind', comment: '思维导图' },
  
  // 项目管理
  { domain: 'teambition.com', name: 'Teambition', comment: '团队协作' },
  { domain: 'tapd.cn', name: 'TAPD', comment: '腾讯研发管理' },
  { domain: 'worktile.com', name: 'Worktile', comment: '项目管理' },
  { domain: 'pingcode.com', name: 'PingCode', comment: '研发管理' },
  { domain: 'tower.im', name: 'Tower', comment: '项目管理' },
  
  // 代码托管与开发
  { domain: 'github.com', name: 'GitHub', comment: '代码托管' },
  { domain: 'gitee.com', name: 'Gitee', comment: '码云' },
  
  // 云服务厂商
  { domain: 'aliyun.com', name: '阿里云', comment: '云计算服务' },
  { domain: 'alibabacloud.com', name: '阿里云国际', comment: '阿里云国际站' },
  { domain: 'cloud.baidu.com', name: '百度智能云', comment: '百度云服务' },
  { domain: 'cloud.tencent.com', name: '腾讯云', comment: '腾讯云服务' },
  { domain: 'volcengine.com', name: '火山引擎', comment: '字节跳动云' },
  
  // AI大模型开发平台
  { domain: 'qianfan.cloud.baidu.com', name: '千帆', comment: '百度大模型平台' },
  
  // AI大模型与工具
  { domain: 'chat.deepseek.com', name: 'DeepSeek', comment: 'AI助手' },
  { domain: 'doubao.com', name: '豆包', comment: '字节跳动AI' },
  { domain: 'www.doubao.com', name: '豆包', comment: '字节跳动AI' },
  { domain: 'chat.openai.com', name: 'ChatGPT', comment: 'OpenAI AI' },
  { domain: 'chatgpt.com', name: 'ChatGPT', comment: 'OpenAI AI' },
  { domain: 'tongyi.aliyun.com', name: '通义千问', comment: '阿里巴巴AI' },
  { domain: 'yiyan.baidu.com', name: '文心一言', comment: '百度AI' },
  { domain: 'kimi.moonshot.cn', name: 'Kimi', comment: '月之暗面AI' },
  { domain: 'chatglm.cn', name: '智谱清言', comment: '智谱AI' },
  { domain: 'yuanbao.tencent.com', name: '腾讯元宝', comment: '腾讯AI' },
  { domain: 'xinghuo.xfyun.cn', name: '讯飞星火', comment: '科大讯飞AI' },
  { domain: 'hailuoai.com', name: '海螺AI', comment: 'MiniMax AI' },
  { domain: 'tiangong.cn', name: '天工AI', comment: '昆仑万维AI' },
  { domain: 'chat.baichuan-ai.com', name: '百小应', comment: '百川智能AI' },
  { domain: 'chat.sensetime.com', name: '商量', comment: '商汤科技AI' },
  { domain: 'yuewen.cn', name: '跃问', comment: '阶跃星辰AI' },
  { domain: 'gemini.google.com', name: 'Gemini', comment: 'Google AI' },
  { domain: 'claude.ai', name: 'Claude', comment: 'Anthropic AI' },
  { domain: 'deepseek.com', name: 'DeepSeek', comment: '深度求索AI' },
  
  // AI绘画/图像设计
  { domain: 'yige.baidu.com', name: '文心一格', comment: '百度AI绘画' },
  { domain: 'tongyi.aliyun.com/wanxiang', name: '通义万相', comment: '阿里AI绘画' },
  { domain: 'jimeng.jianying.com', name: '即梦AI', comment: '字节AI绘画' },
  { domain: 'liblib.art', name: 'LiblibAI', comment: 'AI绘画' },
  { domain: 'd.design', name: '堆友', comment: '阿里AI设计' },
  { domain: 'flux-art.cn', name: 'Flux Art', comment: 'AI绘画' },
  { domain: 'midjourney.com', name: 'Midjourney', comment: 'AI绘画' },
  { domain: 'openai.com/dall-e-3', name: 'DALL-E 3', comment: 'OpenAI绘画' },
  { domain: 'stability.ai', name: 'Stable Diffusion', comment: 'AI绘画' },
  
  // AI视频/数字人
  { domain: 'klingai.kuaishou.com', name: '可灵AI', comment: '快手AI视频' },
  { domain: 'capcut.cn', name: '剪映', comment: '视频编辑' },
  
  // AI编程/开发
  { domain: 'copilot.tencent.com', name: 'CodeBuddy', comment: '腾讯AI编程' },
  { domain: 'tongyi.aliyun.com/lingma', name: '通义灵码', comment: '阿里AI编程' },
  { domain: 'trae.cn', name: 'Trae', comment: '字节AI编程' },
  { domain: 'github.com/features/copilot', name: 'GitHub Copilot', comment: 'AI编程助手' },
  
  // AI办公/写作/效率
  { domain: 'ai.wps.cn', name: 'WPS AI', comment: '金山办公AI' },
  { domain: 'xiezuocat.com', name: '秘塔写作猫', comment: 'AI写作' },
  { domain: 'fanyi.baidu.com', name: '百度翻译AI', comment: 'AI翻译' },
  { domain: 'notebooklm.google', name: 'NotebookLM', comment: 'Google AI笔记' },
  
  // AI搜索
  { domain: 'quark.cn', name: '夸克', comment: '阿里AI搜索' },
  
  // 其他
  { domain: 'xiaomi.com', name: '小米', comment: '科技公司' },
  { domain: 'ximalaya.com', name: '喜马拉雅', comment: '音频平台' },
  { domain: 'wikipedia.org', name: '维基百科', comment: '百科全书' },
  { domain: 'apple.com', name: '苹果', comment: 'Apple官网' },
  { domain: 'microsoft.com', name: '微软', comment: 'Microsoft官网' },
  { domain: 'yahoo.com', name: '雅虎', comment: '门户网站' }
];

const existingConfig = JSON.parse(fs.readFileSync('./config/domain-config.json', 'utf-8'));

const domainMap = new Map();

existingConfig.forEach(entry => {
  domainMap.set(entry.domain.toLowerCase(), entry);
});

newDomains.forEach(entry => {
  const key = entry.domain.toLowerCase();
  if (!domainMap.has(key)) {
    domainMap.set(key, entry);
  }
});

const merged = Array.from(domainMap.values());

merged.sort((a, b) => a.domain.localeCompare(b.domain));

fs.writeFileSync('./config/domain-config.json', JSON.stringify(merged, null, 2));

console.log(`✅ 合并完成！共 ${merged.length} 条域名记录`);
