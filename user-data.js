const h1 = document.getElementById('page-title');
const apiBaseUrl = 'https://w.deepl.com/web'; //TODO: change this when we're in prod
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

async function getApiSubscription() {
  try {
    const response = await fetch(apiUrl,
      {
        method: "POST",
        body: {"id":17980001,"jsonrpc":"2.0","method":"getClientState","params":{"v":"20180814","clientVars":{}}}
      }
    );
    const json = await response.json();
    
    return json?.result?.featureSet?.subscription?.api;

  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}