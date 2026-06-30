#!/usr/bin/env bash
#
# 下载 Chrome 扩展 API 官方文档 → Markdown
# ------------------------------------------------------------
# 用法：
#   bash docs/googledocs/fetch-chrome-docs.sh
#
# 说明：
#   - 我（Claude）这边网络拉不到 developer.chrome.com，由你本机执行
#   - 优先用 pandoc 转 .md（推荐：brew install pandoc）；没有 pandoc 时退化保存 .html，我也能解析
#   - 跑完会生成 INDEX.md（每个 API 的官方地址索引），我只记忆这个索引，正文按需查
#   - 想加/删 API，改下面的 APIS / DOTTED 数组即可
# ------------------------------------------------------------

set -uo pipefail

OUT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE="https://developer.chrome.com/docs/extensions/reference/api"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

# 单段 API（URL = $BASE/<name>）
APIS=(
  action alarms audio bookmarks browsingData commands contentSettings contextMenus
  cookies debugger declarativeContent declarativeNetRequest desktopCapture dns
  documentScan dom downloads events extension extensionTypes fontSettings gcm
  history i18n identity idle instanceID loginState management notifications
  offscreen omnibox pageCapture permissions platformKeys power printerProvider
  printing printingMetrics privacy processes proxy readingList runtime scripting
  search sessions sidePanel storage tabCapture tabGroups tabs topSites tts
  ttsEngine types userScripts vpnProvider wallpaper webAuthenticationProxy
  webNavigation webRequest windows
)

# 带点的命名空间（URL 用 / 分隔）
DOTTED=(
  "devtools/inspectedWindow" "devtools/network" "devtools/panels"
  "system/cpu" "system/display" "system/memory" "system/storage"
  "enterprise/deviceAttributes" "enterprise/hardwarePlatform"
  "enterprise/networkingAttributes" "enterprise/platformKeys"
)

HAVE_PANDOC=0
if command -v pandoc >/dev/null 2>&1; then HAVE_PANDOC=1; else
  echo "⚠️  未检测到 pandoc，将保存为 .html（Claude 也能解析）。建议安装：brew install pandoc"
fi

fetch() {            # $1 = url 路径片段（可空=总览页）, $2 = 输出文件名（无扩展名）
  local path="$1"
  local name="$2"
  local url
  if [ -z "$path" ]; then url="$BASE"; else url="$BASE/$path"; fi
  local html
  html="$(curl -fsSL -A "$UA" "$url" 2>/dev/null)"
  if [ -z "$html" ]; then echo "❌ $name  ($url)"; return 1; fi
  if [ "$HAVE_PANDOC" -eq 1 ]; then
    printf '%s' "$html" | pandoc -f html -t gfm --wrap=none -o "$OUT_DIR/$name.md" 2>/dev/null
    # 在文件头插入来源地址，方便溯源
    printf '> 来源: %s\n> 抓取脚本: docs/googledocs/fetch-chrome-docs.sh\n\n%s' "$url" "$(cat "$OUT_DIR/$name.md")" > "$OUT_DIR/$name.md"
    echo "✅ $name.md"
  else
    printf '%s' "$html" > "$OUT_DIR/$name.html"
    echo "✅ $name.html"
  fi
}

echo "下载到: $OUT_DIR"
echo "============================================"

# 先抓 API 总览索引页
fetch "" "_overview"

for a in "${APIS[@]}";   do fetch "$a" "$a"; done
for d in "${DOTTED[@]}"; do fetch "$d" "$(echo "$d" | tr '/' '.')"; done

# 生成 INDEX.md（Claude 只记忆这个）
{
  echo "# Chrome 扩展 API 文档索引"
  echo
  echo "> 自动生成 by fetch-chrome-docs.sh · 正文文件在同目录 · 官方索引: $BASE"
  echo
  echo "| API | 本地文件 | 官方地址 |"
  echo "|---|---|---|"
  for a in "${APIS[@]}"; do
    f="$a.md"; [ -f "$OUT_DIR/$a.md" ] || f="$a.html"
    echo "| \`chrome.$a\` | $f | $BASE/$a |"
  done
  for d in "${DOTTED[@]}"; do
    n="$(echo "$d" | tr '/' '.')"; f="$n.md"; [ -f "$OUT_DIR/$n.md" ] || f="$n.html"
    echo "| \`chrome.$n\` | $f | $BASE/$d |"
  done
} > "$OUT_DIR/INDEX.md"

echo "============================================"
echo "✅ 索引: $OUT_DIR/INDEX.md"
echo "完成。把结果告诉我（尤其有没有 ❌ 失败项），我来梳理并写入记忆。"
