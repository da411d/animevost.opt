const chrome = require("@utils/chrome");

const init = () => {
  chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.create({
      url: "https://animevost.org/",
    });
  });
};

module.exports = {
  init,
};
