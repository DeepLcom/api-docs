/*
========================
  Globals
========================
*/
class AnalyticsTracker {
  static PAGE_ID_DEVELOPERS_WEBSITE_DOCUMENTATION = 4001;
  static PAGE_ID_DEVELOPERS_WEBSITE_API_REFERENCE = 4002;
  static EVENT_ID_PAGEVIEW = 1;
  static EVENT_ID_NETWORK_REQUEST = 5000;
  static EVENT_ID_SEARCH_INPUT = 5001; // TODO change this after DAP update
  static DAP_UID_KEY = 'dapUid';
  static DAP_SID_KEY = 'dapSid';
  static YEAR_IN_MINUTES = 60 * 24 * 30 * 12;
  static SID_TTL_MINUTES = 30;
  static isProdStage = window.location.hostname === "developers.deepl.com";

  static GLOBAL_STATE = {
    isSearchListenerAdded: false,
  };

  // Cookie management
  static CookieHelper = class {
    static getItem(cookieName) {
      if (typeof window === 'undefined') throw new Error('Browser-specific code on server-side.');
      const cookies = document.cookie.split('; ') || [];
      const cookie = cookies.find(c => c.startsWith(`${cookieName}=`)) || '';
      const value = cookie.split('=').at(1);
      return value ? decodeURIComponent(value) : value;
    }
    static setItem(cookieName, cookieValue, expiresInMinutes = 0) {
      if (typeof window === 'undefined') throw new Error('Browser-specific code on server-side.');
      const cookieValueToStore = (typeof cookieValue === 'string' || typeof cookieValue === 'number') ? cookieValue : JSON.stringify(cookieValue);
      let expireString = '';
      if (expiresInMinutes) {
        const date = new Date();
        date.setTime(date.getTime() + expiresInMinutes * 60 * 1000);
        expireString = `; expires=${date.toUTCString()}`;
      }
      const domain = AnalyticsTracker.isProdStage ? '.deepl.com' : window.location.hostname;
      const domainString = `; domain=${domain}`;
      const secure = '; secure';
      document.cookie = `${cookieName}=${encodeURIComponent(cookieValueToStore)}${domainString}; path=/${expireString}; samesite=lax${secure}`;
    }
  }

  // UUID helper
  static mkUUID() {
    if (typeof window === 'undefined') return '';
    if (!Object.prototype.hasOwnProperty.call(window, 'crypto')) return '';
    if (typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return [1e7, -1e3, -4e3, -8e3, -1e11].join('').replace(/[018]/g, c =>
      (parseInt(c, 10) ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (parseInt(c, 10) / 4)))).toString(16));
  }

  // Session management
  static getUid() {
    let uid = AnalyticsTracker.CookieHelper.getItem(AnalyticsTracker.DAP_UID_KEY);
    if (uid === undefined) {
      AnalyticsTracker.CookieHelper.setItem(
        AnalyticsTracker.DAP_UID_KEY,
        AnalyticsTracker.mkUUID(),
        AnalyticsTracker.YEAR_IN_MINUTES
      );
    }
    uid = AnalyticsTracker.CookieHelper.getItem(AnalyticsTracker.DAP_UID_KEY);
    return uid;
  }
  static getSid() {
    let sidCookie = AnalyticsTracker.CookieHelper.getItem(AnalyticsTracker.DAP_SID_KEY);
    let sidObj;
    if (sidCookie) {
      try { sidObj = JSON.parse(sidCookie); } catch { sidObj = null; }
    }
    const now = Date.now();
    if (sidObj && sidObj.sid && sidObj.lastUpdate) {
      if (now - sidObj.lastUpdate > AnalyticsTracker.SID_TTL_MINUTES * 60 * 1000) {
        sidObj = { sid: AnalyticsTracker.mkUUID(), lastUpdate: now };
      } else {
        sidObj = { ...sidObj, lastUpdate: now };
      }
    } else {
      sidObj = { sid: AnalyticsTracker.mkUUID(), lastUpdate: now };
    }
    AnalyticsTracker.CookieHelper.setItem(AnalyticsTracker.DAP_SID_KEY, JSON.stringify(sidObj), AnalyticsTracker.SID_TTL_MINUTES);
    return sidObj.sid;
  }

  // Request helpers
  static getStatisticsUrl() {
    return AnalyticsTracker.isProdStage ? "https://s.deepl.com/web/statistics" : "https://s.deepl.dev/web/statistics";
  }
  static async baseRequest(targetUrl, getPayload) {
    const payload = getPayload();
    try {
      const response = await fetch(targetUrl, {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        method: "POST",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error: ', error);
    }
  }
  static getPageId() {
    const pathname = window.location.pathname;
    const secondSlash = pathname.indexOf("/", 1);
    const firstSubpath = secondSlash !== -1 ? pathname.substring(0, secondSlash) : pathname;
    switch (firstSubpath) {
      case "/docs": return AnalyticsTracker.PAGE_ID_DEVELOPERS_WEBSITE_DOCUMENTATION;
      case "/api-reference": return AnalyticsTracker.PAGE_ID_DEVELOPERS_WEBSITE_API_REFERENCE;
      default: return 0;
    }
  }
  static requestToDAP(eventId, extraFields) {
    AnalyticsTracker.baseRequest(
      AnalyticsTracker.getStatisticsUrl(),
      () => ({
        instanceId: AnalyticsTracker.getUid(),
        sessionId: AnalyticsTracker.getSid(),
        eventId: eventId,
        pageId: AnalyticsTracker.getPageId(),
        userAgent: navigator.userAgent,
        interfaceLanguage: navigator.language,
        screenInfo: {
          widthCssPixel: window.screen.width,
          heightCssPixel: window.screen.height,
          viewportWidthCssPixel: window.innerWidth,
          viewportHeightCssPixel: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio
        },
        url: `${window.location.origin}${window.location.pathname}${window.location.search}`,
        ...extraFields
      })
    );
  }
  static sendPageview() {
    AnalyticsTracker.requestToDAP(AnalyticsTracker.EVENT_ID_PAGEVIEW, {
      pageviewData: {
        referrer: document.referrer,
        pageVariant: 0,
      }
    });
  }
  static sendOutgoingNetworkResponse(status) {
    AnalyticsTracker.requestToDAP(AnalyticsTracker.EVENT_ID_NETWORK_REQUEST, {
      developersWebsiteNetworkData: { statusCode: status }
    });
  }
  static sendSearchInput(text) {
    AnalyticsTracker.requestToDAP(AnalyticsTracker.EVENT_ID_SEARCH_INPUT, {
      searchInputText: text // TODO change this after DAP update
    });
  }

  // Page navigation tracking
  static PageNavigation = class {
    static lastTrackedUrl = null;
    static sendPageviewDeduped() {
      const currentUrl = window.location.href;
      if (currentUrl === AnalyticsTracker.PageNavigation.lastTrackedUrl) return;
      AnalyticsTracker.PageNavigation.lastTrackedUrl = currentUrl;
      AnalyticsTracker.sendPageview();
    }
    static setup() {
      const _pushState = history.pushState;
      const _replaceState = history.replaceState;
      history.pushState = function (...args) {
        _pushState.apply(this, args);
        AnalyticsTracker.PageNavigation.sendPageviewDeduped();
      };
      history.replaceState = function (...args) {
        _replaceState.apply(this, args);
        AnalyticsTracker.PageNavigation.sendPageviewDeduped();
      };
      window.addEventListener('popstate', () => {
        AnalyticsTracker.PageNavigation.sendPageviewDeduped();
      });
      window.addEventListener('hashchange', () => {
        AnalyticsTracker.PageNavigation.sendPageviewDeduped();
      });
    }
  }

  // Network request tracking
  static NetworkRequests = class {
    static setup() {
      const originalOpen = XMLHttpRequest.prototype.open;
      const originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(method, url) {
        this._recordedUrl = url;
        return originalOpen.apply(this, arguments);
      };
      XMLHttpRequest.prototype.send = function(body) {
        const originalOnReadyStateChange = this.onreadystatechange;
        this.onreadystatechange = function() {
          if (this.readyState === 4) {
            AnalyticsTracker.sendOutgoingNetworkResponse(this.status);
          }
          if (originalOnReadyStateChange) {
            originalOnReadyStateChange.apply(this, arguments);
          }
        };
        return originalSend.apply(this, arguments);
      };
    }
  }

  // Search input tracking
  static SearchInput = class {
    static addListener() {
      const searchInput = document.getElementById('search-input');
      if (!AnalyticsTracker.GLOBAL_STATE.isSearchListenerAdded && searchInput) {
        searchInput.addEventListener('input', function(event) {
          const inputText = event.target.value;
          AnalyticsTracker.sendSearchInput(inputText);
        });
        AnalyticsTracker.GLOBAL_STATE.isSearchListenerAdded = true;
      }
    }
    static observeDOM() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            AnalyticsTracker.SearchInput.addListener();
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  // On page load
  static onPageLoad() {
    AnalyticsTracker.PageNavigation.setup();
    AnalyticsTracker.NetworkRequests.setup();
    AnalyticsTracker.SearchInput.addListener();
    AnalyticsTracker.SearchInput.observeDOM();
    AnalyticsTracker.PageNavigation.sendPageviewDeduped();
  }
}

// Initialize analytics tracking
AnalyticsTracker.onPageLoad()
