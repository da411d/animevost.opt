const { downloads } = require("@utils/chrome");

module.exports = {
  get: (...args) => new Promise(resolve => downloads.search(...args, items => resolve(items.pop()))),
  search: (...args) => new Promise(resolve => downloads.search(...args, resolve)),
  download: (...args) => new Promise(resolve => downloads.download(...args, resolve)),
  // set: (...args) => new Promise(resolve => storageObject.set(...args, resolve)),
  // clear: (...args) => new Promise(resolve => storageObject.clear(...args, resolve)),
  // onChanged: (...args) => chrome.storage.local.onChanged.addListener(...args),
};

