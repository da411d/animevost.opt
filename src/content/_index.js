const isHostAnimevost = require("./isHostAnimevost");

const improveUI = require("./improveUI");
const downloader = require("./downloader");

const host = window.location.host;
if(isHostAnimevost(host)){
  improveUI.init();
  downloader.init();
}
