console.log("log from the dap.js file")

// Helper method to generate a UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper to set a cookie with optional expiry date
const setCookie = (name, value, expiryDays = null) => {
  let cookieString = `${name}=${encodeURIComponent(value)};path=/`;
  
  if (expiryDays !== null) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    cookieString += `;expires=${expiryDate.toUTCString()}`;
  }
  
  document.cookie = cookieString;
};

// Helper to get a cookie value by name
const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
};

// Helper to get and store instance ID (persists across sessions)
const getInstanceId = () => {
  let instanceId = getCookie('analytics_instance_id');
  if (!instanceId) {
    instanceId = generateUUID();
    // Set instance ID with a long expiration (365 days)
    setCookie('analytics_instance_id', instanceId, 365);
  }
  return instanceId;
};

// Set session TTL to 30 minutes (in milliseconds)
const SESSION_TTL = 30 * 60 * 1000;

// Helper to get and store session ID with a 30-minute TTL
const getSessionId = () => {
  const now = Date.now();
  let sessionData;
  
  try {
    const sessionCookie = getCookie('analytics_session_data');
    sessionData = sessionCookie ? JSON.parse(sessionCookie) : null;
  } catch (e) {
    sessionData = null;
  }
  
  // Create new session if none exists, or if the existing one has expired
  if (!sessionData || now - sessionData.lastActivity > SESSION_TTL) {
    sessionData = {
      id: generateUUID(),
      lastActivity: now
    };
  } else {
    // Update the last activity timestamp
    sessionData.lastActivity = now;
  }
  
  // Save the updated session data with a 30-minute expiration
  // Convert 30 minutes to days for the cookie expiration (30min = 0.0208333 days)
  setCookie('analytics_session_data', JSON.stringify(sessionData), 0.0208333);
  
  return sessionData.id;
};

// Helper to get screen information
const getScreenInfo = () => {
  return {
    widthCssPixel: window.screen.width,
    heightCssPixel: window.screen.height,
    viewportWidthCssPixel: window.innerWidth,
    viewportHeightCssPixel: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1
  };
};

// Creates the request body for analytics
const createAnalyticsPayload = (eventId, pageId) => {
  // Every time we create a payload, refresh the session's TTL by getting the session ID
  return {
    instanceId: getInstanceId(),
    sessionId: getSessionId(),
    eventId: eventId || 290,
    pageId: pageId || 110,
    url: window.location.href,
    userAgent: navigator.userAgent,
    screenInfo: getScreenInfo(),
    browserLanguage: navigator.language || 'en-US'
  };
};

// Function to refresh the session activity timestamp (can be called on user activity)
const refreshSessionActivity = () => {
  const sessionCookie = getCookie('analytics_session_data');
  let sessionData;
  
  try {
    sessionData = sessionCookie ? JSON.parse(sessionCookie) : null;
    if (sessionData) {
      sessionData.lastActivity = Date.now();
      // Update the session cookie with refreshed timestamp
      setCookie('analytics_session_data', JSON.stringify(sessionData), 0.0208333);
    }
  } catch (e) {
    // If there's an error parsing the cookie, create a new session on next getSessionId call
    console.error('Error refreshing session activity:', e);
  }
};

const fetchData = async (eventId, pageId) => {
  // Refresh session activity when sending analytics data
  refreshSessionActivity();
  
  try {
    const response = await fetch("https://s.deepl.dev/web/statistics", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify(createAnalyticsPayload(eventId, pageId)),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
      });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

// Set up activity listeners to refresh the session TTL
const setupActivityListeners = () => {
  const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
  
  events.forEach(event => {
    window.addEventListener(event, refreshSessionActivity, { passive: true });
  });
  
  // Also refresh on page visibility change (user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      refreshSessionActivity();
    }
  });
};

// Initialize activity listeners when the script loads
if (typeof window !== 'undefined') {
  setupActivityListeners();
}

// Example of usage
// fetchData(300, 120); // With custom event and page IDs
// fetchData(); // Using default event and page IDs
