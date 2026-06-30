> 来源: https://developer.chrome.com/docs/extensions/reference/api/privacy
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

# chrome.privacy <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.privacy` API to control usage of the features in Chrome that can affect a user's privacy. This API relies on the [ChromeSetting prototype of the type API](https://developer.chrome.com/docs/extensions/reference/types/#ChromeSetting) for getting and setting Chrome's configuration.

</div>

## Permissions

<div class="dcc-reference">

`privacy`\

</div>

You must declare the "privacy" permission in your extension's [manifest](/docs/extensions/mv3/manifest) to use the API. For example:

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "permissions": [
    "privacy"
  ],
  ...
}
```

## Concepts and usage

Reading the current value of a Chrome setting is straightforward. You'll first need to find the property you're interested in, then you'll call `get()` on that object in order to retrieve its current value and your extension's level of control. For example, to determine if Chrome's credit card autofill feature is enabled, you'd write:

<div>

</div>

``` devsite-click-to-copy
chrome.privacy.services.autofillCreditCardEnabled.get({}, function(details) {
  if (details.value) {
    console.log('Autofill is on!');
  } else {
    console.log('Autofill is off!');
  }
});
```

Changing the value of a setting is a little bit more complex, because you first must verify that your extension can control the setting. The user won't see any change to their settings if your extension toggles a setting that is either locked to a specific value by enterprise policies (`levelOfControl` will be set to "not_controllable"), or if another extension is controlling the value (`levelOfControl` will be set to "controlled_by_other_extensions"). The `set()` call will succeed, but the setting will be immediately overridden. As this might be confusing, it is advisable to warn the user when the settings they've chosen aren't practically applied.

<div class="aside note">

**Note:** Full details about extensions' ability to control `ChromeSetting`s can be found under [`chrome.types.ChromeSetting`](/docs/extensions/reference/api/types#type-ChromeSetting).

</div>

This means that you ought to use the `get()` method to determine your level of access, and then only call `set()` if your extension can grab control over the setting (in fact if your extension can't control the setting it's probably a good idea to visually disable the feature to reduce user confusion):

<div>

</div>

``` devsite-click-to-copy
chrome.privacy.services.autofillCreditCardEnabled.get({}, function(details) {
  if (details.levelOfControl === 'controllable_by_this_extension') {
    chrome.privacy.services.autofillCreditCardEnabled.set({ value: true }, function() {
      if (chrome.runtime.lastError === undefined) {
        console.log("Hooray, it worked!");
      } else {
        console.log("Sadness!", chrome.runtime.lastError);
      }
    });
  }
});
```

If you're interested in changes to a setting's value, add a listener to its `onChange` event. Among other uses, this will allow you to warn the user if a more recently installed extension grabs control of a setting, or if enterprise policy overrides your control. To listen for changes to credit card autofill status, for example, the following code would suffice:

<div>

</div>

``` devsite-click-to-copy
chrome.privacy.services.autofillCreditCardEnabled.onChange.addListener(
  function (details) {
    // The new value is stored in `details.value`, the new level of control
    // in `details.levelOfControl`, and `details.incognitoSpecific` will be
    // `true` if the value is specific to Incognito mode.
  }
);
```

## Examples

To try this API, install the [privacy API example](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/privacy) from the [chrome-extension-samples](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples) repository.

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### IPHandlingPolicy

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 48+ </span>

</div>

</div>

The IP handling policy of WebRTC.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"default"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"default_public_and_private_interfaces"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"default_public_interface_only"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"disable_non_proxied_udp"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

</div>

## Properties

<div>

<div>

<div class="notranslate">

### network

</div>

Settings that influence Chrome's handling of network connections in general.

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

  <div id="property-network-networkPredictionEnabled" class="dcc-code-sections__label">

  networkPredictionEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  If enabled, Chrome attempts to speed up your web browsing experience by pre-resolving DNS entries and preemptively opening TCP and SSL connections to servers. This preference only affects actions taken by Chrome's internal prediction service. It does not affect webpage-initiated prefectches or preconnects. This preference's value is a boolean, defaulting to `true`.

- <div>

  <div id="property-network-webRTCIPHandlingPolicy" class="dcc-code-sections__label">

  webRTCIPHandlingPolicy

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<[IPHandlingPolicy](#type-IPHandlingPolicy)\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 48+ </span>

  </div>

  </div>

  Allow users to specify the media performance/privacy tradeoffs which impacts how WebRTC traffic will be routed and how much local address information is exposed. This preference's value is of type IPHandlingPolicy, defaulting to `default`.

</div>

<div>

<div class="notranslate">

### services

</div>

Settings that enable or disable features that require third-party network services provided by Google and your default search provider.

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

  <div id="property-services-alternateErrorPagesEnabled" class="dcc-code-sections__label">

  alternateErrorPagesEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  If enabled, Chrome uses a web service to help resolve navigation errors. This preference's value is a boolean, defaulting to `true`.

- <div>

  <div id="property-services-autofillAddressEnabled" class="dcc-code-sections__label">

  autofillAddressEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 70+ </span>

  </div>

  </div>

  If enabled, Chrome offers to automatically fill in addresses and other form data. This preference's value is a boolean, defaulting to `true`.

- <div>

  <div id="property-services-autofillCreditCardEnabled" class="dcc-code-sections__label">

  autofillCreditCardEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 70+ </span>

  </div>

  </div>

  If enabled, Chrome offers to automatically fill in credit card forms. This preference's value is a boolean, defaulting to `true`.

- <div>

  <div id="property-services-autofillEnabled" class="dcc-code-sections__label">

  autofillEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 70</span>

  </div>

  </div>

  Please use privacy.services.autofillAddressEnabled and privacy.services.autofillCreditCardEnabled. This remains for backward compatibility in this release and will be removed in the future.

  If enabled, Chrome offers to automatically fill in forms. This preference's value is a boolean, defaulting to `true`.

- <div>

  <div id="property-services-passwordSavingEnabled" class="dcc-code-sections__label">

  passwordSavingEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  If enabled, the password manager will ask if you want to save passwords. This preference's value is a boolean, defaulting to `true`.

- <div>

  <div id="property-services-safeBrowsingEnabled" class="dcc-code-sections__label">

  safeBrowsingEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  If enabled, Chrome does its best to protect you from phishing and malware. This preference's value is a boolean, defaulting to `true`.

- <div>

  <div id="property-services-safeBrowsingExtendedReportingEnabled" class="dcc-code-sections__label">

  safeBrowsingExtendedReportingEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  If enabled, Chrome will send additional information to Google when SafeBrowsing blocks a page, such as the content of the blocked page. This preference's value is a boolean, defaulting to `false`.

- <div>

  <div id="property-services-searchSuggestEnabled" class="dcc-code-sections__label">

  searchSuggestEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  If enabled, Chrome sends the text you type into the Omnibox to your default search engine, which provides predictions of websites and searches that are likely completions of what you've typed so far. This preference's value is a boolean, defaulting to `true`.

- <div>

  <div id="property-services-spellingServiceEnabled" class="dcc-code-sections__label">

  spellingServiceEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  If enabled, Chrome uses a web service to help correct spelling errors. This preference's value is a boolean, defaulting to `false`.

- <div>

  <div id="property-services-translationServiceEnabled" class="dcc-code-sections__label">

  translationServiceEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  If enabled, Chrome offers to translate pages that aren't in a language you read. This preference's value is a boolean, defaulting to `true`.

</div>

<div>

<div class="notranslate">

### websites

</div>

Settings that determine what information Chrome makes available to websites.

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

  <div id="property-websites-adMeasurementEnabled" class="dcc-code-sections__label">

  adMeasurementEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 111+ </span>

  </div>

  </div>

  If disabled, the [Attribution Reporting API](https://developer.chrome.com/en/docs/privacy-sandbox/attribution-reporting/) and [Private Aggregation API](https://developer.chrome.com/docs/privacy-sandbox/private-aggregation/) are deactivated. The value of this preference is of type boolean, and the default value is `true`. Extensions may only disable these APIs by setting the value to `false`. If you try setting these APIs to `true`, it will throw an error.

- <div>

  <div id="property-websites-doNotTrackEnabled" class="dcc-code-sections__label">

  doNotTrackEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 65+ </span>

  </div>

  </div>

  If enabled, Chrome sends 'Do Not Track' (`DNT: 1`) header with your requests. The value of this preference is of type boolean, and the default value is `false`.

- <div>

  <div id="property-websites-fledgeEnabled" class="dcc-code-sections__label">

  fledgeEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 111+ </span>

  </div>

  </div>

  If disabled, the [Fledge API](https://developer.chrome.com/docs/privacy-sandbox/fledge/) is deactivated. The value of this preference is of type boolean, and the default value is `true`. Extensions may only disable this API by setting the value to `false`. If you try setting this API to `true`, it will throw an error.

- <div>

  <div id="property-websites-hyperlinkAuditingEnabled" class="dcc-code-sections__label">

  hyperlinkAuditingEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  If enabled, Chrome sends auditing pings when requested by a website (`<a ping>`). The value of this preference is of type boolean, and the default value is `true`.

- <div>

  <div id="property-websites-protectedContentEnabled" class="dcc-code-sections__label">

  protectedContentEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  **Available on Windows and ChromeOS only**: If enabled, Chrome provides a unique ID to plugins in order to run protected content. The value of this preference is of type boolean, and the default value is `true`.

- <div>

  <div id="property-websites-referrersEnabled" class="dcc-code-sections__label">

  referrersEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  If enabled, Chrome sends `referer` headers with your requests. Yes, the name of this preference doesn't match the misspelled header. No, we're not going to change it. The value of this preference is of type boolean, and the default value is `true`.

- <div>

  <div id="property-websites-relatedWebsiteSetsEnabled" class="dcc-code-sections__label">

  relatedWebsiteSetsEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 121+ </span>

  </div>

  </div>

  If disabled, [Related Website Sets](https://developer.chrome.com/docs/privacy-sandbox/related-website-sets/) is deactivated. The value of this preference is of type boolean, and the default value is `true`. Extensions may only disable this API by setting the value to `false`. If you try setting this API to `true`, it will throw an error.

- <div>

  <div id="property-websites-thirdPartyCookiesAllowed" class="dcc-code-sections__label">

  thirdPartyCookiesAllowed

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  If disabled, Chrome blocks third-party sites from setting cookies. The value of this preference is of type boolean, and the default value is `true`. Extensions may not enable this API in Incognito mode, where third-party cookies are blocked and can only be allowed at the site level. If you try setting this API to true in Incognito, it will throw an error.

  Note: Individual sites may still be able to access third-party cookies when this API returns `false`, if they have a valid [exemption](https://developers.google.com/privacy-sandbox/cookies/temporary-exceptions/preserving-critical-user-experiences) or they use the [Storage Access API](https://developers.google.com/privacy-sandbox/cookies/storage-access-api) instead.

- <div>

  <div id="property-websites-topicsEnabled" class="dcc-code-sections__label">

  topicsEnabled

  </div>

  <div class="dcc-type--xsmall">

  [types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<boolean\>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 111+ </span>

  </div>

  </div>

  If disabled, the [Topics API](https://developer.chrome.com/en/docs/privacy-sandbox/topics/) is deactivated. The value of this preference is of type boolean, and the default value is `true`. Extensions may only disable this API by setting the value to `false`. If you try setting this API to `true`, it will throw an error.

</div>

</div>

</div>

</div>

<div class="devsite-floating-action-buttons">

</div>

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-06-17 UTC.

<div class="devsite-content-data">

\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-06-17 UTC."\],\[\],\[\]\]

</div>

</div>