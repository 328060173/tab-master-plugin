> 来源: https://developer.chrome.com/docs/extensions/reference/api
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

# API reference <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

Most extensions need access to one or more Chrome Extensions APIs to function. This API reference describes the APIs available for use in extensions and presents example use cases.

Beginning in Chrome 148, these APIs are also available under the `browser` namespace as a cross-browser alternative to `chrome`. See [The browser namespace](/docs/extensions/develop/concepts/browser-namespace) for adoption guidance.

## Common Extensions API features

An Extensions API consists of a namespace containing methods and properties for doing extensions work, and usually, but not always, manifest fields for the `manifest.json` file. For example, the `chrome.action` namespace requires an `"action"` object in the manifest. Many APIs also require [permissions](/docs/extensions/mv3/declare_permissions) in the manifest.

Methods in extension APIs are **asynchronous** unless stated otherwise. Asynchronous methods return immediately, without waiting for the operation that calls them to finish. Use [promises](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous/Promises) to get the results of these asynchronous methods.

<div class="aside key-point">

Manifest V3 is supported generally in Chrome 88 or later. For extension features added in later Chrome versions, see the API reference documentation for support information. If your extension requires a specific API, you can specify a minimum chrome version in the manifest file.

</div>

## Chrome Extension APIs

[accessibilityFeatures](/docs/extensions/reference/api/accessibilityFeatures)  
<div class="dcc-reference">

</div>

Use the `chrome.accessibilityFeatures` API to manage Chrome's accessibility features. This API relies on the [ChromeSetting prototype of the type API](https://developer.chrome.com/docs/extensions/reference/types/#ChromeSetting) for getting and setting individual accessibility features. In order to get feature states the extension must request `accessibilityFeatures.read` permission. For modifying feature state, the extension needs `accessibilityFeatures.modify` permission. Note that `accessibilityFeatures.modify` does not imply `accessibilityFeatures.read` permission.

[action](/docs/extensions/reference/api/action)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

Use the `chrome.action` API to control the extension's icon in the Google Chrome toolbar.

[alarms](/docs/extensions/reference/api/alarms)  
<div class="dcc-reference">

</div>

Use the `chrome.alarms` API to schedule code to run periodically or at a specified time in the future.

[audio](/docs/extensions/reference/api/audio)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 59+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

The `chrome.audio` API is provided to allow users to get information about and control the audio devices attached to the system. This API is currently only available in kiosk mode for ChromeOS.

[bookmarks](/docs/extensions/reference/api/bookmarks)  
<div class="dcc-reference">

</div>

Use the `chrome.bookmarks` API to create, organize, and otherwise manipulate bookmarks. Also see [Override Pages](https://developer.chrome.com/docs/extensions/override), which you can use to create a custom Bookmark Manager page.

[browsingData](/docs/extensions/reference/api/browsingData)  
<div class="dcc-reference">

</div>

Use the `chrome.browsingData` API to remove browsing data from a user's local profile.

[certificateProvider](/docs/extensions/reference/api/certificateProvider)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

Use this API to expose certificates to the platform which can use these certificates for TLS authentications.

[commands](/docs/extensions/reference/api/commands)  
<div class="dcc-reference">

</div>

Use the commands API to add keyboard shortcuts that trigger actions in your extension, for example, an action to open the browser action or send a command to the extension.

[contentSettings](/docs/extensions/reference/api/contentSettings)  
<div class="dcc-reference">

</div>

Use the `chrome.contentSettings` API to change settings that control whether websites can use features such as cookies, JavaScript, and plugins. More generally speaking, content settings allow you to customize Chrome's behavior on a per-site basis instead of globally.

[contextMenus](/docs/extensions/reference/api/contextMenus)  
<div class="dcc-reference">

</div>

Use the `chrome.contextMenus` API to add items to Google Chrome's context menu. You can choose what types of objects your context menu additions apply to, such as images, hyperlinks, and pages.

[cookies](/docs/extensions/reference/api/cookies)  
<div class="dcc-reference">

</div>

Use the `chrome.cookies` API to query and modify cookies, and to be notified when they change.

[debugger](/docs/extensions/reference/api/debugger)  
<div class="dcc-reference">

</div>

The `chrome.debugger` API serves as an alternate transport for Chrome's [remote debugging protocol](https://developer.chrome.com/devtools/docs/debugger-protocol). Use `chrome.debugger` to attach to one or more tabs to instrument network interaction, debug JavaScript, mutate the DOM and CSS, and more. Use the [`Debuggee`](#type-Debuggee) property `tabId` to target tabs with `sendCommand` and route events by `tabId` from `onEvent` callbacks.

[declarativeContent](/docs/extensions/reference/api/declarativeContent)  
<div class="dcc-reference">

</div>

Use the `chrome.declarativeContent` API to take actions depending on the content of a page, without requiring permission to read the page's content.

[declarativeNetRequest](/docs/extensions/reference/api/declarativeNetRequest)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 84+ </span>

</div>

</div>

</div>

The `chrome.declarativeNetRequest` API is used to block or modify network requests by specifying declarative rules. This lets extensions modify network requests without intercepting them and viewing their content, thus providing more privacy.

[desktopCapture](/docs/extensions/reference/api/desktopCapture)  
<div class="dcc-reference">

</div>

The Desktop Capture API captures the content of the screen, individual windows, or individual tabs.

[devtools.inspectedWindow](/docs/extensions/reference/api/devtools/inspectedWindow)  
<div class="dcc-reference">

</div>

Use the `chrome.devtools.inspectedWindow` API to interact with the inspected window: obtain the tab ID for the inspected page, evaluate the code in the context of the inspected window, reload the page, or obtain the list of resources within the page.

[devtools.network](/docs/extensions/reference/api/devtools/network)  
<div class="dcc-reference">

</div>

Use the `chrome.devtools.network` API to retrieve the information about network requests displayed by the Developer Tools in the Network panel.

[devtools.panels](/docs/extensions/reference/api/devtools/panels)  
<div class="dcc-reference">

</div>

Use the `chrome.devtools.panels` API to integrate your extension into Developer Tools window UI: create your own panels, access existing panels, and add sidebars.

[devtools.performance](/docs/extensions/reference/api/devtools/performance)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 129+ </span>

</div>

</div>

</div>

Use the `chrome.devtools.performance` API to listen to recording status updates in the Performance panel in DevTools.

[devtools.recorder](/docs/extensions/reference/api/devtools/recorder)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 105+ </span>

</div>

</div>

</div>

Use the `chrome.devtools.recorder` API to customize the Recorder panel in DevTools.

[dns](/docs/extensions/reference/api/dns)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--red dcc-tag-pill"> Dev channel </span>

</div>

</div>

</div>

Use the `chrome.dns` API for dns resolution.

[documentScan](/docs/extensions/reference/api/documentScan)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

Use the `chrome.documentScan` API to discover and retrieve images from attached document scanners.

[dom](/docs/extensions/reference/api/dom)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

</div>

</div>

</div>

Use the `chrome.dom` API to access special DOM APIs for Extensions

[downloads](/docs/extensions/reference/api/downloads)  
<div class="dcc-reference">

</div>

Use the `chrome.downloads` API to programmatically initiate, monitor, manipulate, and search for downloads.

[enterprise.deviceAttributes](/docs/extensions/reference/api/enterprise/deviceAttributes)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span> [<span class="dcc-tag-pill--purple dcc-tag-pill" title="Only available to policy installed extensions"> Requires policy </span>](https://support.google.com/chrome/a/answer/9296680)

</div>

</div>

</div>

Use the `chrome.enterprise.deviceAttributes` API to read device attributes. Note: This API is only available to extensions force-installed by enterprise policy.

[enterprise.hardwarePlatform](/docs/extensions/reference/api/enterprise/hardwarePlatform)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 71+ </span> [<span class="dcc-tag-pill--purple dcc-tag-pill" title="Only available to policy installed extensions"> Requires policy </span>](https://support.google.com/chrome/a/answer/9296680)

</div>

</div>

</div>

Use the `chrome.enterprise.hardwarePlatform` API to get the manufacturer and model of the hardware platform where the browser runs. Note: This API is only available to extensions installed by enterprise policy.

[enterprise.login](/docs/extensions/reference/api/enterprise/login)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 139+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span> [<span class="dcc-tag-pill--purple dcc-tag-pill" title="Only available to policy installed extensions"> Requires policy </span>](https://support.google.com/chrome/a/answer/9296680)

</div>

</div>

</div>

Use the `chrome.enterprise.login` API to exit Managed Guest sessions. Note: This API is only available to extensions installed by enterprise policy in ChromeOS Managed Guest sessions.

[enterprise.networkingAttributes](/docs/extensions/reference/api/enterprise/networkingAttributes)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 85+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span> [<span class="dcc-tag-pill--purple dcc-tag-pill" title="Only available to policy installed extensions"> Requires policy </span>](https://support.google.com/chrome/a/answer/9296680)

</div>

</div>

</div>

Use the `chrome.enterprise.networkingAttributes` API to read information about your current network. Note: This API is only available to extensions force-installed by enterprise policy.

[enterprise.platformKeys](/docs/extensions/reference/api/enterprise/platformKeys)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span> [<span class="dcc-tag-pill--purple dcc-tag-pill" title="Only available to policy installed extensions"> Requires policy </span>](https://support.google.com/chrome/a/answer/9296680)

</div>

</div>

</div>

Use the `chrome.enterprise.platformKeys` API to generate keys and install certificates for these keys. The certificates will be managed by the platform and can be used for TLS authentication, network access or by other extension through chrome.platformKeys.

[events](/docs/extensions/reference/api/events)  
<div class="dcc-reference">

</div>

The `chrome.events` namespace contains common types used by APIs dispatching events to notify you when something interesting happens.

[extension](/docs/extensions/reference/api/extension)  
<div class="dcc-reference">

</div>

The `chrome.extension` API has utilities that can be used by any extension page. It includes support for exchanging messages between an extension and its content scripts or between extensions, as described in detail in [Message Passing](https://developer.chrome.com/docs/extensions/messaging).

[extensionTypes](/docs/extensions/reference/api/extensionTypes)  
<div class="dcc-reference">

</div>

The `chrome.extensionTypes` API contains type declarations for Chrome extensions.

[fileBrowserHandler](/docs/extensions/reference/api/fileBrowserHandler)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Not available in Service Workers"> Foreground only </span>

</div>

</div>

</div>

Use the `chrome.fileBrowserHandler` API to extend the Chrome OS file browser. For example, you can use this API to enable users to upload files to your website.

[fileSystemProvider](/docs/extensions/reference/api/fileSystemProvider)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

Use the `chrome.fileSystemProvider` API to create file systems, that can be accessible from the file manager on Chrome OS.

[fontSettings](/docs/extensions/reference/api/fontSettings)  
<div class="dcc-reference">

</div>

Use the `chrome.fontSettings` API to manage Chrome's font settings.

[gcm](/docs/extensions/reference/api/gcm)  
<div class="dcc-reference">

</div>

Use `chrome.gcm` to enable apps and extensions to send and receive messages through [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/) (FCM).

[history](/docs/extensions/reference/api/history)  
<div class="dcc-reference">

</div>

Use the `chrome.history` API to interact with the browser's record of visited pages. You can add, remove, and query for URLs in the browser's history. To override the history page with your own version, see [Override Pages](https://developer.chrome.com/extensions/develop/ui/override-chrome-pages).

[i18n](/docs/extensions/reference/api/i18n)  
<div class="dcc-reference">

</div>

Use the `chrome.i18n` infrastructure to implement internationalization across your whole app or extension.

[identity](/docs/extensions/reference/api/identity)  
<div class="dcc-reference">

</div>

Use the `chrome.identity` API to get OAuth2 access tokens.

[idle](/docs/extensions/reference/api/idle)  
<div class="dcc-reference">

</div>

Use the `chrome.idle` API to detect when the machine's idle state changes.

[input.ime](/docs/extensions/reference/api/input/ime)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

Use the `chrome.input.ime` API to implement a custom IME for Chrome OS. This allows your extension to handle keystrokes, set the composition, and manage the candidate window.

[instanceID](/docs/extensions/reference/api/instanceID)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

Use `chrome.instanceID` to access the Instance ID service.

[loginState](/docs/extensions/reference/api/loginState)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 78+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

Use the `chrome.loginState` API to read and monitor the login state.

[management](/docs/extensions/reference/api/management)  
<div class="dcc-reference">

</div>

The `chrome.management` API provides ways to manage installed apps and extensions.

[notifications](/docs/extensions/reference/api/notifications)  
<div class="dcc-reference">

</div>

Use the `chrome.notifications` API to create rich notifications using templates and show these notifications to users in the system tray.

[offscreen](/docs/extensions/reference/api/offscreen)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 109+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

Use the `offscreen` API to create and manage offscreen documents.

[omnibox](/docs/extensions/reference/api/omnibox)  
<div class="dcc-reference">

</div>

The omnibox API allows you to register a keyword with Google Chrome's address bar, which is also known as the omnibox.

[pageCapture](/docs/extensions/reference/api/pageCapture)  
<div class="dcc-reference">

</div>

Use the `chrome.pageCapture` API to save a tab as MHTML.

[permissions](/docs/extensions/reference/api/permissions)  
<div class="dcc-reference">

</div>

Use the `chrome.permissions` API to request [declared optional permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions) at run time rather than install time, so users understand why the permissions are needed and grant only those that are necessary.

[platformKeys](/docs/extensions/reference/api/platformKeys)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 45+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

Use the `chrome.platformKeys` API to access client certificates managed by the platform. If the user or policy grants the permission, an extension can use such a certficate in its custom authentication protocol. E.g. this allows usage of platform managed certificates in third party VPNs (see [chrome.vpnProvider](/docs/extensions/reference/api/vpnProvider)).

[power](/docs/extensions/reference/api/power)  
<div class="dcc-reference">

</div>

Use the `chrome.power` API to override the system's power management features.

[printerProvider](/docs/extensions/reference/api/printerProvider)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

</div>

The `chrome.printerProvider` API exposes events used by print manager to query printers controlled by extensions, to query their capabilities and to submit print jobs to these printers.

[printing](/docs/extensions/reference/api/printing)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 81+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

Use the `chrome.printing` API to send print jobs to printers installed on Chromebook.

[printingMetrics](/docs/extensions/reference/api/printingMetrics)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 79+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span> [<span class="dcc-tag-pill--purple dcc-tag-pill" title="Only available to policy installed extensions"> Requires policy </span>](https://support.google.com/chrome/a/answer/9296680)

</div>

</div>

</div>

Use the `chrome.printingMetrics` API to fetch data about printing usage.

[privacy](/docs/extensions/reference/api/privacy)  
<div class="dcc-reference">

</div>

Use the `chrome.privacy` API to control usage of the features in Chrome that can affect a user's privacy. This API relies on the [ChromeSetting prototype of the type API](https://developer.chrome.com/docs/extensions/reference/types/#ChromeSetting) for getting and setting Chrome's configuration.

[processes](/docs/extensions/reference/api/processes)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--red dcc-tag-pill"> Dev channel </span>

</div>

</div>

</div>

Use the `chrome.processes` API to interact with the browser's processes.

[proxy](/docs/extensions/reference/api/proxy)  
<div class="dcc-reference">

</div>

Use the `chrome.proxy` API to manage Chrome's proxy settings. This API relies on the [ChromeSetting prototype of the type API](https://developer.chrome.com/docs/extensions/reference/api/types#type-ChromeSetting) for getting and setting the proxy configuration.

[readingList](/docs/extensions/reference/api/readingList)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 120+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

Use the `chrome.readingList` API to read from and modify the items in the [Reading List](https://support.google.com/chrome/answer/7343019).

[runtime](/docs/extensions/reference/api/runtime)  
<div class="dcc-reference">

</div>

Use the `chrome.runtime` API to retrieve the service worker, return details about the manifest, and listen for and respond to events in the extension lifecycle. You can also use this API to convert the relative path of URLs to fully-qualified URLs.

[scripting](/docs/extensions/reference/api/scripting)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

Use the `chrome.scripting` API to execute script in different contexts.

[search](/docs/extensions/reference/api/search)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 87+ </span>

</div>

</div>

</div>

Use the `chrome.search` API to search via the default provider.

[sessions](/docs/extensions/reference/api/sessions)  
<div class="dcc-reference">

</div>

Use the `chrome.sessions` API to query and restore tabs and windows from a browsing session.

[sidePanel](/docs/extensions/reference/api/sidePanel)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 114+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

Use the `chrome.sidePanel` API to host content in the browser's side panel alongside the main content of a webpage.

[storage](/docs/extensions/reference/api/storage)  
<div class="dcc-reference">

</div>

Use the `chrome.storage` API to store, retrieve, and track changes to user data.

[system.cpu](/docs/extensions/reference/api/system/cpu)  
<div class="dcc-reference">

</div>

Use the `system.cpu` API to query CPU metadata.

[system.display](/docs/extensions/reference/api/system/display)  
<div class="dcc-reference">

</div>

Use the `system.display` API to query display metadata.

[system.memory](/docs/extensions/reference/api/system/memory)  
<div class="dcc-reference">

</div>

The `chrome.system.memory` API.

[system.storage](/docs/extensions/reference/api/system/storage)  
<div class="dcc-reference">

</div>

Use the `chrome.system.storage` API to query storage device information and be notified when a removable storage device is attached and detached.

[systemLog](/docs/extensions/reference/api/systemLog)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span> [<span class="dcc-tag-pill--purple dcc-tag-pill" title="Only available to policy installed extensions"> Requires policy </span>](https://support.google.com/chrome/a/answer/9296680)

</div>

</div>

</div>

Use the `chrome.systemLog` API to record Chrome system logs from extensions.

[tabCapture](/docs/extensions/reference/api/tabCapture)  
<div class="dcc-reference">

</div>

Use the `chrome.tabCapture` API to interact with tab media streams.

[tabGroups](/docs/extensions/reference/api/tabGroups)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 89+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

Use the `chrome.tabGroups` API to interact with the browser's tab grouping system. You can use this API to modify and rearrange tab groups in the browser. To group and ungroup tabs, or to query what tabs are in groups, use the `chrome.tabs` API.

[tabs](/docs/extensions/reference/api/tabs)  
<div class="dcc-reference">

</div>

Use the `chrome.tabs` API to interact with the browser's tab system. You can use this API to create, modify, and rearrange tabs in the browser.

[topSites](/docs/extensions/reference/api/topSites)  
<div class="dcc-reference">

</div>

Use the `chrome.topSites` API to access the top sites (i.e. most visited sites) that are displayed on the new tab page. These do not include shortcuts customized by the user.

[tts](/docs/extensions/reference/api/tts)  
<div class="dcc-reference">

</div>

Use the `chrome.tts` API to play synthesized text-to-speech (TTS). See also the related [`ttsEngine`](/docs/extensions/reference/api/ttsEngine) API, which allows an extension to implement a speech engine.

[ttsEngine](/docs/extensions/reference/api/ttsEngine)  
<div class="dcc-reference">

</div>

Use the `chrome.ttsEngine` API to implement a text-to-speech(TTS) engine using an extension. If your extension registers using this API, it will receive events containing an utterance to be spoken and other parameters when any extension or Chrome App uses the [`tts`](/docs/extensions/reference/api/tts) API to generate speech. Your extension can then use any available web technology to synthesize and output the speech, and send events back to the calling function to report the status.

[types](/docs/extensions/reference/api/types)  
<div class="dcc-reference">

</div>

The `chrome.types` API contains type declarations for Chrome.

[userScripts](/docs/extensions/reference/api/userScripts)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 120+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

Use the `userScripts` API to execute user scripts in the User Scripts context.

[vpnProvider](/docs/extensions/reference/api/vpnProvider)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 43+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

Use the `chrome.vpnProvider` API to implement a VPN client.

[wallpaper](/docs/extensions/reference/api/wallpaper)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 43+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

Use the `chrome.wallpaper` API to change the ChromeOS wallpaper.

[webAuthenticationProxy](/docs/extensions/reference/api/webAuthenticationProxy)  
<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 115+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

The `chrome.webAuthenticationProxy` API lets remote desktop software running on a remote host intercept Web Authentication API (WebAuthn) requests in order to handle them on a local client.

[webNavigation](/docs/extensions/reference/api/webNavigation)  
<div class="dcc-reference">

</div>

Use the `chrome.webNavigation` API to receive notifications about the status of navigation requests in-flight.

[webRequest](/docs/extensions/reference/api/webRequest)  
<div class="dcc-reference">

</div>

Use the `chrome.webRequest` API to observe and analyze traffic and to intercept, block, or modify requests in-flight.

[windows](/docs/extensions/reference/api/windows)  
<div class="dcc-reference">

</div>

Use the `chrome.windows` API to interact with browser windows. You can use this API to create, modify, and rearrange windows in the browser.

</div>

<div class="devsite-floating-action-buttons">

</div>

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-05-11 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-05-11 UTC."\],\[\],\[\]\]

</div>

</div>