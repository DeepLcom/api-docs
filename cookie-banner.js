// Constants
const CONSENT_KEY = 'deepl_cookie_consent';
const CONSENT_ACCEPTED = 'accepted';
const CONSENT_REJECTED = 'rejected';

const showCookieBanner = () => {
    // Check localStorage for consent
    const consent = localStorage.getItem(CONSENT_KEY);

    // Only hide banner if user has explicitly accepted or rejected
    if (consent === CONSENT_ACCEPTED || consent === CONSENT_REJECTED) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';

    banner.innerHTML = `
        <div id="cookie-banner-content">
            <p id="cookie-banner-text">
                We use cookies and similar technologies to improve your experience and analyze site usage.
                By clicking "Accept", you consent to telemetry and analytics.
                Learn more in our <a href="https://www.deepl.com/privacy" target="_blank">privacy policy</a>.
            </p>
        </div>
        <div id="cookie-banner-buttons">
            <button id="cookie-reject">Reject</button>
            <button id="cookie-accept">Accept</button>
        </div>
    `;

    document.body.appendChild(banner);

    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');

    acceptBtn.onclick = function () {
        localStorage.setItem(CONSENT_KEY, CONSENT_ACCEPTED);
        banner.remove();
        // Reload to enable telemetry
        window.location.reload();
    };

    rejectBtn.onclick = function () {
        localStorage.setItem(CONSENT_KEY, CONSENT_REJECTED);
        banner.remove();
    };
}

// Show banner when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showCookieBanner);
} else {
    showCookieBanner();
}