const chrome = require("@utils/chrome");

const subscriptions = {};
const connections = new Set();

const subscribe = (event, handler) => {
  if (!Array.isArray(subscriptions[event])) {
    subscriptions[event] = [];
  }
  subscriptions[event].push(handler);
};

const unsubscribe = (event, handler) => {
  if (!Array.isArray(subscriptions[event])) {
    subscriptions[event] = [];
  }
  
  const handlerPosition = subscriptions[event].indexOf(handler);
  if (handlerPosition !== -1) {
    subscriptions[event].splice(handlerPosition, 1);
  }
};

const dispatch = (event, details, broadcastMessage = true) => {
  if (!Array.isArray(subscriptions[event])) {
    subscriptions[event] = [];
  }
  
  console.debug("Dispatch", event, details);
  subscriptions[event].forEach(handler => handler(details));
  
  if (broadcastMessage) {
    notifyExternal(event, details);
  }
};

const notifyExternal = (event, details) => {
  for (const connection of connections) {
    connection.postMessage({
      event,
      details,
      _isEventEmitter: true,
    });
  }
};

const initConnection = connection => {
  console.debug("Connection established", connection);
  
  connections.add(connection);
  connection.onDisconnect.addListener(() => {
    console.debug("Connection removed", connection);
    connections.delete(connection);
  });
  connection.onMessage.addListener((...args) => {
    const {event, details, _isEventEmitter} = args[0];
    if (_isEventEmitter === true) {
      dispatch(event, details, false);
    }
  });
};

chrome.runtime.onConnect.addListener(initConnection);

const connect = () => {
  const connection = chrome.runtime.connect();
  initConnection(connection);
};

if (chrome.runtime.getBackgroundPage) {
  chrome.runtime.getBackgroundPage(backgroundPage => {
    if (window !== backgroundPage) {
      connect();
    }
  });
} else {
  connect();
}

const generateDispatch = (event, details) => () => dispatch(event, details);

module.exports = {
  subscribe,
  unsubscribe,
  dispatch,
  generateDispatch,
};
