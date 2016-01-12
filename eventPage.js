
var i = 0;

// chrome.tabs.onActivated.addListener(function(activeInfo) {
//   console.log(activeInfo.tabId);
// });

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   console.log(changeInfo);
//   console.log(tab.url);
//   if (changeInfo.status === "complete") {
//     console.log(tabId);
//     console.log(tab.url);
//     //chrome.tabs.query
//     chrome.browserAction.setBadgeText({
//       text: String(i++)
//     });
//   }
// });

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

var switchTab = function(tab) {
  chrome.tabs.update(tab.id, {
    active: true,
    highlighted: true,
    selected: true
  });

  chrome.windows.update(tab.windowId, {
    focused: true
  });
};

var handler = function(details) {
  chrome.tabs.query({
    url: urlWithoutHash(details.url)
  }, function(tabs) {
    var detailsHref = getLocation(details.url);

    tabs = tabs.filter(function (tab) {
      var tabHref = getLocation(tab.url);
      return tab.id !== details.tabId && detailsHref.hash === tabHref.hash
    });
    if (tabs.length) {
      console.log(tabs);

      //switchTab(tabs[0]);
    }

    chrome.browserAction.setBadgeText({
      text: String(tabs.length)
    });
  });
};

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    handler({
      url: tab.url,
      tabId: tab.id
    });
  });
});

chrome.webNavigation.onCompleted.addListener(handler);

chrome.webNavigation.onHistoryStateUpdated.addListener(handler);

chrome.webNavigation.onReferenceFragmentUpdated.addListener(handler);
