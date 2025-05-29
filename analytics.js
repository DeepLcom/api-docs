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

const sendPageview = (eventType, url) => {
  console.log(`[${eventType}]: ${url}`); // TODO update 

  sendToDAP(() => ({
    instanceId: "11111111-1111-1111-1111-111111111111", // TODO figure out how to get the instance_id
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
        devicePixelRatio: window.devicePixelRatio
    }
  }))
}

/*
========================
  Navigation Tracking
========================
*/

let lastTrackedUrl = null;

function sendPageviewDeduped(eventType) {
  const currentUrl = window.location.href;
  if (currentUrl === lastTrackedUrl) return; // Skip duplicate
  lastTrackedUrl = currentUrl;

  sendPageview(eventType, currentUrl)
}

const setupNavigationTrackers = () => {
  const _pushState = history.pushState;
  const _replaceState = history.replaceState;

  history.pushState = function (...args) {
    _pushState.apply(this, args);
    sendPageviewDeduped('navigation:pushState');
  };

  history.replaceState = function (...args) {
    _replaceState.apply(this, args);
    sendPageviewDeduped('navigation:replaceState');
  };

  window.addEventListener('popstate', () => {
    sendPageviewDeduped('navigation:popstate');
  });

  window.addEventListener('hashchange', () => {
    sendPageviewDeduped('navigation:hashchange');
  });
}

/*
========================
  On Page Load
========================
*/
const onPageLoad = () => {
  setupNavigationTrackers();
  sendPageviewDeduped('navigation:newPageLoad')
}
onPageLoad()
