const isHostAnimevost = require("./isHostAnimevost");

const improveUI = require("./improveUI");

const host = window.location.host;
if(isHostAnimevost(host)){
  improveUI.init();
}
