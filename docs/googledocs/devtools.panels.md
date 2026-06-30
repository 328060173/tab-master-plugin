> 来源: https://developer.chrome.com/docs/extensions/reference/api/devtools/panels
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

# chrome.devtools.panels <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.devtools.panels` API to integrate your extension into Developer Tools window UI: create your own panels, access existing panels, and add sidebars.

</div>

Each extension panel and sidebar is displayed as a separate HTML page. All extension pages displayed in the Developer Tools window have access to all parts of the `chrome.devtools` API, as well as all other extension APIs.

You can use the [`devtools.panels.setOpenResourceHandler`](#method-setOpenResourceHandler) method to install a callback function that handles user requests to open a resource (typically, a click a resource link in the Developer Tools window). At most one of the installed handlers gets called; users can specify (using the Developer Tools Settings dialog) either the default behavior or an extension to handle resource open requests. If an extension calls `setOpenResourceHandler()` multiple times, only the last handler is retained.

See [DevTools APIs summary](/docs/extensions/how-to/devtools/extend-devtools) for general introduction to using Developer Tools APIs.

## Manifest

<div class="dcc-reference">

The following keys must be declared [in the manifest](/docs/extensions/mv3/manifest) to use this API.

`"devtools_page"`\

</div>

## Example

The following code adds a panel contained in `Panel.html`, represented by `FontPicker.png` on the Developer Tools toolbar and labeled as *Font Picker*:

<div>

</div>

``` devsite-click-to-copy
chrome.devtools.panels.create("Font Picker",
                              "FontPicker.png",
                              "Panel.html",
                              function(panel) { ... });
```

The following code adds a sidebar pane contained in `Sidebar.html` and titled *Font Properties* to the Elements panel, then sets its height to `8ex`:

<div>

</div>

``` devsite-click-to-copy
chrome.devtools.panels.elements.createSidebarPane("Font Properties",
  function(sidebar) {
    sidebar.setPage("Sidebar.html");
    sidebar.setHeight("8ex");
  }
);
```

The screenshot illustrates the effect this example would have on Developer Tools window:

<figure>
<img src="/static/docs/extensions/reference/api/devtools/panels/images/devtools-panels.png" class="screenshot" width="686" alt="Extension icon panel on DevTools toolbar" />
<figcaption>Extension icon panel on DevTools toolbar.</figcaption>
</figure>

To try this API, install the [devtools panels API example](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/devtools/panels) from the [chrome-extension-samples](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples) repository.

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### Button

</div>

A button created by the extension.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="event-Button-onClicked" class="dcc-code-sections__label">

  onClicked

  </div>

  <div class="dcc-type--xsmall">

  Event\<functionvoidvoid\>

  </div>

  </div>

  Fired when the button is clicked.

  The `onClicked.addListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-Button-onClicked-callback" class="dcc-code-sections__label">

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

- <div>

  <div id="method-Button-update" class="dcc-code-sections__label">

  update

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Updates the attributes of the button. If some of the arguments are omitted or `null`, the corresponding attributes are not updated.

  The `update` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (iconPath?: string, tooltipText?: string, disabled?: boolean) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-Button-update-iconPath" class="dcc-code-sections__label">

    iconPath

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Path to the new icon of the button.

  - <div>

    <div id="type-Button-update-tooltipText" class="dcc-code-sections__label">

    tooltipText

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Text shown as a tooltip when user hovers the mouse over the button.

  - <div>

    <div id="type-Button-update-disabled" class="dcc-code-sections__label">

    disabled

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the button is disabled.

  </div>

</div>

<div>

<div class="notranslate">

### ElementsPanel

</div>

Represents the Elements panel.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="event-ElementsPanel-onSelectionChanged" class="dcc-code-sections__label">

  onSelectionChanged

  </div>

  <div class="dcc-type--xsmall">

  Event\<functionvoidvoid\>

  </div>

  </div>

  Fired when an object is selected in the panel.

  The `onSelectionChanged.addListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ElementsPanel-onSelectionChanged-callback" class="dcc-code-sections__label">

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

- <div>

  <div id="method-ElementsPanel-createSidebarPane" class="dcc-code-sections__label">

  createSidebarPane

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Creates a pane within panel's sidebar.

  The `createSidebarPane` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (title: string, callback?: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-ElementsPanel-createSidebarPane-title" class="dcc-code-sections__label">

    title

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    Text that is displayed in sidebar caption.

  - <div>

    <div id="method-ElementsPanel-createSidebarPane-callback" class="dcc-code-sections__label">

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
    (result: ExtensionSidebarPane) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-ElementsPanel-createSidebarPane-callback-result" class="dcc-code-sections__label">

      result

      </div>

      <div class="dcc-type--xsmall">

      [ExtensionSidebarPane](#type-ExtensionSidebarPane)

      </div>

      </div>

      An ExtensionSidebarPane object for created sidebar pane.

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### ExtensionPanel

</div>

Represents a panel created by an extension.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="event-ExtensionPanel-onHidden" class="dcc-code-sections__label">

  onHidden

  </div>

  <div class="dcc-type--xsmall">

  Event\<functionvoidvoid\>

  </div>

  </div>

  Fired when the user switches away from the panel.

  The `onHidden.addListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ExtensionPanel-onHidden-callback" class="dcc-code-sections__label">

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

- <div>

  <div id="event-ExtensionPanel-onSearch" class="dcc-code-sections__label">

  onSearch

  </div>

  <div class="dcc-type--xsmall">

  Event\<functionvoidvoid\>

  </div>

  </div>

  Fired upon a search action (start of a new search, search result navigation, or search being canceled).

  The `onSearch.addListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ExtensionPanel-onSearch-callback" class="dcc-code-sections__label">

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
    (action: string, queryString?: string) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-ExtensionPanel-onSearch-callback-action" class="dcc-code-sections__label">

      action

      </div>

      <div class="dcc-type--xsmall">

      string

      </div>

      </div>

    - <div>

      <div id="type-ExtensionPanel-onSearch-callback-queryString" class="dcc-code-sections__label">

      queryString

      </div>

      <div class="dcc-type--xsmall">

      string <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

    </div>

  </div>

- <div>

  <div id="event-ExtensionPanel-onShown" class="dcc-code-sections__label">

  onShown

  </div>

  <div class="dcc-type--xsmall">

  Event\<functionvoidvoid\>

  </div>

  </div>

  Fired when the user switches to the panel.

  The `onShown.addListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ExtensionPanel-onShown-callback" class="dcc-code-sections__label">

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
    (window: Window) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-ExtensionPanel-onShown-callback-window" class="dcc-code-sections__label">

      window

      </div>

      <div class="dcc-type--xsmall">

      Window

      </div>

      </div>

    </div>

  </div>

- <div>

  <div id="method-ExtensionPanel-createStatusBarButton" class="dcc-code-sections__label">

  createStatusBarButton

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Appends a button to the status bar of the panel.

  The `createStatusBarButton` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (iconPath: string, tooltipText: string, disabled: boolean) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-ExtensionPanel-createStatusBarButton-iconPath" class="dcc-code-sections__label">

    iconPath

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    Path to the icon of the button. The file should contain a 64x24-pixel image composed of two 32x24 icons. The left icon is used when the button is inactive; the right icon is displayed when the button is pressed.

  - <div>

    <div id="type-ExtensionPanel-createStatusBarButton-tooltipText" class="dcc-code-sections__label">

    tooltipText

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    Text shown as a tooltip when user hovers the mouse over the button.

  - <div>

    <div id="type-ExtensionPanel-createStatusBarButton-disabled" class="dcc-code-sections__label">

    disabled

    </div>

    <div class="dcc-type--xsmall">

    boolean

    </div>

    </div>

    Whether the button is disabled.

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ExtensionPanel-createStatusBarButton" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    [Button](#type-Button)

    </div>

    </div>

  </div>

- <div>

  <div id="method-ExtensionPanel-show" class="dcc-code-sections__label">

  show

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 140+ </span>

  </div>

  </div>

  Shows the panel by activating the corresponding tab.

  The `show` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  () => {...}
  ```

</div>

<div>

<div class="notranslate">

### ExtensionSidebarPane

</div>

A sidebar created by the extension.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="event-ExtensionSidebarPane-onHidden" class="dcc-code-sections__label">

  onHidden

  </div>

  <div class="dcc-type--xsmall">

  Event\<functionvoidvoid\>

  </div>

  </div>

  Fired when the sidebar pane becomes hidden as a result of the user switching away from the panel that hosts the sidebar pane.

  The `onHidden.addListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ExtensionSidebarPane-onHidden-callback" class="dcc-code-sections__label">

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

- <div>

  <div id="event-ExtensionSidebarPane-onShown" class="dcc-code-sections__label">

  onShown

  </div>

  <div class="dcc-type--xsmall">

  Event\<functionvoidvoid\>

  </div>

  </div>

  Fired when the sidebar pane becomes visible as a result of user switching to the panel that hosts it.

  The `onShown.addListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ExtensionSidebarPane-onShown-callback" class="dcc-code-sections__label">

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
    (window: Window) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-ExtensionSidebarPane-onShown-callback-window" class="dcc-code-sections__label">

      window

      </div>

      <div class="dcc-type--xsmall">

      Window

      </div>

      </div>

    </div>

  </div>

- <div>

  <div id="method-ExtensionSidebarPane-setExpression" class="dcc-code-sections__label">

  setExpression

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Sets an expression that is evaluated within the inspected page. The result is displayed in the sidebar pane.

  The `setExpression` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (expression: string, rootTitle?: string, callback?: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-ExtensionSidebarPane-setExpression-expression" class="dcc-code-sections__label">

    expression

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    An expression to be evaluated in context of the inspected page. JavaScript objects and DOM nodes are displayed in an expandable tree similar to the console/watch.

  - <div>

    <div id="type-ExtensionSidebarPane-setExpression-rootTitle" class="dcc-code-sections__label">

    rootTitle

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    An optional title for the root of the expression tree.

  - <div>

    <div id="method-ExtensionSidebarPane-setExpression-callback" class="dcc-code-sections__label">

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
    () => void
    ```

  </div>

- <div>

  <div id="method-ExtensionSidebarPane-setHeight" class="dcc-code-sections__label">

  setHeight

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Sets the height of the sidebar.

  The `setHeight` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (height: string) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-ExtensionSidebarPane-setHeight-height" class="dcc-code-sections__label">

    height

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    A CSS-like size specification, such as `'100px'` or `'12ex'`.

  </div>

- <div>

  <div id="method-ExtensionSidebarPane-setObject" class="dcc-code-sections__label">

  setObject

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Sets a JSON-compliant object to be displayed in the sidebar pane.

  The `setObject` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (jsonObject: string, rootTitle?: string, callback?: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-ExtensionSidebarPane-setObject-jsonObject" class="dcc-code-sections__label">

    jsonObject

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    An object to be displayed in context of the inspected page. Evaluated in the context of the caller (API client).

  - <div>

    <div id="type-ExtensionSidebarPane-setObject-rootTitle" class="dcc-code-sections__label">

    rootTitle

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    An optional title for the root of the expression tree.

  - <div>

    <div id="method-ExtensionSidebarPane-setObject-callback" class="dcc-code-sections__label">

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
    () => void
    ```

  </div>

- <div>

  <div id="method-ExtensionSidebarPane-setPage" class="dcc-code-sections__label">

  setPage

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Sets an HTML page to be displayed in the sidebar pane.

  The `setPage` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (path: string) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-ExtensionSidebarPane-setPage-path" class="dcc-code-sections__label">

    path

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    Relative path of an extension page to display within the sidebar.

  </div>

</div>

<div>

<div class="notranslate">

### SourcesPanel

</div>

Represents the Sources panel.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="event-SourcesPanel-onSelectionChanged" class="dcc-code-sections__label">

  onSelectionChanged

  </div>

  <div class="dcc-type--xsmall">

  Event\<functionvoidvoid\>

  </div>

  </div>

  Fired when an object is selected in the panel.

  The `onSelectionChanged.addListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-SourcesPanel-onSelectionChanged-callback" class="dcc-code-sections__label">

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

- <div>

  <div id="method-SourcesPanel-createSidebarPane" class="dcc-code-sections__label">

  createSidebarPane

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Creates a pane within panel's sidebar.

  The `createSidebarPane` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (title: string, callback?: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-SourcesPanel-createSidebarPane-title" class="dcc-code-sections__label">

    title

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

    Text that is displayed in sidebar caption.

  - <div>

    <div id="method-SourcesPanel-createSidebarPane-callback" class="dcc-code-sections__label">

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
    (result: ExtensionSidebarPane) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-SourcesPanel-createSidebarPane-callback-result" class="dcc-code-sections__label">

      result

      </div>

      <div class="dcc-type--xsmall">

      [ExtensionSidebarPane](#type-ExtensionSidebarPane)

      </div>

      </div>

      An ExtensionSidebarPane object for created sidebar pane.

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### Theme

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 99+ </span>

</div>

</div>

Theme used by DevTools.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"default"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Default DevTools theme. This is always the light theme.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"dark"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Dark theme.</span>

</div>

</div>

</div>

## Properties

<div>

<div>

<div class="notranslate">

### elements

</div>

Elements panel.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[ElementsPanel](#type-ElementsPanel)

</div>

</div>

<div>

<div class="notranslate">

### sources

</div>

Sources panel.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[SourcesPanel](#type-SourcesPanel)

</div>

</div>

<div>

<div class="notranslate">

### themeName

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 59+ </span>

</div>

</div>

The name of the color theme set in user's DevTools settings. Possible values: `default` (the default) and `dark`.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

string

</div>

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### create()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.devtools.panels.create(
  title: string,
  iconPath: string,
  pagePath: string,
  callback?: function,
): void
```

Creates an extension panel.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-create-title" class="dcc-code-sections__label">

  title

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Title that is displayed next to the extension icon in the Developer Tools toolbar.

- <div>

  <div id="type-create-iconPath" class="dcc-code-sections__label">

  iconPath

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Path of the panel's icon relative to the extension directory.

- <div>

  <div id="type-create-pagePath" class="dcc-code-sections__label">

  pagePath

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Path of the panel's HTML page relative to the extension directory.

- <div>

  <div id="method-create-callback" class="dcc-code-sections__label">

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
  (panel: ExtensionPanel) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-create-callback-panel" class="dcc-code-sections__label">

    panel

    </div>

    <div class="dcc-type--xsmall">

    [ExtensionPanel](#type-ExtensionPanel)

    </div>

    </div>

    An ExtensionPanel object representing the created panel.

  </div>

</div>

<div>

<div class="notranslate">

### openResource()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.devtools.panels.openResource(
  url: string,
  lineNumber: number,
  columnNumber?: number,
  callback?: function,
): void
```

Requests DevTools to open a URL in a Developer Tools panel.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-openResource-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The URL of the resource to open.

- <div>

  <div id="type-openResource-lineNumber" class="dcc-code-sections__label">

  lineNumber

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  Specifies the line number to scroll to when the resource is loaded.

- <div>

  <div id="type-openResource-columnNumber" class="dcc-code-sections__label">

  columnNumber

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 114+ </span>

  </div>

  </div>

  Specifies the column number to scroll to when the resource is loaded.

- <div>

  <div id="method-openResource-callback" class="dcc-code-sections__label">

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
  () => void
  ```

</div>

<div>

<div class="notranslate">

### setOpenResourceHandler()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.devtools.panels.setOpenResourceHandler(
  callback?: function,
): void
```

Specifies the function to be called when the user clicks a resource link in the Developer Tools window. To unset the handler, either call the method with no parameters or pass null as the parameter.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-setOpenResourceHandler-callback" class="dcc-code-sections__label">

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
  (resource: Resource, lineNumber: number) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-setOpenResourceHandler-callback-resource" class="dcc-code-sections__label">

    resource

    </div>

    <div class="dcc-type--xsmall">

    [Resource](https://developer.chrome.com/docs/extensions/reference/api/devtools/devtools_inspectedWindow/#type-Resource)

    </div>

    </div>

    A [`devtools.inspectedWindow.Resource`](https://developer.chrome.com/docs/extensions/reference/api/devtools/devtools_inspectedWindow/#type-Resource) object for the resource that was clicked.

  - <div>

    <div id="type-setOpenResourceHandler-callback-lineNumber" class="dcc-code-sections__label">

    lineNumber

    </div>

    <div class="dcc-type--xsmall">

    number

    </div>

    </div>

    Specifies the line number within the resource that was clicked.

  </div>

</div>

<div>

<div class="notranslate">

### setThemeChangeHandler()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 99+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.devtools.panels.setThemeChangeHandler(
  callback?: function,
): void
```

Specifies the function to be called when the current theme changes in DevTools. To unset the handler, either call the method with no parameters or pass `null` as the parameter.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-setThemeChangeHandler-callback" class="dcc-code-sections__label">

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
  (theme: Theme) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-setThemeChangeHandler-callback-theme" class="dcc-code-sections__label">

    theme

    </div>

    <div class="dcc-type--xsmall">

    [Theme](#type-Theme)

    </div>

    </div>

    Current theme in DevTools.

  </div>

</div>

</div>

</div>

</div>

<div class="devsite-floating-action-buttons">

</div>

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-11-10 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2025-11-10 UTC."\],\[\],\[\]\]

</div>

</div>