# 装扮资源生成描述（喂大模型用）

> 本文件**只描述图片资源**，供用户用大模型/AI 工具生成图片。不含定价、方案、表结构。
> 12 套主题 + 8 款头像框。每张图给：尺寸/格式/体积/画布/内容/色彩/透明度/AI prompt。

## 主题清单（12 套）

| # | 成品名 | 系列 | 需背景图？ |
|---|---|---|---|
| 1 | 春樱初绽 | 季节·春 | ✅ 樱花 |
| 2 | 盛夏清荷 | 季节·夏 | ✅ 荷塘 |
| 3 | 金秋满陇 | 季节·秋 | ✅ 枫叶 |
| 4 | 暖冬初雪 | 季节·冬 | ✅ 雪景 |
| 5 | 星河璀璨 | 风景·星空 | ✅ 星空 |
| 6 | 碧海潮生 | 风景·海浪 | ✅ 海浪 |
| 7 | 原野牧风 | 风景·草原 | ✅ 草原 |
| 8 | 护眼墨绿 | 风景·护眼 | ❌ CSS纯色 |
| 9 | 极简纯白 | 风景·纯色 | ❌ CSS纯色 |
| 10 | 晴川芳洲 | 风景·晴川 | ✅ 山川 |
| 11 | 暗夜深渊 | 风格·暗黑 | ❌ CSS纯色 |
| 12 | 软萌奶霜 | 风格·可爱 | ✅ 奶霜云朵 |

> 待 PM 填充每张图的极细致描述（见下）。

## 头像框清单（8 款）

| # | 成品名 | 需图？ |
|---|---|---|
| 1 | 铜质光环 | ✅ PNG |
| 2 | 翠竹青 | ✅ PNG |
| 3 | 银浪纹 | ✅ PNG |
| 4 | 樱粉丝带 | ✅ PNG |
| 5 | 星辰银 | ✅ PNG |
| 6 | 金桂冠 | ✅ PNG |
| 7 | 彩虹流光 | ❌ CSS动画 |
| 8 | 百日签到专属 | ✅ PNG |

> 待 PM 填充每张图的极细致描述（见下）。

---

<!-- PM 在下方填充每张图的极细致描述 -->

---

## 一、头像框 PNG（7 张，统一规格：144×144 / 透明 PNG / ≤45KB / 中心透明圆 86px / 圆心 72,72）

### 1. `frame-bronze-100.png` — 铜质光环

| 字段 | 内容 |
|---|---|
| 文件名 | `frame-bronze-100.png` |
| 尺寸 | 144 × 144 px |
| 格式 | PNG（透明背景） |
| 体积上限 | ≤45 KB |
| 画布 | 完全透明 alpha=0 |
| 构图 | 正圆环居中，圆心位于 (72, 72)，环外径 144px 满画布，环内径 120px（环宽 12px，含外柔光过渡 2px，实金属带 8px，内柔光过渡 2px） |
| 形状 | 圆环，外缘径 144、内缘径 120，中心透明圆直径 120px（≥86px 透明要求，保留更多留白确保头像不被遮挡） |
| 色彩 | 主体铜色线性渐变：#8a4a1f → #c2722e → #e0a45a → #c2722e → #6b3818（沿环周向走，深-亮-深），高光点 #f0c98a |
| 装饰元素 | 无附加装饰，仅在 11 点钟方向有一处亮带高光（宽 18px、长 30px 弧段），表现金属反光 |
| 文字 | 无 |
| 质感 | 抛光铜金属，半哑光，带微弱径向高光，无噪点 |
| 透明度/留白 | 中心圆 α=0 完全透出头像；环外无羽化散边，边缘干净硬切（便于叠加于任意背景） |
| AI prompt (中) | 一个铜色金属圆环头像框，144×144像素，透明背景PNG，环宽8像素实金属带外径144内径120，铜色径向渐变#c2722e主色带高光#f0c98a，抛光铜质感半哑光，11点钟方向有亮带高光，无装饰无文字，中心圆完全透明 |
| AI prompt (EN) | circular bronze metal avatar frame, 144x144 px, transparent PNG background, ring outer diameter 144 inner diameter 120, polished copper with linear gradient #8a4a1f-#c2722e-#e0a45a, highlight #f0c98a at 11 o'clock, semi-matte metallic finish, no decorations no text, fully transparent center, clean hard edges |

### 2. `frame-bamboo-green-100.png` — 翠竹青

| 字段 | 内容 |
|---|---|
| 文件名 | `frame-bamboo-green-100.png` |
| 尺寸 | 144 × 144 px |
| 格式 | PNG（透明背景） |
| 体积上限 | ≤45 KB |
| 画布 | 完全透明 alpha=0 |
| 构图 | 正圆环居中，圆心 (72, 72)，环外径 142、内径 124（环宽 9px 实带 + 两侧各 1.5px 柔光），中心透明圆直径 124px |
| 形状 | 圆环，环带轻微竹节纹理（环周每 30° 一道极淡竖向凹线，共 12 道） |
| 色彩 | 竹青渐变：#65a30d → #4d7c0f → #15803d → #4d7c0f → #365314，高光 #a3e635 |
| 装饰元素 | 环上 4 片小竹叶，分别在 2 点、5 点、8 点、11 点钟方向；每片叶长约 14px、宽约 5px，叶尖向外伸出环外 6px；叶色正面 #65a30d、叶脉 #84cc16、叶背 #3f6212 |
| 文字 | 无 |
| 质感 | 玉质竹青，微透光，叶片为扁平磨砂质感，无金属反光 |
| 透明度/留白 | 中心圆 α=0；竹叶超出环外的部分保持锐利边缘，无散边 |
| AI prompt (中) | 竹青色玉质圆环头像框，144×144像素透明PNG，环外径142内径124环宽9，竹青渐变#65a30d到#15803d带高光#a3e635，环周12道极淡竹节凹线，环上2/5/8/11点钟方向各一片小竹叶叶长14px向外伸6px，叶色#65a30d叶脉#84cc16，无文字，中心透明 |
| AI prompt (EN) | jade bamboo-green circular avatar frame, 144x144 px transparent PNG, ring OD 142 ID 124 width 9, gradient #65a30d-#4d7c0f-#15803d with highlight #a3e635, 12 subtle bamboo joint grooves around ring, four small bamboo leaves at 2/5/8/11 o'clock positions leaf length 14px extending 6px outward, leaf #65a30d vein #84cc16, no text, fully transparent center |

### 3. `frame-silver-wave-100.png` — 银浪纹

| 字段 | 内容 |
|---|---|
| 文件名 | `frame-silver-wave-100.png` |
| 尺寸 | 144 × 144 px |
| 格式 | PNG（透明背景） |
| 体积上限 | ≤45 KB |
| 画布 | 完全透明 alpha=0 |
| 构图 | 正圆环居中，圆心 (72, 72)，环外径 143、内径 123（环宽 10px 实带），中心透明圆直径 123px |
| 形状 | 圆环，环带表面有连续波浪纹理：8 组等距正弦波沿环周向流动，每组波长 56px、振幅 2.5px，波峰略亮波谷略暗 |
| 色彩 | 银色渐变：#e2e8f0 → #cbd5e1 → #94a3b8 → #cbd5e1 → #e2e8f0（环周向），波峰高光 #f8fafc、波谷阴影 #64748b |
| 装饰元素 | 无附加装饰，纹理即装饰；3 点钟方向有一处镜面亮带高光（弧长 24px） |
| 文字 | 无 |
| 质感 | 抛光液态银，金属冷光，带流动感，无噪点 |
| 透明度/留白 | 中心圆 α=0；波浪仅作用于环带表面，不外溢环外 |
| AI prompt (中) | 银色液态金属圆环头像框，144×144像素透明PNG，环外径143内径123环宽10，银色渐变#e2e8f0到#94a3b8带高光#f8fafc阴影#64748b，环表面8组等距正弦波纹波峰亮波谷暗流动感，3点钟方向镜面高光，无附加装饰无文字，中心透明 |
| AI prompt (EN) | liquid silver circular avatar frame, 144x144 px transparent PNG, ring OD 143 ID 123 width 10, silver gradient #e2e8f0-#cbd5e1-#94a3b8 with highlight #f8fafc and shadow #64748b, 8 evenly-spaced sine wave ripples on ring surface brighter crests darker troughs flowing feel, mirror highlight at 3 o'clock, no decorations no text, fully transparent center |

### 4. `frame-sakura-ribbon-100.png` — 樱粉丝带

| 字段 | 内容 |
|---|---|
| 文件名 | `frame-sakura-ribbon-100.png` |
| 尺寸 | 144 × 144 px |
| 格式 | PNG（透明背景） |
| 体积上限 | ≤45 KB |
| 画布 | 完全透明 alpha=0 |
| 构图 | 正圆环居中，圆心 (72, 72)，环外径 142、内径 122（环宽 10px 实带），中心透明圆直径 122px；顶部 12 点钟方向斜绑一根丝带并打蝴蝶结，蝴蝶结超出画布上沿 0px（贴边但不裁切） |
| 形状 | 圆环主体 + 顶部斜绑丝带（与水平面呈 25° 角，从 11 点钟向 1 点钟方向跨过）+ 蝴蝶结（两耳 + 中心结 + 两条飘带尾） |
| 色彩 | 粉色渐变：#f9a8d4 → #f472b6 → #ec4899 → #f472b6 → #f9a8d4，蝴蝶结高光 #fbcfe8、阴影 #be185d；丝带本体同渐变 |
| 装饰元素 | ① 蝴蝶结居中于 12 点钟，左耳宽 16px 高 12px、右耳同尺寸、中心结 5×7px 椭圆；② 两条飘带尾从中心结向下沿环外侧延伸至 1 点和 11 点钟方向，长 22px、宽 5px，末端剪成 V 形燕尾；③ 蝴蝶结左耳上贴一朵 6px 樱花五瓣小花 |
| 文字 | 无 |
| 质感 | 缎面丝带，柔光高亮，无金属反光，丝带边缘略带柔焦 |
| 透明度/留白 | 中心圆 α=0；蝴蝶结与飘带超出环外的部分保持锐利轮廓 |
| AI prompt (中) | 樱粉色缎面丝带圆环头像框，144×144像素透明PNG，环外径142内径122环宽10，粉色渐变#f9a8d4到#ec4899高光#fbcfe8阴影#be185d，顶部12点钟斜绑丝带与水平25度角跨11到1点钟方向，蝴蝶结两耳各16x12px中心结5x7椭圆，两条飘带尾长22px宽5px燕尾V形末端，左耳贴6px五瓣樱花，缎面柔光质感无文字中心透明 |
| AI prompt (EN) | cherry-blossom pink satin ribbon circular avatar frame, 144x144 px transparent PNG, ring OD 142 ID 122 width 10, pink gradient #f9a8d4-#f472b6-#ec4899 highlight #fbcfe8 shadow #be185d, ribbon crossing top at 25 degrees from 11 to 1 o'clock with bowknot at 12 o'clock, bow ears 16x12px each knot 5x7px, two ribbon tails 22x5px with V-cut swallow ends along ring outer edge to 11 and 1 o'clock, a 6px five-petal sakura flower on left bow ear, satin soft sheen, no text, fully transparent center |

### 5. `frame-stardust-silver-100.png` — 星辰银

| 字段 | 内容 |
|---|---|
| 文件名 | `frame-stardust-silver-100.png` |
| 尺寸 | 144 × 144 px |
| 格式 | PNG（透明背景） |
| 体积上限 | ≤45 KB |
| 画布 | 完全透明 alpha=0 |
| 构图 | 正圆环居中，圆心 (72, 72)，环外径 144、内径 122（环宽 11px 实带 + 外侧 2px 星光晕染），中心透明圆直径 122px |
| 形状 | 圆环，环带为深紫银渐变，环周上等距分布 6 颗小星点，每颗星点向外发光 |
| 色彩 | 深紫银渐变：#94a3b8 → #64748b → #4c1d95 → #64748b → #94a3b8（环周向）；星点白 #f8fafc、星点光晕 #c4b5fd |
| 装饰元素 | 6 颗四角小星点，分别在 1、3、5、7、9、11 点钟方向；每颗星点中心直径 3px、四角光芒各延伸 4px、外圈光晕直径 8px 柔光；6 颗大小一致 |
| 文字 | 无 |
| 质感 | 银灰金属底 + 星点发光特效，环带略带磨砂，星点为高亮发光体 |
| 透明度/留白 | 中心圆 α=0；星点光晕可外溢环外 4px，但保持柔和不脏 |
| AI prompt (中) | 深紫银色圆环头像框，144×144像素透明PNG，环外径144内径122环宽11外侧2px星光晕染，深紫银渐变#94a3b8到#4c1d95环周向，环上1/3/5/7/9/11点钟方向各一颗四角小星点中心3px光芒4px外晕8px柔光色#c4b5fd星点白#f8fafc，银灰磨砂底加发光星点无文字中心透明 |
| AI prompt (EN) | deep purple-silver circular avatar frame, 144x144 px transparent PNG, ring OD 144 ID 122 width 11 with 2px outer starlight bloom, gradient #94a3b8-#64748b-#4c1d95-#64748b-#94a3b8 around ring, six four-point small stars at 1/3/5/7/9/11 o'clock each center 3px rays 4px outer glow 8px soft halo color #c4b5fd star core #f8fafc, silver-grey matte base with glowing stars, no text, fully transparent center |

### 6. `frame-laurel-gold-100.png` — 金桂冠

| 字段 | 内容 |
|---|---|
| 文件名 | `frame-laurel-gold-100.png` |
| 尺寸 | 144 × 144 px |
| 格式 | PNG（透明背景） |
| 体积上限 | ≤45 KB |
| 画布 | 完全透明 alpha=0 |
| 构图 | 正圆环居中，圆心 (72, 72)，环外径 144、内径 120（环宽 12px 实带），中心透明圆直径 120px；顶部 12 点钟方向有月桂枝叶左右各一枝向上拱起，呈桂冠造型 |
| 形状 | 圆环 + 顶部两枝月桂枝（左枝从 10 点钟起向 12 点钟拱起、右枝从 2 点钟起向 12 点钟拱起，两枝在顶部交汇不重叠，留 4px 缝隙） |
| 色彩 | 金色金属渐变：#fbbf24 → #f59e0b → #d97706 → #f59e0b → #fbbf24（环周向），高光 #fef3c7、阴影 #92400e；月桂枝叶同金色渐变 |
| 装饰元素 | ① 左枝长 38px、含 5 片椭圆叶（每片 10×6px，沿枝呈 45° 排列），枝条本体宽 2px；② 右枝镜像对称；③ 两枝交汇处顶部贴一颗 6px 五角星（金色描边 #92400e、内填 #fef3c7）；④ 环底部 6 点钟方向贴一片小金叶 8×5px 作收尾 |
| 文字 | 无 |
| 质感 | 抛光金色金属，亮面反光，叶面带叶脉刻线 |
| 透明度/留白 | 中心圆 α=0；月桂枝超出环外约 18px，保持锐利轮廓，无散边 |
| AI prompt (中) | 金色金属月桂冠圆环头像框，144×144像素透明PNG，环外径144内径120环宽12，金色渐变#fbbf24到#d97706高光#fef3c7阴影#92400e，顶部12点钟左右各一枝月桂枝左枝从10点钟起右枝从2点钟起向顶部拱起交汇留4px缝，每枝长38px含5片椭圆叶10x6px呈45度排列枝宽2px，交汇处顶贴6px五角星金描边#92400e内填#fef3c7，环底6点钟贴8x5px小金叶，抛光金属亮面带叶脉刻线无文字中心透明 |
| AI prompt (EN) | golden laurel crown circular avatar frame, 144x144 px transparent PNG, ring OD 144 ID 120 width 12, gold gradient #fbbf24-#f59e0b-#d97706 highlight #fef3c7 shadow #92400e, two laurel branches at top arching from 10 and 2 o'clock to 12 o'clock meeting with 4px gap, each branch 38px long with 5 oval leaves 10x6px at 45 degrees stem 2px, a 6px five-point star at apex with gold outline #92400e fill #fef3c7, a small 8x5px gold leaf at 6 o'clock bottom, polished metallic bright finish with leaf vein engraving, no text, fully transparent center |

### 7. `frame-checkin-100-100.png` — 百日签到专属

| 字段 | 内容 |
|---|---|
| 文件名 | `frame-checkin-100-100.png` |
| 尺寸 | 144 × 144 px |
| 格式 | PNG（透明背景） |
| 体积上限 | ≤45 KB |
| 画布 | 完全透明 alpha=0 |
| 构图 | 正圆环居中，圆心 (72, 72)，环外径 144、内径 120（环宽 12px 实带），中心透明圆直径 120px；环周等距分布 12 颗小星点；顶部 12 点钟方向一颗大星；底部 6 点钟方向居中印"100"字样 |
| 形状 | 圆环 + 顶部大星 + 底部数字徽标 |
| 色彩 | 深金光泽渐变：#fde68a → #fbbf24 → #b45309 → #fbbf24 → #fde68a（环周向），高光 #fffbeb、阴影 #78350f；大星 #fbbf24 描边 #78350f；数字"100" 字色 #78350f、描边 #fde68a 1px |
| 装饰元素 | ① 12 颗小星点等距分布（每 30° 一颗，避开 12 点和 6 点位置，即位于 1/2/4/5/7/8/10/11 点钟… 实为避开顶底各 30°范围，共 10 颗位于环两侧 + 顶部大星下方两侧各 1 颗合计 12 颗）；每颗小星中心 2px、四角光芒 2.5px；② 顶部大星：五角星，外接圆直径 18px，金色填充带深金描边，居中 12 点钟方向贴在环外侧顶部；③ 底部"100"：位于 6 点钟方向环带正中，字号 14px 加粗无衬线（Inter/Arial Black 风格），字色深金 #78350f、外描边 #fde68a 1px，三字符总宽约 24px，垂直居中于环带 |
| 文字 | "100" — 加粗无衬线数字，14px，字色 #78350f，1px #fde68a 描边，位于 6 点钟方向环带正中 |
| 质感 | 深金抛光金属，带光泽流动感，星点发光，数字浮雕凸起 |
| 透明度/留白 | 中心圆 α=0；大星超出环外约 9px；数字"100"位于环带内不外溢 |
| AI prompt (中) | 深金光泽圆环头像框百日签到专属，144×144像素透明PNG，环外径144内径120环宽12，深金渐变#fde68a到#b45309高光#fffbeb阴影#78350f，环周12颗小星点等距分布每颗中心2px光芒2.5px避开顶底30度范围，顶部12点钟大五角星外接圆18px金色#fbbf24描边#78350f贴环外侧超出9px，底部6点钟环带正中印数字100字号14px加粗无衬线字色#78350f描边#fde68a 1px三字符总宽24px，深金抛光金属星点发光数字浮雕无其它文字中心透明 |
| AI prompt (EN) | deep gold lustrous circular avatar frame for 100-day check-in exclusive, 144x144 px transparent PNG, ring OD 144 ID 120 width 12, deep gold gradient #fde68a-#fbbf24-#b45309 highlight #fffbeb shadow #78350f, 12 small stars evenly around ring each center 2px rays 2.5px avoiding top/bottom 30 deg zones, large five-point star at 12 o'clock circumscribed 18px gold #fbbf24 outline #78350f protruding 9px above ring, numeral "100" at 6 o'clock ring center font 14px bold sans-serif color #78350f stroke #fde68a 1px total width 24px, polished deep gold metal with glowing stars and embossed numeral, no other text, fully transparent center |

---

## 二、主题背景图 WebP（9 张，统一规格：1920×1080 / WebP / ≤45KB / cover 横版 / 显示透明度 0.06 → 颜色饱和 / 右下角留空）

> 通用要求：因最终在页面上以 alpha=0.06 显示，**色彩饱和度必须高**，避免淡到看不出；右下角 600×400 px 区域留空（仅底色或虚化元素），避免被侧边栏卡片遮挡。

### 1. `bg-sakura-spring.webp` — 春樱初绽

| 字段 | 内容 |
|---|---|
| 文件名 | `bg-sakura-spring.webp` |
| 尺寸 | 1920 × 1080 px |
| 格式 | WebP |
| 体积上限 | ≤45 KB |
| 画布 | 不透明，整体浅粉色基底 #fce7f3 |
| 构图 | 左上角一枝樱花树枝斜伸入画（从画外左上 0,0 进入，主干延伸至画布中心偏左 800,500 处分叉），枝上挂 8-10 簇樱花；画面中漂浮 20+ 飘落花瓣（大小不一 6-18px），分布散落于全画；右下角 600×400 留空仅浅粉底色 |
| 主体元素 | ① 樱花树枝：深褐色 #57534e，主干粗 8px、分枝粗 3-4px；② 樱花簇：每簇 5-8 朵五瓣小花，单朵直径 12-16px，花瓣主色 #fbcfe8 渐变到 #f9a8d4，花蕊 #f472b6 点；③ 飘落花瓣：单瓣椭圆形 6-18px，色 #fbcfe8 / #f9a8d4 / #f472b6 三色混搭，半透明 0.7 |
| 色彩 | 基底 #fce7f3；樱花主色 #fbcfe8 → #f9a8d4 → #f472b6；枝干 #57534e；高光 #fdf2f8 |
| 装饰元素 | 飘落花瓣（见上）；2-3 个浅 #ffffff 光斑直径 30-60px 散布 |
| 文字 | 无 |
| 质感 | 水彩晕染风格，柔和朦胧，无锐利边缘 |
| 透明度/留白 | 右下角 600×400 px 留空（仅 #fce7f3 底色 + 极淡虚化花瓣 0.2 透明度）；色彩饱和度需高（最终页面 0.06 显示，仍能辨出粉色） |
| AI prompt (中) | 春樱花枝水彩背景图，1920x1080像素WebP，浅粉基底#fce7f3，左上角樱花树枝斜伸入画深褐#57534e主干8px分枝3-4px至画布中心偏左分叉，枝上8-10簇樱花每簇5-8朵五瓣花单朵12-16px花瓣#fbcfe8渐变#f9a8d4花蕊#f472b6，画面散落20+飘落花瓣6-18px三色#fbcfe8#f9a8d4#f472b6半透明0.7，2-3个白色光斑30-60px，右下角600x400留空仅底色，水彩晕染柔和朦胧饱和度高无文字 |
| AI prompt (EN) | spring sakura watercolor background, 1920x1080 px WebP, light pink base #fce7f3, a cherry branch entering from upper-left dark brown #57534e trunk 8px branches 3-4px reaching center-left and forking, 8-10 blossom clusters each 5-8 five-petal flowers single 12-16px petals #fbcfe8 to #f9a8d4 stamen #f472b6, 20+ falling petals 6-18px in three colors #fbcfe8 #f9a8d4 #f472b6 at 0.7 opacity, 2-3 white light spots 30-60px, bottom-right 600x400 empty only base color, soft watercolor blurred feel highly saturated, no text |

### 2. `bg-lotus-summer.webp` — 盛夏清荷

| 字段 | 内容 |
|---|---|
| 文件名 | `bg-lotus-summer.webp` |
| 尺寸 | 1920 × 1080 px |
| 格式 | WebP |
| 体积上限 | ≤45 KB |
| 画布 | 不透明，翠绿水波基底 #ecfccb → #d9f99d 上下渐变 |
| 构图 | 下半部 1/2 为荷塘水面，铺 3-4 片大荷叶（直径 200-320px）于左下、中下、右下偏中；2 朵荷花挺立画面中部偏左（茎从水面伸出，花头在 600,500 与 750,560）；右下角 600×400 留空仅水波底色 |
| 主体元素 | ① 荷叶：圆形带缺口，主色 #65a30d → #4d7c0f 径向渐变，叶脉 #84cc16 细线放射状；② 荷花：五瓣盛开，花瓣 #fdf2f8 → #fbcfe8 → #f9a8d4 渐变，花蕊 #fbbf24 黄色点状；③ 水面波纹：浅 #bbf7d0 横向弧线 1px 宽，5-6 道分布下半部 |
| 色彩 | 基底 #ecfccb → #d9f99d；荷叶 #65a30d → #4d7c0f；荷花 #fdf2f8 → #f9a8d4；水波 #bbf7d0 |
| 装饰元素 | 水面波纹（见上）；3-5 片小荷叶 30-50px 散落水面 |
| 文字 | 无 |
| 质感 | 工笔重彩与水彩结合，色彩浓郁饱和，叶面有光感 |
| 透明度/留白 | 右下角 600×400 留空仅底色渐变；饱和度高（页面 0.06 显示仍能辨翠绿粉白） |
| AI prompt (中) | 盛夏荷塘工笔水彩背景图，1920x1080像素WebP，翠绿水波基底#ecfccb到#d9f99d上下渐变，下半部荷塘3-4片大荷叶直径200-320px铺左下中下右下偏中叶色#65a30d径向渐变#4d7c0f叶脉#84cc16放射状，2朵荷花挺立画面中部偏左茎从水面伸出花头在600,500与750,560五瓣盛开花瓣#fdf2f8渐变#fbcfe8到#f9a8d4花蕊#fbbf24，水面波纹浅#bbf7d0横向弧线1px宽5-6道，3-5片小荷叶30-50px散落，右下角600x400留空仅底色，工笔重彩色彩浓郁饱和无文字 |
| AI prompt (EN) | summer lotus pond gongbi watercolor background, 1920x1080 px WebP, green water base #ecfccb to #d9f99d vertical gradient, lower half pond with 3-4 large lotus leaves 200-320px diameter at lower-left/center-lower/mid-right leaves #65a30d radial gradient to #4d7c0f veins #84cc16 radiating, two blooming lotus flowers mid-left stems rising from water heads at 600,500 and 750,560 five petals #fdf2f8 to #fbcfe8 to #f9a8d4 stamen #fbbf24, water ripples light #bbf7d0 horizontal arcs 1px 5-6 lines, 3-5 small leaves 30-50px scattered, bottom-right 600x400 empty only base, rich saturated gongbi colors, no text |

### 3. `bg-maple-autumn.webp` — 金秋满陇

| 字段 | 内容 |
|---|---|
| 文件名 | `bg-maple-autumn.webp` |
| 尺寸 | 1920 × 1080 px |
| 格式 | WebP |
| 体积上限 | ≤45 KB |
| 画布 | 不透明，暖橘金基底 #fef3c7 → #fde68a |
| 构图 | 左侧 1/3 一棵枫树主干从画外伸入（主干粗 16px，从 0,300 进入延伸至 500,600 分三叉），枝上挂 15+ 枫叶簇；画面全幅飘落 30+ 枫叶（10-24px 五角形）；右下角 600×400 留空 |
| 主体元素 | ① 枫树主干：深褐 #57534e，树皮纹理 #44403c 细线；② 枫叶簇：每簇 4-6 片五角枫叶，单叶 14-24px，色 #f97316 → #ea580c → #dc2626 三色混搭，叶脉 #92400e；③ 飘落枫叶：单叶 10-24px 五角形，色 #fbbf24 / #f97316 / #dc2626 / #b91c1c 混搭，旋转角度随机 |
| 色彩 | 基底 #fef3c7 → #fde68a；枫叶 #fbbf24 / #f97316 / #dc2626 / #b91c1c；枝干 #57534e |
| 装饰元素 | 飘落枫叶（见上）；3-4 处光斑 #fef9c3 40-80px |
| 文字 | 无 |
| 质感 | 油画质感笔触，浓郁暖色调，叶面有光泽 |
| 透明度/留白 | 右下角 600×400 留空仅底色；饱和度高 |
| AI prompt (中) | 金秋枫树油画背景图，1920x1080像素WebP，暖橘金基底#fef3c7到#fde68a，左侧1/3枫树主干从画外伸入粗16px从0,300到500,600分三叉深褐#57534e树皮纹理#44403c，枝上15+枫叶簇每簇4-6片五角枫叶单叶14-24px色#f97316到#ea580c到#dc2626叶脉#92400e，全幅飘落30+枫叶10-24px五角形色#fbbf24#f97316#dc2626#b91c1c随机旋转，3-4处光斑#fef9c3 40-80px，右下角600x400留空仅底色，油画笔触浓郁暖色饱和无文字 |
| AI prompt (EN) | autumn maple oil-painting background, 1920x1080 px WebP, warm orange-gold base #fef3c7 to #fde68a, left third a maple trunk entering frame 16px thick from 0,300 to 500,600 branching into three dark brown #57534e bark texture #44403c, 15+ leaf clusters each 4-6 five-point maple leaves 14-24px #f97316-#ea580c-#dc2626 veins #92400e, 30+ falling leaves 10-24px five-point in #fbbf24 #f97316 #dc2626 #b91c1c random rotation, 3-4 light spots #fef9c3 40-80px, bottom-right 600x400 empty only base, oil brush strokes rich warm saturated, no text |

### 4. `bg-snow-winter.webp` — 暖冬初雪

| 字段 | 内容 |
|---|---|
| 文件名 | `bg-snow-winter.webp` |
| 尺寸 | 1920 × 1080 px |
| 格式 | WebP |
| 体积上限 | ≤45 KB |
| 画布 | 不透明，冷蓝白基底 #e0f2fe → #bae6fd |
| 构图 | 下部 1/3 为雪覆盖地面（起伏雪丘，从 0,900 至 1920,720 弧线），左侧一棵落雪松树从 200,1080 伸至 200,300；全幅飘雪 60+ 雪花（2-6px 六角形/圆点），大小不一；右下角 600×400 留空仅冷蓝白底 |
| 主体元素 | ① 雪丘：白色 #ffffff 到 #e0f2fe 渐变，柔和弧线起伏；② 松树：三角形层叠 5 层，针叶 #15803d → #166534 深绿，每层覆雪 #ffffff 厚 4px；③ 飘雪：六角形雪花 4-6px 与圆点 2-3px 混合，色 #ffffff 半透明 0.8 |
| 色彩 | 基底 #e0f2fe → #bae6fd；雪 #ffffff；松针 #15803d → #166534 |
| 装饰元素 | 飘雪（见上）；远处 2-3 个虚化雪丘 #f0f9ff 0.5 透明度 |
| 文字 | 无 |
| 质感 | 柔和水彩+少量笔触，冷色调，雪面有微反光 |
| 透明度/留白 | 右下角 600×400 留空仅底色；冷色调仍需饱和度足够（页面 0.06 显示辨出冷蓝白雪） |
| AI prompt (中) | 暖冬初雪水彩背景图，1920x1080像素WebP，冷蓝白基底#e0f2fe到#bae6fd，下部1/3雪覆盖地面起伏雪丘从0,900至1920,720弧线白色#ffffff到#e0f2fe渐变，左侧落雪松树从200,1080伸至200,300三角形5层针叶#15803d到#166534每层覆雪#ffffff厚4px，全幅飘雪60+六角形雪花4-6px与圆点2-3px色#ffffff半透明0.8，远处2-3个虚化雪丘#f0f9ff透明0.5，右下角600x400留空仅冷蓝白底，柔和水彩冷色调饱和无文字 |
| AI prompt (EN) | winter snow watercolor background, 1920x1080 px WebP, cold blue-white base #e0f2fe to #bae6fd, lower third snow-covered rolling hills arc from 0,900 to 1920,720 white #ffffff to #e0f2fe gradient, left side snow-laden pine from 200,1080 to 200,300 triangular 5 layers needles #15803d to #166534 each layer capped with #ffffff 4px snow, 60+ falling snowflakes six-point 4-6px and dots 2-3px #ffffff at 0.8 opacity, 2-3 distant blurred snow hills #f0f9ff at 0.5 opacity, bottom-right 600x400 empty only cold base, soft watercolor cold tones saturated, no text |

### 5. `bg-galaxy-starry.webp` — 星河璀璨

| 字段 | 内容 |
|---|---|
| 文件名 | `bg-galaxy-starry.webp` |
| 尺寸 | 1920 × 1080 px |
| 格式 | WebP |
| 体积上限 | ≤45 KB |
| 画布 | 不透明，深紫蓝夜空基底 #1e1b4b → #312e81 → #1e1b4b |
| 构图 | 全画面深紫蓝夜空，左下至右上斜向一条银河带（带宽 280px，从 0,900 延伸至 1920,200，紫色到粉色渐变 #6d28d9 → #c026d3 → #f9a8d4）；银河带内密集星点 200+；银河外散布 80+ 大星点（1-3px）；右下角 600×400 留空仅深紫底 |
| 主体元素 | ① 银河带：紫粉渐变云气 #6d28d9 → #c026d3 → #f9a8d4 半透明叠加；② 星点：银河内 200+ 个 0.5-2px 白色 #f8fafc 点；银河外 80+ 个 1-3px 星点带十字光芒 4px；③ 3-5 颗大星：直径 6-10px，四角光芒 8-12px，色 #fef3c7 |
| 色彩 | 基底 #1e1b4b → #312e81；银河 #6d28d9 → #c026d3 → #f9a8d4；星点 #f8fafc / #fef3c7 |
| 装饰元素 | 星点（见上）；2-3 处星云团 #7c3aed 50-100px 柔光 |
| 文字 | 无 |
| 质感 | 数字绘画，深邃宇宙感，星点发光，银河朦胧 |
| 透明度/留白 | 右下角 600×400 留空仅深紫底（可保留少量 1px 星点 0.3 透明度）；整体色彩浓郁饱和（页面 0.06 显示仍辨星河） |
| AI prompt (中) | 星河璀璨夜空数字绘画背景图，1920x1080像素WebP，深紫蓝夜空基底#1e1b4b到#312e81到#1e1b4b，左下至右上斜向银河带宽280px从0,900延伸至1920,200紫粉渐变#6d28d9到#c026d3到#f9a8d4半透明叠加，银河内200+星点0.5-2px白色#f8fafc，银河外80+星点1-3px带十字光芒4px，3-5颗大星直径6-10px四角光芒8-12px色#fef3c7，2-3处星云团#7c3aed 50-100px柔光，右下角600x400留空仅深紫底可保留少量1px星点0.3透明度，数字绘画深邃宇宙感星点发光银河朦胧饱和无文字 |
| AI prompt (EN) | galaxy starry night digital painting background, 1920x1080 px WebP, deep purple-blue night base #1e1b4b to #312e81 to #1e1b4b, diagonal Milky Way band 280px wide from 0,900 to 1920,200 purple-pink gradient #6d28d9 to #c026d3 to #f9a8d4 semi-transparent overlay, 200+ stars 0.5-2px white #f8fafc inside band, 80+ stars 1-3px with four-ray cross 4px outside, 3-5 large stars 6-10px with 8-12px rays #fef3c7, 2-3 nebula clusters #7c3aed 50-100px soft glow, bottom-right 600x400 empty only deep purple base with optional 1px stars at 0.3 opacity, digital painting deep cosmos glowing stars hazy galaxy saturated, no text |

### 6. `bg-ocean-wave.webp` — 碧海潮生

| 字段 | 内容 |
|---|---|
| 文件名 | `bg-ocean-wave.webp` |
| 尺寸 | 1920 × 1080 px |
| 格式 | WebP |
| 体积上限 | ≤45 KB |
| 画布 | 不透明，海蓝基底 #bae6fd → #0284c7 上下渐变 |
| 构图 | 上部 1/3 为天空（浅蓝 #bae6fd 至 #7dd3fc），下部 2/3 为海面，海面有 4-5 道横向波浪（弧线起伏），波浪顶端有白色浪花飞溅；左下角一处大浪卷起高 200px；右下角 600×400 留空仅海蓝底 |
| 主体元素 | ① 海面：渐变 #38bdf8 → #0284c7 → #075985 由上至下加深；② 波浪：白色 #ffffff 弧线带宽 6-12px，5 道横向分布；③ 浪花：白色 #ffffff 不规则点状 5-20px 散布波峰；④ 左下大浪：卷曲弧形高 200px 宽 280px，白色浪头带 #e0f2fe 阴影 |
| 色彩 | 基底 #bae6fd → #0284c7；海 #38bdf8 → #075985；浪花 #ffffff / #e0f2fe |
| 装饰元素 | 浪花飞溅（见上）；2-3 只海鸥剪影 #1e3a8a 8-12px 在天空上部 |
| 文字 | 无 |
| 质感 | 水彩+矢量结合，海面有光感，浪花动感飞溅 |
| 透明度/留白 | 右下角 600×400 留空仅海蓝底渐变；饱和度高（页面 0.06 显示仍辨蓝白海浪） |
| AI prompt (中) | 碧海潮生水彩背景图，1920x1080像素WebP，海蓝基底#bae6fd到#0284c7上下渐变，上部1/3天空浅蓝#bae6fd到#7dd3fc，下部2/3海面渐变#38bdf8到#0284c7到#075985由上至下加深，海面4-5道横向波浪白色#ffffff弧线带宽6-12px，波峰白色浪花5-20px散布，左下角大浪卷曲弧形高200px宽280px白色浪头带#e0f2fe阴影，2-3只海鸥剪影#1e3a8a 8-12px在天空上部，右下角600x400留空仅海蓝底渐变，水彩加矢量海面光感动感浪花饱和无文字 |
| AI prompt (EN) | ocean wave watercolor background, 1920x1080 px WebP, sea blue base #bae6fd to #0284c7 vertical gradient, upper third sky light blue #bae6fd to #7dd3fc, lower two thirds sea gradient #38bdf8 to #0284c7 to #075985 deepening downward, 4-5 horizontal wave bands white #ffffff arc bands 6-12px wide, white foam 5-20px scattered on crests, lower-left large curling wave 200px tall 280px wide white crest with #e0f2fe shadow, 2-3 seagull silhouettes #1e3a8a 8-12px in upper sky, bottom-right 600x400 empty only sea blue gradient, watercolor plus vector sea surface light dynamic spray saturated, no text |

### 7. `bg-grassland-field.webp` — 原野牧风

| 字段 | 内容 |
|---|---|
| 文件名 | `bg-grassland-field.webp` |
| 尺寸 | 1920 × 1080 px |
| 格式 | WebP |
| 体积上限 | ≤45 KB |
| 画布 | 不透明，翠绿基底 #d9f99d → #65a30d |
| 构图 | 下部 1/2 为草地（起伏绿色丘陵），上部 1/2 为蓝天白云，远处中部一条远山轮廓线（位于 0,520 至 1920,540 一带蓝灰色山脊）；3-5 朵白云在上部天空；草地上 8-10 朵小野花点缀；右下角 600×400 留空仅草地底色 |
| 主体元素 | ① 草地：#84cc16 → #65a30d → #4d7c0f 三段渐变由近及远加深，丘陵起伏弧线；② 远山：蓝灰 #94a3b8 → #64748b 山脊线；③ 白云：白色 #ffffff 椭圆云团 60-160px，3-5 朵；④ 野花：5-8px 五瓣小花，色 #fbbf24 / #f472b6 / #f87171 散布草地 |
| 色彩 | 基底 #d9f99d → #65a30d；草 #84cc16 → #4d7c0f；山 #94a3b8 → #64748b；云 #ffffff；花 #fbbf24 / #f472b6 / #f87171 |
| 装饰元素 | 野花（见上）；2-3 处草丛笔触 #4d7c0f 10-20px |
| 文字 | 无 |
| 质感 | 水彩晕染，明亮通透，色彩饱和 |
| 透明度/留白 | 右下角 600×400 留空仅草色底；饱和度高 |
| AI prompt (中) | 原野牧风水彩背景图，1920x1080像素WebP，翠绿基底#d9f99d到#65a30d，下部1/2草地起伏丘陵#84cc16到#65a30d到#4d7c0f三段渐变由近及远加深，上部1/2蓝天白云，远山中部蓝灰#94a3b8到#64748b山脊线0,520至1920,540，3-5朵白云#ffffff椭圆云团60-160px，草地上8-10朵5-8px五瓣小野花色#fbbf24#f472b6#f87171散布，2-3处草丛笔触#4d7c0f 10-20px，右下角600x400留空仅草色底，水彩晕染明亮通透饱和无文字 |
| AI prompt (EN) | grassland pastoral watercolor background, 1920x1080 px WebP, green base #d9f99d to #65a30d, lower half rolling grass hills #84cc16 to #65a30d to #4d7c0f three-stop gradient deepening with distance, upper half blue sky with clouds, distant mountain ridge blue-grey #94a3b8 to #64748b at 0,520 to 1920,540, 3-5 white clouds #ffffff elliptical clusters 60-160px, 8-10 small five-petal wildflowers 5-8px in #fbbf24 #f472b6 #f87171 on grass, 2-3 grass tuft brush strokes #4d7c0f 10-20px, bottom-right 600x400 empty only grass base, watercolor bright transparent saturated, no text |

### 8. `bg-river-mountain.webp` — 晴川芳洲

| 字段 | 内容 |
|---|---|
| 文件名 | `bg-river-mountain.webp` |
| 尺寸 | 1920 × 1080 px |
| 格式 | WebP |
| 体积上限 | ≤45 KB |
| 画布 | 不透明，蓝绿基底 #bae6fd → #a7f3d0 |
| 构图 | 上部 1/3 晴空蓝天（#7dd3fc → #bae6fd），中部 1/3 远山（三重叠山，从远到近 #94a3b8 → #64748b → #4d7c0f），下部 1/3 江水（#22d3ee → #0891b2 倒映山色）；江面有 1-2 艘小船剪影；右下角 600×400 留空仅江水底色 |
| 主体元素 | ① 远山三层：远 #94a3b8、中 #64748b、近 #4d7c0f，山形起伏连绵；② 江水：#22d3ee → #0891b2 渐变，水面有横向波纹 #67e8f9 1px 5-6 道；③ 小船：剪影 #1e293b，长 30-40px，1-2 艘位于江面中部偏左；④ 倒影：山色倒映在江面 0.3 透明度 |
| 色彩 | 基底 #bae6fd → #a7f3d0；天 #7dd3fc → #bae6fd；山 #94a3b8 / #64748b / #4d7c0f；水 #22d3ee → #0891b2 |
| 装饰元素 | 小船（见上）；2-3 朵白云 #ffffff 50-100px |
| 文字 | 无 |
| 质感 | 青绿山水国画风，色彩饱和，留白意境 |
| 透明度/留白 | 右下角 600×400 留空仅江水底色；饱和度高 |
| AI prompt (中) | 晴川芳洲青绿山水国画背景图，1920x1080像素WebP，蓝绿基底#bae6fd到#a7f3d0，上部1/3晴空#7dd3fc到#bae6fd，中部1/3远山三层远#94a3b8中#64748b近#4d7c0f山形起伏连绵，下部1/3江水#22d3ee到#0891b2渐变水面横向波纹#67e8f9 1px 5-6道，山色倒映江面0.3透明度，1-2艘小船剪影#1e293b长30-40px位于江面中部偏左，2-3朵白云#ffffff 50-100px，右下角600x400留空仅江水底色，青绿山水国画风色彩饱和留白意境无文字 |
| AI prompt (EN) | clear river mountain Chinese blue-green landscape painting background, 1920x1080 px WebP, blue-green base #bae6fd to #a7f3d0, upper third clear sky #7dd3fc to #bae6fd, middle third three-layer distant mountains far #94a3b8 mid #64748b near #4d7c0f rolling continuous, lower third river #22d3ee to #0891b2 gradient with horizontal ripples #67e8f9 1px 5-6 lines, mountain reflections on water at 0.3 opacity, 1-2 small boat silhouettes #1e293b 30-40px long mid-river left, 2-3 white clouds #ffffff 50-100px, bottom-right 600x400 empty only river base, blue-green landscape style saturated with white space aesthetic, no text |

### 9. `bg-cream-cloud.webp` — 软萌奶霜

| 字段 | 内容 |
|---|---|
| 文件名 | `bg-cream-cloud.webp` |
| 尺寸 | 1920 × 1080 px |
| 格式 | WebP |
| 体积上限 | ≤45 KB |
| 画布 | 不透明，奶白基底 #fdf2f8 → #fce7f3 |
| 构图 | 画面散布 6-8 朵粉白色奶油质感云朵（大小不一 80-240px），主要集中在上半部和左下；云朵为多层叠加圆弧形成蓬松感；右下角 600×400 留空仅奶白底 |
| 主体元素 | ① 奶霜云朵：由 4-6 个圆弧叠加形成蓬松云形，主色 #ffffff → #fdf2f8 渐变，边缘 #fbcfe8 1px 描边，云朵下方有微阴影 #fce7f3 0.4 透明度；② 云上点缀：每朵云上 1-2 颗小亮片 #fda4af 4-6px 或小心形 #f472b6 5px |
| 色彩 | 基底 #fdf2f8 → #fce7f3；云 #ffffff → #fdf2f8；描边 #fbcfe8；点缀 #fda4af / #f472b6 |
| 装饰元素 | 亮片/心形点缀（见上）；3-5 个小气泡 #ffffff 0.6 透明度 8-15px |
| 文字 | 无 |
| 质感 | 奶油霜质感，柔光圆润，蓬松立体感，可爱风 |
| 透明度/留白 | 右下角 600×400 留空仅奶白底；色彩柔和但仍需足够饱和（页面 0.06 显示仍辨粉白云朵） |
| AI prompt (中) | 软萌奶霜云朵奶油质感背景图，1920x1080像素WebP，奶白基底#fdf2f8到#fce7f3，画面散布6-8朵粉白奶油质感云朵大小80-240px主要集中上半部和左下，云朵由4-6个圆弧叠加蓬松感主色#ffffff到#fdf2f8渐变边缘#fbcfe8 1px描边下方微阴影#fce7f3 0.4透明度，每朵云上1-2颗小亮片#fda4af 4-6px或小心形#f472b6 5px，3-5个小气泡#ffffff 0.6透明度8-15px，右下角600x400留空仅奶白底，奶油霜质感柔光圆润蓬松立体可爱风饱和无文字 |
| AI prompt (EN) | cute cream cloud buttery background, 1920x1080 px WebP, cream-white base #fdf2f8 to #fce7f3, 6-8 fluffy pink-white cream clouds 80-240px scattered mainly upper half and lower-left, each cloud built from 4-6 overlapping arcs main color #ffffff to #fdf2f8 gradient with #fbcfe8 1px outline and soft shadow #fce7f3 at 0.4 opacity below, 1-2 small sequins #fda4af 4-6px or tiny hearts #f472b6 5px on each cloud, 3-5 small bubbles #ffffff at 0.6 opacity 8-15px, bottom-right 600x400 empty only cream base, buttery cream texture soft glossy round fluffy cute style saturated, no text |

---

## 三、统一规格速查表

### 头像框统一规格

| 项 | 值 |
|---|---|
| 画布 | 144 × 144 px |
| 格式 | PNG（透明背景） |
| 体积上限 | ≤45 KB |
| 中心透明圆 | 直径 ≥86px（实际多款 120-124px），圆心 (72, 72)，alpha=0 |
| 环宽 | 8-12 px（视款式） |
| 边缘 | 干净硬切，无散边羽化 |
| 色彩 | 必须含具体色值 + 渐变起止 |

### 背景图统一规格

| 项 | 值 |
|---|---|
| 画布 | 1920 × 1080 px（横版，cover 裁切适配） |
| 格式 | WebP |
| 体积上限 | ≤45 KB |
| 显示透明度 | 0.06（页面叠加）→ 色彩饱和度必须高 |
| 右下角留空 | 600 × 400 px 仅底色，避免被侧边栏卡片遮挡 |
| 风格 | 与主题调性一致（水彩/油画/数字绘画/国画/奶油等） |

---

> 共 16 张图：7 张头像框 PNG + 9 张主题背景图 WebP。每张图字段齐全，prompt 可直接复制喂 Midjourney / SD / DALL·E。
