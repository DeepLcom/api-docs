class AnalyticsTracker {
  // ========================
  //   Globals & Constants
  // ========================
  static globalState = {
    isSearchListenerAdded: false,
  };

  static API_ENDPOINTS = {
    PRO: "api.deepl.com",
    FREE: "api-free.deepl.com"
  }

  static PAGE_ID_DEVELOPERS_WEBSITE_DOCUMENTATION = 4001;
  static PAGE_ID_DEVELOPERS_WEBSITE_API_REFERENCE = 4002;

  static EVENT_ID_PAGEVIEW = 1;
  static EVENT_ID_NETWORK_REQUEST = 5000;
  static EVENT_ID_SEARCH_INPUT = 5001; // TODO change this after DAP update

  static isProdStage = window.location.hostname === "developers.deepl.com";
  static statisticsUrl = this.isProdStage ? 
    "https://s.deepl.com/web/statistics"
    : "https://s.deepl.dev/web/statistics"

  // ========================
  //   Cookie Helper Inner Class
  // ========================
  static CookieHelper = class {
    static DAP_UID_KEY = 'dapUid';
    static DAP_SID_KEY = 'dapSid';
    
    static YEAR_IN_MINUTES = 60 * 24 * 30 * 12;
    static SID_TTL_MINUTES = 30;

    static getCookieItem(cookieName) {
      if (typeof window === 'undefined') {
        throw new Error('Error occurs when you are going to use a browser-specific code on server-side or other way around. Please check your code logic.');
      }
      const cookies = document.cookie.split('; ') || [];
      const cookie = cookies.find(c => c.startsWith(`${cookieName}=`)) || '';
      const value = cookie.split('=').at(1);
      return value ? decodeURIComponent(value) : value;
    }

    static setCookieItem(cookieName, cookieValue, expiresInMinutes = 0) {
      if (typeof window === 'undefined') {
        throw new Error('Error occurs when you are going to use a browser-specific code on server-side or other way around. Please check your code logic.');
      }
      const cookieValueToStore = (
        typeof cookieValue === 'string' || typeof cookieValue === 'number'
          ? cookieValue
          : JSON.stringify(cookieValue)
      );
      let expireString = '';
      if (expiresInMinutes) {
        const date = new Date();
        const expiresInMilliseconds = expiresInMinutes * 60 * 1000;
        date.setTime(date.getTime() + expiresInMilliseconds);
        expireString = `; expires=${date.toUTCString()}`;
      }
      const domain = AnalyticsTracker.isProdStage ? '.deepl.com' : window.location.hostname;
      const domainString = `; domain=${domain}`;
      const secure = '; secure';
      document.cookie = `${cookieName}=${encodeURIComponent(cookieValueToStore)}${domainString}; path=/${expireString}; samesite=lax${secure}`;
    }

    static mkUUID() {
      if (typeof window === 'undefined') {
        return '';
      }
      if (!Object.prototype.hasOwnProperty.call(window, 'crypto')) {
        return '';
      }
      if (typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
      }
      return [1e7, -1e3, -4e3, -8e3, -1e11].join('').replace(/[018]/g, c =>
        (parseInt(c, 10) ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (parseInt(c, 10) / 4)))).toString(16));
    }

    static getUid() {
      let uid = this.getCookieItem(this.DAP_UID_KEY);
      if (uid === undefined) {
        this.setCookieItem(
          this.DAP_UID_KEY,
          this.mkUUID(),
          this.YEAR_IN_MINUTES
        );
      }
      uid = this.getCookieItem(this.DAP_UID_KEY);
      return uid;
    }

    static getSid() {
      let sidCookie = this.getCookieItem(this.DAP_SID_KEY);
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
        if (now - sidObj.lastUpdate > this.SID_TTL_MINUTES * 60 * 1000) {
          sidObj = {
            sid: this.mkUUID(),
            lastUpdate: now
          };
        } else {
          sidObj = {
            ...sidObj,
            lastUpdate: now
          };
        }
      } else {
        // SID does not exist
        sidObj = {
          sid: this.mkUUID(),
          lastUpdate: now
        };
      }
      this.setCookieItem(this.DAP_SID_KEY, JSON.stringify(sidObj), this.SID_TTL_MINUTES);
      return sidObj.sid;
    }
  };

  // ========================
  //   Request Helper Inner Class
  // ========================
  static RequestHelper = class {
    static async baseRequest(url, getPayload) {
      const payload = getPayload();
      try {
        const response = await fetch(
          url,
          {
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(payload),
            method: "POST",
          }
        );
        const data = await response.json();
        // console.log('Fetched data: ', data);
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
        case "/docs":
          return AnalyticsTracker.PAGE_ID_DEVELOPERS_WEBSITE_DOCUMENTATION;
        case "/api-reference":
          return AnalyticsTracker.PAGE_ID_DEVELOPERS_WEBSITE_API_REFERENCE;
        default:
          return 0;
      }
    }

    static requestToDAP(eventId, extraFields) {
      // console.log(`[${eventId}]: ${JSON.stringify(extraFields)}`); 
      
      this.baseRequest(
        AnalyticsTracker.statisticsUrl,
        () => ({
          instanceId: AnalyticsTracker.CookieHelper.getUid(),
          sessionId: AnalyticsTracker.CookieHelper.getSid(),
          eventId: eventId,
          pageId: this.getPageId(),
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
  };

  // ========================
  //   Track Page Navigation Inner Class
  // ========================
  static PageNavigationTracker = class {
    static navigationState = {
      lastTrackedUrl: null
    }

    static sendPageview() {
      AnalyticsTracker.RequestHelper.requestToDAP(
        AnalyticsTracker.EVENT_ID_PAGEVIEW, 
        {
          pageviewData: {
            referrer: document.referrer,
            pageVariant: 0,
          }
        }
      );
    }

    static sendPageviewDeduped() {
      const currentUrl = window.location.href;
      if (currentUrl === this.navigationState.lastTrackedUrl) return; // Skip duplicate
      this.navigationState.lastTrackedUrl = currentUrl;
      this.sendPageview(); 
    }

    static setupNavigationTrackers() {
      const _pushState = history.pushState;
      const _replaceState = history.replaceState;

      history.pushState = function (...args) {
        _pushState.apply(this, args);
        AnalyticsTracker.PageNavigationTracker.sendPageviewDeduped();
      };

      history.replaceState = function (...args) {
        _replaceState.apply(this, args);
        AnalyticsTracker.PageNavigationTracker.sendPageviewDeduped();
      };

      window.addEventListener('popstate', () => {
        AnalyticsTracker.PageNavigationTracker.sendPageviewDeduped();
      });

      window.addEventListener('hashchange', () => {
        AnalyticsTracker.PageNavigationTracker.sendPageviewDeduped();
      });

      this.sendPageviewDeduped();
    }
  };

  // ========================
  //   Network Request Tracking Inner Class
  // ========================
  static NetworkRequestTracker = class {
    static sendOutgoingNetworkResponse(statusCode, apiUrl) {
      AnalyticsTracker.RequestHelper.requestToDAP(
        AnalyticsTracker.EVENT_ID_NETWORK_REQUEST, 
        {
          developersWebsiteNetworkData: {
            statusCode,
            apiUrl 
          }
        }
      );
    }

    static setupNetworkRequestTracking() {
      const originalOpen = XMLHttpRequest.prototype.open;
      const originalSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = function(method, url) {
        const xhr = this;
        xhr._recordedUrl = url;
        return originalOpen.apply(xhr, arguments);
      };

      XMLHttpRequest.prototype.send = function(body) {
        // Note: we cannot log the url, request body, or response body because of sensitive info
        const xhr = this;
        const originalOnReadyStateChange = xhr.onreadystatechange;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) { // DONE
            
            const urlObj = new URL(xhr._recordedUrl)
            if (
              urlObj.hostname === AnalyticsTracker.API_ENDPOINTS.PRO ||
              urlObj.hostname === AnalyticsTracker.API_ENDPOINTS.FREE
            ) {
              // Prune out any custom query params which could be input data
              const prunedUrl = `${urlObj.origin}${urlObj.pathname}`

              AnalyticsTracker.NetworkRequestTracker.sendOutgoingNetworkResponse(
                xhr.status,
                prunedUrl
              );
            }
            else {
              // do nothing for other requests
            }
          }
          if (originalOnReadyStateChange) {
            originalOnReadyStateChange.apply(xhr, arguments);
          }
        };
        return originalSend.apply(xhr, arguments);
      };
    }
  };

  // ========================
  //   Search Input Tracking Inner Class
  // ========================
  static SearchInputTracker = class {
    static InputClassification = {
      Partial: 'Partial',
      Submitted: 'Submitted', // Not implemented yet
      AiAssistant: 'AiAssistant'
    };

    static filteredHostnames = ['leaves.mintlify.com'];

    static sendSearchInput(searchInputText, classification) {
      AnalyticsTracker.RequestHelper.requestToDAP(
        AnalyticsTracker.EVENT_ID_SEARCH_INPUT, 
        {
          searchInputText,
          classification
        }
      );
    }

    static addSearchInputListener() {
      const searchInput = document.getElementById('search-input');
      if (!AnalyticsTracker.globalState.isSearchListenerAdded && searchInput) {
        searchInput.addEventListener('input', (event) => {
          const inputText = event.target.value;
          this.sendSearchInput(inputText, this.InputClassification.Partial);
        });
        AnalyticsTracker.globalState.isSearchListenerAdded = true;
      }
    }

    static removeSearchInputListener() {
      const searchInput = document.getElementById('search-input');
      if (AnalyticsTracker.globalState.isSearchListenerAdded && !searchInput) {
        AnalyticsTracker.globalState.isSearchListenerAdded = false;
      }
    }

    static setupSearchInputTracking() {
      // As the user is typing
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            this.addSearchInputListener();
          }
          if (mutation.removedNodes.length) {
            this.removeSearchInputListener();
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
      this.addSearchInputListener();

      // When a user submits to the AI Assistant
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        try {
          const url = typeof args[0] === 'string' ? args[0] : args[0].url;
          const requestHostname = new URL(url).hostname;
          if (this.filteredHostnames.includes(requestHostname)) {
            this.sendSearchInput(args[1].body, this.InputClassification.AiAssistant);
          }
          return originalFetch(...args);;
        } catch (error) {
          return originalFetch(...args);
        }
      };
    }
  };

  // ========================
  //   Consent Checker
  // ========================
  static hasConsent() {
    // Check localStorage for consent
    const localStorageConsent = localStorage.getItem('deepl_cookie_consent');
    if (localStorageConsent === 'accepted') {
      return true;
    }

    // Also check cookie for backward compatibility
    const cookies = document.cookie.split('; ');
    const consentCookie = cookies.find(c => c.startsWith('cookie_consent='));
    if (consentCookie && consentCookie.split('=')[1] === 'true') {
      return true;
    }

    return false;
  }

  // ========================
  //   Initialization
  // ========================
  static init() {
    // Only initialize analytics if user has consented
    if (!this.hasConsent()) {
      console.log('[Analytics] User has not consented to tracking. Analytics disabled.');
      return;
    }

    console.log('[Analytics] User consent verified. Initializing analytics...');
    this.PageNavigationTracker.setupNavigationTrackers();
    this.NetworkRequestTracker.setupNetworkRequestTracking();
    // this.SearchInputTracker.setupSearchInputTracking(); // Disable this for now
  }
}

// Initialize on page load
AnalyticsTracker.init();
