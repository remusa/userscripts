// ==UserScript==
// @name        !youtube.com - Add channel name to tab title
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch*
// @grant       none
// @version     1.0
// @author      -
// @description 4/29/2024, 2:47:02 AM
// ==/UserScript==

function onReady() {
  const channel = document.querySelector('div.ytd-channel-name > #text > a')
  if (!channel) {
    return
  }
  console.log('channel: ', channel)
  const title = `${document.title.replace('- YouTube', '')} [${channel.textContent}] - YouTube`
  console.log('title: ', title)
  document.title = title
}

// https://stackoverflow.com/questions/39993676/code-inside-domcontentloaded-event-not-working
if (document.readyState !== "loading") {
  //onReady()
  setTimeout(onReady, 5_000);
} else {
  document.addEventListener("DOMContentLoaded", onReady)
}
