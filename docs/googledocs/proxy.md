> 来源: https://developer.chrome.com/docs/extensions/reference/api/proxy
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

# chrome.proxy <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.proxy` API to manage Chrome's proxy settings. This API relies on the [ChromeSetting prototype of the type API](https://developer.chrome.com/docs/extensions/reference/api/types#type-ChromeSetting) for getting and setting the proxy configuration.

</div>

## Permissions

<div class="dcc-reference">

`proxy`\

</div>

You must declare the "proxy" permission in the [extension manifest](/docs/extensions/mv3/manifest) to use the proxy settings API. For example:

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My extension",
  ...
  "permissions": [
    "proxy"
  ],
  ...
}
```

## Concepts and usage

Proxy settings are defined in a [`proxy.ProxyConfig`](#type-ProxyConfig) object. Depending on Chrome's proxy settings, the settings may contain [`proxy.ProxyRules`](#type-ProxyRules) or a [`proxy.PacScript`](#type-PacScript).

### Proxy modes

A ProxyConfig object's `mode` attribute determines the overall behavior of Chrome with regards to proxy usage. It can take the following values:

`direct`  
In `direct` mode all connections are created directly, without any proxy involved. This mode allows no further parameters in the `ProxyConfig` object.

`auto_detect`  
In `auto_detect` mode the proxy configuration is determined by a PAC script that can be downloaded at <http://wpad/wpad.dat>. This mode allows no further parameters in the `ProxyConfig` object.

`pac_script`  
In `pac_script` mode the proxy configuration is determined by a PAC script that is either retrieved from the URL specified in the [`proxy.PacScript`](#type-PacScript) object or taken literally from the `data` element specified in the [`proxy.PacScript`](#type-PacScript) object. Besides this, this mode allows no further parameters in the `ProxyConfig` object.

`fixed_servers`  
In `fixed_servers` mode the proxy configuration is codified in a [`proxy.ProxyRules`](#type-ProxyRules) object. Its structure is described in [Proxy rules](#proxy_rules). Besides this, the `fixed_servers` mode allows no further parameters in the `ProxyConfig` object.

`system`  
In `system` mode the proxy configuration is taken from the operating system. This mode allows no further parameters in the `ProxyConfig` object. Note that the `system` mode is different from setting no proxy configuration. In the latter case, Chrome falls back to the system settings only if no command-line options influence the proxy configuration.

### Proxy rules

The [`proxy.ProxyRules`](#type-ProxyRules) object can contain either a `singleProxy` attribute or a subset of `proxyForHttp`, `proxyForHttps`, `proxyForFtp`, and `fallbackProxy`.

In the first case, HTTP, HTTPS and FTP traffic is proxied through the specified proxy server. Other traffic is sent directly. In the latter case the behavior is slightly more subtle: If a proxy server is configured for the HTTP, HTTPS or FTP protocol, the respective traffic is proxied through the specified server. If no such proxy server is specified or traffic uses a different protocol than HTTP, HTTPS or FTP, the `fallbackProxy` is used. If no `fallbackProxy` is specified, traffic is sent directly without a proxy server.

### Proxy server objects

A proxy server is configured in a [`proxy.ProxyServer`](#type-ProxyServer) object. The connection to the proxy server (defined by the `host` attribute) uses the protocol defined in the `scheme` attribute. If no `scheme` is specified, the proxy connection defaults to `http`.

If no `port` is defined in a [`proxy.ProxyServer`](#type-ProxyServer) object, the port is derived from the scheme. The default ports are:

|        |      |
|--------|------|
| Scheme | Port |
| http   | 80   |
| https  | 443  |
| socks4 | 1080 |
| socks5 | 1080 |

### Bypass list

Individual servers may be excluded from being proxied with the `bypassList`. This list may contain the following entries:

`[SCHEME://]HOST_PATTERN[:PORT]`  
Match all hostnames that match the pattern `HOST_PATTERN`. A leading `"."` is interpreted as a `"*."`.

Examples: `"foobar.com", "*foobar.com", "*.foobar.com", "*foobar.com:99", "https://x.*.y.com:99"`.

|  |  |  |
|----|----|----|
| Pattern | Matches | Does not match |
| `".foobar.com"` | `"www.foobar.com"` | `"foobar.com"` |
| `"*.foobar.com"` | `"www.foobar.com"` | `"foobar.com"` |
| `"foobar.com"` | `"foobar.com"` | `"www.foobar.com"` |
| `"*foobar.com"` | `"foobar.com"`, `"www.foobar.com"`, `"foofoobar.com"` |  |

`[SCHEME://]IP_LITERAL[:PORT]`  
Match URLs that are IP address literals. Conceptually this is the similar to the first case, but with special cases to handle IP literal canonicalization. For example, matching on "\[0:0:0::1\]" is the same as matching on "\[::1\]" because the IPv6 canonicalization is done internally.

Examples: `127.0.1`, `[0:0::1]`, `[::1]:80`, `https://[::1]:443`

`IP_LITERAL/PREFIX_LENGTH_IN_BITS`  
Match any URL containing an IP literal (`IP_LITERAL`) within the given range. The IP range (`PREFIX_LENGTH_IN_BITS`) is specified using [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation).

Match any URL containing an IP literal within the given range. The IP range is specified using CIDR notation. Examples: `"192.168.1.1/16", "fefe:13::abc/33"`

`<local>`  
The literal string `<local>` matches simple hostnames. A simple hostname is one that contains no dots and is not an IP literal. For instance `example` and `localhost` are simple hostnames, whereas `example.com`, `example.`, and `[::1]` are not.

Example: `"<local>"`

## Examples

The following code sets a SOCKS 5 proxy for HTTP connections to all servers but foobar.com and uses direct connections for all other protocols. The settings apply to regular and incognito windows, as incognito windows inherit settings from regular windows. See also the [Types API](/docs/extensions/reference/api/types#type-ChromeSetting) documentation.

<div>

</div>

``` devsite-click-to-copy
var config = {
  mode: "fixed_servers",
  rules: {
    proxyForHttp: {
      scheme: "socks5",
      host: "1.2.3.4"
    },
    bypassList: ["foobar.com"]
  }
};
chrome.proxy.settings.set(
  {value: config, scope: 'regular'},
  function() {}
);
```

The following code sets a custom PAC script.

<div>

</div>

``` devsite-click-to-copy
var config = {
  mode: "pac_script",
  pacScript: {
    data: "function FindProxyForURL(url, host) {\n" +
          "  if (host == 'foobar.com')\n" +
          "    return 'PROXY blackhole:80';\n" +
          "  return 'DIRECT';\n" +
          "}"
  }
};
chrome.proxy.settings.set(
  {value: config, scope: 'regular'},
  function() {}
);
```

The next snippet queries the current effective proxy settings. The effective proxy settings can be determined by another extension or by a policy. See the [Types API](/docs/extensions/reference/api/types#type-ChromeSetting) documentation for details.

<div>

</div>

``` devsite-click-to-copy
chrome.proxy.settings.get(
  {'incognito': false},
  function(config) {
    console.log(JSON.stringify(config));
  }
);
```

Note that the `value` object passed to `set()` is not identical to the `value` object passed to callback function of `get()`. The latter will contain a `rules.proxyForHttp.port` element.

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### Mode

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"direct"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"auto_detect"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"pac_script"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"fixed_servers"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"system"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### PacScript

</div>

An object holding proxy auto-config information. Exactly one of the fields should be non-empty.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-PacScript-data" class="dcc-code-sections__label">

  data

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  A PAC script.

- <div>

  <div id="property-PacScript-mandatory" class="dcc-code-sections__label">

  mandatory

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  If true, an invalid PAC script will prevent the network stack from falling back to direct connections. Defaults to false.

- <div>

  <div id="property-PacScript-url" class="dcc-code-sections__label">

  url

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  URL of the PAC file to be used.

</div>

<div>

<div class="notranslate">

### ProxyConfig

</div>

An object encapsulating a complete proxy configuration.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ProxyConfig-mode" class="dcc-code-sections__label">

  mode

  </div>

  <div class="dcc-type--xsmall">

  [Mode](#type-Mode)

  </div>

  </div>

  'direct' = Never use a proxy 'auto_detect' = Auto detect proxy settings 'pac_script' = Use specified PAC script 'fixed_servers' = Manually specify proxy servers 'system' = Use system proxy settings

- <div>

  <div id="property-ProxyConfig-pacScript" class="dcc-code-sections__label">

  pacScript

  </div>

  <div class="dcc-type--xsmall">

  [PacScript](#type-PacScript) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The proxy auto-config (PAC) script for this configuration. Use this for 'pac_script' mode.

- <div>

  <div id="property-ProxyConfig-rules" class="dcc-code-sections__label">

  rules

  </div>

  <div class="dcc-type--xsmall">

  [ProxyRules](#type-ProxyRules) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The proxy rules describing this configuration. Use this for 'fixed_servers' mode.

</div>

<div>

<div class="notranslate">

### ProxyRules

</div>

An object encapsulating the set of proxy rules for all protocols. Use either 'singleProxy' or (a subset of) 'proxyForHttp', 'proxyForHttps', 'proxyForFtp' and 'fallbackProxy'.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ProxyRules-bypassList" class="dcc-code-sections__label">

  bypassList

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  List of servers to connect to without a proxy server.

- <div>

  <div id="property-ProxyRules-fallbackProxy" class="dcc-code-sections__label">

  fallbackProxy

  </div>

  <div class="dcc-type--xsmall">

  [ProxyServer](#type-ProxyServer) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The proxy server to be used for everthing else or if any of the specific proxyFor... is not specified.

- <div>

  <div id="property-ProxyRules-proxyForFtp" class="dcc-code-sections__label">

  proxyForFtp

  </div>

  <div class="dcc-type--xsmall">

  [ProxyServer](#type-ProxyServer) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The proxy server to be used for FTP requests.

- <div>

  <div id="property-ProxyRules-proxyForHttp" class="dcc-code-sections__label">

  proxyForHttp

  </div>

  <div class="dcc-type--xsmall">

  [ProxyServer](#type-ProxyServer) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The proxy server to be used for HTTP requests.

- <div>

  <div id="property-ProxyRules-proxyForHttps" class="dcc-code-sections__label">

  proxyForHttps

  </div>

  <div class="dcc-type--xsmall">

  [ProxyServer](#type-ProxyServer) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The proxy server to be used for HTTPS requests.

- <div>

  <div id="property-ProxyRules-singleProxy" class="dcc-code-sections__label">

  singleProxy

  </div>

  <div class="dcc-type--xsmall">

  [ProxyServer](#type-ProxyServer) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The proxy server to be used for all per-URL requests (that is http, https, and ftp).

</div>

<div>

<div class="notranslate">

### ProxyServer

</div>

An object encapsulating a single proxy server's specification.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-ProxyServer-host" class="dcc-code-sections__label">

  host

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  The hostname or IP address of the proxy server. Hostnames must be in ASCII (in Punycode format). IDNA is not supported, yet.

- <div>

  <div id="property-ProxyServer-port" class="dcc-code-sections__label">

  port

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The port of the proxy server. Defaults to a port that depends on the scheme.

- <div>

  <div id="property-ProxyServer-scheme" class="dcc-code-sections__label">

  scheme

  </div>

  <div class="dcc-type--xsmall">

  [Scheme](#type-Scheme) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The scheme (protocol) of the proxy server itself. Defaults to 'http'.

</div>

<div>

<div class="notranslate">

### Scheme

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span>

</div>

</div>

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"http"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"https"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"quic"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"socks4"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"socks5"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

</div>

## Properties

<div>

<div>

<div class="notranslate">

### settings

</div>

Proxy settings to be used. The value of this setting is a ProxyConfig object.

</div>

<div class="dcc-code-sections">

#### Type

<div class="dcc-code-sections__overline dcc-code-sections__label">

[types.ChromeSetting](https://developer.chrome.com/docs/extensions/reference/types/#type-ChromeSetting)\<[ProxyConfig](#type-ProxyConfig)\>

</div>

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onProxyError

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.proxy.onProxyError.addListener(
  callback: function,
)
```

Notifies about proxy errors.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onProxyError-callback" class="dcc-code-sections__label">

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

    <div id="type-onProxyError-callback-details" class="dcc-code-sections__label">

    details

    </div>

    <div class="dcc-type--xsmall">

    object

    </div>

    </div>

    <div class="dcc-code-sections">

    - <div>

      <div id="property-onProxyError-callback-details-details" class="dcc-code-sections__label">

      details

      </div>

      <div class="dcc-type--xsmall">

      string

      </div>

      </div>

      Additional details about the error such as a JavaScript runtime error.

    - <div>

      <div id="property-onProxyError-callback-details-error" class="dcc-code-sections__label">

      error

      </div>

      <div class="dcc-type--xsmall">

      string

      </div>

      </div>

      The error description.

    - <div>

      <div id="property-onProxyError-callback-details-fatal" class="dcc-code-sections__label">

      fatal

      </div>

      <div class="dcc-type--xsmall">

      boolean

      </div>

      </div>

      If true, the error was fatal and the network transaction was aborted. Otherwise, a direct connection is used instead.

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