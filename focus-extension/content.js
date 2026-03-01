// This content script runs on the Web App domain (localhost in this case)

// Listen for custom events dispatched by the React app
window.addEventListener('focus-session-start', (e) => {
    const mediaData = e.detail.mediaData;
    chrome.runtime.sendMessage({
        type: 'FOCUS_START',
        mediaData: mediaData
    });
});

window.addEventListener('focus-session-end', () => {
    chrome.runtime.sendMessage({
        type: 'FOCUS_END'
    });
});
