> 来源: https://developer.chrome.com/docs/extensions/reference/api/declarativeContent
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

# chrome.declarativeContent <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.declarativeContent` API to take actions depending on the content of a page, without requiring permission to read the page's content.

</div>

## Permissions

<div class="dcc-reference">

`declarativeContent`\

</div>

## Concepts and usage

<div class="aside key-term">

**Key term:** An [extension's *action*](/docs/extensions/reference/api/action) controls the extension's toolbar icon.

</div>

The Declarative Content API lets you enable your extension's action depending on the URL of a web page, or if a CSS selector matches an element on the page, without needing to add [host permissions](/docs/extensions/develop/concepts/declare-permissions#host-permissions) or inject a [content script](/docs/extensions/develop/concepts/content-scripts).

Use the [activeTab](/docs/extensions/develop/concepts/activeTab) permission to interact with a page after the user clicks on the extension's action.

### Rules

Rules consists of conditions and actions. If any of the conditions is fulfilled, all actions are executed. The actions are [`setIcon()`](#type-SetIcon) and [`showAction()`](#type-ShowAction).

The [`PageStateMatcher`](#type-PageStateMatcher) matches web pages if and only if all listed criteria are met. It can match a [page url](#page-url), a [css compound selector](#css) or the [bookmarked state](#bookmarked) of a page. The following rule enables the extension's action on Google pages when a password field is present:

<div>

</div>

``` devsite-click-to-copy
let rule1 = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostSuffix: '.google.com', schemes: ['https'] },
      css: ["input[type='password']"]
    })
  ],
  actions: [ new chrome.declarativeContent.ShowAction() ]
};
```

<div class="aside success">

**Success:** All conditions and actions are created using a constructor as shown in the previous example.

</div>

To also enable the extension's action for Google sites with a video, you can add a second condition, as each condition is sufficient to trigger all specified actions:

<div>

</div>

``` devsite-click-to-copy
let rule2 = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostSuffix: '.google.com', schemes: ['https'] },
      css: ["input[type='password']"]
    }),
    new chrome.declarativeContent.PageStateMatcher({
      css: ["video"]
    })
  ],
  actions: [ new chrome.declarativeContent.ShowAction() ]
};
```

The [`onPageChanged`](#event-onPageChanged) event tests whether any rule has at least one fulfilled condition and executes the actions. Rules persist across browsing sessions; therefore, during extension installation time you should first use [`removeRules`](/docs/extensions/reference/api/events#remove_rules) to clear previously installed rules and then use [`addRules`](/docs/extensions/reference/api/events#add_rules) to register new ones.

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([rule2]);
  });
});
```

<div class="aside note">

**Note:** You should always register or unregister rules in bulk because each of these operations recreates internal data structures. This re-creation is computationally expensive but facilitates a faster matching algorithm.

</div>

With the [activeTab](/docs/extensions/develop/concepts/activeTab) permission, your extension won't display any permission warnings and when the user clicks the extension action, it will only run on relevant pages.

### Page URL matching

The [`PageStateMatcher.pageurl`](#property-PageStateMatcher-pageUrl) matches when the URL criteria are fulfilled. The most common criteria are a concatenation of either host, path, or URL, followed by Contains, Equals, Prefix, or Suffix. The following table contains a few examples:

| Criteria                                  | Matches                         |
|-------------------------------------------|---------------------------------|
| `{ hostSuffix: 'google.com' }`            | All Google URLs                 |
| `{ pathPrefix: '/docs/extensions'` }      | Extension docs URLs             |
| `{ urlContains: 'developer.chrome.com'` } | All chrome developers docs URLs |

All criteria are case sensitive. For a complete list of criteria, see [UrlFilter](/docs/extensions/reference/api/events#type-UrlFilter).

### CSS Matching

[`PageStateMatcher.css`](#property-PageStateMatcher-css) conditions must be *[compound selectors](https://www.w3.org/TR/selectors4/#compound)*, meaning that you can't include [combinators](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors#combinators) like whitespace or "`>`" in your selectors. This helps Chrome match the selectors more efficiently.

|                               |                            |
|-------------------------------|----------------------------|
| Compound Selectors (OK)       | Complex Selectors (Not OK) |
| `a`                           | `div p`                    |
| `iframe.special[src^='http']` | `p>span.highlight`         |
| `ns|*`                        | `p + ol`                   |
| `#abcd:checked`               | `p::first-line`            |

CSS conditions only match displayed elements: if an element that matches your selector is `display:none` or one of its parent elements is `display:none`, it doesn't cause the condition to match. Elements styled with `visibility:hidden`, positioned off-screen, or hidden by other elements can still make your condition match.

### Bookmarked state matching

The [`PageStateMatcher.isBookmarked`](#property-PageStateMatcher-isBookmarked) condition allows matching of the bookmarked state of the current URL in the user's profile. To make use of this condition the "bookmarks" permission must be declared in the extension [manifest](/docs/extensions/reference/manifest).

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### ImageDataType

</div>

See <https://developer.mozilla.org/en-US/docs/Web/API/ImageData>.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

ImageData

</div>

</div>

<div>

<div class="notranslate">

### PageStateMatcher

</div>

Matches the state of a web page based on various criteria.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="method-PageStateMatcher-constructor" class="dcc-code-sections__label">

  constructor

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  The `constructor` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (arg: PageStateMatcher) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-PageStateMatcher-constructor-arg" class="dcc-code-sections__label">

    arg

    </div>

    <div class="dcc-type--xsmall">

    [PageStateMatcher](#type-PageStateMatcher)

    </div>

    </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-PageStateMatcher-constructor" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    [PageStateMatcher](#type-PageStateMatcher)

    </div>

    </div>

  </div>

- <div>

  <div id="property-PageStateMatcher-css" class="dcc-code-sections__label">

  css

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if all of the CSS selectors in the array match displayed elements in a frame with the same origin as the page's main frame. All selectors in this array must be [compound selectors](https://www.w3.org/TR/selectors4/#compound) to speed up matching. Note: Listing hundreds of CSS selectors or listing CSS selectors that match hundreds of times per page can slow down web sites.

- <div>

  <div id="property-PageStateMatcher-isBookmarked" class="dcc-code-sections__label">

  isBookmarked

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 45+ </span>

  </div>

  </div>

  Matches if the bookmarked state of the page is equal to the specified value. Requres the [bookmarks permission](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions).

- <div>

  <div id="property-PageStateMatcher-pageUrl" class="dcc-code-sections__label">

  pageUrl

  </div>

  <div class="dcc-type--xsmall">

  [UrlFilter](https://developer.chrome.com/docs/extensions/reference/events/#type-UrlFilter) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the conditions of the `UrlFilter` are fulfilled for the top-level URL of the page.

</div>

<div>

<div class="notranslate">

### RequestContentScript

</div>

Declarative event action that injects a content script.

**WARNING:** This action is still experimental and is not supported on stable builds of Chrome.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="method-RequestContentScript-constructor" class="dcc-code-sections__label">

  constructor

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  The `constructor` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (arg: RequestContentScript) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-RequestContentScript-constructor-arg" class="dcc-code-sections__label">

    arg

    </div>

    <div class="dcc-type--xsmall">

    [RequestContentScript](#type-RequestContentScript)

    </div>

    </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-RequestContentScript-constructor" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    [RequestContentScript](#type-RequestContentScript)

    </div>

    </div>

  </div>

- <div>

  <div id="property-RequestContentScript-allFrames" class="dcc-code-sections__label">

  allFrames

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether the content script runs in all frames of the matching page, or in only the top frame. Default is `false`.

- <div>

  <div id="property-RequestContentScript-css" class="dcc-code-sections__label">

  css

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Names of CSS files to be injected as a part of the content script.

- <div>

  <div id="property-RequestContentScript-js" class="dcc-code-sections__label">

  js

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Names of JavaScript files to be injected as a part of the content script.

- <div>

  <div id="property-RequestContentScript-matchAboutBlank" class="dcc-code-sections__label">

  matchAboutBlank

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether to insert the content script on `about:blank` and `about:srcdoc`. Default is `false`.

</div>

<div>

<div class="notranslate">

### SetIcon

</div>

Declarative event action that sets the n-dip square icon for the extension's [page action](https://developer.chrome.com/docs/extensions/reference/pageAction/) or [browser action](https://developer.chrome.com/docs/extensions/reference/browserAction/) while the corresponding conditions are met. This action can be used without [host permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions#host-permissions), but the extension must have a page or browser action.

Exactly one of `imageData` or `path` must be specified. Both are dictionaries mapping a number of pixels to an image representation. The image representation in `imageData` is an [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) object; for example, from a `canvas` element, while the image representation in `path` is the path to an image file relative to the extension's manifest. If `scale` screen pixels fit into a device-independent pixel, the `scale * n` icon is used. If that scale is missing, another image is resized to the required size.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="method-SetIcon-constructor" class="dcc-code-sections__label">

  constructor

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  The `constructor` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (arg: SetIcon) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-SetIcon-constructor-arg" class="dcc-code-sections__label">

    arg

    </div>

    <div class="dcc-type--xsmall">

    [SetIcon](#type-SetIcon)

    </div>

    </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-SetIcon-constructor" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    [SetIcon](#type-SetIcon)

    </div>

    </div>

  </div>

- <div>

  <div id="property-SetIcon-imageData" class="dcc-code-sections__label">

  imageData

  </div>

  <div class="dcc-type--xsmall">

  ImageData \| object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Either an `ImageData` object or a dictionary {size -\> ImageData} representing an icon to be set. If the icon is specified as a dictionary, the image used is chosen depending on the screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then an image with size `scale * n` is selected, where *n* is the size of the icon in the UI. At least one image must be specified. Note that `details.imageData = foo` is equivalent to `details.imageData = {'16': foo}`.

</div>

<div>

<div class="notranslate">

### ShowAction

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 97+ </span>

</div>

</div>

A declarative event action that sets the extension's toolbar [action](https://developer.chrome.com/docs/extensions/reference/action/) to an enabled state while the corresponding conditions are met. This action can be used without [host permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions#host-permissions). If the extension has the [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) permission, clicking the page action grants access to the active tab.

On pages where the conditions are not met the extension's toolbar action will be grey-scale, and clicking it will open the context menu, instead of triggering the action.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="method-ShowAction-constructor" class="dcc-code-sections__label">

  constructor

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  The `constructor` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (arg: ShowAction) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-ShowAction-constructor-arg" class="dcc-code-sections__label">

    arg

    </div>

    <div class="dcc-type--xsmall">

    [ShowAction](#type-ShowAction)

    </div>

    </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ShowAction-constructor" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    [ShowAction](#type-ShowAction)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### ShowPageAction

</div>

<div>

<div>

<span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 97</span>

</div>

</div>

Please use [`declarativeContent.ShowAction`](#type-ShowAction).

A declarative event action that sets the extension's [page action](https://developer.chrome.com/docs/extensions/reference/pageAction/) to an enabled state while the corresponding conditions are met. This action can be used without [host permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions#host-permissions), but the extension must have a page action. If the extension has the [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) permission, clicking the page action grants access to the active tab.

On pages where the conditions are not met the extension's toolbar action will be grey-scale, and clicking it will open the context menu, instead of triggering the action.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="method-ShowPageAction-constructor" class="dcc-code-sections__label">

  constructor

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  The `constructor` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (arg: ShowPageAction) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-ShowPageAction-constructor-arg" class="dcc-code-sections__label">

    arg

    </div>

    <div class="dcc-type--xsmall">

    [ShowPageAction](#type-ShowPageAction)

    </div>

    </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-ShowPageAction-constructor" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    [ShowPageAction](#type-ShowPageAction)

    </div>

    </div>

  </div>

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onPageChanged

</div>

Provides the [Declarative Event API](/docs/extensions/reference/api/events#declarative_event_handlers) consisting of `addRules`, `removeRules`, and `getRules`.

</div>

<div class="dcc-code-sections">

#### Conditions

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

[PageStateMatcher](#type-PageStateMatcher)

</div>

</div>

<div class="dcc-code-sections">

#### Actions

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

[RequestContentScript](#type-RequestContentScript)

<span style="white-space: nowrap;"></span>

[SetIcon](#type-SetIcon)

<span style="white-space: nowrap;"></span>

[ShowPageAction](#type-ShowPageAction)

<span style="white-space: nowrap;"></span>

[ShowAction](#type-ShowAction)

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