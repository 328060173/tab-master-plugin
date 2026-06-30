> 来源: https://developer.chrome.com/docs/extensions/reference/api/downloads
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

# chrome.downloads <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.downloads` API to programmatically initiate, monitor, manipulate, and search for downloads.

</div>

## Permissions

<div class="dcc-reference">

`downloads`\

</div>

You must declare the `"downloads"` permission in the [extension manifest](/docs/extensions/reference/manifest) to use this API.

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "permissions": [
    "downloads"
  ],
}
```

## Examples

You can find simple examples of using the `chrome.downloads` API in the [examples/api/downloads](https://github.com/GoogleChrome/chrome-extensions-samples/tree/master/_archive/mv2/api/downloads/) directory. For other examples and for help in viewing the source code, see [Samples](/docs/extensions/mv2/samples).

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### BooleanDelta

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-BooleanDelta-current" class="dcc-code-sections__label">

  current

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-BooleanDelta-previous" class="dcc-code-sections__label">

  previous

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### DangerType

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"file"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The download's filename is suspicious.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"url"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The download's URL is known to be malicious.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"content"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The downloaded file is known to be malicious.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"uncommon"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The download's URL is not commonly downloaded and could be dangerous.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"host"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The download came from a host known to distribute malicious binaries and is likely dangerous.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"unwanted"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The download is potentially unwanted or unsafe. E.g. it could make changes to browser or computer settings.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"safe"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The download presents no known danger to the user's computer.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"accepted"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The user has accepted the dangerous download.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allowlistedByPolicy"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Enterprise-related values.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"asyncScanning"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"asyncLocalPasswordScanning"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"passwordProtected"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"blockedTooLarge"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"sensitiveContentWarning"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"sensitiveContentBlock"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"deepScannedFailed"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"deepScannedSafe"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"deepScannedOpenedDangerous"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"promptForScanning"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"promptForLocalPasswordScanning"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"accountCompromise"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"blockedScanFailed"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"forceSaveToGdrive"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">For use by the Secure Enterprise Browser extension. When required, Chrome will block the download to disc and download the file directly to Google Drive.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"forceSaveToOnedrive"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">For use by the Secure Enterprise Browser extension. When required, Chrome will block the download to disc and download the file directly to OneDrive.</span>

</div>

</div>

<div>

<div class="notranslate">

### DoubleDelta

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-DoubleDelta-current" class="dcc-code-sections__label">

  current

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-DoubleDelta-previous" class="dcc-code-sections__label">

  previous

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### DownloadDelta

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-DownloadDelta-canResume" class="dcc-code-sections__label">

  canResume

  </div>

  <div class="dcc-type--xsmall">

  [BooleanDelta](#type-BooleanDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `canResume`, if any.

- <div>

  <div id="property-DownloadDelta-danger" class="dcc-code-sections__label">

  danger

  </div>

  <div class="dcc-type--xsmall">

  [StringDelta](#type-StringDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `danger`, if any.

- <div>

  <div id="property-DownloadDelta-endTime" class="dcc-code-sections__label">

  endTime

  </div>

  <div class="dcc-type--xsmall">

  [StringDelta](#type-StringDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `endTime`, if any.

- <div>

  <div id="property-DownloadDelta-error" class="dcc-code-sections__label">

  error

  </div>

  <div class="dcc-type--xsmall">

  [StringDelta](#type-StringDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `error`, if any.

- <div>

  <div id="property-DownloadDelta-exists" class="dcc-code-sections__label">

  exists

  </div>

  <div class="dcc-type--xsmall">

  [BooleanDelta](#type-BooleanDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `exists`, if any.

- <div>

  <div id="property-DownloadDelta-fileSize" class="dcc-code-sections__label">

  fileSize

  </div>

  <div class="dcc-type--xsmall">

  [DoubleDelta](#type-DoubleDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `fileSize`, if any.

- <div>

  <div id="property-DownloadDelta-filename" class="dcc-code-sections__label">

  filename

  </div>

  <div class="dcc-type--xsmall">

  [StringDelta](#type-StringDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `filename`, if any.

- <div>

  <div id="property-DownloadDelta-finalUrl" class="dcc-code-sections__label">

  finalUrl

  </div>

  <div class="dcc-type--xsmall">

  [StringDelta](#type-StringDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

  </div>

  </div>

  The change in `finalUrl`, if any.

- <div>

  <div id="property-DownloadDelta-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The `id` of the [`DownloadItem`](#type-DownloadItem) that changed.

- <div>

  <div id="property-DownloadDelta-mime" class="dcc-code-sections__label">

  mime

  </div>

  <div class="dcc-type--xsmall">

  [StringDelta](#type-StringDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `mime`, if any.

- <div>

  <div id="property-DownloadDelta-paused" class="dcc-code-sections__label">

  paused

  </div>

  <div class="dcc-type--xsmall">

  [BooleanDelta](#type-BooleanDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `paused`, if any.

- <div>

  <div id="property-DownloadDelta-startTime" class="dcc-code-sections__label">

  startTime

  </div>

  <div class="dcc-type--xsmall">

  [StringDelta](#type-StringDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `startTime`, if any.

- <div>

  <div id="property-DownloadDelta-state" class="dcc-code-sections__label">

  state

  </div>

  <div class="dcc-type--xsmall">

  [StringDelta](#type-StringDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `state`, if any.

- <div>

  <div id="property-DownloadDelta-totalBytes" class="dcc-code-sections__label">

  totalBytes

  </div>

  <div class="dcc-type--xsmall">

  [DoubleDelta](#type-DoubleDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `totalBytes`, if any.

- <div>

  <div id="property-DownloadDelta-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  [StringDelta](#type-StringDelta) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The change in `url`, if any.

</div>

<div>

<div class="notranslate">

### DownloadItem

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-DownloadItem-byExtensionId" class="dcc-code-sections__label">

  byExtensionId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The identifier for the extension that initiated this download if this download was initiated by an extension. Does not change once it is set.

- <div>

  <div id="property-DownloadItem-byExtensionName" class="dcc-code-sections__label">

  byExtensionName

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The localized name of the extension that initiated this download if this download was initiated by an extension. May change if the extension changes its name or if the user changes their locale.

- <div>

  <div id="property-DownloadItem-bytesReceived" class="dcc-code-sections__label">

  bytesReceived

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  Number of bytes received so far from the host, without considering file compression.

- <div>

  <div id="property-DownloadItem-canResume" class="dcc-code-sections__label">

  canResume

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if the download is in progress and paused, or else if it is interrupted and can be resumed starting from where it was interrupted.

- <div>

  <div id="property-DownloadItem-danger" class="dcc-code-sections__label">

  danger

  </div>

  <div class="dcc-type--xsmall">

  [DangerType](#type-DangerType)

  </div>

  </div>

  Indication of whether this download is thought to be safe or known to be suspicious.

- <div>

  <div id="property-DownloadItem-endTime" class="dcc-code-sections__label">

  endTime

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The time when the download ended in ISO 8601 format. May be passed directly to the Date constructor: `chrome.downloads.search({}, function(items){items.forEach(function(item){if (item.endTime) console.log(new Date(item.endTime))})})`

- <div>

  <div id="property-DownloadItem-error" class="dcc-code-sections__label">

  error

  </div>

  <div class="dcc-type--xsmall">

  [InterruptReason](#type-InterruptReason) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Why the download was interrupted. Several kinds of HTTP errors may be grouped under one of the errors beginning with `SERVER_`. Errors relating to the network begin with `NETWORK_`, errors relating to the process of writing the file to the file system begin with `FILE_`, and interruptions initiated by the user begin with `USER_`.

- <div>

  <div id="property-DownloadItem-estimatedEndTime" class="dcc-code-sections__label">

  estimatedEndTime

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Estimated time when the download will complete in ISO 8601 format. May be passed directly to the Date constructor: `chrome.downloads.search({}, function(items){items.forEach(function(item){if (item.estimatedEndTime) console.log(new Date(item.estimatedEndTime))})})`

- <div>

  <div id="property-DownloadItem-exists" class="dcc-code-sections__label">

  exists

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the downloaded file still exists. This information may be out of date because Chrome does not automatically watch for file removal. Call [`search`](#method-search)() in order to trigger the check for file existence. When the existence check completes, if the file has been deleted, then an [`onChanged`](#event-onChanged) event will fire. Note that [`search`](#method-search)() does not wait for the existence check to finish before returning, so results from [`search`](#method-search)() may not accurately reflect the file system. Also, [`search`](#method-search)() may be called as often as necessary, but will not check for file existence any more frequently than once every 10 seconds.

- <div>

  <div id="property-DownloadItem-fileSize" class="dcc-code-sections__label">

  fileSize

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  Number of bytes in the whole file post-decompression, or -1 if unknown.

- <div>

  <div id="property-DownloadItem-filename" class="dcc-code-sections__label">

  filename

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Absolute local path.

- <div>

  <div id="property-DownloadItem-finalUrl" class="dcc-code-sections__label">

  finalUrl

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

  </div>

  </div>

  The absolute URL that this download is being made from, after all redirects.

- <div>

  <div id="property-DownloadItem-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  An identifier that is persistent across browser sessions.

- <div>

  <div id="property-DownloadItem-incognito" class="dcc-code-sections__label">

  incognito

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  False if this download is recorded in the history, true if it is not recorded.

- <div>

  <div id="property-DownloadItem-mime" class="dcc-code-sections__label">

  mime

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The file's MIME type.

- <div>

  <div id="property-DownloadItem-paused" class="dcc-code-sections__label">

  paused

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if the download has stopped reading data from the host, but kept the connection open.

- <div>

  <div id="property-DownloadItem-referrer" class="dcc-code-sections__label">

  referrer

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Absolute URL.

- <div>

  <div id="property-DownloadItem-startTime" class="dcc-code-sections__label">

  startTime

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The time when the download began in ISO 8601 format. May be passed directly to the Date constructor: `chrome.downloads.search({}, function(items){items.forEach(function(item){console.log(new Date(item.startTime))})})`

- <div>

  <div id="property-DownloadItem-state" class="dcc-code-sections__label">

  state

  </div>

  <div class="dcc-type--xsmall">

  [State](#type-State)

  </div>

  </div>

  Indicates whether the download is progressing, interrupted, or complete.

- <div>

  <div id="property-DownloadItem-totalBytes" class="dcc-code-sections__label">

  totalBytes

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  Number of bytes in the whole file, without considering file compression, or -1 if unknown.

- <div>

  <div id="property-DownloadItem-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The absolute URL that this download initiated from, before any redirects.

</div>

<div>

<div class="notranslate">

### DownloadOptions

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-DownloadOptions-body" class="dcc-code-sections__label">

  body

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Post body.

- <div>

  <div id="property-DownloadOptions-conflictAction" class="dcc-code-sections__label">

  conflictAction

  </div>

  <div class="dcc-type--xsmall">

  [FilenameConflictAction](#type-FilenameConflictAction) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The action to take if `filename` already exists.

- <div>

  <div id="property-DownloadOptions-filename" class="dcc-code-sections__label">

  filename

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  A file path relative to the Downloads directory to contain the downloaded file, possibly containing subdirectories. Absolute paths, empty paths, and paths containing back-references ".." will cause an error. [`onDeterminingFilename`](#event-onDeterminingFilename) allows suggesting a filename after the file's MIME type and a tentative filename have been determined.

- <div>

  <div id="property-DownloadOptions-headers" class="dcc-code-sections__label">

  headers

  </div>

  <div class="dcc-type--xsmall">

  [HeaderNameValuePair](#type-HeaderNameValuePair)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Extra HTTP headers to send with the request if the URL uses the HTTP\[s\] protocol. Each header is represented as a dictionary containing the keys `name` and either `value` or `binaryValue`, restricted to those allowed by XMLHttpRequest.

- <div>

  <div id="property-DownloadOptions-method" class="dcc-code-sections__label">

  method

  </div>

  <div class="dcc-type--xsmall">

  [HttpMethod](#type-HttpMethod) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The HTTP method to use if the URL uses the HTTP\[S\] protocol.

- <div>

  <div id="property-DownloadOptions-saveAs" class="dcc-code-sections__label">

  saveAs

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Use a file-chooser to allow the user to select a filename regardless of whether `filename` is set or already exists.

- <div>

  <div id="property-DownloadOptions-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The URL to download.

</div>

<div>

<div class="notranslate">

### DownloadQuery

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-DownloadQuery-bytesReceived" class="dcc-code-sections__label">

  bytesReceived

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Number of bytes received so far from the host, without considering file compression.

- <div>

  <div id="property-DownloadQuery-danger" class="dcc-code-sections__label">

  danger

  </div>

  <div class="dcc-type--xsmall">

  [DangerType](#type-DangerType) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Indication of whether this download is thought to be safe or known to be suspicious.

- <div>

  <div id="property-DownloadQuery-endTime" class="dcc-code-sections__label">

  endTime

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The time when the download ended in ISO 8601 format.

- <div>

  <div id="property-DownloadQuery-endedAfter" class="dcc-code-sections__label">

  endedAfter

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Limits results to [`DownloadItem`](#type-DownloadItem) that ended after the given ms in ISO 8601 format

- <div>

  <div id="property-DownloadQuery-endedBefore" class="dcc-code-sections__label">

  endedBefore

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Limits results to [`DownloadItem`](#type-DownloadItem) that ended before the given ms in ISO 8601 format.

- <div>

  <div id="property-DownloadQuery-error" class="dcc-code-sections__label">

  error

  </div>

  <div class="dcc-type--xsmall">

  [InterruptReason](#type-InterruptReason) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Why a download was interrupted.

- <div>

  <div id="property-DownloadQuery-exists" class="dcc-code-sections__label">

  exists

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether the downloaded file exists;

- <div>

  <div id="property-DownloadQuery-fileSize" class="dcc-code-sections__label">

  fileSize

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Number of bytes in the whole file post-decompression, or -1 if unknown.

- <div>

  <div id="property-DownloadQuery-filename" class="dcc-code-sections__label">

  filename

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Absolute local path.

- <div>

  <div id="property-DownloadQuery-filenameRegex" class="dcc-code-sections__label">

  filenameRegex

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Limits results to [`DownloadItem`](#type-DownloadItem) whose `filename` matches the given regular expression.

- <div>

  <div id="property-DownloadQuery-finalUrl" class="dcc-code-sections__label">

  finalUrl

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

  </div>

  </div>

  The absolute URL that this download is being made from, after all redirects.

- <div>

  <div id="property-DownloadQuery-finalUrlRegex" class="dcc-code-sections__label">

  finalUrlRegex

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

  </div>

  </div>

  Limits results to [`DownloadItem`](#type-DownloadItem) whose `finalUrl` matches the given regular expression.

- <div>

  <div id="property-DownloadQuery-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The `id` of the [`DownloadItem`](#type-DownloadItem) to query.

- <div>

  <div id="property-DownloadQuery-limit" class="dcc-code-sections__label">

  limit

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The maximum number of matching [`DownloadItem`](#type-DownloadItem) returned. Defaults to 1000. Set to 0 in order to return all matching [`DownloadItem`](#type-DownloadItem). See [`search`](#method-search) for how to page through results.

- <div>

  <div id="property-DownloadQuery-mime" class="dcc-code-sections__label">

  mime

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The file's MIME type.

- <div>

  <div id="property-DownloadQuery-orderBy" class="dcc-code-sections__label">

  orderBy

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Set elements of this array to [`DownloadItem`](#type-DownloadItem) properties in order to sort search results. For example, setting `orderBy=['startTime']` sorts the [`DownloadItem`](#type-DownloadItem) by their start time in ascending order. To specify descending order, prefix with a hyphen: '-startTime'.

- <div>

  <div id="property-DownloadQuery-paused" class="dcc-code-sections__label">

  paused

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  True if the download has stopped reading data from the host, but kept the connection open.

- <div>

  <div id="property-DownloadQuery-query" class="dcc-code-sections__label">

  query

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  This array of search terms limits results to [`DownloadItem`](#type-DownloadItem) whose `filename` or `url` or `finalUrl` contain all of the search terms that do not begin with a dash '-' and none of the search terms that do begin with a dash.

- <div>

  <div id="property-DownloadQuery-startTime" class="dcc-code-sections__label">

  startTime

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The time when the download began in ISO 8601 format.

- <div>

  <div id="property-DownloadQuery-startedAfter" class="dcc-code-sections__label">

  startedAfter

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Limits results to [`DownloadItem`](#type-DownloadItem) that started after the given ms in ISO 8601 format.

- <div>

  <div id="property-DownloadQuery-startedBefore" class="dcc-code-sections__label">

  startedBefore

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Limits results to [`DownloadItem`](#type-DownloadItem) that started before the given ms in ISO 8601 format.

- <div>

  <div id="property-DownloadQuery-state" class="dcc-code-sections__label">

  state

  </div>

  <div class="dcc-type--xsmall">

  [State](#type-State) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Indicates whether the download is progressing, interrupted, or complete.

- <div>

  <div id="property-DownloadQuery-totalBytes" class="dcc-code-sections__label">

  totalBytes

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Number of bytes in the whole file, without considering file compression, or -1 if unknown.

- <div>

  <div id="property-DownloadQuery-totalBytesGreater" class="dcc-code-sections__label">

  totalBytesGreater

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Limits results to [`DownloadItem`](#type-DownloadItem) whose `totalBytes` is greater than the given integer.

- <div>

  <div id="property-DownloadQuery-totalBytesLess" class="dcc-code-sections__label">

  totalBytesLess

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Limits results to [`DownloadItem`](#type-DownloadItem) whose `totalBytes` is less than the given integer.

- <div>

  <div id="property-DownloadQuery-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The absolute URL that this download initiated from, before any redirects.

- <div>

  <div id="property-DownloadQuery-urlRegex" class="dcc-code-sections__label">

  urlRegex

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Limits results to [`DownloadItem`](#type-DownloadItem) whose `url` matches the given regular expression.

</div>

<div>

<div class="notranslate">

### FilenameConflictAction

</div>

uniquify

To avoid duplication, the `filename` is changed to include a counter before the filename extension.

overwrite

The existing file will be overwritten with the new file.

prompt

The user will be prompted with a file chooser dialog.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"uniquify"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"overwrite"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"prompt"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### FilenameSuggestion

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-FilenameSuggestion-conflictAction" class="dcc-code-sections__label">

  conflictAction

  </div>

  <div class="dcc-type--xsmall">

  [FilenameConflictAction](#type-FilenameConflictAction) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The action to take if `filename` already exists.

- <div>

  <div id="property-FilenameSuggestion-filename" class="dcc-code-sections__label">

  filename

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The [`DownloadItem`](#type-DownloadItem)'s new target [`DownloadItem.filename`](#property-DownloadItem-filename), as a path relative to the user's default Downloads directory, possibly containing subdirectories. Absolute paths, empty paths, and paths containing back-references ".." will be ignored. `filename` is ignored if there are any [`onDeterminingFilename`](#event-onDeterminingFilename) listeners registered by any extensions.

</div>

<div>

<div class="notranslate">

### GetFileIconOptions

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-GetFileIconOptions-size" class="dcc-code-sections__label">

  size

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The size of the returned icon. The icon will be square with dimensions size \* size pixels. The default and largest size for the icon is 32x32 pixels. The only supported sizes are 16 and 32. It is an error to specify any other size.

</div>

<div>

<div class="notranslate">

### HeaderNameValuePair

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-HeaderNameValuePair-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Name of the HTTP header.

- <div>

  <div id="property-HeaderNameValuePair-value" class="dcc-code-sections__label">

  value

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Value of the HTTP header.

</div>

<div>

<div class="notranslate">

### HttpMethod

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"GET"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"POST"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### InterruptReason

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_FAILED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_ACCESS_DENIED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_NO_SPACE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_NAME_TOO_LONG"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_TOO_LARGE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_VIRUS_INFECTED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_TRANSIENT_ERROR"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_BLOCKED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_SECURITY_CHECK_FAILED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_TOO_SHORT"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_HASH_MISMATCH"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FILE_SAME_AS_SOURCE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"NETWORK_FAILED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"NETWORK_TIMEOUT"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"NETWORK_DISCONNECTED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"NETWORK_SERVER_DOWN"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"NETWORK_INVALID_REQUEST"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SERVER_FAILED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SERVER_NO_RANGE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SERVER_BAD_CONTENT"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SERVER_UNAUTHORIZED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SERVER_CERT_PROBLEM"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SERVER_FORBIDDEN"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SERVER_UNREACHABLE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SERVER_CONTENT_LENGTH_MISMATCH"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SERVER_CROSS_ORIGIN_REDIRECT"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"USER_CANCELED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"USER_SHUTDOWN"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"CRASH"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### State

</div>

in_progress

The download is currently receiving data from the server.

interrupted

An error broke the connection with the file host.

complete

The download completed successfully.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"in_progress"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"interrupted"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"complete"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### StringDelta

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-StringDelta-current" class="dcc-code-sections__label">

  current

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-StringDelta-previous" class="dcc-code-sections__label">

  previous

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### UiOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 105+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-UiOptions-enabled" class="dcc-code-sections__label">

  enabled

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Enable or disable the download UI.

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### acceptDanger()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.acceptDanger(
  downloadId: number,
): Promise<void>
```

Prompt the user to accept a dangerous download. Can only be called from a visible context (tab, window, or page/browser action popup). Does not automatically accept dangerous downloads. If the download is accepted, then an [`onChanged`](#event-onChanged) event will fire, otherwise nothing will happen. When all the data is fetched into a temporary file and either the download is not dangerous or the danger has been accepted, then the temporary file is renamed to the target filename, the `state` changes to 'complete', and [`onChanged`](#event-onChanged) fires.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-acceptDanger-downloadId" class="dcc-code-sections__label">

  downloadId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The identifier for the [`DownloadItem`](#type-DownloadItem).

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

  </div>

  </div>

  Returns a Promise which resolves when the danger prompt dialog closes.

</div>

<div>

<div class="notranslate">

### cancel()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.cancel(
  downloadId: number,
): Promise<void>
```

Cancel a download. When `callback` is run, the download is cancelled, completed, interrupted or doesn't exist anymore.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-cancel-downloadId" class="dcc-code-sections__label">

  downloadId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The id of the download to cancel.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

  </div>

  </div>

  Returns a Promise which resolves when the cancel request is completed.

</div>

<div>

<div class="notranslate">

### download()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.download(
  options: DownloadOptions,
): Promise<number>
```

Download a URL. If the URL uses the HTTP\[S\] protocol, then the request will include all cookies currently set for its hostname. If both `filename` and `saveAs` are specified, then the Save As dialog will be displayed, pre-populated with the specified `filename`. If the download started successfully, `callback` will be called with the new [`DownloadItem`](#type-DownloadItem)'s `downloadId`. If there was an error starting the download, then `callback` will be called with `downloadId=undefined` and [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError) will contain a descriptive string. The error strings are not guaranteed to remain backwards compatible between releases. Extensions must not parse it.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-download-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [DownloadOptions](#type-DownloadOptions)

  </div>

  </div>

  What to download and how.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

  </div>

  </div>

  Returns a Promise which resolves with the id of the new [`DownloadItem`](#type-DownloadItem).

</div>

<div>

<div class="notranslate">

### erase()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.erase(
  query: DownloadQuery,
): Promise<number[]>
```

Erase matching [`DownloadItem`](#type-DownloadItem) from history without deleting the downloaded file. An [`onErased`](#event-onErased) event will fire for each [`DownloadItem`](#type-DownloadItem) that matches `query`, then `callback` will be called.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-erase-query" class="dcc-code-sections__label">

  query

  </div>

  <div class="dcc-type--xsmall">

  [DownloadQuery](#type-DownloadQuery)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<number\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getFileIcon()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.getFileIcon(
  downloadId: number,
  options?: GetFileIconOptions,
): Promise<string | undefined>
```

Retrieve an icon for the specified download. For new downloads, file icons are available after the [`onCreated`](#event-onCreated) event has been received. The image returned by this function while a download is in progress may be different from the image returned after the download is complete. Icon retrieval is done by querying the underlying operating system or toolkit depending on the platform. The icon that is returned will therefore depend on a number of factors including state of the download, platform, registered file types and visual theme. If a file icon cannot be determined, [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError) will contain an error message.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getFileIcon-downloadId" class="dcc-code-sections__label">

  downloadId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The identifier for the download.

- <div>

  <div id="type-getFileIcon-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [GetFileIconOptions](#type-GetFileIconOptions) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<string \| undefined\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

  </div>

  </div>

  Returns a Promise which resolves with a URL to an image that represents the download.

</div>

<div>

<div class="notranslate">

### open()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.open(
  downloadId: number,
): Promise<void>
```

Opens the downloaded file now if the [`DownloadItem`](#type-DownloadItem) is complete; otherwise returns an error through [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError). This method requires the `"downloads.open"` permission in addition to the `"downloads"` permission. An [`onChanged`](#event-onChanged) event fires when the item is opened for the first time. This method can only be called in response to a user gesture.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-open-downloadId" class="dcc-code-sections__label">

  downloadId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The identifier for the downloaded file.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 123+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### pause()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.pause(
  downloadId: number,
): Promise<void>
```

Pause the download. If the request was successful the download is in a paused state. Otherwise [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError) contains an error message. The request will fail if the download is not active.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-pause-downloadId" class="dcc-code-sections__label">

  downloadId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The id of the download to pause.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

  </div>

  </div>

  Returns a Promise which resolves when the pause request is completed.

</div>

<div>

<div class="notranslate">

### removeFile()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.removeFile(
  downloadId: number,
): Promise<void>
```

Remove the downloaded file if it exists and the [`DownloadItem`](#type-DownloadItem) is complete; otherwise return an error through [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-removeFile-downloadId" class="dcc-code-sections__label">

  downloadId

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### resume()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.resume(
  downloadId: number,
): Promise<void>
```

Resume a paused download. If the request was successful the download is in progress and unpaused. Otherwise [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError) contains an error message. The request will fail if the download is not active.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-resume-downloadId" class="dcc-code-sections__label">

  downloadId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The id of the download to resume.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

  </div>

  </div>

  Returns a Promise which resolves when the resume request is completed.

</div>

<div>

<div class="notranslate">

### search()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.search(
  query: DownloadQuery,
): Promise<DownloadItem[]>
```

Find [`DownloadItem`](#type-DownloadItem). Set `query` to the empty object to get all [`DownloadItem`](#type-DownloadItem). To get a specific [`DownloadItem`](#type-DownloadItem), set only the `id` field. To page through a large number of items, set `orderBy: ['-startTime']`, set `limit` to the number of items per page, and set `startedAfter` to the `startTime` of the last item from the last page.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-search-query" class="dcc-code-sections__label">

  query

  </div>

  <div class="dcc-type--xsmall">

  [DownloadQuery](#type-DownloadQuery)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[DownloadItem](#type-DownloadItem)\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### setShelfEnabled()

</div>

<div>

<div>

<span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 117</span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.setShelfEnabled(
  enabled: boolean,
): void
```

Use [`setUiOptions`](#method-setUiOptions) instead.

Enable or disable the gray shelf at the bottom of every window associated with the current browser profile. The shelf will be disabled as long as at least one extension has disabled it. Enabling the shelf while at least one other extension has disabled it will return an error through [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError). Requires the `"downloads.shelf"` permission in addition to the `"downloads"` permission.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setShelfEnabled-enabled" class="dcc-code-sections__label">

  enabled

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### setUiOptions()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 105+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.setUiOptions(
  options: UiOptions,
): Promise<void>
```

Change the download UI of every window associated with the current browser profile. As long as at least one extension has set [`UiOptions.enabled`](#property-UiOptions-enabled) to false, the download UI will be hidden. Setting [`UiOptions.enabled`](#property-UiOptions-enabled) to true while at least one other extension has disabled it will return an error through [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError). Requires the `"downloads.ui"` permission in addition to the `"downloads"` permission.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setUiOptions-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [UiOptions](#type-UiOptions)

  </div>

  </div>

  Encapsulate a change to the download UI.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Returns a Promise which resolves when the UI update is completed.

</div>

<div>

<div class="notranslate">

### show()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.show(
  downloadId: number,
): void
```

Show the downloaded file in its folder in a file manager.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-show-downloadId" class="dcc-code-sections__label">

  downloadId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The identifier for the downloaded file.

</div>

<div>

<div class="notranslate">

### showDefaultFolder()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.showDefaultFolder(): void
```

Show the default Downloads folder in a file manager.

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onChanged

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.onChanged.addListener(
  callback: function,
)
```

When any of a [`DownloadItem`](#type-DownloadItem)'s properties except `bytesReceived` and `estimatedEndTime` changes, this event fires with the `downloadId` and an object containing the properties that changed.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onChanged-callback" class="dcc-code-sections__label">

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
  (downloadDelta: DownloadDelta) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onChanged-callback-downloadDelta" class="dcc-code-sections__label">

    downloadDelta

    </div>

    <div class="dcc-type--xsmall">

    [DownloadDelta](#type-DownloadDelta)

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
chrome.downloads.onCreated.addListener(
  callback: function,
)
```

This event fires with the [`DownloadItem`](#type-DownloadItem) object when a download begins.

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
  (downloadItem: DownloadItem) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onCreated-callback-downloadItem" class="dcc-code-sections__label">

    downloadItem

    </div>

    <div class="dcc-type--xsmall">

    [DownloadItem](#type-DownloadItem)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onDeterminingFilename

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.onDeterminingFilename.addListener(
  callback: function,
)
```

During the filename determination process, extensions will be given the opportunity to override the target [`DownloadItem.filename`](#property-DownloadItem-filename). Each extension may not register more than one listener for this event. Each listener must call `suggest` exactly once, either synchronously or asynchronously. If the listener calls `suggest` asynchronously, then it must return `true`. If the listener neither calls `suggest` synchronously nor returns `true`, then `suggest` will be called automatically. The [`DownloadItem`](#type-DownloadItem) will not complete until all listeners have called `suggest`. Listeners may call `suggest` without any arguments in order to allow the download to use `downloadItem.filename` for its filename, or pass a `suggestion` object to `suggest` in order to override the target filename. If more than one extension overrides the filename, then the last extension installed whose listener passes a `suggestion` object to `suggest` wins. In order to avoid confusion regarding which extension will win, users should not install extensions that may conflict. If the download is initiated by [`download`](#method-download) and the target filename is known before the MIME type and tentative filename have been determined, pass `filename` to [`download`](#method-download) instead.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onDeterminingFilename-callback" class="dcc-code-sections__label">

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
  (downloadItem: DownloadItem, suggest: function) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onDeterminingFilename-callback-downloadItem" class="dcc-code-sections__label">

    downloadItem

    </div>

    <div class="dcc-type--xsmall">

    [DownloadItem](#type-DownloadItem)

    </div>

    </div>

  - <div>

    <div id="method-onDeterminingFilename-callback-suggest" class="dcc-code-sections__label">

    suggest

    </div>

    <div class="dcc-type--xsmall">

    function

    </div>

    </div>

    The `suggest` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

    <div>

    </div>

    ``` devsite-click-to-copy
    (suggestion?: FilenameSuggestion) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-onDeterminingFilename-callback-suggest-suggestion" class="dcc-code-sections__label">

      suggestion

      </div>

      <div class="dcc-type--xsmall">

      [FilenameSuggestion](#type-FilenameSuggestion) <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onErased

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.downloads.onErased.addListener(
  callback: function,
)
```

Fires with the `downloadId` when a download is erased from history.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onErased-callback" class="dcc-code-sections__label">

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
  (downloadId: number) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onErased-callback-downloadId" class="dcc-code-sections__label">

    downloadId

    </div>

    <div class="dcc-type--xsmall">

    number

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

Last updated 2026-01-15 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-01-15 UTC."\],\[\],\[\]\]

</div>

</div>