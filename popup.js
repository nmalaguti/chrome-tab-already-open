// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var getLocation = function(href) {
  var l = document.createElement("a");
  l.href = href;
  return l;
};

var urlWithoutHash = function(url) {
  var loc = url.indexOf("#");
  if (loc < 0) {
    return url;
  }
  return url.slice(0, loc);
};

var getCurrentTab = function(callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    callback(tabs[0]);
  });
};

var findOtherTabs = function(currTab, callback) {
  chrome.tabs.query({
    url: urlWithoutHash(currTab.url)
  }, function(tabs) {
    var currTabHref = getLocation(currTab.url);

    tabs = tabs.filter(function (tab) {
      var tabHref = getLocation(tab.url);
      return tab.id !== currTab.id && currTabHref.hash === tabHref.hash
    });

    callback(tabs);
  });
};


var removeTab = function(tabId) {
  chrome.tabs.remove(tabId, render);
};

var switchTab = function(tabId, windowId) {
  chrome.tabs.update(tabId, {
    active: true,
    highlighted: true,
    selected: true
  });

  chrome.windows.update(windowId, {
    focused: true
  });
};

var render = function() {
  getCurrentTab(function(currTab) {
    findOtherTabs(currTab, function (tabs) {
      console.log(tabs);
      var container = document.getElementById('status');
      Array.prototype.slice.call(container.childNodes).forEach(function(child) {
        console.log(child);
        container.removeChild(child);
      });

      var div = document.createElement('div');
      var text = document.createTextNode("self: " + currTab.id);
      div.appendChild(text);
      container.appendChild(div);

      tabs.forEach(function(tab) {
        var div = document.createElement('div');
        //var text = document.createTextNode(tab.id + " " + tab.url);
        var text = document.createTextNode(tab.id);


        var switchLink = document.createElement('a');
        switchLink.href = "#";
        switchLink.addEventListener('click', function () {
          switchTab(tab.id, tab.windowId);
        });

        var switchText = document.createTextNode("switch");

        switchLink.appendChild(switchText);

        var removeLink = document.createElement('a');
        removeLink.href = "#";
        removeLink.addEventListener('click', function () {
          removeTab(tab.id);
        });

        var removeText = document.createTextNode("remove");

        removeLink.appendChild(removeText);

        div.appendChild(text);
        div.appendChild(document.createTextNode(" "))
        div.appendChild(switchLink);
        div.appendChild(document.createTextNode(" "))
        div.appendChild(removeLink);
        container.appendChild(div);
      });
    });
  });
};

document.addEventListener('DOMContentLoaded', render);
