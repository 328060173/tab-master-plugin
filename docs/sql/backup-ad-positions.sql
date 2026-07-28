-- =====================================================================
-- 标签备份独立页 4 个广告位初始数据（2026-07-28 立）
-- =====================================================================
-- 表：ouu_advertisement
-- 查询条件（selectEffectiveAdList，OuuAdvertisementMapper.xml）：
--   status = 1
--   AND platform = #{platform}            -- 请求头 platform（1=Web浏览器插件）
--   AND app_code = #{appCode}             -- 请求头 appCode（app_1001=tabMaster）
--   AND position = #{position}            -- 广告位标识
--   AND start_time <= NOW()
--   AND (end_time IS NULL OR end_time >= NOW())
--   ORDER BY sort DESC
--
-- platform / app_code 取值依据（已核实后端 Constants + 插件 lib/api-config.ts）：
--   platform = 1    —— Constants.HEAD_APP_PLATFORM：1=Web浏览器插件 2=iOS 3=Android 4=微信小程序
--                      插件 APP_HEADERS.platform = 1（lib/api-config.ts）
--   app_code = 'app_1001' —— APP_CODES.tabMaster = 'app_1001'（lib/api-config.ts）
--                      mapper SQL 用 AND app_code = #{appCode}（精确匹配，0/全部 不生效）
--
-- ⚠️ 部署前请替换：
--   1. image_url：当前为占位地址 https://www.ouu365.com/ad/*.png，请替换为实际广告素材地址
--   2. link_url：当前为官网首页占位，请替换为实际广告落地页
--   3. duration：当前 5 秒，按实际投放策略调整
--   4. start_time / end_time：当前 start_time=NOW() 立即生效，end_time=NULL 长期有效；
--      如需限定投放时段，按 'YYYY-MM-DD HH:MM:SS' 格式填 end_time
-- =====================================================================

INSERT INTO ouu_advertisement
  (title, image_url, link_url, duration, position, platform, app_code, sort, status, start_time, end_time, create_by, create_time, remark)
VALUES
  ('标签备份·概览广告', 'https://www.ouu365.com/ad/backup-overview.png', 'https://www.ouu365.com', 5, 'backup-overview', 1, 'app_1001', 1, 1, NOW(), NULL, 'admin', NOW(), '备份概览页主广告位'),
  ('标签备份·侧栏广告', 'https://www.ouu365.com/ad/backup-sidebar.png', 'https://www.ouu365.com', 5, 'backup-sidebar', 1, 'app_1001', 1, 1, NOW(), NULL, 'admin', NOW(), '左菜单底部辅广告位'),
  ('标签备份·列表广告', 'https://www.ouu365.com/ad/backup-list.png',    'https://www.ouu365.com', 5, 'backup-list',    1, 'app_1001', 1, 1, NOW(), NULL, 'admin', NOW(), '备份列表页底部广告位'),
  ('标签备份·导入广告', 'https://www.ouu365.com/ad/backup-import.png',  'https://www.ouu365.com', 5, 'backup-import',  1, 'app_1001', 1, 1, NOW(), NULL, 'admin', NOW(), '导入管理页底部广告位');
