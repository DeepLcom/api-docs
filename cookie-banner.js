function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const showCookieBanner = () => {
    // TODO check if this needs to use the same cookie field as deepl.com
    if (getCookie('cookie_consent') === 'true') return;

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.style.position = 'fixed';
    banner.style.bottom = '0';
    banner.style.left = '0';
    banner.style.width = '100%';
    banner.style.background = '#222';
    banner.style.color = '#fff';
    banner.style.padding = '16px';
    banner.style.display = 'flex';
    banner.style.justifyContent = 'space-between';
    banner.style.alignItems = 'center';
    banner.style.zIndex = '10000';
    banner.innerHTML = `
        <span>DeepL uses cookies to deliver its service. Please find more information in our <a href="https://www.deepl.com/privacy" style="color:#4FC3F7;text-decoration:underline;">privacy policy</a>.</span>
        <button id="cookie-accept" style="background:transparent;color:#fff;padding:8px 16px;border:1px solid #fff;border-radius:4px;cursor:pointer;">Close</button>
    `;

    document.body.appendChild(banner);

    const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

    document.getElementById('cookie-accept').onclick = function () {
        document.cookie = 'cookie_consent=true; path=/; max-age=' + ONE_YEAR_SECONDS;
        banner.remove();
    };
}
showCookieBanner()