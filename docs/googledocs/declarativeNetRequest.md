> 来源: https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest
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

# chrome.declarativeNetRequest <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

The `chrome.declarativeNetRequest` API is used to block or modify network requests by specifying declarative rules. This lets extensions modify network requests without intercepting them and viewing their content, thus providing more privacy.

</div>

## Permissions

<div class="dcc-reference">

`declarativeNetRequest`\
`declarativeNetRequestWithHostAccess`\

</div>

The "`declarativeNetRequest`" and "`declarativeNetRequestWithHostAccess`" permissions provide the same capabilities. The difference between them is when permissions are requested or granted.

`"declarativeNetRequest"`  
Triggers a permission warning at install time but provides implicit access to `allow`, `allowAllRequests` and `block` rules. Use this when possible to avoid needing to request full access to hosts.

`"declarativeNetRequestFeedback"`  
Enables debugging features for [unpacked extensions](/docs/extensions/get-started/tutorial/hello-world#load-unpacked), specifically [`getMatchedRules()`](#method-getMatchedRules) and [`onRuleMatchedDebug`](#event-onRuleMatchedDebug).

`"declarativeNetRequestWithHostAccess"`  
A permission warning is not shown at install time, but you must request host permissions before you can perform any action on a host. This is appropriate when you want to use declarative net request rules in an extension which already has host permissions without generating additional warnings.

## Availability

<div class="dcc-reference">

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 84+ </span>

</div>

</div>

</div>

## Manifest

In addition to the permissions described previously, certain types of rulesets, static rulesets specifically, require declaring the `"declarative_net_request"` manifest key, which should be a dictionary with a single key called `"rule_resources"`. This key is an array containing dictionaries of type `Ruleset`, as shown in the following. (Note that the name 'Ruleset' does not appear in the manifest's JSON since it is merely an array.) [Static rulesets](#rules) are explained later in this document.

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...

  "declarative_net_request" : {
    "rule_resources" : [{
      "id": "ruleset_1",
      "enabled": true,
      "path": "rules_1.json"
    }, {
      "id": "ruleset_2",
      "enabled": false,
      "path": "rules_2.json"
    }]
  },
  "permissions": [
    "declarativeNetRequest",
    "declarativeNetRequestFeedback"
  ],
  "host_permissions": [
    "http://www.blogger.com/*",
    "http://*.google.com/*"
  ],
  ...
}
```

## Rules and rulesets

To use this API, specify one or more rulesets. A ruleset contains an array of rules. A single rule does one of the following:

- Block a network request.
- Upgrade the schema (http to https).
- Prevent a request from getting blocked by negating any matching blocked rules.
- Redirect a network request.
- Modify request or response headers.

There are three types of rulesets, managed in slightly different ways.

Dynamic  
Persist across browser sessions and extension upgrades and are managed using JavaScript while an extension is in use.

Session  
Cleared when the browser shuts down and when a new version of the extension is installed. Session rules are managed using JavaScript while an extension is in use.

Static  
Packaged, installed, and updated when an extension is installed or upgraded. Static rules are stored in JSON-formatted rule files and listed in the manifest file.

### Dynamic and session-scoped rulesets

Dynamic and session rulesets are managed using JavaScript while an extension is in use.

- Dynamic rules persist across browser sessions and extension upgrades.
- Session rules are cleared when the browser shuts down and when a new version of the extension is installed.

There is only one each of these ruleset types. An extension can add or remove rules to them dynamically by calling [`updateDynamicRules()`](/docs/extensions/reference/declarativeNetRequest#method-updateDynamicRules) and [`updateSessionRules()`](/docs/extensions/reference/declarativeNetRequest#method-updateSessionRules), provided the rule limits aren't exceeded. For information on rule limits, see [Rule limits](#limits). You can see [an example of this](#update-dynamic-rule-examples) under [code examples](#code-examples).

### Static rulesets

Unlike dynamic and session rules, static rules are packaged, installed, and updated when an extension is installed or upgraded. They're stored in rule files in JSON format, which are indicated to the extension using the `"declarative_net_request"` and `"rule_resources"` keys [as described above](#manifest), as well as one or more [`Ruleset`](/docs/extensions/reference/declarativeNetRequest#type-Ruleset) dictionaries. A `Ruleset` dictionary contains a path to the rule file, an ID for the ruleset contained in the file, and whether the ruleset is enabled or disabled. The last two are important when you enable or disable a ruleset programmatically.

<div>

</div>

``` devsite-click-to-copy
{
  ...
  "declarative_net_request" : {
    "rule_resources" : [{
      "id": "ruleset_1",
      "enabled": true,
      "path": "rules_1.json"
    },
    ...
    ]
  }
  ...
}
```

To test rule files, [load your extension unpacked](/docs/extensions/mv3/getstarted/development-basics#load-unpacked). Errors and warnings about invalid static rules are only displayed for unpacked extensions. Invalid static rules in packed extensions are ignored.

## Expedited review

Changes to static rulesets may be eligible for expedited review. See [expedited review for eligible changes](/docs/webstore/expedited-review).

## Enable and disable static rules and rulesets

Both individual static rules and complete static rulesets may be enabled or disabled at runtime.

The set of enabled static rules and rulesets is persisted across browser sessions. Neither are persisted across extension updates, meaning that only rules you chose to leave in your rule files are available after an update.

For performance reasons there are also limits to the number of rules and rulesets that may be enabled at one time. Call [`getAvailableStaticRuleCount()`](#method-getAvailableStaticRuleCount) to check the number of additional rules that may be enabled. For information on rule limits, see [Rule limits](#limits).

To enable or disable static *rules*, call [`updateStaticRules()`](#method-updateStaticRules). This method takes an [`UpdateStaticRulesOptions`](#type-UpdateStaticRulesOptions) object, which contains arrays of IDs of rules to enable or disable. The IDs are defined using the `"id"` key of the `Ruleset` dictionary. There is a maximum limit of 5000 disabled static rules.

To enable or disable static *rulesets*, call [`updateEnabledRulesets()`](#method-updateEnabledRulesets). This method takes an [`UpdateRulesetOptions`](#type-UpdateRulesetOptions) object, which contains arrays of IDs of rulesets to enable or disable. The IDs are defined using the `"id"` key of the `Ruleset` dictionary.

## Build rules

Regardless of type, a rule starts with four fields as shown in the following. While the `"id"` and `"priority"` keys take a number, the [`"action"`](#property-Rule-action) and [`"condition"`](#property-Rule-condition) keys may provide several blocking and redirecting conditions. The following rule blocks all script requests originating from `"foo.com"` to any URL with `"abc"` as a substring.

<div>

</div>

``` devsite-click-to-copy
{
  "id" : 1,
  "priority": 1,
  "action" : { "type" : "block" },
  "condition" : {
    "urlFilter" : "abc",
    "initiatorDomains" : ["foo.com"],
    "resourceTypes" : ["script"]
  }
}
```

## URL matching

Declarative Net Request provides the ability to match URLs with either a pattern matching syntax or regular expressions.

### URL filter syntax

A rule's `"condition"` key allows a `"urlFilter"` key for acting on URLs under a specified domain. You create patterns using [pattern matching tokens](/docs/extensions/reference/declarativeNetRequest#property-RuleCondition-urlFilter). Here are a few examples.

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<tbody>
<tr>
<th><strong><code translate="no" dir="ltr">urlFilter</code></strong></th>
<th>Matches</th>
<th>Does not match</th>
</tr>
&#10;<tr>
<td><code translate="no" dir="ltr">"abc"</code></td>
<td>https://abcd.com<br />
https://example.com/abcd</td>
<td>https://ab.com</td>
</tr>
<tr>
<td><code translate="no" dir="ltr">"abc*d"</code></td>
<td>https://abcd.com<br />
https://example.com/abcxyzd</td>
<td>https://abc.com</td>
</tr>
<tr>
<td><code translate="no" dir="ltr">"||a.example.com"</code></td>
<td>https://a.example.com/<br />
https://b.a.example.com/xyz<br />
https://a.example.company</td>
<td>https://example.com/</td>
</tr>
<tr>
<td><code translate="no" dir="ltr">"|https*"</code></td>
<td>https://example.com</td>
<td>http://example.com/<br />
http://https.com</td>
</tr>
<tr>
<td><code translate="no" dir="ltr">"example*^123|"</code></td>
<td>https://example.com/123<br />
http://abc.com/example?123</td>
<td>https://example.com/1234<br />
https://abc.com/example0123</td>
</tr>
</tbody>
</table>

### Regular expressions

Conditions can also use regular expressions. See the [`"regexFilter"`](#property-RuleCondition-regexFilter) key. To learn about the limits that apply to these conditions, see [Rules that use regular expressions](#regex-rules).

### Write good URL conditions

Take care when writing rules to always match an entire domain. Otherwise, your rule may match in situations that are unexpected. For example, when using the pattern matching syntax:

- `google.com` incorrectly matches `https://example.com/?param=google.com`
- `||google.com` incorrectly matches `https://google.company`
- `https://www.google.com` incorrectly matches `https://example.com/?param=https://www.google.com`

Consider using:

- `||google.com/`, which matches all paths and all subdomains.
- `|https://www.google.com/` which matches all paths and no subdomains.

Similarly, use the `^` and `/` characters to anchor a regular expression. For example, `^https:\/\/www\.google\.com\/` matches any path on https://www.google.com.

## Rule evaluation

DNR rules are applied by the browser across various stages of the network request lifecycle.

### Before the request

Before a request is made, an extension can block or redirect (including upgrading the scheme from HTTP to HTTPS) it with a matching rule.

For each extension, the browser determines a list of matching rules. Rules with a `modifyHeaders` action are not included here as they will be handled later. Additionally, rules with a `responseHeaders` condition will be considered later (when response headers are available) and are not included.

Then, for each extension, Chrome picks at most one candidate per request. Chrome finds a matching rule, by ordering all matching rules by priority. Rules with the same priority are ordered by action (`allow` or `allowAllRequests` \> `block` \> `upgradeScheme` \> `redirect`).

If the candidate is an `allow` or `allowAllRequests` rule, or the frame the request is being made in previously matched an `allowAllRequests` rule of higher or equal priority from this extension, the request is "allowed" and the extension won't have any effect on the request.

If more than one extension wants to block or redirect this request, a single action to take is chosen. Chrome does this by sorting the rules in the order `block` \> `redirect` or `upgradeScheme` \> `allow` or `allowAllRequests`. If two rules are of the same type, Chrome chooses the rule from the most recently installed extension.

<div class="aside caution">

**Caution:** Browser vendors have agreed not to standardize the order in which rules with the same action and priority run. This can change between runs or browser versions, even when spread between multiple types of ruleset (such as a static rule and a session rule). When ordering is important, you should always explicitly specify a priority.

</div>

### Before request headers are sent

Before Chrome sends request headers to the server, the headers are updated based on matching `modifyHeaders` rules.

Within a single extension, Chrome builds the list of modifications to perform by finding all matching `modifyHeaders` rules. Similar to before, only rules which have a higher priority than any matching `allow` or `allowAllRequests` rules are included.

These rules are applied by Chrome in an order such that rules from a more recently installed extension are always evaluated before rules from an older extension. Additionally, rules of a higher priority from one extension are always applied before rules of a lower priority from the same extension. Notably, even across extensions:

- If a rule appends to a header, then lower priority rules can only append to that header. Set and remove operations are not allowed.
- If a rule sets a header, then only lower priority rules from the same extension can append to that header. No other modifications are allowed.
- If a rule removes a header, then lower priority rules cannot further modify the header.

### Once a response is received

Once the response headers have been received, Chrome evaluates rules with a `responseHeaders` condition.

After sorting these rules by `action` and `priority` and excluding any rules made redundant by a matching `allow` or `allowAllRequests` rule (this happens identically to the steps in "Before the request"), Chrome may block or redirect the request on behalf of an extension.

Note that if a request made it to this stage, the request has already been sent to the server and the server has received data like the request body. A block or redirect rule with a response headers condition will still run–but cannot actually block or redirect the request.

In the case of a block rule, this is handled by the page which made the request receiving a blocked response and Chrome terminating the request early. In the case of a redirect rule, Chrome makes a new request to the redirected URL. Make sure to consider if these behaviors meet the privacy expectations for your extension.

If the request is not blocked or redirected, Chrome applies any `modifyHeaders` rules. Applying modifications to response headers works in the same way as described in "Before request headers are sent". Applying modifications to request headers does nothing, since the request has already been made.

## Safe rules

Safe rules are defined as rules with an action of `block`, `allow`, `allowAllRequests` or `upgradeScheme`. These rules are subject to an increased dynamic rules [quota](#dynamic-rules).

## Rule limits

There is a performance overhead to loading and evaluating rules in the browser, so some limits apply when using the API. Limits depend on the type of rule you're using.

### Static rules

Static rules are those specified in rule files declared in the manifest file. An extension can specify up to 100 static [rulesets](#type-Ruleset) as part of the `"rule_resources"` manifest key, but only 50 of these rulesets can be enabled at a time. The latter is called the [`MAX_NUMBER_OF_ENABLED_STATIC_RULESETS`](#property-MAX_NUMBER_OF_ENABLED_STATIC_RULESETS). Collectively, those rulesets are guaranteed at least 30,000 rules. This is called the [`GUARANTEED_MINIMUM_STATIC_RULES`](#property-GUARANTEED_MINIMUM_STATIC_RULES).

<div class="aside note">

**Note:** Prior to Chrome 120, extensions were limited to a total of 50 static rulesets, and only 10 of these could be enabled at the same time. Use the [`minimum_chrome_version`](/docs/extensions/reference/manifest/minimum-chrome-version) manifest field to limit which Chrome versions can install your extension.

</div>

The number of rules available after that depends on how many rules are enabled by all the extensions installed on a user's browser. You can find this number at runtime by calling [`getAvailableStaticRuleCount()`](#method-getAvailableStaticRuleCount). You can see [an example of this](#update-static-rulesets) under [code examples](#code-examples).

<div class="aside note">

**Note:** Starting with Chrome 128, if a user disables an extension through chrome://extensions, the extension's static rules will no longer count towards the global static rule limit. This potentially frees up static rule quota for other extensions, but also means that when the extension gets re-enabled, it might have fewer static rules available than before.

</div>

### Session rules

An extension can have up to 5000 session rules. This is exposed as the [`MAX_NUMBER_OF_SESSION_RULES`](#property-MAX_NUMBER_OF_SESSION_RULES).

Before Chrome 120, there was a limit of 5000 combined dynamic and session rules.

### Dynamic rules

An extension can have at least 5000 dynamic rules. This is exposed as the [`MAX_NUMBER_OF_UNSAFE_DYNAMIC_RULES`](#property-MAX_NUMBER_OF_UNSAFE_DYNAMIC_RULES).

Starting in Chrome 121, there is a larger limit of 30,000 rules available for [safe](#safe_rules) dynamic rules, exposed as the [`MAX_NUMBER_OF_DYNAMIC_RULES`](#property-MAX_NUMBER_OF_DYNAMIC_RULES). Any unsafe rules added within the limit of 5000 will also count towards this limit.

Before Chrome 120, there was a 5000 combined dynamic and session rules limit.

### Rules that use regular expressions

All types of rules can use regular expressions; however, the total number of regular expression rules of each type cannot exceed 1000. This is called the [MAX_NUMBER_OF_REGEX_RULES](#property-MAX_NUMBER_OF_REGEX_RULES).

Additionally, each rule must be less than 2KB once compiled. This roughly correlates with the complexity of the rule. If you try to load a rule that exceeds this limit, you will see a warning like the following and the rule will be ignored.

<div>

</div>

``` devsite-click-to-copy
rules_1.json: Rule with id 1 specified a more complex regex than allowed
as part of the "regexFilter" key.
```

## Interactions with service workers

A declarativeNetRequest only applies to requests that reach the network stack. This includes responses from the HTTP cache, but may not include responses that go through a service worker's `onfetch` handler. declarativeNetRequest won't affect responses generated by the service worker or retrieved from `CacheStorage`, but it will affect calls to `fetch()` made in a service worker.

## Web accessible resources

A declarativeNetRequest rule cannot redirect from a public resource request to a resource that is not web accessible. Doing so triggers an error. This is true even if the specified web accessible resource is owned by the redirecting extension. To declare resources for declarativeNetRequest, use the manifest's [`"web_accessible_resources"`](/docs/extensions/mv3/manifest/web_accessible_resources) array.

## Header modification

The append operation is only supported for the following request headers: `accept`, `accept-encoding`, `accept-language`, `access-control-request-headers`, `cache-control`, `connection`, `content-language`, `cookie`, `forwarded`, `if-match`, `if-none-match`, `keep-alive`, `range`, `te`, `trailer`, `transfer-encoding`, `upgrade`, `user-agent`, `via`, `want-digest`, `x-forwarded-for`. This allowlist is case sensitive ([bug 449152902](https://issues.chromium.org/449152902)).

When appending to a request or response header, the browser will use the appropriate separator where possible.

## Examples

### Code examples

#### Update dynamic rules

The following example shows how to call `updateDynamicRules()`. The procedure for `updateSessionRules()` is the same.

<div>

</div>

``` devsite-click-to-copy
// Get arrays containing new and old rules
const newRules = await getNewRules();
const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
const oldRuleIds = oldRules.map(rule => rule.id);

// Use the arrays to update the dynamic rules
await chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: oldRuleIds,
  addRules: newRules
});
```

#### Update static rulesets

The following example shows how to enable and disable rulesets while considering the number of available and the maximum number of enabled static rulesets. You would do this when the number of static rules you need exceeds the number allowed. For this to work, some of your rulesets should be installed with some of your rulesets disabled (setting `"Enabled"` to `false` within the manifest file).

<div>

</div>

``` devsite-click-to-copy
async function updateStaticRules(enableRulesetIds, disableCandidateIds) {
  // Create the options structure for the call to updateEnabledRulesets()
  let options = { enableRulesetIds: enableRulesetIds }
  // Get the number of enabled static rules
  const enabledStaticCount = await chrome.declarativeNetRequest.getEnabledRulesets();
  // Compare rule counts to determine if anything needs to be disabled so that
  // new rules can be enabled
  const proposedCount = enableRulesetIds.length;
  if (enabledStaticCount + proposedCount > chrome.declarativeNetRequest.MAX_NUMBER_OF_ENABLED_STATIC_RULESETS) {
    options.disableRulesetIds = disableCandidateIds
  }
  // Update the enabled static rules
  await chrome.declarativeNetRequest.updateEnabledRulesets(options);
}
```

### Rule examples

The following examples illustrate how Chrome prioritizes rules in an extension. When reviewing them, you may want to open the [prioritization](#implementation-matching-algorithm) rules in a separate window.

#### The "priority" key

These examples require [host permission](/docs/extensions/mv3/declare_permissions) to `*://*.example.com/*`.

To work out the priority of a particular URL, look at the (developer-defined) `"priority"` key, the `"action"` key and the `"urlFilter"` key. These examples refer to the example rule file shown below them.

Navigation to https://google.com  
Two rules cover this URL: the rules with IDs 1 and 4. The rule with ID 1 applies because `"block"` actions have a higher priority than `"redirect"` actions. The remaining rules don't apply because they are for longer URLs.

Navigation to https://google.com/1234  
Because of the longer URL, the rule with ID 2 now matches in addition to the rules with IDs 1 and 4. The rule with ID 2 applies because `"allow"` has a higher priority than `"block"` and `"redirect"`.

Navigation to https://google.com/12345  
All four rules match this URL. The rule with ID 3 applies because its developer-defined priority is the highest of the group.

<div>

</div>

``` devsite-click-to-copy
[
  {
    "id": 1,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {"urlFilter": "||google.com/", "resourceTypes": ["main_frame"] }
  },
  {
    "id": 2,
    "priority": 1,
    "action": { "type": "allow" },
    "condition": { "urlFilter": "||google.com/123", "resourceTypes": ["main_frame"] }
  },
  {
    "id": 3,
    "priority": 2,
    "action": { "type": "block" },
    "condition": { "urlFilter": "||google.com/12345", "resourceTypes": ["main_frame"] }
  },
  {
    "id": 4,
    "priority": 1,
    "action": { "type": "redirect", "redirect": { "url": "https://example.com" } },
    "condition": { "urlFilter": "||google.com/", "resourceTypes": ["main_frame"] }
  },
]
```

#### Redirects

The example below requires [host permission](/docs/extensions/mv3/declare_permissions) to `*://*.example.com/*`.

The following example shows how to redirect a request from example.com to a page within the extension itself. The extension path `/a.jpg` resolves to `chrome-extension://EXTENSION_ID/a.jpg`, where `EXTENSION_ID` is the ID of your extension. For this to work the manifest should declare `/a.jpg` as a [web accessible resource](/docs/extensions/mv3/manifest/web_accessible_resources).

<div>

</div>

``` devsite-click-to-copy
{
  "id": 1,
  "priority": 1,
  "action": { "type": "redirect", "redirect": { "extensionPath": "/a.jpg" } },
  "condition": {
    "urlFilter": "||https://www.example.com/",
    "resourceTypes": ["main_frame"]
  }
}
```

The following uses the `"transform"` key to redirect to a subdomain of example.com. It uses a domain name anchor ("\|\|") to intercept requests with any scheme from example.com. The `"scheme"` key in `"transform"` specifies that redirects to the subdomain will always use "https".

<div>

</div>

``` devsite-click-to-copy
{
  "id": 1,
  "priority": 1,
  "action": {
    "type": "redirect",
    "redirect": {
      "transform": { "scheme": "https", "host": "new.example.com" }
    }
  },
  "condition": {
    "urlFilter": "||example.com/",
    "resourceTypes": ["main_frame"]
  }
}
```

The following example uses regular expressions to redirect from `https://www.abc.xyz.com/path` to `https://abc.xyz.com/path`. In the `"regexFilter"` key, notice how periods are escaped and that the capturing group selects either "abc" or "def". The `"regexSubstitution"` key specifies the first returned match of the regular expression using "\1". In this case, "abc" is captured from the redirected URL and placed in the substitution.

<div>

</div>

``` devsite-click-to-copy
{
  "id": 1,
  "priority": 1,
  "action": {
    "type": "redirect",
    "redirect": {
      "regexSubstitution": "https://\\1.xyz.com/"
    }
  },
  "condition": {
    "regexFilter": "^https://www\\.(abc|def)\\.xyz\\.com/",
    "resourceTypes": [
      "main_frame"
    ]
  }
}
```

#### Headers

The following example removes all cookies from both a main frame and any sub frames.

<div>

</div>

``` devsite-click-to-copy
{
  "id": 1,
  "priority": 1,
  "action": {
    "type": "modifyHeaders",
    "requestHeaders": [{ "header": "cookie", "operation": "remove" }]
  },
  "condition": { "resourceTypes": ["main_frame", "sub_frame"] }
}
```

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### DomainType

</div>

This describes whether the request is first or third party to the frame in which it originated. A request is said to be first party if it has the same domain (eTLD+1) as the frame in which the request originated.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"firstParty"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The network request is first party to the frame in which it originated.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"thirdParty"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The network request is third party to the frame in which it originated.</span>

</div>

</div>

<div>

<div class="notranslate">

### ExtensionActionOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ExtensionActionOptions-displayActionCountAsBadgeText" class="dcc-code-sections__label">

  displayActionCountAsBadgeText

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether to automatically display the action count for a page as the extension's badge text. This preference is persisted across sessions.

- <div>

  <div id="property-ExtensionActionOptions-tabUpdate" class="dcc-code-sections__label">

  tabUpdate

  </div>

  <div class="dcc-type--xsmall">

  [TabActionCountUpdate](#type-TabActionCountUpdate) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 89+ </span>

  </div>

  </div>

  Details of how the tab's action count should be adjusted.

</div>

<div>

<div class="notranslate">

### GetDisabledRuleIdsOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 111+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-GetDisabledRuleIdsOptions-rulesetId" class="dcc-code-sections__label">

  rulesetId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The id corresponding to a static [`Ruleset`](#type-Ruleset).

</div>

<div>

<div class="notranslate">

### GetRulesFilter

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 111+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-GetRulesFilter-ruleIds" class="dcc-code-sections__label">

  ruleIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified, only rules with matching IDs are included.

</div>

<div>

<div class="notranslate">

### HeaderInfo

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 128+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-HeaderInfo-excludedValues" class="dcc-code-sections__label">

  excludedValues

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified, this condition is not matched if the header exists but its value contains at least one element in this list. This uses the same match pattern syntax as `values`.

- <div>

  <div id="property-HeaderInfo-header" class="dcc-code-sections__label">

  header

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The name of the header. This condition matches on the name only if both `values` and `excludedValues` are not specified.

- <div>

  <div id="property-HeaderInfo-values" class="dcc-code-sections__label">

  values

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified, this condition matches if the header's value matches at least one pattern in this list. This supports case-insensitive header value matching plus the following constructs:

  **'\*'** : Matches any number of characters.

  **'?'** : Matches zero or one character(s).

  '\*' and '?' can be escaped with a backslash, e.g. '\\' and '\\'

</div>

<div>

<div class="notranslate">

### HeaderOperation

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 86+ </span>

</div>

</div>

This describes the possible operations for a "modifyHeaders" rule.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"append"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Adds a new entry for the specified header. When modifying the headers of a request, this operation is only supported for [specific headers](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#header_modification).</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"set"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Sets a new value for the specified header, removing any existing headers with the same name.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"remove"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Removes all entries for the specified header.</span>

</div>

</div>

<div>

<div class="notranslate">

### IsRegexSupportedResult

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 87+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-IsRegexSupportedResult-isSupported" class="dcc-code-sections__label">

  isSupported

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

- <div>

  <div id="property-IsRegexSupportedResult-reason" class="dcc-code-sections__label">

  reason

  </div>

  <div class="dcc-type--xsmall">

  [UnsupportedRegexReason](#type-UnsupportedRegexReason) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies the reason why the regular expression is not supported. Only provided if `isSupported` is false.

</div>

<div>

<div class="notranslate">

### MatchedRule

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-MatchedRule-ruleId" class="dcc-code-sections__label">

  ruleId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  A matching rule's ID.

- <div>

  <div id="property-MatchedRule-rulesetId" class="dcc-code-sections__label">

  rulesetId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  ID of the [`Ruleset`](#type-Ruleset) this rule belongs to. For a rule originating from the set of dynamic rules, this will be equal to [`DYNAMIC_RULESET_ID`](#property-DYNAMIC_RULESET_ID).

</div>

<div>

<div class="notranslate">

### MatchedRuleInfo

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-MatchedRuleInfo-rule" class="dcc-code-sections__label">

  rule

  </div>

  <div class="dcc-type--xsmall">

  [MatchedRule](#type-MatchedRule)

  </div>

  </div>

- <div>

  <div id="property-MatchedRuleInfo-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The tabId of the tab from which the request originated if the tab is still active. Else -1.

- <div>

  <div id="property-MatchedRuleInfo-timeStamp" class="dcc-code-sections__label">

  timeStamp

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The time the rule was matched. Timestamps will correspond to the Javascript convention for times, i.e. number of milliseconds since the epoch.

</div>

<div>

<div class="notranslate">

### MatchedRuleInfoDebug

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-MatchedRuleInfoDebug-request" class="dcc-code-sections__label">

  request

  </div>

  <div class="dcc-type--xsmall">

  [RequestDetails](#type-RequestDetails)

  </div>

  </div>

  Details about the request for which the rule was matched.

- <div>

  <div id="property-MatchedRuleInfoDebug-rule" class="dcc-code-sections__label">

  rule

  </div>

  <div class="dcc-type--xsmall">

  [MatchedRule](#type-MatchedRule)

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### MatchedRulesFilter

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-MatchedRulesFilter-minTimeStamp" class="dcc-code-sections__label">

  minTimeStamp

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified, only matches rules after the given timestamp.

- <div>

  <div id="property-MatchedRulesFilter-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If specified, only matches rules for the given tab. Matches rules not associated with any active tab if set to -1.

</div>

<div>

<div class="notranslate">

### ModifyHeaderInfo

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 86+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ModifyHeaderInfo-header" class="dcc-code-sections__label">

  header

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The name of the header to be modified.

- <div>

  <div id="property-ModifyHeaderInfo-operation" class="dcc-code-sections__label">

  operation

  </div>

  <div class="dcc-type--xsmall">

  [HeaderOperation](#type-HeaderOperation)

  </div>

  </div>

  The operation to be performed on a header.

- <div>

  <div id="property-ModifyHeaderInfo-value" class="dcc-code-sections__label">

  value

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The new value for the header. Must be specified for `append` and `set` operations.

</div>

<div>

<div class="notranslate">

### QueryKeyValue

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-QueryKeyValue-key" class="dcc-code-sections__label">

  key

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

- <div>

  <div id="property-QueryKeyValue-replaceOnly" class="dcc-code-sections__label">

  replaceOnly

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 94+ </span>

  </div>

  </div>

  If true, the query key is replaced only if it's already present. Otherwise, the key is also added if it's missing. Defaults to false.

- <div>

  <div id="property-QueryKeyValue-value" class="dcc-code-sections__label">

  value

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### QueryTransform

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-QueryTransform-addOrReplaceParams" class="dcc-code-sections__label">

  addOrReplaceParams

  </div>

  <div class="dcc-type--xsmall">

  [QueryKeyValue](#type-QueryKeyValue)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The list of query key-value pairs to be added or replaced.

- <div>

  <div id="property-QueryTransform-removeParams" class="dcc-code-sections__label">

  removeParams

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The list of query keys to be removed.

</div>

<div>

<div class="notranslate">

### Redirect

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Redirect-extensionPath" class="dcc-code-sections__label">

  extensionPath

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Path relative to the extension directory. Should start with '/'.

- <div>

  <div id="property-Redirect-regexSubstitution" class="dcc-code-sections__label">

  regexSubstitution

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Substitution pattern for rules which specify a `regexFilter`. The first match of `regexFilter` within the url will be replaced with this pattern. Within `regexSubstitution`, backslash-escaped digits (\1 to \9) can be used to insert the corresponding capture groups. \0 refers to the entire matching text.

- <div>

  <div id="property-Redirect-transform" class="dcc-code-sections__label">

  transform

  </div>

  <div class="dcc-type--xsmall">

  [URLTransform](#type-URLTransform) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Url transformations to perform.

- <div>

  <div id="property-Redirect-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The redirect url. Redirects to JavaScript urls are not allowed.

</div>

<div>

<div class="notranslate">

### RegexOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 87+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-RegexOptions-isCaseSensitive" class="dcc-code-sections__label">

  isCaseSensitive

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether the `regex` specified is case sensitive. Default is true.

- <div>

  <div id="property-RegexOptions-regex" class="dcc-code-sections__label">

  regex

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The regular expresson to check.

- <div>

  <div id="property-RegexOptions-requireCapturing" class="dcc-code-sections__label">

  requireCapturing

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether the `regex` specified requires capturing. Capturing is only required for redirect rules which specify a `regexSubstition` action. The default is false.

</div>

<div>

<div class="notranslate">

### RequestDetails

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-RequestDetails-documentId" class="dcc-code-sections__label">

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

  The unique identifier for the frame's document, if this request is for a frame.

- <div>

  <div id="property-RequestDetails-documentLifecycle" class="dcc-code-sections__label">

  documentLifecycle

  </div>

  <div class="dcc-type--xsmall">

  [DocumentLifecycle](https://developer.chrome.com/docs/extensions/reference/extensionTypes/#type-DocumentLifecycle) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 106+ </span>

  </div>

  </div>

  The lifecycle of the frame's document, if this request is for a frame.

- <div>

  <div id="property-RequestDetails-frameId" class="dcc-code-sections__label">

  frameId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.

- <div>

  <div id="property-RequestDetails-frameType" class="dcc-code-sections__label">

  frameType

  </div>

  <div class="dcc-type--xsmall">

  [FrameType](https://developer.chrome.com/docs/extensions/reference/extensionTypes/#type-FrameType) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 106+ </span>

  </div>

  </div>

  The type of the frame, if this request is for a frame.

- <div>

  <div id="property-RequestDetails-initiator" class="dcc-code-sections__label">

  initiator

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The origin where the request was initiated. This does not change through redirects. If this is an opaque origin, the string 'null' will be used.

- <div>

  <div id="property-RequestDetails-method" class="dcc-code-sections__label">

  method

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Standard HTTP method.

- <div>

  <div id="property-RequestDetails-parentDocumentId" class="dcc-code-sections__label">

  parentDocumentId

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

  The unique identifier for the frame's parent document, if this request is for a frame and has a parent.

- <div>

  <div id="property-RequestDetails-parentFrameId" class="dcc-code-sections__label">

  parentFrameId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.

- <div>

  <div id="property-RequestDetails-requestId" class="dcc-code-sections__label">

  requestId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The ID of the request. Request IDs are unique within a browser session.

- <div>

  <div id="property-RequestDetails-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.

- <div>

  <div id="property-RequestDetails-type" class="dcc-code-sections__label">

  type

  </div>

  <div class="dcc-type--xsmall">

  [ResourceType](#type-ResourceType)

  </div>

  </div>

  The resource type of the request.

- <div>

  <div id="property-RequestDetails-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The URL of the request.

</div>

<div>

<div class="notranslate">

### RequestMethod

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

</div>

</div>

This describes the HTTP request method of a network request.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"connect"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"delete"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"get"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"head"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"options"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"patch"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"post"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"put"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"other"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### ResourceType

</div>

This describes the resource type of the network request.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"main_frame"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"sub_frame"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"stylesheet"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"script"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"image"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"font"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"object"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"xmlhttprequest"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"ping"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"csp_report"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"media"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"websocket"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"webtransport"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"webbundle"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"other"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### Rule

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Rule-action" class="dcc-code-sections__label">

  action

  </div>

  <div class="dcc-type--xsmall">

  [RuleAction](#type-RuleAction)

  </div>

  </div>

  The action to take if this rule is matched.

- <div>

  <div id="property-Rule-condition" class="dcc-code-sections__label">

  condition

  </div>

  <div class="dcc-type--xsmall">

  [RuleCondition](#type-RuleCondition)

  </div>

  </div>

  The condition under which this rule is triggered.

- <div>

  <div id="property-Rule-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  An id which uniquely identifies a rule. Mandatory and should be \>= 1.

- <div>

  <div id="property-Rule-priority" class="dcc-code-sections__label">

  priority

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Rule priority. Defaults to 1. When specified, should be \>= 1.

</div>

<div>

<div class="notranslate">

### RuleAction

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-RuleAction-redirect" class="dcc-code-sections__label">

  redirect

  </div>

  <div class="dcc-type--xsmall">

  [Redirect](#type-Redirect) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Describes how the redirect should be performed. Only valid for redirect rules.

- <div>

  <div id="property-RuleAction-requestHeaders" class="dcc-code-sections__label">

  requestHeaders

  </div>

  <div class="dcc-type--xsmall">

  [ModifyHeaderInfo](#type-ModifyHeaderInfo)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 86+ </span>

  </div>

  </div>

  The request headers to modify for the request. Only valid if RuleActionType is "modifyHeaders".

- <div>

  <div id="property-RuleAction-responseHeaders" class="dcc-code-sections__label">

  responseHeaders

  </div>

  <div class="dcc-type--xsmall">

  [ModifyHeaderInfo](#type-ModifyHeaderInfo)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 86+ </span>

  </div>

  </div>

  The response headers to modify for the request. Only valid if RuleActionType is "modifyHeaders".

- <div>

  <div id="property-RuleAction-type" class="dcc-code-sections__label">

  type

  </div>

  <div class="dcc-type--xsmall">

  [RuleActionType](#type-RuleActionType)

  </div>

  </div>

  The type of action to perform.

</div>

<div>

<div class="notranslate">

### RuleActionType

</div>

Describes the kind of action to take if a given RuleCondition matches.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"block"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Block the network request.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"redirect"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Redirect the network request.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allow"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Allow the network request. The request won't be intercepted if there is an allow rule which matches it.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"upgradeScheme"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Upgrade the network request url's scheme to https if the request is http or ftp.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"modifyHeaders"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Modify request/response headers from the network request.</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"allowAllRequests"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">Allow all requests within a frame hierarchy, including the frame request itself.</span>

</div>

</div>

<div>

<div class="notranslate">

### RuleCondition

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-RuleCondition-domainType" class="dcc-code-sections__label">

  domainType

  </div>

  <div class="dcc-type--xsmall">

  [DomainType](#type-DomainType) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Specifies whether the network request is first-party or third-party to the domain from which it originated. If omitted, all requests are accepted.

- <div>

  <div id="property-RuleCondition-domains" class="dcc-code-sections__label">

  domains

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 101</span>

  </div>

  </div>

  Use [`initiatorDomains`](#property-RuleCondition-initiatorDomains) instead

  The rule will only match network requests originating from the list of `domains`.

- <div>

  <div id="property-RuleCondition-excludedDomains" class="dcc-code-sections__label">

  excludedDomains

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 101</span>

  </div>

  </div>

  Use [`excludedInitiatorDomains`](#property-RuleCondition-excludedInitiatorDomains) instead

  The rule will not match network requests originating from the list of `excludedDomains`.

- <div>

  <div id="property-RuleCondition-excludedInitiatorDomains" class="dcc-code-sections__label">

  excludedInitiatorDomains

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 101+ </span>

  </div>

  </div>

  The rule will not match network requests originating from the list of `excludedInitiatorDomains`. If the list is empty or omitted, no domains are excluded. This takes precedence over `initiatorDomains`.

  Notes:

  - Sub-domains like "a.example.com" are also allowed.
  - The entries must consist of only ascii characters.
  - Use punycode encoding for internationalized domains.
  - This matches against the request initiator and not the request url.
  - Sub-domains of the listed domains are also excluded.

- <div>

  <div id="property-RuleCondition-excludedRequestDomains" class="dcc-code-sections__label">

  excludedRequestDomains

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 101+ </span>

  </div>

  </div>

  The rule will not match network requests when the domains matches one from the list of `excludedRequestDomains`. If the list is empty or omitted, no domains are excluded. This takes precedence over `requestDomains`.

  Notes:

  - Sub-domains like "a.example.com" are also allowed.
  - The entries must consist of only ascii characters.
  - Use punycode encoding for internationalized domains.
  - Sub-domains of the listed domains are also excluded.

- <div>

  <div id="property-RuleCondition-excludedRequestMethods" class="dcc-code-sections__label">

  excludedRequestMethods

  </div>

  <div class="dcc-type--xsmall">

  [RequestMethod](#type-RequestMethod)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  List of request methods which the rule won't match. Only one of `requestMethods` and `excludedRequestMethods` should be specified. If neither of them is specified, all request methods are matched.

- <div>

  <div id="property-RuleCondition-excludedResourceTypes" class="dcc-code-sections__label">

  excludedResourceTypes

  </div>

  <div class="dcc-type--xsmall">

  [ResourceType](#type-ResourceType)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  List of resource types which the rule won't match. Only one of `resourceTypes` and `excludedResourceTypes` should be specified. If neither of them is specified, all resource types except "main_frame" are blocked.

- <div>

  <div id="property-RuleCondition-excludedResponseHeaders" class="dcc-code-sections__label">

  excludedResponseHeaders

  </div>

  <div class="dcc-type--xsmall">

  [HeaderInfo](#type-HeaderInfo)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 128+ </span>

  </div>

  </div>

  Rule does not match if the request matches any response header condition in this list (if specified). If both `excludedResponseHeaders` and `responseHeaders` are specified, then the `excludedResponseHeaders` property takes precedence.

- <div>

  <div id="property-RuleCondition-excludedTabIds" class="dcc-code-sections__label">

  excludedTabIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 92+ </span>

  </div>

  </div>

  List of [`tabs.Tab.id`](https://developer.chrome.com/docs/extensions/reference/tabs/#property-Tab-id) which the rule should not match. An ID of [`tabs.TAB_ID_NONE`](https://developer.chrome.com/docs/extensions/reference/tabs/#property-TAB_ID_NONE) excludes requests which don't originate from a tab. Only supported for session-scoped rules.

- <div>

  <div id="property-RuleCondition-excludedTopDomains" class="dcc-code-sections__label">

  excludedTopDomains

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 145+ </span>

  </div>

  </div>

  The rule will not match network requests when the associated top-level frame's domain matches one from the list of `excludedTopDomains`. If the list is empty or omitted, no domains are excluded. This takes precedence over `topDomains`.

  Notes:

  - Sub-domains like "a.example.com" are also allowed.
  - The entries must consist of only ascii characters.
  - Use punycode encoding for internationalized domains.
  - Sub-domains of the listed domains are also excluded.
  - For requests with no associated top-level frame (e.g. ServiceWorker initiated requests, the request initiator's domain is considered instead.

- <div>

  <div id="property-RuleCondition-initiatorDomains" class="dcc-code-sections__label">

  initiatorDomains

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 101+ </span>

  </div>

  </div>

  The rule will only match network requests originating from the list of `initiatorDomains`. If the list is omitted, the rule is applied to requests from all domains. An empty list is not allowed.

  Notes:

  - Sub-domains like "a.example.com" are also allowed.
  - The entries must consist of only ascii characters.
  - Use punycode encoding for internationalized domains.
  - This matches against the request initiator and not the request url.
  - Sub-domains of the listed domains are also matched.

- <div>

  <div id="property-RuleCondition-isUrlFilterCaseSensitive" class="dcc-code-sections__label">

  isUrlFilterCaseSensitive

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Whether the `urlFilter` or `regexFilter` (whichever is specified) is case sensitive. Default is false.

- <div>

  <div id="property-RuleCondition-regexFilter" class="dcc-code-sections__label">

  regexFilter

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Regular expression to match against the network request url. This follows the [RE2 syntax](https://github.com/google/re2/wiki/Syntax).

  Note: Only one of `urlFilter` or `regexFilter` can be specified.

  Note: The `regexFilter` must be composed of only ASCII characters. This is matched against a url where the host is encoded in the punycode format (in case of internationalized domains) and any other non-ascii characters are url encoded in utf-8.

- <div>

  <div id="property-RuleCondition-requestDomains" class="dcc-code-sections__label">

  requestDomains

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 101+ </span>

  </div>

  </div>

  The rule will only match network requests when the domain matches one from the list of `requestDomains`. If the list is omitted, the rule is applied to requests from all domains. An empty list is not allowed.

  Notes:

  - Sub-domains like "a.example.com" are also allowed.
  - The entries must consist of only ascii characters.
  - Use punycode encoding for internationalized domains.
  - Sub-domains of the listed domains are also matched.

- <div>

  <div id="property-RuleCondition-requestMethods" class="dcc-code-sections__label">

  requestMethods

  </div>

  <div class="dcc-type--xsmall">

  [RequestMethod](#type-RequestMethod)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  List of HTTP request methods which the rule can match. An empty list is not allowed.

  Note: Specifying a `requestMethods` rule condition will also exclude non-HTTP(s) requests, whereas specifying `excludedRequestMethods` will not.

- <div>

  <div id="property-RuleCondition-resourceTypes" class="dcc-code-sections__label">

  resourceTypes

  </div>

  <div class="dcc-type--xsmall">

  [ResourceType](#type-ResourceType)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  List of resource types which the rule can match. An empty list is not allowed.

  Note: this must be specified for `allowAllRequests` rules and may only include the `sub_frame` and `main_frame` resource types.

- <div>

  <div id="property-RuleCondition-responseHeaders" class="dcc-code-sections__label">

  responseHeaders

  </div>

  <div class="dcc-type--xsmall">

  [HeaderInfo](#type-HeaderInfo)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 128+ </span>

  </div>

  </div>

  Rule matches if the request matches any response header condition in this list (if specified).

- <div>

  <div id="property-RuleCondition-tabIds" class="dcc-code-sections__label">

  tabIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 92+ </span>

  </div>

  </div>

  List of [`tabs.Tab.id`](https://developer.chrome.com/docs/extensions/reference/tabs/#property-Tab-id) which the rule should match. An ID of [`tabs.TAB_ID_NONE`](https://developer.chrome.com/docs/extensions/reference/tabs/#property-TAB_ID_NONE) matches requests which don't originate from a tab. An empty list is not allowed. Only supported for session-scoped rules.

- <div>

  <div id="property-RuleCondition-topDomains" class="dcc-code-sections__label">

  topDomains

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 145+ </span>

  </div>

  </div>

  The rule will only match network requests when the associated top-level frame's domain matches one from the list of `topDomains`. If the list is omitted, the rule is applied to requests associated with all top-level frame domains. An empty list is not allowed.

  Notes:

  - Sub-domains like "a.example.com" are also allowed.
  - The entries must consist of only ascii characters.
  - Use punycode encoding for internationalized domains.
  - Sub-domains of the listed domains are also matched.
  - For requests with no associated top-level frame (e.g. ServiceWorker initiated requests, the request initiator's domain is considered instead.

- <div>

  <div id="property-RuleCondition-urlFilter" class="dcc-code-sections__label">

  urlFilter

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The pattern which is matched against the network request url. Supported constructs:

  **'\*'** : Wildcard: Matches any number of characters.

  **'\|'** : Left/right anchor: If used at either end of the pattern, specifies the beginning/end of the url respectively.

  **'\|\|'** : Domain name anchor: If used at the beginning of the pattern, specifies the start of a (sub-)domain of the URL.

  **'^'** : Separator character: This matches anything except a letter, a digit, or one of the following: `_`, `-`, `.`, or `%`. This also match the end of the URL.

  Therefore `urlFilter` is composed of the following parts: (optional Left/Domain name anchor) + pattern + (optional Right anchor).

  If omitted, all urls are matched. An empty string is not allowed.

  A pattern beginning with `||*` is not allowed. Use `*` instead.

  Note: Only one of `urlFilter` or `regexFilter` can be specified.

  Note: The `urlFilter` must be composed of only ASCII characters. This is matched against a url where the host is encoded in the punycode format (in case of internationalized domains) and any other non-ascii characters are url encoded in utf-8. For example, when the request url is http://abc.рф?q=ф, the `urlFilter` will be matched against the url http://abc.xn--p1ai/?q=%D1%84.

</div>

<div>

<div class="notranslate">

### RuleConditionKeys

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 145+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"urlFilter"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"regexFilter"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"isUrlFilterCaseSensitive"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"initiatorDomains"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"excludedInitiatorDomains"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"requestDomains"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"excludedRequestDomains"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"topDomains"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"excludedTopDomains"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"domains"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"excludedDomains"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"resourceTypes"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"excludedResourceTypes"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"requestMethods"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"excludedRequestMethods"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"domainType"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"tabIds"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"excludedTabIds"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"responseHeaders"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"excludedResponseHeaders"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### Ruleset

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Ruleset-enabled" class="dcc-code-sections__label">

  enabled

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  Whether the ruleset is enabled by default.

- <div>

  <div id="property-Ruleset-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  A non-empty string uniquely identifying the ruleset. IDs beginning with '\_' are reserved for internal use.

- <div>

  <div id="property-Ruleset-path" class="dcc-code-sections__label">

  path

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The path of the JSON ruleset relative to the extension directory.

</div>

<div>

<div class="notranslate">

### RulesMatchedDetails

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-RulesMatchedDetails-rulesMatchedInfo" class="dcc-code-sections__label">

  rulesMatchedInfo

  </div>

  <div class="dcc-type--xsmall">

  [MatchedRuleInfo](#type-MatchedRuleInfo)\[\]

  </div>

  </div>

  Rules matching the given filter.

</div>

<div>

<div class="notranslate">

### TabActionCountUpdate

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 89+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-TabActionCountUpdate-increment" class="dcc-code-sections__label">

  increment

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The amount to increment the tab's action count by. Negative values will decrement the count.

- <div>

  <div id="property-TabActionCountUpdate-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The tab for which to update the action count.

</div>

<div>

<div class="notranslate">

### TestMatchOutcomeResult

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 103+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-TestMatchOutcomeResult-matchedRules" class="dcc-code-sections__label">

  matchedRules

  </div>

  <div class="dcc-type--xsmall">

  [MatchedRule](#type-MatchedRule)\[\]

  </div>

  </div>

  The rules (if any) that match the hypothetical request.

</div>

<div>

<div class="notranslate">

### TestMatchRequestDetails

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 103+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-TestMatchRequestDetails-initiator" class="dcc-code-sections__label">

  initiator

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The initiator URL (if any) for the hypothetical request.

- <div>

  <div id="property-TestMatchRequestDetails-method" class="dcc-code-sections__label">

  method

  </div>

  <div class="dcc-type--xsmall">

  [RequestMethod](#type-RequestMethod) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Standard HTTP method of the hypothetical request. Defaults to "get" for HTTP requests and is ignored for non-HTTP requests.

- <div>

  <div id="property-TestMatchRequestDetails-responseHeaders" class="dcc-code-sections__label">

  responseHeaders

  </div>

  <div class="dcc-type--xsmall">

  object <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 129+ </span>

  </div>

  </div>

  The headers provided by a hypothetical response if the request does not get blocked or redirected before it is sent. Represented as an object which maps a header name to a list of string values. If not specified, the hypothetical response would return empty response headers, which can match rules which match on the non-existence of headers. E.g. `{"content-type": ["text/html; charset=utf-8", "multipart/form-data"]}`

- <div>

  <div id="property-TestMatchRequestDetails-tabId" class="dcc-code-sections__label">

  tabId

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The ID of the tab in which the hypothetical request takes place. Does not need to correspond to a real tab ID. Default is -1, meaning that the request isn't related to a tab.

- <div>

  <div id="property-TestMatchRequestDetails-topUrl" class="dcc-code-sections__label">

  topUrl

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 145+ </span>

  </div>

  </div>

  The associated top-level frame URL (if any) for the request.

- <div>

  <div id="property-TestMatchRequestDetails-type" class="dcc-code-sections__label">

  type

  </div>

  <div class="dcc-type--xsmall">

  [ResourceType](#type-ResourceType)

  </div>

  </div>

  The resource type of the hypothetical request.

- <div>

  <div id="property-TestMatchRequestDetails-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The URL of the hypothetical request.

</div>

<div>

<div class="notranslate">

### UnsupportedRegexReason

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 87+ </span>

</div>

</div>

Describes the reason why a given regular expression isn't supported.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"syntaxError"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The regular expression is syntactically incorrect, or uses features not available in the [RE2 syntax](https://github.com/google/re2/wiki/Syntax).</span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"memoryLimitExceeded"</span>\
<span class="dcc-type--xsmall" style="white-space: initial">The regular expression exceeds the memory limit.</span>

</div>

</div>

<div>

<div class="notranslate">

### UpdateRuleOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 87+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-UpdateRuleOptions-addRules" class="dcc-code-sections__label">

  addRules

  </div>

  <div class="dcc-type--xsmall">

  [Rule](#type-Rule)\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Rules to add.

- <div>

  <div id="property-UpdateRuleOptions-removeRuleIds" class="dcc-code-sections__label">

  removeRuleIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  IDs of the rules to remove. Any invalid IDs will be ignored.

</div>

<div>

<div class="notranslate">

### UpdateRulesetOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 87+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-UpdateRulesetOptions-disableRulesetIds" class="dcc-code-sections__label">

  disableRulesetIds

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The set of ids corresponding to a static [`Ruleset`](#type-Ruleset) that should be disabled.

- <div>

  <div id="property-UpdateRulesetOptions-enableRulesetIds" class="dcc-code-sections__label">

  enableRulesetIds

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The set of ids corresponding to a static [`Ruleset`](#type-Ruleset) that should be enabled.

</div>

<div>

<div class="notranslate">

### UpdateStaticRulesOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 111+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-UpdateStaticRulesOptions-disableRuleIds" class="dcc-code-sections__label">

  disableRuleIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Set of ids corresponding to rules in the [`Ruleset`](#type-Ruleset) to disable.

- <div>

  <div id="property-UpdateStaticRulesOptions-enableRuleIds" class="dcc-code-sections__label">

  enableRuleIds

  </div>

  <div class="dcc-type--xsmall">

  number\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Set of ids corresponding to rules in the [`Ruleset`](#type-Ruleset) to enable.

- <div>

  <div id="property-UpdateStaticRulesOptions-rulesetId" class="dcc-code-sections__label">

  rulesetId

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The id corresponding to a static [`Ruleset`](#type-Ruleset).

</div>

<div>

<div class="notranslate">

### URLTransform

</div>

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-URLTransform-fragment" class="dcc-code-sections__label">

  fragment

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The new fragment for the request. Should be either empty, in which case the existing fragment is cleared; or should begin with '#'.

- <div>

  <div id="property-URLTransform-host" class="dcc-code-sections__label">

  host

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The new host for the request.

- <div>

  <div id="property-URLTransform-password" class="dcc-code-sections__label">

  password

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The new password for the request.

- <div>

  <div id="property-URLTransform-path" class="dcc-code-sections__label">

  path

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The new path for the request. If empty, the existing path is cleared.

- <div>

  <div id="property-URLTransform-port" class="dcc-code-sections__label">

  port

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The new port for the request. If empty, the existing port is cleared.

- <div>

  <div id="property-URLTransform-query" class="dcc-code-sections__label">

  query

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The new query for the request. Should be either empty, in which case the existing query is cleared; or should begin with '?'.

- <div>

  <div id="property-URLTransform-queryTransform" class="dcc-code-sections__label">

  queryTransform

  </div>

  <div class="dcc-type--xsmall">

  [QueryTransform](#type-QueryTransform) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Add, remove or replace query key-value pairs.

- <div>

  <div id="property-URLTransform-scheme" class="dcc-code-sections__label">

  scheme

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The new scheme for the request. Allowed values are "http", "https", "ftp" and "chrome-extension".

- <div>

  <div id="property-URLTransform-username" class="dcc-code-sections__label">

  username

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The new username for the request.

</div>

</div>

## Properties

<div>

<div>

<div class="notranslate">

### DYNAMIC_RULESET_ID

</div>

Ruleset ID for the dynamic rules added by the extension.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">"\_dynamic"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### GETMATCHEDRULES_QUOTA_INTERVAL

</div>

Time interval within which `MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL getMatchedRules` calls can be made, specified in minutes. Additional calls will fail immediately and set [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError). Note: `getMatchedRules` calls associated with a user gesture are exempt from the quota.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">10</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### GUARANTEED_MINIMUM_STATIC_RULES

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 89+ </span>

</div>

</div>

The minimum number of static rules guaranteed to an extension across its enabled static rulesets. Any rules above this limit will count towards the [global static rule limit](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#global-static-rule-limit).

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">30000</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL

</div>

The number of times `getMatchedRules` can be called within a period of `GETMATCHEDRULES_QUOTA_INTERVAL`.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">20</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MAX_NUMBER_OF_DYNAMIC_RULES

</div>

The maximum number of dynamic rules that an extension can add.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">30000</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MAX_NUMBER_OF_ENABLED_STATIC_RULESETS

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 94+ </span>

</div>

</div>

The maximum number of static `Rulesets` an extension can enable at any one time.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">50</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MAX_NUMBER_OF_REGEX_RULES

</div>

The maximum number of regular expression rules that an extension can add. This limit is evaluated separately for the set of dynamic rules and those specified in the rule resources file.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">1000</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MAX_NUMBER_OF_SESSION_RULES

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 120+ </span>

</div>

</div>

The maximum number of session scoped rules that an extension can add.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">5000</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MAX_NUMBER_OF_STATIC_RULESETS

</div>

The maximum number of static `Rulesets` an extension can specify as part of the `"rule_resources"` manifest key.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">100</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MAX_NUMBER_OF_UNSAFE_DYNAMIC_RULES

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 120+ </span>

</div>

</div>

The maximum number of "unsafe" dynamic rules that an extension can add.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">5000</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### MAX_NUMBER_OF_UNSAFE_SESSION_RULES

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 120+ </span>

</div>

</div>

The maximum number of "unsafe" session scoped rules that an extension can add.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">5000</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### SESSION_RULESET_ID

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 90+ </span>

</div>

</div>

Ruleset ID for the session-scoped rules added by the extension.

</div>

<div class="dcc-code-sections">

#### Value

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span class="dcc-code-sections__value">"\_session"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### getAvailableStaticRuleCount()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 89+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.getAvailableStaticRuleCount(): Promise<number>
```

Returns the number of static rules an extension can enable before the [global static rule limit](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#global-static-rule-limit) is reached.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<number\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### getDisabledRuleIds()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 111+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.getDisabledRuleIds(
  options: GetDisabledRuleIdsOptions,
): Promise<number[]>
```

Returns the list of static rules in the given [`Ruleset`](#type-Ruleset) that are currently disabled.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getDisabledRuleIds-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [GetDisabledRuleIdsOptions](#type-GetDisabledRuleIdsOptions)

  </div>

  </div>

  Specifies the ruleset to query.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<number\[\]\>

  </div>

  </div>

  Promise that resolves with a list of ids that correspond to the disabled rules in that ruleset.

</div>

<div>

<div class="notranslate">

### getDynamicRules()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.getDynamicRules(
  filter?: GetRulesFilter,
): Promise<Rule[]>
```

Returns the current set of dynamic rules for the extension. Callers can optionally filter the list of fetched rules by specifying a `filter`.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getDynamicRules-filter" class="dcc-code-sections__label">

  filter

  </div>

  <div class="dcc-type--xsmall">

  [GetRulesFilter](#type-GetRulesFilter) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 111+ </span>

  </div>

  </div>

  An object to filter the list of fetched rules.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Rule](#type-Rule)\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves with the set of dynamic rules. The Promise may be rejected in case of transient internal errors.

</div>

<div>

<div class="notranslate">

### getEnabledRulesets()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.getEnabledRulesets(): Promise<string[]>
```

Returns the ids for the current set of enabled static rulesets.

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves with a list of ids, where each id corresponds to an enabled static [`Ruleset`](#type-Ruleset).

</div>

<div>

<div class="notranslate">

### getMatchedRules()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.getMatchedRules(
  filter?: MatchedRulesFilter,
): Promise<RulesMatchedDetails>
```

Returns all rules matched for the extension. Callers can optionally filter the list of matched rules by specifying a `filter`. This method is only available to extensions with the `"declarativeNetRequestFeedback"` permission or having the `"activeTab"` permission granted for the `tabId` specified in `filter`. Note: Rules not associated with an active document that were matched more than five minutes ago will not be returned.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getMatchedRules-filter" class="dcc-code-sections__label">

  filter

  </div>

  <div class="dcc-type--xsmall">

  [MatchedRulesFilter](#type-MatchedRulesFilter) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  An object to filter the list of matched rules.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[RulesMatchedDetails](#type-RulesMatchedDetails)\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves once the list of matched rules has been fetched. In case of an error, the Promise will be rejected. This can happen for multiple reasons, such as insufficient permissions, or exceeding the quota.

</div>

<div>

<div class="notranslate">

### getSessionRules()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 90+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.getSessionRules(
  filter?: GetRulesFilter,
): Promise<Rule[]>
```

Returns the current set of session scoped rules for the extension. Callers can optionally filter the list of fetched rules by specifying a `filter`.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-getSessionRules-filter" class="dcc-code-sections__label">

  filter

  </div>

  <div class="dcc-type--xsmall">

  [GetRulesFilter](#type-GetRulesFilter) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 111+ </span>

  </div>

  </div>

  An object to filter the list of fetched rules.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[Rule](#type-Rule)\[\]\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves with the set of session scoped rules.

</div>

<div>

<div class="notranslate">

### isRegexSupported()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 87+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.isRegexSupported(
  regexOptions: RegexOptions,
): Promise<IsRegexSupportedResult>
```

Checks if the given regular expression will be supported as a `regexFilter` rule condition.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-isRegexSupported-regexOptions" class="dcc-code-sections__label">

  regexOptions

  </div>

  <div class="dcc-type--xsmall">

  [RegexOptions](#type-RegexOptions)

  </div>

  </div>

  The regular expression to check.

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[IsRegexSupportedResult](#type-IsRegexSupportedResult)\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves with details consisting of whether the regular expression is supported and the reason if not.

</div>

<div>

<div class="notranslate">

### setExtensionActionOptions()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 88+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.setExtensionActionOptions(
  options: ExtensionActionOptions,
): Promise<void>
```

Configures if the action count for tabs should be displayed as the extension action's badge text and provides a way for that action count to be incremented.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-setExtensionActionOptions-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [ExtensionActionOptions](#type-ExtensionActionOptions)

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

</div>

<div>

<div class="notranslate">

### testMatchOutcome()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 103+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.testMatchOutcome(
  request: TestMatchRequestDetails,
): Promise<TestMatchOutcomeResult>
```

Checks if any of the extension's declarativeNetRequest rules would match a hypothetical request. Note: Only available for unpacked extensions as this is only intended to be used during extension development.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-testMatchOutcome-request" class="dcc-code-sections__label">

  request

  </div>

  <div class="dcc-type--xsmall">

  [TestMatchRequestDetails](#type-TestMatchRequestDetails)

  </div>

  </div>

</div>

<div class="dcc-code-sections">

#### Returns

- <div>

  <div class="dcc-type--xsmall">

  Promise\<[TestMatchOutcomeResult](#type-TestMatchOutcomeResult)\>

  </div>

  </div>

  Promise that resolves with the details of matched rules.

</div>

<div>

<div class="notranslate">

### updateDynamicRules()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.updateDynamicRules(
  options: UpdateRuleOptions,
): Promise<void>
```

Modifies the current set of dynamic rules for the extension. The rules with IDs listed in `options.removeRuleIds` are first removed, and then the rules given in `options.addRules` are added. Notes:

- This update happens as a single atomic operation: either all specified rules are added and removed, or an error is returned.
- These rules are persisted across browser sessions and across extension updates.
- Static rules specified as part of the extension package can not be removed using this function.
- [`MAX_NUMBER_OF_DYNAMIC_RULES`](#property-MAX_NUMBER_OF_DYNAMIC_RULES) is the maximum number of dynamic rules an extension can add. The number of [unsafe rules](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#safe_rules) must not exceed [`MAX_NUMBER_OF_UNSAFE_DYNAMIC_RULES`](#property-MAX_NUMBER_OF_UNSAFE_DYNAMIC_RULES).

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-updateDynamicRules-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [UpdateRuleOptions](#type-UpdateRuleOptions)

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 87+ </span>

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves once the update is complete. In case of an error, the promise will be rejected and no change will be made to the rule set. This can happen for multiple reasons, such as invalid rule format, duplicate rule ID, rule count limit exceeded, internal errors, and others.

</div>

<div>

<div class="notranslate">

### updateEnabledRulesets()

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.updateEnabledRulesets(
  options: UpdateRulesetOptions,
): Promise<void>
```

Updates the set of enabled static rulesets for the extension. The rulesets with IDs listed in `options.disableRulesetIds` are first removed, and then the rulesets listed in `options.enableRulesetIds` are added. Note that the set of enabled static rulesets is persisted across sessions but not across extension updates, i.e. the `rule_resources` manifest key will determine the set of enabled static rulesets on each extension update.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-updateEnabledRulesets-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [UpdateRulesetOptions](#type-UpdateRulesetOptions)

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 87+ </span>

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves once the update is complete. In case of an error, the promise will be rejected and no change will be made to the set of enabled rulesets. This can happen for multiple reasons, such as invalid ruleset IDs, rule count limit exceeded, or internal errors.

</div>

<div>

<div class="notranslate">

### updateSessionRules()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 90+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.updateSessionRules(
  options: UpdateRuleOptions,
): Promise<void>
```

Modifies the current set of session scoped rules for the extension. The rules with IDs listed in `options.removeRuleIds` are first removed, and then the rules given in `options.addRules` are added. Notes:

- This update happens as a single atomic operation: either all specified rules are added and removed, or an error is returned.
- These rules are not persisted across sessions and are backed in memory.
- [`MAX_NUMBER_OF_SESSION_RULES`](#property-MAX_NUMBER_OF_SESSION_RULES) is the maximum number of session rules an extension can add.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-updateSessionRules-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [UpdateRuleOptions](#type-UpdateRuleOptions)

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

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 91+ </span>

  </div>

  </div>

  Promise that resolves once the update is complete. In case of an error, the promise will be rejected and no change will be made to the rule set. This can happen for multiple reasons, such as invalid rule format, duplicate rule ID, rule count limit exceeded, and others.

</div>

<div>

<div class="notranslate">

### updateStaticRules()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 111+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.updateStaticRules(
  options: UpdateStaticRulesOptions,
): Promise<void>
```

Disables and enables individual static rules in a [`Ruleset`](#type-Ruleset). Changes to rules belonging to a disabled [`Ruleset`](#type-Ruleset) will take effect the next time that it becomes enabled.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-updateStaticRules-options" class="dcc-code-sections__label">

  options

  </div>

  <div class="dcc-type--xsmall">

  [UpdateStaticRulesOptions](#type-UpdateStaticRulesOptions)

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

  Promise that resolves when the update is complete. In case of an error, the promise will be rejected and no change will be made to the enabled static rules.

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onRuleMatchedDebug

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(
  callback: function,
)
```

Fired when a rule is matched with a request. Only available for unpacked extensions with the `"declarativeNetRequestFeedback"` permission as this is intended to be used for debugging purposes only.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onRuleMatchedDebug-callback" class="dcc-code-sections__label">

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
  (info: MatchedRuleInfoDebug) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onRuleMatchedDebug-callback-info" class="dcc-code-sections__label">

    info

    </div>

    <div class="dcc-type--xsmall">

    [MatchedRuleInfoDebug](#type-MatchedRuleInfoDebug)

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

Last updated 2026-05-05 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-05-05 UTC."\],\[\],\[\]\]

</div>

</div>