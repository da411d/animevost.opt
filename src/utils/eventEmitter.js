const subscriptions = {};

const subscribe = (event, handler) => {
  if(!Array.isArray(subscriptions[event])){
    subscriptions[event] = [];
  }
  subscriptions[event].push(handler);
};

const unsubscribe = (event, handler) => {
  if(!Array.isArray(subscriptions[event])){
    subscriptions[event] = [];
  }
  
  const handlerPosition = subscriptions[event].indexOf(handler);
  if(handlerPosition !== -1){
    subscriptions[event].splice(handlerPosition, 1);
  }
};

const dispatch = (event, details) => {
  if(!Array.isArray(subscriptions[event])){
    subscriptions[event] = [];
  }
  
  console.log("Dispatch", event, details);
  subscriptions[event].forEach(handler => handler(details));
};

const generateDispatch = (event, details) => () => dispatch(event, details);

module.exports = {
  subscribe,
  unsubscribe,
  dispatch,
  generateDispatch,
};
