var active = true;

function updateIcon() {
  if (active) {
    chrome.browserAction.setTitle({
      title: 'Näytä vero-uutiset'
    });
    chrome.browserAction.setIcon({
      path: {
        "16": "images/verotiedot_oranssi_16.png",
        "48": "images/verotiedot_oranssi_48.png",
        "128": "images/verotiedot_oranssi.png"
      }
    });
  } else {
    chrome.browserAction.setTitle({
      title: 'Piilota vero-uutiset'
    });
    chrome.browserAction.setIcon({
      path: {
        "16": "images/verotiedot_16.png",
        "48": "images/verotiedot_48.png",
        "128": "images/verotiedot.png"
      }
    });
  }
}

chrome.browserAction.onClicked.addListener(function (tab) {
  active = !active;
  updateIcon();

  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { active });
    }
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.active) {
    sendResponse({ active });
  } else {
    sendResponse({});
  }
});

updateIcon();
