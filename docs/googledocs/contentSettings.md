> 来源: https://developer.chrome.com/docs/extensions/reference/api/contentSettings
> 抓取脚本: docs/googledocs/fetch-chrome-docs.sh

<div id="main-content" class="devsite-main-content" role="main" data-has-book-nav="" data-has-sidebar="">

<div class="devsite-sidebar">

<div class="devsite-sidebar-content">

</div>

</div>

<div class="devsite-article-meta nocontent" role="navigation" data-nosnippet="">

- <a href="https://developer.chrome.com/" class="devsite-breadcrumb-link gc-analytics-event" data-category="Site-Wide Custom Events" data-label="Breadcrumbs" data-value="1" data-track-type="globalNav" data-track-name="breadcrumb" data-track-metadata-position="1" data-track-metadata-eventdetail="">Home</a>

- <div class="devsite-breadcrumb-guillemet material-icons" aria-hidden="true">

  </div>

  <a href="https://developer.chrome.com/docs" class="devsite-breadcrumb-link gc-analytics-event" data-category="Site-Wide Custom Events" data-label="Breadcrumbs" data-value="2" data-track-type="globalNav" data-track-name="breadcrumb" data-track-metadata-position="2" data-track-metadata-eventdetail="Docs">Docs</a>

- <div class="devsite-breadcrumb-guillemet material-icons" aria-hidden="true">

  </div>

  <a href="https://developer.chrome.com/docs/extensions" class="devsite-breadcrumb-link gc-analytics-event" data-category="Site-Wide Custom Events" data-label="Breadcrumbs" data-value="3" data-track-type="globalNav" data-track-name="breadcrumb" data-track-metadata-position="3" data-track-metadata-eventdetail="Chrome Extensions">Chrome Extensions</a>

- <div class="devsite-breadcrumb-guillemet material-icons" aria-hidden="true">

  </div>

  <a href="https://developer.chrome.com/docs/extensions/reference" class="devsite-breadcrumb-link gc-analytics-event" data-category="Site-Wide Custom Events" data-label="Breadcrumbs" data-value="4" data-track-type="globalNav" data-track-name="breadcrumb" data-track-metadata-position="4" data-track-metadata-eventdetail="Reference">Reference</a>

- <div class="devsite-breadcrumb-guillemet material-icons" aria-hidden="true">

  </div>

  <a href="https://developer.chrome.com/docs/extensions/reference/api" class="devsite-breadcrumb-link gc-analytics-event" data-category="Site-Wide Custom Events" data-label="Breadcrumbs" data-value="5" data-track-type="globalNav" data-track-name="breadcrumb" data-track-metadata-position="5" data-track-metadata-eventdetail="API">API</a>

</div>

# chrome.contentSettings <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.contentSettings` API to change settings that control whether websites can use features such as cookies, JavaScript, and plugins. More generally speaking, content settings allow you to customize Chrome's behavior on a per-site basis instead of globally.

</div>

## Permissions

<div class="dcc-reference">

`contentSettings`\

</div>

You must declare the `"contentSettings"` permission in your extension's manifest to use the API. For example:

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "permissions": [
    "contentSettings"
  ],
  ...
}
```

## Concepts and usage

### Content setting patterns

You can use patterns to specify the websites that each content setting affects. For example, `https://*.youtube.com/*` specifies youtube.com and all of its subdomains. The syntax for content setting patterns is the same as for [match patterns](/docs/extensions/develop/concepts/match-patterns), with a few differences:

- For `http`, `https`, and `ftp` URLs, the path must be a wildcard (`/*`). For `file` URLs, the path must be completely specified and **must not** contain wildcards.
- In contrast to match patterns, content setting patterns can specify a port number. If a port number is specified, the pattern only matches websites with that port. If no port number is specified, the pattern matches all ports.

### Pattern precedence

When more than one content setting rule applies for a given site, the rule with the more specific pattern takes precedence.

For example, the following patterns are ordered by precedence:

1.  `https://www.example.com/*`
2.  `https://*.example.com/*` (matching example.com and all subdomains)
3.  `<all_urls>` (matching every URL)

Three kinds of wildcards affect how specific a pattern is:

- Wildcards in the port (for example `https://www.example.com:*/*`)
- Wildcards in the scheme (for example `*://www.example.com:123/*`)
- Wildcards in the hostname (for example `https://*.example.com:123/*`)

If a pattern is more specific than another pattern in one part but less specific in another part, the different parts are checked in the following order: hostname, scheme, port. For example, the following patterns are ordered by precedence:

1.  `https://www.example.com:*/*` Specifies the hostname and scheme.
2.  `*:/www.example.com:123/*` Not as high, because although it specifies the hostname, it doesn't specify the scheme.
3.  `https://*.example.com:123/*` Lower because although it specifies the port and scheme, it has a wildcard in the hostname.

### Primary and secondary patterns

The URL taken into account when deciding which content setting to apply depends on the content type. For example, for [`contentSettings.notifications`](#property-notifications) settings are based on the URL shown in the omnibox. This URL is called the "primary" URL.

Some content types can take additional URLs into account. For example, whether a site is allowed to set a [`contentSettings.cookies`](#property-cookies) is decided based on the URL of the HTTP request (which is the primary URL in this case) as well as the URL shown in the omnibox (which is called the "secondary" URL).

If multiple rules have primary and secondary patterns, the rule with the more specific primary pattern takes precedence. If there multiple rules have the same primary pattern, the rule with the more specific secondary pattern takes precedence. For example, the following list of primary/secondary pattern pairs is ordered by precedence:

|            |                            |                            |
|------------|----------------------------|----------------------------|
| Precedence | Primary pattern            | Secondary pattern          |
| 1          | `https://www.moose.com/*`, | `https://www.wombat.com/*` |
| 2          | `https://www.moose.com/*`, | `<all_urls>`               |
| 3          | `<all_urls>`,              | `https://www.wombat.com/*` |
| 4          | `<all_urls>`,              | `<all_urls>`               |

Secondary patterns are not supported for the images content setting.

### Resource identifiers

Resource identifiers allow you to specify content settings for specific subtypes of a content type. Currently, the only content type that supports resource identifiers is [`contentSettings.plugins`](#property-plugins), where a resource identifier identifies a specific plugin. When applying content settings, first the settings for the specific plugin are checked. If there are no settings found for the specific plugin, the general content settings for plugins are checked.

For example, if a content setting rule has the resource identifier `adobe-flash-player` and the pattern `<all_urls>`, it takes precedence over a rule without a resource identifier and the pattern `https://www.example.com/*`, even if that pattern is more specific.

You can get a list of resource identifiers for a content type by calling the [`contentSettings.ContentSetting.getResourceIdentifiers()`](#method-ContentSetting-getResourceIdentifiers) method. The returned list can change with the set of installed plugins on the user's machine, but Chrome tries to keep the identifiers stable across plugin updates.

## Examples

To try this API, install the [contentSettings API example](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/contentSettings) from the [chrome-extension-samples](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples) repository.

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### AutoVerifyContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 113+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### CameraContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ask"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### ClipboardContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 121+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ask"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### ContentSetting

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="method-ContentSetting-clear" class="dcc-code-sections__label">

  clear

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Clear all content setting rules set by this extension.

  The `clear` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (details: object) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-ContentSetting-clear-details" class="dcc-code-sections__label">

    details

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-ContentSetting-clear-details-scope" class="dcc-code-sections__label">

      scope

      </div>

      <div class="dcc-type--xsmall">

      [Scope](#type-Scope) <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      Where to clear the setting (default: regular).

    </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ContentSetting-clear" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    Promise\<void\>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

    </div>

    </div>

  </div>

- <div>

  <div id="method-ContentSetting-get" class="dcc-code-sections__label">

  get

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Gets the current content setting for a given pair of URLs.

  The `get` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (details: object) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-ContentSetting-get-details" class="dcc-code-sections__label">

    details

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-ContentSetting-get-details-incognito" class="dcc-code-sections__label">

      incognito

      </div>

      <div class="dcc-type--xsmall">

      boolean <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      Whether to check the content settings for an incognito session. (default false)

    - <div>

      <div id="property-ContentSetting-get-details-primaryUrl" class="dcc-code-sections__label">

      primaryUrl

      </div>

      <div class="dcc-type--xsmall">

      string

      </div>

      </div>

      The primary URL for which the content setting should be retrieved. Note that the meaning of a primary URL depends on the content type.

    - <div>

      <div id="property-ContentSetting-get-details-resourceIdentifier" class="dcc-code-sections__label">

      resourceIdentifier

      </div>

      <div class="dcc-type--xsmall">

      [ResourceIdentifier](#type-ResourceIdentifier) <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      A more specific identifier of the type of content for which the settings should be retrieved.

    - <div>

      <div id="property-ContentSetting-get-details-secondaryUrl" class="dcc-code-sections__label">

      secondaryUrl

      </div>

      <div class="dcc-type--xsmall">

      string <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      The secondary URL for which the content setting should be retrieved. Defaults to the primary URL. Note that the meaning of a secondary URL depends on the content type, and not all content types use secondary URLs.

    </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ContentSetting-get" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    Promise\<object\>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

    </div>

    </div>

  </div>

- <div>

  <div id="method-ContentSetting-getResourceIdentifiers" class="dcc-code-sections__label">

  getResourceIdentifiers

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  The `getResourceIdentifiers` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  () => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ContentSetting-getResourceIdentifiers" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    Promise\<[ResourceIdentifier](#type-ResourceIdentifier)\[\]\>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

    </div>

    </div>

  </div>

- <div>

  <div id="method-ContentSetting-set" class="dcc-code-sections__label">

  set

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Applies a new content setting rule.

  The `set` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (details: object) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-ContentSetting-set-details" class="dcc-code-sections__label">

    details

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-ContentSetting-set-details-primaryPattern" class="dcc-code-sections__label">

      primaryPattern

      </div>

      <div class="dcc-type--xsmall">

      string

      </div>

      </div>

      The pattern for the primary URL. For details on the format of a pattern, see [Content Setting Patterns](https://developer.chrome.com/docs/extensions/reference/contentSettings/#patterns).

    - <div>

      <div id="property-ContentSetting-set-details-resourceIdentifier" class="dcc-code-sections__label">

      resourceIdentifier

      </div>

      <div class="dcc-type--xsmall">

      [ResourceIdentifier](#type-ResourceIdentifier) <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      The resource identifier for the content type.

    - <div>

      <div id="property-ContentSetting-set-details-scope" class="dcc-code-sections__label">

      scope

      </div>

      <div class="dcc-type--xsmall">

      [Scope](#type-Scope) <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      Where to set the setting (default: regular).

    - <div>

      <div id="property-ContentSetting-set-details-secondaryPattern" class="dcc-code-sections__label">

      secondaryPattern

      </div>

      <div class="dcc-type--xsmall">

      string <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      The pattern for the secondary URL. Defaults to matching all URLs. For details on the format of a pattern, see [Content Setting Patterns](https://developer.chrome.com/docs/extensions/reference/contentSettings/#patterns).

    - <div>

      <div id="property-ContentSetting-set-details-setting" class="dcc-code-sections__label">

      setting

      </div>

      <div class="dcc-type--xsmall">

      any

      </div>

      </div>

      The setting applied by this rule. See the description of the individual ContentSetting objects for the possible values.

    </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ContentSetting-set" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    Promise\<void\>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### CookiesContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"session_only"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### FullscreenContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### ImagesContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### JavascriptContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### LocationContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ask"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MicrophoneContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ask"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MouselockContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MultipleAutomaticDownloadsContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ask"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### NotificationsContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ask"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### PluginsContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### PopupsContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### PpapiBrokerContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### ResourceIdentifier

</div>

The only content type using resource identifiers is [`contentSettings.plugins`](#property-plugins). For more information, see [Resource Identifiers](https://developer.chrome.com/docs/extensions/reference/contentSettings/#resource-identifiers).

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ResourceIdentifier-description" class="dcc-code-sections__label">

  description

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  A human readable description of the resource.

- <div>

  <div id="property-ResourceIdentifier-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The resource identifier for the given content type.

</div>

<div>

<div class="notranslate">

### Scope

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

The scope of the ContentSetting. One of `regular`: setting for regular profile (which is inherited by the incognito profile if not overridden elsewhere), `incognito\_session\_only`: setting for incognito profile that can only be set during an incognito session and is deleted when the incognito session ends (overrides regular settings).

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"regular"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"incognito_session_only"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### SoundContentSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 141+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

</div>

## Properties

<div>

<div>

<div class="notranslate">

### automaticDownloads

</div>

Whether to allow sites to download multiple files automatically. One of `allow`: Allow sites to download multiple files automatically, `block`: Don't allow sites to download multiple files automatically, `ask`: Ask when a site wants to download files automatically after the first file. Default is `ask`. The primary URL is the URL of the top-level frame. The secondary URL is not used.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[MultipleAutomaticDownloadsContentSetting](#type-MultipleAutomaticDownloadsContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### autoVerify

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 113+ </span>

</div>

</div>

Whether to allow sites to use the [Private State Tokens API](https://developer.chrome.com/docs/privacy-sandbox/trust-tokens/). One of `allow`: Allow sites to use the Private State Tokens API, `block`: Block sites from using the Private State Tokens API. Default is `allow`. When calling `set()`, the primary URL pattern must be `<all_urls>`. The secondary URL is not used.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[AutoVerifyContentSetting](#type-AutoVerifyContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### camera

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

</div>

</div>

Whether to allow sites to access the camera. One of `allow`: Allow sites to access the camera, `block`: Don't allow sites to access the camera, `ask`: Ask when a site wants to access the camera. Default is `ask`. The primary URL is the URL of the document which requested camera access. The secondary URL is not used. NOTE: The 'allow' setting is not valid if both patterns are '\<all_urls\>'.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[CameraContentSetting](#type-CameraContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### clipboard

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 121+ </span>

</div>

</div>

Whether to allow sites to access the clipboard via advanced capabilities of the Async Clipboard API. "Advanced" capabilities include anything besides writing built-in formats after a user gesture, i.e. the ability to read, the ability to write custom formats, and the ability to write without a user gesture. One of `allow`: Allow sites to use advanced clipboard capabilities, `block`: Don't allow sites to use advanced clipboard capabilties, `ask`: Ask when a site wants to use advanced clipboard capabilities. Default is `ask`. The primary URL is the URL of the document which requested clipboard access. The secondary URL is not used.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[ClipboardContentSetting](#type-ClipboardContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### cookies

</div>

Whether to allow cookies and other local data to be set by websites. One of `allow`: Accept cookies, `block`: Block cookies, `session\_only`: Accept cookies only for the current session. Default is `allow`. The primary URL is the URL representing the cookie origin. The secondary URL is the URL of the top-level frame.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[CookiesContentSetting](#type-CookiesContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### fullscreen

</div>

*Deprecated.* No longer has any effect. Fullscreen permission is now automatically granted for all sites. Value is always `allow`.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[FullscreenContentSetting](#type-FullscreenContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### images

</div>

Whether to show images. One of `allow`: Show images, `block`: Don't show images. Default is `allow`. The primary URL is the URL of the top-level frame. The secondary URL is the URL of the image.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[ImagesContentSetting](#type-ImagesContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### javascript

</div>

Whether to run JavaScript. One of `allow`: Run JavaScript, `block`: Don't run JavaScript. Default is `allow`. The primary URL is the URL of the top-level frame. The secondary URL is not used.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[JavascriptContentSetting](#type-JavascriptContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### location

</div>

Whether to allow Geolocation. One of `allow`: Allow sites to track your physical location, `block`: Don't allow sites to track your physical location, `ask`: Ask before allowing sites to track your physical location. Default is `ask`. The primary URL is the URL of the document which requested location data. The secondary URL is the URL of the top-level frame (which may or may not differ from the requesting URL).

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[LocationContentSetting](#type-LocationContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### microphone

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

</div>

</div>

Whether to allow sites to access the microphone. One of `allow`: Allow sites to access the microphone, `block`: Don't allow sites to access the microphone, `ask`: Ask when a site wants to access the microphone. Default is `ask`. The primary URL is the URL of the document which requested microphone access. The secondary URL is not used. NOTE: The 'allow' setting is not valid if both patterns are '\<all_urls\>'.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[MicrophoneContentSetting](#type-MicrophoneContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### mouselock

</div>

*Deprecated.* No longer has any effect. Mouse lock permission is now automatically granted for all sites. Value is always `allow`.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[MouselockContentSetting](#type-MouselockContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### notifications

</div>

Whether to allow sites to show desktop notifications. One of `allow`: Allow sites to show desktop notifications, `block`: Don't allow sites to show desktop notifications, `ask`: Ask when a site wants to show desktop notifications. Default is `ask`. The primary URL is the URL of the document which wants to show the notification. The secondary URL is not used.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[NotificationsContentSetting](#type-NotificationsContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### plugins

</div>

*Deprecated.* With Flash support removed in Chrome 88, this permission no longer has any effect. Value is always `block`. Calls to `set()` and `clear()` will be ignored.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[PluginsContentSetting](#type-PluginsContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### popups

</div>

Whether to allow sites to show pop-ups. One of `allow`: Allow sites to show pop-ups, `block`: Don't allow sites to show pop-ups. Default is `block`. The primary URL is the URL of the top-level frame. The secondary URL is not used.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[PopupsContentSetting](#type-PopupsContentSetting)\>

</div>

</div>

<div>

<div class="notranslate">

### unsandboxedPlugins

</div>

*Deprecated.* Previously, controlled whether to allow sites to run plugins unsandboxed, however, with the Flash broker process removed in Chrome 88, this permission no longer has any effect. Value is always `block`. Calls to `set()` and `clear()` will be ignored.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ContentSetting](#type-ContentSetting)\<[PpapiBrokerContentSetting](#type-PpapiBrokerContentSetting)\>

</div>

</div>

</div>

</div>

</div>

<div class="devsite-floating-action-buttons">

</div>

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-10-20 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2025-10-20 UTC."\],\[\],\[\]\]

</div>

</div>