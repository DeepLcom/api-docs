/* Expose the minimal client-state helpers needed by the docs popup. */
window.DeepLUser = (() => {
  const API_BASE_URL = 'https://w.deepl.com/web';
  const API_PARAMS = 'request_type=jsonrpc&il=en&method=getClientState';
  const apiUrl = `${API_BASE_URL}?${API_PARAMS}`;

  async function getClientState() {
    try {
      const response = await fetch(
        apiUrl,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "getClientState"
          }),
          credentials: 'include'
        }
      );
      const json = await response.json();

      return json?.result;

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async function getApiSubscription() {
    const clientState = await getClientState();
    return clientState?.featureSet?.subscription?.api;
  }

  async function getAccountId() {
    const clientState = await getClientState();
    return clientState?.loginState?.accountId;
  }

  return { getClientState, getAccountId };
})();

window.getDeepLClientStateNow = function getDeepLClientStateNow() {
  return window.DeepLUser?.getClientState?.();
};
