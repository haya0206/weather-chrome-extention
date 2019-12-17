// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

chrome.runtime.onInstalled.addListener(function() {
  // chrome.storage.sync.set({ number: 1 }, function() {
  //   console.log("The number is set to 1.");
  // });
  chrome.alarms.create("timeout", { when: Date.now() + 60000 * 60 });
});

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      error => {
        reject(error);
      }
    );
  });
}
async function updateIcon() {
  try {
    const position = await getPosition();

    const response = await fetch(
      `https://4kjkoqxvfj.execute-api.ap-northeast-2.amazonaws.com/production/weather?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
    );
    const body = await response.json();
    console.log(body);
    chrome.browserAction.setIcon({ path: body.currently.icon + ".png" });
  } catch (e) {
    console.log(e);
  }
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  updateIcon();
  chrome.alarms.create("timeout", { when: Date.now() + 60000 * 60 });
});

updateIcon();
