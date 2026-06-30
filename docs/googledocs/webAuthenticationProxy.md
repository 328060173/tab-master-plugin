> 来源: https://developer.chrome.com/docs/extensions/reference/api/webAuthenticationProxy
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

# chrome.webAuthenticationProxy <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

The `chrome.webAuthenticationProxy` API lets remote desktop software running on a remote host intercept Web Authentication API (WebAuthn) requests in order to handle them on a local client.

</div>

## Permissions

<div class="dcc-reference">

`webAuthenticationProxy`\

</div>

## Availability

<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 115+ </span><span class="dcc-tag-pill--purple dcc-tag-pill" title="Minimum manifest version">MV3+ </span>

</div>

</div>

</div>

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### CreateRequest

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-CreateRequest-requestDetailsJson" class="dcc-code-sections__label">

  requestDetailsJson

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The `PublicKeyCredentialCreationOptions` passed to `navigator.credentials.create()`, serialized as a JSON string. The serialization format is compatible with [`PublicKeyCredential.parseCreationOptionsFromJSON()`](https://w3c.github.io/webauthn/#sctn-parseCreationOptionsFromJSON).

- <div>

  <div id="property-CreateRequest-requestId" class="dcc-code-sections__label">

  requestId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  An opaque identifier for the request.

</div>

<div>

<div class="notranslate">

### CreateResponseDetails

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-CreateResponseDetails-error" class="dcc-code-sections__label">

  error

  </div>

  <div class="dcc-type--xsmall">

  [DOMExceptionDetails](#type-DOMExceptionDetails) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The `DOMException` yielded by the remote request, if any.

- <div>

  <div id="property-CreateResponseDetails-requestId" class="dcc-code-sections__label">

  requestId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The `requestId` of the `CreateRequest`.

- <div>

  <div id="property-CreateResponseDetails-responseJson" class="dcc-code-sections__label">

  responseJson

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The `PublicKeyCredential`, yielded by the remote request, if any, serialized as a JSON string by calling href="https://w3c.github.io/webauthn/#dom-publickeycredential-tojson"\> `PublicKeyCredential.toJSON()`.

</div>

<div>

<div class="notranslate">

### DOMExceptionDetails

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-DOMExceptionDetails-message" class="dcc-code-sections__label">

  message

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

- <div>

  <div id="property-DOMExceptionDetails-name" class="dcc-code-sections__label">

  name

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### GetRequest

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-GetRequest-requestDetailsJson" class="dcc-code-sections__label">

  requestDetailsJson

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The `PublicKeyCredentialRequestOptions` passed to `navigator.credentials.get()`, serialized as a JSON string. The serialization format is compatible with [`PublicKeyCredential.parseRequestOptionsFromJSON()`](https://w3c.github.io/webauthn/#sctn-parseRequestOptionsFromJSON).

- <div>

  <div id="property-GetRequest-requestId" class="dcc-code-sections__label">

  requestId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  An opaque identifier for the request.

</div>

<div>

<div class="notranslate">

### GetResponseDetails

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-GetResponseDetails-error" class="dcc-code-sections__label">

  error

  </div>

  <div class="dcc-type--xsmall">

  [DOMExceptionDetails](#type-DOMExceptionDetails) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The `DOMException` yielded by the remote request, if any.

- <div>

  <div id="property-GetResponseDetails-requestId" class="dcc-code-sections__label">

  requestId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The `requestId` of the `CreateRequest`.

- <div>

  <div id="property-GetResponseDetails-responseJson" class="dcc-code-sections__label">

  responseJson

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The `PublicKeyCredential`, yielded by the remote request, if any, serialized as a JSON string by calling href="https://w3c.github.io/webauthn/#dom-publickeycredential-tojson"\> `PublicKeyCredential.toJSON()`.

</div>

<div>

<div class="notranslate">

### IsUvpaaRequest

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-IsUvpaaRequest-requestId" class="dcc-code-sections__label">

  requestId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  An opaque identifier for the request.

</div>

<div>

<div class="notranslate">

### IsUvpaaResponseDetails

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-IsUvpaaResponseDetails-isUvpaa" class="dcc-code-sections__label">

  isUvpaa

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

- <div>

  <div id="property-IsUvpaaResponseDetails-requestId" class="dcc-code-sections__label">

  requestId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### attach()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.webAuthenticationProxy.attach(): Promise<string | undefined>
```

Makes this extension the active Web Authentication API request proxy.

Remote desktop extensions typically call this method after detecting attachment of a remote session to this host. Once this method returns without error, regular processing of WebAuthn requests is suspended, and events from this extension API are raised.

This method fails with an error if a different extension is already attached.

The attached extension must call `detach()` once the remote desktop session has ended in order to resume regular WebAuthn request processing. Extensions automatically become detached if they are unloaded.

Refer to the `onRemoteSessionStateChange` event for signaling a change of remote session attachment from a native application to to the (possibly suspended) extension.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<string \| undefined\>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### completeCreateRequest()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.webAuthenticationProxy.completeCreateRequest(
  details: CreateResponseDetails,
): Promise<void>
```

Reports the result of a `navigator.credentials.create()` call. The extension must call this for every `onCreateRequest` event it has received, unless the request was canceled (in which case, an `onRequestCanceled` event is fired).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-completeCreateRequest-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  [CreateResponseDetails](#type-CreateResponseDetails)

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

</div>

<div>

<div class="notranslate">

### completeGetRequest()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.webAuthenticationProxy.completeGetRequest(
  details: GetResponseDetails,
): Promise<void>
```

Reports the result of a `navigator.credentials.get()` call. The extension must call this for every `onGetRequest` event it has received, unless the request was canceled (in which case, an `onRequestCanceled` event is fired).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-completeGetRequest-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  [GetResponseDetails](#type-GetResponseDetails)

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

</div>

<div>

<div class="notranslate">

### completeIsUvpaaRequest()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.webAuthenticationProxy.completeIsUvpaaRequest(
  details: IsUvpaaResponseDetails,
): Promise<void>
```

Reports the result of a `PublicKeyCredential.isUserVerifyingPlatformAuthenticator()` call. The extension must call this for every `onIsUvpaaRequest` event it has received.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-completeIsUvpaaRequest-details" class="dcc-code-sections__label">

  details

  </div>

  <div class="dcc-type--xsmall">

  [IsUvpaaResponseDetails](#type-IsUvpaaResponseDetails)

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

</div>

<div>

<div class="notranslate">

### detach()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.webAuthenticationProxy.detach(): Promise<string | undefined>
```

Removes this extension from being the active Web Authentication API request proxy.

This method is typically called when the extension detects that a remote desktop session was terminated. Once this method returns, the extension ceases to be the active Web Authentication API request proxy.

Refer to the `onRemoteSessionStateChange` event for signaling a change of remote session attachment from a native application to to the (possibly suspended) extension.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<string \| undefined\>

  </div>

  </div>

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onCreateRequest

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.webAuthenticationProxy.onCreateRequest.addListener(
  callback: function,
)
```

Fires when a WebAuthn `navigator.credentials.create()` call occurs. The extension must supply a response by calling `completeCreateRequest()` with the `requestId` from `requestInfo`.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onCreateRequest-callback" class="dcc-code-sections__label">

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
  (requestInfo: CreateRequest) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onCreateRequest-callback-requestInfo" class="dcc-code-sections__label">

    requestInfo

    </div>

    <div class="dcc-type--xsmall">

    [CreateRequest](#type-CreateRequest)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onGetRequest

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.webAuthenticationProxy.onGetRequest.addListener(
  callback: function,
)
```

Fires when a WebAuthn navigator.credentials.get() call occurs. The extension must supply a response by calling `completeGetRequest()` with the `requestId` from `requestInfo`

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onGetRequest-callback" class="dcc-code-sections__label">

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
  (requestInfo: GetRequest) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onGetRequest-callback-requestInfo" class="dcc-code-sections__label">

    requestInfo

    </div>

    <div class="dcc-type--xsmall">

    [GetRequest](#type-GetRequest)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onIsUvpaaRequest

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.webAuthenticationProxy.onIsUvpaaRequest.addListener(
  callback: function,
)
```

Fires when a `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` call occurs. The extension must supply a response by calling `completeIsUvpaaRequest()` with the `requestId` from `requestInfo`

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onIsUvpaaRequest-callback" class="dcc-code-sections__label">

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
  (requestInfo: IsUvpaaRequest) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onIsUvpaaRequest-callback-requestInfo" class="dcc-code-sections__label">

    requestInfo

    </div>

    <div class="dcc-type--xsmall">

    [IsUvpaaRequest](#type-IsUvpaaRequest)

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onRemoteSessionStateChange

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.webAuthenticationProxy.onRemoteSessionStateChange.addListener(
  callback: function,
)
```

A native application associated with this extension can cause this event to be fired by writing to a file with a name equal to the extension's ID in a directory named `WebAuthenticationProxyRemoteSessionStateChange` inside the [default user data directory](https://chromium.googlesource.com/chromium/src/+/main/docs/user_data_dir.md#default-location)

The contents of the file should be empty. I.e., it is not necessary to change the contents of the file in order to trigger this event.

The native host application may use this event mechanism to signal a possible remote session state change (i.e. from detached to attached, or vice versa) while the extension service worker is possibly suspended. In the handler for this event, the extension can call the `attach()` or `detach()` API methods accordingly.

The event listener must be registered synchronously at load time.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onRemoteSessionStateChange-callback" class="dcc-code-sections__label">

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

### onRequestCanceled

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.webAuthenticationProxy.onRequestCanceled.addListener(
  callback: function,
)
```

Fires when a `onCreateRequest` or `onGetRequest` event is canceled (because the WebAuthn request was aborted by the caller, or because it timed out). When receiving this event, the extension should cancel processing of the corresponding request on the client side. Extensions cannot complete a request once it has been canceled.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onRequestCanceled-callback" class="dcc-code-sections__label">

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
  (requestId: number) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onRequestCanceled-callback-requestId" class="dcc-code-sections__label">

    requestId

    </div>

    <div class="dcc-type--xsmall">

    number

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