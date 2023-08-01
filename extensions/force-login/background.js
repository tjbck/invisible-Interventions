// Clear cache specifically for Tik Tok
let minutesPerDataClear = 3;

function clearCache() {
    var callback = function () {
        console.log("Browsing data for Tik Tok has been removed");
    };
    
    chrome.browsingData.remove({
        "origins": ["https://www.tiktok.com/"]
    }, {
        "cookies": true
    }, callback);
}

clearCache();
setInterval(clearCache, minutesPerDataClear * 60 * 1000)