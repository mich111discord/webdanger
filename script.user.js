==UserScript==
// @name         Ineo Security Web Blocker (Tampermonkey)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blokowanie podejrzanych stron na podstawie bazy adresów URL
// @match        *://*/*
// @grant        GM_xmlhttpRequest
const DATA_URLS = [
    "https://hole.cert.pl/domains/v2/domains.txt",
    "https://raw.githubusercontent.com/DevSpen/scam-links/refs/heads/master/src/links.txt",
    "https://raw.githubusercontent.com/mitchellkrogza/The-Big-List-of-Hacked-Malware-Web-Sites/refs/heads/master/.dev-tools/_strip_domains/domains.txt",
    "https://raw.githubusercontent.com/mich111discord/webdanger/refs/heads/main/vir.txt"
];

let maliciousUrls = [];

function fetchMaliciousUrls() {
    DATA_URLS.forEach(url => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                let text = response.responseText;
                let urls = text.split("\n").map(u => u.trim()).filter(u => u.length > 0);
                maliciousUrls = maliciousUrls.concat(urls);
            },
            onerror: function(error) {
                console.error(`Błąd pobierania ${url}:`, error);
            }
        });
    });
}


fetchMaliciousUrls();


setInterval(() => {
    let currentUrl = window.location.href;
    if (maliciousUrls.some(url => currentUrl.includes(url))) {
        alert("Ta strona została zablokowana ze względu na możliwe zagrożenie!");
        window.location.href = "about:blank";
    }
}, 2000);
