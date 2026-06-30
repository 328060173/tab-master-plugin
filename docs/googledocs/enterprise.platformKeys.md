> 来源: https://developer.chrome.com/docs/extensions/reference/api/enterprise/platformKeys
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

# chrome.enterprise.platformKeys <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

<div class="aside">

This API is only for [extensions installed by a policy](https://support.google.com/chrome/a/answer/1375694).

</div>

<div class="aside note">

**Important:** This API works **only on ChromeOS**.

</div>

## Description

<div class="dcc-reference">

Use the `chrome.enterprise.platformKeys` API to generate keys and install certificates for these keys. The certificates will be managed by the platform and can be used for TLS authentication, network access or by other extension through chrome.platformKeys.

</div>

## Permissions

<div class="dcc-reference">

`enterprise.platformKeys`\

</div>

## Availability

<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--pink dcc-tag-pill"> ChromeOS only </span> [<span class="dcc-tag-pill--purple dcc-tag-pill" title="Only available to policy installed extensions"> Requires policy </span>](https://support.google.com/chrome/a/answer/9296680)

</div>

</div>

</div>

## Concepts and usage

Typical usage of this API to enroll a client certificate follows these steps:

- Get all available tokens using [`enterprise.platformKeys.getTokens()`](#method-getTokens).

- Find the Token with `id` equal to `"user"`. Use this Token subsequently.

- Generate a key pair using the `generateKey()` Token method (defined in SubtleCrypto). This will return handle to the key.

- Export the public key using the `exportKey()` Token method (defined in SubtleCrypto).

- Create the signature of the certification request's data using the `sign()` Token method (defined in SubtleCrypto).

- Complete the certification request and send it to the certification authority.

- If a certificate is received, import it using \[`enterprise.platformKeys.importCertificate()`\`\[3\]

Here's an example that shows the major API interaction except the building and sending of the certification request:

<div>

</div>

``` devsite-click-to-copy
function getUserToken(callback) {
  chrome.enterprise.platformKeys.getTokens(function(tokens) {
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].id == "user") {
        callback(tokens[i]);
        return;
      }
    }
    callback(undefined);
  });
}

function generateAndSign(userToken) {
  var data = new Uint8Array([0, 5, 1, 2, 3, 4, 5, 6]);
  var algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    // RsaHashedKeyGenParams
    modulusLength: 2048,
    publicExponent:
        new Uint8Array([0x01, 0x00, 0x01]),  // Equivalent to 65537
    hash: {
      name: "SHA-256",
    }
  };
  var cachedKeyPair;
  userToken.subtleCrypto.generateKey(algorithm, false, ["sign"])
    .then(function(keyPair) {
            cachedKeyPair = keyPair;
            return userToken.subtleCrypto.exportKey("spki", keyPair.publicKey);
          },
          console.log.bind(console))
    .then(function(publicKeySpki) {
            // Build the Certification Request using the public key.
            return userToken.subtleCrypto.sign(
                {name : "RSASSA-PKCS1-v1_5"}, cachedKeyPair.privateKey, data);
          },
          console.log.bind(console))
    .then(function(signature) {
              // Complete the Certification Request with |signature|.
              // Send out the request to the CA, calling back
              // onClientCertificateReceived.
          },
          console.log.bind(console));
}

function onClientCertificateReceived(userToken, certificate) {
  chrome.enterprise.platformKeys.importCertificate(userToken.id, certificate);
}

getUserToken(generateAndSign);
```

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### Algorithm

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 110+ </span>

</div>

</div>

Type of key to generate.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"RSA"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ECDSA"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### ChallengeKeyOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 110+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ChallengeKeyOptions-challenge" class="dcc-code-sections__label">

  challenge

  </div>

  <div class="dcc-type--xsmall">

  ArrayBuffer

  </div>

  </div>

  A challenge as emitted by the Verified Access Web API.

- <div>

  <div id="property-ChallengeKeyOptions-registerKey" class="dcc-code-sections__label">

  registerKey

  </div>

  <div class="dcc-type--xsmall">

  [RegisterKeyOptions](#type-RegisterKeyOptions) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If present, registers the challenged key with the specified `scope`'s token. The key can then be associated with a certificate and used like any other signing key. Subsequent calls to this function will then generate a new Enterprise Key in the specified `scope`.

- <div>

  <div id="property-ChallengeKeyOptions-scope" class="dcc-code-sections__label">

  scope

  </div>

  <div class="dcc-type--xsmall">

  [Scope](#type-Scope)

  </div>

  </div>

  Which Enterprise Key to challenge.

</div>

<div>

<div class="notranslate">

### RegisterKeyOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 110+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-RegisterKeyOptions-algorithm" class="dcc-code-sections__label">

  algorithm

  </div>

  <div class="dcc-type--xsmall">

  [Algorithm](#type-Algorithm)

  </div>

  </div>

  Which algorithm the registered key should use.

</div>

<div>

<div class="notranslate">

### Scope

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 110+ </span>

</div>

</div>

Whether to use the Enterprise User Key or the Enterprise Machine Key.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"USER"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"MACHINE"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### Token

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Token-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Uniquely identifies this `Token`.

  Static IDs are `"user"` and `"system"`, referring to the platform's user-specific and the system-wide hardware token, respectively. Any other tokens (with other identifiers) might be returned by [`enterprise.platformKeys.getTokens`](#method-getTokens).

- <div>

  <div id="property-Token-softwareBackedSubtleCrypto" class="dcc-code-sections__label">

  softwareBackedSubtleCrypto

  </div>

  <div class="dcc-type--xsmall">

  SubtleCrypto

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 97+ </span>

  </div>

  </div>

  Implements the WebCrypto's [SubtleCrypto](https://www.w3.org/TR/WebCryptoAPI/#subtlecrypto-interface) interface. The cryptographic operations, including key generation, are software-backed. Protection of the keys, and thus implementation of the non-extractable property, is done in software, so the keys are less protected than hardware-backed keys.

  Only non-extractable keys can be generated. The only supported key type is RSASSA-PKCS1-V1_5 with `modulusLength` up to 2048. Each key can be used for signing data at most once, unless the extension is allowlisted through the [KeyPermissions policy](https://chromeenterprise.google/policies/#KeyPermissions), in which case the key can be used indefinitely.

  Keys generated on a specific `Token` cannot be used with any other Tokens, nor can they be used with `window.crypto.subtle`. Equally, `Key` objects created with `window.crypto.subtle` cannot be used with this interface.

- <div>

  <div id="property-Token-subtleCrypto" class="dcc-code-sections__label">

  subtleCrypto

  </div>

  <div class="dcc-type--xsmall">

  SubtleCrypto

  </div>

  </div>

  Implements the WebCrypto's [SubtleCrypto](https://www.w3.org/TR/WebCryptoAPI/#subtlecrypto-interface) interface. The cryptographic operations, including key generation, are hardware-backed.

  Only non-extractable keys can be generated. The supported key types are RSASSA-PKCS1-V1_5 with `modulusLength` up to 2048 and ECDSA with `namedCurve` P-256. Each key can be used for signing data at most once, unless the extension is allowlisted by the [KeyPermissions policy](https://chromeenterprise.google/policies/#KeyPermissions), in which case the key can be used indefinitely.

  Keys generated on a specific `Token` cannot be used with any other Tokens, nor can they be used with `window.crypto.subtle`. Equally, `Key` objects created with `window.crypto.subtle` cannot be used with this interface.

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### challengeKey()

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
chrome.enterprise.platformKeys.challengeKey(
  options: ChallengeKeyOptions,
): Promise<ArrayBuffer>
```

Similar to `challengeMachineKey` and `challengeUserKey`, but allows specifying the algorithm of a registered key. Challenges a hardware-backed Enterprise Machine Key and emits the response as part of a remote attestation protocol. Only useful on ChromeOS and in conjunction with the Verified Access Web API which both issues challenges and verifies responses.

A successful verification by the Verified Access Web API is a strong signal that the current device is a legitimate ChromeOS device, the current device is managed by the domain specified during verification, the current signed-in user is managed by the domain specified during verification, and the current device state complies with enterprise device policy. For example, a policy may specify that the device must not be in developer mode. Any device identity emitted by the verification is tightly bound to the hardware of the current device. If `"user"` Scope is specified, the identity is also tightly bound to the current signed-in user.

This function is highly restricted and will fail if the current device is not managed, the current user is not managed, or if this operation has not explicitly been enabled for the caller by enterprise device policy. The challenged key does not reside in the `"system"` or `"user"` token and is not accessible by any other API.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-challengeKey-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [ChallengeKeyOptions](#type-ChallengeKeyOptions)

  </div>

  </div>

  Object containing the fields defined in [`ChallengeKeyOptions`](#type-ChallengeKeyOptions).

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<ArrayBuffer\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 131+ </span>

  </div>

  </div>

  Returns a Promise which resolves with the challenge response.

</div>

<div>

<div class="notranslate">

### challengeMachineKey()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 50+ </span><span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 110</span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.enterprise.platformKeys.challengeMachineKey(
  challenge: ArrayBuffer,
  registerKey?: boolean,
): Promise<ArrayBuffer>
```

Use [`challengeKey`](#method-challengeKey) instead.

Challenges a hardware-backed Enterprise Machine Key and emits the response as part of a remote attestation protocol. Only useful on ChromeOS and in conjunction with the Verified Access Web API which both issues challenges and verifies responses. A successful verification by the Verified Access Web API is a strong signal of all of the following: \* The current device is a legitimate ChromeOS device. \* The current device is managed by the domain specified during verification. \* The current signed-in user is managed by the domain specified during verification. \* The current device state complies with enterprise device policy. For example, a policy may specify that the device must not be in developer mode. \* Any device identity emitted by the verification is tightly bound to the hardware of the current device. This function is highly restricted and will fail if the current device is not managed, the current user is not managed, or if this operation has not explicitly been enabled for the caller by enterprise device policy. The Enterprise Machine Key does not reside in the `"system"` token and is not accessible by any other API.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-challengeMachineKey-challenge" class="dcc-code-sections__label">

  challenge

  </div>

  <div class="dcc-type--xsmall">

  ArrayBuffer

  </div>

  </div>

  A challenge as emitted by the Verified Access Web API.

- <div>

  <div id="type-challengeMachineKey-registerKey" class="dcc-code-sections__label">

  registerKey

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 59+ </span>

  </div>

  </div>

  If set, the current Enterprise Machine Key is registered with the `"system"` token and relinquishes the Enterprise Machine Key role. The key can then be associated with a certificate and used like any other signing key. This key is 2048-bit RSA. Subsequent calls to this function will then generate a new Enterprise Machine Key.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<ArrayBuffer\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 131+ </span>

  </div>

  </div>

  Returns a Promise which resolves with the challenge response.

</div>

<div>

<div class="notranslate">

### challengeUserKey()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 50+ </span><span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 110</span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.enterprise.platformKeys.challengeUserKey(
  challenge: ArrayBuffer,
  registerKey: boolean,
): Promise<ArrayBuffer>
```

Use [`challengeKey`](#method-challengeKey) instead.

Challenges a hardware-backed Enterprise User Key and emits the response as part of a remote attestation protocol. Only useful on ChromeOS and in conjunction with the Verified Access Web API which both issues challenges and verifies responses. A successful verification by the Verified Access Web API is a strong signal of all of the following: \* The current device is a legitimate ChromeOS device. \* The current device is managed by the domain specified during verification. \* The current signed-in user is managed by the domain specified during verification. \* The current device state complies with enterprise user policy. For example, a policy may specify that the device must not be in developer mode. \* The public key emitted by the verification is tightly bound to the hardware of the current device and to the current signed-in user. This function is highly restricted and will fail if the current device is not managed, the current user is not managed, or if this operation has not explicitly been enabled for the caller by enterprise user policy. The Enterprise User Key does not reside in the `"user"` token and is not accessible by any other API.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-challengeUserKey-challenge" class="dcc-code-sections__label">

  challenge

  </div>

  <div class="dcc-type--xsmall">

  ArrayBuffer

  </div>

  </div>

  A challenge as emitted by the Verified Access Web API.

- <div>

  <div id="type-challengeUserKey-registerKey" class="dcc-code-sections__label">

  registerKey

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  If set, the current Enterprise User Key is registered with the `"user"` token and relinquishes the Enterprise User Key role. The key can then be associated with a certificate and used like any other signing key. This key is 2048-bit RSA. Subsequent calls to this function will then generate a new Enterprise User Key.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<ArrayBuffer\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 131+ </span>

  </div>

  </div>

  Returns a Promise which resolves with the challenge response.

</div>

<div>

<div class="notranslate">

### getCertificates()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.enterprise.platformKeys.getCertificates(
  tokenId: string,
): Promise<ArrayBuffer[]>
```

Returns the list of all client certificates available from the given token. Can be used to check for the existence and expiration of client certificates that are usable for a certain authentication.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getCertificates-tokenId" class="dcc-code-sections__label">

  tokenId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The id of a Token returned by `getTokens`.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<ArrayBuffer\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 131+ </span>

  </div>

  </div>

  Returns a Promise which resolves with the list of the available certificates.

</div>

<div>

<div class="notranslate">

### getTokens()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.enterprise.platformKeys.getTokens(): Promise<Token[]>
```

Returns the available Tokens. In a regular user's session the list will always contain the user's token with `id` `"user"`. If a system-wide TPM token is available, the returned list will also contain the system-wide token with `id` `"system"`. The system-wide token will be the same for all sessions on this device (device in the sense of e.g. a Chromebook).

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Token](#type-Token)\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 131+ </span>

  </div>

  </div>

  Invoked by `getTokens` with the list of available Tokens.

</div>

<div>

<div class="notranslate">

### importCertificate()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.enterprise.platformKeys.importCertificate(
  tokenId: string,
  certificate: ArrayBuffer,
): Promise<void>
```

Imports `certificate` to the given token if the certified key is already stored in this token. After a successful certification request, this function should be used to store the obtained certificate and to make it available to the operating system and browser for authentication.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-importCertificate-tokenId" class="dcc-code-sections__label">

  tokenId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The id of a Token returned by `getTokens`.

- <div>

  <div id="type-importCertificate-certificate" class="dcc-code-sections__label">

  certificate

  </div>

  <div class="dcc-type--xsmall">

  ArrayBuffer

  </div>

  </div>

  The DER encoding of a X.509 certificate.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 131+ </span>

  </div>

  </div>

  Returns a Promise which resolves when this operation is finished.

</div>

<div>

<div class="notranslate">

### removeCertificate()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.enterprise.platformKeys.removeCertificate(
  tokenId: string,
  certificate: ArrayBuffer,
): Promise<void>
```

Removes `certificate` from the given token if present. Should be used to remove obsolete certificates so that they are not considered during authentication and do not clutter the certificate choice. Should be used to free storage in the certificate store.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-removeCertificate-tokenId" class="dcc-code-sections__label">

  tokenId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The id of a Token returned by `getTokens`.

- <div>

  <div id="type-removeCertificate-certificate" class="dcc-code-sections__label">

  certificate

  </div>

  <div class="dcc-type--xsmall">

  ArrayBuffer

  </div>

  </div>

  The DER encoding of a X.509 certificate.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 131+ </span>

  </div>

  </div>

  Returns a Promise which resolves when this operation is finished.

</div>

</div>

</div>

</div>

<div class="devsite-floating-action-buttons">

</div>

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-02-25 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-02-25 UTC."\],\[\],\[\]\]

</div>

</div>