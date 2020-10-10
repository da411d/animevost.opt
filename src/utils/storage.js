const chrome = require("@utils/chrome");
const storageObject = chrome.storage.local;
module.exports = {
  get: (...args) => new Promise(resolve => storageObject.get(...args, resolve)),
  set: (...args) => new Promise(resolve => storageObject.set(...args, resolve)),
  clear: (...args) => new Promise(resolve => storageObject.clear(...args, resolve)),
  onChanged: (...args) => chrome.storage.local.onChanged.addListener(...args),
};
