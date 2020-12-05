// Розширюєм стандартні методи елементів
EventTarget.prototype.on = EventTarget.prototype.addEventListener;
EventTarget.prototype.off = EventTarget.prototype.removeEventListener;

HTMLDocument.prototype.qq = HTMLDocument.prototype.querySelector;
HTMLDocument.prototype.qqq = function (selector) {
  return Array.from(this.querySelectorAll(selector));
};
HTMLElement.prototype.qq = HTMLElement.prototype.querySelector;
HTMLElement.prototype.qqq = function (selector) {
  return Array.from(this.querySelectorAll(selector));
};
const qq = HTMLElement.prototype.qq.bind(document.documentElement);
const qqq = HTMLElement.prototype.qqq.bind(document.documentElement);

// Utils
const minmax = (number, min, max) => Math.max(min, Math.min(max, number));


const mergeDeep = (target, source) => {
  if (target['@@merged']) {
    return target;
  }
  
  const isObject = item => (item && typeof item === 'object' && !Array.isArray(item));
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  target['@@merged'] = true;
  
  return target;
};

const el = (tag, props = {}, ...children) => {
  const el = document.createElement(tag);
  const events = props.on || {};
  
  // добавляєм пропси
  const elWithProps = mergeDeep(el, props);
  // добавляєм чайлдів
  children.forEach(child => elWithProps.appendChild(child));
  // добавляєм евенти
  for (const eventName in events) {
    const callback = events[eventName].bind(elWithProps);
    elWithProps.addEventListener(eventName, callback);
  }
  
  return elWithProps;
};

const cancelEvent = event => {
  event = event || window.event;
  if (event) {
    event = event.originalEvent || event;
    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
    event.returnValue = false;
    event.cancelBubble = true;
  }
  return false
};

const rand = (mi, ma) => {
  return Math.floor(Math.random() * (ma - mi + 1) + mi);
};

const uuid = () => {
  const n = () => Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
  return n() + n() + "-" + n() + "-" + n() + "-" + n() + "-" + n() + n() + n()
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const prob = percent => {
  return rand(1, 100) <= percent;
}

const _GET = (parameterName) => {
  let result = null, tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(item => {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
};

const getObjectProperty = (object, path, defaultValue) => {
  let temp = object;
  
  path.split(".").forEach(part => {
    if (typeof temp === "undefined") {
      return;
    }
    try {
      temp = temp[part];
    } catch (e) {
      temp = undefined;
    }
  });
  
  if (typeof temp === "undefined") {
    return defaultValue;
  }
  
  return temp;
};

const debounce = (f, ms) => {
  let isCooldown = false;
  return function () {
    if (isCooldown) return;
    f.apply(this, arguments);
    isCooldown = true;
    setTimeout(() => isCooldown = false, ms);
  };
};

module.exports = {
  qq,
  qqq,
  
  el,
  cancelEvent,
  rand,
  uuid,
  sleep,
  prob,
  _GET,
  getObjectProperty,
  debounce,
};
