> 来源: https://developer.chrome.com/docs/extensions/reference/api/documentScan
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

# chrome.documentScan <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

<div class="aside note">

**Important:** This API works **only on ChromeOS**.

</div>

## Description

<div class="dcc-reference">

Use the `chrome.documentScan` API to discover and retrieve images from attached document scanners.

</div>

The Document Scan API is designed to allow apps and extensions to view the content of paper documents on an attached document scanner.

## Permissions

<div class="dcc-reference">

`documentScan`\

</div>

## Availability

<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span><span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span>

</div>

</div>

</div>

Availability for API members added later is shown with those members.

## Concepts and usage

This API supports two means of scanning documents. If your use case can work with any scanner and doesn't require control of the configuration, use the `scan()` method. More complicated use cases require a combination of methods, which are only supported in Chrome 124 and later.

### Simple scanning

For simple use cases, meaning those that can work with any scanner and don't require control of configuration, call `scan()`. This method takes a `ScanOptions` object and returns a Promise that resolves with a `ScanResults` object. The capabilities of this option are limited to the number of scans and the MIME types that will be accepted by the caller. Scans are returned as URLs for display in an `<img>` tag for a user interface.

### Complex scanning

Complex scans are accomplished in three phases as described in this section. This outline does not describe every method argument or every property returned in a response. It is only intended to give you a general guide to writing scanner code.

<div class="aside note">

**Note:** Calling [`openScanner()`](#method-openscanner), [`getScannerList()`](#method-getscannerlist), or [`startScan()`](#method-startscan) more than once will cancel operations initiated by previous calls to these methods. See the descriptions of these methods for specifics.

</div>

#### Discovery

1.  Call [`getScannerList()`](#method-getscannerlist). Available scanners are returned in a Promise that resolves with a [`GetScannerListResponse`](#type-getscannerlistresponse).

    - The response object contains an array of [`ScannerInfo`](#type-scannerinfo) objects.
    - The array may contain multiple entries for a single scanner if that scanner supports multiple protocols or connection methods.

2.  Select a scanner from the returned array and save the value of its `scannerId` property.

    Use the properties of individual `ScannerInfo` objects to distinguish among multiple objects for the same scanner. Objects from the same scanner will have the same value for the `deviceUuid` property. `ScannerInfo` also contains an `imageFormats` property containing an array of supported image types.

#### Scanner configuration

1.  Call [`openScanner()`](#method-openscanner), passing in the saved scanner ID. It returns a Promise that resolves with an [`OpenScannerResponse`](#type-openscannerresponse). The response object contains:

    - A `scannerHandle` property, which you'll need to save.

    - An options property containing scanner-specific properties, which you'll need to set. See Retrieve scanner options for more information.

2.  (Optional) If you need the user to provide values for scanner options, construct a user interface. You will need the scanner options provided by the previous step, and you'll need to retrieve option groups provided by the scanner. See [Construct a user interface](/docs/extensions/develop/ui) for more information.

3.  Construct an array of [`OptionSetting`](#type-optionsetting) objects using programmatic or user-provided values. See Set scanner options for more information.

4.  Pass the array of `OptionSetting` objects to [`setOptions()`](#method-setoptions) to set options for the scanner. It returns a Promise that resolves with a [`SetOptionsResponse`](#type-setoptionsresponse). This object contains an updated version of the scanner options retrieved in step 1 of scanner configuration.

    Since changing one option can alter constraints on another option, you may need to repeat these steps several times.

#### Scanning

1.  Construct a [`StartScanOptions`](#type-startscanoptions) object and pass it to [`startScan()`](#method-startscan). It returns a Promise that resolves with a [`StartScanResponse`](#type-startscanresponse). Its `job` property is a handle that you will use to either read scan data or cancel the scan.

2.  Pass the job handle to [`readScanData()`](#method-readscandata). It returns a Promise that resolves with a [`ReadScanDataResponse`](#type-readscandataresponse) object. If data was read successfully, its `result` property equals `SUCCESS` and its `data` property contains an [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) with part of the scan. Note that `estimatedCompletion` contains an estimated percentage of the total data that has been delivered so far.

    <div class="aside note">

    **Note:** If `result` is `SUCCESS`, but `data` is empty, delay briefly before calling `readScanData()` again.

    </div>

3.  Repeat the previous step until the `result` property equals `EOF` or an error.

When the end of the scan is reached, call [`closeScanner()`](#method-closescanner) with the scanner handle saved in step 3. It returns a Promise that resolves with a [`CloseScannerResponse`](#type-closescannerresponse). Calling [`cancelScan()`](#method-cancelscan) at any time after the job is created will end scanning.

### Response objects

All methods return a Promise that resolves with a response object of some kind. Most of these contain a `result` property whose value is a member of [`OperationResult`](#type-operationresult). Some properties of response objects won't contain values unless the value of `result` has a specific value. These relationships are described in the reference for each response object.

For example, `OpenScannerResponse.scannerHandle` will only have a value when `OpenScannerResponse.result` equals `SUCCESS`.

### Scanner options

Scanner options vary considerably by device. Consequently, it's not possible to reflect scanner options directly within the documentScan API. To get around this, the [`OpenScannerResponse`](#type-openscannerresponse) (retrieved using [`openScanner()`](#method-openscanner)) and the [`SetOptionsResponse`](#type-setoptionsresponse) (the response object for [`setOptions()`](#method-setoptions)) contain an `options` property which is an object containing scanner-specific options. Each option is a key-value mapping where the key is a device-specific option and the value is an instance of [`ScannerOption`](#type-scanneroption).

The structure generally looks like this:

<div>

</div>

``` devsite-click-to-copy
{
  "key1": { scannerOptionInstance }
  "key2": { scannerOptionInstance }
}
```

For example, imagine a scanner that returns options named "source" and "resolution". The structure of the returned `options` object will look something like the following example. For simplicity, only partial `ScannerOption` responses are shown.

<div>

</div>

``` devsite-click-to-copy
{
  "source": {
    "name": "source",
    "type": OptionType.STRING,
...
},
  "resolution": {
    "name": "resolution",
    "type": OptionType.INT,
...
  },
...
}
```

### Construct a user interface

Though not required to use this API, you may want a user to choose the value for a particular option. This requires a user interface. Use the [`OpenScannerResponse`](#type-openscannerresponse) (opened by [`openScanner()`](#type-openscanner)) to retrieve the options for the attached scanner as described in the previous section.

Some scanners group options in device-specific ways. They don't affect option behaviors, but since these groups may be mentioned in a scanner's product documentation, such groups should be shown to the user. You can retrieve these groups by calling [`getOptionGroups()`](#method-getoptionsgroup). This returns a Promise that resolves with a [`GetOptionGroupsResponse`](#type-getoptiongroupsreponse) object. Its `groups` property contains a scanner-specific array of groups. Use the information in these groups to organize the options in the [`OpenScannerResponse`](#type-openscannerresponse) for display.

<div>

</div>

``` devsite-click-to-copy
{
  scannerHandle: "123456",
  result: SUCCESS,
  groups: [
    {
      title: "Standard",
      members: [ "resolution", "mode", "source" ]
    }
  ]
}
```

As stated under Scanner configuration, changing one option can alter constraints on another option. This is why [`setOptionsResponse`](#method-setoptionsresponse) (the response object for [`setOptions()`](#method-setoptions)) contains another `options` property. Use this to update the user interface. Then repeat as needed until all options are set.

### Set scanner options

Set scanner options by passing an array of [`OptionSetting`](#type-optionsetting) objects to [`setOptions()`](#method-setoptions). For an example, see the following [Scan one letter-size page](#scan_one_letter-size_page) section.

## Examples

### Retrieve a page as a blob

This example shows one way to retrieve a page from the scanner as a blob and demonstrates use of `startScan()` and `readScanData()` using the value of `OperationResult`.

<div>

</div>

``` devsite-click-to-copy
async function pageAsBlob(handle) {
  let response = await chrome.documentScan.startScan(
      handle, {format: "image/jpeg"});
  if (response.result != chrome.documentScan.OperationResult.SUCCESS) {
    return null;
  }
  const job = response.job;

  let imgParts = [];
  response = await chrome.documentScan.readScanData(job);
  while (response.result == chrome.documentScan.OperationResult.SUCCESS) {
    if (response.data && response.data.byteLength > 0) {
        imgParts.push(response.data);
    } else {
      // Delay so hardware can make progress.
      await new Promise(r => setTimeout(r, 100));
    }
    response = await chrome.documentScan.readScanData(job);
  }
  if (response.result != chrome.documentScan.OperationResult.EOF) {
    return null;
  }
  if (response.data && response.data.byteLength > 0) {
    imgParts.push(response.data);
  }
  return new Blob(imgParts, { type: "image/jpeg" });
}
```

### Scan one letter-size page

This example shows how to select a scanner, set its options, and open it. It then retrieves the contents of a single page and closes the scanner. This process demonstrates using `getScannerList()`, `openScanner()`, `setOptions()`, and `closeScanner()`. Note that the contents of the page are retrieved by calling the `pageAsBlob()` function from the previous example.

<div>

</div>

``` devsite-click-to-copy
async function scan() {
    let response = await chrome.documentScan.getScannerList({ secure: true });
    let scanner = await chrome.documentScan.openScanner(
        response.scanners[0].scannerId);
    const handle = scanner.scannerHandle;

    let options = [];
    for (source of scanner.options["source"].constraint.list) {
        if (source.includes("ADF")) {
            options.push({
                name: "source",
                type: chrome.documentScan.OptionType.STRING,
                value: { value: source }
            });
            break;
        }
    }
    options.push({
        name: "tl-x",
        type: chrome.documentScan.OptionType.FIXED,
        value: 0.0
    });
    options.push({
        name: "br-x",
        type: chrome.documentScan.OptionType.FIXED,
        value: 215.9  // 8.5" in mm
    });
    options.push({
        name: "tl-y",
        type: chrome.documentScan.OptionType.FIXED,
        value: 0.0
    });
    options.push({
        name: "br-y",
        type: chrome.documentScan.OptionType.FIXED,
        value: 279.4  // 11" in mm
    });
    response = await chrome.documentScan.setOptions(handle, options);

    let imgBlob = await pageAsBlob(handle);
    if (imgBlob != null) {
        // Insert imgBlob into DOM, save to disk, etc
    }
    await chrome.documentScan.closeScanner(handle);
}
```

### Show the configuration

As stated elsewhere, showing a scanner's configuration options to a user requires calling `getOptionGroups()` in addition to the scanner options returned from a call to `openScanner()`. This is so that options can be shown to users in manufacturer-defined groups. This example shows how to do that.

<div>

</div>

``` devsite-click-to-copy
async function showConfig() {
  let response = await chrome.documentScan.getScannerList({ secure: true });
  let scanner = await chrome.documentScan.openScanner(
      response.scanners[0].scannerId);
  let groups = await chrome.documentScan.getOptionGroups(scanner.scannerHandle);

  for (const group of groups.groups) {
    console.log("=== " + group.title + " ===");
    for (const member of group.members) {
      const option = scanner.options[member];
      if (option.isActive) {
        console.log("  " + option.name + " = " + option.value);
      } else {
        console.log("  " + option.name + " is inactive");
      }
    }
  }
}
```

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### CancelScanResponse

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-CancelScanResponse-job" class="dcc-code-sections__label">

  job

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Provides the same job handle that was passed to `cancelScan()`.

- <div>

  <div id="property-CancelScanResponse-result" class="dcc-code-sections__label">

  result

  </div>

  <div class="dcc-type--xsmall">

  [OperationResult](#type-OperationResult)

  </div>

  </div>

  The backend's cancel scan result. If the result is `OperationResult.SUCCESS` or `OperationResult.CANCELLED`, the scan has been cancelled and the scanner is ready to start a new scan. If the result is `OperationResult.DEVICE_BUSY` , the scanner is still processing the requested cancellation; the caller should wait a short time and try the request again. Other result values indicate a permanent error that should not be retried.

</div>

<div>

<div class="notranslate">

### CloseScannerResponse

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-CloseScannerResponse-result" class="dcc-code-sections__label">

  result

  </div>

  <div class="dcc-type--xsmall">

  [OperationResult](#type-OperationResult)

  </div>

  </div>

  The result of closing the scanner. Even if this value is not `SUCCESS`, the handle will be invalid and should not be used for any further operations.

- <div>

  <div id="property-CloseScannerResponse-scannerHandle" class="dcc-code-sections__label">

  scannerHandle

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The same scanner handle as was passed to [`closeScanner`](#method-closeScanner).

</div>

<div>

<div class="notranslate">

### Configurability

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

How an option can be changed.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"NOT_CONFIGURABLE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The option is read-only.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SOFTWARE_CONFIGURABLE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The option can be set in software.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"HARDWARE_CONFIGURABLE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The option can be set by the user toggling or pushing a button on the scanner.</span>

</div>

</div>

<div>

<div class="notranslate">

### ConnectionType

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

Indicates how the scanner is connected to the computer.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"UNSPECIFIED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"USB"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"NETWORK"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### ConstraintType

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

The data type of constraint represented by an [`OptionConstraint`](#type-OptionConstraint).

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"INT_RANGE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The constraint on a range of `OptionType.INT` values. The `min`, `max`, and `quant` properties of `OptionConstraint` will be `long`, and its `list` propety will be unset.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FIXED_RANGE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The constraint on a range of `OptionType.FIXED` values. The `min`, `max`, and `quant` properties of `OptionConstraint` will be `double`, and its `list` property will be unset.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"INT_LIST"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The constraint on a specific list of `OptionType.INT` values. The `OptionConstraint.list` property will contain `long` values, and the other properties will be unset.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FIXED_LIST"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The constraint on a specific list of `OptionType.FIXED` values. The `OptionConstraint.list` property will contain `double` values, and the other properties will be unset.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"STRING_LIST"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The constraint on a specific list of `OptionType.STRING` values. The `OptionConstraint.list` property will contain `DOMString` values, and the other properties will be unset.</span>

</div>

</div>

<div>

<div class="notranslate">

### DeviceFilter

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-DeviceFilter-local" class="dcc-code-sections__label">

  local

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Only return scanners that are directly attached to the computer.

- <div>

  <div id="property-DeviceFilter-secure" class="dcc-code-sections__label">

  secure

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Only return scanners that use a secure transport, such as USB or TLS.

</div>

<div>

<div class="notranslate">

### GetOptionGroupsResponse

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-GetOptionGroupsResponse-groups" class="dcc-code-sections__label">

  groups

  </div>

  <div class="dcc-type--xsmall">

  [OptionGroup](#type-OptionGroup)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If `result` is `SUCCESS`, provides a list of option groups in the order supplied by the scanner driver.

- <div>

  <div id="property-GetOptionGroupsResponse-result" class="dcc-code-sections__label">

  result

  </div>

  <div class="dcc-type--xsmall">

  [OperationResult](#type-OperationResult)

  </div>

  </div>

  The result of getting the option groups. If the value of this is `SUCCESS`, the `groups` property will be populated.

- <div>

  <div id="property-GetOptionGroupsResponse-scannerHandle" class="dcc-code-sections__label">

  scannerHandle

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The same scanner handle as was passed to [`getOptionGroups`](#method-getOptionGroups).

</div>

<div>

<div class="notranslate">

### GetScannerListResponse

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-GetScannerListResponse-result" class="dcc-code-sections__label">

  result

  </div>

  <div class="dcc-type--xsmall">

  [OperationResult](#type-OperationResult)

  </div>

  </div>

  The enumeration result. Note that partial results could be returned even if this indicates an error.

- <div>

  <div id="property-GetScannerListResponse-scanners" class="dcc-code-sections__label">

  scanners

  </div>

  <div class="dcc-type--xsmall">

  [ScannerInfo](#type-ScannerInfo)\[\]

  </div>

  </div>

  A possibly-empty list of scanners that match the provided [`DeviceFilter`](#type-DeviceFilter).

</div>

<div>

<div class="notranslate">

### OpenScannerResponse

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-OpenScannerResponse-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If `result` is `SUCCESS`, provides a key-value mapping where the key is a device-specific option and the value is an instance of [`ScannerOption`](#type-ScannerOption).

- <div>

  <div id="property-OpenScannerResponse-result" class="dcc-code-sections__label">

  result

  </div>

  <div class="dcc-type--xsmall">

  [OperationResult](#type-OperationResult)

  </div>

  </div>

  The result of opening the scanner. If the value of this is `SUCCESS`, the `scannerHandle` and `options` properties will be populated.

- <div>

  <div id="property-OpenScannerResponse-scannerHandle" class="dcc-code-sections__label">

  scannerHandle

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If `result` is `SUCCESS`, a handle to the scanner that can be used for further operations.

- <div>

  <div id="property-OpenScannerResponse-scannerId" class="dcc-code-sections__label">

  scannerId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The scanner ID passed to `openScanner()`.

</div>

<div>

<div class="notranslate">

### OperationResult

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

An enum that indicates the result of each operation.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"UNKNOWN"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">An unknown or generic failure occurred.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SUCCESS"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The operation succeeded.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"UNSUPPORTED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The operation is not supported.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"CANCELLED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The operation was cancelled.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"DEVICE_BUSY"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The device is busy.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"INVALID"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Either the data or an argument passed to the method is not valid.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"WRONG_TYPE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The supplied value is the wrong data type for the underlying option.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"EOF"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">No more data is available.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ADF_JAMMED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The document feeder is jammed.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ADF_EMPTY"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The document feeder is empty.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"COVER_OPEN"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The flatbed cover is open.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"IO_ERROR"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">An error occurred while communicating with the device.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ACCESS_DENIED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The device requires authentication.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"NO_MEMORY"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Not enough memory is available on the Chromebook to complete the operation.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"UNREACHABLE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The device is not reachable.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"MISSING"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The device is disconnected.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"INTERNAL_ERROR"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">An error has occurred somewhere other than the calling application.</span>

</div>

</div>

<div>

<div class="notranslate">

### OptionConstraint

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-OptionConstraint-list" class="dcc-code-sections__label">

  list

  </div>

  <div class="dcc-type--xsmall">

  string\[\] \| number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-OptionConstraint-max" class="dcc-code-sections__label">

  max

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-OptionConstraint-min" class="dcc-code-sections__label">

  min

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-OptionConstraint-quant" class="dcc-code-sections__label">

  quant

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-OptionConstraint-type" class="dcc-code-sections__label">

  type

  </div>

  <div class="dcc-type--xsmall">

  [ConstraintType](#type-ConstraintType)

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### OptionGroup

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-OptionGroup-members" class="dcc-code-sections__label">

  members

  </div>

  <div class="dcc-type--xsmall">

  string\[\]

  </div>

  </div>

  An array of option names in driver-provided order.

- <div>

  <div id="property-OptionGroup-title" class="dcc-code-sections__label">

  title

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Provides a printable title, for example "Geometry options".

</div>

<div>

<div class="notranslate">

### OptionSetting

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-OptionSetting-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Indicates the name of the option to set.

- <div>

  <div id="property-OptionSetting-type" class="dcc-code-sections__label">

  type

  </div>

  <div class="dcc-type--xsmall">

  [OptionType](#type-OptionType)

  </div>

  </div>

  Indicates the data type of the option. The requested data type must match the real data type of the underlying option.

- <div>

  <div id="property-OptionSetting-value" class="dcc-code-sections__label">

  value

  </div>

  <div class="dcc-type--xsmall">

  string \| number \| boolean \| number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Indicates the value to set. Leave unset to request automatic setting for options that have `autoSettable` enabled. The data type supplied for `value` must match `type`.

</div>

<div>

<div class="notranslate">

### OptionType

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

The data type of an option.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"UNKNOWN"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The option's data type is unknown. The `value` property will be unset.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"BOOL"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The `value` property will be one of `true`false.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"INT"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">A signed 32-bit integer. The `value` property will be long or long\[\], depending on whether the option takes more than one value.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"FIXED"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">A double in the range -32768-32767.9999 with a resolution of 1/65535. The `value` property will be double or double\[\] depending on whether the option takes more than one value. Double values that can't be exactly represented will be rounded to the available range and precision.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"STRING"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">A sequence of any bytes except NUL ('\0'). The `value` property will be a DOMString.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"BUTTON"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">An option of this type has no value. Instead, setting an option of this type causes an option-specific side effect in the scanner driver. For example, a button-typed option could be used by a scanner driver to provide a means to select default values or to tell an automatic document feeder to advance to the next sheet of paper.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"GROUP"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Grouping option. No value. This is included for compatibility, but will not normally be returned in `ScannerOption` values. Use `getOptionGroups()` to retrieve the list of groups with their member options.</span>

</div>

</div>

<div>

<div class="notranslate">

### OptionUnit

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

Indicates the data type for [`ScannerOption.unit`](#property-ScannerOption-unit).

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"UNITLESS"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The value is a unitless number. For example, it can be a threshold.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"PIXEL"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The value is a number of pixels, for example, scan dimensions.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"BIT"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The value is the number of bits, for example, color depth.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"MM"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The value is measured in millimeters, for example, scan dimensions.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"DPI"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The value is measured in dots per inch, for example, resolution.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"PERCENT"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The value is a percent, for example, brightness.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"MICROSECOND"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The value is measured in microseconds, for example, exposure time.</span>

</div>

</div>

<div>

<div class="notranslate">

### ReadScanDataResponse

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ReadScanDataResponse-data" class="dcc-code-sections__label">

  data

  </div>

  <div class="dcc-type--xsmall">

  ArrayBuffer <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If `result` is `SUCCESS`, contains the *next* chunk of scanned image data. If `result` is `EOF`, contains the *last* chunk of scanned image data.

- <div>

  <div id="property-ReadScanDataResponse-estimatedCompletion" class="dcc-code-sections__label">

  estimatedCompletion

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If `result` is `SUCCESS`, an estimate of how much of the total scan data has been delivered so far, in the range 0 to 100.

- <div>

  <div id="property-ReadScanDataResponse-job" class="dcc-code-sections__label">

  job

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Provides the job handle passed to `readScanData()`.

- <div>

  <div id="property-ReadScanDataResponse-result" class="dcc-code-sections__label">

  result

  </div>

  <div class="dcc-type--xsmall">

  [OperationResult](#type-OperationResult)

  </div>

  </div>

  The result of reading data. If its value is `SUCCESS`, then `data` contains the *next* (possibly zero-length) chunk of image data that is ready for reading. If its value is `EOF`, the `data` contains the *last* chunk of image data.

</div>

<div>

<div class="notranslate">

### ScannerInfo

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ScannerInfo-connectionType" class="dcc-code-sections__label">

  connectionType

  </div>

  <div class="dcc-type--xsmall">

  [ConnectionType](#type-ConnectionType)

  </div>

  </div>

  Indicates how the scanner is connected to the computer.

- <div>

  <div id="property-ScannerInfo-deviceUuid" class="dcc-code-sections__label">

  deviceUuid

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  For matching against other `ScannerInfo` entries that point to the same physical device.

- <div>

  <div id="property-ScannerInfo-imageFormats" class="dcc-code-sections__label">

  imageFormats

  </div>

  <div class="dcc-type--xsmall">

  string\[\]

  </div>

  </div>

  An array of MIME types that can be requested for returned scans.

- <div>

  <div id="property-ScannerInfo-manufacturer" class="dcc-code-sections__label">

  manufacturer

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The scanner manufacturer.

- <div>

  <div id="property-ScannerInfo-model" class="dcc-code-sections__label">

  model

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The scanner model if it is available, or a generic description.

- <div>

  <div id="property-ScannerInfo-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  A human-readable name for the scanner to display in the UI.

- <div>

  <div id="property-ScannerInfo-protocolType" class="dcc-code-sections__label">

  protocolType

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  A human-readable description of the protocol or driver used to access the scanner, such as Mopria, WSD, or epsonds. This is primarily useful for allowing a user to choose between protocols if a device supports multiple protocols.

- <div>

  <div id="property-ScannerInfo-scannerId" class="dcc-code-sections__label">

  scannerId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The ID of a specific scanner.

- <div>

  <div id="property-ScannerInfo-secure" class="dcc-code-sections__label">

  secure

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  If true, the scanner connection's transport cannot be intercepted by a passive listener, such as TLS or USB.

</div>

<div>

<div class="notranslate">

### ScannerOption

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ScannerOption-configurability" class="dcc-code-sections__label">

  configurability

  </div>

  <div class="dcc-type--xsmall">

  [Configurability](#type-Configurability)

  </div>

  </div>

  Indicates whether and how the option can be changed.

- <div>

  <div id="property-ScannerOption-constraint" class="dcc-code-sections__label">

  constraint

  </div>

  <div class="dcc-type--xsmall">

  [OptionConstraint](#type-OptionConstraint) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Defines [`OptionConstraint`](#type-OptionConstraint) on the current scanner option.

- <div>

  <div id="property-ScannerOption-description" class="dcc-code-sections__label">

  description

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  A longer description of the option.

- <div>

  <div id="property-ScannerOption-isActive" class="dcc-code-sections__label">

  isActive

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Indicates the option is active and can be set or retrieved. If false, the `value` property will not be set.

- <div>

  <div id="property-ScannerOption-isAdvanced" class="dcc-code-sections__label">

  isAdvanced

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Indicates that the UI should not display this option by default.

- <div>

  <div id="property-ScannerOption-isAutoSettable" class="dcc-code-sections__label">

  isAutoSettable

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Can be automatically set by the scanner driver.

- <div>

  <div id="property-ScannerOption-isDetectable" class="dcc-code-sections__label">

  isDetectable

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Indicates that this option can be detected from software.

- <div>

  <div id="property-ScannerOption-isEmulated" class="dcc-code-sections__label">

  isEmulated

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Emulated by the scanner driver if true.

- <div>

  <div id="property-ScannerOption-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The option name using lowercase ASCII letters, numbers, and dashes. Diacritics are not allowed.

- <div>

  <div id="property-ScannerOption-title" class="dcc-code-sections__label">

  title

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  A printable one-line title.

- <div>

  <div id="property-ScannerOption-type" class="dcc-code-sections__label">

  type

  </div>

  <div class="dcc-type--xsmall">

  [OptionType](#type-OptionType)

  </div>

  </div>

  The data type contained in the `value` property, which is needed for setting this option.

- <div>

  <div id="property-ScannerOption-unit" class="dcc-code-sections__label">

  unit

  </div>

  <div class="dcc-type--xsmall">

  [OptionUnit](#type-OptionUnit)

  </div>

  </div>

  The unit of measurement for this option.

- <div>

  <div id="property-ScannerOption-value" class="dcc-code-sections__label">

  value

  </div>

  <div class="dcc-type--xsmall">

  string \| number \| boolean \| number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The current value of the option, if relevant. Note that the data type of this property must match the data type specified in `type`.

</div>

<div>

<div class="notranslate">

### ScanOptions

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ScanOptions-maxImages" class="dcc-code-sections__label">

  maxImages

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The number of scanned images allowed. The default is 1.

- <div>

  <div id="property-ScanOptions-mimeTypes" class="dcc-code-sections__label">

  mimeTypes

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The MIME types that are accepted by the caller.

</div>

<div>

<div class="notranslate">

### ScanResults

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ScanResults-dataUrls" class="dcc-code-sections__label">

  dataUrls

  </div>

  <div class="dcc-type--xsmall">

  string\[\]

  </div>

  </div>

  An array of data image URLs in a form that can be passed as the "src" value to an image tag.

- <div>

  <div id="property-ScanResults-mimeType" class="dcc-code-sections__label">

  mimeType

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The MIME type of the `dataUrls`.

</div>

<div>

<div class="notranslate">

### SetOptionResult

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-SetOptionResult-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Indicates the name of the option that was set.

- <div>

  <div id="property-SetOptionResult-result" class="dcc-code-sections__label">

  result

  </div>

  <div class="dcc-type--xsmall">

  [OperationResult](#type-OperationResult)

  </div>

  </div>

  Indicates the result of setting the option.

</div>

<div>

<div class="notranslate">

### SetOptionsResponse

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-SetOptionsResponse-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  An updated key-value mapping from option names to [`ScannerOption`](#type-ScannerOption) values containing the new configuration after attempting to set all supplied options. This has the same structure as the `options` property in [`OpenScannerResponse`](#type-OpenScannerResponse).

  This property will be set even if some options were not set successfully, but will be unset if retrieving the updated configuration fails (for example, if the scanner is disconnected in the middle of scanning).

- <div>

  <div id="property-SetOptionsResponse-results" class="dcc-code-sections__label">

  results

  </div>

  <div class="dcc-type--xsmall">

  [SetOptionResult](#type-SetOptionResult)\[\]

  </div>

  </div>

  An array of results, one each for every passed-in `OptionSetting`.

- <div>

  <div id="property-SetOptionsResponse-scannerHandle" class="dcc-code-sections__label">

  scannerHandle

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Provides the scanner handle passed to `setOptions()`.

</div>

<div>

<div class="notranslate">

### StartScanOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-StartScanOptions-format" class="dcc-code-sections__label">

  format

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Specifies the MIME type to return scanned data in.

- <div>

  <div id="property-StartScanOptions-maxReadSize" class="dcc-code-sections__label">

  maxReadSize

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If a non-zero value is specified, limits the maximum scanned bytes returned in a single [`readScanData`](#method-readScanData) response to that value. The smallest allowed value is 32768 (32 KB). If this property is not specified, the size of a returned chunk may be as large as the entire scanned image.

</div>

<div>

<div class="notranslate">

### StartScanResponse

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-StartScanResponse-job" class="dcc-code-sections__label">

  job

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If `result` is `SUCCESS`, provides a handle that can be used to read scan data or cancel the job.

- <div>

  <div id="property-StartScanResponse-result" class="dcc-code-sections__label">

  result

  </div>

  <div class="dcc-type--xsmall">

  [OperationResult](#type-OperationResult)

  </div>

  </div>

  The result of starting a scan. If the value of this is `SUCCESS`, the `job` property will be populated.

- <div>

  <div id="property-StartScanResponse-scannerHandle" class="dcc-code-sections__label">

  scannerHandle

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Provides the same scanner handle that was passed to `startScan()`.

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### cancelScan()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.documentScan.cancelScan(
  job: string,
): Promise<CancelScanResponse>
```

Cancels a started scan and returns a Promise that resolves with a [`CancelScanResponse`](#type-CancelScanResponse) object. If a callback is used, the object is passed to it instead.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-cancelScan-job" class="dcc-code-sections__label">

  job

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The handle of an active scan job previously returned from a call to [`startScan`](#method-startScan).

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[CancelScanResponse](#type-CancelScanResponse)\>

  </div>

  </div>

  Returns a Promise which resolves with the result.

</div>

<div>

<div class="notranslate">

### closeScanner()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.documentScan.closeScanner(
  scannerHandle: string,
): Promise<CloseScannerResponse>
```

Closes the scanner with the passed in handle and returns a Promise that resolves with a [`CloseScannerResponse`](#type-CloseScannerResponse) object. If a callback is used, the object is passed to it instead. Even if the response is not a success, the supplied handle becomes invalid and should not be used for further operations.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-closeScanner-scannerHandle" class="dcc-code-sections__label">

  scannerHandle

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Specifies the handle of an open scanner that was previously returned from a call to [`openScanner`](#method-openScanner).

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[CloseScannerResponse](#type-CloseScannerResponse)\>

  </div>

  </div>

  Returns a Promise which resolves with the result.

</div>

<div>

<div class="notranslate">

### getOptionGroups()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.documentScan.getOptionGroups(
  scannerHandle: string,
): Promise<GetOptionGroupsResponse>
```

Gets the group names and member options from a scanner previously opened by [`openScanner`](#method-openScanner). This method returns a Promise that resolves with a [`GetOptionGroupsResponse`](#type-GetOptionGroupsResponse) object. If a callback is passed to this function, returned data is passed to it instead.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getOptionGroups-scannerHandle" class="dcc-code-sections__label">

  scannerHandle

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The handle of an open scanner returned from a call to [`openScanner`](#method-openScanner).

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[GetOptionGroupsResponse](#type-GetOptionGroupsResponse)\>

  </div>

  </div>

  Returns a Promise which resolves with the result.

</div>

<div>

<div class="notranslate">

### getScannerList()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.documentScan.getScannerList(
  filter: DeviceFilter,
): Promise<GetScannerListResponse>
```

Gets the list of available scanners and returns a Promise that resolves with a [`GetScannerListResponse`](#type-GetScannerListResponse) object. If a callback is passed to this function, returned data is passed to it instead.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getScannerList-filter" class="dcc-code-sections__label">

  filter

  </div>

  <div class="dcc-type--xsmall">

  [DeviceFilter](#type-DeviceFilter)

  </div>

  </div>

  A [`DeviceFilter`](#type-DeviceFilter) indicating which types of scanners should be returned.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[GetScannerListResponse](#type-GetScannerListResponse)\>

  </div>

  </div>

  Returns a Promise which resolves with the result and list of scanners.

</div>

<div>

<div class="notranslate">

### openScanner()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.documentScan.openScanner(
  scannerId: string,
): Promise<OpenScannerResponse>
```

Opens a scanner for exclusive access and returns a Promise that resolves with an [`OpenScannerResponse`](#type-OpenScannerResponse) object. If a callback is passed to this function, returned data is passed to it instead.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-openScanner-scannerId" class="dcc-code-sections__label">

  scannerId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The ID of a scanner to be opened. This value is one returned from a previous call to [`getScannerList`](#method-getScannerList).

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[OpenScannerResponse](#type-OpenScannerResponse)\>

  </div>

  </div>

  Returns a Promise which resolves with the result.

</div>

<div>

<div class="notranslate">

### readScanData()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.documentScan.readScanData(
  job: string,
): Promise<ReadScanDataResponse>
```

Reads the next chunk of available image data from an active job handle, and returns a Promise that resolves with a [`ReadScanDataResponse`](#type-ReadScanDataResponse) object. If a callback is used, the object is passed to it instead.

\*\*Note:\*\*It is valid for a response result to be `SUCCESS` with a zero-length `data` member. This means the scanner is still working but does not yet have additional data ready. The caller should wait a short time and try again.

When the scan job completes, the response will have the result value of `EOF`. This response may contain a final non-zero `data` member.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-readScanData-job" class="dcc-code-sections__label">

  job

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Active job handle previously returned from [`startScan`](#method-startScan).

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[ReadScanDataResponse](#type-ReadScanDataResponse)\>

  </div>

  </div>

  Returns a Promise which resolves with the result.

</div>

<div>

<div class="notranslate">

### scan()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.documentScan.scan(
  options: ScanOptions,
): Promise<ScanResults>
```

Performs a document scan and returns a Promise that resolves with a [`ScanResults`](#type-ScanResults) object. If a callback is passed to this function, the returned data is passed to it instead.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-scan-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [ScanOptions](#type-ScanOptions)

  </div>

  </div>

  An object containing scan parameters.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[ScanResults](#type-ScanResults)\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

  </div>

  </div>

  Returns a Promise which resolves with the scan results.

</div>

<div>

<div class="notranslate">

### setOptions()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.documentScan.setOptions(
  scannerHandle: string,
  options: OptionSetting[],
): Promise<SetOptionsResponse>
```

Sets options on the specified scanner and returns a Promise that resolves with a [`SetOptionsResponse`](#type-SetOptionsResponse) object containing the result of trying to set every value in the order of the passed-in [`OptionSetting`](#type-OptionSetting) object. If a callback is used, the object is passed to it instead.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setOptions-scannerHandle" class="dcc-code-sections__label">

  scannerHandle

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The handle of the scanner to set options on. This should be a value previously returned from a call to [`openScanner`](#method-openScanner).

- <div>

  <div id="type-setOptions-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [OptionSetting](#type-OptionSetting)\[\]

  </div>

  </div>

  A list of `OptionSetting` objects to be applied to the scanner.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[SetOptionsResponse](#type-SetOptionsResponse)\>

  </div>

  </div>

  Returns a Promise which resolves with the result.

</div>

<div>

<div class="notranslate">

### startScan()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 125+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.documentScan.startScan(
  scannerHandle: string,
  options: StartScanOptions,
): Promise<StartScanResponse>
```

Starts a scan on the specified scanner and returns a Promise that resolves with a [`StartScanResponse`](#type-StartScanResponse). If a callback is used, the object is passed to it instead. If the call was successful, the response includes a job handle that can be used in subsequent calls to read scan data or cancel a scan.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-startScan-scannerHandle" class="dcc-code-sections__label">

  scannerHandle

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The handle of an open scanner. This should be a value previously returned from a call to [`openScanner`](#method-openScanner).

- <div>

  <div id="type-startScan-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [StartScanOptions](#type-StartScanOptions)

  </div>

  </div>

  A [`StartScanOptions`](#type-StartScanOptions) object indicating the options to be used for the scan. The `StartScanOptions.format` property must match one of the entries returned in the scanner's `ScannerInfo`.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[StartScanResponse](#type-StartScanResponse)\>

  </div>

  </div>

  Returns a Promise which resolves with the result.

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