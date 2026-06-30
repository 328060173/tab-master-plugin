> 来源: https://developer.chrome.com/docs/extensions/reference/api/userScripts
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

# chrome.userScripts <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `userScripts` API to execute user scripts in the User Scripts context.

</div>

## Permissions

<div class="dcc-reference">

`userScripts`\

</div>

To use the User Scripts API, `chrome.userScripts`, add the `"userScripts"` permission to your manifest.json and `"host_permissions"` for sites you want to run scripts on.

<div>

</div>

``` devsite-click-to-copy
{
  "name": "User script test extension",
  "manifest_version": 3,
  "minimum_chrome_version": "120",
  "permissions": [
    "userScripts"
  ],
  "host_permissions": [
    "*://example.com/*"
  ]
}
```

## Availability

<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 120+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

## Concepts and usage

A user script is a snippet of code injected into a web page to modify its appearance or behavior. Unlike other extension features, such as [Content Scripts](/docs/extensions/develop/concepts/content-scripts) and the [`chrome.scripting` API](/docs/extensions/reference/api/scripting), the User Scripts API lets you run arbitrary code. This API is required for extensions that run scripts provided by the user that cannot be shipped as part of your extension package.

### Enable usage of the userScripts API

After your extension receives the permission to use the userScripts API, users must enable a specific toggle to allow your extension to use the API. The specific toggle required, and the API's behavior when disabled, vary by Chrome version.

Use the following check to determine which toggle the user needs to enable, for example, during new user onboarding:

<div>

</div>

``` devsite-click-to-copy
let version = Number(navigator.userAgent.match(/(Chrome|Chromium)\/([0-9]+)/)?.[2]);
if (version >= 138) {
  // Allow User Scripts toggle will be used.
} else {
  // Developer mode toggle will be used.
}
```

The following sections describe the different toggles and how to enable them.

#### Chrome versions prior to 138 (Developer mode toggle)

As an extension developer, you already have Developer mode enabled in your installation of Chrome. Your users must also enable Developer mode.

You can copy and paste the following instructions into your extension's documentation for your users

1.  Go to the Extensions page by entering `chrome://extensions` in a new tab. (By design `chrome://` URLs are not linkable.)
2.  Enable Developer Mode by clicking the toggle switch next to **Developer mode**.
    <figure>
    <img src="/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214.png" srcset="https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214_36.png 36w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214_48.png 48w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214_72.png 72w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214_96.png 96w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214_480.png 480w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214_720.png 720w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214_856.png 856w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214_960.png 960w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214_1440.png 1440w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214_1920.png 1920w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/extensions-page-324e88e82e214_2880.png 2880w" sizes="(max-width: 840px) 100vw, 856px" width="400" height="183" alt="The Chrome Extensions page with Developer mode toggle highlighted" />
    <figcaption>Extensions page (chrome://extensions)</figcaption>
    </figure>

<div class="aside note">

**Note:** If Developer mode is not enabled, accessing `chrome.userScripts` shows an error. You can use this error to determine API availability, see [Check for API availability](#check-for-api-availability).

</div>

#### Chrome versions 138 and newer (Allow User Scripts toggle)

The **Allow User Scripts** toggle is on each extension's details page (for example, chrome://extensions/?id=YOUR_EXTENSION_ID).

You can copy and paste the following instructions into your extension's documentation for your users:

1.  Go to the Extensions page by entering `chrome://extensions` in a new tab. (By design `chrome://` URLs are not linkable.)
2.  Click the "Details" button on the extension card to view detailed information about the extension.
3.  Click the toggle switch next to **Allow User Scripts**.

<figure>
<img src="/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle.png" srcset="https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle_36.png 36w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle_48.png 48w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle_72.png 72w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle_96.png 96w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle_480.png 480w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle_720.png 720w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle_856.png 856w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle_960.png 960w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle_1440.png 1440w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle_1920.png 1920w,https://developer.chrome.com/static/docs/extensions/reference/api/userScripts/image/allow-user-scripts-toggle_2880.png 2880w" sizes="(max-width: 840px) 100vw, 856px" width="1310" height="178" alt="The Allow User Scripts toggle on the extension details page" />
<figcaption>Allow User Scripts toggle (chrome://extensions/?id=abc...)</figcaption>
</figure>

<div class="aside note">

**Note:** If the **Allow User Scripts** toggle is not enabled, `chrome.userScripts` is undefined. This undefined state (similar to how other APIs behave) only resets when an extension script context reloads. For example, if a user revokes access while your service worker is running, `chrome.userScripts` remains defined. However, in this scenario, attempting to call any of its methods throws an error.

</div>

### Check for API availability

We recommend the following check to determine if the userScripts API is enabled, as it works in all Chrome versions. This check attempts to call a `chrome.userScripts()` method that should always succeed when the API is available. If this call throws an error, the API is not available:

<div>

</div>

``` devsite-click-to-copy
function isUserScriptsAvailable() {
  try {
    // Method call which throws if API permission or toggle is not enabled.
    chrome.userScripts.getScripts();
    return true;
  } catch {
    // Not available.
    return false;
  }
}
```

### Work in isolated worlds

Both user and content scripts can run in an isolated world or in the main world. An isolated world is an execution environment that isn't accessible to a host page or other extensions. This lets a user script change its JavaScript environment without affecting the host page or other extensions' user and content scripts. Conversely, user scripts (and content scripts) are not visible to the host page or the user and content scripts of other extensions. Scripts running in the main world are accessible to host pages and other extensions and are visible to host pages and to other extensions. To select the world, pass `"USER_SCRIPT"` or `"MAIN"` when calling [`userScripts.register()`](#method-register).

To configure a [content security policy](https://developer.mozilla.org/docs/Web/HTTP/CSP) for the `USER_SCRIPT` world, call `userScripts.configureWorld()`:

<div>

</div>

``` devsite-click-to-copy
chrome.userScripts.configureWorld({
  csp: "script-src 'self'"
});
```

### Messaging

Like content scripts and offscreen documents, user scripts communicate with other parts of an extension using [messaging](/docs/extensions/mv3/messaging) (meaning they can call `runtime.sendMessage()` and `runtime.connect()` as any other part of an extension would). However, they're received using dedicated event handlers (meaning, they don't use `onMessage` or `onConnect`). These handlers are called [`runtime.onUserScriptMessage`](/docs/extensions/reference/api/runtime#event-onUserScriptMessage) and [`runtime.onUserScriptConnect`](/docs/extensions/reference/api/runtime#event-onUserScriptConnect). Dedicated handlers make it easier to identify messages from user scripts, which are a less-trusted context.

Before sending a message, you must call [`configureWorld()`](#method-configureWorld) with the `messaging` argument set to `true`. Note that both the `csp` and `messaging` arguments can be passed at the same time.

<div>

</div>

``` devsite-click-to-copy
chrome.userScripts.configureWorld({
  messaging: true
});
```

### Extension updates

User scripts are cleared when an extension updates. You can add them back by running code in the [`runtime.onInstalled`](/docs/extensions/reference/runtime#event-onInstalled) event handler in the extension service worker. Respond only to the [`"update"` reason](/docs/extensions/reference/api/runtime#type-OnInstalledReason:%7E:text=as%20an%20installation.-,%22update%22,-Specifies%20the%20event) passed to the event callback.

## Example

This example is from the [userScript sample](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/userScripts) in our samples repository.

### Register a script

The following example shows a basic call to `register()`. The first argument is an array of objects defining the scripts to be registered. There are more options than are shown here.

<div>

</div>

``` devsite-click-to-copy
chrome.userScripts.register([{
  id: 'test',
  matches: ['*://*/*'],
  js: [{code: 'alert("Hi!")'}]
}]);
```

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### ExecutionWorld

</div>

The JavaScript world for a user script to execute within.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"MAIN"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the execution environment of the DOM, which is the execution environment shared with the host page's JavaScript.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"USER_SCRIPT"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the execution environment that is specific to user scripts and is exempt from the page's CSP.</span>

</div>

</div>

<div>

<div class="notranslate">

### InjectionResult

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 135+ </span>

</div>

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

  The document associated with the injection.

- <div>

  <div id="property-InjectionResult-error" class="dcc-code-sections__label">

  error

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The error, if any. `error` and `result` are mutually exclusive.

- <div>

  <div id="property-InjectionResult-frameId" class="dcc-code-sections__label">

  frameId

  </div>

  <div class="dcc-type--xsmall">

  number

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

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 135+ </span>

</div>

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

  The IDs of specific documentIds to inject into. This must not be set if `frameIds` is set.

- <div>

  <div id="property-InjectionTarget-frameIds" class="dcc-code-sections__label">

  frameIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The IDs of specific frames to inject into.

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

### RegisteredUserScript

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-RegisteredUserScript-allFrames" class="dcc-code-sections__label">

  allFrames

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If true, it will inject into all frames, even if the frame is not the top-most frame in the tab. Each frame is checked independently for URL requirements; it will not inject into child frames if the URL requirements are not met. Defaults to false, meaning that only the top frame is matched.

- <div>

  <div id="property-RegisteredUserScript-excludeGlobs" class="dcc-code-sections__label">

  excludeGlobs

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies wildcard patterns for pages this user script will NOT be injected into.

- <div>

  <div id="property-RegisteredUserScript-excludeMatches" class="dcc-code-sections__label">

  excludeMatches

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Excludes pages that this user script would otherwise be injected into. See [Match Patterns](https://developer.chrome.com/extensions/develop/concepts/match-patterns) for more details on the syntax of these strings.

- <div>

  <div id="property-RegisteredUserScript-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The ID of the user script specified in the API call. This property must not start with a '\_' as it's reserved as a prefix for generated script IDs.

- <div>

  <div id="property-RegisteredUserScript-includeGlobs" class="dcc-code-sections__label">

  includeGlobs

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies wildcard patterns for pages this user script will be injected into.

- <div>

  <div id="property-RegisteredUserScript-js" class="dcc-code-sections__label">

  js

  </div>

  <div class="dcc-type--xsmall">

  [ScriptSource](#type-ScriptSource)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The list of ScriptSource objects defining sources of scripts to be injected into matching pages. This property must be specified for \${ref:register}, and when specified it must be a non-empty array.

- <div>

  <div id="property-RegisteredUserScript-matches" class="dcc-code-sections__label">

  matches

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies which pages this user script will be injected into. See [Match Patterns](https://developer.chrome.com/extensions/develop/concepts/match-patterns) for more details on the syntax of these strings. This property must be specified for \${ref:register}.

- <div>

  <div id="property-RegisteredUserScript-runAt" class="dcc-code-sections__label">

  runAt

  </div>

  <div class="dcc-type--xsmall">

  [RunAt](https://developer.chrome.com/docs/extensions/reference/api/extensionTypes/#type-RunAt) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies when JavaScript files are injected into the web page. The preferred and default value is `document_idle`.

- <div>

  <div id="property-RegisteredUserScript-world" class="dcc-code-sections__label">

  world

  </div>

  <div class="dcc-type--xsmall">

  [ExecutionWorld](#type-ExecutionWorld) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The JavaScript execution environment to run the script in. The default is `` `USER_SCRIPT` ``.

- <div>

  <div id="property-RegisteredUserScript-worldId" class="dcc-code-sections__label">

  worldId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 133+ </span>

  </div>

  </div>

  Specifies the user script world ID to execute in. If omitted, the script will execute in the default user script world. Only valid if `world` is omitted or is `USER_SCRIPT`. Values with leading underscores (`_`) are reserved.

</div>

<div>

<div class="notranslate">

### ScriptSource

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ScriptSource-code" class="dcc-code-sections__label">

  code

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  A string containing the JavaScript code to inject. Exactly one of `file` or `code` must be specified.

- <div>

  <div id="property-ScriptSource-file" class="dcc-code-sections__label">

  file

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The path of the JavaScript file to inject relative to the extension's root directory. Exactly one of `file` or `code` must be specified.

</div>

<div>

<div class="notranslate">

### UserScriptFilter

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-UserScriptFilter-ids" class="dcc-code-sections__label">

  ids

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  [`getScripts`](#method-getScripts) only returns scripts with the IDs specified in this list.

</div>

<div>

<div class="notranslate">

### UserScriptInjection

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 135+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-UserScriptInjection-injectImmediately" class="dcc-code-sections__label">

  injectImmediately

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether the injection should be triggered in the target as soon as possible. Note that this is not a guarantee that injection will occur prior to page load, as the page may have already loaded by the time the script reaches the target.

- <div>

  <div id="property-UserScriptInjection-js" class="dcc-code-sections__label">

  js

  </div>

  <div class="dcc-type--xsmall">

  [ScriptSource](#type-ScriptSource)\[\]

  </div>

  </div>

  The list of ScriptSource objects defining sources of scripts to be injected into the target.

- <div>

  <div id="property-UserScriptInjection-target" class="dcc-code-sections__label">

  target

  </div>

  <div class="dcc-type--xsmall">

  [InjectionTarget](#type-InjectionTarget)

  </div>

  </div>

  Details specifying the target into which to inject the script.

- <div>

  <div id="property-UserScriptInjection-world" class="dcc-code-sections__label">

  world

  </div>

  <div class="dcc-type--xsmall">

  [ExecutionWorld](#type-ExecutionWorld) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The JavaScript "world" to run the script in. The default is `USER_SCRIPT`.

- <div>

  <div id="property-UserScriptInjection-worldId" class="dcc-code-sections__label">

  worldId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies the user script world ID to execute in. If omitted, the script will execute in the default user script world. Only valid if `world` is omitted or is `USER_SCRIPT`. Values with leading underscores (`_`) are reserved.

</div>

<div>

<div class="notranslate">

### WorldProperties

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-WorldProperties-csp" class="dcc-code-sections__label">

  csp

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies the world csp. The default is the `` `ISOLATED` `` world csp.

- <div>

  <div id="property-WorldProperties-messaging" class="dcc-code-sections__label">

  messaging

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies whether messaging APIs are exposed. The default is `false`.

- <div>

  <div id="property-WorldProperties-worldId" class="dcc-code-sections__label">

  worldId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 133+ </span>

  </div>

  </div>

  Specifies the ID of the specific user script world to update. If not provided, updates the properties of the default user script world. Values with leading underscores (`_`) are reserved.

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### configureWorld()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.userScripts.configureWorld(
  properties: WorldProperties,
): Promise<void>
```

Configures the `` `USER_SCRIPT` `` execution environment.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-configureWorld-properties" class="dcc-code-sections__label">

  properties

  </div>

  <div class="dcc-type--xsmall">

  [WorldProperties](#type-WorldProperties)

  </div>

  </div>

  Contains the user script world configuration.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Promise that resolves once the world has been configured.

</div>

<div>

<div class="notranslate">

### execute()

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
chrome.userScripts.execute(
  injection: UserScriptInjection,
): Promise<InjectionResult[]>
```

Injects a script into a target context. By default, the script will be run at `document_idle`, or immediately if the page has already loaded. If the `injectImmediately` property is set, the script will inject without waiting, even if the page has not finished loading. If the script evaluates to a promise, the browser will wait for the promise to settle and return the resulting value.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-execute-injection" class="dcc-code-sections__label">

  injection

  </div>

  <div class="dcc-type--xsmall">

  [UserScriptInjection](#type-UserScriptInjection)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[InjectionResult](#type-InjectionResult)\[\]\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getScripts()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.userScripts.getScripts(
  filter?: UserScriptFilter,
): Promise<RegisteredUserScript[]>
```

Returns all dynamically-registered user scripts for this extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getScripts-filter" class="dcc-code-sections__label">

  filter

  </div>

  <div class="dcc-type--xsmall">

  [UserScriptFilter](#type-UserScriptFilter) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified, this method returns only the user scripts that match it.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[RegisteredUserScript](#type-RegisteredUserScript)\[\]\>

  </div>

  </div>

  Promise that resolves with the registered scripts. The promise will be rejected if an error occurs.

</div>

<div>

<div class="notranslate">

### getWorldConfigurations()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 133+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.userScripts.getWorldConfigurations(): Promise<WorldProperties[]>
```

Retrieves all registered world configurations.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[WorldProperties](#type-WorldProperties)\[\]\>

  </div>

  </div>

  Promise that resolves with the registered world configurations.

</div>

<div>

<div class="notranslate">

### register()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.userScripts.register(
  scripts: RegisteredUserScript[],
): Promise<void>
```

Registers one or more user scripts for this extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-register-scripts" class="dcc-code-sections__label">

  scripts

  </div>

  <div class="dcc-type--xsmall">

  [RegisteredUserScript](#type-RegisteredUserScript)\[\]

  </div>

  </div>

  Contains a list of user scripts to be registered.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Promise that resolves once scripts have been fully registered. The promise will be rejected if an error occurs.

</div>

<div>

<div class="notranslate">

### resetWorldConfiguration()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 133+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.userScripts.resetWorldConfiguration(
  worldId?: string,
): Promise<void>
```

Resets the configuration for a user script world. Any scripts that inject into the world with the specified ID will use the default world configuration.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-resetWorldConfiguration-worldId" class="dcc-code-sections__label">

  worldId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the user script world to reset. If omitted, resets the default world's configuration.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Promise that resolves when the configuration is reset.

</div>

<div>

<div class="notranslate">

### unregister()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.userScripts.unregister(
  filter?: UserScriptFilter,
): Promise<void>
```

Unregisters all dynamically-registered user scripts for this extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-unregister-filter" class="dcc-code-sections__label">

  filter

  </div>

  <div class="dcc-type--xsmall">

  [UserScriptFilter](#type-UserScriptFilter) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified, this method unregisters only the user scripts that match it.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Promise that resolves once scripts have been fully unregistered. The promise will be rejected if an error occurs.

</div>

<div>

<div class="notranslate">

### update()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.userScripts.update(
  scripts: RegisteredUserScript[],
): Promise<void>
```

Updates one or more user scripts for this extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-update-scripts" class="dcc-code-sections__label">

  scripts

  </div>

  <div class="dcc-type--xsmall">

  [RegisteredUserScript](#type-RegisteredUserScript)\[\]

  </div>

  </div>

  Contains a list of user scripts to be updated. A property is only updated for the existing script if it is specified in this object. If there are errors during script parsing/file validation, or if the IDs specified do not correspond to a fully registered script, then no scripts are updated.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<void\>

  </div>

  </div>

  Promise that resolves once scripts have been fully updated. The promise will be rejected if an error occurs.

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