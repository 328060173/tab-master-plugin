> 来源: https://developer.chrome.com/docs/extensions/reference/api/printing
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

# chrome.printing <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

<div class="aside note">

**Important:** This API works **only on ChromeOS**.

</div>

## Description

<div class="dcc-reference">

Use the `chrome.printing` API to send print jobs to printers installed on Chromebook.

</div>

## Permissions

<div class="dcc-reference">

`printing`\

</div>

## Availability

<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 81+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

All `chrome.printing` methods and events require you to declare the `"printing"` permission in the [extension manifest](/docs/extensions/mv3/manifest). For example:

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "permissions": [
    "printing"
  ],
  ...
}
```

## Examples

The examples below demonstrate using each of the methods in the printing namespace. This code is copied from or based on the [api-samples/printing](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/printing) in the extensions-samples Github repo.

### cancelJob()

This example uses the `onJobStatusChanged` handler to hide a 'cancel' button when the `jobStatus` is neither `PENDING` or `IN_PROGRESS`. Note that on some networks or when a Chromebook is connected directly to the printer, these states may pass too quickly for the cancel button to be visible long enough to be called. This is greatly simplified printing example.

<div>

</div>

``` devsite-click-to-copy
chrome.printing.onJobStatusChanged.addListener((jobId, status) => {
  const cancelButton = document.getElementById("cancelButton");
  cancelButton.addEventListener('click', () => {
    chrome.printing.cancelJob(jobId).then((response) => {
      if (response !== undefined) {
        console.log(response.status);
      }
      if (chrome.runtime.lastError !== undefined) {
        console.log(chrome.runtime.lastError.message);
      }
    });
  });
  if (status !== "PENDING" && status !== "IN_PROGRESS") {
    cancelButton.style.visibility = 'hidden';
  } else {
    cancelButton.style.visibility = 'visible';
  }
}
```

### getPrinters() and getPrinterInfo()

A single example is used for these functions because getting printer information requires a printer ID, which is retrieved by calling `getPrinters()`. This example logs the name and description of the default printer to the console. This is a simplified version of the printing example.

<div>

</div>

``` devsite-click-to-copy
​​const printers = await chrome.printing.getPrinters();
const defaultPrinter = printers.find((printer) => {
  const printerInfo = await chrome.printing.getPrinterInfo(printer.id);
  return printerInfo.isDefault;
}
console.log(`Default printer: ${defaultPrinter.name}.\n\t${defaultPrinter.description}`);
```

### submitJob()

The `submitJob()` method requires three things.

- A `ticket` structure specifying which capabilities of the printer are to be used. If the user needs to select from available capabilities, you can retrieve them for a specific printer using `getPrinterInfo()`.
- A `SubmitJobRequest` structure, which specifies the printer to use, and the file or data to print. This structure contains a reference to the `ticket` structure.
- A blob of the file or data to print.

Calling `submitJob()` triggers a dialog box asking the user to confirm printing. Use the [`PrintingAPIExtensionsAllowlist`](https://chromeenterprise.google/policies/#PrintingAPIExtensionsAllowlist%22) to bypass confirmation.

This is a simplified version of the printing example. Notice that the `ticket` is attached to the `SubmitJobRequest` structure (line 8) and that the data to print is converted to a blob (line 10). Getting the ID of the printer (line 1) is more complicated [in the sample](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/printing) than is shown here.

<div>

</div>

``` devsite-click-to-copy
const defaultPrinter = getDefaultPrinter();
const ticket = getPrinterTicket(defaultPrinter);
const arrayBuffer = getPrintData();
const submitJobRequest = {
  job: {
    printerId: defaultPrinter,
    title: 'test job',
    ticket: ticket,
    contentType: 'application/pdf',
    document: new Blob([new Uint8Array(arrayBuffer)], {
      type: 'application/pdf'
    });
  }
};

chrome.printing.submitJob(submitJobRequest, (response) => {
  if (response !== undefined) {
    console.log(response.status);
  }
  if (chrome.runtime.lastError !== undefined) {
    console.log(chrome.runtime.lastError.message);
  }
});
```

### Roll printing

This example shows how to build a printer ticket for continuous (or roll) printing, which is often used with receipt printing. The `submitJobRequest` object for roll printing is the same as that shown for the [`submitJob()`](#submitjob) example.

If you need to change the default value for paper cutting, use the `vendor_ticket_item` key. (The default varies from printer to printer.) To change the value, provide an array with one member: an object whose `id` is `'finishings'`. The value can either be `'trim'` for printers that cut the roll at the end of printing or `'none'` for printers that require the print job to be torn off.

<div>

</div>

``` devsite-click-to-copy
const ticket = {
  version: '1.0',
  print: {
    vendor_ticket_item: [{id: 'finishings', value: 'trim'}],
    color: {type: 'STANDARD_MONOCHROME'},
    duplex: {type: 'NO_DUPLEX'},
    page_orientation: {type: 'PORTRAIT'},
    copies: {copies: 1},
    dpi: {horizontal_dpi: 300, vertical_dpi: 300},
    media_size: {
      width_microns: 72320,
      height_microns: 100000
    },
    collate: {collate: false}
  }
};
```

Some printers do not support the `"finishings"` option. To determine if your printer does, call [`getPrinterInfo()`](#method-getPrinterInfo) and look for a `"display_name"` of `"finishings/11"`.

<div>

</div>

``` devsite-click-to-copy
"vendor_capability": [
  {
    "display_name": "finishings/11",
    "id": "finishings/11",
    "type": "TYPED_VALUE",
    "typed_value_cap": {
      "value_type": "BOOLEAN"
    }
  },
  ...
]
```

<div class="aside note">

**Note:** starting with Chrome 124, the `vendor_ticket_item` allows all items from the printer's `vendor_capabilities`. For example, any value return by [`getPrinterInfo()`](#method-getPrinterInfo) is valid. Before, only the `finishings` key was supported.

</div>

The values in a ticket's `media_size` key are specific to each printer. To select an appropriate size call [`getPrinterInfo()`](#method-getPrinterInfo). The returned [`GetPrinterResponse`](#type-GetPrinterInfoResponse) contains an array of supported media sizes at `"media_size"."option"`. Choose an option whose `"is_continuous_feed"` value is true. Use its height and width values for the ticket.

<div>

</div>

``` devsite-click-to-copy
"media_size": {
  "option": [
  {
    "custom_display_name": "",
    "is_continuous_feed": true,
    "max_height_microns": 2000000,
    "min_height_microns": 25400,
    "width_microns": 50800
  },
  ...
  ]
}
```

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### GetPrinterInfoResponse

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-GetPrinterInfoResponse-capabilities" class="dcc-code-sections__label">

  capabilities

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Printer capabilities in [CDD format](https://developers.google.com/cloud-print/docs/cdd#cdd). The property may be missing.

- <div>

  <div id="property-GetPrinterInfoResponse-status" class="dcc-code-sections__label">

  status

  </div>

  <div class="dcc-type--xsmall">

  [PrinterStatus](#type-PrinterStatus)

  </div>

  </div>

  The status of the printer.

</div>

<div>

<div class="notranslate">

### JobStatus

</div>

Status of the print job.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"PENDING"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Print job is received on Chrome side but was not processed yet.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"IN_PROGRESS"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Print job is sent for printing.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FAILED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Print job was interrupted due to some error.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"CANCELED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Print job was canceled by the user or via API.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"PRINTED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Print job was printed without any errors.</span>

</div>

</div>

<div>

<div class="notranslate">

### Printer

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Printer-description" class="dcc-code-sections__label">

  description

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The human-readable description of the printer.

- <div>

  <div id="property-Printer-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The printer's identifier; guaranteed to be unique among printers on the device.

- <div>

  <div id="property-Printer-isDefault" class="dcc-code-sections__label">

  isDefault

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  The flag which shows whether the printer fits [DefaultPrinterSelection](https://chromium.org/administrators/policy-list-3#DefaultPrinterSelection) rules. Note that several printers could be flagged.

- <div>

  <div id="property-Printer-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The name of the printer.

- <div>

  <div id="property-Printer-recentlyUsedRank" class="dcc-code-sections__label">

  recentlyUsedRank

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The value showing how recent the printer was used for printing from Chrome. The lower the value is the more recent the printer was used. The minimum value is 0. Missing value indicates that the printer wasn't used recently. This value is guaranteed to be unique amongst printers.

- <div>

  <div id="property-Printer-source" class="dcc-code-sections__label">

  source

  </div>

  <div class="dcc-type--xsmall">

  [PrinterSource](#type-PrinterSource)

  </div>

  </div>

  The source of the printer (user or policy configured).

- <div>

  <div id="property-Printer-uri" class="dcc-code-sections__label">

  uri

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The printer URI. This can be used by extensions to choose the printer for the user.

</div>

<div>

<div class="notranslate">

### PrinterSource

</div>

The source of the printer.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"USER"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Printer was added by user.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"POLICY"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Printer was added via policy.</span>

</div>

</div>

<div>

<div class="notranslate">

### PrinterStatus

</div>

The status of the printer.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"DOOR_OPEN"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The door of the printer is open. Printer still accepts print jobs.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"TRAY_MISSING"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The tray of the printer is missing. Printer still accepts print jobs.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"OUT_OF_INK"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The printer is out of ink. Printer still accepts print jobs.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"OUT_OF_PAPER"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The printer is out of paper. Printer still accepts print jobs.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"OUTPUT_FULL"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The output area of the printer (e.g. tray) is full. Printer still accepts print jobs.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"PAPER_JAM"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The printer has a paper jam. Printer still accepts print jobs.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"GENERIC_ISSUE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Some generic issue. Printer still accepts print jobs.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"STOPPED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The printer is stopped and doesn't print but still accepts print jobs.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"UNREACHABLE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The printer is unreachable and doesn't accept print jobs.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"EXPIRED_CERTIFICATE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The SSL certificate is expired. Printer accepts jobs but they fail.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"AVAILABLE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The printer is available.</span>

</div>

</div>

<div>

<div class="notranslate">

### SubmitJobRequest

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-SubmitJobRequest-job" class="dcc-code-sections__label">

  job

  </div>

  <div class="dcc-type--xsmall">

  [PrintJob](https://developer.chrome.com/docs/extensions/reference/printerProvider/#type-PrintJob)

  </div>

  </div>

  The print job to be submitted. Supported content types are "application/pdf" and "image/png". The [Cloud Job Ticket](https://developers.google.com/cloud-print/docs/cdd#cjt) shouldn't include `FitToPageTicketItem`, `PageRangeTicketItem` and `ReverseOrderTicketItem` fields since they are irrelevant for native printing. `VendorTicketItem` is optional. All other fields must be present.

</div>

<div>

<div class="notranslate">

### SubmitJobResponse

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-SubmitJobResponse-jobId" class="dcc-code-sections__label">

  jobId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The id of created print job. This is a unique identifier among all print jobs on the device. If status is not OK, jobId will be null.

- <div>

  <div id="property-SubmitJobResponse-status" class="dcc-code-sections__label">

  status

  </div>

  <div class="dcc-type--xsmall">

  [SubmitJobStatus](#type-SubmitJobStatus)

  </div>

  </div>

  The status of the request.

</div>

<div>

<div class="notranslate">

### SubmitJobStatus

</div>

The status of [`submitJob`](#method-submitJob) request.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"OK"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Sent print job request is accepted.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"USER_REJECTED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Sent print job request is rejected by the user.</span>

</div>

</div>

</div>

## Properties

<div>

<div>

<div class="notranslate">

### MAX_GET_PRINTER_INFO_CALLS_PER_MINUTE

</div>

The maximum number of times that [`getPrinterInfo`](#method-getPrinterInfo) can be called per minute.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">20</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MAX_SUBMIT_JOB_CALLS_PER_MINUTE

</div>

The maximum number of times that [`submitJob`](#method-submitJob) can be called per minute.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">40</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### cancelJob()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.printing.cancelJob(
  jobId: string,
): Promise<void>
```

Cancels previously submitted job.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-cancelJob-jobId" class="dcc-code-sections__label">

  jobId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The id of the print job to cancel. This should be the same id received in a [`SubmitJobResponse`](#type-SubmitJobResponse).

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 100+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getJobStatus()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 135+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.printing.getJobStatus(
  jobId: string,
): Promise<JobStatus>
```

Returns the status of the print job. This call will fail with a runtime error if the print job with the given `jobId` doesn't exist. `jobId`: The id of the print job to return the status of. This should be the same id received in a [`SubmitJobResponse`](#type-SubmitJobResponse).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getJobStatus-jobId" class="dcc-code-sections__label">

  jobId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[JobStatus](#type-JobStatus)\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getPrinterInfo()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.printing.getPrinterInfo(
  printerId: string,
): Promise<GetPrinterInfoResponse>
```

Returns the status and capabilities of the printer in [CDD format](https://developers.google.com/cloud-print/docs/cdd#cdd). This call will fail with a runtime error if no printers with given id are installed.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getPrinterInfo-printerId" class="dcc-code-sections__label">

  printerId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[GetPrinterInfoResponse](#type-GetPrinterInfoResponse)\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 100+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getPrinters()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.printing.getPrinters(): Promise<Printer[]>
```

Returns the list of available printers on the device. This includes manually added, enterprise and discovered printers.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Printer](#type-Printer)\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 100+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### submitJob()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.printing.submitJob(
  request: SubmitJobRequest,
): Promise<SubmitJobResponse>
```

Submits the job for printing. If the extension is not listed in the [`PrintingAPIExtensionsAllowlist`](https://chromeenterprise.google/policies/#PrintingAPIExtensionsAllowlist) policy, the user is prompted to accept the print job. Before Chrome 120, this function did not return a promise.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-submitJob-request" class="dcc-code-sections__label">

  request

  </div>

  <div class="dcc-type--xsmall">

  [SubmitJobRequest](#type-SubmitJobRequest)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[SubmitJobResponse](#type-SubmitJobResponse)\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 100+ </span>

  </div>

  </div>

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onJobStatusChanged

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.printing.onJobStatusChanged.addListener(
  callback: function,
)
```

Event fired when the status of the job is changed. This is only fired for the jobs created by this extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onJobStatusChanged-callback" class="dcc-code-sections__label">

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
  (jobId: string, status: JobStatus) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onJobStatusChanged-callback-jobId" class="dcc-code-sections__label">

    jobId

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

  - <div>

    <div id="type-onJobStatusChanged-callback-status" class="dcc-code-sections__label">

    status

    </div>

    <div class="dcc-type--xsmall">

    [JobStatus](#type-JobStatus)

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

Last updated 2025-09-22 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2025-09-22 UTC."\],\[\],\[\]\]

</div>

</div>