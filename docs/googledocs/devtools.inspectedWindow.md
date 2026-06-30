> 来源: https://developer.chrome.com/docs/extensions/reference/api/devtools/inspectedWindow
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

# chrome.devtools.inspectedWindow <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.devtools.inspectedWindow` API to interact with the inspected window: obtain the tab ID for the inspected page, evaluate the code in the context of the inspected window, reload the page, or obtain the list of resources within the page.

</div>

See [DevTools APIs summary](/docs/extensions/how-to/devtools/extend-devtools) for general introduction to using Developer Tools APIs.

The [`tabId`](#property-tabId) property provides the tab identifier that you can use with the [`chrome.tabs.*`](/docs/extensions/reference/api/tabs) API calls. However, please note that `chrome.tabs.*` API is not exposed to the Developer Tools extension pages due to security considerations—you will need to pass the tab ID to the background page and invoke the `chrome.tabs.*` API functions from there.

The `reload` method may be used to reload the inspected page. Additionally, the caller can specify an override for the user agent string, a script that will be injected early upon page load, or an option to force reload of cached resources.

Use the `getResources` call and the `onResourceContent` event to obtain the list of resources (documents, stylesheets, scripts, images etc) within the inspected page. The `getContent` and `setContent` methods of the `Resource` class along with the `onResourceContentCommitted` event may be used to support modification of the resource content, for example, by an external editor.

## Manifest

<div class="dcc-reference">

The following keys must be declared [in the manifest](/docs/extensions/mv3/manifest) to use this API.

`"devtools_page"`\

</div>

## Execute code in the inspected window

The `eval` method provides the ability for extensions to execute JavaScript code in the context of the inspected page. This method is powerful when used in the right context and dangerous when used inappropriately. Use the [`tabs.executeScript`](/docs/extensions/reference/api/tabs#method-executeScript) method unless you need the specific functionality that the `eval` method provides.

Here are the main differences between the `eval` and `tabs.executeScript` methods:

- The `eval` method does not use an isolated world for the code being evaluated, so the JavaScript state of the inspected window is accessible to the code. Use this method when access to the JavaScript state of the inspected page is required.
- The execution context of the code being evaluated includes the [Developer Tools console API](https://developers.google.com/web/tools/chrome-devtools/). For example, the code can use `inspect` and `$0`.
- The evaluated code may return a value that is passed to the extension callback. The returned value has to be a valid JSON object (it may contain only primitive JavaScript types and acyclic references to other JSON objects). *Please observe extra care while processing the data received from the inspected page—the execution context is essentially controlled by the inspected page; a malicious page may affect the data being returned to the extension.*

<div class="aside caution">

**Caution:** Due to the security considerations explained above, the [`scripting.executeScript`](/docs/extensions/reference/api/scripting#method-executeScript) method is the preferred way for an extension to access DOM data of the inspected page in cases where the access to JavaScript state of the inspected page is not required.

</div>

Note that a page can include multiple different JavaScript execution contexts. Each frame has its own context, plus an additional context for each extension that has content scripts running in that frame.

By default, the `eval` method executes in the context of the main frame of the inspected page.

The `eval` method takes an optional second argument that you can use to specify the context in which the code is evaluated. This *options* object can contain one or more of the following keys:

`frameURL`  
Use to specify a frame other than the inspected page's main frame.

`contextSecurityOrigin`  
Use to select a context within the specified frame according to its [web origin](https://www.ietf.org/rfc/rfc6454.txt).

`useContentScriptContext`  
If true, execute the script in the same context as the extensions's content scripts. (Equivalent to specifying the extension's own web origin as the context security origin.) This can be used to exchange data with the content script.

## Examples

The following code checks for the version of jQuery used by the inspected page:

<div>

</div>

``` devsite-click-to-copy
chrome.devtools.inspectedWindow.eval(
  "jQuery.fn.jquery",
  function(result, isException) {
    if (isException) {
      console.log("the page is not using jQuery");
    } else {
      console.log("The page is using jQuery v" + result);
    }
  }
);
```

To try this API, install the [devtools API examples](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/devtools) from the [chrome-extension-samples](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples) repository.

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### Resource

</div>

A resource within the inspected page, such as a document, a script, or an image.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Resource-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The URL of the resource.

- <div>

  <div id="method-Resource-getContent" class="dcc-code-sections__label">

  getContent

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Gets the content of the resource.

  The `getContent` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-Resource-getContent-callback" class="dcc-code-sections__label">

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
    (content: string, encoding: string) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-Resource-getContent-callback-content" class="dcc-code-sections__label">

      content

      </div>

      <div class="dcc-type--xsmall">

      string

      </div>

      </div>

      Content of the resource (potentially encoded).

    - <div>

      <div id="type-Resource-getContent-callback-encoding" class="dcc-code-sections__label">

      encoding

      </div>

      <div class="dcc-type--xsmall">

      string

      </div>

      </div>

      Empty if the content is not encoded, encoding name otherwise. Currently, only base64 is supported.

    </div>

  </div>

- <div>

  <div id="method-Resource-setContent" class="dcc-code-sections__label">

  setContent

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Sets the content of the resource.

  The `setContent` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (content: string, commit: boolean, callback?: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-Resource-setContent-content" class="dcc-code-sections__label">

    content

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    New content of the resource. Only resources with the text type are currently supported.

  - <div>

    <div id="type-Resource-setContent-commit" class="dcc-code-sections__label">

    commit

    </div>

    <div class="dcc-type--xsmall">

    boolean

    </div>

    </div>

    True if the user has finished editing the resource, and the new content of the resource should be persisted; false if this is a minor change sent in progress of the user editing the resource.

  - <div>

    <div id="method-Resource-setContent-callback" class="dcc-code-sections__label">

    callback

    </div>

    <div class="dcc-type--xsmall">

    function <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

    <div>

    </div>

    ``` devsite-click-to-copy
    (error?: object) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-Resource-setContent-callback-error" class="dcc-code-sections__label">

      error

      </div>

      <div class="dcc-type--xsmall">

      object <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      Set to undefined if the resource content was set successfully; describes error otherwise.

    </div>

  </div>

</div>

</div>

## Properties

<div>

<div>

<div class="notranslate">

### tabId

</div>

The ID of the tab being inspected. This ID may be used with chrome.tabs.\* API.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

number

</div>

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### eval()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.devtools.inspectedWindow.eval(
  expression: string,
  options?: object,
  callback?: function,
): void
```

Evaluates a JavaScript expression in the context of the main frame of the inspected page. The expression must evaluate to a JSON-compliant object, otherwise an exception is thrown. The eval function can report either a DevTools-side error or a JavaScript exception that occurs during evaluation. In either case, the `result` parameter of the callback is `undefined`. In the case of a DevTools-side error, the `isException` parameter is non-null and has `isError` set to true and `code` set to an error code. In the case of a JavaScript error, `isException` is set to true and `value` is set to the string value of thrown object.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-eval-expression" class="dcc-code-sections__label">

  expression

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  An expression to evaluate.

- <div>

  <div id="type-eval-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The options parameter can contain one or more options.

  <div class="dcc-code-sections">

  - <div>

    <div id="property-eval-options-frameURL" class="dcc-code-sections__label">

    frameURL

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    If specified, the expression is evaluated on the iframe whose URL matches the one specified. By default, the expression is evaluated in the top frame of the inspected page.

  - <div>

    <div id="property-eval-options-scriptExecutionContext" class="dcc-code-sections__label">

    scriptExecutionContext

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 107+ </span>

    </div>

    </div>

    Evaluate the expression in the context of a content script of an extension that matches the specified origin. If given, scriptExecutionContext overrides the 'true' setting on useContentScriptContext.

  - <div>

    <div id="property-eval-options-useContentScriptContext" class="dcc-code-sections__label">

    useContentScriptContext

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Evaluate the expression in the context of the content script of the calling extension, provided that the content script is already injected into the inspected page. If not, the expression is not evaluated and the callback is invoked with the exception parameter set to an object that has the `isError` field set to true and the `code` field set to `E_NOTFOUND`.

  </div>

- <div>

  <div id="method-eval-callback" class="dcc-code-sections__label">

  callback

  </div>

  <div class="dcc-type--xsmall">

  function <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The `callback` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (result: object, exceptionInfo: object) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-eval-callback-result" class="dcc-code-sections__label">

    result

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    The result of evaluation.

  - <div>

    <div id="type-eval-callback-exceptionInfo" class="dcc-code-sections__label">

    exceptionInfo

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    An object providing details if an exception occurred while evaluating the expression.

    <div class="dcc-code-sections">

    - <div>

      <div id="property-eval-callback-exceptionInfo-code" class="dcc-code-sections__label">

      code

      </div>

      <div class="dcc-type--xsmall">

      string

      </div>

      </div>

      Set if the error occurred on the DevTools side before the expression is evaluated.

    - <div>

      <div id="property-eval-callback-exceptionInfo-description" class="dcc-code-sections__label">

      description

      </div>

      <div class="dcc-type--xsmall">

      string

      </div>

      </div>

      Set if the error occurred on the DevTools side before the expression is evaluated.

    - <div>

      <div id="property-eval-callback-exceptionInfo-details" class="dcc-code-sections__label">

      details

      </div>

      <div class="dcc-type--xsmall">

      any\[\]

      </div>

      </div>

      Set if the error occurred on the DevTools side before the expression is evaluated, contains the array of the values that may be substituted into the description string to provide more information about the cause of the error.

    - <div>

      <div id="property-eval-callback-exceptionInfo-isError" class="dcc-code-sections__label">

      isError

      </div>

      <div class="dcc-type--xsmall">

      boolean

      </div>

      </div>

      Set if the error occurred on the DevTools side before the expression is evaluated.

    - <div>

      <div id="property-eval-callback-exceptionInfo-isException" class="dcc-code-sections__label">

      isException

      </div>

      <div class="dcc-type--xsmall">

      boolean

      </div>

      </div>

      Set if the evaluated code produces an unhandled exception.

    - <div>

      <div id="property-eval-callback-exceptionInfo-value" class="dcc-code-sections__label">

      value

      </div>

      <div class="dcc-type--xsmall">

      string

      </div>

      </div>

      Set if the evaluated code produces an unhandled exception.

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### getResources()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.devtools.inspectedWindow.getResources(
  callback: function,
): void
```

Retrieves the list of resources from the inspected page.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-getResources-callback" class="dcc-code-sections__label">

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
  (resources: Resource[]) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-getResources-callback-resources" class="dcc-code-sections__label">

    resources

    </div>

    <div class="dcc-type--xsmall">

    [Resource](#type-Resource)\[\]

    </div>

    </div>

    The resources within the page.

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
chrome.devtools.inspectedWindow.reload(
  reloadOptions?: object,
): void
```

Reloads the inspected page.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-reload-reloadOptions" class="dcc-code-sections__label">

  reloadOptions

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-reload-reloadOptions-ignoreCache" class="dcc-code-sections__label">

    ignoreCache

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    When true, the loader will bypass the cache for all inspected page resources loaded before the `load` event is fired. The effect is similar to pressing Ctrl+Shift+R in the inspected window or within the Developer Tools window.

  - <div>

    <div id="property-reload-reloadOptions-injectedScript" class="dcc-code-sections__label">

    injectedScript

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    If specified, the script will be injected into every frame of the inspected page immediately upon load, before any of the frame's scripts. The script will not be injected after subsequent reloads—for example, if the user presses Ctrl+R.

  - <div>

    <div id="property-reload-reloadOptions-userAgent" class="dcc-code-sections__label">

    userAgent

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    If specified, the string will override the value of the `User-Agent` HTTP header that's sent while loading the resources of the inspected page. The string will also override the value of the `navigator.userAgent` property that's returned to any scripts that are running within the inspected page.

  </div>

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onResourceAdded

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.devtools.inspectedWindow.onResourceAdded.addListener(
  callback: function,
)
```

Fired when a new resource is added to the inspected page.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onResourceAdded-callback" class="dcc-code-sections__label">

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
  (resource: Resource) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onResourceAdded-callback-resource" class="dcc-code-sections__label">

    resource

    </div>

    <div class="dcc-type--xsmall">

    [Resource](#type-Resource)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onResourceContentCommitted

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener(
  callback: function,
)
```

Fired when a new revision of the resource is committed (e.g. user saves an edited version of the resource in the Developer Tools).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onResourceContentCommitted-callback" class="dcc-code-sections__label">

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
  (resource: Resource, content: string) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onResourceContentCommitted-callback-resource" class="dcc-code-sections__label">

    resource

    </div>

    <div class="dcc-type--xsmall">

    [Resource](#type-Resource)

    </div>

    </div>

  - <div>

    <div id="type-onResourceContentCommitted-callback-content" class="dcc-code-sections__label">

    content

    </div>

    <div class="dcc-type--xsmall">

    string

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

Last updated 2026-05-05 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-05-05 UTC."\],\[\],\[\]\]

</div>

</div>