const {el, sleep, qq, qqq} = require("@utils/utils");
const eventEmitter = require("@utils/eventEmitter");
const {getURL} = chrome.runtime;

const popup = require("./downloader-popup");

const getAnimeName = () => {
  const matches = location.pathname.match(/([0-9,]+-)([a-z0-9\-]+)\.html/);
  if (matches && matches[2]) {
    return matches[2];
  }
  return "anime";
};

const createEpisodesList = () => {
  return qqq("#items > div")
    .map(el => ({
      episodeId: el.getAttribute("onclick").match(/ajax2\(([0-9]+),/)[1],
      episodeTitle: el.innerText.trim(),
    }));
};

const renderLinks = () => {
  const animeName = getAnimeName();
  const episodes = createEpisodesList();
  
  for (const episode of episodes) {
    const {episodeId, episodeTitle} = episode;
    const eventDetails = {
      animeName,
      episode,
      url: location.href,
    };
    const link = el("a", {
      className: "download-popup__episode",
      innerText: episodeTitle,
      href: "#!",
      id: "episode-" + episodeId,
      on: {
        click: () => {
          link.classList.add("download-popup__episode__not-clickable");
          eventEmitter.dispatch("download-episode", eventDetails);
        },
      },
    });
    popup.container.appendChild(link);
  }
  
  if (!episodes.length) {
    popup.container.appendChild(el("p", {
      innerText: "Нет доступных для загрузки епизодов",
      style: "text-align: center; opacity: 0.5;",
    }));
  }
};

const updateDownloadStatus = (info) => {
  const {episode, status, progress} = info;
  const {episodeId, episodeTitle} = episode;
  
  const downloadLinkId = "episode-" + episodeId;
  const downloadLink = qq("#" + downloadLinkId);
  if (downloadLink) {
    switch (status) {
      case "downloading":
        const progressText = progress > 0.01 ? Math.round(progress * 100) + "%" : "Загрузка...";
        downloadLink.dataset.after = progressText + " ⌛";
        downloadLink.classList.add("download-popup__episode__not-clickable");
        downloadLink.classList.remove("download-popup__episode__success", "download-popup__episode__fail");
        break;
      
      case "success":
        downloadLink.dataset.after = "Загрузка завершена ✅";
        downloadLink.classList.add("download-popup__episode__success");
        downloadLink.classList.remove("download-popup__episode__not-clickable");
        break;
      
      case "fail":
        downloadLink.dataset.after = "Загрузка не удалась ❌";
        downloadLink.classList.add("download-popup__episode__fail");
        downloadLink.classList.remove("download-popup__episode__not-clickable");
        break;
    }
  }
};
window._eventEmitter = eventEmitter;
eventEmitter.subscribe("download-update", updateDownloadStatus);

const init = () => {
  popup.init();
  renderLinks();
  
  eventEmitter.subscribe("support-developer", () => window.open("https://daki.me/sayThanks/"));
  eventEmitter.subscribe("download-all", () => {
    const links = popup.container.qqq("a");
    if (links.length <= 2 || confirm("Начать загрузку?")) {
      links.forEach(link => link.click());
    }
  });
  
  // Кнопка "скачати" (відкриває попап для скачування")
  if (qq(".shortstoryHead h1")) {
    const downloadButton = el("a", {
      href: "#!",
      className: "download-button",
      innerText: "СКАЧАТЬ",
      on: {
        click: eventEmitter.generateDispatch("open-popup"),
      }
    });
    qq(".shortstoryHead h1").appendChild(downloadButton);
  }
  
  const style = el("link", {
    rel: "stylesheet",
    href: getURL("/assets/downloader.css"),
  });
  (document.documentElement || document.head).appendChild(style);
};

module.exports = {
  init: async () => {
    while (document.readyState !== "complete") {
      await sleep(100);
    }
    init();
  },
};
