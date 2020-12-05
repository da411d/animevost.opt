const { sleep } = require("@utils/utils");
const eventEmitter = require("@utils/eventEmitter");
const downloads = require("@utils/downloads");
const { apiRequest } = require("./api");

const ajax = async url => await fetch(url, {
  referrer: url,
}).then(response => response.text());

const getVideoSrcset = async (info) => {
  const { episode, animeName, url } = info;
  const { episodeId, episodeTitle } = episode;
  
  // Спочатку пробуєм достучатись по API
  try {
    const videoSources = await apiRequest("videolinks", {
      id: episodeId,
    });
    const { links, hdlinks } = videoSources;
    
    const downloadLinks = [
      ...hdlinks.filter(link => /\.mp4$/.test(link)),
      ...links.filter(link => /\.mp4$/.test(link)),
    ].filter(link => !link.includes("drek.cdn.zerocdn.com"));
    
    if (downloadLinks.length) {
      return downloadLinks;
    }
  } catch (e) {
    console.warn("Unable to obtain episode video source via API\n", e);
  }
  
  // Потом пробуєм спарсити силки з сайта
  try {
    // Посилаєм запит, щоб отримати код iframe плеєра, а звідти його src
    const playerIframeAPIEndpoint = new URL("/frame2.php?play=" + episodeId, url);
    const playerIframeCode = await ajax(playerIframeAPIEndpoint);
    let playerIframeSrc = playerIframeCode.split('src="')[1].split('"')[0];
    playerIframeSrc += (playerIframeSrc.includes("?") ? "&" : "?") + "old=1";
    
    // Посилаєм запит щоб отримати контент iframe плеєра
    const playerIframeContent = await ajax(playerIframeSrc);
    const playerDocument = new DOMParser().parseFromString(playerIframeContent, "text/html").documentElement;
    // Дістаєм звідти всі ссилки на скачування (вони в плеєрі зверху)
    const downloadLinks = [...playerDocument.querySelectorAll("a[download]")]
      .map(a => a.href);
    
    if (downloadLinks.length) {
      return downloadLinks;
    }
  } catch (e) {
    console.warn("Unable to obtain episode video source\n", e);
  }
  
  return [];
};

const observeProgress = async (downloadId, progressNotifier = console.debug) => {
  while (true) {
    await sleep(250);
    const { state, bytesReceived, totalBytes, error } = await downloads.get({
      id: downloadId,
    });
    
    const notifyObject = {
      progress: bytesReceived / totalBytes,
      status: ({
        in_progress: "downloading",
        interrupted: "fail",
        complete: "success",
      })[state] || "fail",
    };
    progressNotifier(notifyObject);
    
    if (state === "interrupted") {
      return !!(error && error.includes("USER_"));
    }
    if (state === "complete") {
      return true;
    }
  }
};

const downloadEpisode = async info => {
  const { episode, animeName, url } = info;
  const { episodeId, episodeTitle } = episode;
  
  const folderName = "anime__" + animeName;
  let fileName = animeName + "__" + episodeTitle;
  fileName = fileName
    .replace(/[\W]/ig, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .concat(".mp4");
  const downloadFileName = folderName + "/" + fileName;
  
  const videoSrcSet = await getVideoSrcset(info);
  const sourcesSortedByHd = [
    ...videoSrcSet.filter(src => src.includes("720/")),
    ...videoSrcSet.filter(src => !src.includes("720/")),
  ];
  
  for (const source of sourcesSortedByHd) {
    const downloadId = await downloads.download({
      url: source,
      filename: downloadFileName,
    });
    const result = await observeProgress(downloadId, ({ progress, status }) => {
      eventEmitter.dispatch("download-update", {
        episode,
        status,
        progress,
      });
    });
    
    if (result === true) {
      return true;
    }
  }
  
  if (!sourcesSortedByHd.length) {
    eventEmitter.dispatch("download-update", {
      episode,
      status: "fail",
      progress: 0,
    });
  }
};

const init = () => {
  eventEmitter.subscribe("download-episode", info => {
    downloadEpisode(info);
  });
};

module.exports = {
  init,
};
