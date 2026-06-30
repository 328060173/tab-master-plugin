> 来源: https://developer.chrome.com/docs/extensions/reference/api/ttsEngine
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

# chrome.ttsEngine <span slot="popout-heading"> Stay organized with collections </span> <span slot="popout-contents"> Save and categorize content based on your preferences. </span>

<div class="devsite-page-title-meta">

</div>

<div class="devsite-article-body clearfix">

<style>.dcc-reference{--color-hairline: #dadce0;--color-blue-lightest: rgba(232, 240, 254, 0.4);--color-blue-lighter: #d2e3fc;--color-blue-medium: #1967d2;--color-blue-darkest: #174ea6;--rgb-blue-darkest: 23, 78, 166;--color-yellow-lightest: rgba(254, 247, 224, 0.3);--color-yellow-lighter: #feefc3;--color-yellow-medium: #f29900;--color-yellow-darkest: #de7100;--rgb-yellow-darkest: 227, 117, 0;--color-red-lightest: rgba(252, 232, 230, 0.4);--color-red-lighter: rgba(252, 232, 230, 0.5);--color-red-medium: #c5221f;--color-red-darkest: #9f0e0e;--rgb-red-darkest: 165, 14, 14;--color-green-lightest: rgba(230, 244, 234, 0.4);--color-green-lighter: #ceead6;--color-green-medium: #188038;--color-green-darkest: #0d652d;--rgb-green-darkest: 13, 101, 45;--color-purple-lightest: rgba(243, 232, 253, 0.4);--color-purple-lighter: rgba(243, 232, 253, 0.5);--color-purple-medium: #8430ce;--color-purple-darkest: #681da8;--rgb-purple-darkest: 104, 29, 168;--color-pink-lightest: rgba(253, 231, 243, 0.4);--color-pink-lighter: rgba(253, 231, 243, 0.5);--color-pink-medium: #d01884;--color-pink-darkest: #9c166b;--rgb-pink-darkest: 156, 22, 107}.dcc-type--label{font-weight:500;font-size:.75rem;line-height:1.3333333333}.dcc-type--xsmall{font-size:.75rem;line-height:1.6666666667}h2.dcc-api-title{display:none}.dcc-code-sections ul{padding-left:0}.dcc-code-sections .dcc-code-sections{border:1px solid var(--color-hairline);padding:calc(1rem - 1px)}.dcc-code-sections .dcc-code-sections ul>li:first-child{border-top:0;padding-top:0}.dcc-code-sections .dcc-code-sections devsite-code{margin-left:calc(-1rem + 1px);margin-right:calc(-1rem + 1px)}.dcc-code-sections .dcc-type--small{font-size:.875em;line-height:2em}.dcc-code-sections__label{font-size:.875rem;line-height:2}.dcc-code-sections__type>:not(:last-child){margin-right:.5ch}.dcc-code-sections__enum{margin-bottom:1rem}.dcc-code-sections__icon::before{background:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNzc2MzkgMS41NTI3OUM3LjkxNzE2IDEuNDgyNCA4LjA4Mjg0IDEuNDgyNCA4LjIyMzYxIDEuNTUyNzlMMTQuMjIzNiA0LjU1Mjc5QzE0LjM5MyA0LjYzNzQ4IDE0LjUgNC44MTA2MSAxNC41IDVWMTFDMTQuNSAxMS4xODk0IDE0LjM5MyAxMS4zNjI1IDE0LjIyMzYgMTEuNDQ3Mkw4LjIyMzYxIDE0LjQ0NzJDOC4wODI4NCAxNC41MTc2IDcuOTE3MTYgMTQuNTE3NiA3Ljc3NjM5IDE0LjQ0NzJMMS43NzYzOSAxMS40NDcyQzEuNjA3IDExLjM2MjUgMS41IDExLjE4OTQgMS41IDExVjVDMS41IDQuODEwNjEgMS42MDcgNC42Mzc0OCAxLjc3NjM5IDQuNTUyNzlMNy43NzYzOSAxLjU1Mjc5Wk0yLjUgNS44MDkwMlYxMC42OTFMNy41IDEzLjE5MVY4LjMwOTAyTDIuNSA1LjgwOTAyWk04LjUgOC4zMDkwMlYxMy4xOTFMMTMuNSAxMC42OTFWNS44MDkwMkw4LjUgOC4zMDkwMlpNMTIuODgyIDVMOCA3LjQ0MDk4TDMuMTE4MDMgNUw4IDIuNTU5MDJMMTIuODgyIDVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=") center/contain no-repeat;content:"";display:inline-block;height:1.25em;margin-right:.5ch;vertical-align:middle;width:1.25em}.dcc-code-sections__icon.dcc-code-sections__icon--number::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiAyLjVINFY0LjVINlYyLjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik02IDUuNUg0VjcuNUg2VjUuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTQgOC41SDZWMTAuNUg0VjguNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTkgMi41SDdWNC41SDlWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNNyA1LjVIOVY3LjVIN1Y1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05IDguNUg3VjEwLjVIOVY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik03IDExLjVIOVYxMy41SDdWMTEuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPHBhdGggZD0iTTEyIDIuNUgxMFY0LjVIMTJWMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMTAgNS41SDEyVjcuNUgxMFY1LjVaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik0xMiA4LjVIMTBWMTAuNUgxMlY4LjVaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--string::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNC43MTQyOSAxMkg1Ljg1NzE0TDcuMjg1NzEgOC4yODU3MVY0LjVDNy4yODU3MSA0LjIyMzg2IDcuMDYxODYgNCA2Ljc4NTcxIDRIMy41QzMuMjIzODYgNCAzIDQuMjIzODYgMyA0LjVWNy43ODU3MUMzIDguMDYxODYgMy4yMjM4NiA4LjI4NTcxIDMuNSA4LjI4NTcxSDYuMTQyODZMNC43MTQyOSAxMlpNMTAuNDI4NiAxMkgxMS41NzE0TDEzIDguMjg1NzFWNC41QzEzIDQuMjIzODYgMTIuNzc2MSA0IDEyLjUgNEg5LjIxNDI5QzguOTM4MTQgNCA4LjcxNDI5IDQuMjIzODYgOC43MTQyOSA0LjVWNy43ODU3MUM4LjcxNDI5IDguMDYxODYgOC45MzgxNCA4LjI4NTcxIDkuMjE0MjkgOC4yODU3MUgxMS44NTcxTDEwLjQyODYgMTJaIiBmaWxsPSIjNUY2MzY4Ii8+Cjwvc3ZnPgo=")}.dcc-code-sections__icon.dcc-code-sections__icon--boolean::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIuMzUzNiA1Ljg1MzU1TDExLjY0NjQgNS4xNDY0NUw3IDkuNzkyODlMNC44NTM1NSA3LjY0NjQ1TDQuMTQ2NDUgOC4zNTM1NUw3IDExLjIwNzFMMTIuMzUzNiA1Ljg1MzU1WiIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIgM0MyIDIuNDQ3NzIgMi40NDc3MiAyIDMgMkgxM0MxMy41NTIzIDIgMTQgMi40NDc3MiAxNCAzVjEzQzE0IDEzLjU1MjMgMTMuNTUyMyAxNCAxMyAxNEgzQzIuNDQ3NzIgMTQgMiAxMy41NTIzIDIgMTNWM1pNMyAzSDEzVjEzSDNMMyAzWiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--function::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNSA0QzMuNSAyLjYxOTI5IDQuNjE5MjkgMS41IDYgMS41SDYuNVYyLjVINkM1LjE3MTU3IDIuNSA0LjUgMy4xNzE1NyA0LjUgNFY1Ljc2MzkzQzQuNSA2LjcxMDg2IDMuOTY0OTkgNy41NzY1MiAzLjExODAzIDhDMy45NjQ5OSA4LjQyMzQ4IDQuNSA5LjI4OTE0IDQuNSAxMC4yMzYxVjEyQzQuNSAxMi44Mjg0IDUuMTcxNTcgMTMuNSA2IDEzLjVINi41VjE0LjVINkM0LjYxOTI5IDE0LjUgMy41IDEzLjM4MDcgMy41IDEyVjEwLjIzNjFDMy41IDkuNjY3OTEgMy4xNzkgOS4xNDg1MiAyLjY3MDgyIDguODk0NDNMMS43NzYzOSA4LjQ0NzIxQzEuNjA3IDguMzYyNTIgMS41IDguMTg5MzkgMS41IDhDMS41IDcuODEwNjEgMS42MDcgNy42Mzc0OCAxLjc3NjM5IDcuNTUyNzlMMi42NzA4MiA3LjEwNTU3QzMuMTc5IDYuODUxNDggMy41IDYuMzMyMDkgMy41IDUuNzYzOTNWNFpNMTAgMi41SDkuNVYxLjVIMTBDMTEuMzgwNyAxLjUgMTIuNSAyLjYxOTI5IDEyLjUgNFY1Ljc2MzkzQzEyLjUgNi4zMzIwOSAxMi44MjEgNi44NTE0OCAxMy4zMjkyIDcuMTA1NTdMMTQuMjIzNiA3LjU1Mjc5QzE0LjM5MyA3LjYzNzQ4IDE0LjUgNy44MTA2MSAxNC41IDhDMTQuNSA4LjE4OTM5IDE0LjM5MyA4LjM2MjUyIDE0LjIyMzYgOC40NDcyMUwxMy4zMjkyIDguODk0NDNDMTIuODIxIDkuMTQ4NTIgMTIuNSA5LjY2NzkxIDEyLjUgMTAuMjM2MVYxMkMxMi41IDEzLjM4MDcgMTEuMzgwNyAxNC41IDEwIDE0LjVIOS41VjEzLjVIMTBDMTAuODI4NCAxMy41IDExLjUgMTIuODI4NCAxMS41IDEyVjEwLjIzNjFDMTEuNSA5LjI4OTE0IDEyLjAzNSA4LjQyMzQ4IDEyLjg4MiA4QzEyLjAzNSA3LjU3NjUyIDExLjUgNi43MTA4NiAxMS41IDUuNzYzOTNWNEMxMS41IDMuMTcxNTcgMTAuODI4NCAyLjUgMTAgMi41WiIgZmlsbD0iIzVGNjM2OCIvPgo8L3N2Zz4K")}.dcc-code-sections__icon.dcc-code-sections__icon--array::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDYuNUg0VjkuNUgxMlY2LjVaTTEyIDUuNUg0VjNIMTJWNS41Wk0xMyAzQzEzIDIuNDQ3NzIgMTIuNTUyMyAyIDEyIDJINEMzLjQ0NzcyIDIgMyAyLjQ0NzcyIDMgM1YxM0MzIDEzLjU1MjMgMy40NDc3MiAxNCA0IDE0SDEyQzEyLjU1MjMgMTQgMTMgMTMuNTUyMyAxMyAxM1YzWk0xMiAxMC41SDRWMTNIMTJWMTAuNVoiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__icon.dcc-code-sections__icon--reference::before{background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMyAySDhWM0gzTDMgMTNIMTNWOEgxNFYxM0MxNCAxMy41NTIzIDEzLjU1MjMgMTQgMTMgMTRIM0MyLjQ0NzcyIDE0IDIgMTMuNTUyMyAyIDEzVjNDMiAyLjQ0NzcyIDIuNDQ3NzIgMiAzIDJaIiBmaWxsPSIjNUY2MzY4Ii8+CjxwYXRoIGQ9Ik05LjUgM0gxMi4yOTI5TDUuNjQ2NDUgOS42NDY0NUw2LjM1MzU1IDEwLjM1MzZMMTMgMy43MDcxMVY2LjVIMTRWMkg5LjVWM1oiIGZpbGw9IiM1RjYzNjgiLz4KPC9zdmc+Cg==")}.dcc-code-sections__optional{color:var(--color-pink-medium)}.dcc-code-sections__value{color:var(--color-code-number)}.dcc-code-sections__deprecated{color:var(--color-red-medium)}.dcc-code-sections__callback{display:block}p>.dcc-code-sections__callback{margin-top:.5em}.dcc-code-sections__overline{border-top:1px solid var(--color-hairline);margin:1em 0;padding-top:get-size(300)}.dcc-code-sections__mode{color:var(--color-code-comment);text-transform:uppercase}.dcc-code-sections li{border-top:1px solid var(--color-hairline);display:flex;flex-direction:column;padding-top:get-size(300);position:relative}.dcc-code-sections li>:first-child{font-weight:500;flex:0 0 auto;flex-shrink:1;min-width:9rem;padding-right:1rem}.dcc-code-sections li>:not(:first-child){flex-grow:1}.dcc-code-sections--summary{padding-left:0}.dcc-code-sections--summary>li:first-child{border-top:0;padding-top:0}@media(min-width: 992px){.dcc-code-sections--summary>li{flex-direction:row}}.dcc-code-sections--summary>li>:first-child{min-width:6.5rem}.dcc-tag-pill{--flow-space: 0.25rem;box-sizing:border-box;border-radius:.75rem;font-weight:500;font-size:.75rem;line-height:1.3333333333;margin:calc(var(--flow-space)/2);background-color:var(--color-blue-lightest);color:var(--color-blue-darkest);margin-bottom:.5rem;padding:.25rem .75rem;cursor:help}.dcc-tag-pill--blue{background-color:var(--color-blue-lightest);color:var(--color-blue-darkest)}.dcc-tag-pill--yellow{background-color:var(--color-yellow-lightest);color:var(--color-yellow-darkest)}.dcc-tag-pill--red{background-color:var(--color-red-lightest);color:var(--color-red-darkest)}.dcc-tag-pill--green{background-color:var(--color-green-lightest);color:var(--color-green-darkest)}.dcc-tag-pill--pink{background-color:var(--color-pink-lightest);color:var(--color-pink-darkest)}.dcc-tag-pill--purple{background-color:var(--color-purple-lightest);color:var(--color-purple-darkest)}a>.dcc-tag-pill{cursor:pointer}</style>

## Description

<div class="dcc-reference">

Use the `chrome.ttsEngine` API to implement a text-to-speech(TTS) engine using an extension. If your extension registers using this API, it will receive events containing an utterance to be spoken and other parameters when any extension or Chrome App uses the [`tts`](https://developer.chrome.com/docs/extensions/reference/tts/) API to generate speech. Your extension can then use any available web technology to synthesize and output the speech, and send events back to the calling function to report the status.

</div>

## Permissions

<div class="dcc-reference">

`ttsEngine`\

</div>

## Concepts and usage

An extension can register itself as a speech engine. By doing so, it can intercept some or all calls to functions such as [`tts.speak()`](/docs/extensions/reference/api/tts#method-speak) and [`tts.stop()`](/docs/extensions/reference/api/tts#method-stop) and provide an alternate implementation. Extensions are free to use any available web technology to provide speech, including streaming audio from a server, HTML5 audio. An extension could even do something different with the utterances, like display closed captions in a popup or send them as log messages to a remote server.

To implement a TTS engine, an extension must declare the "ttsEngine" permission and then declare all voices it provides in the extension manifest, like this:

<div>

</div>

``` devsite-click-to-copy
{
  "name": "My TTS Engine",
  "version": "1.0",
  "permissions": ["ttsEngine"],
  "tts_engine": {
    "voices": [
      {
        "voice_name": "Alice",
        "lang": "en-US",
        "event_types": ["start", "marker", "end"]
      },
      {
        "voice_name": "Pat",
        "lang": "en-US",
        "event_types": ["end"]
      }
    ]
  },
  "background": {
    "page": "background.html",
    "persistent": false
  }
}
```

An extension can specify any number of voices.

The `voice_name` parameter is required. The name should be descriptive enough that it identifies the name of the voice and the engine used. In the unlikely event that two extensions register voices with the same name, a client can specify the ID of the extension that should do the synthesis.

The `lang` parameter is optional, but highly recommended. Almost always, a voice can synthesize speech in just a single language. When an engine supports more than one language, it can easily register a separate voice for each language. Under rare circumstances where a single voice can handle more than one language, it's easiest to just list two separate voices and handle them using the same logic internally. However, if you want to create a voice that will handle utterances in any language, leave out the `lang` parameter from your extension's manifest.

Finally, the `event_types` parameter is required if the engine can send events to update the client on the progress of speech synthesis. At a minimum, supporting the `'end'` event type to indicate when speech is finished is highly recommended, otherwise Chrome cannot schedule queued utterances.

Once loaded, an extension can replace the list of declared voices by calling `chrome.ttsEngine.updateVoices`. (Note that the parameters used in the programmatic call to `updateVoices` are in camel case: e.g., `voiceName`, unlike the manifest file which uses `voice_name`.)

<div class="aside note">

**Note:** If your TTS engine does not support the `'end'` event type, Chrome cannot queue utterances because it has no way of knowing when your utterance has finished. To help mitigate this, Chrome passes an additional boolean `enqueue` option to your engine's onSpeak handler, giving you the option of implementing your own queueing. This is discouraged because then clients are unable to queue utterances that should get spoken by different speech engines.

</div>

The possible event types that you can send correspond to the event types that the `speak()` method receives:

- `'start'`: The engine has started speaking the utterance.
- `'word'`: A word boundary was reached. Use `event.charIndex` to determine the current speech position.
- `'sentence'`: A sentence boundary was reached. Use `event.charIndex` to determine the current speech position.
- `'marker'`: An SSML marker was reached. Use `event.charIndex` to determine the current speech position.
- `'end'`: The engine has finished speaking the utterance.
- `'error'`: An engine-specific error occurred and this utterance cannot be spoken. Pass more information in `event.errorMessage`.

The `'interrupted'` and `'cancelled'` events are not sent by the speech engine; they are generated automatically by Chrome.

Text-to-speech clients can get the voice information from your extension's manifest by calling [`tts.getVoices`](/docs/extensions/reference/api/tts#method-getVoices), assuming you've registered speech event listeners as described below.

### Handle speech events

To generate speech at the request of clients, your extension must register listeners for both `onSpeak` and `onStop`, like this:

<div>

</div>

``` devsite-click-to-copy
const speakListener = (utterance, options, sendTtsEvent) => {
  sendTtsEvent({type: 'start', charIndex: 0})

  // (start speaking)

  sendTtsEvent({type: 'end', charIndex: utterance.length})
};

const stopListener = () => {
  // (stop all speech)
};

chrome.ttsEngine.onSpeak.addListener(speakListener);
chrome.ttsEngine.onStop.addListener(stopListener);
```

<div class="aside caution">

**Caution:** If your extension does not register listeners for both `onSpeak` and `onStop`, it will not intercept any speech calls, regardless of what is in the manifest.

</div>

The decision of whether or not to send a given speech request to an extension is based solely on whether the extension supports the given voice parameters in its manifest and has registered listeners for `onSpeak` and `onStop`. In other words, there's no way for an extension to receive a speech request and dynamically decide whether to handle it.

<div class="dcc-reference">

## Types

<div>

<div>

<div class="notranslate">

### AudioBuffer

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 92+ </span>

</div>

</div>

Parameters containing an audio buffer and associated data.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-AudioBuffer-audioBuffer" class="dcc-code-sections__label">

  audioBuffer

  </div>

  <div class="dcc-type--xsmall">

  ArrayBuffer

  </div>

  </div>

  The audio buffer from the text-to-speech engine. It should have length exactly audioStreamOptions.bufferSize and encoded as mono, at audioStreamOptions.sampleRate, and as linear pcm, 32-bit signed float i.e. the Float32Array type in javascript.

- <div>

  <div id="property-AudioBuffer-charIndex" class="dcc-code-sections__label">

  charIndex

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The character index associated with this audio buffer.

- <div>

  <div id="property-AudioBuffer-isLastBuffer" class="dcc-code-sections__label">

  isLastBuffer

  </div>

  <div class="dcc-type--xsmall">

  boolean <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  True if this audio buffer is the last for the text being spoken.

</div>

<div>

<div class="notranslate">

### AudioStreamOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 92+ </span>

</div>

</div>

Contains the audio stream format expected to be produced by an engine.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-AudioStreamOptions-bufferSize" class="dcc-code-sections__label">

  bufferSize

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The number of samples within an audio buffer.

- <div>

  <div id="property-AudioStreamOptions-sampleRate" class="dcc-code-sections__label">

  sampleRate

  </div>

  <div class="dcc-type--xsmall">

  number

  </div>

  </div>

  The sample rate expected in an audio buffer.

</div>

<div>

<div class="notranslate">

### LanguageInstallStatus

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 132+ </span>

</div>

</div>

The install status of a voice.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"notInstalled"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"installing"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"installed"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"failed"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### LanguageStatus

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 132+ </span>

</div>

</div>

Install status of a language.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-LanguageStatus-error" class="dcc-code-sections__label">

  error

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Detail about installation failures. Optionally populated if the language failed to install.

- <div>

  <div id="property-LanguageStatus-installStatus" class="dcc-code-sections__label">

  installStatus

  </div>

  <div class="dcc-type--xsmall">

  [LanguageInstallStatus](#type-LanguageInstallStatus)

  </div>

  </div>

  Installation status.

- <div>

  <div id="property-LanguageStatus-lang" class="dcc-code-sections__label">

  lang

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Language string in the form of language code-region code, where the region may be omitted. Examples are en, en-AU, zh-CH.

</div>

<div>

<div class="notranslate">

### LanguageUninstallOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 132+ </span>

</div>

</div>

Options for uninstalling a given language.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-LanguageUninstallOptions-uninstallImmediately" class="dcc-code-sections__label">

  uninstallImmediately

  </div>

  <div class="dcc-type--xsmall">

  boolean

  </div>

  </div>

  True if the TTS client wants the language to be immediately uninstalled. The engine may choose whether or when to uninstall the language, based on this parameter and the requestor information. If false, it may use other criteria, such as recent usage, to determine when to uninstall.

</div>

<div>

<div class="notranslate">

### SpeakOptions

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 92+ </span>

</div>

</div>

Options specified to the tts.speak() method.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-SpeakOptions-gender" class="dcc-code-sections__label">

  gender

  </div>

  <div class="dcc-type--xsmall">

  [VoiceGender](#type-VoiceGender) <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  <div class="pad-top-200">

  <div>

  <span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 92</span>

  </div>

  </div>

  Gender is deprecated and will be ignored.

  Gender of voice for synthesized speech.

- <div>

  <div id="property-SpeakOptions-lang" class="dcc-code-sections__label">

  lang

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The language to be used for synthesis, in the form *language*-*region*. Examples: 'en', 'en-US', 'en-GB', 'zh-CN'.

- <div>

  <div id="property-SpeakOptions-pitch" class="dcc-code-sections__label">

  pitch

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Speaking pitch between 0 and 2 inclusive, with 0 being lowest and 2 being highest. 1.0 corresponds to this voice's default pitch.

- <div>

  <div id="property-SpeakOptions-rate" class="dcc-code-sections__label">

  rate

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Speaking rate relative to the default rate for this voice. 1.0 is the default rate, normally around 180 to 220 words per minute. 2.0 is twice as fast, and 0.5 is half as fast. This value is guaranteed to be between 0.1 and 10.0, inclusive. When a voice does not support this full range of rates, don't return an error. Instead, clip the rate to the range the voice supports.

- <div>

  <div id="property-SpeakOptions-voiceName" class="dcc-code-sections__label">

  voiceName

  </div>

  <div class="dcc-type--xsmall">

  string <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  The name of the voice to use for synthesis.

- <div>

  <div id="property-SpeakOptions-volume" class="dcc-code-sections__label">

  volume

  </div>

  <div class="dcc-type--xsmall">

  number <span class="dcc-code-sections__optional">optional</span>

  </div>

  </div>

  Speaking volume between 0 and 1 inclusive, with 0 being lowest and 1 being highest, with a default of 1.0.

</div>

<div>

<div class="notranslate">

### TtsClient

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 131+ </span>

</div>

</div>

Identifier for the client requesting status.

</div>

<div class="dcc-code-sections">

#### Properties

- <div>

  <div id="property-TtsClient-id" class="dcc-code-sections__label">

  id

  </div>

  <div class="dcc-type--xsmall">

  string

  </div>

  </div>

  Client making a language management request. For an extension, this is the unique extension ID. For Chrome features, this is the human-readable name of the feature.

- <div>

  <div id="property-TtsClient-source" class="dcc-code-sections__label">

  source

  </div>

  <div class="dcc-type--xsmall">

  [TtsClientSource](#type-TtsClientSource)

  </div>

  </div>

  Type of requestor.

</div>

<div>

<div class="notranslate">

### TtsClientSource

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 131+ </span>

</div>

</div>

Type of requestor.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"chromefeature"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"extension"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

<div>

<div class="notranslate">

### VoiceGender

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 54+ </span><span class="dcc-tag-pill--red dcc-tag-pill"> Deprecated since Chrome 70</span>

</div>

</div>

Gender is deprecated and will be ignored.

</div>

<div class="dcc-code-sections">

#### Enum

<div class="dcc-code-sections__overline dcc-code-sections__label">

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"male"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

<span style="white-space: nowrap;"></span>

<span class="dcc-code-sections__value">"female"</span>\
<span class="dcc-type--xsmall" style="white-space: initial"></span>

</div>

</div>

</div>

## Methods

<div>

<div>

<div class="notranslate">

### updateLanguage()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 132+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.ttsEngine.updateLanguage(
  status: LanguageStatus,
): void
```

Called by an engine when a language install is attempted, and when a language is uninstalled. Also called in response to a status request from a client. When a voice is installed or uninstalled, the engine should also call ttsEngine.updateVoices to register the voice.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-updateLanguage-status" class="dcc-code-sections__label">

  status

  </div>

  <div class="dcc-type--xsmall">

  [LanguageStatus](#type-LanguageStatus)

  </div>

  </div>

  The install status of the language.

</div>

<div>

<div class="notranslate">

### updateVoices()

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 66+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.ttsEngine.updateVoices(
  voices: TtsVoice[],
): void
```

Called by an engine to update its list of voices. This list overrides any voices declared in this extension's manifest.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="type-updateVoices-voices" class="dcc-code-sections__label">

  voices

  </div>

  <div class="dcc-type--xsmall">

  [TtsVoice](https://developer.chrome.com/docs/extensions/reference/tts/#type-TtsVoice)\[\]

  </div>

  </div>

  Array of [`tts.TtsVoice`](https://developer.chrome.com/docs/extensions/reference/tts/#type-TtsVoice) objects representing the available voices for speech synthesis.

</div>

</div>

## Events

<div>

<div>

<div class="notranslate">

### onInstallLanguageRequest

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 131+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.ttsEngine.onInstallLanguageRequest.addListener(
  callback: function,
)
```

Fired when a TTS client requests to install a new language. The engine should attempt to download and install the language, and call ttsEngine.updateLanguage with the result. On success, the engine should also call ttsEngine.updateVoices to register the newly available voices.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onInstallLanguageRequest-callback" class="dcc-code-sections__label">

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
  (requestor: TtsClient, lang: string) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onInstallLanguageRequest-callback-requestor" class="dcc-code-sections__label">

    requestor

    </div>

    <div class="dcc-type--xsmall">

    [TtsClient](#type-TtsClient)

    </div>

    </div>

  - <div>

    <div id="type-onInstallLanguageRequest-callback-lang" class="dcc-code-sections__label">

    lang

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onLanguageStatusRequest

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 132+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.ttsEngine.onLanguageStatusRequest.addListener(
  callback: function,
)
```

Fired when a TTS client requests the install status of a language.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onLanguageStatusRequest-callback" class="dcc-code-sections__label">

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
  (requestor: TtsClient, lang: string) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onLanguageStatusRequest-callback-requestor" class="dcc-code-sections__label">

    requestor

    </div>

    <div class="dcc-type--xsmall">

    [TtsClient](#type-TtsClient)

    </div>

    </div>

  - <div>

    <div id="type-onLanguageStatusRequest-callback-lang" class="dcc-code-sections__label">

    lang

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onPause

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.ttsEngine.onPause.addListener(
  callback: function,
)
```

Optional: if an engine supports the pause event, it should pause the current utterance being spoken, if any, until it receives a resume event or stop event. Note that a stop event should also clear the paused state.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onPause-callback" class="dcc-code-sections__label">

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

### onResume

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.ttsEngine.onResume.addListener(
  callback: function,
)
```

Optional: if an engine supports the pause event, it should also support the resume event, to continue speaking the current utterance, if any. Note that a stop event should also clear the paused state.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onResume-callback" class="dcc-code-sections__label">

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

### onSpeak

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.ttsEngine.onSpeak.addListener(
  callback: function,
)
```

Called when the user makes a call to tts.speak() and one of the voices from this extension's manifest is the first to match the options object.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onSpeak-callback" class="dcc-code-sections__label">

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
  (utterance: string, options: SpeakOptions, sendTtsEvent: function) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onSpeak-callback-utterance" class="dcc-code-sections__label">

    utterance

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

  - <div>

    <div id="type-onSpeak-callback-options" class="dcc-code-sections__label">

    options

    </div>

    <div class="dcc-type--xsmall">

    [SpeakOptions](#type-SpeakOptions)

    </div>

    </div>

  - <div>

    <div id="method-onSpeak-callback-sendTtsEvent" class="dcc-code-sections__label">

    sendTtsEvent

    </div>

    <div class="dcc-type--xsmall">

    function

    </div>

    </div>

    The `sendTtsEvent` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

    <div>

    </div>

    ``` devsite-click-to-copy
    (event: tts.TtsEvent) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-onSpeak-callback-sendTtsEvent-event" class="dcc-code-sections__label">

      event

      </div>

      <div class="dcc-type--xsmall">

      [tts.TtsEvent](https://developer.chrome.com/docs/extensions/reference/tts/#type-TtsEvent)

      </div>

      </div>

      The event from the text-to-speech engine indicating the status of this utterance.

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onSpeakWithAudioStream

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 92+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.ttsEngine.onSpeakWithAudioStream.addListener(
  callback: function,
)
```

Called when the user makes a call to tts.speak() and one of the voices from this extension's manifest is the first to match the options object. Differs from ttsEngine.onSpeak in that Chrome provides audio playback services and handles dispatching tts events.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onSpeakWithAudioStream-callback" class="dcc-code-sections__label">

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
  (utterance: string, options: SpeakOptions, audioStreamOptions: AudioStreamOptions, sendTtsAudio: function, sendError: function) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onSpeakWithAudioStream-callback-utterance" class="dcc-code-sections__label">

    utterance

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

  - <div>

    <div id="type-onSpeakWithAudioStream-callback-options" class="dcc-code-sections__label">

    options

    </div>

    <div class="dcc-type--xsmall">

    [SpeakOptions](#type-SpeakOptions)

    </div>

    </div>

  - <div>

    <div id="type-onSpeakWithAudioStream-callback-audioStreamOptions" class="dcc-code-sections__label">

    audioStreamOptions

    </div>

    <div class="dcc-type--xsmall">

    [AudioStreamOptions](#type-AudioStreamOptions)

    </div>

    </div>

  - <div>

    <div id="method-onSpeakWithAudioStream-callback-sendTtsAudio" class="dcc-code-sections__label">

    sendTtsAudio

    </div>

    <div class="dcc-type--xsmall">

    function

    </div>

    </div>

    The `sendTtsAudio` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

    <div>

    </div>

    ``` devsite-click-to-copy
    (audioBufferParams: AudioBuffer) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-onSpeakWithAudioStream-callback-sendTtsAudio-audioBufferParams" class="dcc-code-sections__label">

      audioBufferParams

      </div>

      <div class="dcc-type--xsmall">

      [AudioBuffer](#type-AudioBuffer)

      </div>

      </div>

      Parameters containing an audio buffer and associated data.

    </div>

  - <div>

    <div id="method-onSpeakWithAudioStream-callback-sendError" class="dcc-code-sections__label">

    sendError

    </div>

    <div class="dcc-type--xsmall">

    function

    </div>

    </div>

    <div class="pad-top-200">

    <div>

    <span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 94+ </span>

    </div>

    </div>

    The `sendError` parameter looks like: <span class="dcc-code-sections__callback dcc-type--xsmall"></span>

    <div>

    </div>

    ``` devsite-click-to-copy
    (errorMessage?: string) => void
    ```

    <div class="dcc-code-sections">

    - <div>

      <div id="type-onSpeakWithAudioStream-callback-sendError-errorMessage" class="dcc-code-sections__label">

      errorMessage

      </div>

      <div class="dcc-type--xsmall">

      string <span class="dcc-code-sections__optional">optional</span>

      </div>

      </div>

      A string describing the error.

    </div>

  </div>

</div>

<div>

<div class="notranslate">

### onStop

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.ttsEngine.onStop.addListener(
  callback: function,
)
```

Fired when a call is made to tts.stop and this extension may be in the middle of speaking. If an extension receives a call to onStop and speech is already stopped, it should do nothing (not raise an error). If speech is in the paused state, this should cancel the paused state.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onStop-callback" class="dcc-code-sections__label">

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

### onUninstallLanguageRequest

</div>

<div>

<div>

<span class="dcc-tag-pill--blue dcc-tag-pill" title="Available from this Chrome version and higher">Chrome 132+ </span>

</div>

</div>

<span class="dcc-code-sections__callback dcc-type--xsmall"> </span>

<div>

</div>

``` devsite-click-to-copy
chrome.ttsEngine.onUninstallLanguageRequest.addListener(
  callback: function,
)
```

Fired when a TTS client indicates a language is no longer needed.

</div>

<div class="dcc-code-sections">

#### Parameters

- <div>

  <div id="method-onUninstallLanguageRequest-callback" class="dcc-code-sections__label">

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
  (requestor: TtsClient, lang: string, uninstallOptions: LanguageUninstallOptions) => void
  ```

  <div class="dcc-code-sections">

  - <div>

    <div id="type-onUninstallLanguageRequest-callback-requestor" class="dcc-code-sections__label">

    requestor

    </div>

    <div class="dcc-type--xsmall">

    [TtsClient](#type-TtsClient)

    </div>

    </div>

  - <div>

    <div id="type-onUninstallLanguageRequest-callback-lang" class="dcc-code-sections__label">

    lang

    </div>

    <div class="dcc-type--xsmall">

    string

    </div>

    </div>

  - <div>

    <div id="type-onUninstallLanguageRequest-callback-uninstallOptions" class="dcc-code-sections__label">

    uninstallOptions

    </div>

    <div class="dcc-type--xsmall">

    [LanguageUninstallOptions](#type-LanguageUninstallOptions)

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