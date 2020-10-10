const {el} = require("@utils/utils");

const {getURL} = chrome.runtime;

const style = el("link", {
  rel: "stylesheet",
  href: getURL("/assets/improve-ui.css"),
});

const init = () => {
  (document.documentElement || document.head).appendChild(style);
};

module.exports = {
  init,
};
