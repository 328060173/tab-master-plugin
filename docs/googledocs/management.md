> 来源: https://developer.chrome.com/docs/extensions/reference/api/management
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

# chrome.management <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

The `chrome.management` API provides ways to manage installed apps and extensions.

</div>

## Permissions

<div class="dcc-reference">

`management`\

</div>

You must declare the "management" permission in the [extension manifest](/docs/extensions/reference/manifest) to use the management API. For example:

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "permissions": [
    "management"
  ],
  ...
}
```

[`management.getPermissionWarningsByManifest()`](#method-getPermissionWarningsByManifest), [`management.uninstallSelf()`](#method-uninstallSelf), and [`management.getSelf()`](#method-getSelf) do not require the management permission.

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### ExtensionDisabledReason

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

A reason the item is disabled.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"unknown"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"permissions_increase"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### ExtensionInfo

</div>

Information about an installed extension, app, or theme.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ExtensionInfo-appLaunchUrl" class="dcc-code-sections__label">

  appLaunchUrl

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The launch url (only present for apps).

- <div>

  <div id="property-ExtensionInfo-availableLaunchTypes" class="dcc-code-sections__label">

  availableLaunchTypes

  </div>

  <div class="dcc-type--xsmall">

  [LaunchType](#type-LaunchType)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The currently available launch types (only present for apps).

- <div>

  <div id="property-ExtensionInfo-description" class="dcc-code-sections__label">

  description

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The description of this extension, app, or theme.

- <div>

  <div id="property-ExtensionInfo-disabledReason" class="dcc-code-sections__label">

  disabledReason

  </div>

  <div class="dcc-type--xsmall">

  [ExtensionDisabledReason](#type-ExtensionDisabledReason) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  A reason the item is disabled.

- <div>

  <div id="property-ExtensionInfo-enabled" class="dcc-code-sections__label">

  enabled

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether it is currently enabled or disabled.

- <div>

  <div id="property-ExtensionInfo-homepageUrl" class="dcc-code-sections__label">

  homepageUrl

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The URL of the homepage of this extension, app, or theme.

- <div>

  <div id="property-ExtensionInfo-hostPermissions" class="dcc-code-sections__label">

  hostPermissions

  </div>

  <div class="dcc-type--xsmall">

  string\[\]

  </div>

  </div>

  Returns a list of host based permissions.

- <div>

  <div id="property-ExtensionInfo-icons" class="dcc-code-sections__label">

  icons

  </div>

  <div class="dcc-type--xsmall">

  [IconInfo](#type-IconInfo)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  A list of icon information. Note that this just reflects what was declared in the manifest, and the actual image at that url may be larger or smaller than what was declared, so you might consider using explicit width and height attributes on img tags referencing these images. See the [manifest documentation on icons](https://developer.chrome.com/docs/extensions/reference/manifest/icons) for more details.

- <div>

  <div id="property-ExtensionInfo-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The extension's unique identifier.

- <div>

  <div id="property-ExtensionInfo-installType" class="dcc-code-sections__label">

  installType

  </div>

  <div class="dcc-type--xsmall">

  [ExtensionInstallType](#type-ExtensionInstallType)

  </div>

  </div>

  How the extension was installed.

- <div>

  <div id="property-ExtensionInfo-isApp" class="dcc-code-sections__label">

  isApp

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated</span>

  </div>

  </div>

  Please use [`management.ExtensionInfo.type`](#property-ExtensionInfo-type).

  True if this is an app.

- <div>

  <div id="property-ExtensionInfo-launchType" class="dcc-code-sections__label">

  launchType

  </div>

  <div class="dcc-type--xsmall">

  [LaunchType](#type-LaunchType) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The app launch type (only present for apps).

- <div>

  <div id="property-ExtensionInfo-mayDisable" class="dcc-code-sections__label">

  mayDisable

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether this extension can be disabled or uninstalled by the user.

- <div>

  <div id="property-ExtensionInfo-mayEnable" class="dcc-code-sections__label">

  mayEnable

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 62+ </span>

  </div>

  </div>

  Whether this extension can be enabled by the user. This is only returned for extensions which are not enabled.

- <div>

  <div id="property-ExtensionInfo-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The name of this extension, app, or theme.

- <div>

  <div id="property-ExtensionInfo-offlineEnabled" class="dcc-code-sections__label">

  offlineEnabled

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the extension, app, or theme declares that it supports offline.

- <div>

  <div id="property-ExtensionInfo-optionsUrl" class="dcc-code-sections__label">

  optionsUrl

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The url for the item's options page, if it has one.

- <div>

  <div id="property-ExtensionInfo-permissions" class="dcc-code-sections__label">

  permissions

  </div>

  <div class="dcc-type--xsmall">

  string\[\]

  </div>

  </div>

  Returns a list of API based permissions.

- <div>

  <div id="property-ExtensionInfo-shortName" class="dcc-code-sections__label">

  shortName

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  A short version of the name of this extension, app, or theme.

- <div>

  <div id="property-ExtensionInfo-type" class="dcc-code-sections__label">

  type

  </div>

  <div class="dcc-type--xsmall">

  [ExtensionType](#type-ExtensionType)

  </div>

  </div>

  The type of this extension, app, or theme.

- <div>

  <div id="property-ExtensionInfo-updateUrl" class="dcc-code-sections__label">

  updateUrl

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The update URL of this extension, app, or theme.

- <div>

  <div id="property-ExtensionInfo-version" class="dcc-code-sections__label">

  version

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The [version](https://developer.chrome.com/docs/extensions/reference/manifest/version) of this extension, app, or theme.

- <div>

  <div id="property-ExtensionInfo-versionName" class="dcc-code-sections__label">

  versionName

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 50+ </span>

  </div>

  </div>

  The [version name](https://developer.chrome.com/docs/extensions/reference/manifest/version#version_name) of this extension, app, or theme if the manifest specified one.

</div>

<div>

<div class="notranslate">

### ExtensionInstallType

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

How the extension was installed. One of `admin`: The extension was installed because of an administrative policy, `development`: The extension was loaded unpacked in developer mode, `normal`: The extension was installed normally via a .crx file, `sideload`: The extension was installed by other software on the machine, `other`: The extension was installed by other means.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"admin"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"development"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"normal"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"sideload"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"other"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### ExtensionType

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

The type of this extension, app, or theme.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"extension"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"hosted_app"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"packaged_app"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"legacy_packaged_app"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"theme"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"login_screen_extension"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### IconInfo

</div>

Information about an icon belonging to an extension, app, or theme.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-IconInfo-size" class="dcc-code-sections__label">

  size

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  A number representing the width and height of the icon. Likely values include (but are not limited to) 128, 48, 24, and 16.

- <div>

  <div id="property-IconInfo-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The URL for this icon image. To display a grayscale version of the icon (to indicate that an extension is disabled, for example), append `?grayscale=true` to the URL.

</div>

<div>

<div class="notranslate">

### LaunchType

</div>

These are all possible app launch types.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"OPEN_AS_REGULAR_TAB"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"OPEN_AS_PINNED_TAB"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"OPEN_AS_WINDOW"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"OPEN_FULL_SCREEN"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### UninstallOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

</div>

</div>

Options for how to handle the extension's uninstallation.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-UninstallOptions-showConfirmDialog" class="dcc-code-sections__label">

  showConfirmDialog

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether or not a confirm-uninstall dialog should prompt the user. Defaults to false for self uninstalls. If an extension uninstalls another extension, this parameter is ignored and the dialog is always shown.

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### createAppShortcut()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.createAppShortcut(
  id: string,
): Promise<void>
```

Display options to create shortcuts for an app. On Mac, only packaged app shortcuts can be created.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-createAppShortcut-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  This should be the id from an app item of [`management.ExtensionInfo`](#type-ExtensionInfo).

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

### generateAppForLink()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.generateAppForLink(
  url: string,
  title: string,
): Promise<ExtensionInfo>
```

Generate an app for a URL. Returns the generated bookmark app.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-generateAppForLink-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The URL of a web page. The scheme of the URL can only be "http" or "https".

- <div>

  <div id="type-generateAppForLink-title" class="dcc-code-sections__label">

  title

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The title of the generated app.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[ExtensionInfo](#type-ExtensionInfo)\>

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
chrome.management.get(
  id: string,
): Promise<ExtensionInfo>
```

Returns information about the installed extension, app, or theme that has the given ID.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-get-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The ID from an item of [`management.ExtensionInfo`](#type-ExtensionInfo).

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[ExtensionInfo](#type-ExtensionInfo)\>

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
chrome.management.getAll(): Promise<ExtensionInfo[]>
```

Returns a list of information about installed extensions and apps.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[ExtensionInfo](#type-ExtensionInfo)\[\]\>

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

### getPermissionWarningsById()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.getPermissionWarningsById(
  id: string,
): Promise<string[]>
```

Returns a list of [permission warnings](https://developer.chrome.com/extensions/develop/concepts/permission-warnings) for the given extension id.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getPermissionWarningsById-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The ID of an already installed extension.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<string\[\]\>

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

### getPermissionWarningsByManifest()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.getPermissionWarningsByManifest(
  manifestStr: string,
): Promise<string[]>
```

Returns a list of [permission warnings](https://developer.chrome.com/extensions/develop/concepts/permission-warnings) for the given extension manifest string. Note: This function can be used without requesting the 'management' permission in the manifest.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getPermissionWarningsByManifest-manifestStr" class="dcc-code-sections__label">

  manifestStr

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Extension manifest JSON string.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<string\[\]\>

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

### getSelf()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.getSelf(): Promise<ExtensionInfo>
```

Returns information about the calling extension, app, or theme. Note: This function can be used without requesting the 'management' permission in the manifest.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[ExtensionInfo](#type-ExtensionInfo)\>

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

### installReplacementWebApp()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 77+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.installReplacementWebApp(): Promise<void>
```

Launches the replacement_web_app specified in the manifest. Prompts the user to install if not already installed.

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

### launchApp()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.launchApp(
  id: string,
): Promise<void>
```

Launches an application.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-launchApp-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The extension id of the application.

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

### setEnabled()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.setEnabled(
  id: string,
  enabled: boolean,
): Promise<void>
```

Enables or disables an app or extension. In most cases this function must be called in the context of a user gesture (e.g. an onclick handler for a button), and may present the user with a native confirmation UI as a way of preventing abuse.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setEnabled-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  This should be the id from an item of [`management.ExtensionInfo`](#type-ExtensionInfo).

- <div>

  <div id="type-setEnabled-enabled" class="dcc-code-sections__label">

  enabled

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether this item should be enabled or disabled.

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

### setLaunchType()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.setLaunchType(
  id: string,
  launchType: LaunchType,
): Promise<void>
```

Set the launch type of an app.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setLaunchType-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  This should be the id from an app item of [`management.ExtensionInfo`](#type-ExtensionInfo).

- <div>

  <div id="type-setLaunchType-launchType" class="dcc-code-sections__label">

  launchType

  </div>

  <div class="dcc-type--xsmall">

  [LaunchType](#type-LaunchType)

  </div>

  </div>

  The target launch type. Always check and make sure this launch type is in [`ExtensionInfo.availableLaunchTypes`](#property-ExtensionInfo-availableLaunchTypes), because the available launch types vary on different platforms and configurations.

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

### uninstall()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.uninstall(
  id: string,
  options?: UninstallOptions,
): Promise<void>
```

Uninstalls a currently installed app or extension. Note: This function does not work in managed environments when the user is not allowed to uninstall the specified extension/app. If the uninstall fails (e.g. the user cancels the dialog) the promise will be rejected or the callback will be called with [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError) set.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-uninstall-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  This should be the id from an item of [`management.ExtensionInfo`](#type-ExtensionInfo).

- <div>

  <div id="type-uninstall-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [UninstallOptions](#type-UninstallOptions) <span class="dcc-code-sections__optional">optional</span>

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

### uninstallSelf()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.uninstallSelf(
  options?: UninstallOptions,
): Promise<void>
```

Uninstalls the calling extension. Note: This function can be used without requesting the 'management' permission in the manifest. This function does not work in managed environments when the user is not allowed to uninstall the specified extension/app.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-uninstallSelf-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [UninstallOptions](#type-UninstallOptions) <span class="dcc-code-sections__optional">optional</span>

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

</div>

## Events

<div>

<div>

<div class="notranslate">

### onDisabled

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.onDisabled.addListener(
  callback: function,
)
```

Fired when an app or extension has been disabled.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onDisabled-callback" class="dcc-code-sections__label">

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
  (info: ExtensionInfo) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onDisabled-callback-info" class="dcc-code-sections__label">

    info

    </div>

    <div class="dcc-type--xsmall">

    [ExtensionInfo](#type-ExtensionInfo)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onEnabled

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.onEnabled.addListener(
  callback: function,
)
```

Fired when an app or extension has been enabled.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onEnabled-callback" class="dcc-code-sections__label">

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
  (info: ExtensionInfo) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onEnabled-callback-info" class="dcc-code-sections__label">

    info

    </div>

    <div class="dcc-type--xsmall">

    [ExtensionInfo](#type-ExtensionInfo)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onInstalled

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.onInstalled.addListener(
  callback: function,
)
```

Fired when an app or extension has been installed.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onInstalled-callback" class="dcc-code-sections__label">

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
  (info: ExtensionInfo) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onInstalled-callback-info" class="dcc-code-sections__label">

    info

    </div>

    <div class="dcc-type--xsmall">

    [ExtensionInfo](#type-ExtensionInfo)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onUninstalled

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.management.onUninstalled.addListener(
  callback: function,
)
```

Fired when an app or extension has been uninstalled.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onUninstalled-callback" class="dcc-code-sections__label">

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
  (id: string) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onUninstalled-callback-id" class="dcc-code-sections__label">

    id

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

Last updated 2025-08-11 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2025-08-11 UTC."\],\[\],\[\]\]

</div>

</div>