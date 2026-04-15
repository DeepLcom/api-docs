/* Encapsulate user-data helpers in a single namespace to avoid polluting
 * the global scope. Other scripts can call DeepLUser helpers.
 */
window.DeepLUser = (() => {
  const API_BASE_URL = 'https://w.deepl.com/web';
  const API_PARAMS = 'request_type=jsonrpc&il=en&method=getClientState';
  const apiUrl = `${API_BASE_URL}?${API_PARAMS}`;
  const ACCOUNT_ID_KEYS = ['accountId', 'accountID', 'account_id'];

  function findValueByKeys(value, keys) {
    if (!value || typeof value !== 'object') return undefined;

    for (const key of keys) {
      if (value[key] !== undefined && value[key] !== null) {
        return value[key];
      }
    }

    for (const nestedValue of Object.values(value)) {
      const match = findValueByKeys(nestedValue, keys);
      if (match !== undefined) return match;
    }

    return undefined;
  }

  function extractAccountId(clientState) {
    if (!clientState) return undefined;

    return (
      findValueByKeys(clientState, ACCOUNT_ID_KEYS)
      || clientState.account?.id
      || clientState.subscription?.account?.id
    );
  }

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
    return extractAccountId(clientState);
  }

  return { getClientState, getApiSubscription, getAccountId };
})();
