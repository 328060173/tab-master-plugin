> 来源: https://developer.chrome.com/docs/extensions/reference/api/events
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

# chrome.events <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

The `chrome.events` namespace contains common types used by APIs dispatching events to notify you when something interesting happens.

</div>

## Concepts and usage

An `Event` is an object that lets you be notified when something interesting happens. Here's an example of using the `chrome.alarms.onAlarm` event to be notified whenever an alarm has elapsed:

<div>

</div>

``` devsite-click-to-copy
chrome.alarms.onAlarm.addListener((alarm) => {
  appendToLog(`alarms.onAlarm -- name: ${alarm.name}, scheduledTime: ${alarm.scheduledTime}`);
});
```

As the example shows, you register for notification using `addListener()`. The argument to `addListener()` is always a function that you define to handle the event, but the parameters to the function depend on which event you're handling. Checking the documentation for [`alarms.onAlarm`](/docs/extensions/reference/api/alarms#event-onAlarm), you can see that the function has a single parameter: an [`alarms.Alarm`](/docs/extensions/reference/api/alarms#type-Alarm) object that has details about the elapsed alarm.

Example APIs using Events: [alarms](/docs/extensions/reference/api/alarms), [i18n](/docs/extensions/reference/api/i18n), [identity](/docs/extensions/reference/api/identity), [runtime](/docs/extensions/reference/api/runtime). Most [chrome APIs](/docs/extensions/reference/api) do.

### Declarative Event Handlers

The declarative event handlers provide a means to define rules consisting of declarative conditions and actions. Conditions are evaluated in the browser rather than the JavaScript engine which reduces roundtrip latencies and allows for very high efficiency.

Declarative event handlers are used for example in the [Declarative Content API](/docs/extensions/reference/api/declarativeContent). This page describes the underlying concepts of all declarative event handlers.

#### Rules

The simplest possible rule consists of one or more conditions and one or more actions:

<div>

</div>

``` devsite-click-to-copy
const rule = {
  conditions: [ /* my conditions */ ],
  actions: [ /* my actions */ ]
};
```

If any of the conditions is fulfilled, all actions are executed.

In addition to conditions and actions you may give each rule an identifier, which simplifies unregistering previously registered rules, and a priority to define precedences among rules. Priorities are only considered if rules conflict each other or need to be executed in a specific order. Actions are executed in descending order of the priority of their rules.

<div>

</div>

``` devsite-click-to-copy
const rule = {
  id: "my rule",  // optional, will be generated if not set.
  priority: 100,  // optional, defaults to 100.
  conditions: [ /* my conditions */ ],
  actions: [ /* my actions */ ]
};
```

#### Event objects

Event objects may support rules. These event objects don't call a callback function when events happen but test whether any registered rule has at least one fulfilled condition and execute the actions associated with this rule. Event objects supporting the declarative API have three relevant methods: [`events.Event.addRules()`](#method-Event-addRules), [`events.Event.removeRules()`](#method-Event-removeRules), and [`events.Event.getRules()`](#method-Event-getRules).

#### Add rules

To add rules call the `addRules()` function of the event object. It takes an array of rule instances as its first parameter and a callback function that is called on completion.

<div>

</div>

``` devsite-click-to-copy
const rule_list = [rule1, rule2, ...];
addRules(rule_list, (details) => {...});
```

If the rules were inserted successfully, the `details` parameter contains an array of inserted rules appearing in the same order as in the passed `rule_list` where the optional parameters `id` and `priority` were filled with the generated values. If any rule is invalid, for example, because it contained an invalid condition or action, none of the rules are added and the [runtime.lastError](/docs/extensions/reference/api/runtime#property-lastError) variable is set when the callback function is called. Each rule in `rule_list` must contain a unique identifier that is not already used by another rule or an empty identifier.

<div class="aside note">

**Note:** Rules are persistent across browsing sessions. Therefore, you should install rules during extension installation time using the [`runtime.onInstalled`](/docs/extensions/reference/api/runtime#event-onInstalled) event. Note that this event is also triggered when an extension is updated. Therefore, you should first clear previously installed rules and then register new rules.

</div>

#### Remove rules

To remove rules call the `removeRules()` function. It accepts an optional array of rule identifiers as its first parameter and a callback function as its second parameter.

<div>

</div>

``` devsite-click-to-copy
const rule_ids = ["id1", "id2", ...];
removeRules(rule_ids, () => {...});
```

If `rule_ids` is an array of identifiers, all rules having identifiers listed in the array are removed. If `rule_ids` lists an identifier, that is unknown, this identifier is silently ignored. If `rule_ids` is `undefined`, all registered rules of this extension are removed. The `callback()` function is called when the rules were removed.

#### Retrieve rules

To retrieve a list of registered rules, call the `getRules()` function. It accepts an optional array of rule identifiers with the same semantics as `removeRules()` and a callback function.

<div>

</div>

``` devsite-click-to-copy
const rule_ids = ["id1", "id2", ...];
getRules(rule_ids, (details) => {...});
```

The `details` parameter passed to the `callback()` function refers to an array of rules including filled optional parameters.

#### Performance

To achieve maximum performance, you should keep the following guidelines in mind.

**Register and unregister rules in bulk.** After each registration or unregistration, Chrome needs to update internal data structures. This update is an expensive operation.

<div class="dcc-compare">

<div class="compare-worse">

Instead of

</div>

<div>

</div>

``` devsite-click-to-copy
const rule1 = {...};
const rule2 = {...};
chrome.declarativeWebRequest.onRequest.addRules([rule1]);
chrome.declarativeWebRequest.onRequest.addRules([rule2]);
```

</div>

<div class="dcc-compare">

<div class="compare-better">

Prefer

</div>

<div>

</div>

``` devsite-click-to-copy
const rule1 = {...};
const rule2 = {...};
chrome.declarativeWebRequest.onRequest.addRules([rule1, rule2]);
```

</div>

**Prefer substring matching over regular expressions in an [events.UrlFilter](#type-UrlFilter).** Substring based matching is extremely fast.

<div class="dcc-compare">

<div class="compare-worse">

Instead of

</div>

<div>

</div>

``` devsite-click-to-copy
const match = new chrome.declarativeWebRequest.RequestMatcher({
  url: {urlMatches: "example.com/[^?]*foo" }
});
```

</div>

<div class="dcc-compare">

<div class="compare-better">

Prefer

</div>

<div>

</div>

``` devsite-click-to-copy
const match = new chrome.declarativeWebRequest.RequestMatcher({
  url: {hostSuffix: "example.com", pathContains: "foo"}
});
```

</div>

If there are many rules that share the same actions, merge the rules into one. Rules trigger their actions as soon as a single condition is fulfilled. This speeds up the matching and reduces memory consumption for duplicate action sets.

<div class="dcc-compare">

<div class="compare-worse">

Instead of

</div>

<div>

</div>

``` devsite-click-to-copy
const condition1 = new chrome.declarativeWebRequest.RequestMatcher({
  url: { hostSuffix: 'example.com' }
});
const condition2 = new chrome.declarativeWebRequest.RequestMatcher({
  url: { hostSuffix: 'foobar.com' }
});
const rule1 = { conditions: [condition1],
                actions: [new chrome.declarativeWebRequest.CancelRequest()]
              };
const rule2 = { conditions: [condition2],
                actions: [new chrome.declarativeWebRequest.CancelRequest()]
              };
chrome.declarativeWebRequest.onRequest.addRules([rule1, rule2]);
```

</div>

<div class="dcc-compare">

<div class="compare-better">

Prefer

</div>

<div>

</div>

``` devsite-click-to-copy
const condition1 = new chrome.declarativeWebRequest.RequestMatcher({
  url: { hostSuffix: 'example.com' }
});
const condition2 = new chrome.declarativeWebRequest.RequestMatcher({
  url: { hostSuffix: 'foobar.com' }
});
const rule = { conditions: [condition1, condition2],
              actions: [new chrome.declarativeWebRequest.CancelRequest()]
             };
chrome.declarativeWebRequest.onRequest.addRules([rule]);
```

</div>

### Filtered events

Filtered events are a mechanism that allows listeners to specify a subset of events that they are interested in. A listener that uses a filter won't be invoked for events that don't pass the filter, which makes the listening code more declarative and efficient. A [service worker](/docs/extensions/mv3/service_workers) need not be woken up to handle events it doesn't care about.

Filtered events are intended to allow a transition from manual filtering code.

<div class="dcc-compare">

<div class="compare-worse">

Instead of

</div>

<div>

</div>

``` devsite-click-to-copy
chrome.webNavigation.onCommitted.addListener((event) => {
  if (hasHostSuffix(event.url, 'google.com') ||
      hasHostSuffix(event.url, 'google.com.au')) {
    // ...
  }
});
```

</div>

<div class="dcc-compare">

<div class="compare-better">

Prefer

</div>

<div>

</div>

``` devsite-click-to-copy
chrome.webNavigation.onCommitted.addListener((event) => {
  // ...
}, {url: [{hostSuffix: 'google.com'},
          {hostSuffix: 'google.com.au'}]});
```

</div>

Events support specific filters that are meaningful to that event. The list of filters that an event supports will be listed in the documentation for that event in the "filters" section.

When matching URLs (as in the example above), event filters support the same URL matching capabilities as expressible with a [`events.UrlFilter`](#type-UrlFilter), except for scheme and port matching.

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### Event

</div>

An object which allows the addition and removal of listeners for a Chrome event.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="method-Event-addListener" class="dcc-code-sections__label">

  addListener

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Registers an event listener *callback* to an event.

  The `addListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: H) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-Event-addListener-callback" class="dcc-code-sections__label">

    callback

    </div>

    <div class="dcc-type--xsmall">

    H

    </div>

    </div>

    Called when an event occurs. The parameters of this function depend on the type of event.

  </div>

- <div>

  <div id="method-Event-addRules" class="dcc-code-sections__label">

  addRules

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Registers rules to handle events.

  The `addRules` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (rules: Rule<anyany>[], callback?: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-Event-addRules-rules" class="dcc-code-sections__label">

    rules

    </div>

    <div class="dcc-type--xsmall">

    [Rule](#type-Rule)\<anyany\>\[\]

    </div>

    </div>

    Rules to be registered. These do not replace previously registered rules.

  - <div>

    <div id="method-Event-addRules-callback" class="dcc-code-sections__label">

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
    (rules: Rule<anyany>[]) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-Event-addRules-callback-rules" class="dcc-code-sections__label">

      rules

      </div>

      <div class="dcc-type--xsmall">

      [Rule](#type-Rule)\<anyany\>\[\]

      </div>

      </div>

      Rules that were registered, the optional parameters are filled with values.

    </div>

  </div>

- <div>

  <div id="method-Event-getRules" class="dcc-code-sections__label">

  getRules

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Returns currently registered rules.

  The `getRules` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (ruleIdentifiers?: string[], callback: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-Event-getRules-ruleIdentifiers" class="dcc-code-sections__label">

    ruleIdentifiers

    </div>

    <div class="dcc-type--xsmall">

    string\[\] <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    If an array is passed, only rules with identifiers contained in this array are returned.

  - <div>

    <div id="method-Event-getRules-callback" class="dcc-code-sections__label">

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
    (rules: Rule<anyany>[]) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-Event-getRules-callback-rules" class="dcc-code-sections__label">

      rules

      </div>

      <div class="dcc-type--xsmall">

      [Rule](#type-Rule)\<anyany\>\[\]

      </div>

      </div>

      Rules that were registered, the optional parameters are filled with values.

    </div>

  </div>

- <div>

  <div id="method-Event-hasListener" class="dcc-code-sections__label">

  hasListener

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  The `hasListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: H) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-Event-hasListener-callback" class="dcc-code-sections__label">

    callback

    </div>

    <div class="dcc-type--xsmall">

    H

    </div>

    </div>

    Listener whose registration status shall be tested.

  </div>

  <div class="dcc-code-sections">

  - <div>

    <div id="method-Event-hasListener" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    boolean

    </div>

    </div>

    True if *callback* is registered to the event.

  </div>

- <div>

  <div id="method-Event-hasListeners" class="dcc-code-sections__label">

  hasListeners

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  The `hasListeners` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  () => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="method-Event-hasListeners" class="dcc-code-sections__label">

    returns

    </div>

    <div class="dcc-type--xsmall">

    boolean

    </div>

    </div>

    True if any event listeners are registered to the event.

  </div>

- <div>

  <div id="method-Event-removeListener" class="dcc-code-sections__label">

  removeListener

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Deregisters an event listener *callback* from an event.

  The `removeListener` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (callback: H) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-Event-removeListener-callback" class="dcc-code-sections__label">

    callback

    </div>

    <div class="dcc-type--xsmall">

    H

    </div>

    </div>

    Listener that shall be unregistered.

  </div>

- <div>

  <div id="method-Event-removeRules" class="dcc-code-sections__label">

  removeRules

  </div>

  <div class="dcc-type--xsmall">

  void

  </div>

  </div>

  Unregisters currently registered rules.

  The `removeRules` function looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

  <div>

  </div>

  ``` devsite-click-to-copy
  (ruleIdentifiers?: string[], callback?: function) => {...}
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-Event-removeRules-ruleIdentifiers" class="dcc-code-sections__label">

    ruleIdentifiers

    </div>

    <div class="dcc-type--xsmall">

    string\[\] <span class="dcc-code-sections__optional">optional</span>

    </div>

    </div>

    If an array is passed, only rules with identifiers contained in this array are unregistered.

  - <div>

    <div id="method-Event-removeRules-callback" class="dcc-code-sections__label">

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

</div>

<div>

<div class="notranslate">

### Rule

</div>

Description of a declarative rule for handling events.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-Rule-actions" class="dcc-code-sections__label">

  actions

  </div>

  <div class="dcc-type--xsmall">

  any\[\]

  </div>

  </div>

  List of actions that are triggered if one of the conditions is fulfilled.

- <div>

  <div id="property-Rule-conditions" class="dcc-code-sections__label">

  conditions

  </div>

  <div class="dcc-type--xsmall">

  any\[\]

  </div>

  </div>

  List of conditions that can trigger the actions.

- <div>

  <div id="property-Rule-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Optional identifier that allows referencing this rule.

- <div>

  <div id="property-Rule-priority" class="dcc-code-sections__label">

  priority

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Optional priority of this rule. Defaults to 100.

- <div>

  <div id="property-Rule-tags" class="dcc-code-sections__label">

  tags

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Tags can be used to annotate rules and perform operations on sets of rules.

</div>

<div>

<div class="notranslate">

### UrlFilter

</div>

Filters URLs for various criteria. See [event filtering](https://developer.chrome.com/docs/extensions/reference/events/#filtered). All criteria are case sensitive.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-UrlFilter-cidrBlocks" class="dcc-code-sections__label">

  cidrBlocks

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 123+ </span>

  </div>

  </div>

  Matches if the host part of the URL is an IP address and is contained in any of the CIDR blocks specified in the array.

- <div>

  <div id="property-UrlFilter-hostContains" class="dcc-code-sections__label">

  hostContains

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the host name of the URL contains a specified string. To test whether a host name component has a prefix 'foo', use hostContains: '.foo'. This matches 'www.foobar.com' and 'foo.com', because an implicit dot is added at the beginning of the host name. Similarly, hostContains can be used to match against component suffix ('foo.') and to exactly match against components ('.foo.'). Suffix- and exact-matching for the last components need to be done separately using hostSuffix, because no implicit dot is added at the end of the host name.

- <div>

  <div id="property-UrlFilter-hostEquals" class="dcc-code-sections__label">

  hostEquals

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the host name of the URL is equal to a specified string.

- <div>

  <div id="property-UrlFilter-hostPrefix" class="dcc-code-sections__label">

  hostPrefix

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the host name of the URL starts with a specified string.

- <div>

  <div id="property-UrlFilter-hostSuffix" class="dcc-code-sections__label">

  hostSuffix

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the host name of the URL ends with a specified string.

- <div>

  <div id="property-UrlFilter-originAndPathMatches" class="dcc-code-sections__label">

  originAndPathMatches

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the URL without query segment and fragment identifier matches a specified regular expression. Port numbers are stripped from the URL if they match the default port number. The regular expressions use the [RE2 syntax](https://github.com/google/re2/blob/master/doc/syntax.txt).

- <div>

  <div id="property-UrlFilter-pathContains" class="dcc-code-sections__label">

  pathContains

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the path segment of the URL contains a specified string.

- <div>

  <div id="property-UrlFilter-pathEquals" class="dcc-code-sections__label">

  pathEquals

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the path segment of the URL is equal to a specified string.

- <div>

  <div id="property-UrlFilter-pathPrefix" class="dcc-code-sections__label">

  pathPrefix

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the path segment of the URL starts with a specified string.

- <div>

  <div id="property-UrlFilter-pathSuffix" class="dcc-code-sections__label">

  pathSuffix

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the path segment of the URL ends with a specified string.

- <div>

  <div id="property-UrlFilter-ports" class="dcc-code-sections__label">

  ports

  </div>

  <div class="dcc-type--xsmall">

  (number \| number\[\])\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the port of the URL is contained in any of the specified port lists. For example `[80, 443, [1000, 1200]]` matches all requests on port 80, 443 and in the range 1000-1200.

- <div>

  <div id="property-UrlFilter-queryContains" class="dcc-code-sections__label">

  queryContains

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the query segment of the URL contains a specified string.

- <div>

  <div id="property-UrlFilter-queryEquals" class="dcc-code-sections__label">

  queryEquals

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the query segment of the URL is equal to a specified string.

- <div>

  <div id="property-UrlFilter-queryPrefix" class="dcc-code-sections__label">

  queryPrefix

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the query segment of the URL starts with a specified string.

- <div>

  <div id="property-UrlFilter-querySuffix" class="dcc-code-sections__label">

  querySuffix

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the query segment of the URL ends with a specified string.

- <div>

  <div id="property-UrlFilter-schemes" class="dcc-code-sections__label">

  schemes

  </div>

  <div class="dcc-type--xsmall">

  string\[\] <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the scheme of the URL is equal to any of the schemes specified in the array.

- <div>

  <div id="property-UrlFilter-urlContains" class="dcc-code-sections__label">

  urlContains

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the URL (without fragment identifier) contains a specified string. Port numbers are stripped from the URL if they match the default port number.

- <div>

  <div id="property-UrlFilter-urlEquals" class="dcc-code-sections__label">

  urlEquals

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the URL (without fragment identifier) is equal to a specified string. Port numbers are stripped from the URL if they match the default port number.

- <div>

  <div id="property-UrlFilter-urlMatches" class="dcc-code-sections__label">

  urlMatches

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the URL (without fragment identifier) matches a specified regular expression. Port numbers are stripped from the URL if they match the default port number. The regular expressions use the [RE2 syntax](https://github.com/google/re2/blob/master/doc/syntax.txt).

- <div>

  <div id="property-UrlFilter-urlPrefix" class="dcc-code-sections__label">

  urlPrefix

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the URL (without fragment identifier) starts with a specified string. Port numbers are stripped from the URL if they match the default port number.

- <div>

  <div id="property-UrlFilter-urlSuffix" class="dcc-code-sections__label">

  urlSuffix

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Matches if the URL (without fragment identifier) ends with a specified string. Port numbers are stripped from the URL if they match the default port number.

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