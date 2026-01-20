function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const showCookieBanner = () => {
    // Check both localStorage and cookie for consent
    const localStorageConsent = localStorage.getItem('deepl_cookie_consent');
    const cookieConsent = getCookie('cookie_consent');

    if (localStorageConsent === 'accepted' || cookieConsent === 'true') return;

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
    const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

    acceptBtn.onclick = function () {
        // Set localStorage for Mintlify telemetry integration
        localStorage.setItem('deepl_cookie_consent', 'accepted');
        // Also set cookie for backward compatibility
        document.cookie = 'cookie_consent=true; path=/; max-age=' + ONE_YEAR_SECONDS;
        banner.remove();
        // Reload to enable telemetry
        window.location.reload();
    };

    rejectBtn.onclick = function () {
        // Set localStorage to rejected state
        localStorage.setItem('deepl_cookie_consent', 'rejected');
        // Also set cookie for backward compatibility
        document.cookie = 'cookie_consent=false; path=/; max-age=' + ONE_YEAR_SECONDS;
        banner.remove();
    };
}

// Show banner when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showCookieBanner);
} else {
    showCookieBanner();
}