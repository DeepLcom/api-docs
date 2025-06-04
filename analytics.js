/*
========================
  Globals
========================
*/
const STATISTICS_URL = "https://s.deepl.dev/web/statistics" // TODO update to prod table

// TODO update values after DAP proto changes are merged
const EVENT_ID_PAGEVIEW = 1

const EVENT_ID_NETWORK_REQUEST = 0
// const EVENT_ID_NETWORK_REQUEST = ?? 
const PAGE_ID_DEVELOPERS_WEBSITE_DOCUMENTATION = 100
// const PAGE_ID_DEVELOPERS_WEBSITE_DOCUMENTATION = 4001
const PAGE_ID_DEVELOPERS_WEBSITE_API_REFERENCE = 110
// const PAGE_ID_DEVELOPERS_WEBSITE_API_REFERENCE = 4002

/*
========================
  Cookie helper methods
========================
*/
const isProdStage = window.location.hostname === "developers.deepl.com"

const getCookieItem = (cookieName) => {
  if (typeof window === 'undefined') {
    throw new Error('Error occurs when you are going to use a browser-specific code on server-side or other way around. Please check your code logic.')
  }

  const cookies = document.cookie.split('; ') || []
  const cookie = cookies.find(c => c.startsWith(`${cookieName}=`)) || ''
  const value = cookie.split('=').at(1)

  return (
    value
      ? decodeURIComponent(value)
      : value
  )
}

const setCookieItem = (cookieName, cookieValue, expiresInMinutes = 0) => {
  if (typeof window === 'undefined') {
    throw new Error('Error occurs when you are going to use a browser-specific code on server-side or other way around. Please check your code logic.')
  }

  const cookieValueToStore = (
    typeof cookieValue === 'string' || typeof cookieValue === 'number'
      ? cookieValue
      : JSON.stringify(cookieValue)
  )

  let expireString = ''
  if (expiresInMinutes) {
    const date = new Date()
    const expiresInMilliseconds = expiresInMinutes * 60 * 1000 // SECONDS * MILLISECONDS

    date.setTime(date.getTime() + expiresInMilliseconds)
    expireString = `; expires=${date.toUTCString()}`
  }

  const domain = isProdStage ? '.deepl.com' : window.location.hostname
  const domainString = `; domain=${domain}` 
  const secure = '; secure'
  document.cookie = `${cookieName}=${encodeURIComponent(cookieValueToStore)}${domainString}; path=/${expireString}; samesite=lax${secure}`
}

const mkUUID = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  if (!Object.prototype.hasOwnProperty.call(window, 'crypto')) {
    return ''
  }

  if (typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }

  return [1e7, -1e3, -4e3, -8e3, -1e11].join('').replace(/[018]/g, c =>
    (parseInt(c, 10) ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (parseInt(c, 10) / 4)))).toString(16))
}

const DAP_UID_KEY = 'dapUid'
const DAP_SID_KEY = 'dapSid'
const YEAR_IN_MINUTES = 60 * 24 * 30 * 12
const SID_TTL_MINUTES = 30;

const getUid = () => {
  let uid = getCookieItem(DAP_UID_KEY)
  if (uid === undefined) {
    setCookieItem(
      DAP_UID_KEY,
      mkUUID(),
      YEAR_IN_MINUTES
    )
  }
  uid = getCookieItem(DAP_UID_KEY)
  return uid
}


const getSid = () => {
  let sidCookie = getCookieItem(DAP_SID_KEY);

  let sidObj;
  if (sidCookie) {
    try {
      sidObj = JSON.parse(sidCookie);
    } catch {
      sidObj = null;
    }
  }

  const now = Date.now();

  if (sidObj && sidObj.sid && sidObj.lastUpdate) {
    // SID exists already
    // Check if >30 minutes old
    if (now - sidObj.lastUpdate > SID_TTL_MINUTES * 60 * 1000) {
      // Refresh SID
      sidObj = {
        sid: mkUUID(),
        lastUpdate: now
      };
    } else {
      // Keep SID, reset TTL
      sidObj = {
        ...sidObj,
        lastUpdate: now
      };
    }
  } else {
    // No SID, create new
    sidObj = {
      sid: mkUUID(),
      lastUpdate: now
    };
  }

  setCookieItem(DAP_SID_KEY, JSON.stringify(sidObj), SID_TTL_MINUTES);
  return sidObj.sid;
}

/*
========================
  Sending Requests
========================
*/
const baseRequest = async (targetUrl, getPayload) => {
  const payload = getPayload()
  console.log(payload)

  try {
    const response = await fetch(
      targetUrl, 
      {
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        method: "POST",
      })
    const data = await response.json();
    console.log('Fetched data: ', data); // TODO remove
    return data;
  } catch (error) {
    console.error('Fetch error: ', error);
  }
}

const getPageId = () => {
  const pathname = window.location.pathname;
  const secondSlash = pathname.indexOf("/", 1);
  const firstSubpath = secondSlash !== -1 ? pathname.substring(0, secondSlash) : pathname;
  switch (firstSubpath) {
    case "/docs":
      return PAGE_ID_DEVELOPERS_WEBSITE_DOCUMENTATION;
    case "/api-reference":
      return PAGE_ID_DEVELOPERS_WEBSITE_API_REFERENCE;
    default:
      return 0;
  }
}

const requestToDAP = (eventType, extraFields) => {
  console.log(`[${eventType}]: ${JSON.stringify(extraFields)}`); // TODO update 

  baseRequest(
    STATISTICS_URL,
    () => ({
      instanceId: getUid(),
      sessionId: getSid(),
      eventId: EVENT_ID_PAGEVIEW,
      pageId: getPageId(),
      userAgent: navigator.userAgent,
      interfaceLanguage: navigator.language,
      screenInfo: {
        widthCssPixel: window.screen.width,
        heightCssPixel: window.screen.height,
        viewportWidthCssPixel: window.innerWidth,
        viewportHeightCssPixel: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      },
      referrer: document.referrer,
      ...extraFields
  }))
}

const sendPageview = (url) => {
  requestToDAP(EVENT_ID_PAGEVIEW, 
    {
      url: url
    })
}

const sendOutgoingNetworkResponse = (requestUrl, status) => {
  requestToDAP(EVENT_ID_NETWORK_REQUEST,
    {
      url: `${window.location.origin}${window.location.pathname}${window.location.search}`,
      // TODO add the fields below to the table
      outgoing_network_response_url: requestUrl,
      outgoing_network_response_status: status,
    })
}

/*
========================
  Navigation Tracking
========================
*/

let lastTrackedUrl = null;

function sendPageviewDeduped() {
  const currentUrl = window.location.href;
  if (currentUrl === lastTrackedUrl) return; // Skip duplicate
  lastTrackedUrl = currentUrl;

  sendPageview(currentUrl)
}

const setupNavigationTrackers = () => {
  const _pushState = history.pushState;
  const _replaceState = history.replaceState;

  history.pushState = function (...args) {
    _pushState.apply(this, args);
    sendPageviewDeduped();
  };

  history.replaceState = function (...args) {
    _replaceState.apply(this, args);
    sendPageviewDeduped();
  };

  window.addEventListener('popstate', () => {
    sendPageviewDeduped();
  });

  window.addEventListener('hashchange', () => {
    sendPageviewDeduped();
  });
}

/*
========================
  Network Request Tracking
========================
*/
const setupNetworkRequestTracking = () => {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this._recordedUrl = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(body) {
    // Note: we cannot log the request or response body because of sensitive info

    const originalOnReadyStateChange = this.onreadystatechange;
    this.onreadystatechange = function() {
      if (this.readyState === 4) { // DONE
        // TODO Remove this._recordedUrl because it might be PII to store query params
        // Because the user could be making custom requests using the inspect console
        sendOutgoingNetworkResponse("network:outgoingNetworkResponse", this._recordedUrl, this.status)
      }
      if (originalOnReadyStateChange) {
        originalOnReadyStateChange.apply(this, arguments);
      }
    };


    return originalSend.apply(this, arguments);
  };
}

/*
========================
  On Page Load
========================
*/
const onPageLoad = () => {
  setupNavigationTrackers();
  setupNetworkRequestTracking();

  sendPageviewDeduped()
}
onPageLoad()
