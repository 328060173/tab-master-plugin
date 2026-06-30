> 来源: https://developer.chrome.com/docs/extensions/reference/api/scripting
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

# chrome.scripting <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.scripting` API to execute script in different contexts.

</div>

## Permissions

<div class="dcc-reference">

`scripting`\

</div>

## Availability

<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

## Manifest

To use the `chrome.scripting` API, declare the `"scripting"` permission in the [manifest](/docs/extensions/reference/manifest) plus the host permissions for the pages to inject scripts into. Use the [`"host_permissions"`](/docs/extensions/develop/concepts/declare-permissions) key or the [`"activeTab"`](/docs/extensions/develop/concepts/activeTab) permission, which grants temporary host permissions. The following example uses the activeTab permission.

<div>

</div>

``` devsite-click-to-copy
{
  "name": "Scripting Extension",
  "manifest_version": 3,
  "permissions": ["scripting", "activeTab"],
  ...
}
```

## Concepts and usage

You can use the `chrome.scripting` API to inject JavaScript and CSS into websites. This is similar to what you can do with [content scripts](/docs/extensions/develop/concepts/content-scripts). But by using the [`chrome.scripting`](/docs/extensions/reference/scripting) namespace, extensions can make decisions at runtime.

### Injection targets

You can use the `target` parameter to specify a target to inject JavaScript or CSS into.

The only required field is `tabId`. By default, an injection will run in the main frame of the specified tab.

<div>

</div>

``` devsite-click-to-copy
function getTabId() { ... }

chrome.scripting
    .executeScript({
      target : {tabId : getTabId()},
      files : [ "script.js" ],
    })
    .then(() => console.log("script injected"));
```

To run in all frames of the specified tab, you can set the `allFrames` boolean to `true`.

<div>

</div>

``` devsite-click-to-copy
function getTabId() { ... }

chrome.scripting
    .executeScript({
      target : {tabId : getTabId(), allFrames : true},
      files : [ "script.js" ],
    })
    .then(() => console.log("script injected in all frames"));
```

You can also inject into specific frames of a tab by specifying individual frame IDs. For more information on frame IDs, see the [`chrome.webNavigation` API](/docs/extensions/reference/api/webNavigation).

<div>

</div>

``` devsite-click-to-copy
function getTabId() { ... }

chrome.scripting
    .executeScript({
      target : {tabId : getTabId(), frameIds : [ frameId1, frameId2 ]},
      files : [ "script.js" ],
    })
    .then(() => console.log("script injected on target frames"));
```

<div class="aside note">

**Note:** You cannot specify both the `"frameIds"` and `"allFrames"` properties.

</div>

### Injected code

Extensions can specify the code to be injected either via an external file or a runtime variable.

#### Files

Files are specified as strings that are paths relative to the extension's root directory. The following code will inject the file `script.js` into the main frame of the tab.

<div>

</div>

``` devsite-click-to-copy
function getTabId() { ... }

chrome.scripting
    .executeScript({
      target : {tabId : getTabId()},
      files : [ "script.js" ],
    })
    .then(() => console.log("injected script file"));
```

#### Runtime functions

When injecting JavaScript with `scripting.executeScript()`, you can specify a function to be executed instead of a file. This function should be a function variable available to the current extension context.

<div>

</div>

``` devsite-click-to-copy
function getTabId() { ... }
function getTitle() { return document.title; }

chrome.scripting
    .executeScript({
      target : {tabId : getTabId()},
      func : getTitle,
    })
    .then(() => console.log("injected a function"));
```

<div>

</div>

``` devsite-click-to-copy
function getTabId() { ... }
function getUserColor() { ... }

function changeBackgroundColor() {
  document.body.style.backgroundColor = getUserColor();
}

chrome.scripting
    .executeScript({
      target : {tabId : getTabId()},
      func : changeBackgroundColor,
    })
    .then(() => console.log("injected a function"));
```

You can work around this by using the `args` property:

<div>

</div>

``` devsite-click-to-copy
function getTabId() { ... }
function getUserColor() { ... }
function changeBackgroundColor(backgroundColor) {
  document.body.style.backgroundColor = backgroundColor;
}

chrome.scripting
    .executeScript({
      target : {tabId : getTabId()},
      func : changeBackgroundColor,
      args : [ getUserColor() ],
    })
    .then(() => console.log("injected a function"));
```

#### Runtime strings

If injecting CSS within a page, you can also specify a string to be used in the `css` property. This option is only available for `scripting.insertCSS()`; you can't execute a string using `scripting.executeScript()`.

<div>

</div>

``` devsite-click-to-copy
function getTabId() { ... }
const css = "body { background-color: red; }";

chrome.scripting
    .insertCSS({
      target : {tabId : getTabId()},
      css : css,
    })
    .then(() => console.log("CSS injected"));
```

### Handle the results

The results of executing JavaScript are passed to the extension. A single result is included per-frame. The main frame is guaranteed to be the first index in the resulting array; all other frames are in a non-deterministic order.

<div>

</div>

``` devsite-click-to-copy
function getTabId() { ... }
function getTitle() { return document.title; }

chrome.scripting
    .executeScript({
      target : {tabId : getTabId(), allFrames : true},
      func : getTitle,
    })
    .then(injectionResults => {
      for (const {frameId, result} of injectionResults) {
        console.log(`Frame ${frameId} result:`, result);
      }
    });
```

`scripting.insertCSS()` does not return any results.

#### Promises

If the resulting value of the script execution is a promise, Chrome will wait for the promise to settle and return the resulting value.

<div>

</div>

``` devsite-click-to-copy
function getTabId() { ... }
async function addIframe() {
  const iframe = document.createElement("iframe");
  const loadComplete =
      new Promise(resolve => iframe.addEventListener("load", resolve));
  iframe.src = "https://example.com";
  document.body.appendChild(iframe);
  await loadComplete;
  return iframe.contentWindow.document.title;
}

chrome.scripting
    .executeScript({
      target : {tabId : getTabId(), allFrames : true},
      func : addIframe,
    })
    .then(injectionResults => {
      for (const frameResult of injectionResults) {
        const {frameId, result} = frameResult;
        console.log(`Frame ${frameId} result:`, result);
      }
    });
```

## Examples

### Unregister all dynamic content scripts

The following snippet contains a function that unregisters all dynamic content scripts the extension has previously registered.

<div>

</div>

``` devsite-click-to-copy
async function unregisterAllDynamicContentScripts() {
  try {
    const scripts = await chrome.scripting.getRegisteredContentScripts();
    const scriptIds = scripts.map(script => script.id);
    return chrome.scripting.unregisterContentScripts({ ids: scriptIds });
  } catch (error) {
    const message = [
      "An unexpected error occurred while",
      "unregistering dynamic content scripts.",
    ].join(" ");
    throw new Error(message, {cause : error});
  }
}
```

<div class="aside key-point">

**Key point:** Unregistering content scripts will not remove scripts or styles that have already been injected.

</div>

To try the `chrome.scripting` API, install the [scripting sample](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/scripting) from the [Chrome extension samples](https://github.com/GoogleChrome/chrome-extensions-samples) repository.

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### ContentScriptFilter

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ContentScriptFilter-ids" class="dcc-code-sections__label">

  ids

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified, [`getRegisteredContentScripts`](#method-getRegisteredContentScripts) will only return scripts with an id specified in this list.

</div>

<div>

<div class="notranslate">

### CSSInjection

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-CSSInjection-css" class="dcc-code-sections__label">

  css

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  A string containing the CSS to inject. Exactly one of `files` and `css` must be specified.

- <div>

  <div id="property-CSSInjection-files" class="dcc-code-sections__label">

  files

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The path of the CSS files to inject, relative to the extension's root directory. Exactly one of `files` and `css` must be specified.

- <div>

  <div id="property-CSSInjection-origin" class="dcc-code-sections__label">

  origin

  </div>

  <div class="dcc-type--xsmall">

  [StyleOrigin](#type-StyleOrigin) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The style origin for the injection. Defaults to `'AUTHOR'`.

- <div>

  <div id="property-CSSInjection-target" class="dcc-code-sections__label">

  target

  </div>

  <div class="dcc-type--xsmall">

  [InjectionTarget](#type-InjectionTarget)

  </div>

  </div>

  Details specifying the target into which to insert the CSS.

</div>

<div>

<div class="notranslate">

### ExecutionWorld

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 95+ </span>

</div>

</div>

The JavaScript world for a script to execute within.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ISOLATED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the isolated world, which is the execution environment unique to this extension.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"MAIN"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the main world of the DOM, which is the execution environment shared with the host page's JavaScript.</span>

</div>

</div>

<div>

<div class="notranslate">

### InjectionResult

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-InjectionResult-documentId" class="dcc-code-sections__label">

  documentId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 106+ </span>

  </div>

  </div>

  The document associated with the injection.

- <div>

  <div id="property-InjectionResult-frameId" class="dcc-code-sections__label">

  frameId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 90+ </span>

  </div>

  </div>

  The frame associated with the injection.

- <div>

  <div id="property-InjectionResult-result" class="dcc-code-sections__label">

  result

  </div>

  <div class="dcc-type--xsmall">

  any <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The result of the script execution.

</div>

<div>

<div class="notranslate">

### InjectionTarget

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-InjectionTarget-allFrames" class="dcc-code-sections__label">

  allFrames

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether the script should inject into all frames within the tab. Defaults to false. This must not be true if `frameIds` is specified.

- <div>

  <div id="property-InjectionTarget-documentIds" class="dcc-code-sections__label">

  documentIds

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 106+ </span>

  </div>

  </div>

  The [IDs](https://developer.chrome.com/docs/extensions/reference/webNavigation/#document_ids) of specific documentIds to inject into. This must not be set if `frameIds` is set.

- <div>

  <div id="property-InjectionTarget-frameIds" class="dcc-code-sections__label">

  frameIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The [IDs](https://developer.chrome.com/docs/extensions/reference/webNavigation/#frame_ids) of specific frames to inject into.

- <div>

  <div id="property-InjectionTarget-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The ID of the tab into which to inject.

</div>

<div>

<div class="notranslate">

### RegisteredContentScript

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-RegisteredContentScript-allFrames" class="dcc-code-sections__label">

  allFrames

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified true, it will inject into all frames, even if the frame is not the top-most frame in the tab. Each frame is checked independently for URL requirements; it will not inject into child frames if the URL requirements are not met. Defaults to false, meaning that only the top frame is matched.

- <div>

  <div id="property-RegisteredContentScript-css" class="dcc-code-sections__label">

  css

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The list of CSS files to be injected into matching pages. These are injected in the order they appear in this array, before any DOM is constructed or displayed for the page.

- <div>

  <div id="property-RegisteredContentScript-excludeMatches" class="dcc-code-sections__label">

  excludeMatches

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Excludes pages that this content script would otherwise be injected into. See [Match Patterns](https://developer.chrome.com/extensions/develop/concepts/match-patterns) for more details on the syntax of these strings.

- <div>

  <div id="property-RegisteredContentScript-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The id of the content script, specified in the API call. Must not start with a '\_' as it's reserved as a prefix for generated script IDs.

- <div>

  <div id="property-RegisteredContentScript-js" class="dcc-code-sections__label">

  js

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The list of JavaScript files to be injected into matching pages. These are injected in the order they appear in this array.

- <div>

  <div id="property-RegisteredContentScript-matchOriginAsFallback" class="dcc-code-sections__label">

  matchOriginAsFallback

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 119+ </span>

  </div>

  </div>

  Indicates whether the script can be injected into frames where the URL contains an unsupported scheme; specifically: about:, data:, blob:, or filesystem:. In these cases, the URL's origin is checked to determine if the script should be injected. If the origin is `null` (as is the case for data: URLs) then the used origin is either the frame that created the current frame or the frame that initiated the navigation to this frame. Note that this may not be the parent frame.

- <div>

  <div id="property-RegisteredContentScript-matches" class="dcc-code-sections__label">

  matches

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies which pages this content script will be injected into. See [Match Patterns](https://developer.chrome.com/extensions/develop/concepts/match-patterns) for more details on the syntax of these strings. Must be specified for [`registerContentScripts`](#method-registerContentScripts).

- <div>

  <div id="property-RegisteredContentScript-persistAcrossSessions" class="dcc-code-sections__label">

  persistAcrossSessions

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies if this content script will persist into future sessions. The default is true.

- <div>

  <div id="property-RegisteredContentScript-runAt" class="dcc-code-sections__label">

  runAt

  </div>

  <div class="dcc-type--xsmall">

  [RunAt](https://developer.chrome.com/docs/extensions/reference/extensionTypes/#type-RunAt) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies when JavaScript files are injected into the web page. The preferred and default value is `document_idle`.

- <div>

  <div id="property-RegisteredContentScript-world" class="dcc-code-sections__label">

  world

  </div>

  <div class="dcc-type--xsmall">

  [ExecutionWorld](#type-ExecutionWorld) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 102+ </span>

  </div>

  </div>

  The JavaScript "world" to run the script in. Defaults to `ISOLATED`.

</div>

<div>

<div class="notranslate">

### ScriptInjection

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ScriptInjection-args" class="dcc-code-sections__label">

  args

  </div>

  <div class="dcc-type--xsmall">

  any\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 92+ </span>

  </div>

  </div>

  The arguments to pass to the provided function. This is only valid if the `func` parameter is specified. These arguments must be JSON-serializable.

- <div>

  <div id="property-ScriptInjection-files" class="dcc-code-sections__label">

  files

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The path of the JS or CSS files to inject, relative to the extension's root directory. Exactly one of `files` or `func` must be specified.

- <div>

  <div id="property-ScriptInjection-injectImmediately" class="dcc-code-sections__label">

  injectImmediately

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 102+ </span>

  </div>

  </div>

  Whether the injection should be triggered in the target as soon as possible. Note that this is not a guarantee that injection will occur prior to page load, as the page may have already loaded by the time the script reaches the target.

- <div>

  <div id="property-ScriptInjection-target" class="dcc-code-sections__label">

  target

  </div>

  <div class="dcc-type--xsmall">

  [InjectionTarget](#type-InjectionTarget)

  </div>

  </div>

  Details specifying the target into which to inject the script.

- <div>

  <div id="property-ScriptInjection-world" class="dcc-code-sections__label">

  world

  </div>

  <div class="dcc-type--xsmall">

  [ExecutionWorld](#type-ExecutionWorld) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 95+ </span>

  </div>

  </div>

  The JavaScript "world" to run the script in. Defaults to `ISOLATED`.

- <div>

  <div id="method-ScriptInjection-func" class="dcc-code-sections__label">

  func

  </div>

  <div class="dcc-type--xsmall">

  void <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 92+ </span>

  </div>

  </div>

  A JavaScript function to inject. This function will be serialized, and then deserialized for injection. This means that any bound parameters and execution context will be lost. Exactly one of `files` or `func` must be specified.

  The `func` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  () => {...}
  ```

</div>

<div>

<div class="notranslate">

### StyleOrigin

</div>

The origin for a style change. See [style origins](https://developer.mozilla.org/en-US/docs/Glossary/Style_origin) for more info.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"AUTHOR"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"USER"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### executeScript()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.scripting.executeScript(
  injection: ScriptInjection,
): Promise<InjectionResult[]>
```

Injects a script into a target context. By default, the script will be run at `document_idle`, or immediately if the page has already loaded. If the `injectImmediately` property is set, the script will inject without waiting, even if the page has not finished loading. If the script evaluates to a promise, the browser will wait for the promise to settle and return the resulting value.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-executeScript-injection" class="dcc-code-sections__label">

  injection

  </div>

  <div class="dcc-type--xsmall">

  [ScriptInjection](#type-ScriptInjection)

  </div>

  </div>

  The details of the script which to inject.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[InjectionResult](#type-InjectionResult)\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 90+ </span>

  </div>

  </div>

  Returns a Promise which resolves upon completion of the injection. The resulting array contains the result of execution for each frame where the injection succeeded.

</div>

<div>

<div class="notranslate">

### getRegisteredContentScripts()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.scripting.getRegisteredContentScripts(
  filter?: ContentScriptFilter,
): Promise<RegisteredContentScript[]>
```

Returns all dynamically registered content scripts for this extension that match the given filter.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getRegisteredContentScripts-filter" class="dcc-code-sections__label">

  filter

  </div>

  <div class="dcc-type--xsmall">

  [ContentScriptFilter](#type-ContentScriptFilter) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  An object to filter the extension's dynamically registered scripts.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[RegisteredContentScript](#type-RegisteredContentScript)\[\]\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### insertCSS()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.scripting.insertCSS(
  injection: CSSInjection,
): Promise<void>
```

Inserts a CSS stylesheet into a target context. If multiple frames are specified, unsuccessful injections are ignored.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-insertCSS-injection" class="dcc-code-sections__label">

  injection

  </div>

  <div class="dcc-type--xsmall">

  [CSSInjection](#type-CSSInjection)

  </div>

  </div>

  The details of the styles to insert.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 90+ </span>

  </div>

  </div>

  Returns a Promise which resolves upon completion of the insertion.

</div>

<div>

<div class="notranslate">

### registerContentScripts()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.scripting.registerContentScripts(
  scripts: RegisteredContentScript[],
): Promise<void>
```

Registers one or more content scripts for this extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-registerContentScripts-scripts" class="dcc-code-sections__label">

  scripts

  </div>

  <div class="dcc-type--xsmall">

  [RegisteredContentScript](#type-RegisteredContentScript)\[\]

  </div>

  </div>

  Contains a list of scripts to be registered. If there are errors during script parsing/file validation, or if the IDs specified already exist, then no scripts are registered.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Returns a Promise which resolves once scripts have been fully registered or rejects if an error has occurred.

</div>

<div>

<div class="notranslate">

### removeCSS()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 90+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.scripting.removeCSS(
  injection: CSSInjection,
): Promise<void>
```

Removes a CSS stylesheet that was previously inserted by this extension from a target context.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-removeCSS-injection" class="dcc-code-sections__label">

  injection

  </div>

  <div class="dcc-type--xsmall">

  [CSSInjection](#type-CSSInjection)

  </div>

  </div>

  The details of the styles to remove. Note that the `css`, `files`, and `origin` properties must exactly match the stylesheet inserted through [`insertCSS`](#method-insertCSS). Attempting to remove a non-existent stylesheet is a no-op.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Returns a Promise which resolves upon the completion of the removal.

</div>

<div>

<div class="notranslate">

### unregisterContentScripts()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.scripting.unregisterContentScripts(
  filter?: ContentScriptFilter,
): Promise<void>
```

Unregisters content scripts for this extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-unregisterContentScripts-filter" class="dcc-code-sections__label">

  filter

  </div>

  <div class="dcc-type--xsmall">

  [ContentScriptFilter](#type-ContentScriptFilter) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified, only unregisters dynamic content scripts which match the filter. Otherwise, all of the extension's dynamic content scripts are unregistered.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Returns a Promise which resolves once scripts have been unregistered or rejects if an error has occurred.

</div>

<div>

<div class="notranslate">

### updateContentScripts()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.scripting.updateContentScripts(
  scripts: RegisteredContentScript[],
): Promise<void>
```

Updates one or more content scripts for this extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-updateContentScripts-scripts" class="dcc-code-sections__label">

  scripts

  </div>

  <div class="dcc-type--xsmall">

  [RegisteredContentScript](#type-RegisteredContentScript)\[\]

  </div>

  </div>

  Contains a list of scripts to be updated. A property is only updated for the existing script if it is specified in this object. If there are errors during script parsing/file validation, or if the IDs specified do not correspond to a fully registered script, then no scripts are updated.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Returns a Promise which resolves once scripts have been updated or rejects if an error has occurred.

</div>

</div>

</div>

</div>

<div class="devsite-floating-action-buttons">

</div>

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-01-07 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-01-07 UTC."\],\[\],\[\]\]

</div>

</div>