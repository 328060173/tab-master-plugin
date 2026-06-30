> 来源: https://developer.chrome.com/docs/extensions/reference/api/permissions
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

# chrome.permissions <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.permissions` API to request [declared optional permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions) at run time rather than install time, so users understand why the permissions are needed and grant only those that are necessary.

</div>

## Concepts and usage

Permission warnings exist to describe the capabilities granted by an API, but some of these warnings may not be obvious. The Permissions API allows developers to explain permission warnings and introduce new features gradually which gives users a risk-free introduction to the extension. This way, users can specify how much access they are willing to grant and which features they want to enable.

For example, the [optional permissions extension's](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/sample.optional_permissions) core functionality is overriding the new tab page. One feature is displaying the user's goal of the day. This feature only requires the [storage](/docs/extensions/reference/api/storage) permission, which does not include a warning. The extension has an additional feature, that users can enable by clicking the following button:

<figure>
<img src="/static/docs/extensions/reference/api/permissions/images/extension-button-enables-c53fe17733b8f.png" class="screenshot" width="395" alt="An extension button that enables additional features." />
<figcaption aria-hidden="true">An extension button that enables additional features.</figcaption>
</figure>

Displaying the user's top sites requires the [topSites](/docs/extensions/reference/api/topSites) permission, which has the following warning.

<figure>
<img src="/static/docs/extensions/reference/api/permissions/images/extension-warning-topsit-8927d6b7cb863.png" class="screenshot" width="480" alt="Axtension warning for topSites API." />
<figcaption>An extension warning for <code translate="no" dir="ltr">topSites</code> API</figcaption>
</figure>

### Implement optional permissions

#### Step 1: Decide which permissions are required and which are optional

An extension can declare both required and optional permissions. In general, you should:

- Use required permissions when they are needed for your extension's basic functionality.
- Use optional permissions when they are needed for optional features in your extension.

Advantages of *required* permissions:

- **Fewer prompts:** An extension can prompt the user once to accept all permissions.
- **Simpler development:** Required permissions are guaranteed to be present.

Advantages of *optional* permissions:

- **Better security:** Extensions run with fewer permissions since users only enable permissions that are needed.
- **Better information for users:** An extension can explain why it needs a particular permission when the user enables the relevant feature.
- **Easier upgrades:** When you upgrade your extension, Chrome won't disable it for your users if the upgrade adds optional rather than required permissions.

#### Step 2: Declare optional permissions in the manifest

Declare optional permissions in your [extension manifest](/docs/extensions/reference/manifest) with the `optional_permissions` key, using the same format as the [permissions](/docs/extensions/develop/concepts/declare-permissions) field:

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "optional_permissions": ["tabs"],
  "optional_host_permissions": ["https://www.google.com/"],
  ...
}
```

If you want to request hosts that you only discover at runtime, include `"https://*/*"` in your extension's `optional_host_permissions` field. This lets you specify any origin in [`"Permissions.origins"`](#property-Permissions-origins) as long as it has a matching scheme.

**Permissions that can *not* be specified as optional**

Most Chrome extension permissions can be specified as optional, with the following exceptions.

|  |  |
|----|----|
| Permission | Description |
| `"debugger"` | The [chrome.debugger](/docs/extensions/reference/api/debugger) API serves as an alternate transport for Chrome's [remote debugging protocol](https://chromedevtools.github.io/devtools-protocol/). |
| `"declarativeNetRequest"` | Grants the extension access to the [chrome.declarativeNetRequest](/docs/extensions/reference/api/declarativeNetRequest) API. |
| `"devtools"` | Allows extension to expand [Chrome DevTools](/docs/extensions/how-to/devtools/extend-devtools) functionality. |
| `"geolocation"` | Allows the extension to use the HTML5 [geolocation](https://w3c.github.io/geolocation-api/) API. |
| `"mdns"` | Grants the extension access to the [chrome.mdns](/docs/apps/reference/mdns) API. |
| `"proxy"` | Grants the extension access to the [chrome.proxy](/docs/extensions/reference/api/proxy) API to manage Chrome's proxy settings. |
| `"tts"` | The [chrome.tts](/docs/extensions/reference/api/tts) API plays synthesized text-to-speech (TTS). |
| `"ttsEngine"` | The [chrome.ttsEngine](/docs/extensions/reference/api/ttsEngine) API implements a text-to-speech (TTS) engine using an extension. |
| `"wallpaper"` | **ChromeOS only**. Use the [chrome.wallpaper](/docs/extensions/reference/api/wallpaper) API change the ChromeOS wallpaper. |

View [Declare Permissions](/docs/extensions/develop/concepts/declare-permissions) for further information on available permissions and their warnings.

#### Step 3: Request optional permissions

Request the permissions from within a user gesture using `permissions.request()`:

<div>

</div>

``` devsite-click-to-copy
document.querySelector('#my-button').addEventListener('click', (event) => {
  // Permissions must be requested from inside a user gesture, like a button's
  // click handler.
  chrome.permissions.request({
    permissions: ['tabs'],
    origins: ['https://www.google.com/']
  }, (granted) => {
    // The callback argument will be true if the user granted the permissions.
    if (granted) {
      doSomething();
    } else {
      doSomethingElse();
    }
  });
});
```

Chrome prompts the user if adding the permissions results in different [warning messages](/docs/extensions/develop/concepts/declare-permissions) than the user has already seen and accepted. For example, the previous code might result in a prompt like this:

<figure>
<img src="/static/docs/extensions/reference/api/permissions/images/perms-optional.png" class="screenshot" width="490" alt="An example permission confirmation prompt." />
<figcaption aria-hidden="true">An example permission confirmation prompt.</figcaption>
</figure>

#### Step 4: Check the extension's current permissions

To check whether your extension has a specific permission or set of permissions, use `permission.contains()`:

<div>

</div>

``` devsite-click-to-copy
chrome.permissions.contains({
  permissions: ['tabs'],
  origins: ['https://www.google.com/']
}, (result) => {
  if (result) {
    // The extension has the permissions.
  } else {
    // The extension doesn't have the permissions.
  }
});
```

#### Step 5: Remove the permissions

You should remove permissions when you no longer need them. After a permission has been removed, calling `permissions.request()` usually adds the permission back without prompting the user.

<div>

</div>

``` devsite-click-to-copy
chrome.permissions.remove({
  permissions: ['tabs'],
  origins: ['https://www.google.com/']
}, (removed) => {
  if (removed) {
    // The permissions have been removed.
  } else {
    // The permissions have not been removed (e.g., you tried to remove
    // required permissions).
  }
});
```

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### Permissions

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Permissions-origins" class="dcc-code-sections__label">

  origins

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The list of host permissions, including those specified in the `optional_permissions` or `permissions` keys in the manifest, and those associated with [Content Scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts).

- <div>

  <div id="property-Permissions-permissions" class="dcc-code-sections__label">

  permissions

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  List of named permissions (does not include hosts or origins).

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### addHostAccessRequest()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 133+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.permissions.addHostAccessRequest(
  request: object,
): Promise<void>
```

Adds a host access request. Request will only be signaled to the user if extension can be granted access to the host in the request. Request will be reset on cross-origin navigation. When accepted, grants persistent access to the site’s top origin

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-addHostAccessRequest-request" class="dcc-code-sections__label">

  request

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-addHostAccessRequest-request-documentId" class="dcc-code-sections__label">

    documentId

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The id of a document where host access requests can be shown. Must be the top-level document within a tab. If provided, the request is shown on the tab of the specified document and is removed when the document navigates to a new origin. Adding a new request will override any existent request for `tabId`. This or `tabId` must be specified.

  - <div>

    <div id="property-addHostAccessRequest-request-pattern" class="dcc-code-sections__label">

    pattern

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The URL pattern where host access requests can be shown. If provided, host access requests will only be shown on URLs that match this pattern.

  - <div>

    <div id="property-addHostAccessRequest-request-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The id of the tab where host access requests can be shown. If provided, the request is shown on the specified tab and is removed when the tab navigates to a new origin. Adding a new request will override an existent request for `documentId`. This or `documentId` must be specified.

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

### contains()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.permissions.contains(
  permissions: Permissions,
): Promise<boolean>
```

Checks if the extension has the specified permissions.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-contains-permissions" class="dcc-code-sections__label">

  permissions

  </div>

  <div class="dcc-type--xsmall">

  [Permissions](#type-Permissions)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<boolean\>

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

### getAll()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.permissions.getAll(): Promise<Permissions>
```

Gets the extension's current set of permissions.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Permissions](#type-Permissions)\>

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

### remove()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.permissions.remove(
  permissions: Permissions,
): Promise<boolean>
```

Removes access to the specified permissions. If there are any problems removing the permissions, the promise will be rejected.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-remove-permissions" class="dcc-code-sections__label">

  permissions

  </div>

  <div class="dcc-type--xsmall">

  [Permissions](#type-Permissions)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<boolean\>

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

### removeHostAccessRequest()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 133+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.permissions.removeHostAccessRequest(
  request: object,
): Promise<void>
```

Removes a host access request, if existent.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-removeHostAccessRequest-request" class="dcc-code-sections__label">

  request

  </div>

  <div class="dcc-type--xsmall">

  object

  </div>

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="property-removeHostAccessRequest-request-documentId" class="dcc-code-sections__label">

    documentId

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The id of a document where host access request will be removed. Must be the top-level document within a tab. This or `tabId` must be specified.

  - <div>

    <div id="property-removeHostAccessRequest-request-pattern" class="dcc-code-sections__label">

    pattern

    </div>

    <div class="dcc-type--xsmall">

    string <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The URL pattern where host access request will be removed. If provided, this must exactly match the pattern of an existing host access request.

  - <div>

    <div id="property-removeHostAccessRequest-request-tabId" class="dcc-code-sections__label">

    tabId

    </div>

    <div class="dcc-type--xsmall">

    number <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    The id of the tab where host access request will be removed. This or `documentId` must be specified.

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

### request()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.permissions.request(
  permissions: Permissions,
): Promise<boolean>
```

Requests access to the specified permissions, displaying a prompt to the user if necessary. These permissions must either be defined in the `optional_permissions` field of the manifest or be required permissions that were withheld by the user. Paths on origin patterns will be ignored. You can request subsets of optional origin permissions; for example, if you specify `*://*\/*` in the `optional_permissions` section of the manifest, you can request `http://example.com/`. If there are any problems requesting the permissions, the promise will be rejected.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-request-permissions" class="dcc-code-sections__label">

  permissions

  </div>

  <div class="dcc-type--xsmall">

  [Permissions](#type-Permissions)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<boolean\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 96+ </span>

  </div>

  </div>

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onAdded

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.permissions.onAdded.addListener(
  callback: function,
)
```

Fired when the extension acquires new permissions.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onAdded-callback" class="dcc-code-sections__label">

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
  (permissions: Permissions) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onAdded-callback-permissions" class="dcc-code-sections__label">

    permissions

    </div>

    <div class="dcc-type--xsmall">

    [Permissions](#type-Permissions)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onRemoved

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.permissions.onRemoved.addListener(
  callback: function,
)
```

Fired when access to permissions has been removed from the extension.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onRemoved-callback" class="dcc-code-sections__label">

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
  (permissions: Permissions) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onRemoved-callback-permissions" class="dcc-code-sections__label">

    permissions

    </div>

    <div class="dcc-type--xsmall">

    [Permissions](#type-Permissions)

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

Last updated 2026-01-07 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-01-07 UTC."\],\[\],\[\]\]

</div>

</div>