// Acesta este un fișier de configurare pentru a redirecționa cererile către API-ul Reddit
// pentru a ocoli problema CORS. Funcționează doar pe GitHub Pages.

(function() {
    const proxyUrls = [
        'https://api.allorigins.win/get?url=',
        'https://corsproxy.io/?'
    ];
    
    let currentProxyIndex = 0;
    
    window.proxyFetch = async function(url) {
        for (let i = 0; i < proxyUrls.length; i++) {
            const index = (currentProxyIndex + i) % proxyUrls.length;
            const proxyUrl = proxyUrls[index] + encodeURIComponent(url);
            try {
                const response = await fetch(proxyUrl);
                if (response.ok) {
                    currentProxyIndex = index;
                    const data = await response.json();
                    // Dacă proxy-ul returnează un obiect cu o proprietate 'contents' (ca la allorigins)
                    if (data.contents) {
                        return JSON.parse(data.contents);
                    }
                    return data;
                }
            } catch (e) {
                console.log(`Proxy ${proxyUrls[index]} failed, trying next...`);
            }
        }
        throw new Error('All proxies failed');
    };
})();