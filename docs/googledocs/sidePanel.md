> 来源: https://developer.chrome.com/docs/extensions/reference/api/sidePanel
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

# chrome.sidePanel <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.sidePanel` API to host content in the browser's side panel alongside the main content of a webpage.

</div>

## Permissions

<div class="dcc-reference">

`sidePanel`\

</div>

To use the Side Panel API, add the `"sidePanel"` permission in the extension [manifest](/docs/extensions/reference/manifest) file:

<span class="dcc-label">manifest.json:</span>

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My side panel extension",
  ...
  "permissions": [
    "sidePanel"
  ]
}
```

## Availability

<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 114+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

## Concepts and usage

The Side Panel API allows extensions to display their own UI in the side panel, enabling persistent experiences that complement the user's browsing journey.

<figure>
<img src="/static/docs/extensions/reference/api/sidePanel/images/example-side-panel.png" class="screenshot" width="300" alt="Side panel drop-down menu" />
<figcaption>Chrome browser side panel UI.</figcaption>
</figure>

Some features include:

- The side panel remains open when navigating between tabs (if set to do so).
- It can be available only on specific websites.
- As an extension page, side panels have access to all Chrome APIs.
- Within Chrome's settings, users can specify which side the panel should be displayed on.

### Use cases

The following sections demonstrate some common use cases for the Side Panel API. See [Extension samples](#examples) for complete extension examples.

#### Display the same side panel on every site

The side panel can be set initially from the `"default_path"` property in the `"side_panel"` key of the manifest to display the same side panel on every site. This should point to a relative path within the extension directory.

<span class="dcc-label">manifest.json:</span>

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My side panel extension",
  ...
  "side_panel": {
    "default_path": "sidepanel.html"
  }
  ...
}
```

<span class="dcc-label">sidepanel.html:</span>

<div>

</div>

``` devsite-click-to-copy
<!DOCTYPE html>
<html>
  <head>
    <title>My Sidepanel</title>
  </head>
  <body>
    <h1>All sites sidepanel extension</h1>
    <p>This side panel is enabled on all sites</p>
  </body>
</html>
```

#### Enable a side panel on a specific site

An extension can use [`sidepanel.setOptions()`](#method-setOptions) to enable a side panel on a specific tab. This example uses [`chrome.tabs.onUpdated()`](/docs/extensions/reference/api/tabs#event-onUpdated) to listen for any updates made to the tab. It checks if the URL is [www.google.com](https://www.google.com) and enables the side panel. Otherwise, it disables it.

<span class="dcc-label">service-worker.js:</span>

<div>

</div>

``` devsite-click-to-copy
const GOOGLE_ORIGIN = 'https://www.google.com';

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (url.origin === GOOGLE_ORIGIN) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel.html',
      enabled: true
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
});
```

When a user temporarily switches to a tab where the side panel is not enabled, the side panel will be hidden. It will automatically show again when the user switches to a tab where it was previously open.

When the user navigates to a site where the side panel is not enabled, the side panel will close, and the extension won't show in the side panel drop-down menu.

For a complete example, see the [Tab-specific side panel](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.sidepanel-site-specific) sample.

#### Open the side panel by clicking the toolbar icon

Developers can allow users to open the side panel when they click the action toolbar icon with [`sidePanel.setPanelBehavior()`](#method-setPanelBehavior). First, declare the `"action"` key in the manifest:

<span class="dcc-label">manifest.json:</span>

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My side panel extension",
  ...
  "action": {
    "default_title": "Click to open panel"
  },
  ...
}
```

Now, add this code to the previous example:

<span class="dcc-label">service-worker.js:</span>

<div>

</div>

``` devsite-click-to-copy
const GOOGLE_ORIGIN = 'https://www.google.com';

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
...
```

#### Programmatically open the side panel on user interaction

Chrome 116 introduces [`sidePanel.open()`](#method-open). It allows extensions to open the side panel through an extension user gesture, such as [clicking on the action icon](/docs/extensions/reference/api/action). Or a user interaction on an extension page or [content script](/docs/extensions/develop/concepts/content-scripts), such as clicking a button. For a complete demo, see the [Open Side Panel](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.sidepanel-open) sample extension.

The following code shows how to open a global side panel on the current window when the user clicks on a context menu. When using [`sidePanel.open()`](#method-open), you must choose the context in which it should open. Use [`windowId`](#property-OpenOptions-windowId) to open a global side panel. Alternatively, set the [`tabId`](#property-OpenOptions-tabId) to open the side panel only on a specific tab.

<span class="dcc-label">service-worker.js:</span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: 'Open side panel',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openSidePanel') {
    // This will open the panel in all the pages on the current window.
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});
```

<div class="aside key-point">

**Key point:** Remember to design your side panel as a useful companion tool for users, improving their browsing experience without unnecessary distractions. Check the [Quality Guidelines](/docs/webstore/program-policies/quality-guidelines) in the Program Policies for more info.

</div>

#### Switch to a different panel

Extensions can use [`sidepanel.getOptions()`](#method-getOptions) to retrieve the current side panel. The following example sets a welcome side panel on [`runtime.onInstalled()`](/docs/extensions/reference/api/runtime#event-onInstalled). Then when the user navigates to a different tab, it replaces it with the main side panel.

<span class="dcc-label">service-worker.js:</span>

<div>

</div>

``` devsite-click-to-copy
const welcomePage = 'sidepanels/welcome-sp.html';
const mainPage = 'sidepanels/main-sp.html';

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ path: welcomePage });
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const { path } = await chrome.sidePanel.getOptions({ tabId });
  if (path === welcomePage) {
    chrome.sidePanel.setOptions({ path: mainPage });
  }
});
```

See the [Multiple side panels](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.sidepanel-multiple) sample for the full code.

### Side panel user experience

Users will see Chrome's built-in side panels first. Each side panel displays the extension's icon in the side panel menu. If no icons are included, it will show a placeholder icon with the first letter of the extension's name.

#### Open the side panel

To allow users to open the side panel, use an action icon in combination with [`sidePanel.setPanelBehavior()`](#open-action-icon). Alternatively, make a call to [`sidePanel.open()`](#user-interaction) following a user interaction, such as:

- An [action click](/docs/extensions/reference/api/action)
- A [keyboard shortcut](/docs/extensions/reference/api/commands)
- A [context menu](/docs/extensions/reference/api/contextMenus)
- A [user gesture](#user-interaction) on an extension page or content script.

#### Pin the side panel

<figure>
<img src="/static/docs/extensions/reference/api/sidePanel/images/side-panel-pin.png" class="screenshot" width="300" alt="Pin icon in side panel UI." />
<figcaption aria-hidden="true">Pin icon in side panel UI.</figcaption>
</figure>

The side panel toolbar displays a pin icon when your side panel is open. Clicking the icon pins your extension's action icon. Clicking the action icon once pinned will perform the default action for your action icon and will only open the side panel if this has been explicitly configured.

## Examples

For more Side Panel API extensions demos, explore any of the following extensions:

- [Dictionary side panel](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/sample.sidepanel-dictionary).
- [Global side panel](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.sidepanel-global).
- [Multiple side panels](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.sidepanel-multiple).
- [Open Side panel](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.sidepanel-open).
- [Site-specific side panel](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.sidepanel-site-specific).

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### CloseOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 141+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-CloseOptions-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The tab in which to close the side panel. If a tab-specific side panel is open in the specified tab, it will be closed for that tab. If only the global side panel is open, the promise returned by the call to `close()` will reject with an error. This behavior was changed in Chrome 145, with prior versions falling back to closing the global panel. At least one of this or `windowId` must be provided.

- <div>

  <div id="property-CloseOptions-windowId" class="dcc-code-sections__label">

  windowId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The window in which to close the side panel. If a global side panel is open in the specified window, it will be closed for all tabs in that window where no tab-specific panel is active. At least one of this or `tabId` must be provided.

</div>

<div>

<div class="notranslate">

### GetPanelOptions

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-GetPanelOptions-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified, the side panel options for the given tab will be returned. Otherwise, returns the default side panel options (used for any tab that doesn't have specific settings).

</div>

<div>

<div class="notranslate">

### OpenOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 116+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-OpenOptions-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The tab in which to open the side panel. If the corresponding tab has a tab-specific side panel, the panel will only be open for that tab. If there is not a tab-specific panel, the global panel will be open in the specified tab and any other tabs without a currently-open tab- specific panel. This will override any currently-active side panel (global or tab-specific) in the corresponding tab. At least one of this or `windowId` must be provided.

- <div>

  <div id="property-OpenOptions-windowId" class="dcc-code-sections__label">

  windowId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The window in which to open the side panel. This is only applicable if the extension has a global (non-tab-specific) side panel or `tabId` is also specified. This will override any currently-active global side panel the user has open in the given window. At least one of this or `tabId` must be provided.

</div>

<div>

<div class="notranslate">

### PanelBehavior

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-PanelBehavior-openPanelOnActionClick" class="dcc-code-sections__label">

  openPanelOnActionClick

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether clicking the extension's icon will toggle showing the extension's entry in the side panel. Defaults to false.

</div>

<div>

<div class="notranslate">

### PanelClosedInfo

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 142+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-PanelClosedInfo-path" class="dcc-code-sections__label">

  path

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The path of the local resource within the extension package whose content is displayed in the panel.

- <div>

  <div id="property-PanelClosedInfo-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The optional ID of the tab where the side panel was closed. This is provided only when the panel is tab-specific.

- <div>

  <div id="property-PanelClosedInfo-windowId" class="dcc-code-sections__label">

  windowId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The ID of the window where the side panel was closed. This is available for both global and tab-specific panels.

</div>

<div>

<div class="notranslate">

### PanelLayout

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 140+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-PanelLayout-side" class="dcc-code-sections__label">

  side

  </div>

  <div class="dcc-type--xsmall">

  [Side](#type-Side)

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### PanelOpenedInfo

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 141+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-PanelOpenedInfo-path" class="dcc-code-sections__label">

  path

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The path of the local resource within the extension package whose content is displayed in the panel.

- <div>

  <div id="property-PanelOpenedInfo-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The optional ID of the tab where the side panel is opened. This is provided only when the panel is tab-specific.

- <div>

  <div id="property-PanelOpenedInfo-windowId" class="dcc-code-sections__label">

  windowId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The ID of the window where the side panel is opened. This is available for both global and tab-specific panels.

</div>

<div>

<div class="notranslate">

### PanelOptions

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-PanelOptions-enabled" class="dcc-code-sections__label">

  enabled

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether the side panel should be enabled. This is optional. The default value is true.

- <div>

  <div id="property-PanelOptions-path" class="dcc-code-sections__label">

  path

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The path to the side panel HTML file to use. This must be a local resource within the extension package.

- <div>

  <div id="property-PanelOptions-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified, the side panel options will only apply to the tab with this id. If omitted, these options set the default behavior (used for any tab that doesn't have specific settings). Note: if the same path is set for this tabId and the default tabId, then the panel for this tabId will be a different instance than the panel for the default tabId.

</div>

<div>

<div class="notranslate">

### Side

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 140+ </span>

</div>

</div>

Defines the possible alignment for the side panel in the browser UI.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"left"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"right"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### SidePanel

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-SidePanel-default_path" class="dcc-code-sections__label">

  default_path

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Developer specified path for side panel display.

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### close()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 141+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.sidePanel.close(
  options: CloseOptions,
): Promise<void>
```

Closes the extension's side panel. This is a no-op if the panel is already closed.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-close-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [CloseOptions](#type-CloseOptions)

  </div>

  </div>

  Specifies the context in which to close the side panel.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Returns a Promise which resolves when the side panel has been closed.

</div>

<div>

<div class="notranslate">

### getLayout()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 140+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.sidePanel.getLayout(): Promise<PanelLayout>
```

Returns the side panel's current layout.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[PanelLayout](#type-PanelLayout)\>

  </div>

  </div>

  Returns a Promise which resolves with a [`PanelLayout`](#type-PanelLayout).

</div>

<div>

<div class="notranslate">

### getOptions()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.sidePanel.getOptions(
  options: GetPanelOptions,
): Promise<PanelOptions>
```

Returns the active panel configuration.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getOptions-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [GetPanelOptions](#type-GetPanelOptions)

  </div>

  </div>

  Specifies the context to return the configuration for.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[PanelOptions](#type-PanelOptions)\>

  </div>

  </div>

  Returns a Promise which resolves with the active panel configuration.

</div>

<div>

<div class="notranslate">

### getPanelBehavior()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.sidePanel.getPanelBehavior(): Promise<PanelBehavior>
```

Returns the extension's current side panel behavior.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[PanelBehavior](#type-PanelBehavior)\>

  </div>

  </div>

  Returns a Promise which resolves with the extension's side panel behavior.

</div>

<div>

<div class="notranslate">

### open()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 116+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.sidePanel.open(
  options: OpenOptions,
): Promise<void>
```

Opens the side panel for the extension. This may only be called in response to a user action.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-open-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [OpenOptions](#type-OpenOptions)

  </div>

  </div>

  Specifies the context in which to open the side panel.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Returns a Promise which resolves when the side panel has been opened.

</div>

<div>

<div class="notranslate">

### setOptions()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.sidePanel.setOptions(
  options: PanelOptions,
): Promise<void>
```

Configures the side panel.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setOptions-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [PanelOptions](#type-PanelOptions)

  </div>

  </div>

  The configuration options to apply to the panel.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Returns a Promise which resolves when the options have been set.

</div>

<div>

<div class="notranslate">

### setPanelBehavior()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.sidePanel.setPanelBehavior(
  behavior: PanelBehavior,
): Promise<void>
```

Configures the extension's side panel behavior. This is an upsert operation.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setPanelBehavior-behavior" class="dcc-code-sections__label">

  behavior

  </div>

  <div class="dcc-type--xsmall">

  [PanelBehavior](#type-PanelBehavior)

  </div>

  </div>

  The new behavior to be set.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Returns a Promise which resolves when the new behavior has been set.

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onClosed

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 142+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.sidePanel.onClosed.addListener(
  callback: function,
)
```

Fired when the extension's side panel is closed.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onClosed-callback" class="dcc-code-sections__label">

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
  (info: PanelClosedInfo) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onClosed-callback-info" class="dcc-code-sections__label">

    info

    </div>

    <div class="dcc-type--xsmall">

    [PanelClosedInfo](#type-PanelClosedInfo)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onOpened

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 141+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.sidePanel.onOpened.addListener(
  callback: function,
)
```

Fired when the extension's side panel is opened.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onOpened-callback" class="dcc-code-sections__label">

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
  (info: PanelOpenedInfo) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onOpened-callback-info" class="dcc-code-sections__label">

    info

    </div>

    <div class="dcc-type--xsmall">

    [PanelOpenedInfo](#type-PanelOpenedInfo)

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

Last updated 2026-01-19 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-01-19 UTC."\],\[\],\[\]\]

</div>

</div>