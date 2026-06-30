> 来源: https://developer.chrome.com/docs/extensions/reference/api/tabs
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

# chrome.tabs <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

<div class="aside note">

**Note:** The Tabs API can be used by the service worker and extension pages, but not content scripts.

</div>

## Description

<div class="dcc-reference">

Use the `chrome.tabs` API to interact with the browser's tab system. You can use this API to create, modify, and rearrange tabs in the browser.

</div>

The Tabs API not only offers features for manipulating and managing tabs, but can also detect the [language](#method-detectLanguage) of the tab, take a [screenshot](#method-captureVisibleTab), and [communicate](#method-sendMessage) with a tab's content scripts.

## Permissions

Most features don't require any permissions to use. For example: [creating](#method-create) a new tab, [reloading](#method-reload) a tab, [navigating](#method-update) to another URL, etc.

There are three permissions developers should be aware of when working with the Tabs API.

The "tabs" permission  
This permission does not give access to the `chrome.tabs` namespace. Instead, it grants an extension the ability to call [`tabs.query()`](#method-query) against four sensitive properties on [`tabs.Tab`](#type-Tab) instances: `url`, `pendingUrl`, `title`, and `favIconUrl`.

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "permissions": [
    "tabs"
  ],
  ...
}
```

Host permissions  
[Host permissions](/docs/extensions/develop/concepts/declare-permissions) allow an extension to read and query a matching tab's four sensitive `tabs.Tab` properties. They can also interact directly with the matching tabs using methods such as [`tabs.captureVisibleTab()`](#method-captureVisibleTab), [`scripting.executeScript()`](/docs/extensions/reference/api/scripting#method-executeScript), [`scripting.insertCSS()`](/docs/extensions/reference/api/scripting#method-insertCSS), and [`scripting.removeCSS()`](/docs/extensions/reference/api/scripting#method-removeCSS).

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "host_permissions": [
    "http://*/*",
    "https://*/*"
  ],
  ...
}
```

The "activeTab" permission  
[`activeTab`](/docs/extensions/develop/concepts/activeTab) grants an extension temporary host permission for the current tab in response to a user invocation. Unlike host permissions, `activeTab` does not trigger any warnings.

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "permissions": [
    "activeTab"
  ],
  ...
}
```

## Use cases

The following sections demonstrate some common use cases.

### Open an extension page in a new tab

A common pattern for extensions is to open an onboarding page in a new tab when the extension is installed. The following example shows how to do this.

<span class="dcc-label">background.js:</span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onInstalled.addListener(({reason}) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: "onboarding.html"
    });
  }
});
```

<div class="aside note">

**Note:** This example doesn't require any [permissions](#perms).

</div>

### Get the current tab

This example demonstrates how an extension's service worker can retrieve the active tab from the currently-focused window (or most recently-focused window, if no Chrome windows are focused). This can usually be thought of as the user's current tab.

<div>

</div>

``` devsite-click-to-copy
  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }
```

<div>

</div>

``` devsite-click-to-copy
  function getCurrentTab(callback) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
      if (chrome.runtime.lastError)
      console.error(chrome.runtime.lastError);
      // `tab` will either be a `tabs.Tab` instance or `undefined`.
      callback(tab);
    });
  }
```

### Mute the specified tab

This example shows how an extension can toggle the muted state for a given tab.

<div>

</div>

``` devsite-click-to-copy
  async function toggleMuteState(tabId) {
    const tab = await chrome.tabs.get(tabId);
    const muted = !tab.mutedInfo.muted;
    await chrome.tabs.update(tabId, {muted});
    console.log(`Tab ${tab.id} is ${muted ? "muted" : "unmuted"}`);
  }
```

<div>

</div>

``` devsite-click-to-copy
  function toggleMuteState(tabId) {
    chrome.tabs.get(tabId, async (tab) => {
      let muted = !tab.mutedInfo.muted;
      await chrome.tabs.update(tabId, { muted });
      console.log(`Tab ${tab.id} is ${ muted ? "muted" : "unmuted" }`);
    });
  }
```

### Move the current tab to the first position when clicked

This example shows how to move a tab while a drag may or may not be in progress. While this example uses `chrome.tabs.move`, you can use the same waiting pattern for other calls that modify tabs while a drag is in progress.

<div>

</div>

``` devsite-click-to-copy
  chrome.tabs.onActivated.addListener(moveToFirstPosition);

  async function moveToFirstPosition(activeInfo) {
    try {
      await chrome.tabs.move(activeInfo.tabId, {index: 0});
      console.log("Success.");
    } catch (error) {
      if (error == "Error: Tabs cannot be edited right now (user may be dragging a tab).") {
        setTimeout(() => moveToFirstPosition(activeInfo), 50);
      } else {
        console.error(error);
      }
    }
  }
```

<div class="aside important">

**Important:** Using catch(error) in a Promise is a way to ensure that an error that otherwise populates \`chrome.runtime.lastError\` is not unchecked.

</div>

<div>

</div>

``` devsite-click-to-copy
  chrome.tabs.onActivated.addListener(moveToFirstPositionMV2);

  function moveToFirstPositionMV2(activeInfo) {
    chrome.tabs.move(activeInfo.tabId, { index: 0 }, () => {
      if (chrome.runtime.lastError) {
        const error = chrome.runtime.lastError;
        if (error == "Error: Tabs cannot be edited right now (user may be dragging a tab).") {
          setTimeout(() => moveToFirstPositionMV2(activeInfo), 50);
        } else {
          console.error(error);
        }
      } else {
        console.log("Success.");
      }
    });
  }
```

### Pass a message to a selected tab's content script

This example demonstrates how an extension's service worker can communicate with content scripts in specific browser tabs using `tabs.sendMessage()`.

<div>

</div>

``` devsite-click-to-copy
function sendMessageToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const response = await chrome.tabs.sendMessage(tab.id, message);
  // TODO: Do something with the response.
}
```

## Extension examples

For more Tabs API extensions demos, explore any of the following:

- [Manifest V2 - Tabs API extensions](https://github.com/GoogleChrome/chrome-extensions-samples/tree/master/_archive/mv2/api/tabs/).
- [Manifest V3 - Tabs Manager](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/tutorial.tabs-manager).

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### MutedInfo

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

</div>

</div>

The tab's muted state and the reason for the last state change.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-MutedInfo-extensionId" class="dcc-code-sections__label">

  extensionId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the extension that changed the muted state. Not set if an extension was not the reason the muted state last changed.

- <div>

  <div id="property-MutedInfo-muted" class="dcc-code-sections__label">

  muted

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the tab is muted (prevented from playing sound). The tab may be muted even if it has not played or is not currently playing sound. Equivalent to whether the 'muted' audio indicator is showing.

- <div>

  <div id="property-MutedInfo-reason" class="dcc-code-sections__label">

  reason

  </div>

  <div class="dcc-type--xsmall">

  [MutedInfoReason](#type-MutedInfoReason) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The reason the tab was muted or unmuted. Not set if the tab's mute state has never been changed.

</div>

<div>

<div class="notranslate">

### MutedInfoReason

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

</div>

</div>

An event that caused a muted state change.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"user"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">A user input action set the muted state.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"capture"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Tab capture was started, forcing a muted state change.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"extension"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">An extension, identified by the extensionId field, set the muted state.</span>

</div>

</div>

<div>

<div class="notranslate">

### Tab

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Tab-active" class="dcc-code-sections__label">

  active

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the tab is active in its window. Does not necessarily mean the window is focused.

- <div>

  <div id="property-Tab-audible" class="dcc-code-sections__label">

  audible

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 45+ </span>

  </div>

  </div>

  Whether the tab has produced sound over the past couple of seconds (but it might not be heard if also muted). Equivalent to whether the 'speaker audio' indicator is showing.

- <div>

  <div id="property-Tab-autoDiscardable" class="dcc-code-sections__label">

  autoDiscardable

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

  </div>

  </div>

  Whether the tab can be discarded automatically by the browser when resources are low.

- <div>

  <div id="property-Tab-discarded" class="dcc-code-sections__label">

  discarded

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

  </div>

  </div>

  Whether the tab is discarded. A discarded tab is one whose content has been unloaded from memory, but is still visible in the tab strip. Its content is reloaded the next time it is activated.

- <div>

  <div id="property-Tab-favIconUrl" class="dcc-code-sections__label">

  favIconUrl

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The URL of the tab's favicon. This property is only present if the extension has the `"tabs"` permission or has host permissions for the page. It may also be an empty string if the tab is loading.

- <div>

  <div id="property-Tab-frozen" class="dcc-code-sections__label">

  frozen

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 132+ </span>

  </div>

  </div>

  Whether the tab is frozen. A frozen tab cannot execute tasks, including event handlers or timers. It is visible in the tab strip and its content is loaded in memory. It is unfrozen on activation.

- <div>

  <div id="property-Tab-groupId" class="dcc-code-sections__label">

  groupId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

  The ID of the group that the tab belongs to.

- <div>

  <div id="property-Tab-height" class="dcc-code-sections__label">

  height

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The height of the tab in pixels.

- <div>

  <div id="property-Tab-highlighted" class="dcc-code-sections__label">

  highlighted

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the tab is highlighted.

- <div>

  <div id="property-Tab-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab. Tab IDs are unique within a browser session. Under some circumstances a tab may not be assigned an ID; for example, when querying foreign tabs using the [`sessions`](https://developer.chrome.com/docs/extensions/reference/sessions/) API, in which case a session ID may be present. Tab ID can also be set to `chrome.tabs.TAB_ID_NONE` for apps and devtools windows.

- <div>

  <div id="property-Tab-incognito" class="dcc-code-sections__label">

  incognito

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the tab is in an incognito window.

- <div>

  <div id="property-Tab-index" class="dcc-code-sections__label">

  index

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The zero-based index of the tab within its window.

- <div>

  <div id="property-Tab-lastAccessed" class="dcc-code-sections__label">

  lastAccessed

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 121+ </span>

  </div>

  </div>

  The last time the tab became active in its window as the number of milliseconds since epoch.

- <div>

  <div id="property-Tab-mutedInfo" class="dcc-code-sections__label">

  mutedInfo

  </div>

  <div class="dcc-type--xsmall">

  [MutedInfo](#type-MutedInfo) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

  </div>

  </div>

  The tab's muted state and the reason for the last state change.

- <div>

  <div id="property-Tab-openerTabId" class="dcc-code-sections__label">

  openerTabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab that opened this tab, if any. This property is only present if the opener tab still exists.

- <div>

  <div id="property-Tab-pendingUrl" class="dcc-code-sections__label">

  pendingUrl

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 79+ </span>

  </div>

  </div>

  The URL the tab is navigating to, before it has committed. This property is only present if the extension has the `"tabs"` permission or has host permissions for the page and there is a pending navigation.

- <div>

  <div id="property-Tab-pinned" class="dcc-code-sections__label">

  pinned

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the tab is pinned.

- <div>

  <div id="property-Tab-selected" class="dcc-code-sections__label">

  selected

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated</span>

  </div>

  </div>

  Please use [`tabs.Tab.highlighted`](#property-Tab-highlighted).

  Whether the tab is selected.

- <div>

  <div id="property-Tab-sessionId" class="dcc-code-sections__label">

  sessionId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The session ID used to uniquely identify a tab obtained from the [`sessions`](https://developer.chrome.com/docs/extensions/reference/sessions/) API.

- <div>

  <div id="property-Tab-splitViewId" class="dcc-code-sections__label">

  splitViewId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 140+ </span>

  </div>

  </div>

  The ID of the Split View that the tab belongs to.

- <div>

  <div id="property-Tab-status" class="dcc-code-sections__label">

  status

  </div>

  <div class="dcc-type--xsmall">

  [TabStatus](#type-TabStatus) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The tab's loading status.

- <div>

  <div id="property-Tab-title" class="dcc-code-sections__label">

  title

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The title of the tab. This property is only present if the extension has the `"tabs"` permission or has host permissions for the page.

- <div>

  <div id="property-Tab-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The last committed URL of the main frame of the tab. This property is only present if the extension has the `"tabs"` permission or has host permissions for the page. May be an empty string if the tab has not yet committed. See also [`Tab.pendingUrl`](#property-Tab-pendingUrl).

- <div>

  <div id="property-Tab-width" class="dcc-code-sections__label">

  width

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The width of the tab in pixels.

- <div>

  <div id="property-Tab-windowId" class="dcc-code-sections__label">

  windowId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The ID of the window that contains the tab.

</div>

<div>

<div class="notranslate">

### TabStatus

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

The tab's loading status.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"unloaded"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"loading"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"complete"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### WindowType

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

The type of window.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"normal"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"popup"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"panel"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"app"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"devtools"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### ZoomSettings

</div>

Defines how zoom changes in a tab are handled and at what scope.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ZoomSettings-defaultZoomFactor" class="dcc-code-sections__label">

  defaultZoomFactor

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 43+ </span>

  </div>

  </div>

  Used to return the default zoom level for the current tab in calls to tabs.getZoomSettings.

- <div>

  <div id="property-ZoomSettings-mode" class="dcc-code-sections__label">

  mode

  </div>

  <div class="dcc-type--xsmall">

  [ZoomSettingsMode](#type-ZoomSettingsMode) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Defines how zoom changes are handled, i.e., which entity is responsible for the actual scaling of the page; defaults to `automatic`.

- <div>

  <div id="property-ZoomSettings-scope" class="dcc-code-sections__label">

  scope

  </div>

  <div class="dcc-type--xsmall">

  [ZoomSettingsScope](#type-ZoomSettingsScope) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Defines whether zoom changes persist for the page's origin, or only take effect in this tab; defaults to `per-origin` when in `automatic` mode, and `per-tab` otherwise.

</div>

<div>

<div class="notranslate">

### ZoomSettingsMode

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

Defines how zoom changes are handled, i.e., which entity is responsible for the actual scaling of the page; defaults to `automatic`.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"automatic"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Zoom changes are handled automatically by the browser.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"manual"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Overrides the automatic handling of zoom changes. The `onZoomChange` event will still be dispatched, and it is the extension's responsibility to listen for this event and manually scale the page. This mode does not support `per-origin` zooming, and thus ignores the `scope` zoom setting and assumes `per-tab`.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"disabled"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Disables all zooming in the tab. The tab reverts to the default zoom level, and all attempted zoom changes are ignored.</span>

</div>

</div>

<div>

<div class="notranslate">

### ZoomSettingsScope

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

Defines whether zoom changes persist for the page's origin, or only take effect in this tab; defaults to `per-origin` when in `automatic` mode, and `per-tab` otherwise.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"per-origin"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Zoom changes persist in the zoomed page's origin, i.e., all other tabs navigated to that same origin are zoomed as well. Moreover, `per-origin` zoom changes are saved with the origin, meaning that when navigating to other pages in the same origin, they are all zoomed to the same zoom factor. The `per-origin` scope is only available in the `automatic` mode.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"per-tab"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Zoom changes only take effect in this tab, and zoom changes in other tabs do not affect the zooming of this tab. Also, `per-tab` zoom changes are reset on navigation; navigating a tab always loads pages with their `per-origin` zoom factors.</span>

</div>

</div>

</div>

## Properties

<div>

<div>

<div class="notranslate">

### MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 92+ </span>

</div>

</div>

The maximum number of times that [`captureVisibleTab`](#method-captureVisibleTab) can be called per second. [`captureVisibleTab`](#method-captureVisibleTab) is expensive and should not be called too often.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">2</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### SPLIT_VIEW_ID_NONE

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 140+ </span>

</div>

</div>

An ID that represents the absence of a split tab.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">-1</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### TAB_ID_NONE

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

</div>

</div>

An ID that represents the absence of a browser tab.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">-1</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### TAB_INDEX_NONE

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 123+ </span>

</div>

</div>

An index that represents the absence of a tab index in a tab_strip.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">-1</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### captureVisibleTab()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.captureVisibleTab(
  windowId?: number,
  options?: ImageDetails,
): Promise<string>
```

Captures the visible area of the currently active tab in the specified window. In order to call this method, the extension must have either the [\<all_urls\>](https://developer.chrome.com/extensions/develop/concepts/declare-permissions) permission or the [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) permission. In addition to sites that extensions can normally access, this method allows extensions to capture sensitive sites that are otherwise restricted, including chrome:-scheme pages, other extensions' pages, and data: URLs. These sensitive sites can only be captured with the activeTab permission. File URLs may be captured only if the extension has been granted file access.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-captureVisibleTab-windowId" class="dcc-code-sections__label">

  windowId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The target window. Defaults to the [current window](https://developer.chrome.com/docs/extensions/reference/windows/#current-window).

- <div>

  <div id="type-captureVisibleTab-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [ImageDetails](https://developer.chrome.com/docs/extensions/reference/extensionTypes/#type-ImageDetails) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<string\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### connect()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.connect(
  tabId: number,
  connectInfo?: object,
): runtime.Port
```

Connects to the content script(s) in the specified tab. The [`runtime.onConnect`](https://developer.chrome.com/docs/extensions/reference/runtime/#event-onConnect) event is fired in each content script running in the specified tab for the current extension. For more details, see [Content Script Messaging](https://developer.chrome.com/docs/extensions/messaging).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-connect-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

- <div>

  <div id="type-connect-connectInfo" class="dcc-code-sections__label">

  connectInfo

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-connect-connectInfo-documentId" class="dcc-code-sections__label">

    documentId

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 106+ </span>

    </div>

    </div>

    Open a port to a specific [document](https://developer.chrome.com/docs/extensions/reference/webNavigation/#document_ids) identified by `documentId` instead of all frames in the tab.

  - <div>

    <div id="property-connect-connectInfo-frameId" class="dcc-code-sections__label">

    frameId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Open a port to a specific [frame](https://developer.chrome.com/docs/extensions/reference/webNavigation/#frame_ids) identified by `frameId` instead of all frames in the tab.

  - <div>

    <div id="property-connect-connectInfo-name" class="dcc-code-sections__label">

    name

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Is passed into onConnect for content scripts that are listening for the connection event.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  [runtime.Port](https://developer.chrome.com/docs/extensions/reference/runtime/#type-Port)

  </div>

  </div>

  A port that can be used to communicate with the content scripts running in the specified tab. The port's [`runtime.Port`](https://developer.chrome.com/docs/extensions/reference/runtime/#type-Port) event is fired if the tab closes or does not exist.

</div>

<div>

<div class="notranslate">

### create()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.create(
  createProperties: object,
): Promise<Tab>
```

Creates a new tab.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-create-createProperties" class="dcc-code-sections__label">

  createProperties

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-create-createProperties-active" class="dcc-code-sections__label">

    active

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the tab should become the active tab in the window. Does not affect whether the window is focused (see [`windows.update`](https://developer.chrome.com/docs/extensions/reference/windows/#method-update)). Defaults to `true`.

  - <div>

    <div id="property-create-createProperties-index" class="dcc-code-sections__label">

    index

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The position the tab should take in the window. The provided value is clamped to between zero and the number of tabs in the window.

  - <div>

    <div id="property-create-createProperties-openerTabId" class="dcc-code-sections__label">

    openerTabId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The ID of the tab that opened this tab. If specified, the opener tab must be in the same window as the newly created tab.

  - <div>

    <div id="property-create-createProperties-pinned" class="dcc-code-sections__label">

    pinned

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the tab should be pinned. Defaults to `false`

  - <div>

    <div id="property-create-createProperties-selected" class="dcc-code-sections__label">

    selected

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated</span>

    </div>

    </div>

    Please use *active*.

    Whether the tab should become the selected tab in the window. Defaults to `true`

  - <div>

    <div id="property-create-createProperties-url" class="dcc-code-sections__label">

    url

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The URL to initially navigate the tab to. Fully-qualified URLs must include a scheme (i.e., 'http://www.google.com', not 'www.google.com'). Relative URLs are relative to the current page within the extension. Defaults to the New Tab Page.

  - <div>

    <div id="property-create-createProperties-windowId" class="dcc-code-sections__label">

    windowId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The window in which to create the new tab. Defaults to the [current window](https://developer.chrome.com/docs/extensions/reference/windows/#current-window).

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Tab](#type-Tab)\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### detectLanguage()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.detectLanguage(
  tabId?: number,
): Promise<string>
```

Detects the primary language of the content in a tab.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-detectLanguage-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Defaults to the active tab of the [current window](https://developer.chrome.com/docs/extensions/reference/windows/#current-window).

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<string\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### discard()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.discard(
  tabId?: number,
): Promise<Tab | undefined>
```

Discards a tab from memory. Discarded tabs are still visible on the tab strip and are reloaded when activated.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-discard-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab to be discarded. If specified, the tab is discarded unless it is active or already discarded. If omitted, the browser discards the least important tab. This can fail if no discardable tabs exist.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Tab](#type-Tab) \| undefined\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

  Resolves after the operation is completed.

</div>

<div>

<div class="notranslate">

### duplicate()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.duplicate(
  tabId: number,
): Promise<Tab | undefined>
```

Duplicates a tab.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-duplicate-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The ID of the tab to duplicate.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Tab](#type-Tab) \| undefined\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### get()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.get(
  tabId: number,
): Promise<Tab>
```

Retrieves details about the specified tab.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-get-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Tab](#type-Tab)\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getCurrent()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.getCurrent(): Promise<Tab | undefined>
```

Gets the tab that this script call is being made from. Returns `undefined` if called from a non-tab context (for example, a background page or popup view).

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Tab](#type-Tab) \| undefined\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getZoom()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.getZoom(
  tabId?: number,
): Promise<number>
```

Gets the current zoom factor of a specified tab.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getZoom-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab to get the current zoom factor from; defaults to the active tab of the current window.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<number\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

  Resolves with the tab's current zoom factor after it has been fetched.

</div>

<div>

<div class="notranslate">

### getZoomSettings()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.getZoomSettings(
  tabId?: number,
): Promise<ZoomSettings>
```

Gets the current zoom settings of a specified tab.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getZoomSettings-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab to get the current zoom settings from; defaults to the active tab of the current window.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[ZoomSettings](#type-ZoomSettings)\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

  Resolves with the tab's current zoom settings.

</div>

<div>

<div class="notranslate">

### goBack()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 72+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.goBack(
  tabId?: number,
): Promise<void>
```

Go back to the previous page, if one is available.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-goBack-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab to navigate back; defaults to the selected tab of the current window.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### goForward()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 72+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.goForward(
  tabId?: number,
): Promise<void>
```

Go foward to the next page, if one is available.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-goForward-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab to navigate forward; defaults to the selected tab of the current window.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### group()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.group(
  options: object,
): Promise<number>
```

Adds one or more tabs to a specified group, or if no group is specified, adds the given tabs to a newly created group.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-group-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-group-options-createProperties" class="dcc-code-sections__label">

    createProperties

    </div>

    <div class="dcc-type--xsmall">

    object <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Configurations for creating a group. Cannot be used if groupId is already specified.

    <div class="dcc-code-sections">

    - <div>

      <div id="property-group-options-createProperties-windowId" class="dcc-code-sections__label">

      windowId

      </div>

      <div class="dcc-type--xsmall">

      number <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      The window of the new group. Defaults to the current window.

    </div>

  - <div>

    <div id="property-group-options-groupId" class="dcc-code-sections__label">

    groupId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The ID of the group to add the tabs to. If not specified, a new group will be created.

  - <div>

    <div id="property-group-options-tabIds" class="dcc-code-sections__label">

    tabIds

    </div>

    <div class="dcc-type--xsmall">

    number \| \[number, ...number\[\]\]

    </div>

    </div>

    The tab ID or list of tab IDs to add to the specified group.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<number\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### highlight()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.highlight(
  highlightInfo: object,
): Promise<windows.Window>
```

Highlights the given tabs and focuses on the first of group. Will appear to do nothing if the specified tab is currently active.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-highlight-highlightInfo" class="dcc-code-sections__label">

  highlightInfo

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-highlight-highlightInfo-tabs" class="dcc-code-sections__label">

    tabs

    </div>

    <div class="dcc-type--xsmall">

    number \| number\[\]

    </div>

    </div>

    One or more tab indices to highlight.

  - <div>

    <div id="property-highlight-highlightInfo-windowId" class="dcc-code-sections__label">

    windowId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The window that contains the tabs.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[windows.Window](https://developer.chrome.com/docs/extensions/reference/windows/#type-Window)\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### move()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.move(
  tabIds: number | number[],
  moveProperties: object,
): Promise<Tab | Tab[]>
```

Moves one or more tabs to a new position within its window, or to a new window. Note that tabs can only be moved to and from normal (window.type === "normal") windows.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-move-tabIds" class="dcc-code-sections__label">

  tabIds

  </div>

  <div class="dcc-type--xsmall">

  number \| number\[\]

  </div>

  </div>

  The tab ID or list of tab IDs to move.

- <div>

  <div id="type-move-moveProperties" class="dcc-code-sections__label">

  moveProperties

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-move-moveProperties-index" class="dcc-code-sections__label">

    index

    </div>

    <div class="dcc-type--xsmall">

    number

    </div>

    </div>

    The position to move the window to. Use `-1` to place the tab at the end of the window.

  - <div>

    <div id="property-move-moveProperties-windowId" class="dcc-code-sections__label">

    windowId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Defaults to the window the tab is currently in.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Tab](#type-Tab) \| [Tab](#type-Tab)\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### query()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.query(
  queryInfo: object,
): Promise<Tab[]>
```

Gets all tabs that have the specified properties, or all tabs if no properties are specified.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-query-queryInfo" class="dcc-code-sections__label">

  queryInfo

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-query-queryInfo-active" class="dcc-code-sections__label">

    active

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the tabs are active in their windows.

  - <div>

    <div id="property-query-queryInfo-audible" class="dcc-code-sections__label">

    audible

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 45+ </span>

    </div>

    </div>

    Whether the tabs are audible.

  - <div>

    <div id="property-query-queryInfo-autoDiscardable" class="dcc-code-sections__label">

    autoDiscardable

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

    </div>

    </div>

    Whether the tabs can be discarded automatically by the browser when resources are low.

  - <div>

    <div id="property-query-queryInfo-currentWindow" class="dcc-code-sections__label">

    currentWindow

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the tabs are in the [current window](https://developer.chrome.com/docs/extensions/reference/windows/#current-window).

  - <div>

    <div id="property-query-queryInfo-discarded" class="dcc-code-sections__label">

    discarded

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

    </div>

    </div>

    Whether the tabs are discarded. A discarded tab is one whose content has been unloaded from memory, but is still visible in the tab strip. Its content is reloaded the next time it is activated.

  - <div>

    <div id="property-query-queryInfo-frozen" class="dcc-code-sections__label">

    frozen

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 132+ </span>

    </div>

    </div>

    Whether the tabs are frozen. A frozen tab cannot execute tasks, including event handlers or timers. It is visible in the tab strip and its content is loaded in memory. It is unfrozen on activation.

  - <div>

    <div id="property-query-queryInfo-groupId" class="dcc-code-sections__label">

    groupId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

    </div>

    </div>

    The ID of the group that the tabs are in, or [`tabGroups.TAB_GROUP_ID_NONE`](https://developer.chrome.com/docs/extensions/reference/tabGroups/#property-TAB_GROUP_ID_NONE) for ungrouped tabs.

  - <div>

    <div id="property-query-queryInfo-highlighted" class="dcc-code-sections__label">

    highlighted

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the tabs are highlighted.

  - <div>

    <div id="property-query-queryInfo-index" class="dcc-code-sections__label">

    index

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The position of the tabs within their windows.

  - <div>

    <div id="property-query-queryInfo-lastFocusedWindow" class="dcc-code-sections__label">

    lastFocusedWindow

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the tabs are in the last focused window.

  - <div>

    <div id="property-query-queryInfo-muted" class="dcc-code-sections__label">

    muted

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 45+ </span>

    </div>

    </div>

    Whether the tabs are muted.

  - <div>

    <div id="property-query-queryInfo-pinned" class="dcc-code-sections__label">

    pinned

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the tabs are pinned.

  - <div>

    <div id="property-query-queryInfo-splitViewId" class="dcc-code-sections__label">

    splitViewId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 140+ </span>

    </div>

    </div>

    The ID of the Split View that the tabs are in, or [`tabs.SPLIT_VIEW_ID_NONE`](#property-SPLIT_VIEW_ID_NONE) for tabs that aren't in a Split View.

  - <div>

    <div id="property-query-queryInfo-status" class="dcc-code-sections__label">

    status

    </div>

    <div class="dcc-type--xsmall">

    [TabStatus](#type-TabStatus) <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The tab loading status.

  - <div>

    <div id="property-query-queryInfo-title" class="dcc-code-sections__label">

    title

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Match page titles against a pattern. This property is ignored if the extension does not have the `"tabs"` permission or host permissions for the page.

  - <div>

    <div id="property-query-queryInfo-url" class="dcc-code-sections__label">

    url

    </div>

    <div class="dcc-type--xsmall">

    string \| string\[\] <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Match tabs against one or more [URL patterns](https://developer.chrome.com/docs/extensions/match_patterns). Fragment identifiers are not matched. This property is ignored if the extension does not have the `"tabs"` permission or host permissions for the page.

  - <div>

    <div id="property-query-queryInfo-windowId" class="dcc-code-sections__label">

    windowId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The ID of the parent window, or [`windows.WINDOW_ID_CURRENT`](https://developer.chrome.com/docs/extensions/reference/windows/#property-WINDOW_ID_CURRENT) for the [current window](https://developer.chrome.com/docs/extensions/reference/windows/#current-window).

  - <div>

    <div id="property-query-queryInfo-windowType" class="dcc-code-sections__label">

    windowType

    </div>

    <div class="dcc-type--xsmall">

    [WindowType](#type-WindowType) <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The type of window the tabs are in.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Tab](#type-Tab)\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### reload()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.reload(
  tabId?: number,
  reloadProperties?: object,
): Promise<void>
```

Reload a tab.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-reload-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab to reload; defaults to the selected tab of the current window.

- <div>

  <div id="type-reload-reloadProperties" class="dcc-code-sections__label">

  reloadProperties

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-reload-reloadProperties-bypassCache" class="dcc-code-sections__label">

    bypassCache

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether to bypass local caching. Defaults to `false`.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### remove()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.remove(
  tabIds: number | number[],
): Promise<void>
```

Closes one or more tabs.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-remove-tabIds" class="dcc-code-sections__label">

  tabIds

  </div>

  <div class="dcc-type--xsmall">

  number \| number\[\]

  </div>

  </div>

  The tab ID or list of tab IDs to close.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### sendMessage()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.sendMessage(
  tabId: number,
  message: any,
  options?: object,
): Promise<any>
```

Sends a single message to the content script(s) in the specified tab. The [`runtime.onMessage`](https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage) event is fired in each content script running in the specified tab for the current extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-sendMessage-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

- <div>

  <div id="type-sendMessage-message" class="dcc-code-sections__label">

  message

  </div>

  <div class="dcc-type--xsmall">

  any

  </div>

  </div>

  The message to send. This message should be a JSON-ifiable object.

- <div>

  <div id="type-sendMessage-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-sendMessage-options-documentId" class="dcc-code-sections__label">

    documentId

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 106+ </span>

    </div>

    </div>

    Send a message to a specific [document](https://developer.chrome.com/docs/extensions/reference/webNavigation/#document_ids) identified by `documentId` instead of all frames in the tab.

  - <div>

    <div id="property-sendMessage-options-frameId" class="dcc-code-sections__label">

    frameId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Send a message to a specific [frame](https://developer.chrome.com/docs/extensions/reference/webNavigation/#frame_ids) identified by `frameId` instead of all frames in the tab.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<any\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 99+ </span>

  </div>

  </div>

  Promise that resolves with the response from the content script. If an error occurs while connecting to the specified tab, the promise will be rejected.

</div>

<div>

<div class="notranslate">

### setZoom()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.setZoom(
  tabId?: number,
  zoomFactor: number,
): Promise<void>
```

Zooms a specified tab.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setZoom-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab to zoom; defaults to the active tab of the current window.

- <div>

  <div id="type-setZoom-zoomFactor" class="dcc-code-sections__label">

  zoomFactor

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The new zoom factor. A value of `0` sets the tab to its current default zoom factor. Values greater than `0` specify a (possibly non-default) zoom factor for the tab.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

  Resolves after the zoom factor has been changed.

</div>

<div>

<div class="notranslate">

### setZoomSettings()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.setZoomSettings(
  tabId?: number,
  zoomSettings: ZoomSettings,
): Promise<void>
```

Sets the zoom settings for a specified tab, which define how zoom changes are handled. These settings are reset to defaults upon navigating the tab.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setZoomSettings-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab to change the zoom settings for; defaults to the active tab of the current window.

- <div>

  <div id="type-setZoomSettings-zoomSettings" class="dcc-code-sections__label">

  zoomSettings

  </div>

  <div class="dcc-type--xsmall">

  [ZoomSettings](#type-ZoomSettings)

  </div>

  </div>

  Defines how zoom changes are handled and at what scope.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

  Resolves after the zoom settings are changed.

</div>

<div>

<div class="notranslate">

### ungroup()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.ungroup(
  tabIds: number | [number, ...number[]],
): Promise<void>
```

Removes one or more tabs from their respective groups. If any groups become empty, they are deleted.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-ungroup-tabIds" class="dcc-code-sections__label">

  tabIds

  </div>

  <div class="dcc-type--xsmall">

  number \| \[number, ...number\[\]\]

  </div>

  </div>

  The tab ID or list of tab IDs to remove from their respective groups.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### update()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.update(
  tabId?: number,
  updateProperties: object,
): Promise<Tab | undefined>
```

Modifies the properties of a tab. Properties that are not specified in `updateProperties` are not modified.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-update-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Defaults to the selected tab of the [current window](https://developer.chrome.com/docs/extensions/reference/windows/#current-window).

- <div>

  <div id="type-update-updateProperties" class="dcc-code-sections__label">

  updateProperties

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-update-updateProperties-active" class="dcc-code-sections__label">

    active

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the tab should be active. Does not affect whether the window is focused (see [`windows.update`](https://developer.chrome.com/docs/extensions/reference/windows/#method-update)).

  - <div>

    <div id="property-update-updateProperties-autoDiscardable" class="dcc-code-sections__label">

    autoDiscardable

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

    </div>

    </div>

    Whether the tab should be discarded automatically by the browser when resources are low.

  - <div>

    <div id="property-update-updateProperties-highlighted" class="dcc-code-sections__label">

    highlighted

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Adds or removes the tab from the current selection.

  - <div>

    <div id="property-update-updateProperties-muted" class="dcc-code-sections__label">

    muted

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 45+ </span>

    </div>

    </div>

    Whether the tab should be muted.

  - <div>

    <div id="property-update-updateProperties-openerTabId" class="dcc-code-sections__label">

    openerTabId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The ID of the tab that opened this tab. If specified, the opener tab must be in the same window as this tab.

  - <div>

    <div id="property-update-updateProperties-pinned" class="dcc-code-sections__label">

    pinned

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the tab should be pinned.

  - <div>

    <div id="property-update-updateProperties-selected" class="dcc-code-sections__label">

    selected

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated</span>

    </div>

    </div>

    Please use *highlighted*.

    Whether the tab should be selected.

  - <div>

    <div id="property-update-updateProperties-url" class="dcc-code-sections__label">

    url

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    A URL to navigate the tab to. JavaScript URLs are not supported; use [`scripting.executeScript`](https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript) instead.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Tab](#type-Tab) \| undefined\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onActivated

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.onActivated.addListener(
  callback: function,
)
```

Fires when the active tab in a window changes. Note that the tab's URL may not be set at the time this event fired, but you can listen to onUpdated events so as to be notified when a URL is set.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onActivated-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (activeInfo: object) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onActivated-callback-activeInfo" class="dcc-code-sections__label">

    activeInfo

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onActivated-callback-activeInfo-tabId" class="dcc-code-sections__label">

      tabId

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

      The ID of the tab that has become active.

    - <div>

      <div id="property-onActivated-callback-activeInfo-windowId" class="dcc-code-sections__label">

      windowId

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

      The ID of the window the active tab changed inside of.

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onAttached

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.onAttached.addListener(
  callback: function,
)
```

Fired when a tab is attached to a window; for example, because it was moved between windows.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onAttached-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (tabId: number, attachInfo: object) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onAttached-callback-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number

    </div>

    </div>

  - <div>

    <div id="type-onAttached-callback-attachInfo" class="dcc-code-sections__label">

    attachInfo

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onAttached-callback-attachInfo-newPosition" class="dcc-code-sections__label">

      newPosition

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

    - <div>

      <div id="property-onAttached-callback-attachInfo-newWindowId" class="dcc-code-sections__label">

      newWindowId

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onCreated

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.onCreated.addListener(
  callback: function,
)
```

Fired when a tab is created. Note that the tab's URL and tab group membership may not be set at the time this event is fired, but you can listen to onUpdated events so as to be notified when a URL is set or the tab is added to a tab group.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onCreated-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (tab: Tab) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onCreated-callback-tab" class="dcc-code-sections__label">

    tab

    </div>

    <div class="dcc-type--xsmall">

    [Tab](#type-Tab)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onDetached

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.onDetached.addListener(
  callback: function,
)
```

Fired when a tab is detached from a window; for example, because it was moved between windows.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onDetached-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (tabId: number, detachInfo: object) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onDetached-callback-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number

    </div>

    </div>

  - <div>

    <div id="type-onDetached-callback-detachInfo" class="dcc-code-sections__label">

    detachInfo

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onDetached-callback-detachInfo-oldPosition" class="dcc-code-sections__label">

      oldPosition

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

    - <div>

      <div id="property-onDetached-callback-detachInfo-oldWindowId" class="dcc-code-sections__label">

      oldWindowId

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onHighlighted

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.onHighlighted.addListener(
  callback: function,
)
```

Fired when the highlighted or selected tabs in a window changes.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onHighlighted-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (highlightInfo: object) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onHighlighted-callback-highlightInfo" class="dcc-code-sections__label">

    highlightInfo

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onHighlighted-callback-highlightInfo-tabIds" class="dcc-code-sections__label">

      tabIds

      </div>

      <div class="dcc-type--xsmall">

      number\[\]

      </div>

      </div>

      All highlighted tabs in the window.

    - <div>

      <div id="property-onHighlighted-callback-highlightInfo-windowId" class="dcc-code-sections__label">

      windowId

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

      The window whose tabs changed.

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onMoved

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.onMoved.addListener(
  callback: function,
)
```

Fired when a tab is moved within a window. Only one move event is fired, representing the tab the user directly moved. Move events are not fired for the other tabs that must move in response to the manually-moved tab. This event is not fired when a tab is moved between windows; for details, see [`tabs.onDetached`](#event-onDetached).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onMoved-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (tabId: number, moveInfo: object) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onMoved-callback-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number

    </div>

    </div>

  - <div>

    <div id="type-onMoved-callback-moveInfo" class="dcc-code-sections__label">

    moveInfo

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onMoved-callback-moveInfo-fromIndex" class="dcc-code-sections__label">

      fromIndex

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

    - <div>

      <div id="property-onMoved-callback-moveInfo-toIndex" class="dcc-code-sections__label">

      toIndex

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

    - <div>

      <div id="property-onMoved-callback-moveInfo-windowId" class="dcc-code-sections__label">

      windowId

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onRemoved

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.onRemoved.addListener(
  callback: function,
)
```

Fired when a tab is closed.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onRemoved-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (tabId: number, removeInfo: object) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onRemoved-callback-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number

    </div>

    </div>

  - <div>

    <div id="type-onRemoved-callback-removeInfo" class="dcc-code-sections__label">

    removeInfo

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onRemoved-callback-removeInfo-isWindowClosing" class="dcc-code-sections__label">

      isWindowClosing

      </div>

      <div class="dcc-type--xsmall">

      boolean

      </div>

      </div>

      True when the tab was closed because its parent window was closed.

    - <div>

      <div id="property-onRemoved-callback-removeInfo-windowId" class="dcc-code-sections__label">

      windowId

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

      The window whose tab is closed.

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onReplaced

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.onReplaced.addListener(
  callback: function,
)
```

Fired when a tab is replaced with another tab due to prerendering or instant.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onReplaced-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (addedTabId: number, removedTabId: number) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onReplaced-callback-addedTabId" class="dcc-code-sections__label">

    addedTabId

    </div>

    <div class="dcc-type--xsmall">

    number

    </div>

    </div>

  - <div>

    <div id="type-onReplaced-callback-removedTabId" class="dcc-code-sections__label">

    removedTabId

    </div>

    <div class="dcc-type--xsmall">

    number

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onUpdated

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.onUpdated.addListener(
  callback: function,
)
```

Fired when a tab is updated.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onUpdated-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (tabId: number, changeInfo: object, tab: Tab) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onUpdated-callback-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number

    </div>

    </div>

  - <div>

    <div id="type-onUpdated-callback-changeInfo" class="dcc-code-sections__label">

    changeInfo

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onUpdated-callback-changeInfo-audible" class="dcc-code-sections__label">

      audible

      </div>

      <div class="dcc-type--xsmall">

      boolean <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      <div class="pad-top-200">

      <div>

      <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 45+ </span>

      </div>

      </div>

      The tab's new audible state.

    - <div>

      <div id="property-onUpdated-callback-changeInfo-autoDiscardable" class="dcc-code-sections__label">

      autoDiscardable

      </div>

      <div class="dcc-type--xsmall">

      boolean <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      <div class="pad-top-200">

      <div>

      <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

      </div>

      </div>

      The tab's new auto-discardable state.

    - <div>

      <div id="property-onUpdated-callback-changeInfo-discarded" class="dcc-code-sections__label">

      discarded

      </div>

      <div class="dcc-type--xsmall">

      boolean <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      <div class="pad-top-200">

      <div>

      <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

      </div>

      </div>

      The tab's new discarded state.

    - <div>

      <div id="property-onUpdated-callback-changeInfo-favIconUrl" class="dcc-code-sections__label">

      favIconUrl

      </div>

      <div class="dcc-type--xsmall">

      string <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      The tab's new favicon URL.

    - <div>

      <div id="property-onUpdated-callback-changeInfo-frozen" class="dcc-code-sections__label">

      frozen

      </div>

      <div class="dcc-type--xsmall">

      boolean <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      <div class="pad-top-200">

      <div>

      <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 132+ </span>

      </div>

      </div>

      The tab's new frozen state.

    - <div>

      <div id="property-onUpdated-callback-changeInfo-groupId" class="dcc-code-sections__label">

      groupId

      </div>

      <div class="dcc-type--xsmall">

      number <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      <div class="pad-top-200">

      <div>

      <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

      </div>

      </div>

      The tab's new group.

    - <div>

      <div id="property-onUpdated-callback-changeInfo-mutedInfo" class="dcc-code-sections__label">

      mutedInfo

      </div>

      <div class="dcc-type--xsmall">

      [MutedInfo](#type-MutedInfo) <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      <div class="pad-top-200">

      <div>

      <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

      </div>

      </div>

      The tab's new muted state and the reason for the change.

    - <div>

      <div id="property-onUpdated-callback-changeInfo-pinned" class="dcc-code-sections__label">

      pinned

      </div>

      <div class="dcc-type--xsmall">

      boolean <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      The tab's new pinned state.

    - <div>

      <div id="property-onUpdated-callback-changeInfo-splitViewId" class="dcc-code-sections__label">

      splitViewId

      </div>

      <div class="dcc-type--xsmall">

      number <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      <div class="pad-top-200">

      <div>

      <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 140+ </span>

      </div>

      </div>

      The tab's new Split View.

    - <div>

      <div id="property-onUpdated-callback-changeInfo-status" class="dcc-code-sections__label">

      status

      </div>

      <div class="dcc-type--xsmall">

      [TabStatus](#type-TabStatus) <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      The tab's loading status.

    - <div>

      <div id="property-onUpdated-callback-changeInfo-title" class="dcc-code-sections__label">

      title

      </div>

      <div class="dcc-type--xsmall">

      string <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      <div class="pad-top-200">

      <div>

      <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 48+ </span>

      </div>

      </div>

      The tab's new title.

    - <div>

      <div id="property-onUpdated-callback-changeInfo-url" class="dcc-code-sections__label">

      url

      </div>

      <div class="dcc-type--xsmall">

      string <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      The tab's URL if it has changed.

    </div>

  - <div>

    <div id="type-onUpdated-callback-tab" class="dcc-code-sections__label">

    tab

    </div>

    <div class="dcc-type--xsmall">

    [Tab](#type-Tab)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onZoomChange

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.tabs.onZoomChange.addListener(
  callback: function,
)
```

Fired when a tab is zoomed.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onZoomChange-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (ZoomChangeInfo: object) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onZoomChange-callback-ZoomChangeInfo" class="dcc-code-sections__label">

    ZoomChangeInfo

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onZoomChange-callback-ZoomChangeInfo-newZoomFactor" class="dcc-code-sections__label">

      newZoomFactor

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

    - <div>

      <div id="property-onZoomChange-callback-ZoomChangeInfo-oldZoomFactor" class="dcc-code-sections__label">

      oldZoomFactor

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

    - <div>

      <div id="property-onZoomChange-callback-ZoomChangeInfo-tabId" class="dcc-code-sections__label">

      tabId

      </div>

      <div class="dcc-type--xsmall">

      number

      </div>

      </div>

    - <div>

      <div id="property-onZoomChange-callback-ZoomChangeInfo-zoomSettings" class="dcc-code-sections__label">

      zoomSettings

      </div>

      <div class="dcc-type--xsmall">

      [ZoomSettings](#type-ZoomSettings)

      </div>

      </div>

    </div>

  </div>

</div>

</div>

</div>

</div>

<div class="devsite-floating-action-buttons">

</div>

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-03-03 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-03-03 UTC."\],\[\],\[\]\]

</div>

</div>