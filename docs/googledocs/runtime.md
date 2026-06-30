> 来源: https://developer.chrome.com/docs/extensions/reference/api/runtime
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

# chrome.runtime <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.runtime` API to retrieve the service worker, return details about the manifest, and listen for and respond to events in the extension lifecycle. You can also use this API to convert the relative path of URLs to fully-qualified URLs.

</div>

Most members of this API do **not** require any permissions. This permission is needed for [`connectNative()`](#method-connectNative), [`sendNativeMessage()`](#method-sendNativeMessage) and [`onNativeConnect`](#event-onConnectNative).

The following example shows how to declare the `"nativeMessaging"` permission in the manifest:

<span class="dcc-label">manifest.json:</span>

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "permissions": [
    "nativeMessaging"
  ],
  ...
}
```

## Concepts and usage

The Runtime API provides methods to support a number of areas that your extensions can use:

Message passing  
Your extension can communicate with different contexts within your extension and also with other extensions using these methods and events: [`connect()`](#method-connect), [`onConnect`](#event-onConnect), [`onConnectExternal`](#event-onConnectExternal), [`sendMessage()`](#method-sendMessage), [`onMessage`](#event-onMessage) and [`onMessageExternal`](#event-onMessageExternal). In addition, your extension can pass messages to native applications on the user's device using [`connectNative()`](#method-connectNative) and [`sendNativeMessage()`](#method-sendNativeMessage).

<div class="aside note">

**Note:** See [Message Passing](/docs/extensions/mv3/messaging) for an overview of the subject.

</div>

Accessing extension and platform metadata  
These methods let you retrieve several specific pieces of metadata about the extension and the platform. Methods in this category include [`getManifest()`](#method-getManifest), and [`getPlatformInfo()`](#method-getPlatformInfo).

Managing extension lifecycle and options  
These properties let you perform some meta-operations on the extension, and display the options page. Methods and events in this category include [`onInstalled`](#event-onInstalled), [`onStartup`](#event-onStartup), [`openOptionsPage()`](#method-openOptionsPage), [`reload()`](#method-reload), [`requestUpdateCheck()`](#method-requestUpdateCheck), and [`setUninstallURL()`](#method-setUninstallURL).

Helper utilities  
These methods provide utility such as the conversion of internal resource representations to external formats. Methods in this category include [`getURL()`](#method-getURL).

Kiosk mode utilities  
These methods are available only on ChromeOS, and exist mainly to support kiosk implementations. Methods in this category include [`restart()`](#method-restart) and [`restartAfterDelay()`\`](#method-restartAfterDelay).

### Unpacked extension behavior

When an [unpacked](/docs/extensions/get-started/tutorial/hello-world#load-unpacked) extension is [reloaded](/docs/extensions/get-started/tutorial/hello-world#reload), this is treated as an update. This means that the [`chrome.runtime.onInstalled`](#event-onInstalled) event will fire with the `"update"` reason. This includes when the extension is reloaded with [`chrome.runtime.reload()`](#method-reload).

## Use cases

### Add an image to a web page

For a web page to access an asset hosted on another domain, it must specify the resource's full URL (e.g. `<img src="https://example.com/logo.png">`). The same is true to include an extension asset on a web page. The two differences are that the extension's assets must be exposed as [web accessible resources](/docs/extensions/mv3/manifest/web_accessible_resources) and that typically content scripts are responsible for injecting extension assets.

In this example, the extension will add `logo.png` to the page that the [content script](/docs/extensions/develop/concepts/content-scripts) is being [injected](/docs/extensions/develop/concepts/content-scripts#functionality) into by using `runtime.getURL()` to create a fully-qualified URL. But first, the asset must be declared as a web accessible resource in the manifest.

<span class="dcc-label">manifest.json:</span>

<div>

</div>

``` devsite-click-to-copy
{
  ...
  "web_accessible_resources": [
    {
      "resources": [ "logo.png" ],
      "matches": [ "https://*/*" ]
    }
  ],
  ...
}
```

<span class="dcc-label">content.js:</span>

<div>

</div>

``` devsite-click-to-copy
{ // Block used to avoid setting global variables
  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('logo.png');
  document.body.append(img);
}
```

### Send data from a content script to the service worker

Its common for an extension's content scripts to need data managed by another part of the extension, like the service worker. Much like two browser windows opened to the same web page, these two contexts cannot directly access each other's values. Instead, the extension can use [message passing](/docs/extensions/develop/concepts/messaging) to coordinate across these different contexts.

In this example, the content script needs some data from the extension's service worker to initialize its UI. To get this data, it passes the developer-defined `get-user-data` message to the service worker, and it responds with a copy of the user's information.

<span class="dcc-label">content.js:</span>

<div>

</div>

``` devsite-click-to-copy
// 1. Send a message to the service worker requesting the user's data
chrome.runtime.sendMessage('get-user-data', (response) => {
  // 3. Got an asynchronous response with the data from the service worker
  console.log('received user data', response);
  initializeUI(response);
});
```

<span class="dcc-label">service-worker.js:</span>

<div>

</div>

``` devsite-click-to-copy
// Example of a simple user data object
const user = {
  username: 'demo-user'
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  if (message === 'get-user-data') {
    sendResponse(user);
  }
});
```

### Gather feedback on uninstall

Many extensions use post-uninstall surveys to understand how the extension could better serve its users and improve retention. The following example shows how to add this functionality.

<span class="dcc-label">background.js:</span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.setUninstallURL('https://example.com/extension-survey');
  }
});
```

## Examples

See the [Manifest V3 - Web Accessible Resources demo](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/web-accessible-resources) for more Runtime API examples.

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### ContextFilter

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 114+ </span>

</div>

</div>

A filter to match against certain extension contexts. Matching contexts must match all specified filters; any filter that is not specified matches all available contexts. Thus, a filter of \`{}\` will match all available contexts.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ContextFilter-contextIds" class="dcc-code-sections__label">

  contextIds

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-ContextFilter-contextTypes" class="dcc-code-sections__label">

  contextTypes

  </div>

  <div class="dcc-type--xsmall">

  [ContextType](#type-ContextType)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-ContextFilter-documentIds" class="dcc-code-sections__label">

  documentIds

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-ContextFilter-documentOrigins" class="dcc-code-sections__label">

  documentOrigins

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-ContextFilter-documentUrls" class="dcc-code-sections__label">

  documentUrls

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-ContextFilter-frameIds" class="dcc-code-sections__label">

  frameIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-ContextFilter-incognito" class="dcc-code-sections__label">

  incognito

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-ContextFilter-tabIds" class="dcc-code-sections__label">

  tabIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

- <div>

  <div id="property-ContextFilter-windowIds" class="dcc-code-sections__label">

  windowIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### ContextType

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 114+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"TAB"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the context type as a tab</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"POPUP"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the context type as an extension popup window</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"BACKGROUND"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the context type as a service worker.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"OFFSCREEN_DOCUMENT"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the context type as an offscreen document.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"SIDE_PANEL"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the context type as a side panel.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"DEVELOPER_TOOLS"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the context type as developer tools.</span>

</div>

</div>

<div>

<div class="notranslate">

### ExtensionContext

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 114+ </span>

</div>

</div>

A context hosting extension content.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ExtensionContext-contextId" class="dcc-code-sections__label">

  contextId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  A unique identifier for this context

- <div>

  <div id="property-ExtensionContext-contextType" class="dcc-code-sections__label">

  contextType

  </div>

  <div class="dcc-type--xsmall">

  [ContextType](#type-ContextType)

  </div>

  </div>

  The type of context this corresponds to.

- <div>

  <div id="property-ExtensionContext-documentId" class="dcc-code-sections__label">

  documentId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  A UUID for the document associated with this context, or undefined if this context is hosted not in a document.

- <div>

  <div id="property-ExtensionContext-documentOrigin" class="dcc-code-sections__label">

  documentOrigin

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The origin of the document associated with this context, or undefined if the context is not hosted in a document.

- <div>

  <div id="property-ExtensionContext-documentUrl" class="dcc-code-sections__label">

  documentUrl

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The URL of the document associated with this context, or undefined if the context is not hosted in a document.

- <div>

  <div id="property-ExtensionContext-frameId" class="dcc-code-sections__label">

  frameId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The ID of the frame for this context, or -1 if this context is not hosted in a frame.

- <div>

  <div id="property-ExtensionContext-incognito" class="dcc-code-sections__label">

  incognito

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the context is associated with an incognito profile.

- <div>

  <div id="property-ExtensionContext-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The ID of the tab for this context, or -1 if this context is not hosted in a tab.

- <div>

  <div id="property-ExtensionContext-windowId" class="dcc-code-sections__label">

  windowId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The ID of the window for this context, or -1 if this context is not hosted in a window.

</div>

<div>

<div class="notranslate">

### MessageSender

</div>

An object containing information about the script context that sent a message or request.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-MessageSender-documentId" class="dcc-code-sections__label">

  documentId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 106+ </span>

  </div>

  </div>

  A UUID of the document that opened the connection.

- <div>

  <div id="property-MessageSender-documentLifecycle" class="dcc-code-sections__label">

  documentLifecycle

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 106+ </span>

  </div>

  </div>

  The lifecycle the document that opened the connection is in at the time the port was created. Note that the lifecycle state of the document may have changed since port creation.

- <div>

  <div id="property-MessageSender-frameId" class="dcc-code-sections__label">

  frameId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The [frame](https://developer.chrome.com/docs/extensions/reference/webNavigation/#frame_ids) that opened the connection. 0 for top-level frames, positive for child frames. This will only be set when `tab` is set.

- <div>

  <div id="property-MessageSender-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the extension that opened the connection, if any.

- <div>

  <div id="property-MessageSender-nativeApplication" class="dcc-code-sections__label">

  nativeApplication

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 74+ </span>

  </div>

  </div>

  The name of the native application that opened the connection, if any.

- <div>

  <div id="property-MessageSender-origin" class="dcc-code-sections__label">

  origin

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 80+ </span>

  </div>

  </div>

  The origin of the page or frame that opened the connection. It can vary from the url property (e.g., about:blank) or can be opaque (e.g., sandboxed iframes). This is useful for identifying if the origin can be trusted if we can't immediately tell from the URL.

- <div>

  <div id="property-MessageSender-tab" class="dcc-code-sections__label">

  tab

  </div>

  <div class="dcc-type--xsmall">

  [Tab](https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The [`tabs.Tab`](https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab) which opened the connection, if any. This property will **only** be present when the connection was opened from a tab (including content scripts), and **only** if the receiver is an extension, not an app.

- <div>

  <div id="property-MessageSender-tlsChannelId" class="dcc-code-sections__label">

  tlsChannelId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The TLS channel ID of the page or frame that opened the connection, if requested by the extension, and if available.

- <div>

  <div id="property-MessageSender-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The URL of the page or frame that opened the connection. If the sender is in an iframe, it will be iframe's URL not the URL of the page which hosts it.

</div>

<div>

<div class="notranslate">

### OnInstalledReason

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

The reason that this event is being dispatched.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"install"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the event reason as an installation.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"update"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the event reason as an extension update.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"chrome_update"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the event reason as a Chrome update.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"shared_module_update"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the event reason as an update to a shared module.</span>

</div>

</div>

<div>

<div class="notranslate">

### OnRestartRequiredReason

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

The reason that the event is being dispatched. 'app_update' is used when the restart is needed because the application is updated to a newer version. 'os_update' is used when the restart is needed because the browser/OS is updated to a newer version. 'periodic' is used when the system runs for more than the permitted uptime set in the enterprise policy.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"app_update"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the event reason as an update to the app.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"os_update"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the event reason as an update to the operating system.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"periodic"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the event reason as a periodic restart of the app.</span>

</div>

</div>

<div>

<div class="notranslate">

### PlatformArch

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

The machine's processor architecture.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"arm"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the processer architecture as arm.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"arm64"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the processer architecture as arm64.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"x86-32"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the processer architecture as x86-32.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"x86-64"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the processer architecture as x86-64.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"mips"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the processer architecture as mips.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"mips64"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the processer architecture as mips64.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"riscv64"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the processer architecture as riscv64.</span>

</div>

</div>

<div>

<div class="notranslate">

### PlatformInfo

</div>

An object containing information about the current platform.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-PlatformInfo-arch" class="dcc-code-sections__label">

  arch

  </div>

  <div class="dcc-type--xsmall">

  [PlatformArch](#type-PlatformArch)

  </div>

  </div>

  The machine's processor architecture.

- <div>

  <div id="property-PlatformInfo-nacl_arch" class="dcc-code-sections__label">

  nacl_arch

  </div>

  <div class="dcc-type--xsmall">

  [PlatformNaclArch](#type-PlatformNaclArch) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 149</span>

  </div>

  </div>

  This attribute is deprecated following complete removal of Native Client.

  The native client architecture. This may be different from arch on some platforms.

- <div>

  <div id="property-PlatformInfo-os" class="dcc-code-sections__label">

  os

  </div>

  <div class="dcc-type--xsmall">

  [PlatformOs](#type-PlatformOs)

  </div>

  </div>

  The operating system Chrome is running on.

</div>

<div>

<div class="notranslate">

### PlatformNaclArch

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span><span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 149</span>

</div>

</div>

This enum is deprecated following complete removal of Native Client.

The native client architecture. This may be different from arch on some platforms.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"arm"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the native client architecture as arm.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"x86-32"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the native client architecture as x86-32.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"x86-64"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the native client architecture as x86-64.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"mips"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the native client architecture as mips.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"mips64"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the native client architecture as mips64.</span>

</div>

</div>

<div>

<div class="notranslate">

### PlatformOs

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

The operating system Chrome is running on.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"mac"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the MacOS operating system.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"win"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the Windows operating system.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"android"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the Android operating system.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"cros"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the Chrome operating system.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"linux"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the Linux operating system.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"openbsd"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies the OpenBSD operating system.</span>

</div>

</div>

<div>

<div class="notranslate">

### Port

</div>

An object which allows two way communication with other pages. See [Long-lived connections](https://developer.chrome.com/docs/extensions/messaging#connect) for more information.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Port-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The name of the port, as specified in the call to [`runtime.connect`](#method-connect).

- <div>

  <div id="event-Port-onDisconnect" class="dcc-code-sections__label">

  onDisconnect

  </div>

  <div class="dcc-type--xsmall">

  Event\<functionvoidvoid\>

  </div>

  </div>

  Fired when the port is disconnected from the other end(s). [`runtime.lastError`](#property-lastError) may be set if the port was disconnected by an error. If the port is closed via [disconnect](#method-Port-disconnect), then this event is *only* fired on the other end. This event is fired at most once (see also [Port lifetime](https://developer.chrome.com/docs/extensions/messaging#port-lifetime)).

  The `onDisconnect.addListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-Port-onDisconnect-callback" class="dcc-code-sections__label">

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
    (port: Port) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-Port-onDisconnect-callback-port" class="dcc-code-sections__label">

      port

      </div>

      <div class="dcc-type--xsmall">

      [Port](#type-Port)

      </div>

      </div>

    </div>

  </div>

- <div>

  <div id="event-Port-onMessage" class="dcc-code-sections__label">

  onMessage

  </div>

  <div class="dcc-type--xsmall">

  Event\<functionvoidvoid\>

  </div>

  </div>

  This event is fired when [postMessage](#method-Port-postMessage) is called by the other end of the port.

  The `onMessage.addListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-Port-onMessage-callback" class="dcc-code-sections__label">

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
    (message: any, port: Port) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-Port-onMessage-callback-message" class="dcc-code-sections__label">

      message

      </div>

      <div class="dcc-type--xsmall">

      any

      </div>

      </div>

    - <div>

      <div id="type-Port-onMessage-callback-port" class="dcc-code-sections__label">

      port

      </div>

      <div class="dcc-type--xsmall">

      [Port](#type-Port)

      </div>

      </div>

    </div>

  </div>

- <div>

  <div id="property-Port-sender" class="dcc-code-sections__label">

  sender

  </div>

  <div class="dcc-type--xsmall">

  [MessageSender](#type-MessageSender) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  This property will **only** be present on ports passed to [onConnect](#event-onConnect) / [onConnectExternal](#event-onConnectExternal) / [onConnectNative](#event-onConnectExternal) listeners.

- <div>

  <div id="method-Port-disconnect" class="dcc-code-sections__label">

  disconnect

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Immediately disconnect the port. Calling `disconnect()` on an already-disconnected port has no effect. When a port is disconnected, no new events will be dispatched to this port.

  The `disconnect` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  () => {...}
  ```

- <div>

  <div id="method-Port-postMessage" class="dcc-code-sections__label">

  postMessage

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Send a message to the other end of the port. If the port is disconnected, an error is thrown.

  The `postMessage` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (message: any) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-Port-postMessage-message" class="dcc-code-sections__label">

    message

    </div>

    <div class="dcc-type--xsmall">

    any

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 52+ </span>

    </div>

    </div>

    The message to send. This object should be JSON-ifiable.

  </div>

</div>

<div>

<div class="notranslate">

### RequestUpdateCheckStatus

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 44+ </span>

</div>

</div>

Result of the update check.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"throttled"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies that the status check has been throttled. This can occur after repeated checks within a short amount of time.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"no_update"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies that there are no available updates to install.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"update_available"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Specifies that there is an available update to install.</span>

</div>

</div>

</div>

## Properties

<div>

<div>

<div class="notranslate">

### id

</div>

The ID of the extension/app.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

string

</div>

</div>

<div>

<div class="notranslate">

### lastError

</div>

Populated with an error message if calling an API function fails; otherwise undefined. This is only defined within the scope of that function's callback. If an error is produced, but `runtime.lastError` is not accessed within the callback, a message is logged to the console listing the API function that produced the error. API functions that return promises do not set this property.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

object

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-lastError-message" class="dcc-code-sections__label">

  message

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Details about the error which occurred.

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### connect()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.connect(
  extensionId?: string,
  connectInfo?: object,
): Port
```

Attempts to connect listeners within an extension (such as the background page), or other extensions/apps. This is useful for content scripts connecting to their extension processes, inter-app/extension communication, and [web messaging](https://developer.chrome.com/docs/extensions/manifest/externally_connectable). Note that this does not connect to any listeners in a content script. Extensions may connect to content scripts embedded in tabs via [`tabs.connect`](https://developer.chrome.com/docs/extensions/reference/tabs/#method-connect).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-connect-extensionId" class="dcc-code-sections__label">

  extensionId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the extension to connect to. If omitted, a connection will be attempted with your own extension. Required if sending messages from a web page for [web messaging](https://developer.chrome.com/docs/extensions/reference/manifest/externally-connectable).

- <div>

  <div id="type-connect-connectInfo" class="dcc-code-sections__label">

  connectInfo

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-connect-connectInfo-includeTlsChannelId" class="dcc-code-sections__label">

    includeTlsChannelId

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the TLS channel ID will be passed into onConnectExternal for processes that are listening for the connection event.

  - <div>

    <div id="property-connect-connectInfo-name" class="dcc-code-sections__label">

    name

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Will be passed into onConnect for processes that are listening for the connection event.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  [Port](#type-Port)

  </div>

  </div>

  Port through which messages can be sent and received. The port's [onDisconnect](#type-Port) event is fired if the extension does not exist.

</div>

<div>

<div class="notranslate">

### connectNative()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.connectNative(
  application: string,
): Port
```

Connects to a native application in the host machine. This method requires the `"nativeMessaging"` permission. See [Native Messaging](https://developer.chrome.com/extensions/develop/concepts/native-messaging) for more information.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-connectNative-application" class="dcc-code-sections__label">

  application

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The name of the registered application to connect to.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  [Port](#type-Port)

  </div>

  </div>

  Port through which messages can be sent and received with the application

</div>

<div>

<div class="notranslate">

### getBackgroundPage()

</div>

<div>

<div>

<span class="dcc-tag-pill--purple dcc-tag-pill" title="Not available in Service Workers"> Foreground only </span><span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 133</span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.getBackgroundPage(): Promise<Window | undefined>
```

Background pages do not exist in MV3 extensions.

Retrieves the JavaScript 'window' object for the background page running inside the current extension/app. If the background page is an event page, the system will ensure it is loaded before calling the callback. If there is no background page, an error is set.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<Window \| undefined\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 99+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getContexts()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 116+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.getContexts(
  filter: ContextFilter,
): Promise<ExtensionContext[]>
```

Fetches information about active contexts associated with this extension

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getContexts-filter" class="dcc-code-sections__label">

  filter

  </div>

  <div class="dcc-type--xsmall">

  [ContextFilter](#type-ContextFilter)

  </div>

  </div>

  A filter to find matching contexts. A context matches if it matches all specified fields in the filter. Any unspecified field in the filter matches all contexts.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[ExtensionContext](#type-ExtensionContext)\[\]\>

  </div>

  </div>

  Promise that resolves with the matching contexts, if any.

</div>

<div>

<div class="notranslate">

### getManifest()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.getManifest(): object
```

Returns details about the app or extension from the manifest. The object returned is a serialization of the full [manifest file](https://developer.chrome.com/docs/extensions/reference/manifest).

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  The manifest details.

</div>

<div>

<div class="notranslate">

### getPackageDirectoryEntry()

</div>

<div>

<div>

<span class="dcc-tag-pill--purple dcc-tag-pill" title="Not available in Service Workers"> Foreground only </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.getPackageDirectoryEntry(): Promise<DirectoryEntry>
```

Returns a DirectoryEntry for the package directory.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<DirectoryEntry\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 122+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getPlatformInfo()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.getPlatformInfo(): Promise<PlatformInfo>
```

Returns information about the current platform.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[PlatformInfo](#type-PlatformInfo)\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 99+ </span>

  </div>

  </div>

  Promise that resolves with information about the current platform.

</div>

<div>

<div class="notranslate">

### getURL()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.getURL(
  path: string,
): string
```

Converts a relative path within an app/extension install directory to a fully-qualified URL.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getURL-path" class="dcc-code-sections__label">

  path

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  A path to a resource within an app/extension expressed relative to its install directory.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The fully-qualified URL to the resource.

</div>

<div>

<div class="notranslate">

### getVersion()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 143+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.getVersion(): string
```

Returns the extension's version as declared in the manifest.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The extension's version.

</div>

<div>

<div class="notranslate">

### openOptionsPage()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.openOptionsPage(): Promise<void>
```

Open your Extension's options page, if possible.

The precise behavior may depend on your manifest's [`options_ui`](https://developer.chrome.com/docs/extensions/develop/ui/options-page#embedded_options) or [`options_page`](https://developer.chrome.com/docs/extensions/develop/ui/options-page#full_page) key, or what Chrome happens to support at the time. For example, the page may be opened in a new tab, within chrome://extensions, within an App, or it may just focus an open options page. It will never cause the caller page to reload.

If your Extension does not declare an options page, or Chrome failed to create one for some other reason, the callback will set [`lastError`](#property-lastError).

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 99+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### reload()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.reload(): void
```

Reloads the app or extension. This method is not supported in kiosk mode. For kiosk mode, use chrome.runtime.restart() method.

</div>

<div>

<div class="notranslate">

### requestUpdateCheck()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.requestUpdateCheck(): Promise<object>
```

Requests an immediate update check be done for this app/extension.

**Important**: Most extensions/apps should **not** use this method, since Chrome already does automatic checks every few hours, and you can listen for the [`runtime.onUpdateAvailable`](#event-onUpdateAvailable) event without needing to call requestUpdateCheck.

This method is only appropriate to call in very limited circumstances, such as if your extension talks to a backend service, and the backend service has determined that the client extension version is very far out of date and you'd like to prompt a user to update. Most other uses of requestUpdateCheck, such as calling it unconditionally based on a repeating timer, probably only serve to waste client, network, and server resources.

Note: When called with a callback, instead of returning an object this function will return the two properties as separate arguments passed to the callback.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<object\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 109+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### restart()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.restart(): void
```

Restart the ChromeOS device when the app runs in kiosk mode. Otherwise, it's no-op.

</div>

<div>

<div class="notranslate">

### restartAfterDelay()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 53+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.restartAfterDelay(
  seconds: number,
): Promise<void>
```

Restart the ChromeOS device when the app runs in kiosk mode after the given seconds. If called again before the time ends, the reboot will be delayed. If called with a value of -1, the reboot will be cancelled. It's a no-op in non-kiosk mode. It's only allowed to be called repeatedly by the first extension to invoke this API.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-restartAfterDelay-seconds" class="dcc-code-sections__label">

  seconds

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  Time to wait in seconds before rebooting the device, or -1 to cancel a scheduled reboot.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 99+ </span>

  </div>

  </div>

  Promise that resolves when a restart request was successfully rescheduled.

</div>

<div>

<div class="notranslate">

### sendMessage()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.sendMessage(
  extensionId?: string,
  message: any,
  options?: object,
): Promise<any>
```

Sends a single message to event listeners within your extension or a different extension/app. Similar to [`runtime.connect`](#method-connect) but only sends a single message, with an optional response. If sending to your extension, the [`runtime.onMessage`](#event-onMessage) event will be fired in every frame of your extension (except for the sender's frame), or [`runtime.onMessageExternal`](#event-onMessageExternal), if a different extension. Note that extensions cannot send messages to content scripts using this method. To send messages to content scripts, use [`tabs.sendMessage`](https://developer.chrome.com/docs/extensions/reference/tabs/#method-sendMessage).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-sendMessage-extensionId" class="dcc-code-sections__label">

  extensionId

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the extension to send the message to. If omitted, the message will be sent to your own extension/app. Required if sending messages from a web page for [web messaging](https://developer.chrome.com/docs/extensions/manifest/externally_connectable).

- <div>

  <div id="type-sendMessage-message" class="dcc-code-sections__label">

  message

  </div>

  <div class="dcc-type--xsmall">

  any

  </div>

  </div>

  The message to send. This message should be a JSON-ifiable object.

- <div>

  <div id="type-sendMessage-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-sendMessage-options-includeTlsChannelId" class="dcc-code-sections__label">

    includeTlsChannelId

    </div>

    <div class="dcc-type--xsmall">

    boolean <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    Whether the TLS channel ID will be passed into onMessageExternal for processes that are listening for the connection event.

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<any\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 99+ </span>

  </div>

  </div>

  Promise support was added for extension contexts in Chrome 99. When communicating from a web page to an extension, promises are available from Chrome 118.

</div>

<div>

<div class="notranslate">

### sendNativeMessage()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.sendNativeMessage(
  application: string,
  message: object,
): Promise<any>
```

Send a single message to a native application. This method requires the `"nativeMessaging"` permission.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-sendNativeMessage-application" class="dcc-code-sections__label">

  application

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The name of the native messaging host.

- <div>

  <div id="type-sendNativeMessage-message" class="dcc-code-sections__label">

  message

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  The message that will be passed to the native messaging host.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<any\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 99+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### setUninstallURL()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.setUninstallURL(
  url: string,
): Promise<void>
```

Sets the URL to be visited upon uninstallation. This may be used to clean up server-side data, do analytics, and implement surveys. Maximum 1023 characters.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setUninstallURL-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  URL to be opened after the extension is uninstalled. This URL must have an http: or https: scheme. Set an empty string to not open a new tab upon uninstallation.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 99+ </span>

  </div>

  </div>

  Promise that resolves when the uninstall URL is set. If the given URL is invalid, the promise will be rejected.

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onBrowserUpdateAvailable

</div>

<div>

<div>

<span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated</span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onBrowserUpdateAvailable.addListener(
  callback: function,
)
```

Please use [`runtime.onRestartRequired`](#event-onRestartRequired).

Fired when a Chrome update is available, but isn't installed immediately because a browser restart is required.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onBrowserUpdateAvailable-callback" class="dcc-code-sections__label">

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

<div>

<div class="notranslate">

### onConnect

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onConnect.addListener(
  callback: function,
)
```

Fired when a connection is made from either an extension process or a content script (by [`runtime.connect`](#method-connect)).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onConnect-callback" class="dcc-code-sections__label">

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
  (port: Port) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onConnect-callback-port" class="dcc-code-sections__label">

    port

    </div>

    <div class="dcc-type--xsmall">

    [Port](#type-Port)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onConnectExternal

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onConnectExternal.addListener(
  callback: function,
)
```

Fired when a connection is made from another extension (by [`runtime.connect`](#method-connect)), or from an externally connectable web site.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onConnectExternal-callback" class="dcc-code-sections__label">

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
  (port: Port) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onConnectExternal-callback-port" class="dcc-code-sections__label">

    port

    </div>

    <div class="dcc-type--xsmall">

    [Port](#type-Port)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onConnectNative

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 76+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onConnectNative.addListener(
  callback: function,
)
```

Fired when a connection is made from a native application. This event requires the `"nativeMessaging"` permission. It is only supported on Chrome OS.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onConnectNative-callback" class="dcc-code-sections__label">

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
  (port: Port) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onConnectNative-callback-port" class="dcc-code-sections__label">

    port

    </div>

    <div class="dcc-type--xsmall">

    [Port](#type-Port)

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
chrome.runtime.onInstalled.addListener(
  callback: function,
)
```

Fired when the extension is first installed, when the extension is updated to a new version, and when Chrome is updated to a new version.

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
  (details: object) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onInstalled-callback-details" class="dcc-code-sections__label">

    details

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onInstalled-callback-details-id" class="dcc-code-sections__label">

      id

      </div>

      <div class="dcc-type--xsmall">

      string <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      Indicates the ID of the imported shared module extension which updated. This is present only if 'reason' is 'shared_module_update'.

    - <div>

      <div id="property-onInstalled-callback-details-previousVersion" class="dcc-code-sections__label">

      previousVersion

      </div>

      <div class="dcc-type--xsmall">

      string <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      Indicates the previous version of the extension, which has just been updated. This is present only if 'reason' is 'update'.

    - <div>

      <div id="property-onInstalled-callback-details-reason" class="dcc-code-sections__label">

      reason

      </div>

      <div class="dcc-type--xsmall">

      [OnInstalledReason](#type-OnInstalledReason)

      </div>

      </div>

      The reason that this event is being dispatched.

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onMessage

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onMessage.addListener(
  callback: function,
)
```

Fired when a message is sent from either [`runtime.sendMessage`](#method-sendMessage) or [`tabs.sendMessage`](https://developer.chrome.com/docs/extensions/reference/tabs/#method-sendMessage).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onMessage-callback" class="dcc-code-sections__label">

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
  (message: any, sender: MessageSender, sendResponse: function) => boolean | Promise<any> | undefined
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onMessage-callback-message" class="dcc-code-sections__label">

    message

    </div>

    <div class="dcc-type--xsmall">

    any

    </div>

    </div>

  - <div>

    <div id="type-onMessage-callback-sender" class="dcc-code-sections__label">

    sender

    </div>

    <div class="dcc-type--xsmall">

    [MessageSender](#type-MessageSender)

    </div>

    </div>

  - <div>

    <div id="method-onMessage-callback-sendResponse" class="dcc-code-sections__label">

    sendResponse

    </div>

    <div class="dcc-type--xsmall">

    function

    </div>

    </div>

    The `sendResponse` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

    <div>

    </div>

    ``` devsite-click-to-copy
    (response?: any) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-onMessage-callback-sendResponse-response" class="dcc-code-sections__label">

      response

      </div>

      <div class="dcc-type--xsmall">

      any <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      The response to return to the message sender.

    </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-onMessage-callback" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    boolean \| Promise\<any\> \| undefined

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onMessageExternal

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onMessageExternal.addListener(
  callback: function,
)
```

Fired when a message is sent from another extension (by [`runtime.sendMessage`](#method-sendMessage)). Cannot be used in a content script.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onMessageExternal-callback" class="dcc-code-sections__label">

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
  (message: any, sender: MessageSender, sendResponse: function) => boolean | Promise<any> | undefined
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onMessageExternal-callback-message" class="dcc-code-sections__label">

    message

    </div>

    <div class="dcc-type--xsmall">

    any

    </div>

    </div>

  - <div>

    <div id="type-onMessageExternal-callback-sender" class="dcc-code-sections__label">

    sender

    </div>

    <div class="dcc-type--xsmall">

    [MessageSender](#type-MessageSender)

    </div>

    </div>

  - <div>

    <div id="method-onMessageExternal-callback-sendResponse" class="dcc-code-sections__label">

    sendResponse

    </div>

    <div class="dcc-type--xsmall">

    function

    </div>

    </div>

    The `sendResponse` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

    <div>

    </div>

    ``` devsite-click-to-copy
    (response?: any) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-onMessageExternal-callback-sendResponse-response" class="dcc-code-sections__label">

      response

      </div>

      <div class="dcc-type--xsmall">

      any <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      The response to return to the message sender.

    </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-onMessageExternal-callback" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    boolean \| Promise\<any\> \| undefined

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onRestartRequired

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onRestartRequired.addListener(
  callback: function,
)
```

Fired when an app or the device that it runs on needs to be restarted. The app should close all its windows at its earliest convenient time to let the restart to happen. If the app does nothing, a restart will be enforced after a 24-hour grace period has passed. Currently, this event is only fired for Chrome OS kiosk apps.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onRestartRequired-callback" class="dcc-code-sections__label">

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
  (reason: OnRestartRequiredReason) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onRestartRequired-callback-reason" class="dcc-code-sections__label">

    reason

    </div>

    <div class="dcc-type--xsmall">

    [OnRestartRequiredReason](#type-OnRestartRequiredReason)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onStartup

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onStartup.addListener(
  callback: function,
)
```

Fired when a profile that has this extension installed first starts up. This event is not fired when an incognito profile is started, even if this extension is operating in 'split' incognito mode.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onStartup-callback" class="dcc-code-sections__label">

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

<div>

<div class="notranslate">

### onSuspend

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onSuspend.addListener(
  callback: function,
)
```

Sent to the event page just before it is unloaded. This gives the extension opportunity to do some clean up. Note that since the page is unloading, any asynchronous operations started while handling this event are not guaranteed to complete. If more activity for the event page occurs before it gets unloaded the onSuspendCanceled event will be sent and the page won't be unloaded.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onSuspend-callback" class="dcc-code-sections__label">

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

<div>

<div class="notranslate">

### onSuspendCanceled

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onSuspendCanceled.addListener(
  callback: function,
)
```

Sent after onSuspend to indicate that the app won't be unloaded after all.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onSuspendCanceled-callback" class="dcc-code-sections__label">

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

<div>

<div class="notranslate">

### onUpdateAvailable

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onUpdateAvailable.addListener(
  callback: function,
)
```

Fired when an update is available, but isn't installed immediately because the app is currently running. If you do nothing, the update will be installed the next time the background page gets unloaded, if you want it to be installed sooner you can explicitly call chrome.runtime.reload(). If your extension is using a persistent background page, the background page of course never gets unloaded, so unless you call chrome.runtime.reload() manually in response to this event the update will not get installed until the next time Chrome itself restarts. If no handlers are listening for this event, and your extension has a persistent background page, it behaves as if chrome.runtime.reload() is called in response to this event.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onUpdateAvailable-callback" class="dcc-code-sections__label">

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
  (details: object) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onUpdateAvailable-callback-details" class="dcc-code-sections__label">

    details

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onUpdateAvailable-callback-details-version" class="dcc-code-sections__label">

      version

      </div>

      <div class="dcc-type--xsmall">

      string

      </div>

      </div>

      The version number of the available update.

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onUserScriptConnect

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 115+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onUserScriptConnect.addListener(
  callback: function,
)
```

Fired when a connection is made from a user script from this extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onUserScriptConnect-callback" class="dcc-code-sections__label">

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
  (port: Port) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onUserScriptConnect-callback-port" class="dcc-code-sections__label">

    port

    </div>

    <div class="dcc-type--xsmall">

    [Port](#type-Port)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onUserScriptMessage

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 115+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.runtime.onUserScriptMessage.addListener(
  callback: function,
)
```

Fired when a message is sent from a user script associated with the same extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onUserScriptMessage-callback" class="dcc-code-sections__label">

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
  (message: any, sender: MessageSender, sendResponse: function) => boolean | undefined
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onUserScriptMessage-callback-message" class="dcc-code-sections__label">

    message

    </div>

    <div class="dcc-type--xsmall">

    any

    </div>

    </div>

  - <div>

    <div id="type-onUserScriptMessage-callback-sender" class="dcc-code-sections__label">

    sender

    </div>

    <div class="dcc-type--xsmall">

    [MessageSender](#type-MessageSender)

    </div>

    </div>

  - <div>

    <div id="method-onUserScriptMessage-callback-sendResponse" class="dcc-code-sections__label">

    sendResponse

    </div>

    <div class="dcc-type--xsmall">

    function

    </div>

    </div>

    The `sendResponse` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

    <div>

    </div>

    ``` devsite-click-to-copy
    (response?: any) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-onUserScriptMessage-callback-sendResponse-response" class="dcc-code-sections__label">

      response

      </div>

      <div class="dcc-type--xsmall">

      any <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      The response to return to the message sender.

    </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-onUserScriptMessage-callback" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    boolean \| undefined

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

Last updated 2024-02-06 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2024-02-06 UTC."\],\[\],\[\]\]

</div>

</div>