> 来源: https://developer.chrome.com/docs/extensions/reference/api/action
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

# chrome.action <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.action` API to control the extension's icon in the Google Chrome toolbar.

</div>

The action icons are displayed in the browser toolbar next to the [omnibox](https://en.wiktionary.org/wiki/omnibox). After installation, these appear in the extensions menu (the puzzle piece icon). Users can pin your extension icon to the toolbar.

## Availability

<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

## Manifest

<div class="dcc-reference">

The following keys must be declared [in the manifest](/docs/extensions/mv3/manifest) to use this API.

`"action"`\

</div>

To use the `chrome.action` API, specify a `"manifest_version"` of `3` and include the `"action"` key in your [manifest file](/docs/extensions/reference/manifest).

<div class="aside note">

**Note:** Every extension has an icon in the Chrome toolbar, even if the `"action"` key isn't added to the manifest.

</div>

<div>

</div>

``` devsite-click-to-copy
{
  "name": "Action Extension",
  ...
  "action": {
    "default_icon": {              // optional
      "16": "images/icon16.png",   // optional
      "24": "images/icon24.png",   // optional
      "32": "images/icon32.png"    // optional
    },
    "default_title": "Click Me",   // optional, shown in tooltip
    "default_popup": "popup.html"  // optional
  },
  ...
}
```

The `"action"` key (along with its children) is optional. When it isn't included, your extension is still shown in the toolbar to provide access to the extension's menu. For this reason, we recommend that you always include at least the `"action"` and `"default_icon"` keys.

## Concepts and usage

### Parts of the UI

#### Icon

The icon is the main image on the toolbar for your extension, and is set by the `"default_icon"` key in your manifest's `"action"` key. Icons must be 16 device-independent pixels (DIPs) wide and tall.

The `"default_icon"` key is a dictionary of sizes to image paths. Chrome uses these icons to choose which image scale to use. If an exact match is not found, Chrome selects the closest available and scales it to fit the image, which might affect image quality.

Because devices with less-common scale factors like 1.5x or 1.2x are becoming more common, we encourage you to provide multiple sizes for your icons. This also futureproofs your extension against potential icon display size changes. However, if only providing a single size, the `"default_icon"` key can also be set to a string with the path to a single icon instead of a dictionary.

You can also call `action.setIcon()` to set your extension's icon programmatically by specifying a different image path or providing a dynamically-generated icon using the [HTML canvas element](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement), or, if setting from an extension service worker, the [offscreen canvas](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas) API.

<div>

</div>

``` devsite-click-to-copy
const canvas = new OffscreenCanvas(16, 16);
const context = canvas.getContext('2d');
context.clearRect(0, 0, 16, 16);
context.fillStyle = '#00FF00';  // Green
context.fillRect(0, 0, 16, 16);
const imageData = context.getImageData(0, 0, 16, 16);
chrome.action.setIcon({imageData: imageData}, () => { /* ... */ });
```

<div class="aside note">

**Note:** The `action.setIcon()` API is intended to set a static image. Don't use animated images for your icons.

</div>

For packed extensions (installed from a .crx file), images can be in most formats that the Blink rendering engine can display, including PNG, JPEG, BMP, ICO, and others. SVG isn't supported. Unpacked extensions must use PNG images.

#### Tooltip (title)

The tooltip, or title, appears when the user holds their mouse pointer over the extension's icon in the toolbar. It's also included in the accessible text spoken by screen readers when the button gets focus.

The default tooltip is set using the `"default_title"` field of the `"action"` key in `manifest.json`. You can also set it programmatically by calling `action.setTitle()`.

#### Badge

Actions can optionally display a "badge" — a bit of text layered over the icon. This lets you update the action to display a small amount of information about the state of the extension, such as a counter. The badge has a text component and a background color. Because space is limited, we recommend that badge text use four or fewer characters.

To create a badge, set it programmatically by calling `action.setBadgeBackgroundColor()` and `action.setBadgeText()`. There isn't a default badge setting in the manifest. Badge color values can be either an array of four integers between 0 and 255 that make up the RGBA color of the badge or a string with a [CSS color](https://developer.mozilla.org/docs/Web/CSS/color) value.

<div>

</div>

``` devsite-click-to-copy
chrome.action.setBadgeBackgroundColor(
  {color: [0, 255, 0, 0]},  // Green
  () => { /* ... */ },
);

chrome.action.setBadgeBackgroundColor(
  {color: '#00FF00'},  // Also green
  () => { /* ... */ },
);

chrome.action.setBadgeBackgroundColor(
  {color: 'green'},  // Also, also green
  () => { /* ... */ },
);
```

#### Popup

An action's popup is shown when the user clicks on the extension's action button in the toolbar. The popup can contain any HTML contents you like, and will be automatically sized to fit its contents. The popup's size must be between 25x25 and 800x600 pixels.

The popup is initially set by the `"default_popup"` property in the `"action"` key in the `manifest.json` file. If present, this property should point to a relative path within the extension directory. It can also be updated dynamically to point to a different relative path using the `action.setPopup()` method.

<div class="aside note">

**Note:** The `action.onClicked` event won't be sent if the extension action has specified a popup to show on click of the current tab.

</div>

## Use cases

### Per-tab state

Extension actions can have different states for each tab. To set a value for an individual tab, use the `tabId` property in the `action` API's setting methods. For example, to set the badge text for a specific tab, do something like the following:

<div>

</div>

``` devsite-click-to-copy
function getTabId() { /* ... */}
function getTabBadge() { /* ... */}

chrome.action.setBadgeText(
  {
    text: getTabBadge(tabId),
    tabId: getTabId(),
  },
  () => { ... }
);
```

If the `tabId` property is left out, the setting is treated as a global setting. Tab-specific settings take priority over global settings.

### Enabled state

By default, toolbar actions are enabled (clickable) on every tab. You can change this default by setting the `default_state` property in the `action` key of the manifest. If `default_state` is set to `"disabled"`, the action is disabled by default and must be enabled programmatically to be clickable. If `default_state` is set to `"enabled"` (the default), the action is enabled and clickable by default.

You can control the state programmatically using the `action.enable()` and `action.disable()` methods. This only affects whether the popup (if any) or `action.onClicked` event is sent to your extension; it doesn't affect the action's presence in the toolbar.

## Examples

The following examples show some common ways that actions are used in extensions. To try this API, install the [Action API example](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/action) from the [chrome-extension-samples](https://github.com/GoogleChrome/chrome-extensions-samples) repository.

### Show a popup

It's common for an extension to display a popup when the user clicks the extension's action. To implement this in your own extension, declare the popup in your `manifest.json` and specify the content that Chrome should display in the popup.

<div>

</div>

``` devsite-click-to-copy
// manifest.json
{
  "name": "Action popup demo",
  "version": "1.0",
  "manifest_version": 3,
  "action": {
    "default_title": "Click to view a popup",
    "default_popup": "popup.html"
  }
}
```

<div>

</div>

``` devsite-click-to-copy
<!-- popup.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    html {
      min-height: 5em;
      min-width: 10em;
      background: salmon;
    }
  </style>
</head>
<body>
  <p>Hello, world!</p>
</body>
</html>
```

### Inject a content script on click

A common pattern for extensions is to expose their primary feature using the extension's action. The following example demonstrates this pattern. When the user clicks the action, the extension injects a content script into the current page. The content script then displays an alert to verify that everything worked as expected.

<div>

</div>

``` devsite-click-to-copy
// manifest.json
{
  "name": "Action script injection demo",
  "version": "1.0",
  "manifest_version": 3,
  "action": {
    "default_title": "Click to show an alert"
  },
  "permissions": ["activeTab", "scripting"],
  "background": {
    "service_worker": "background.js"
  }
}
```

<div>

</div>

``` devsite-click-to-copy
// background.js
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['content.js']
  });
});
```

<div>

</div>

``` devsite-click-to-copy
// content.js
alert('Hello, world!');
```

### Emulate actions with declarativeContent

This example shows how an extension's background logic can (a) disable an action by default and (b) use [declarativeContent](/docs/extensions/reference/api/declarativeContent) to enable the action on specific sites.

<div>

</div>

``` devsite-click-to-copy
// service-worker.js

// Wrap in an onInstalled callback to avoid unnecessary work
// every time the service worker is run
chrome.runtime.onInstalled.addListener(() => {
  // Page actions are disabled by default and enabled on select tabs
  chrome.action.disable();

  // Clear all rules to ensure only our expected rules are set
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    // Declare a rule to enable the action on example.com pages
    let exampleRule = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostSuffix: '.example.com'},
        })
      ],
      actions: [new chrome.declarativeContent.ShowAction()],
    };

    // Finally, apply our new array of rules
    let rules = [exampleRule];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});
```

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### OpenPopupOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 99+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-OpenPopupOptions-windowId" class="dcc-code-sections__label">

  windowId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the window to open the action popup in. Defaults to the currently-active window if unspecified.

</div>

<div>

<div class="notranslate">

### TabDetails

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-TabDetails-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab to query state for. If no tab is specified, the non-tab-specific state is returned.

</div>

<div>

<div class="notranslate">

### UserSettings

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

</div>

</div>

The collection of user-specified settings relating to an extension's action.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-UserSettings-isOnToolbar" class="dcc-code-sections__label">

  isOnToolbar

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the extension's action icon is visible on browser windows' top-level toolbar (i.e., whether the extension has been 'pinned' by the user).

</div>

<div>

<div class="notranslate">

### UserSettingsChange

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 130+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-UserSettingsChange-isOnToolbar" class="dcc-code-sections__label">

  isOnToolbar

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether the extension's action icon is visible on browser windows' top-level toolbar (i.e., whether the extension has been 'pinned' by the user).

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### disable()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.disable(
  tabId?: number,
): Promise<void>
```

Disables the action for a tab.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-disable-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab for which you want to modify the action.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### enable()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.enable(
  tabId?: number,
): Promise<void>
```

Enables the action for a tab. By default, actions are enabled.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-enable-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab for which you want to modify the action.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getBadgeBackgroundColor()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.getBadgeBackgroundColor(
  details: TabDetails,
): Promise<extensionTypes.ColorArray>
```

Gets the background color of the action.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getBadgeBackgroundColor-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  [TabDetails](#type-TabDetails)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[extensionTypes.ColorArray](https://developer.chrome.com/docs/extensions/reference/extensionTypes/#type-ColorArray)\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getBadgeText()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.getBadgeText(
  details: TabDetails,
): Promise<string>
```

Gets the badge text of the action. If no tab is specified, the non-tab-specific badge text is returned. If [displayActionCountAsBadgeText](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#setExtensionActionOptions) is enabled, a placeholder text will be returned unless the [declarativeNetRequestFeedback](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions#declarativeNetRequestFeedback) permission is present or tab-specific badge text was provided.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getBadgeText-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  [TabDetails](#type-TabDetails)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<string\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getBadgeTextColor()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 110+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.getBadgeTextColor(
  details: TabDetails,
): Promise<extensionTypes.ColorArray>
```

Gets the text color of the action.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getBadgeTextColor-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  [TabDetails](#type-TabDetails)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[extensionTypes.ColorArray](https://developer.chrome.com/docs/extensions/reference/extensionTypes/#type-ColorArray)\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getPopup()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.getPopup(
  details: TabDetails,
): Promise<string>
```

Gets the html document set as the popup for this action.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getPopup-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  [TabDetails](#type-TabDetails)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<string\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getTitle()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.getTitle(
  details: TabDetails,
): Promise<string>
```

Gets the title of the action.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getTitle-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  [TabDetails](#type-TabDetails)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<string\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getUserSettings()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.getUserSettings(): Promise<UserSettings>
```

Returns the user-specified settings relating to an extension's action.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[UserSettings](#type-UserSettings)\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### isEnabled()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 110+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.isEnabled(
  tabId?: number,
): Promise<boolean>
```

Indicates whether the extension action is enabled for a tab (or globally if no `tabId` is provided). Actions enabled using only [`declarativeContent`](https://developer.chrome.com/docs/extensions/reference/declarativeContent/) always return false.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-isEnabled-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab for which you want check enabled status.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<boolean\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### openPopup()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 127+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.openPopup(
  options?: OpenPopupOptions,
): Promise<void>
```

Opens the extension's popup. Between Chrome 118 and Chrome 126, this is only available to policy installed extensions.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-openPopup-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [OpenPopupOptions](#type-OpenPopupOptions) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies options for opening the popup.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### setBadgeBackgroundColor()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.setBadgeBackgroundColor(
  details: object,
): Promise<void>
```

Sets the background color for the badge.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setBadgeBackgroundColor-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-setBadgeBackgroundColor-details-color" class="dcc-code-sections__label">

    color

    </div>

    <div class="dcc-type--xsmall">

    string \| [ColorArray](https://developer.chrome.com/docs/extensions/reference/extensionTypes/#type-ColorArray)

    </div>

    </div>

    An array of four integers in the range \[0,255\] that make up the RGBA color of the badge. For example, opaque red is `[255, 0, 0, 255]`. Can also be a string with a CSS value, with opaque red being `#FF0000` or `#F00`.

  - <div>

    <div id="property-setBadgeBackgroundColor-details-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### setBadgeText()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.setBadgeText(
  details: object,
): Promise<void>
```

Sets the badge text for the action. The badge is displayed on top of the icon.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setBadgeText-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-setBadgeText-details-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.

  - <div>

    <div id="property-setBadgeText-details-text" class="dcc-code-sections__label">

    text

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Any number of characters can be passed, but only about four can fit in the space. If an empty string (`''`) is passed, the badge text is cleared. If `tabId` is specified and `text` is null, the text for the specified tab is cleared and defaults to the global badge text.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### setBadgeTextColor()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 110+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.setBadgeTextColor(
  details: object,
): Promise<void>
```

Sets the text color for the badge.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setBadgeTextColor-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-setBadgeTextColor-details-color" class="dcc-code-sections__label">

    color

    </div>

    <div class="dcc-type--xsmall">

    string \| [ColorArray](https://developer.chrome.com/docs/extensions/reference/extensionTypes/#type-ColorArray)

    </div>

    </div>

    An array of four integers in the range \[0,255\] that make up the RGBA color of the badge. For example, opaque red is `[255, 0, 0, 255]`. Can also be a string with a CSS value, with opaque red being `#FF0000` or `#F00`. Not setting this value will cause a color to be automatically chosen that will contrast with the badge's background color so the text will be visible. Colors with alpha values equivalent to 0 will not be set and will return an error.

  - <div>

    <div id="property-setBadgeTextColor-details-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### setIcon()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.setIcon(
  details: object,
): Promise<void>
```

Sets the icon for the action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the **path** or the **imageData** property must be specified.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setIcon-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-setIcon-details-imageData" class="dcc-code-sections__label">

    imageData

    </div>

    <div class="dcc-type--xsmall">

    ImageData \| object <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Either an ImageData object or a dictionary {size -\> ImageData} representing icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` \* n will be selected, where n is the size of the icon in the UI. At least one image must be specified. Note that 'details.imageData = foo' is equivalent to 'details.imageData = {'16': foo}'

  - <div>

    <div id="property-setIcon-details-path" class="dcc-code-sections__label">

    path

    </div>

    <div class="dcc-type--xsmall">

    string \| object <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Either a relative image path or a dictionary {size -\> relative image path} pointing to icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` \* n will be selected, where n is the size of the icon in the UI. At least one image must be specified. Note that 'details.path = foo' is equivalent to 'details.path = {'16': foo}'

  - <div>

    <div id="property-setIcon-details-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.

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

### setPopup()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.setPopup(
  details: object,
): Promise<void>
```

Sets the HTML document to be opened as a popup when the user clicks on the action's icon.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setPopup-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-setPopup-details-popup" class="dcc-code-sections__label">

    popup

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    The relative path to the HTML file to show in a popup. If set to the empty string (`''`), no popup is shown.

  - <div>

    <div id="property-setPopup-details-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### setTitle()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.setTitle(
  details: object,
): Promise<void>
```

Sets the title of the action. This shows up in the tooltip.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setTitle-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-setTitle-details-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.

  - <div>

    <div id="property-setTitle-details-title" class="dcc-code-sections__label">

    title

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    The string the action should display when moused over.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onClicked

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.onClicked.addListener(
  callback: function,
)
```

Fired when an action icon is clicked. This event will not fire if the action has a popup.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onClicked-callback" class="dcc-code-sections__label">

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
  (tab: tabs.Tab) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onClicked-callback-tab" class="dcc-code-sections__label">

    tab

    </div>

    <div class="dcc-type--xsmall">

    [tabs.Tab](https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onUserSettingsChanged

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 130+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.action.onUserSettingsChanged.addListener(
  callback: function,
)
```

Fired when user-specified settings relating to an extension's action change.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onUserSettingsChanged-callback" class="dcc-code-sections__label">

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
  (change: UserSettingsChange) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onUserSettingsChanged-callback-change" class="dcc-code-sections__label">

    change

    </div>

    <div class="dcc-type--xsmall">

    [UserSettingsChange](#type-UserSettingsChange)

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

Last updated 2025-08-11 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2025-08-11 UTC."\],\[\],\[\]\]

</div>

</div>