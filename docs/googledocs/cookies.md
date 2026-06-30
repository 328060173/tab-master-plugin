> 来源: https://developer.chrome.com/docs/extensions/reference/api/cookies
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

# chrome.cookies <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.cookies` API to query and modify cookies, and to be notified when they change.

</div>

## Permissions

<div class="dcc-reference">

`cookies`\

</div>

To use the cookies API, declare the `"cookies"` permission in your manifest along with [host permissions](/docs/extensions/develop/concepts/declare-permissions) for any hosts whose cookies you want to access. For example:

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "host_permissions": [
    "*://*.google.com/"
  ],
  "permissions": [
    "cookies"
  ],
  ...
}
```

## Partitioning

[Partitioned cookies](/docs/privacy-sandbox/chips) allow a site to mark that certain cookies should be keyed against the origin of the top-level frame. This means that, for example, if site A is embedded using an iframe in site B and site C, the embedded versions of a partitioned cookie from A can have different values on B and C.

By default, all API methods operate on unpartitioned cookies. The [`partitionKey`](#type-CookiePartitionKey) property can be used to override this behavior.

For details on the general impact of partitioning for extensions, see [Storage and Cookies](/docs/extensions/develop/concepts/storage-and-cookies#cookies-partitioning).

## Examples

You can find a simple example of using the cookies API in the [examples/api/cookies](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/cookies/cookie-clearer) directory. For other examples and for help in viewing the source code, see [Samples](/docs/extensions/samples).

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### Cookie

</div>

Represents information about an HTTP cookie.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Cookie-domain" class="dcc-code-sections__label">

  domain

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The domain of the cookie (e.g. "www.google.com", "example.com").

- <div>

  <div id="property-Cookie-expirationDate" class="dcc-code-sections__label">

  expirationDate

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The expiration date of the cookie as the number of seconds since the UNIX epoch. Not provided for session cookies.

- <div>

  <div id="property-Cookie-hostOnly" class="dcc-code-sections__label">

  hostOnly

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if the cookie is a host-only cookie (i.e. a request's host must exactly match the domain of the cookie).

- <div>

  <div id="property-Cookie-httpOnly" class="dcc-code-sections__label">

  httpOnly

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if the cookie is marked as HttpOnly (i.e. the cookie is inaccessible to client-side scripts).

- <div>

  <div id="property-Cookie-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The name of the cookie.

- <div>

  <div id="property-Cookie-partitionKey" class="dcc-code-sections__label">

  partitionKey

  </div>

  <div class="dcc-type--xsmall">

  [CookiePartitionKey](#type-CookiePartitionKey) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 119+ </span>

  </div>

  </div>

  The partition key for reading or modifying cookies with the Partitioned attribute.

- <div>

  <div id="property-Cookie-path" class="dcc-code-sections__label">

  path

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The path of the cookie.

- <div>

  <div id="property-Cookie-sameSite" class="dcc-code-sections__label">

  sameSite

  </div>

  <div class="dcc-type--xsmall">

  [SameSiteStatus](#type-SameSiteStatus)

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 51+ </span>

  </div>

  </div>

  The cookie's same-site status (i.e. whether the cookie is sent with cross-site requests).

- <div>

  <div id="property-Cookie-secure" class="dcc-code-sections__label">

  secure

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if the cookie is marked as Secure (i.e. its scope is limited to secure channels, typically HTTPS).

- <div>

  <div id="property-Cookie-session" class="dcc-code-sections__label">

  session

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if the cookie is a session cookie, as opposed to a persistent cookie with an expiration date.

- <div>

  <div id="property-Cookie-storeId" class="dcc-code-sections__label">

  storeId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The ID of the cookie store containing this cookie, as provided in getAllCookieStores().

- <div>

  <div id="property-Cookie-value" class="dcc-code-sections__label">

  value

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The value of the cookie.

</div>

<div>

<div class="notranslate">

### CookieDetails

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

</div>

</div>

Details to identify the cookie.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-CookieDetails-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The name of the cookie to access.

- <div>

  <div id="property-CookieDetails-partitionKey" class="dcc-code-sections__label">

  partitionKey

  </div>

  <div class="dcc-type--xsmall">

  [CookiePartitionKey](#type-CookiePartitionKey) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 119+ </span>

  </div>

  </div>

  The partition key for reading or modifying cookies with the Partitioned attribute.

- <div>

  <div id="property-CookieDetails-storeId" class="dcc-code-sections__label">

  storeId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the cookie store in which to look for the cookie. By default, the current execution context's cookie store will be used.

- <div>

  <div id="property-CookieDetails-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The URL with which the cookie to access is associated. This argument may be a full URL, in which case any data following the URL path (e.g. the query string) is simply ignored. If host permissions for this URL are not specified in the manifest file, the API call will fail.

</div>

<div>

<div class="notranslate">

### CookiePartitionKey

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 119+ </span>

</div>

</div>

Represents a partitioned cookie's partition key.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-CookiePartitionKey-hasCrossSiteAncestor" class="dcc-code-sections__label">

  hasCrossSiteAncestor

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 130+ </span>

  </div>

  </div>

  Indicates if the cookie was set in a cross-cross site context. This prevents a top-level site embedded in a cross-site context from accessing cookies set by the top-level site in a same-site context.

- <div>

  <div id="property-CookiePartitionKey-topLevelSite" class="dcc-code-sections__label">

  topLevelSite

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The top-level site the partitioned cookie is available in.

</div>

<div>

<div class="notranslate">

### CookieStore

</div>

Represents a cookie store in the browser. An incognito mode window, for instance, uses a separate cookie store from a non-incognito window.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-CookieStore-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The unique identifier for the cookie store.

- <div>

  <div id="property-CookieStore-tabIds" class="dcc-code-sections__label">

  tabIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\]

  </div>

  </div>

  Identifiers of all the browser tabs that share this cookie store.

</div>

<div>

<div class="notranslate">

### FrameDetails

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 132+ </span>

</div>

</div>

Details to identify the frame.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-FrameDetails-documentId" class="dcc-code-sections__label">

  documentId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The unique identifier for the document. If the frameId and/or tabId are provided they will be validated to match the document found by provided document ID.

- <div>

  <div id="property-FrameDetails-frameId" class="dcc-code-sections__label">

  frameId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The unique identifier for the frame within the tab.

- <div>

  <div id="property-FrameDetails-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The unique identifier for the tab containing the frame.

</div>

<div>

<div class="notranslate">

### OnChangedCause

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

The underlying reason behind the cookie's change. If a cookie was inserted, or removed via an explicit call to "chrome.cookies.remove", "cause" will be "explicit". If a cookie was automatically removed due to expiry, "cause" will be "expired". If a cookie was removed due to being overwritten with an already-expired expiration date, "cause" will be set to "expired_overwrite". If a cookie was automatically removed due to garbage collection, "cause" will be "evicted". If a cookie was automatically removed due to a "set" call that overwrote it, "cause" will be "overwrite". Plan your response accordingly.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"evicted"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"expired"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"explicit"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"expired_overwrite"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"overwrite"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### SameSiteStatus

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 51+ </span>

</div>

</div>

A cookie's 'SameSite' state (https://tools.ietf.org/html/draft-west-first-party-cookies). 'no_restriction' corresponds to a cookie set with 'SameSite=None', 'lax' to 'SameSite=Lax', and 'strict' to 'SameSite=Strict'. 'unspecified' corresponds to a cookie set without the SameSite attribute.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"no_restriction"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"lax"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"strict"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"unspecified"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### get()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.cookies.get(
  details: CookieDetails,
): Promise<Cookie | undefined>
```

Retrieves information about a single cookie. If more than one cookie of the same name exists for the given URL, the one with the longest path will be returned. For cookies with the same path length, the cookie with the earliest creation time will be returned.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-get-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  [CookieDetails](#type-CookieDetails)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Cookie](#type-Cookie) \| undefined\>

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
chrome.cookies.getAll(
  details: object,
): Promise<Cookie[]>
```

Retrieves all cookies from a single cookie store that match the given information. The cookies returned will be sorted, with those with the longest path first. If multiple cookies have the same path length, those with the earliest creation time will be first. This method only retrieves cookies for domains that the extension has host permissions to.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getAll-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  Information to filter the cookies being retrieved.

  <div class="dcc-code-sections">

  - <div>

    <div id="property-getAll-details-domain" class="dcc-code-sections__label">

    domain

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Restricts the retrieved cookies to those whose domains match or are subdomains of this one.

  - <div>

    <div id="property-getAll-details-name" class="dcc-code-sections__label">

    name

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Filters the cookies by name.

  - <div>

    <div id="property-getAll-details-partitionKey" class="dcc-code-sections__label">

    partitionKey

    </div>

    <div class="dcc-type--xsmall">

    [CookiePartitionKey](#type-CookiePartitionKey) <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 119+ </span>

    </div>

    </div>

    The partition key for reading or modifying cookies with the Partitioned attribute.

  - <div>

    <div id="property-getAll-details-path" class="dcc-code-sections__label">

    path

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Restricts the retrieved cookies to those whose path exactly matches this string.

  - <div>

    <div id="property-getAll-details-secure" class="dcc-code-sections__label">

    secure

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Filters the cookies by their Secure property.

  - <div>

    <div id="property-getAll-details-session" class="dcc-code-sections__label">

    session

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Filters out session vs. persistent cookies.

  - <div>

    <div id="property-getAll-details-storeId" class="dcc-code-sections__label">

    storeId

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The cookie store to retrieve cookies from. If omitted, the current execution context's cookie store will be used.

  - <div>

    <div id="property-getAll-details-url" class="dcc-code-sections__label">

    url

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Restricts the retrieved cookies to those that would match the given URL.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Cookie](#type-Cookie)\[\]\>

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

### getAllCookieStores()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.cookies.getAllCookieStores(): Promise<CookieStore[]>
```

Lists all existing cookie stores.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[CookieStore](#type-CookieStore)\[\]\>

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

### getPartitionKey()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 132+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.cookies.getPartitionKey(
  details: FrameDetails,
): Promise<object>
```

The partition key for the frame indicated.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getPartitionKey-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  [FrameDetails](#type-FrameDetails)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<object\>

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
chrome.cookies.remove(
  details: CookieDetails,
): Promise<object | undefined>
```

Deletes a cookie by name.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-remove-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  [CookieDetails](#type-CookieDetails)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<object \| undefined\>

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

### set()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.cookies.set(
  details: object,
): Promise<Cookie | undefined>
```

Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-set-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  Details about the cookie being set.

  <div class="dcc-code-sections">

  - <div>

    <div id="property-set-details-domain" class="dcc-code-sections__label">

    domain

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The domain of the cookie. If omitted, the cookie becomes a host-only cookie.

  - <div>

    <div id="property-set-details-expirationDate" class="dcc-code-sections__label">

    expirationDate

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The expiration date of the cookie as the number of seconds since the UNIX epoch. If omitted, the cookie becomes a session cookie.

  - <div>

    <div id="property-set-details-httpOnly" class="dcc-code-sections__label">

    httpOnly

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the cookie should be marked as HttpOnly. Defaults to false.

  - <div>

    <div id="property-set-details-name" class="dcc-code-sections__label">

    name

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The name of the cookie. Empty by default if omitted.

  - <div>

    <div id="property-set-details-partitionKey" class="dcc-code-sections__label">

    partitionKey

    </div>

    <div class="dcc-type--xsmall">

    [CookiePartitionKey](#type-CookiePartitionKey) <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 119+ </span>

    </div>

    </div>

    The partition key for reading or modifying cookies with the Partitioned attribute.

  - <div>

    <div id="property-set-details-path" class="dcc-code-sections__label">

    path

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The path of the cookie. Defaults to the path portion of the url parameter.

  - <div>

    <div id="property-set-details-sameSite" class="dcc-code-sections__label">

    sameSite

    </div>

    <div class="dcc-type--xsmall">

    [SameSiteStatus](#type-SameSiteStatus) <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 51+ </span>

    </div>

    </div>

    The cookie's same-site status. Defaults to "unspecified", i.e., if omitted, the cookie is set without specifying a SameSite attribute.

  - <div>

    <div id="property-set-details-secure" class="dcc-code-sections__label">

    secure

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the cookie should be marked as Secure. Defaults to false.

  - <div>

    <div id="property-set-details-storeId" class="dcc-code-sections__label">

    storeId

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The ID of the cookie store in which to set the cookie. By default, the cookie is set in the current execution context's cookie store.

  - <div>

    <div id="property-set-details-url" class="dcc-code-sections__label">

    url

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    The request-URI to associate with the setting of the cookie. This value can affect the default domain and path values of the created cookie. If host permissions for this URL are not specified in the manifest file, the API call will fail.

  - <div>

    <div id="property-set-details-value" class="dcc-code-sections__label">

    value

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The value of the cookie. Empty by default if omitted.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Cookie](#type-Cookie) \| undefined\>

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

### onChanged

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.cookies.onChanged.addListener(
  callback: function,
)
```

Fired when a cookie is set or removed. As a special case, note that updating a cookie's properties is implemented as a two step process: the cookie to be updated is first removed entirely, generating a notification with "cause" of "overwrite" . Afterwards, a new cookie is written with the updated values, generating a second notification with "cause" "explicit".

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
  (changeInfo: object) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onChanged-callback-changeInfo" class="dcc-code-sections__label">

    changeInfo

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onChanged-callback-changeInfo-cause" class="dcc-code-sections__label">

      cause

      </div>

      <div class="dcc-type--xsmall">

      [OnChangedCause](#type-OnChangedCause)

      </div>

      </div>

      The underlying reason behind the cookie's change.

    - <div>

      <div id="property-onChanged-callback-changeInfo-cookie" class="dcc-code-sections__label">

      cookie

      </div>

      <div class="dcc-type--xsmall">

      [Cookie](#type-Cookie)

      </div>

      </div>

      Information about the cookie that was set or removed.

    - <div>

      <div id="property-onChanged-callback-changeInfo-removed" class="dcc-code-sections__label">

      removed

      </div>

      <div class="dcc-type--xsmall">

      boolean

      </div>

      </div>

      True if a cookie was removed.

    </div>

  </div>

</div>

</div>

</div>

</div>

<div class="devsite-floating-action-buttons">

</div>

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-08-11 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2025-08-11 UTC."\],\[\],\[\]\]

</div>

</div>