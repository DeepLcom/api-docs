/* Encapsulate user-data helpers in a single namespace to avoid polluting
 * the global scope. Other scripts can call DeepLUser helpers.
 */
window.DeepLUser = (() => {
  const API_BASE_URL = 'https://w.deepl.com/web';
  const API_PARAMS = 'request_type=jsonrpc&il=en&method=getClientState';
  const apiUrl = `${API_BASE_URL}?${API_PARAMS}`;

  /* Following the standards of deepl.com, we place the request parameters in both the URL and the body,
   * although this may not be necessary.
   * TODO: Complete error handling, for cases when the user is not logged in, there is no user, etc.
   */

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
    return clientState?.accountId;
  }

  return { getClientState, getApiSubscription, getAccountId };
})();

window.getDeepLClientStateNow = function getDeepLClientStateNow() {
  return window.DeepLUser?.getClientState?.();
};
