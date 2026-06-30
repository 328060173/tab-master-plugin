> 来源: https://developer.chrome.com/docs/extensions/reference/api/system/display
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

# chrome.system.display <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `system.display` API to query display metadata.

</div>

## Permissions

<div class="dcc-reference">

`system.display`\

</div>

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### ActiveState

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 117+ </span>

</div>

</div>

An enum to tell if the display is detected and used by the system. The display is considered 'inactive', if it is not detected by the system (maybe disconnected, or considered disconnected due to sleep mode, etc). This state is used to keep existing display when the all displays are disconnected, for example.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"active"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"inactive"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### Bounds

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Bounds-height" class="dcc-code-sections__label">

  height

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The height of the display in pixels.

- <div>

  <div id="property-Bounds-left" class="dcc-code-sections__label">

  left

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The x-coordinate of the upper-left corner.

- <div>

  <div id="property-Bounds-top" class="dcc-code-sections__label">

  top

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The y-coordinate of the upper-left corner.

- <div>

  <div id="property-Bounds-width" class="dcc-code-sections__label">

  width

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The width of the display in pixels.

</div>

<div>

<div class="notranslate">

### DisplayLayout

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 53+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-DisplayLayout-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The unique identifier of the display.

- <div>

  <div id="property-DisplayLayout-offset" class="dcc-code-sections__label">

  offset

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The offset of the display along the connected edge. 0 indicates that the topmost or leftmost corners are aligned.

- <div>

  <div id="property-DisplayLayout-parentId" class="dcc-code-sections__label">

  parentId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The unique identifier of the parent display. Empty if this is the root.

- <div>

  <div id="property-DisplayLayout-position" class="dcc-code-sections__label">

  position

  </div>

  <div class="dcc-type--xsmall">

  [LayoutPosition](#type-LayoutPosition)

  </div>

  </div>

  The layout position of this display relative to the parent. This will be ignored for the root.

</div>

<div>

<div class="notranslate">

### DisplayMode

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 52+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-DisplayMode-deviceScaleFactor" class="dcc-code-sections__label">

  deviceScaleFactor

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The display mode device scale factor.

- <div>

  <div id="property-DisplayMode-height" class="dcc-code-sections__label">

  height

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The display mode height in device independent (user visible) pixels.

- <div>

  <div id="property-DisplayMode-heightInNativePixels" class="dcc-code-sections__label">

  heightInNativePixels

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The display mode height in native pixels.

- <div>

  <div id="property-DisplayMode-isInterlaced" class="dcc-code-sections__label">

  isInterlaced

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 74+ </span>

  </div>

  </div>

  True if this mode is interlaced, false if not provided.

- <div>

  <div id="property-DisplayMode-isNative" class="dcc-code-sections__label">

  isNative

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if the mode is the display's native mode.

- <div>

  <div id="property-DisplayMode-isSelected" class="dcc-code-sections__label">

  isSelected

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if the display mode is currently selected.

- <div>

  <div id="property-DisplayMode-refreshRate" class="dcc-code-sections__label">

  refreshRate

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 67+ </span>

  </div>

  </div>

  The display mode refresh rate in hertz.

- <div>

  <div id="property-DisplayMode-uiScale" class="dcc-code-sections__label">

  uiScale

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 70</span>

  </div>

  </div>

  Use `displayZoomFactor`

  The display mode UI scale factor.

- <div>

  <div id="property-DisplayMode-width" class="dcc-code-sections__label">

  width

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The display mode width in device independent (user visible) pixels.

- <div>

  <div id="property-DisplayMode-widthInNativePixels" class="dcc-code-sections__label">

  widthInNativePixels

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The display mode width in native pixels.

</div>

<div>

<div class="notranslate">

### DisplayProperties

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-DisplayProperties-boundsOriginX" class="dcc-code-sections__label">

  boundsOriginX

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If set, updates the display's logical bounds origin along the x-axis. Applied together with [`boundsOriginY`](#property-DisplayProperties-boundsOriginY). Defaults to the current value if not set and [`boundsOriginY`](#property-DisplayProperties-boundsOriginY) is set. Note that when updating the display origin, some constraints will be applied, so the final bounds origin may be different than the one set. The final bounds can be retrieved using [`getInfo`](#method-getInfo). The bounds origin cannot be changed on the primary display.

- <div>

  <div id="property-DisplayProperties-boundsOriginY" class="dcc-code-sections__label">

  boundsOriginY

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If set, updates the display's logical bounds origin along the y-axis. See documentation for [`boundsOriginX`](#property-DisplayProperties-boundsOriginX) parameter.

- <div>

  <div id="property-DisplayProperties-displayMode" class="dcc-code-sections__label">

  displayMode

  </div>

  <div class="dcc-type--xsmall">

  [DisplayMode](#type-DisplayMode) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 52+ </span>

  </div>

  </div>

  If set, updates the display mode to the mode matching this value. If other parameters are invalid, this will not be applied. If the display mode is invalid, it will not be applied and an error will be set, but other properties will still be applied.

- <div>

  <div id="property-DisplayProperties-displayZoomFactor" class="dcc-code-sections__label">

  displayZoomFactor

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 65+ </span>

  </div>

  </div>

  If set, updates the zoom associated with the display. This zoom performs re-layout and repaint thus resulting in a better quality zoom than just performing a pixel by pixel stretch enlargement.

- <div>

  <div id="property-DisplayProperties-isPrimary" class="dcc-code-sections__label">

  isPrimary

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If set to true, makes the display primary. No-op if set to false. Note: If set, the display is considered primary for all other properties (i.e. [`isUnified`](#property-DisplayProperties-isUnified) may be set and bounds origin may not).

- <div>

  <div id="property-DisplayProperties-isUnified" class="dcc-code-sections__label">

  isUnified

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 59+ </span>

  </div>

  </div>

  ChromeOS only. If set to true, changes the display mode to unified desktop (see [`enableUnifiedDesktop`](#method-enableUnifiedDesktop) for details). If set to false, unified desktop mode will be disabled. This is only valid for the primary display. If provided, mirroringSourceId must not be provided and other properties will be ignored. This is has no effect if not provided.

- <div>

  <div id="property-DisplayProperties-mirroringSourceId" class="dcc-code-sections__label">

  mirroringSourceId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 68</span>

  </div>

  </div>

  Use [`setMirrorMode`](#method-setMirrorMode).

  ChromeOS only. If set and not empty, enables mirroring for this display only. Otherwise disables mirroring for all displays. This value should indicate the id of the source display to mirror, which must not be the same as the id passed to setDisplayProperties. If set, no other property may be set.

- <div>

  <div id="property-DisplayProperties-overscan" class="dcc-code-sections__label">

  overscan

  </div>

  <div class="dcc-type--xsmall">

  [Insets](#type-Insets) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If set, sets the display's overscan insets to the provided values. Note that overscan values may not be negative or larger than a half of the screen's size. Overscan cannot be changed on the internal monitor.

- <div>

  <div id="property-DisplayProperties-rotation" class="dcc-code-sections__label">

  rotation

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If set, updates the display's rotation. Legal values are \[0, 90, 180, 270\]. The rotation is set clockwise, relative to the display's vertical position.

</div>

<div>

<div class="notranslate">

### DisplayUnitInfo

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-DisplayUnitInfo-activeState" class="dcc-code-sections__label">

  activeState

  </div>

  <div class="dcc-type--xsmall">

  [ActiveState](#type-ActiveState)

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 117+ </span>

  </div>

  </div>

  Active if the display is detected and used by the system.

- <div>

  <div id="property-DisplayUnitInfo-availableDisplayZoomFactors" class="dcc-code-sections__label">

  availableDisplayZoomFactors

  </div>

  <div class="dcc-type--xsmall">

  number\[\]

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 67+ </span>

  </div>

  </div>

  A list of zoom factor values that can be set for the display.

- <div>

  <div id="property-DisplayUnitInfo-bounds" class="dcc-code-sections__label">

  bounds

  </div>

  <div class="dcc-type--xsmall">

  [Bounds](#type-Bounds)

  </div>

  </div>

  The display's logical bounds.

- <div>

  <div id="property-DisplayUnitInfo-displayZoomFactor" class="dcc-code-sections__label">

  displayZoomFactor

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 65+ </span>

  </div>

  </div>

  The ratio between the display's current and default zoom. For example, value 1 is equivalent to 100% zoom, and value 1.5 is equivalent to 150% zoom.

- <div>

  <div id="property-DisplayUnitInfo-dpiX" class="dcc-code-sections__label">

  dpiX

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The number of pixels per inch along the x-axis.

- <div>

  <div id="property-DisplayUnitInfo-dpiY" class="dcc-code-sections__label">

  dpiY

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The number of pixels per inch along the y-axis.

- <div>

  <div id="property-DisplayUnitInfo-edid" class="dcc-code-sections__label">

  edid

  </div>

  <div class="dcc-type--xsmall">

  [Edid](#type-Edid) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 67+ </span>

  </div>

  </div>

  NOTE: This is only available to ChromeOS Kiosk apps and Web UI.

- <div>

  <div id="property-DisplayUnitInfo-hasTouchSupport" class="dcc-code-sections__label">

  hasTouchSupport

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 57+ </span>

  </div>

  </div>

  True if this display has a touch input device associated with it.

- <div>

  <div id="property-DisplayUnitInfo-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The unique identifier of the display.

- <div>

  <div id="property-DisplayUnitInfo-isEnabled" class="dcc-code-sections__label">

  isEnabled

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if this display is enabled.

- <div>

  <div id="property-DisplayUnitInfo-isPrimary" class="dcc-code-sections__label">

  isPrimary

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if this is the primary display.

- <div>

  <div id="property-DisplayUnitInfo-isUnified" class="dcc-code-sections__label">

  isUnified

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 59+ </span>

  </div>

  </div>

  True for all displays when in unified desktop mode. See documentation for [`enableUnifiedDesktop`](#method-enableUnifiedDesktop).

- <div>

  <div id="property-DisplayUnitInfo-mirroringDestinationIds" class="dcc-code-sections__label">

  mirroringDestinationIds

  </div>

  <div class="dcc-type--xsmall">

  string\[\]

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 64+ </span>

  </div>

  </div>

  ChromeOS only. Identifiers of the displays to which the source display is being mirrored. Empty if no displays are being mirrored. This will be set to the same value for all displays. This must not include `mirroringSourceId`.

- <div>

  <div id="property-DisplayUnitInfo-mirroringSourceId" class="dcc-code-sections__label">

  mirroringSourceId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  ChromeOS only. Identifier of the display that is being mirrored if mirroring is enabled, otherwise empty. This will be set for all displays (including the display being mirrored).

- <div>

  <div id="property-DisplayUnitInfo-modes" class="dcc-code-sections__label">

  modes

  </div>

  <div class="dcc-type--xsmall">

  [DisplayMode](#type-DisplayMode)\[\]

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 52+ </span>

  </div>

  </div>

  The list of available display modes. The current mode will have isSelected=true. Only available on ChromeOS. Will be set to an empty array on other platforms.

- <div>

  <div id="property-DisplayUnitInfo-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The user-friendly name (e.g. "HP LCD monitor").

- <div>

  <div id="property-DisplayUnitInfo-overscan" class="dcc-code-sections__label">

  overscan

  </div>

  <div class="dcc-type--xsmall">

  [Insets](#type-Insets)

  </div>

  </div>

  The display's insets within its screen's bounds. Currently exposed only on ChromeOS. Will be set to empty insets on other platforms.

- <div>

  <div id="property-DisplayUnitInfo-rotation" class="dcc-code-sections__label">

  rotation

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The display's clockwise rotation in degrees relative to the vertical position. Currently exposed only on ChromeOS. Will be set to 0 on other platforms. A value of -1 will be interpreted as auto-rotate when the device is in a physical tablet state.

- <div>

  <div id="property-DisplayUnitInfo-workArea" class="dcc-code-sections__label">

  workArea

  </div>

  <div class="dcc-type--xsmall">

  [Bounds](#type-Bounds)

  </div>

  </div>

  The usable work area of the display within the display bounds. The work area excludes areas of the display reserved for OS, for example taskbar and launcher.

</div>

<div>

<div class="notranslate">

### Edid

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 67+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Edid-manufacturerId" class="dcc-code-sections__label">

  manufacturerId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  3 character manufacturer code. See Sec. 3.4.1 page 21. Required in v1.4.

- <div>

  <div id="property-Edid-productId" class="dcc-code-sections__label">

  productId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  2 byte manufacturer-assigned code, Sec. 3.4.2 page 21. Required in v1.4.

- <div>

  <div id="property-Edid-yearOfManufacture" class="dcc-code-sections__label">

  yearOfManufacture

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  Year of manufacturer, Sec. 3.4.4 page 22. Required in v1.4.

</div>

<div>

<div class="notranslate">

### GetInfoFlags

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 59+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-GetInfoFlags-singleUnified" class="dcc-code-sections__label">

  singleUnified

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If set to true, only a single [`DisplayUnitInfo`](#type-DisplayUnitInfo) will be returned by [`getInfo`](#method-getInfo) when in unified desktop mode (see [`enableUnifiedDesktop`](#method-enableUnifiedDesktop)). Defaults to false.

</div>

<div>

<div class="notranslate">

### Insets

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Insets-bottom" class="dcc-code-sections__label">

  bottom

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The y-axis distance from the bottom bound.

- <div>

  <div id="property-Insets-left" class="dcc-code-sections__label">

  left

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The x-axis distance from the left bound.

- <div>

  <div id="property-Insets-right" class="dcc-code-sections__label">

  right

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The x-axis distance from the right bound.

- <div>

  <div id="property-Insets-top" class="dcc-code-sections__label">

  top

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The y-axis distance from the top bound.

</div>

<div>

<div class="notranslate">

### LayoutPosition

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 53+ </span>

</div>

</div>

Layout position, i.e. edge of parent that the display is attached to.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"top"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"right"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"bottom"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"left"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MirrorMode

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 65+ </span>

</div>

</div>

Mirror mode, i.e. different ways of how a display is mirrored to other displays.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"off"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the default mode (extended or unified desktop).</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"normal"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies that the default source display will be mirrored to all other displays.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"mixed"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies that the specified source display will be mirrored to the provided destination displays. All other connected displays will be extended.</span>

</div>

</div>

<div>

<div class="notranslate">

### MirrorModeInfo

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 65+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-MirrorModeInfo-mirroringDestinationIds" class="dcc-code-sections__label">

  mirroringDestinationIds

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ids of the mirroring destination displays. This is only valid for 'mixed'.

- <div>

  <div id="property-MirrorModeInfo-mirroringSourceId" class="dcc-code-sections__label">

  mirroringSourceId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The id of the mirroring source display. This is only valid for 'mixed'.

- <div>

  <div id="property-MirrorModeInfo-mode" class="dcc-code-sections__label">

  mode

  </div>

  <div class="dcc-type--xsmall">

  [MirrorMode](#type-MirrorMode)

  </div>

  </div>

  The mirror mode that should be set.

</div>

<div>

<div class="notranslate">

### Point

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 57+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Point-x" class="dcc-code-sections__label">

  x

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The x-coordinate of the point.

- <div>

  <div id="property-Point-y" class="dcc-code-sections__label">

  y

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The y-coordinate of the point.

</div>

<div>

<div class="notranslate">

### TouchCalibrationPair

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 57+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-TouchCalibrationPair-displayPoint" class="dcc-code-sections__label">

  displayPoint

  </div>

  <div class="dcc-type--xsmall">

  [Point](#type-Point)

  </div>

  </div>

  The coordinates of the display point.

- <div>

  <div id="property-TouchCalibrationPair-touchPoint" class="dcc-code-sections__label">

  touchPoint

  </div>

  <div class="dcc-type--xsmall">

  [Point](#type-Point)

  </div>

  </div>

  The coordinates of the touch point corresponding to the display point.

</div>

<div>

<div class="notranslate">

### TouchCalibrationPairQuad

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 57+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-TouchCalibrationPairQuad-pair1" class="dcc-code-sections__label">

  pair1

  </div>

  <div class="dcc-type--xsmall">

  [TouchCalibrationPair](#type-TouchCalibrationPair)

  </div>

  </div>

  First pair of touch and display point required for touch calibration.

- <div>

  <div id="property-TouchCalibrationPairQuad-pair2" class="dcc-code-sections__label">

  pair2

  </div>

  <div class="dcc-type--xsmall">

  [TouchCalibrationPair](#type-TouchCalibrationPair)

  </div>

  </div>

  Second pair of touch and display point required for touch calibration.

- <div>

  <div id="property-TouchCalibrationPairQuad-pair3" class="dcc-code-sections__label">

  pair3

  </div>

  <div class="dcc-type--xsmall">

  [TouchCalibrationPair](#type-TouchCalibrationPair)

  </div>

  </div>

  Third pair of touch and display point required for touch calibration.

- <div>

  <div id="property-TouchCalibrationPairQuad-pair4" class="dcc-code-sections__label">

  pair4

  </div>

  <div class="dcc-type--xsmall">

  [TouchCalibrationPair](#type-TouchCalibrationPair)

  </div>

  </div>

  Fourth pair of touch and display point required for touch calibration.

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### clearTouchCalibration()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 57+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.clearTouchCalibration(
  id: string,
): void
```

Resets the touch calibration for the display and brings it back to its default state by clearing any touch calibration data associated with the display.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-clearTouchCalibration-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The display's unique identifier.

</div>

<div>

<div class="notranslate">

### completeCustomTouchCalibration()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 57+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.completeCustomTouchCalibration(
  pairs: TouchCalibrationPairQuad,
  bounds: Bounds,
): void
```

Sets the touch calibration pairs for a display. These `pairs` would be used to calibrate the touch screen for display with `id` called in startCustomTouchCalibration(). Always call `startCustomTouchCalibration` before calling this method. If another touch calibration is already in progress this will throw an error.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-completeCustomTouchCalibration-pairs" class="dcc-code-sections__label">

  pairs

  </div>

  <div class="dcc-type--xsmall">

  [TouchCalibrationPairQuad](#type-TouchCalibrationPairQuad)

  </div>

  </div>

  The pairs of point used to calibrate the display.

- <div>

  <div id="type-completeCustomTouchCalibration-bounds" class="dcc-code-sections__label">

  bounds

  </div>

  <div class="dcc-type--xsmall">

  [Bounds](#type-Bounds)

  </div>

  </div>

  Bounds of the display when the touch calibration was performed. `bounds.left` and `bounds.top` values are ignored.

</div>

<div>

<div class="notranslate">

### enableUnifiedDesktop()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 46+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.enableUnifiedDesktop(
  enabled: boolean,
): void
```

Enables/disables the unified desktop feature. If enabled while mirroring is active, the desktop mode will not change until mirroring is turned off. Otherwise, the desktop mode will switch to unified immediately. NOTE: This is only available to ChromeOS Kiosk apps and Web UI.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-enableUnifiedDesktop-enabled" class="dcc-code-sections__label">

  enabled

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if unified desktop should be enabled.

</div>

<div>

<div class="notranslate">

### getDisplayLayout()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 53+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.getDisplayLayout(): Promise<DisplayLayout[]>
```

Requests the layout info for all displays. NOTE: This is only available to ChromeOS Kiosk apps and Web UI.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[DisplayLayout](#type-DisplayLayout)\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves with the results.

</div>

<div>

<div class="notranslate">

### getInfo()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.getInfo(
  flags?: GetInfoFlags,
): Promise<DisplayUnitInfo[]>
```

Requests the information for all attached display devices.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getInfo-flags" class="dcc-code-sections__label">

  flags

  </div>

  <div class="dcc-type--xsmall">

  [GetInfoFlags](#type-GetInfoFlags) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 59+ </span>

  </div>

  </div>

  Options affecting how the information is returned.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[DisplayUnitInfo](#type-DisplayUnitInfo)\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves with the results.

</div>

<div>

<div class="notranslate">

### overscanCalibrationAdjust()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 53+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.overscanCalibrationAdjust(
  id: string,
  delta: Insets,
): void
```

Adjusts the current overscan insets for a display. Typically this should either move the display along an axis (e.g. left+right have the same value) or scale it along an axis (e.g. top+bottom have opposite values). Each Adjust call is cumulative with previous calls since Start.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-overscanCalibrationAdjust-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The display's unique identifier.

- <div>

  <div id="type-overscanCalibrationAdjust-delta" class="dcc-code-sections__label">

  delta

  </div>

  <div class="dcc-type--xsmall">

  [Insets](#type-Insets)

  </div>

  </div>

  The amount to change the overscan insets.

</div>

<div>

<div class="notranslate">

### overscanCalibrationComplete()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 53+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.overscanCalibrationComplete(
  id: string,
): void
```

Complete overscan adjustments for a display by saving the current values and hiding the overlay.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-overscanCalibrationComplete-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The display's unique identifier.

</div>

<div>

<div class="notranslate">

### overscanCalibrationReset()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 53+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.overscanCalibrationReset(
  id: string,
): void
```

Resets the overscan insets for a display to the last saved value (i.e before Start was called).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-overscanCalibrationReset-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The display's unique identifier.

</div>

<div>

<div class="notranslate">

### overscanCalibrationStart()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 53+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.overscanCalibrationStart(
  id: string,
): void
```

Starts overscan calibration for a display. This will show an overlay on the screen indicating the current overscan insets. If overscan calibration for display `id` is in progress this will reset calibration.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-overscanCalibrationStart-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The display's unique identifier.

</div>

<div>

<div class="notranslate">

### setDisplayLayout()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 53+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.setDisplayLayout(
  layouts: DisplayLayout[],
): Promise<void>
```

Set the layout for all displays. Any display not included will use the default layout. If a layout would overlap or be otherwise invalid it will be adjusted to a valid layout. After layout is resolved, an onDisplayChanged event will be triggered. NOTE: This is only available to ChromeOS Kiosk apps and Web UI.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setDisplayLayout-layouts" class="dcc-code-sections__label">

  layouts

  </div>

  <div class="dcc-type--xsmall">

  [DisplayLayout](#type-DisplayLayout)\[\]

  </div>

  </div>

  The layout information, required for all displays except the primary display.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves when the function finishes.

</div>

<div>

<div class="notranslate">

### setDisplayProperties()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.setDisplayProperties(
  id: string,
  info: DisplayProperties,
): Promise<void>
```

Updates the properties for the display specified by `id`, according to the information provided in `info`. On failure, [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/api/runtime/#property-lastError) will be set. NOTE: This is only available to ChromeOS Kiosk apps and Web UI.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setDisplayProperties-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The display's unique identifier.

- <div>

  <div id="type-setDisplayProperties-info" class="dcc-code-sections__label">

  info

  </div>

  <div class="dcc-type--xsmall">

  [DisplayProperties](#type-DisplayProperties)

  </div>

  </div>

  The information about display properties that should be changed. A property will be changed only if a new value for it is specified in `info`.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves when the function finishes.

</div>

<div>

<div class="notranslate">

### setMirrorMode()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 65+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.setMirrorMode(
  info: MirrorModeInfo,
): Promise<void>
```

Sets the display mode to the specified mirror mode. Each call resets the state from previous calls. Calling setDisplayProperties() will fail for the mirroring destination displays. NOTE: This is only available to ChromeOS Kiosk apps and Web UI.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setMirrorMode-info" class="dcc-code-sections__label">

  info

  </div>

  <div class="dcc-type--xsmall">

  [MirrorModeInfo](#type-MirrorModeInfo)

  </div>

  </div>

  The information of the mirror mode that should be applied to the display mode.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves when the function finishes.

</div>

<div>

<div class="notranslate">

### showNativeTouchCalibration()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 57+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.showNativeTouchCalibration(
  id: string,
): Promise<boolean>
```

Displays the native touch calibration UX for the display with `id` as display id. This will show an overlay on the screen with required instructions on how to proceed. The callback will be invoked in case of successful calibration only. If the calibration fails, this will throw an error.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-showNativeTouchCalibration-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The display's unique identifier.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<boolean\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves to inform the caller that the touch calibration has ended. The boolean value informs if the calibration was a success or not.

</div>

<div>

<div class="notranslate">

### startCustomTouchCalibration()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 57+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.startCustomTouchCalibration(
  id: string,
): void
```

Starts custom touch calibration for a display. This should be called when using a custom UX for collecting calibration data. If another touch calibration is already in progress this will throw an error.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-startCustomTouchCalibration-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The display's unique identifier.

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onDisplayChanged

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.system.display.onDisplayChanged.addListener(
  callback: function,
)
```

Fired when anything changes to the display configuration.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onDisplayChanged-callback" class="dcc-code-sections__label">

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
  () => void
  ```

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