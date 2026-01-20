const showCookieBanner = () => {
    // Check localStorage for consent
    const consent = localStorage.getItem('deepl_cookie_consent');

    // Only hide banner if user has explicitly accepted or rejected
    if (consent === 'accepted' || consent === 'rejected') return;

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
        localStorage.setItem('deepl_cookie_consent', 'accepted');
        banner.remove();
        // Reload to enable telemetry
        window.location.reload();
    };

    rejectBtn.onclick = function () {
        localStorage.setItem('deepl_cookie_consent', 'rejected');
        banner.remove();
    };
}

// Show banner when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showCookieBanner);
} else {
    showCookieBanner();
}