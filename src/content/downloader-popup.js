const {el} = require("@utils/utils");
const _l = require("@utils/i18n");
const eventEmitter = require("@utils/eventEmitter");

const popup = el("div", {
  className: "download-popup download-popup__hidden",
});

// ЗАТЕМНЕННЯ
const backdrop = el("div", {
  className: "download-popup__backdrop",
  on: {
    click: eventEmitter.generateDispatch("close-popup"),
  }
});
popup.appendChild(backdrop);

// ШАПКА
const header = el("div", {
    className: "download-popup__header",
  },
  el("h1", {
    className: "download-popup__h1",
    innerText: _l("download_popup__title"),
  }),
  el("button", {
    className: "download-popup__close",
    innerText: "⨉",
    on: {
      click: eventEmitter.generateDispatch("close-popup"),
    }
  }));
popup.appendChild(header);

// КОНТЕНТ
const container = el("div", {
  className: "download-popup__container",
});
popup.appendChild(container);

// ФУТЕР
const footer = el("div", {
    className: "download-popup__footer",
  },
  el("button", {
    className: "download-popup__button",
    innerText: _l("download_popup__download_all"),
    on: {
      click: eventEmitter.generateDispatch("download-all"),
    },
  }),
  el("button", {
    className: "download-popup__button",
    innerText: _l("download_popup__support_developer"),
    on: {
      click: eventEmitter.generateDispatch("support-developer"),
    },
  }),
  el("button", {
    className: "download-popup__button",
    innerText: _l("download_popup__support_animevost"),
    on: {
      click: eventEmitter.generateDispatch("support-animevost"),
    },
  }));
popup.appendChild(footer);

const show = () => popup.classList.remove("download-popup__hidden");
const hide = () => popup.classList.add("download-popup__hidden");
eventEmitter.subscribe("open-popup", show);
eventEmitter.subscribe("close-popup", hide);


const popupObject = {
  header,
  container,
  footer,
  
  init: () => {
    popup.style.display = "none";
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.style.display = "";
    }, 1000);
  },
};

module.exports = popupObject;
