const STATISTICS_URL = "https://s.deepl.dev/web/statistics"

const sendToDAP = async (getPayload) => {
  try {
    const response = await fetch(
      STATISTICS_URL, 
      {
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(getPayload()),
        method: "POST",
      })
    const data = await response.json();
    console.log('Fetched data: ', data); // TODO remove
    return data;
  } catch (error) {
    console.error('Fetch error: ', error);
  }
}

const onPageLoad = () => {
  sendToDAP(() => ({
    instanceId: "6fdc5445-27a8-43f6-afbe-d74133d46a78", // TODO figure out how to get the instance_id
    sessionId: "00000000-0000-0000-0000-000000000000", // TODO remove when new table is created
    eventId: 290, // TODO update 
    pageId: 110, // TODO update
    url: window.location.href,
    userAgent: navigator.userAgent,
    interfaceLanguage: navigator.language,
    screenInfo: {
        widthCssPixel: window.screen.width,
        heightCssPixel: window.screen.height,
        viewportWidthCssPixel: window.innerWidth,
        viewportHeightCssPixel: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1
    }
  }))
}

onPageLoad()