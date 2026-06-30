> 来源: https://developer.chrome.com/docs/extensions/reference/api/windows
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

# chrome.windows <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.windows` API to interact with browser windows. You can use this API to create, modify, and rearrange windows in the browser.

</div>

## Permissions

When requested, a [`windows.Window`](#type-Window) contains an array of [`tabs.Tab`](/docs/extensions/reference/api/tabs#type-Tab) objects. You must declare the `"tabs"` permission in your [manifest](/docs/extensions/reference/api/tabs#manifest) if you need access to the [`url`](/docs/extensions/reference/api/tabs#property-Tab-url), [`pendingUrl`](/docs/extensions/reference/api/tabs#property-Tab-pendingUrl), [`title`](/docs/extensions/reference/api/tabs#property-Tab-title), or [`favIconUrl`](/docs/extensions/reference/api/tabs#property-Tab-favIconUrl) properties of [`tabs.Tab`](/docs/extensions/reference/api/tabs#type-Tab). For example:

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "permissions": ["tabs"],
  ...
}
```

## Concepts and usage

### The current window

Many functions in the extension system take an optional `windowId` argument, which defaults to the current window.

The *current window* is the window that contains the code that is currently executing. It's important to realize that this can be different from the topmost or focused window.

For example, say an extension creates a few tabs or windows from a single HTML file, and that the HTML file contains a call to [`tabs.query()`](/docs/extensions/reference/api/tabs#method-query). The current window is the window that contains the page that made the call, no matter what the topmost window is.

In the case of [service workers](/docs/extensions/develop/concepts/service-workers), the value of the current window falls back to the last active window. Under some circumstances, there may be no current window for background pages.

## Examples

To try this API, install the [windows API example](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/windows) from the [chrome-extension-samples](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples) repository.

<figure>
<img src="/static/docs/extensions/reference/api/windows/images/windows.png" class="screenshot" width="561" alt="Two windows, each with one tab" />
<figcaption>Two windows, each with one tab.</figcaption>
</figure>

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### CreateType

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

Specifies what type of browser window to create. 'panel' is deprecated and is available only to existing allowlisted extensions on Chrome OS.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"normal"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the window as a standard window.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"popup"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the window as a popup window.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"panel"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the window as a panel.</span>

</div>

</div>

<div>

<div class="notranslate">

### QueryOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-QueryOptions-populate" class="dcc-code-sections__label">

  populate

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If true, the [`windows.Window`](#type-Window) object has a `tabs` property that contains a list of the [`tabs.Tab`](https://developer.chrome.com/docs/extensions/reference/api/tabs/#type-Tab) objects. The `Tab` objects only contain the `url`, `pendingUrl`, `title`, and `favIconUrl` properties if the extension's manifest file includes the `"tabs"` permission.

- <div>

  <div id="property-QueryOptions-windowTypes" class="dcc-code-sections__label">

  windowTypes

  </div>

  <div class="dcc-type--xsmall">

  [WindowType](#type-WindowType)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If set, the [`windows.Window`](#type-Window) returned is filtered based on its type. If unset, the default filter is set to `['normal', 'popup']`.

</div>

<div>

<div class="notranslate">

### Window

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Window-alwaysOnTop" class="dcc-code-sections__label">

  alwaysOnTop

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the window is set to be always on top.

- <div>

  <div id="property-Window-focused" class="dcc-code-sections__label">

  focused

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the window is currently the focused window.

- <div>

  <div id="property-Window-height" class="dcc-code-sections__label">

  height

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The height of the window, including the frame, in pixels. In some circumstances a window may not be assigned a `height` property; for example, when querying closed windows from the [`sessions`](https://developer.chrome.com/docs/extensions/reference/api/sessions/) API.

- <div>

  <div id="property-Window-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the window. Window IDs are unique within a browser session. In some circumstances a window may not be assigned an `ID` property; for example, when querying windows using the [`sessions`](https://developer.chrome.com/docs/extensions/reference/api/sessions/) API, in which case a session ID may be present.

- <div>

  <div id="property-Window-incognito" class="dcc-code-sections__label">

  incognito

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the window is incognito.

- <div>

  <div id="property-Window-left" class="dcc-code-sections__label">

  left

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The offset of the window from the left edge of the screen in pixels. In some circumstances a window may not be assigned a `left` property; for example, when querying closed windows from the [`sessions`](https://developer.chrome.com/docs/extensions/reference/api/sessions/) API.

- <div>

  <div id="property-Window-sessionId" class="dcc-code-sections__label">

  sessionId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The session ID used to uniquely identify a window, obtained from the [`sessions`](https://developer.chrome.com/docs/extensions/reference/api/sessions/) API.

- <div>

  <div id="property-Window-state" class="dcc-code-sections__label">

  state

  </div>

  <div class="dcc-type--xsmall">

  [WindowState](#type-WindowState) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The state of this browser window.

- <div>

  <div id="property-Window-tabs" class="dcc-code-sections__label">

  tabs

  </div>

  <div class="dcc-type--xsmall">

  [Tab](https://developer.chrome.com/docs/extensions/reference/api/tabs/#type-Tab)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Array of [`tabs.Tab`](https://developer.chrome.com/docs/extensions/reference/api/tabs/#type-Tab) objects representing the current tabs in the window.

- <div>

  <div id="property-Window-top" class="dcc-code-sections__label">

  top

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The offset of the window from the top edge of the screen in pixels. In some circumstances a window may not be assigned a `top` property; for example, when querying closed windows from the [`sessions`](https://developer.chrome.com/docs/extensions/reference/api/sessions/) API.

- <div>

  <div id="property-Window-type" class="dcc-code-sections__label">

  type

  </div>

  <div class="dcc-type--xsmall">

  [WindowType](#type-WindowType) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The type of browser window this is.

- <div>

  <div id="property-Window-width" class="dcc-code-sections__label">

  width

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The width of the window, including the frame, in pixels. In some circumstances a window may not be assigned a `width` property; for example, when querying closed windows from the [`sessions`](https://developer.chrome.com/docs/extensions/reference/api/sessions/) API.

</div>

<div>

<div class="notranslate">

### WindowState

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

The state of this browser window. In some circumstances a window may not be assigned a `state` property; for example, when querying closed windows from the [`sessions`](https://developer.chrome.com/docs/extensions/reference/api/sessions/) API.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"normal"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Normal window state (not minimized, maximized, or fullscreen).</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"minimized"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Minimized window state.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"maximized"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Maximized window state.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"fullscreen"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Fullscreen window state.</span>

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

The type of browser window this is. In some circumstances a window may not be assigned a `type` property; for example, when querying closed windows from the [`sessions`](https://developer.chrome.com/docs/extensions/reference/api/sessions/) API.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"normal"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">A normal browser window.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"popup"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">A browser popup.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"panel"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">*Deprecated in this API.* A Chrome App panel-style window. Extensions can only see their own panel windows.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"app"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">*Deprecated in this API.* A Chrome App window. Extensions can only see their app own windows.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"devtools"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">A Developer Tools window.</span>

</div>

</div>

</div>

## Properties

<div>

<div>

<div class="notranslate">

### WINDOW_ID_CURRENT

</div>

The windowId value that represents the [current window](https://developer.chrome.com/docs/extensions/reference/windows/#the_current_window).

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">-2</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### WINDOW_ID_NONE

</div>

The windowId value that represents the absence of a Chrome browser window.

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

### create()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.windows.create(
  createData?: object,
): Promise<Window | undefined>
```

Creates (opens) a new browser window with any optional sizing, position, or default URL provided.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-create-createData" class="dcc-code-sections__label">

  createData

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-create-createData-focused" class="dcc-code-sections__label">

    focused

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    If `true`, opens an active window. If `false`, opens an inactive window.

  - <div>

    <div id="property-create-createData-height" class="dcc-code-sections__label">

    height

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The height in pixels of the new window, including the frame. If not specified, defaults to a natural height.

  - <div>

    <div id="property-create-createData-incognito" class="dcc-code-sections__label">

    incognito

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the new window should be an incognito window.

  - <div>

    <div id="property-create-createData-left" class="dcc-code-sections__label">

    left

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The number of pixels to position the new window from the left edge of the screen. If not specified, the new window is offset naturally from the last focused window. This value is ignored for panels.

  - <div>

    <div id="property-create-createData-setSelfAsOpener" class="dcc-code-sections__label">

    setSelfAsOpener

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 64+ </span>

    </div>

    </div>

    If `true`, the newly-created window's 'window.opener' is set to the caller and is in the same [unit of related browsing contexts](https://www.w3.org/TR/html51/browsers.html#unit-of-related-browsing-contexts) as the caller.

  - <div>

    <div id="property-create-createData-state" class="dcc-code-sections__label">

    state

    </div>

    <div class="dcc-type--xsmall">

    [WindowState](#type-WindowState) <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

    </div>

    </div>

    The initial state of the window. The `minimized`, `maximized`, and `fullscreen` states cannot be combined with `left`, `top`, `width`, or `height`.

  - <div>

    <div id="property-create-createData-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The ID of the tab to add to the new window.

  - <div>

    <div id="property-create-createData-top" class="dcc-code-sections__label">

    top

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The number of pixels to position the new window from the top edge of the screen. If not specified, the new window is offset naturally from the last focused window. This value is ignored for panels.

  - <div>

    <div id="property-create-createData-type" class="dcc-code-sections__label">

    type

    </div>

    <div class="dcc-type--xsmall">

    [CreateType](#type-CreateType) <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Specifies what type of browser window to create.

  - <div>

    <div id="property-create-createData-url" class="dcc-code-sections__label">

    url

    </div>

    <div class="dcc-type--xsmall">

    string \| string\[\] <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    A URL or array of URLs to open as tabs in the window. Fully-qualified URLs must include a scheme, e.g., 'http://www.google.com', not 'www.google.com'. Non-fully-qualified URLs are considered relative within the extension. Defaults to the New Tab Page.

  - <div>

    <div id="property-create-createData-width" class="dcc-code-sections__label">

    width

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The width in pixels of the new window, including the frame. If not specified, defaults to a natural width.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Window](#type-Window) \| undefined\>

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
chrome.windows.get(
  windowId: number,
  queryOptions?: QueryOptions,
): Promise<Window>
```

Gets details about a window.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-get-windowId" class="dcc-code-sections__label">

  windowId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

- <div>

  <div id="type-get-queryOptions" class="dcc-code-sections__label">

  queryOptions

  </div>

  <div class="dcc-type--xsmall">

  [QueryOptions](#type-QueryOptions) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Window](#type-Window)\>

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

### getAll()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.windows.getAll(
  queryOptions?: QueryOptions,
): Promise<Window[]>
```

Gets all windows.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getAll-queryOptions" class="dcc-code-sections__label">

  queryOptions

  </div>

  <div class="dcc-type--xsmall">

  [QueryOptions](#type-QueryOptions) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Window](#type-Window)\[\]\>

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
chrome.windows.getCurrent(
  queryOptions?: QueryOptions,
): Promise<Window>
```

Gets the [current window](https://developer.chrome.com/docs/extensions/reference/windows/#current-window).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getCurrent-queryOptions" class="dcc-code-sections__label">

  queryOptions

  </div>

  <div class="dcc-type--xsmall">

  [QueryOptions](#type-QueryOptions) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Window](#type-Window)\>

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

### getLastFocused()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.windows.getLastFocused(
  queryOptions?: QueryOptions,
): Promise<Window>
```

Gets the window that was most recently focused — typically the window 'on top'.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getLastFocused-queryOptions" class="dcc-code-sections__label">

  queryOptions

  </div>

  <div class="dcc-type--xsmall">

  [QueryOptions](#type-QueryOptions) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Window](#type-Window)\>

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
chrome.windows.remove(
  windowId: number,
): Promise<void>
```

Removes (closes) a window and all the tabs inside it.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-remove-windowId" class="dcc-code-sections__label">

  windowId

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

### update()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.windows.update(
  windowId: number,
  updateInfo: object,
): Promise<Window>
```

Updates the properties of a window. Specify only the properties that to be changed; unspecified properties are unchanged.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-update-windowId" class="dcc-code-sections__label">

  windowId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

- <div>

  <div id="type-update-updateInfo" class="dcc-code-sections__label">

  updateInfo

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-update-updateInfo-drawAttention" class="dcc-code-sections__label">

    drawAttention

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    If `true`, causes the window to be displayed in a manner that draws the user's attention to the window, without changing the focused window. The effect lasts until the user changes focus to the window. This option has no effect if the window already has focus. Set to `false` to cancel a previous `drawAttention` request.

  - <div>

    <div id="property-update-updateInfo-focused" class="dcc-code-sections__label">

    focused

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    If `true`, brings the window to the front; cannot be combined with the state 'minimized'. If `false`, brings the next window in the z-order to the front; cannot be combined with the state 'fullscreen' or 'maximized'.

  - <div>

    <div id="property-update-updateInfo-height" class="dcc-code-sections__label">

    height

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The height to resize the window to in pixels. This value is ignored for panels.

  - <div>

    <div id="property-update-updateInfo-left" class="dcc-code-sections__label">

    left

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The offset from the left edge of the screen to move the window to in pixels. This value is ignored for panels.

  - <div>

    <div id="property-update-updateInfo-state" class="dcc-code-sections__label">

    state

    </div>

    <div class="dcc-type--xsmall">

    [WindowState](#type-WindowState) <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The new state of the window. The 'minimized', 'maximized', and 'fullscreen' states cannot be combined with 'left', 'top', 'width', or 'height'.

  - <div>

    <div id="property-update-updateInfo-top" class="dcc-code-sections__label">

    top

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The offset from the top edge of the screen to move the window to in pixels. This value is ignored for panels.

  - <div>

    <div id="property-update-updateInfo-width" class="dcc-code-sections__label">

    width

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The width to resize the window to in pixels. This value is ignored for panels.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Window](#type-Window)\>

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

### onBoundsChanged

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 86+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.windows.onBoundsChanged.addListener(
  callback: function,
)
```

Fired when a window has been resized; this event is only dispatched when the new bounds are committed, and not for in-progress changes.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onBoundsChanged-callback" class="dcc-code-sections__label">

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
  (window: Window) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onBoundsChanged-callback-window" class="dcc-code-sections__label">

    window

    </div>

    <div class="dcc-type--xsmall">

    [Window](#type-Window)

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
chrome.windows.onCreated.addListener(
  callback: function,
  filters?: object,
)
```

Fired when a window is created.

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

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (window: Window) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onCreated-callback-window" class="dcc-code-sections__label">

    window

    </div>

    <div class="dcc-type--xsmall">

    [Window](#type-Window)

    </div>

    </div>

    Details of the created window.

  </div>

- <div>

  <div id="type-onCreated-filters" class="dcc-code-sections__label">

  filters

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-onCreated-filters-windowTypes" class="dcc-code-sections__label">

    windowTypes

    </div>

    <div class="dcc-type--xsmall">

    [WindowType](#type-WindowType)\[\]

    </div>

    </div>

    Conditions that the window's type being created must satisfy. By default it satisfies `['normal', 'popup']`.

  </div>

</div>

<div>

<div class="notranslate">

### onFocusChanged

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.windows.onFocusChanged.addListener(
  callback: function,
  filters?: object,
)
```

Fired when the currently focused window changes. Returns `chrome.windows.WINDOW_ID_NONE` if all Chrome windows have lost focus. **Note:** On some Linux window managers, `WINDOW_ID_NONE` is always sent immediately preceding a switch from one Chrome window to another.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onFocusChanged-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (windowId: number) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onFocusChanged-callback-windowId" class="dcc-code-sections__label">

    windowId

    </div>

    <div class="dcc-type--xsmall">

    number

    </div>

    </div>

    ID of the newly-focused window.

  </div>

- <div>

  <div id="type-onFocusChanged-filters" class="dcc-code-sections__label">

  filters

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-onFocusChanged-filters-windowTypes" class="dcc-code-sections__label">

    windowTypes

    </div>

    <div class="dcc-type--xsmall">

    [WindowType](#type-WindowType)\[\]

    </div>

    </div>

    Conditions that the window's type being removed must satisfy. By default it satisfies `['normal', 'popup']`.

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
chrome.windows.onRemoved.addListener(
  callback: function,
  filters?: object,
)
```

Fired when a window is removed (closed).

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

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (windowId: number) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onRemoved-callback-windowId" class="dcc-code-sections__label">

    windowId

    </div>

    <div class="dcc-type--xsmall">

    number

    </div>

    </div>

    ID of the removed window.

  </div>

- <div>

  <div id="type-onRemoved-filters" class="dcc-code-sections__label">

  filters

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-onRemoved-filters-windowTypes" class="dcc-code-sections__label">

    windowTypes

    </div>

    <div class="dcc-type--xsmall">

    [WindowType](#type-WindowType)\[\]

    </div>

    </div>

    Conditions that the window's type being removed must satisfy. By default it satisfies `['normal', 'popup']`.

  </div>

</div>

</div>

</div>

</div>

<div class="devsite-floating-action-buttons">

</div>

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-05-14 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-05-14 UTC."\],\[\],\[\]\]

</div>

</div>