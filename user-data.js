const h1 = document.getElementById('page-title');
const apiBaseUrl = 'https://w.deepl.com/web';
const apiParams = 'request_type=jsonrpc&il=en&method=getClientState';

const apiUrl = `${apiBaseUrl}?${apiParams}`;

(async () => {
  const hasApiSubscription = await getApiSubscription();

  if (hasApiSubscription) {
    const cta = document.getElementById('topbar-cta-button');
    const ctaSpans = Array.from(cta.querySelectorAll('span'));
    const ctaButtonSpan = ctaSpans.find(el => el.textContent === 'Create free API account');
    ctaButtonSpan.innerHTML = 'Manage API keys';
    // can also change colors
  }
})();


//TODO: error-handling. Like what if the user isn't logged in, or there is no user?
// Place the request parameters in both the URL and the body, because that's how we do it on deepl.com
// even though we're not sure that's necessary.

async function getApiSubscription() {
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

    return json?.result?.featureSet?.subscription?.api;

  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}