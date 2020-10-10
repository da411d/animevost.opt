const ajax = async url => await fetch(url, {
  referrer: url,
}).then(response => response.text());

const downloadEpisode = async (info) => {
  const {id, title, animeName} = info;
  
  try {
    // Посилаєм запит, щоб отримати код iframe плеєра, а звідти його src
    const playerIframeCode = await ajax("/frame2.php?play=" + id);
    let playerIframeSrc = playerIframeCode.split('src="')[1].split('"')[0];
    playerIframeSrc += (playerIframeSrc.includes("?") ? "&" : "?") + "old=1";
    
    // Посилаєм запит щоб отримати контент iframe плеєра
    const playerIframeContent = await ajax(playerIframeSrc);
    const playerDocument = new DOMParser().parseFromString(playerIframeContent, "text/html").documentElement;
    // Дістаєм звідти всі ссилки на скачування (вони в плеєрі зверху)
    const downloadLinks = [...playerDocument.querySelectorAll("a[download]")];
    console.log(downloadLinks);
    
    
    let filename = animeName + "__" + title + ".mp4";
  } catch (e) {
    console.warn(e);
  }
};
